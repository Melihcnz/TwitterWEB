'use client'
import { HiOutlineHashtag } from 'react-icons/hi'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const ExplorePage = () => {
  return (
    <div className="container mx-auto flex">
      {/* Sol Sidebar */}
      <div className="w-1/4 fixed h-screen">
        <Sidebar />
      </div>

      {/* Ana İçerik */}
      <main className="w-1/2 ml-[25%] min-h-screen border-x border-gray-800">
        <Header />
        <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-[#2f3336]">
          <div className="flex px-4 py-3">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Ara"
                className="w-full bg-[#202327] text-white rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#1d9bf0] focus:bg-black"
              />
            </div>
          </div>
          <div className="flex px-4 py-2">
            <h1 className="text-xl font-bold text-white">Keşfet</h1>
          </div>
        </div>

        <div className="divide-y divide-[#2f3336]">
          <div className="p-4">
            <h2 className="text-xl font-bold text-white mb-2">Türkiye Gündeminde</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="hover:bg-[#181818] transition-colors duration-200 p-2 rounded">
                  <div className="text-[#71767b] text-sm">Gündemdekiler</div>
                  <div className="text-white font-bold">#{`Hashtag${index}`}</div>
                  <div className="text-[#71767b] text-sm">{`${index}5.6B Tweet`}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Sağ Trend Bölümü */}
      <div className="w-1/4 fixed right-0 h-screen p-4">
        <div className="bg-gray-900 rounded-xl p-4">
          <h2 className="text-xl font-bold mb-4">Gündemler</h2>
          <div className="space-y-4">
            <div className="hover:bg-gray-800 p-2 rounded transition duration-200">
              <p className="text-gray-500 text-sm">Türkiye gündeminde</p>
              <p className="font-bold">#Hashtag1</p>
              <p className="text-gray-500 text-sm">45.6B Tweet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExplorePage 