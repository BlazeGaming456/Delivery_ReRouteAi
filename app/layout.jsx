import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Image from 'next/image'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata = {
  title: 'Walmart Flex Delivery - AI-Powered Route Optimization',
  description:
    'Experience the future of delivery with Walmart Flex. AI-powered route optimization for faster, smarter deliveries.',
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
                <div className='bg-[#0071ce] rounded-lg w-10 h-10 flex items-center justify-center'>
                  <Image
                    src='/logo.png'
                    alt='Walmart Flex'
                    width={40}
                    height={40}
                    className='rounded-2xl'
                  />
                  {/* <span className='text-white font-bold text-xl'>W</span> */}
                </div>
                <div className='hidden sm:block'>
                  <h1 className='text-xl font-bold text-[#0071ce]'>
                    Walmart Flex
                  </h1>
                  <p className='text-xs text-gray-500 -mt-1'>
                    AI-Powered Delivery
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className='hidden md:flex items-center space-x-8'>
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
              <div className='flex items-center'>
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
              <div className='col-span-1 md:col-span-3'>
                <div className='flex items-center space-x-2 mb-4'>
                  <div className=' w-8 h-8 flex items-center justify-center'>
                    <Image
                      src='/logo.png'
                      alt='Walmart Flex'
                      width={32}
                      height={32}
                      className='rounded-lg'
                    />
                    {/* <span className='text-white font-bold text-lg'>W</span> */}
                  </div>
                  <span className='text-xl font-bold'>Walmart Flex</span>
                </div>
                <p className='text-gray-400 mb-2 max-w-md'>
                  Revolutionizing delivery logistics with AI-powered route
                  optimization. Faster, smarter, and more efficient deliveries
                  for the modern world.
                </p>
                <div className='flex items-center space-x-1'>
                  <span className='text-gray-400 text-sm font-medium'>
                    Project Link:
                  </span>
                  <a
                    href='https://github.com/BlazeGaming456/Delivery_ReRouteAi'
                    className='text-gray-400 hover:text-white transition-colors flex items-center'
                  >
                    <svg
                      className='w-6 h-6'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 className='text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4'>
                  Team Members
                </h3>
                <ul className='space-y-3'>
                  <li>
                    <a
                      href='https://github.com/BlazeGaming456'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-gray-300 hover:text-white transition-colors flex items-center'
                    >
                      <svg
                        className='w-4 h-4 mr-2'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                      </svg>
                      Ajin Chundakkattu Raju
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-gray-300 hover:text-white transition-colors flex items-center'
                    >
                      <svg
                        className='w-4 h-4 mr-2'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                      </svg>
                      Sai Sathwik
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-gray-300 hover:text-white transition-colors flex items-center'
                    >
                      <svg
                        className='w-4 h-4 mr-2'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                      </svg>
                      Alavala Bhavya Kesini
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className='mt-8 pt-8 border-t border-gray-800'>
              <p className='text-gray-400 text-sm text-center'>
                © 2025 Walmart Flex. Built for Walmart Sparkothon.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
