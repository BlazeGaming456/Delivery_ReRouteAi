import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata = {
  title: 'Walmart Express Delivery - AI-Powered Route Optimization',
  description:
    'Experience the future of delivery with Walmart Express. AI-powered route optimization for faster, smarter deliveries.',
  keywords:
    'Walmart, delivery, AI, route optimization, logistics, express delivery'
}

export default function RootLayout ({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Header */}
        <header className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center h-16'>
              {/* Logo */}
              <div className='flex items-center space-x-3'>
                <div className='flex items-center space-x-2'>
                  <div className='bg-[#0071ce] rounded-lg w-10 h-10 flex items-center justify-center'>
                    <span className='text-white font-bold text-xl'>W</span>
                  </div>
                  <div className='hidden sm:block'>
                    <h1 className='text-xl font-bold text-[#0071ce]'>
                      Walmart Express
                    </h1>
                    <p className='text-xs text-gray-500 -mt-1'>
                      AI-Powered Delivery
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className='hidden md:flex space-x-8'>
                <a
                  href='/delivery'
                  className='text-gray-700 hover:text-[#0071ce] px-3 py-2 text-sm font-medium transition-colors duration-200'
                >
                  Delivery Simulator
                </a>
                <a
                  href='#'
                  className='text-gray-700 hover:text-[#0071ce] px-3 py-2 text-sm font-medium transition-colors duration-200'
                >
                  Features
                </a>
                <a
                  href='#'
                  className='text-gray-700 hover:text-[#0071ce] px-3 py-2 text-sm font-medium transition-colors duration-200'
                >
                  About
                </a>
                <a
                  href='#'
                  className='text-gray-700 hover:text-[#0071ce] px-3 py-2 text-sm font-medium transition-colors duration-200'
                >
                  Contact
                </a>
              </nav>

              {/* Right side */}
              <div className='flex items-center space-x-4'>
                <button className='hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0071ce] hover:bg-[#005a9e] transition-colors duration-200'>
                  <svg
                    className='w-4 h-4 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                  Sign In
                </button>
                <div className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-gray-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className='min-h-screen'>{children}</main>

        {/* Footer */}
        <footer className='bg-gray-900 text-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
              <div className='col-span-1 md:col-span-2'>
                <div className='flex items-center space-x-2 mb-4'>
                  <div className='bg-[#0071ce] rounded-lg w-8 h-8 flex items-center justify-center'>
                    <span className='text-white font-bold text-lg'>W</span>
                  </div>
                  <span className='text-xl font-bold'>Walmart Express</span>
                </div>
                <p className='text-gray-400 mb-4 max-w-md'>
                  Revolutionizing delivery logistics with AI-powered route
                  optimization. Faster, smarter, and more efficient deliveries
                  for the modern world.
                </p>
                <div className='flex space-x-4'>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition-colors'
                  >
                    <svg
                      className='w-6 h-6'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
                    </svg>
                  </a>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition-colors'
                  >
                    <svg
                      className='w-6 h-6'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z' />
                    </svg>
                  </a>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition-colors'
                  >
                    <svg
                      className='w-6 h-6'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 className='text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4'>
                  Product
                </h3>
                <ul className='space-y-3'>
                  <li>
                    <a
                      href='#'
                      className='text-gray-300 hover:text-white transition-colors'
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='text-gray-300 hover:text-white transition-colors'
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='text-gray-300 hover:text-white transition-colors'
                    >
                      API
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='text-gray-300 hover:text-white transition-colors'
                    >
                      Documentation
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className='text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4'>
                  Company
                </h3>
                <ul className='space-y-3'>
                  <li>
                    <a
                      href='#'
                      className='text-gray-300 hover:text-white transition-colors'
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='text-gray-300 hover:text-white transition-colors'
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='text-gray-300 hover:text-white transition-colors'
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='text-gray-300 hover:text-white transition-colors'
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className='mt-8 pt-8 border-t border-gray-800'>
              <p className='text-gray-400 text-sm text-center'>
                © 2024 Walmart Express. All rights reserved. Built for Walmart
                Sparkothon.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
