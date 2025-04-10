import Link from 'next/link';
import { FaGraduationCap, FaUserTie, FaBook, FaCalendarAlt } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Your Career Transformation Journey Starts Here
            </h1>
            <p className="text-xl mb-8">
              Connect with alumni mentors, access valuable resources, and navigate your career switch with confidence.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How We Help You Succeed</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <FaUserTie className="text-primary-600 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mentorship</h3>
              <p className="text-gray-600">
                Connect with experienced alumni mentors who have successfully navigated career transitions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <FaBook className="text-primary-600 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Resources</h3>
              <p className="text-gray-600">
                Access curated learning materials, industry insights, and career guidance resources.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <FaCalendarAlt className="text-primary-600 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Events</h3>
              <p className="text-gray-600">
                Participate in workshops, networking events, and industry talks to expand your knowledge.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <FaGraduationCap className="text-primary-600 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                Join a supportive community of career switchers and industry professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of successful career switchers and take the first step towards your dream career.
          </p>
          <Link
            href="/auth/signup"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </main>
  );
}
