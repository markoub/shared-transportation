import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // For now, we'll use basic authentication check
    const userType = localStorage.getItem('userType');
    const userName = localStorage.getItem('userName');
    
    if (userType !== 'load_owner') {
      router.push('/');
      return;
    }

    setUser({ name: userName || 'Load Owner', user_type: 'load_owner' });
    fetchUserLoads();
  }, [router]);

  const fetchUserLoads = async () => {
    try {
      // For now, fetch all loads since authentication is simplified
      const response = await fetch('http://localhost:8000/api/loads/');
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
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    router.push('/');
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
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Shared Transportation</h1>
              <span className="ml-4 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                Load Owner
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
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

        {/* Recent Loads */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Recent Loads</h3>
          </div>
          
          <div className="p-6">
            {loads.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No loads posted yet.</p>
                <Link href="/loads/create">
                  <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                    Post Your First Load
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {loads.map((load) => (
                  <div key={load.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{load.title}</h4>
                        <p className="text-gray-600 mt-1">{load.description.slice(0, 100)}...</p>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>📍 {load.pickup_location}</span>
                          <span>🎯 {load.delivery_location}</span>
                          {load.weight && <span>⚖️ {load.weight} kg</span>}
                          {load.pickup_date && (
                            <span>📅 {new Date(load.pickup_date).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-end">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          load.status === 'posted' 
                            ? 'bg-green-100 text-green-800'
                            : load.status === 'claimed'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {load.status.charAt(0).toUpperCase() + load.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          {new Date(load.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h4 className="text-sm font-medium text-gray-600">Total Loads</h4>
            <p className="text-2xl font-bold text-gray-900">{loads.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h4 className="text-sm font-medium text-gray-600">Active Loads</h4>
            <p className="text-2xl font-bold text-green-600">
              {loads.filter(load => load.status === 'posted').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h4 className="text-sm font-medium text-gray-600">In Progress</h4>
            <p className="text-2xl font-bold text-yellow-600">
              {loads.filter(load => ['claimed', 'accepted', 'in_transit'].includes(load.status)).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h4 className="text-sm font-medium text-gray-600">Completed</h4>
            <p className="text-2xl font-bold text-blue-600">
              {loads.filter(load => load.status === 'delivered').length}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 