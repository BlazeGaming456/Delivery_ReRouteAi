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
  title: 'ReRouteAi',
  description: 'Helping packages find their way home'
}

export default function RootLayout ({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className='sticky top-0 z-50 bg-blue-700 shadow flex items-center justify-between px-6 py-3'>
          <div className='flex items-center gap-2'>
            <div className='bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center font-bold text-blue-800 text-xl'>
              W
            </div>
            <span className='text-white font-bold text-xl tracking-wide'>
              Walmart Express
            </span>
          </div>
          <div className='flex gap-6 text-white font-semibold text-base'>
            <a href='/address' className='hover:text-yellow-300 transition'>
              Address
            </a>
            <a href='/item' className='hover:text-yellow-300 transition'>
              Items
            </a>
            <a
              href='/confirmation'
              className='hover:text-yellow-300 transition'
            >
              Confirmation
            </a>
            <a href='/delivery' className='hover:text-yellow-300 transition'>
              Delivery
            </a>
          </div>
          <div className='flex items-center gap-4'>
            <button className='bg-yellow-400 text-blue-900 font-bold px-4 py-1 rounded hover:bg-yellow-300 transition'>
              Sign In
            </button>
            <div className='bg-white rounded-full w-8 h-8 flex items-center justify-center text-blue-700 font-bold'>
              ��
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
