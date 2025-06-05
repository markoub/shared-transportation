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
  license_info?: string;
  service_area?: string;
  vehicle_info?: {
    type: string;
    capacity: number;
    dimensions: string;
  };
  created_at: string;
}

export default function DriverDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is a driver
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.user_type !== 'driver') {
      router.push('/dashboard/load-owner');
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
        <title>Driver Dashboard - Shared Transportation</title>
        <meta name="description" content="Driver Dashboard" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-600">
                Shared Transportation
              </Link>
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Driver
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
              {user.license_info && (
                <div>
                  <span className="text-sm font-medium text-gray-500">License:</span>
                  <p className="text-gray-900">{user.license_info}</p>
                </div>
              )}
              {user.service_area && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Service Area:</span>
                  <p className="text-gray-900">{user.service_area}</p>
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

          {/* Vehicle Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h2>
            {user.vehicle_info ? (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Type:</span>
                  <p className="text-gray-900">{user.vehicle_info.type}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Capacity:</span>
                  <p className="text-gray-900">{user.vehicle_info.capacity} kg</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Dimensions:</span>
                  <p className="text-gray-900">{user.vehicle_info.dimensions} cm</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No vehicle information available</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 text-left">
                <div className="font-medium">Browse Loads</div>
                <div className="text-sm text-green-100">Find available transport requests</div>
              </button>
              <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded hover:bg-gray-200 text-left">
                <div className="font-medium">My Jobs</div>
                <div className="text-sm text-gray-500">View claimed and completed loads</div>
              </button>
              <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded hover:bg-gray-200 text-left">
                <div className="font-medium">Messages</div>
                <div className="text-sm text-gray-500">Communicate with load owners</div>
              </button>
            </div>
          </div>
        </div>

        {/* Driver Dashboard Stats */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Driver Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border-l-4 border-green-500 pl-4">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-500">Active Jobs</div>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-500">Completed Deliveries</div>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-sm text-gray-500">Pending Claims</div>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <div className="text-2xl font-bold text-purple-600">$0</div>
              <div className="text-sm text-gray-500">Total Earnings</div>
            </div>
          </div>
        </div>

        {/* Available Loads */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Available Loads</h2>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">🚛</div>
              <p>No loads available in your area</p>
              <p className="text-sm mt-1">Check back later for new transport opportunities</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 