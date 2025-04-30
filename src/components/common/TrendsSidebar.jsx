'use client'
import React from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import { BsThreeDots } from 'react-icons/bs'

const TrendsSidebar = () => {
  // Örnek trend verileri
  const trendData = [
    { 
      id: 1, 
      category: 'Türkiye gündeminde', 
      hashtag: '#Hashtag1', 
      tweetCount: '45.6B' 
    },
    { 
      id: 2, 
      category: 'Spor', 
      hashtag: '#Galatasaray', 
      tweetCount: '32.4B' 
    },
    { 
      id: 3, 
      category: 'Teknoloji', 
      hashtag: '#React', 
      tweetCount: '28.7B' 
    },
    { 
      id: 4, 
      category: 'Eğlence', 
      hashtag: '#Film', 
      tweetCount: '15.3B' 
    }
  ]

  // Örnek takip önerileri
  const suggestedUsers = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      username: 'ahmetyilmaz',
      avatar: '/default-avatar.png'
    },
    {
      id: 2,
      name: 'Ayşe Kaya',
      username: 'aysekaya',
      avatar: '/default-avatar.png'
    }
  ]

  return (
    <div className="w-1/4 fixed right-0 h-screen p-4 overflow-y-auto">
      {/* Arama */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <HiOutlineSearch className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Twitter'da Ara"
          className="bg-gray-800 w-full pl-10 pr-4 py-2 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-black transition-colors"
        />
      </div>

      {/* Gündemler Kutusu */}
      <div className="bg-gray-900 rounded-xl mb-4 overflow-hidden">
        <h2 className="text-xl font-bold px-4 pt-4 pb-2">Gündemler</h2>
        
        <div className="divide-y divide-gray-800">
          {trendData.map((trend) => (
            <div 
              key={trend.id} 
              className="px-4 py-3 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-xs">{trend.category}</p>
                  <p className="font-bold text-white mt-0.5">{trend.hashtag}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{trend.tweetCount} Tweet</p>
                </div>
                <button className="text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 p-1.5 rounded-full transition-colors">
                  <BsThreeDots />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <a 
          href="#"
          className="block px-4 py-3 text-blue-500 hover:bg-gray-800 transition-colors"
        >
          Daha fazla göster
        </a>
      </div>

      {/* Kimi takip etmeli */}
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <h2 className="text-xl font-bold px-4 pt-4 pb-2">Kimi takip etmeli</h2>
        
        <div className="divide-y divide-gray-800">
          {suggestedUsers.map((user) => (
            <div 
              key={user.id} 
              className="px-4 py-3 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-10 h-10 rounded-full mr-3" 
                  />
                  <div>
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-gray-500 text-sm">@{user.username}</p>
                  </div>
                </div>
                <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-opacity-90 transition-colors">
                  Takip et
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <a 
          href="#"
          className="block px-4 py-3 text-blue-500 hover:bg-gray-800 transition-colors"
        >
          Daha fazla göster
        </a>
      </div>

      {/* Footer */}
      <div className="mt-4 px-4 text-xs text-gray-500">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">Hizmet Şartları</a>
          <a href="#" className="hover:underline">Gizlilik Politikası</a>
          <a href="#" className="hover:underline">Çerez Politikası</a>
          <a href="#" className="hover:underline">Erişilebilirlik</a>
          <a href="#" className="hover:underline">Reklam Bilgisi</a>
        </div>
        <p className="mt-2">© 2023 Twitter, Inc.</p>
      </div>
    </div>
  )
}

export default TrendsSidebar 