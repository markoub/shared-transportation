import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Shared Transportation - Load Sharing Platform</title>
        <meta name="description" content="Connect load owners with drivers for unusual transport needs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shared Transportation
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect people who need to transport unusual or heavy loads with truck/van owners
          </p>
          
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
        </div>
      </main>
    </div>
  )
} 