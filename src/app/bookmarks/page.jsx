'use client'
import { useState, useEffect } from 'react'
import { BsBookmark } from 'react-icons/bs'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { api } from '@/utils/api'

const BookmarksPage = () => {
  const [bookmarkedTweets, setBookmarkedTweets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookmarkedTweets()
  }, [])

  const fetchBookmarkedTweets = async () => {
    try {
      const response = await api.tweets.getBookmarks()
      setBookmarkedTweets(response.tweets || [])
    } catch (error) {
      console.error('Yer işaretleri yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveBookmark = async (tweetId) => {
    try {
      await api.tweets.removeBookmark(tweetId)
      fetchBookmarkedTweets() // Listeyi güncelle
    } catch (error) {
      console.error('Yer işareti kaldırılırken hata:', error)
    }
  }

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
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <h1 className="text-xl font-bold text-white">Yer İşaretleri</h1>
              <p className="text-[#71767b] text-sm">@testuser</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : bookmarkedTweets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center p-4">
            <BsBookmark className="text-[#1d9bf0] text-5xl mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Tweetleri daha sonrası için kaydet</h2>
            <p className="text-[#71767b] text-sm max-w-[400px]">
              İlginç bir Tweet gördüğünde, onu Yer İşaretleri'ne eklemek için Paylaş simgesine dokun. 
              İstediğin zaman buradan tekrar göz atabilirsin.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {bookmarkedTweets.map((tweet) => (
              <div key={tweet._id} className="p-4 hover:bg-gray-900/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <img
                    src={tweet.user.profilePicture || "/default-avatar.png"}
                    alt={tweet.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white">{tweet.user.name}</span>
                        <span className="text-gray-500 ml-2">@{tweet.user.username}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveBookmark(tweet._id)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <BsBookmark className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="mt-2 text-white">{tweet.content}</p>
                    {tweet.images && tweet.images.length > 0 && (
                      <div className="mt-3 grid gap-2 grid-cols-2">
                        {tweet.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt="Tweet görsel"
                            className="rounded-xl max-h-80 object-cover w-full"
                          />
                        ))}
                      </div>
                    )}
                    <div className="flex items-center space-x-8 mt-3 text-gray-500">
                      <span>{tweet.likes?.length || 0} Beğeni</span>
                      <span>{tweet.retweets?.length || 0} Retweet</span>
                      <span>{tweet.replies?.length || 0} Yanıt</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default BookmarksPage 