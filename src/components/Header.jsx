'use client'
import Link from 'next/link'
import { api } from '@/utils/api'

export default function Header() {
  const handleLogout = () => {
    api.auth.logout()
  }

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-white">
          Twitter
        </Link>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </header>
  )
} 