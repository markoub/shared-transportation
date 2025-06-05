import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

interface BaseForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface LoadOwnerForm extends BaseForm {
  location: string;
}

interface DriverForm extends BaseForm {
  licenseInfo: string;
  serviceArea: string;
  vehicleType: string;
  vehicleCapacity: string;
  vehicleDimensions: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function Register() {
  const router = useRouter();
  const { type } = router.query;
  const [userType, setUserType] = useState<'load_owner' | 'driver'>('load_owner');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const [loadOwnerForm, setLoadOwnerForm] = useState<LoadOwnerForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: ''
  });

  const [driverForm, setDriverForm] = useState<DriverForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    licenseInfo: '',
    serviceArea: '',
    vehicleType: '',
    vehicleCapacity: '',
    vehicleDimensions: ''
  });

  useEffect(() => {
    if (type === 'load_owner' || type === 'driver') {
      setUserType(type);
    }
  }, [type]);

  const currentForm = userType === 'load_owner' ? loadOwnerForm : driverForm;
  const setCurrentForm = userType === 'load_owner' ? setLoadOwnerForm : setDriverForm;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const form = currentForm;

    // Common validations
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // User type specific validations
    if (userType === 'load_owner') {
      if (!(form as LoadOwnerForm).location.trim()) {
        newErrors.location = 'Location is required';
      }
    } else {
      const driverForm = form as DriverForm;
      if (!driverForm.licenseInfo.trim()) newErrors.licenseInfo = 'License information is required';
      if (!driverForm.serviceArea.trim()) newErrors.serviceArea = 'Service area is required';
      if (!driverForm.vehicleType.trim()) newErrors.vehicleType = 'Vehicle type is required';
      if (!driverForm.vehicleCapacity.trim()) newErrors.vehicleCapacity = 'Vehicle capacity is required';
      if (!driverForm.vehicleDimensions.trim()) newErrors.vehicleDimensions = 'Vehicle dimensions are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const form = currentForm;
      const registrationData: any = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        user_type: userType
      };

      if (userType === 'load_owner') {
        registrationData.location = (form as LoadOwnerForm).location;
      } else {
        const driverForm = form as DriverForm;
        registrationData.license_info = driverForm.licenseInfo;
        registrationData.service_area = driverForm.serviceArea;
        registrationData.vehicle_info = {
          type: driverForm.vehicleType,
          capacity: parseInt(driverForm.vehicleCapacity),
          dimensions: driverForm.vehicleDimensions
        };
      }

      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.detail.includes('Email already registered')) {
          setErrors({ email: 'Email already registered' });
        } else {
          setErrors({ general: data.detail || 'Registration failed' });
        }
        return;
      }

      // Store token and user info
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccessMessage('Registration successful! Redirecting to dashboard...');
      
      // Redirect based on user type
      setTimeout(() => {
        if (userType === 'load_owner') {
          router.push('/dashboard/load-owner');
        } else {
          router.push('/dashboard/driver');
        }
      }, 2000);
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>{`Register as ${userType === 'load_owner' ? 'Load Owner' : 'Driver'} - Shared Transportation`}</title>
        <meta name="description" content="Create your Shared Transportation account" />
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* User Type Selector */}
          <div className="mb-6">
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setUserType('load_owner')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-l-md border ${
                  userType === 'load_owner'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Load Owner
              </button>
              <button
                type="button"
                onClick={() => setUserType('driver')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-r-md border-t border-r border-b ${
                  userType === 'driver'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Driver
              </button>
            </div>
          </div>

          {successMessage && (
            <div className="mb-4 rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{successMessage}</div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{errors.general}</div>
              </div>
            )}

            {/* Common Fields */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={currentForm.name}
                onChange={handleInputChange}
                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={currentForm.email}
                onChange={handleInputChange}
                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={currentForm.phone}
                onChange={handleInputChange}
                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="+1-555-0123"
              />
              {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* User Type Specific Fields */}
            {userType === 'load_owner' ? (
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={(currentForm as LoadOwnerForm).location}
                  onChange={handleInputChange}
                  className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="City, State"
                />
                {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location}</p>}
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="licenseInfo" className="block text-sm font-medium text-gray-700">
                    License Information
                  </label>
                  <input
                    id="licenseInfo"
                    name="licenseInfo"
                    type="text"
                    required
                    value={(currentForm as DriverForm).licenseInfo}
                    onChange={handleInputChange}
                    className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.licenseInfo ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="CDL-A WA123456"
                  />
                  {errors.licenseInfo && <p className="mt-2 text-sm text-red-600">{errors.licenseInfo}</p>}
                </div>

                <div>
                  <label htmlFor="serviceArea" className="block text-sm font-medium text-gray-700">
                    Service Area
                  </label>
                  <input
                    id="serviceArea"
                    name="serviceArea"
                    type="text"
                    required
                    value={(currentForm as DriverForm).serviceArea}
                    onChange={handleInputChange}
                    className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.serviceArea ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Seattle Metro Area"
                  />
                  {errors.serviceArea && <p className="mt-2 text-sm text-red-600">{errors.serviceArea}</p>}
                </div>

                <div>
                  <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                    Vehicle Type
                  </label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    required
                    value={(currentForm as DriverForm).vehicleType}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.vehicleType ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select vehicle type</option>
                    <option value="Pickup Truck">Pickup Truck</option>
                    <option value="Box Truck">Box Truck</option>
                    <option value="Van">Van</option>
                    <option value="Semi Truck">Semi Truck</option>
                    <option value="Flatbed">Flatbed</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.vehicleType && <p className="mt-2 text-sm text-red-600">{errors.vehicleType}</p>}
                </div>

                <div>
                  <label htmlFor="vehicleCapacity" className="block text-sm font-medium text-gray-700">
                    Vehicle Capacity (kg)
                  </label>
                  <input
                    id="vehicleCapacity"
                    name="vehicleCapacity"
                    type="number"
                    required
                    value={(currentForm as DriverForm).vehicleCapacity}
                    onChange={handleInputChange}
                    className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.vehicleCapacity ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="1000"
                  />
                  {errors.vehicleCapacity && <p className="mt-2 text-sm text-red-600">{errors.vehicleCapacity}</p>}
                </div>

                <div>
                  <label htmlFor="vehicleDimensions" className="block text-sm font-medium text-gray-700">
                    Vehicle Dimensions (L×W×H cm)
                  </label>
                  <input
                    id="vehicleDimensions"
                    name="vehicleDimensions"
                    type="text"
                    required
                    value={(currentForm as DriverForm).vehicleDimensions}
                    onChange={handleInputChange}
                    className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.vehicleDimensions ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="200x150x100"
                  />
                  {errors.vehicleDimensions && <p className="mt-2 text-sm text-red-600">{errors.vehicleDimensions}</p>}
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={currentForm.password}
                onChange={handleInputChange}
                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Minimum 8 characters"
              />
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={currentForm.confirmPassword}
                onChange={handleInputChange}
                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  userType === 'load_owner' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Creating account...' : `Create ${userType === 'load_owner' ? 'Load Owner' : 'Driver'} Account`}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                ← Back to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 