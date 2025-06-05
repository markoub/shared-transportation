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

export default function LoadOwnerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
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
    setIsLoading(false);
  }, [router]);

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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
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
              <div>
                <span className="text-sm font-medium text-gray-500">Member since:</span>
                <p className="text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 text-left">
                <div className="font-medium">Post New Load</div>
                <div className="text-sm text-blue-100">Create a new transport request</div>
              </button>
              <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded hover:bg-gray-200 text-left">
                <div className="font-medium">View My Loads</div>
                <div className="text-sm text-gray-500">Manage your posted loads</div>
              </button>
              <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded hover:bg-gray-200 text-left">
                <div className="font-medium">Messages</div>
                <div className="text-sm text-gray-500">Communicate with drivers</div>
              </button>
            </div>
          </div>

          {/* Load Owner Dashboard */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Load Owner Dashboard</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-500">Active Loads</div>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-500">Completed Deliveries</div>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <div className="text-2xl font-bold text-yellow-600">0</div>
                <div className="text-sm text-gray-500">Pending Approvals</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">📦</div>
              <p>No loads posted yet</p>
              <p className="text-sm mt-1">Start by posting your first transport request</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 