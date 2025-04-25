'use client'
import { useState, useEffect, useRef } from 'react'
import { api } from '@/utils/api'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/Header'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const profileImageRef = useRef(null)
  const coverImageRef = useRef(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const userData = await api.auth.getMe()
      setUser(userData)
      const tweetsData = await api.tweets.getUserTweets(userData._id)
      setTweets(tweetsData.tweets || [])
    } catch (error) {
      console.error('Profil bilgileri yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (tweetId) => {
    try {
      await api.tweets.like(tweetId)
      fetchProfile() // Tweet listesini güncelle
    } catch (error) {
      console.error('Tweet beğenilirken hata:', error)
    }
  }

  const handleRetweet = async (tweetId) => {
    try {
      await api.tweets.retweet(tweetId)
      fetchProfile() // Tweet listesini güncelle
    } catch (error) {
      console.error('Tweet retweetlenirken hata:', error)
    }
  }

  const handleImageUpload = async (type, e) => {
    const file = e.target.files[0]
    if (!file) return

    // Dosya tipini kontrol et
    if (!file.type.startsWith('image/')) {
      alert('Lütfen sadece resim dosyası yükleyin')
      return
    }

    // Dosya boyutunu kontrol et (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır')
      return
    }

    const formData = new FormData()
    formData.append('image', file)
    
    setUploading(true)
    try {
      const result = await api.user.uploadImage(type, formData)
      if (result.success) {
        await fetchProfile() // Profili güncelle
      } else {
        throw new Error(result.message || 'Resim yüklenemedi')
      }
    } catch (error) {
      console.error('Fotoğraf yüklenirken hata:', error)
      alert('Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setUploading(false)
      // Input'u temizle
      if (type === 'profile') {
        profileImageRef.current.value = ''
      } else {
        coverImageRef.current.value = ''
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto flex">
        {/* Sol Sidebar */}
        <div className="w-1/4 fixed h-screen">
          <Sidebar />
        </div>

        {/* Ana İçerik */}
        <main className="w-1/2 ml-[25%] min-h-screen border-x border-gray-800">
          <Header />
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
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

  return (
    <div className="container mx-auto flex">
      {/* Sol Sidebar */}
      <div className="w-1/4 fixed h-screen">
        <Sidebar />
      </div>

      {/* Ana İçerik */}
      <main className="w-1/2 ml-[25%] min-h-screen border-x border-gray-800">
        <Header />
        {user && (
          <div>
            {/* Profil Banner */}
            <div className="h-48 bg-gray-800">
              {user.bannerPicture && (
                <img
                  src={user.bannerPicture}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Profil Bilgileri */}
            <div className="p-4">
              <div className="relative">
                <div className="absolute -top-16">
                  <img
                    src={user.profilePicture || '/default-avatar.png'}
                    alt={user.name}
                    className="w-32 h-32 rounded-full border-4 border-black"
                  />
                </div>
              </div>

              <div className="mt-20">
                <h1 className="text-xl font-bold">{user.name}</h1>
                <p className="text-gray-500">@{user.username}</p>
                <p className="mt-2">{user.bio}</p>

                <div className="flex space-x-4 mt-4">
                  <div>
                    <span className="font-bold">{user.following?.length || 0}</span>
                    <span className="text-gray-500 ml-1">Takip Edilen</span>
                  </div>
                  <div>
                    <span className="font-bold">{user.followers?.length || 0}</span>
                    <span className="text-gray-500 ml-1">Takipçi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tweet'ler */}
            <div className="border-t border-gray-800">
              {tweets.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Henüz tweet atmamışsınız.
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {tweets.map((tweet) => (
                    <div key={tweet._id} className="p-4 hover:bg-gray-900/50 transition-colors">
                      {tweet.isRetweet ? (
                        <div>
                          <div className="flex items-center text-gray-500 text-sm mb-2">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path>
                            </svg>
                            <span>Retweetlediniz</span>
                          </div>
                          <div className="border-l-4 border-gray-800 pl-4">
                            <div className="flex items-center mb-2">
                              <img
                                src={tweet.retweetData.user.profilePicture || '/default-avatar.png'}
                                alt={tweet.retweetData.user.name}
                                className="w-10 h-10 rounded-full mr-3"
                              />
                              <div>
                                <p className="font-bold text-white">{tweet.retweetData.user.name}</p>
                                <p className="text-gray-500">@{tweet.retweetData.user.username}</p>
                              </div>
                            </div>
                            <p className="text-white">{tweet.retweetData.content}</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center mb-2">
                            <img
                              src={user.profilePicture || '/default-avatar.png'}
                              alt={user.name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <p className="font-bold text-white">{user.name}</p>
                              <p className="text-gray-500">@{user.username}</p>
                            </div>
                          </div>
                          <p className="text-white">{tweet.content}</p>
                        </div>
                      )}
                      <div className="flex items-center space-x-6 mt-2 text-gray-500">
                        <button 
                          onClick={() => handleLike(tweet._id)}
                          className="flex items-center space-x-2 hover:text-red-500 transition-colors"
                        >
                          <span>❤️</span>
                          <span>{tweet.likes?.length || 0}</span>
                        </button>
                        <button 
                          onClick={() => handleRetweet(tweet._id)}
                          className="flex items-center space-x-2 hover:text-green-500 transition-colors"
                        >
                          <span>🔁</span>
                          <span>{tweet.retweets?.length || 0}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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