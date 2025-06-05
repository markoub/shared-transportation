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
  X,
  Zap,
  Award,
  Globe
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
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white"></div>
          </div>
          <p className="text-xl text-white font-medium animate-pulse">Loading amazing experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <Head>
        <title>SharedTrans - Revolutionary Load Sharing Platform</title>
        <meta name="description" content="Connect load owners with professional drivers for secure, efficient transportation. The future of logistics is here." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-2xl">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  SharedTrans
                </h1>
                <p className="text-xs text-white/70 font-medium">Smart Logistics Platform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10 ring-2 ring-blue-400/50">
                      <AvatarFallback className="bg-blue-600 text-white font-bold">
                        {user.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium text-white">Welcome, {user.name}</p>
                      <Badge variant={user.user_type === 'load_owner' ? 'default' : 'secondary'} 
                        className={`text-xs ${user.user_type === 'load_owner' ? 'bg-blue-600' : 'bg-green-600'} text-white border-0`}>
                        {user.user_type === 'load_owner' ? 'Load Owner' : 'Driver'}
                      </Badge>
                    </div>
                  </div>
                  <Button onClick={goToDashboard} size="lg" 
                    className="bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    Dashboard
                  </Button>
                  <Button onClick={handleLogout} variant="outline" size="lg" 
                    className="border-white/30 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="lg" className="text-white hover:bg-white/10 transition-all duration-300 hover:scale-105">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
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
                size="lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/20 bg-black/30 backdrop-blur-xl">
              <div className="p-6 space-y-4">
                {user ? (
                  <>
                    <div className="flex items-center space-x-4 pb-4">
                      <Avatar className="h-10 w-10 ring-2 ring-blue-400/50">
                        <AvatarFallback className="bg-blue-600 text-white font-bold">
                          {user.name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <Badge variant={user.user_type === 'load_owner' ? 'default' : 'secondary'} 
                          className={`text-xs ${user.user_type === 'load_owner' ? 'bg-blue-600' : 'bg-green-600'} text-white border-0`}>
                          {user.user_type === 'load_owner' ? 'Load Owner' : 'Driver'}
                        </Badge>
                      </div>
                    </div>
                    <Button onClick={goToDashboard} className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0" size="lg">
                      Dashboard
                    </Button>
                    <Button onClick={handleLogout} variant="outline" className="w-full border-white/30 text-white hover:bg-white/10" size="lg">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block">
                      <Button variant="ghost" size="lg" className="w-full text-white hover:bg-white/10">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register" className="block">
                      <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0">
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
      <section className="relative py-32 lg:py-48">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            <Badge className="mb-8 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-lg px-8 py-3 backdrop-blur-sm rounded-full font-medium shadow-lg" variant="secondary">
              ✨ Trusted by 10,000+ users worldwide
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-8 tracking-tight leading-tight">
              <span className="text-blue-300 block">
                Smart Load
              </span>
              <span className="text-white">
                Transportation
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-16 max-w-4xl mx-auto leading-relaxed font-medium">
              Connect with professional drivers and truck owners for secure, efficient transportation of unusual or heavy loads. 
              <span className="text-blue-300 font-bold"> Experience the future of logistics.</span>
            </p>
            
            {user ? (
              <div className="max-w-3xl mx-auto">
                <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-3xl rounded-3xl">
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-3xl text-white mb-3 font-bold">Welcome back, Champion! 🚀</CardTitle>
                    <CardDescription className="text-xl text-white/70">
                      You're logged in as a {user.user_type === 'load_owner' ? 'Load Owner' : 'Driver'}. 
                      Ready to transform logistics?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button
                      onClick={goToDashboard}
                      size="lg"
                      className={`text-xl px-12 py-8 h-auto transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-2 ${user.user_type === 'load_owner' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white border-0 rounded-2xl font-bold`}
                    >
                      🚀 Launch Dashboard
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
                <Link href="/auth/register?type=load_owner" className="flex-1">
                  <Button size="lg" className="w-full text-xl px-10 py-8 h-auto bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-2 text-white border-0 rounded-2xl font-bold">
                    <Package className="mr-3 h-6 w-6" />
                    📦 I need transport
                  </Button>
                </Link>
                <Link href="/auth/register?type=driver" className="flex-1">
                  <Button size="lg" variant="outline" className="w-full text-xl px-10 py-8 h-auto border-2 border-blue-500/50 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-2 backdrop-blur-sm rounded-2xl font-bold">
                    <Truck className="mr-3 h-6 w-6" />
                    🚛 I'm a driver
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/10 bg-black/20 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="group transition-transform hover:scale-110 duration-300">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">10K+</div>
              <div className="text-white/70 font-medium">Active Users</div>
            </div>
            <div className="group transition-transform hover:scale-110 duration-300">
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">25K+</div>
              <div className="text-white/70 font-medium">Completed Jobs</div>
            </div>
            <div className="group transition-transform hover:scale-110 duration-300">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">4.9</div>
              <div className="text-white/70 font-medium">Average Rating</div>
            </div>
            <div className="group transition-transform hover:scale-110 duration-300">
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">50+</div>
              <div className="text-white/70 font-medium">Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 lg:py-40 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-green-500/20 text-green-300 border border-green-500/30 text-lg px-6 py-2 backdrop-blur-sm rounded-full font-medium" variant="secondary">
              How it works
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Simple steps to
              <span className="text-blue-400"> connect</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Load owners and professional drivers working together for revolutionary transportation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Load Owners Card */}
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 bg-blue-900/50 backdrop-blur-xl border border-blue-500/30 rounded-3xl">
              <CardHeader>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-xl">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl text-blue-400 font-bold">For Load Owners</CardTitle>
                    <CardDescription className="text-white/70 text-lg">Need something transported?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  {[
                    '📝 Post your transport request with complete details',
                    '👥 Review applications from verified professional drivers',
                    '📍 Choose your driver and track your delivery in real-time'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold mt-1 shadow-lg">
                        {index + 1}
                      </div>
                      <p className="text-white/80 leading-relaxed text-lg">{step}</p>
                    </div>
                  ))}
                </div>
                <Separator className="bg-white/20" />
                <div className="flex items-center space-x-6 text-sm text-white/60">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Secure payments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Rated drivers</span>
                  </div>
                </div>
                <Link href="/auth/register?type=load_owner">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg py-6 rounded-2xl font-bold">
                    🚀 Start as Load Owner
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Drivers Card */}
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 bg-green-900/50 backdrop-blur-xl border border-green-500/30 rounded-3xl">
              <CardHeader>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 shadow-xl">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl text-green-400 font-bold">For Drivers</CardTitle>
                    <CardDescription className="text-white/70 text-lg">Own a truck or van?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  {[
                    '💰 Browse high-paying transport jobs in your area',
                    '✅ Apply for jobs that match your vehicle and schedule',
                    '💳 Get paid securely after each successful delivery'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold mt-1 shadow-lg">
                        {index + 1}
                      </div>
                      <p className="text-white/80 leading-relaxed text-lg">{step}</p>
                    </div>
                  ))}
                </div>
                <Separator className="bg-white/20" />
                <div className="flex items-center space-x-6 text-sm text-white/60">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Flexible hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Local & long distance</span>
                  </div>
                </div>
                <Link href="/auth/register?type=driver">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg py-6 rounded-2xl font-bold">
                    🚛 Start as Driver
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-16">
            <Link href="/auth/login">
              <Button variant="link" className="text-xl text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium">
                Already have an account? Sign in
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 bg-black/30 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why choose 
              <span className="text-blue-400"> SharedTrans?</span>
            </h2>
            <p className="text-xl text-white/70">Built with security, innovation and reliability in mind</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center bg-blue-900/30 backdrop-blur-xl rounded-3xl shadow-2xl p-10 transition-all duration-300 hover:scale-105 hover:-translate-y-2 border border-blue-500/20">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 mx-auto mb-6 shadow-xl">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-bold text-2xl mb-4 text-white">🔒 Secure & Insured</h3>
              <p className="text-white/70 text-lg">All transactions are protected with enterprise-grade security and drivers are thoroughly verified</p>
            </div>
            <div className="text-center bg-green-900/30 backdrop-blur-xl rounded-3xl shadow-2xl p-10 transition-all duration-300 hover:scale-105 hover:-translate-y-2 border border-green-500/20">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-600 mx-auto mb-6 shadow-xl">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-bold text-2xl mb-4 text-white">🤝 Trusted Community</h3>
              <p className="text-white/70 text-lg">Join thousands of satisfied users and professional drivers in our growing ecosystem</p>
            </div>
            <div className="text-center bg-purple-900/30 backdrop-blur-xl rounded-3xl shadow-2xl p-10 transition-all duration-300 hover:scale-105 hover:-translate-y-2 border border-purple-500/20">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-600 mx-auto mb-6 shadow-xl">
                <Star className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-bold text-2xl mb-4 text-white">⭐ Top Rated</h3>
              <p className="text-white/70 text-lg">4.9/5 average rating from our user community with thousands of success stories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-xl text-white py-20 border-t border-white/20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-8 md:mb-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-xl">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-400">SharedTrans</h3>
                <p className="text-white/70">Revolutionizing logistics</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-white/70 mb-2">© 2024 SharedTrans. All rights reserved.</p>
              <p className="text-sm text-white/50">Built with ❤️ for the future of transportation</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 