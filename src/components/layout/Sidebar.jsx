'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { BiHomeCircle, BiUser, BiBell, BiEnvelope, BiDotsHorizontalRounded } from 'react-icons/bi'
import { BsBookmark, BsTwitter, BsList } from 'react-icons/bs'
import { HiOutlineHashtag } from 'react-icons/hi'
import { FiMoreHorizontal } from 'react-icons/fi'
import { api } from '@/utils/api'

const Sidebar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

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

  const menuItems = [
    {
      title: 'Anasayfa',
      icon: BiHomeCircle,
      path: '/'
    },
    {
      title: 'Keşfet',
      icon: HiOutlineHashtag,
      path: '/explore'
    },
    {
      title: 'Bildirimler',
      icon: BiBell,
      path: '/notifications'
    },
    {
      title: 'Mesajlar',
      icon: BiEnvelope,
      path: '/messages'
    },
    {
      title: 'Yer İşaretleri',
      icon: BsBookmark,
      path: '/bookmarks'
    },
    {
      title: 'Profil',
      icon: BiUser,
      path: '/profile'
    }
  ]

  const handleLogout = () => {
    api.auth.logout()
  }

  return (
    <div className="h-screen sticky top-0 flex flex-col justify-between w-72 px-3 py-2 overflow-y-auto">
      <div className="space-y-3">
        {/* Logo */}
        <div className="p-3">
          <Link href="/" className="text-blue-500 text-3xl block w-10 h-10 hover:bg-blue-500/10 rounded-full p-1.5 transition-colors">
            <BsTwitter />
          </Link>
        </div>

        {/* Ana Menü */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-4 text-xl px-4 py-3 hover:bg-gray-900 rounded-full transition-colors group ${
                  isActive ? 'font-bold' : ''
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <item.icon className={`h-7 w-7 ${isActive ? 'text-white' : 'text-gray-100 group-hover:text-white'}`} />
                </div>
                <span className={`${isActive ? 'text-white' : 'text-gray-100 group-hover:text-white'}`}>{item.title}</span>
              </Link>
            )
          })}

          {/* Daha Fazla */}
          <button className="flex items-center space-x-4 text-xl px-4 py-3 text-gray-100 hover:text-white hover:bg-gray-900 rounded-full w-full transition-colors">
            <FiMoreHorizontal className="h-7 w-7" />
            <span>Daha fazla</span>
          </button>
        </nav>

        {/* Tweet Butonu */}
        <button className="bg-blue-500 text-white rounded-full w-full py-3.5 text-lg font-bold hover:bg-blue-600 transition-colors shadow-lg">
          Tweetle
        </button>
      </div>

      {/* Kullanıcı Profili */}
      {user && (
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center justify-between hover:bg-gray-900 rounded-full p-3 w-full transition-colors mt-auto mb-2"
          >
            <div className="flex items-center">
              <img
                src={user.profilePicture || '/default-avatar.png'}
                alt={user.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-1 text-left">
                <div className="font-bold text-white truncate max-w-[120px]">{user.name}</div>
                <div className="text-gray-500 truncate max-w-[120px]">@{user.username}</div>
              </div>
            </div>
            <BiDotsHorizontalRounded className="h-5 w-5 text-gray-400" />
          </button>

          {/* Kullanıcı Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-60 bg-black border border-gray-800 rounded-2xl shadow-lg overflow-hidden z-50">
              <div className="py-3 px-4 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.profilePicture || '/default-avatar.png'}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-bold text-white">{user.name}</div>
                    <div className="text-gray-500">@{user.username}</div>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full text-left py-3 px-4 hover:bg-gray-900 transition-colors text-white"
              >
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Sidebar 