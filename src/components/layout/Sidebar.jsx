'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BiHomeCircle, BiUser } from 'react-icons/bi'
import { BsBookmark, BsTwitter } from 'react-icons/bs'
import { HiOutlineHashtag } from 'react-icons/hi'

const Sidebar = () => {
  const router = useRouter()
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
      title: 'Profil',
      icon: BiUser,
      path: '/profile'
    },
    {
      title: 'Yer İşaretleri',
      icon: BsBookmark,
      path: '/bookmarks'
    }
  ]

  return (
    <div className="h-screen sticky top-0 flex flex-col justify-between w-72 px-4 py-4">
      <div>
        <div className="p-2 mb-4">
          <Link href="/" className="text-white text-3xl">
            <BsTwitter />
          </Link>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center space-x-4 text-xl px-4 py-2 hover:bg-gray-900 rounded-full text-white transition duration-200"
            >
              <item.icon className="h-7 w-7" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
        <button className="bg-blue-500 text-white rounded-full w-full py-3 mt-8 hover:bg-blue-600 transition duration-200">
          Gönder
        </button>
      </div>
      <div className="mb-4">
        <button className="flex items-center space-x-2 hover:bg-gray-900 rounded-full p-4 w-full transition duration-200">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <div className="flex-1 text-left">
            <div className="font-bold text-white">Kullanıcı Adı</div>
            <div className="text-gray-500">@kullanici</div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default Sidebar 