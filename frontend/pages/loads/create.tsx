import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface FormData {
  title: string;
  description: string;
  pickupLocation: string;
  deliveryLocation: string;
  weight: string;
  dimensions: string;
  pickupDate: string;
  specialRequirements: string;
  images: File[];
}

interface FormErrors {
  title?: string;
  description?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  weight?: string;
  pickupDate?: string;
  general?: string;
}

export default function CreateLoad() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    pickupLocation: '',
    deliveryLocation: '',
    weight: '',
    dimensions: '',
    pickupDate: '',
    specialRequirements: '',
    images: []
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Check authentication and user type on component mount
  useEffect(() => {
    const userType = localStorage.getItem('userType');
    
    if (!userType) {
      router.push('/auth/login');
      return;
    }
    
    if (userType !== 'load_owner') {
      setErrors({ general: 'Access denied. Only load owners can post loads.' });
      return;
    }
  }, [router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required';
    }

    if (!formData.deliveryLocation.trim()) {
      newErrors.deliveryLocation = 'Delivery location is required';
    }

    // Weight validation
    if (formData.weight && parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Weight must be positive';
    }

    // Date validation
    if (formData.pickupDate) {
      const selectedDate = new Date(formData.pickupDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.pickupDate = 'Pickup date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: files }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // For simplified demo, we'll simulate the API call
      // In a real implementation, this would call the backend API
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      setSuccessMessage('Load posted successfully!');
      setTimeout(() => {
        router.push('/dashboard/load-owner');
      }, 2000);
      
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Post a New Load</h1>
          
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {errors.general && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Load Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Moving a vintage piano across town"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Provide detailed information about what needs to be transported..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Pickup Location */}
            <div>
              <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Location *
              </label>
              <input
                type="text"
                id="pickupLocation"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.pickupLocation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 123 Main St, Seattle, WA"
              />
              {errors.pickupLocation && <p className="mt-1 text-sm text-red-600">{errors.pickupLocation}</p>}
            </div>

            {/* Delivery Location */}
            <div>
              <label htmlFor="deliveryLocation" className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Location *
              </label>
              <input
                type="text"
                id="deliveryLocation"
                name="deliveryLocation"
                value={formData.deliveryLocation}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.deliveryLocation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 456 Oak Ave, Bellevue, WA"
              />
              {errors.deliveryLocation && <p className="mt-1 text-sm text-red-600">{errors.deliveryLocation}</p>}
            </div>

            {/* Weight and Dimensions Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.weight ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 300"
                />
                {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
              </div>

              <div>
                <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions (L×W×H)
                </label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 150x140x100 cm"
                />
              </div>
            </div>

            {/* Pickup Date */}
            <div>
              <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Pickup Date
              </label>
              <input
                type="date"
                id="pickupDate"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.pickupDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.pickupDate && <p className="mt-1 text-sm text-red-600">{errors.pickupDate}</p>}
            </div>

            {/* Special Requirements */}
            <div>
              <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                Special Requirements
              </label>
              <textarea
                id="specialRequirements"
                name="specialRequirements"
                rows={3}
                value={formData.specialRequirements}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Fragile, requires piano moving equipment, loading dock access needed..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                Images (Optional)
              </label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Upload photos of the items to be transported (optional)
              </p>
              {formData.images.length > 0 && (
                <p className="mt-1 text-sm text-green-600">
                  {formData.images.length} image(s) selected
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard/load-owner')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Posting...' : 'Post Load'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 