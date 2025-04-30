'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HiOutlineSearch, HiArrowLeft } from 'react-icons/hi'
import { BsStars } from 'react-icons/bs'
import { api } from '@/utils/api'

const Header = () => {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api.auth.getMe()
        setUser(userData)
      } catch (error) {
        console.error('Kullanıcı bilgileri yüklenirken hata:', error)
      }
    }
    fetchUser()
  }, [])
  
  // Sayfa başlığını belirle
  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'Anasayfa'
      case '/explore':
        return 'Keşfet'
      case '/bookmarks':
        return 'Yer İşaretleri'
      case '/profile':
        return user ? user.name : 'Profil'
      case '/notifications':
        return 'Bildirimler'
      case '/messages':
        return 'Mesajlar'
      default:
        return 'Twitter'
    }
  }
  
  const showBackButton = pathname !== '/'
  const showSearchOnHeader = pathname === '/explore'
  const showTimeline = pathname === '/'
  
  return (
    <header className={`sticky top-0 backdrop-blur-md z-10 transition-all duration-200 ${
      scrolled ? 'bg-black/80' : 'bg-black/40'
    }`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center space-x-6 flex-1">
          {/* Geri butonu (profil, detay vb sayfalarda) */}
          {showBackButton && (
            <button 
              onClick={() => window.history.back()}
              className="rounded-full p-2 hover:bg-gray-800 transition-colors"
            >
              <HiArrowLeft className="h-5 w-5 text-white" />
            </button>
          )}
          
          {/* Sayfa başlığı */}
          <h1 className="text-xl font-bold text-white">{getPageTitle()}</h1>
        </div>
        
        {/* Sağ arama veya özel gösterge */}
        <div className="flex items-center space-x-4">
          {showSearchOnHeader && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineSearch className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Twitter'da Ara"
                className="w-64 bg-gray-800 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-black transition-colors"
              />
            </div>
          )}
          
          {/* Anasayfadaki algoritma/kronoloji seçici */}
          {showTimeline && (
            <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
              <BsStars className="h-5 w-5 text-blue-400" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header 