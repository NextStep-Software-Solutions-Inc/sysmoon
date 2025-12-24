'use client';

import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto p-8">
        <header className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Sysmoon Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Real-time monitoring and event tracking system
          </p>
        </header>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Link href="/systems" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-all p-8 border-2 border-transparent hover:border-blue-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Systems Management
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Register and manage your applications
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Register new systems
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Generate API keys
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  View system metrics
                </li>
              </ul>
            </div>
          </Link>

          <Link href="/events" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-all p-8 border-2 border-transparent hover:border-purple-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Events Monitor
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Real-time event streaming and analysis
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Live event streaming
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced filtering & search
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Event analytics dashboard
                </li>
              </ul>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Getting Started
          </h3>
          <div className="prose dark:prose-invert max-w-none">
            <ol className="space-y-3 text-gray-600 dark:text-gray-400">
              <li>
                <strong className="text-gray-900 dark:text-gray-100">Register a System:</strong> Go to Systems Management and register your application to get an API key
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">Configure SDK:</strong> Initialize the Sysmoon SDK in your application with the API key
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">Start Monitoring:</strong> Send events from your app and watch them appear in the Events Monitor in real-time
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
