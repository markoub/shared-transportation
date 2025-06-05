import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  Truck, 
  Package, 
  CheckCircle, 
  Users, 
  ArrowRight, 
  Star,
  Shield,
  Clock,
  MapPin,
  Menu,
  X
} from 'lucide-react'

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <Head>
        <title>SharedTrans - Smart Load Sharing Platform</title>
        <meta name="description" content="Connect load owners with professional drivers for secure, efficient transportation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  SharedTrans
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Smart Logistics</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white">
                        {user.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium">Welcome, {user.name}</p>
                      <Badge variant={user.user_type === 'load_owner' ? 'default' : 'secondary'} className="text-xs">
                        {user.user_type === 'load_owner' ? 'Load Owner' : 'Driver'}
                      </Badge>
                    </div>
                  </div>
                  <Button onClick={goToDashboard} size="sm">
                    Dashboard
                  </Button>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-white/95 backdrop-blur-xl">
              <div className="p-4 space-y-3">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 pb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white">
                          {user.name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <Badge variant={user.user_type === 'load_owner' ? 'default' : 'secondary'} className="text-xs">
                          {user.user_type === 'load_owner' ? 'Load Owner' : 'Driver'}
                        </Badge>
                      </div>
                    </div>
                    <Button onClick={goToDashboard} className="w-full" size="sm">
                      Dashboard
                    </Button>
                    <Button onClick={handleLogout} variant="outline" className="w-full" size="sm">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block">
                      <Button variant="ghost" size="sm" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register" className="block">
                      <Button size="sm" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-emerald-600/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in">
              <Badge className="mb-6 bg-blue-50 text-blue-700 hover:bg-blue-100" variant="secondary">
                🚚 Trusted by 10,000+ users
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  Smart Load
                </span>
                <br />
                <span className="text-gray-900">Transportation</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Connect with professional drivers and truck owners for secure, efficient transportation of unusual or heavy loads. 
                Join thousands of satisfied customers.
              </p>
              
              {user ? (
                <div className="max-w-2xl mx-auto">
                  <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-2xl">Welcome back!</CardTitle>
                      <CardDescription className="text-base">
                        You're logged in as a {user.user_type === 'load_owner' ? 'Load Owner' : 'Driver'}. 
                        Ready to get started?
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button
                        onClick={goToDashboard}
                        size="lg"
                        className={`text-lg px-8 py-6 h-auto ${
                          user.user_type === 'load_owner'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Link href="/auth/register?type=load_owner" className="flex-1">
                    <Button size="lg" className="w-full text-lg px-8 py-6 h-auto bg-blue-600 hover:bg-blue-700">
                      <Package className="mr-2 h-5 w-5" />
                      I need transport
                    </Button>
                  </Link>
                  <Link href="/auth/register?type=driver" className="flex-1">
                    <Button size="lg" variant="outline" className="w-full text-lg px-8 py-6 h-auto border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                      <Truck className="mr-2 h-5 w-5" />
                      I'm a driver
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600">25K+</div>
              <div className="text-sm text-gray-600">Completed Jobs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">4.9</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">50+</div>
              <div className="text-sm text-gray-600">Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" variant="secondary">
              How it works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple steps to connect
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Load owners and professional drivers working together for efficient transportation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Load Owners Card */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-blue-600">For Load Owners</CardTitle>
                    <CardDescription>Need something transported?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    'Post your transport request with complete details',
                    'Review applications from verified professional drivers',
                    'Choose your driver and track your delivery in real-time'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-600 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>Secure payments</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Rated drivers</span>
                  </div>
                </div>
                <Link href="/auth/register?type=load_owner">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Start as Load Owner
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Drivers Card */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-emerald-600">For Drivers</CardTitle>
                    <CardDescription>Own a truck or van?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    'Browse high-paying transport jobs in your area',
                    'Apply for jobs that match your vehicle and schedule',
                    'Get paid securely after each successful delivery'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-600 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Flexible hours</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>Local & long distance</span>
                  </div>
                </div>
                <Link href="/auth/register?type=driver">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Start as Driver
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/auth/login">
              <Button variant="link" className="text-lg">
                Already have an account? Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why choose SharedTrans?</h2>
            <p className="text-lg text-gray-600">Built with security and reliability in mind</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure & Insured</h3>
              <p className="text-gray-600">All transactions are protected and drivers are verified</p>
            </div>
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-4">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Trusted Community</h3>
              <p className="text-gray-600">Join thousands of satisfied users and professional drivers</p>
            </div>
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Top Rated</h3>
              <p className="text-gray-600">4.9/5 average rating from our user community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">SharedTrans</span>
                <p className="text-sm text-gray-400">Smart Logistics Platform</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                © 2024 SharedTrans. Connecting communities through smart logistics.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Built with security, reliability, and trust in mind.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 