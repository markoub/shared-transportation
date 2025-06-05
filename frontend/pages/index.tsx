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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-lg text-gray-600 mt-4 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Head>
        <title>Shared Transportation - Load Sharing Platform</title>
        <meta name="description" content="Connect load owners with drivers for unusual transport needs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation Header */}
      <header className="backdrop-blur-sm bg-white/80 border-b border-gray-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                SharedTrans
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{user.name[0].toUpperCase()}</span>
                    </div>
                    <span className="text-gray-700 font-medium">Welcome, {user.name}</span>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      user.user_type === 'load_owner' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.user_type === 'load_owner' ? 'Load Owner' : 'Driver'}
                    </span>
                  </div>
                  <button
                    onClick={goToDashboard}
                    className="btn-primary"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                      Login
                    </button>
                  </Link>
                  <Link href="/auth/register">
                    <button className="btn-primary">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                Shared
              </span>
              <br />
              <span className="text-gray-900">Transportation</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect people who need to transport unusual or heavy loads with truck and van owners. 
              Safe, reliable, and efficient load sharing for everyone.
            </p>
            
            {user ? (
              <div className="max-w-2xl mx-auto bg-white/60 backdrop-blur-sm p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Welcome back!</h2>
                <p className="text-gray-600 mb-6">
                  You're logged in as a {user.user_type === 'load_owner' ? 'Load Owner' : 'Driver'}. 
                  Ready to get started?
                </p>
                <button
                  onClick={goToDashboard}
                  className={`px-8 py-3 rounded-lg text-white font-medium transition-colors ${
                    user.user_type === 'load_owner'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register?type=load_owner">
                  <button className="btn-primary text-lg px-8 py-4 animate-slide-up">
                    I need transport
                  </button>
                </Link>
                <Link href="/auth/register?type=driver">
                  <button className="btn-success text-lg px-8 py-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    I'm a driver
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to connect load owners with experienced drivers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Load Owners Card */}
            <div className="card card-hover p-8 animate-slide-up">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-600">For Load Owners</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <p className="text-gray-600">Post your transport request with details about size, weight, and destination</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <p className="text-gray-600">Review applications from qualified drivers in your area</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                  <p className="text-gray-600">Choose your driver and coordinate the pickup and delivery</p>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/auth/register?type=load_owner">
                  <button className="btn-primary w-full">
                    Start as Load Owner
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Drivers Card */}
            <div className="card card-hover p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-600">For Drivers</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-sm font-bold">1</span>
                  </div>
                  <p className="text-gray-600">Browse available transport jobs that match your vehicle type</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-sm font-bold">2</span>
                  </div>
                  <p className="text-gray-600">Apply for jobs with competitive rates and flexible schedules</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-sm font-bold">3</span>
                  </div>
                  <p className="text-gray-600">Get paid securely after successful delivery completion</p>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/auth/register?type=driver">
                  <button className="btn-success w-full">
                    Start as Driver
                  </button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/auth/login">
              <button className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors duration-200">
                Already have an account? Sign in →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
                </svg>
              </div>
              <span className="text-xl font-bold">SharedTrans</span>
            </div>
            <p className="text-gray-400 text-center md:text-right">
              © 2024 Shared Transportation. Connecting communities through smart logistics.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 