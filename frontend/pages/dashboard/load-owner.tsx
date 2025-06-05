import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  user_type: string;
  location?: string;
  created_at: string;
}

interface Load {
  id: number;
  title: string;
  description: string;
  pickup_location: string;
  delivery_location: string;
  status: string;
  weight?: number;
  dimensions?: string;
  pickup_date?: string;
  special_requirements?: string;
  created_at: string;
}

export default function LoadOwnerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is a load owner
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.user_type !== 'load_owner') {
      router.push('/dashboard/driver');
      return;
    }

    setUser(parsedUser);
    fetchUserLoads();
  }, [router]);

  const fetchUserLoads = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('http://localhost:8000/api/loads/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setLoads(data);
      }
    } catch (error) {
      console.error('Error fetching loads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Load Owner Dashboard - Shared Transportation</title>
        <meta name="description" content="Load Owner Dashboard" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Shared Transportation
              </Link>
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Load Owner
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Load Owner Dashboard</h2>
          <p className="text-gray-600 mt-2">Manage your transportation requests</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/loads/create">
            <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 cursor-pointer transition-colors">
              <h3 className="text-xl font-semibold mb-2">Post New Load</h3>
              <p className="text-blue-100">Create a new transportation request</p>
            </div>
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">View My Loads</h3>
            <p className="text-gray-600">See all your posted loads</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{loads.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Messages</h3>
            <p className="text-gray-600">Communication with drivers</p>
            <p className="text-2xl font-bold text-green-600 mt-2">0</p>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Name:</span>
                <p className="text-gray-900">{user.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Phone:</span>
                <p className="text-gray-900">{user.phone}</p>
              </div>
              {user.location && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Location:</span>
                  <p className="text-gray-900">{user.location}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Your Recent Loads</h3>
              </div>
              
              <div className="p-6">
                {loads.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't posted any loads yet.</p>
                    <Link href="/loads/create">
                      <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                        Post Your First Load
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {loads.slice(0, 5).map((load) => (
                      <div key={load.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{load.title}</h4>
                            <p className="text-gray-600 text-sm mt-1">{load.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>📍 {load.pickup_location} → {load.delivery_location}</span>
                              {load.weight && <span>⚖️ {load.weight}kg</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              load.status === 'open' ? 'bg-green-100 text-green-800' :
                              load.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {load.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {loads.length > 5 && (
                      <div className="text-center pt-4">
                        <Link href="/loads">
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            View All Loads ({loads.length})
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 