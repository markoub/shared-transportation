import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface User {
  id: number;
  name: string;
  email: string;
  user_type: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const goToDashboard = () => {
    if (user?.user_type === 'load_owner') {
      router.push('/dashboard/load-owner');
    } else {
      router.push('/dashboard/driver');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Shared Transportation - Load Sharing Platform</title>
        <meta name="description" content="Connect load owners with drivers for unusual transport needs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header for logged in users */}
      {user && (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">Shared Transportation</h1>
                <span className={`ml-4 px-3 py-1 text-sm rounded-full ${
                  user.user_type === 'load_owner' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.user_type === 'load_owner' ? 'Load Owner' : 'Driver'}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.name}</span>
                <button
                  onClick={goToDashboard}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          {!user && (
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Shared Transportation
            </h1>
          )}
          <p className="text-xl text-gray-600 mb-8">
            Connect people who need to transport unusual or heavy loads with truck/van owners
          </p>
          
          {user ? (
            // Logged in user view
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Welcome back!</h2>
              <p className="text-gray-600 mb-6">
                You're logged in as a {user.user_type === 'load_owner' ? 'Load Owner' : 'Driver'}. 
                Ready to get started?
              </p>
              <button
                onClick={goToDashboard}
                className={`px-8 py-3 rounded-lg text-white font-medium ${
                  user.user_type === 'load_owner'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            // Non-logged in user view
            <>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-600">Load Owners</h2>
                  <p className="text-gray-600 mb-4">
                    Need something transported? Post your load request and connect with qualified drivers.
                  </p>
                  <Link href="/auth/register?type=load_owner" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                    Get Started as Load Owner
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4 text-green-600">Drivers</h2>
                  <p className="text-gray-600 mb-4">
                    Have a truck or van? Find interesting transport jobs in your area.
                  </p>
                  <Link href="/auth/register?type=driver" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                    Get Started as Driver
                  </Link>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/auth/login" className="text-blue-500 hover:text-blue-700">
                  Already have an account? Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
} 