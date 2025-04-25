'use client'
import { useState, useEffect, useRef } from 'react'
import { api } from '@/utils/api'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/Header'
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: '',
    website: ''
  })
  const [retweetModal, setRetweetModal] = useState({ isOpen: false, tweetId: null })
  const [retweetComment, setRetweetComment] = useState('')
  const profileImageRef = useRef(null)
  const coverImageRef = useRef(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const userData = await api.auth.getMe()
      setUser(userData)
      setEditForm({
        name: userData.name || '',
        bio: userData.bio || '',
        location: userData.location || '',
        website: userData.website || ''
      })
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
    setRetweetModal({ isOpen: true, tweetId })
  }

  const handleRetweetSubmit = async () => {
    try {
      await api.tweets.retweet(retweetModal.tweetId, retweetComment)
      setRetweetModal({ isOpen: false, tweetId: null })
      setRetweetComment('')
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

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.user.updateProfile(editForm)
      await fetchProfile()
      setEditModal(false)
    } catch (error) {
      console.error('Profil güncellenirken hata:', error)
    }
  }

  const handleBookmark = async (tweetId) => {
    try {
      await api.tweets.bookmark(tweetId)
      fetchProfile() // Tweet listesini güncelle
    } catch (error) {
      console.error('Tweet kaydedilirken hata:', error)
    }
  }

  const handleRemoveBookmark = async (tweetId) => {
    try {
      await api.tweets.removeBookmark(tweetId)
      fetchProfile() // Tweet listesini güncelle
    } catch (error) {
      console.error('Tweet kaydı kaldırılırken hata:', error)
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
            <div className="relative h-48 bg-gray-800">
              {user.bannerPicture && (
                <img
                  src={user.bannerPicture}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              )}
              <label className="absolute bottom-2 right-2 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={coverImageRef}
                  onChange={(e) => handleImageUpload('banner', e)}
                />
                <div className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </label>
            </div>

            {/* Profil Bilgileri */}
            <div className="p-4">
              <div className="relative">
                <div className="absolute -top-16">
                  <div className="relative">
                    <img
                      src={user.profilePicture || '/default-avatar.png'}
                      alt={user.name}
                      className="w-32 h-32 rounded-full border-4 border-black"
                    />
                    <label className="absolute bottom-0 right-0 cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        ref={profileImageRef}
                        onChange={(e) => handleImageUpload('profile', e)}
                      />
                      <div className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-20">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl font-bold">{user.name}</h1>
                    <p className="text-gray-500">@{user.username}</p>
                  </div>
                  <button
                    onClick={() => setEditModal(true)}
                    className="px-4 py-2 rounded-full border border-gray-600 text-white hover:bg-gray-800 transition-colors"
                  >
                    Profili Düzenle
                  </button>
                </div>
                <p className="mt-2">{user.bio}</p>
                {user.location && (
                  <p className="text-gray-500 mt-2">
                    <span className="mr-1">📍</span>
                    {user.location}
                  </p>
                )}
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline mt-2 block"
                  >
                    <span className="mr-1">🔗</span>
                    {user.website}
                  </a>
                )}
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
                            <span className="hover:underline cursor-pointer">
                              {user.name} Retweetledi
                            </span>
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
                          {tweet.content && (
                            <p className="mt-2 text-gray-300">{tweet.content}</p>
                          )}
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
                        <button 
                          onClick={() => tweet.bookmarks?.includes(user?._id) ? handleRemoveBookmark(tweet._id) : handleBookmark(tweet._id)}
                          className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
                        >
                          {tweet.bookmarks?.includes(user?._id) ? (
                            <BsBookmarkFill className="w-5 h-5" />
                          ) : (
                            <BsBookmark className="w-5 h-5" />
                          )}
                          <span>{tweet.bookmarks?.length || 0}</span>
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

      {/* Retweet Modal */}
      {retweetModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-4 w-[400px]">
            <h2 className="text-xl font-bold mb-4">Retweet</h2>
            <textarea
              value={retweetComment}
              onChange={(e) => setRetweetComment(e.target.value)}
              placeholder="Tweet hakkında yorum ekle (isteğe bağlı)"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white mb-4"
              rows={3}
              maxLength={280}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setRetweetModal({ isOpen: false, tweetId: null })
                  setRetweetComment('')
                }}
                className="px-4 py-2 rounded-full border border-gray-500 text-gray-300 hover:bg-gray-800"
              >
                İptal
              </button>
              <button
                onClick={handleRetweetSubmit}
                className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700"
              >
                Retweet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profil Düzenleme Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-4 w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Profili Düzenle</h2>
              <button
                onClick={() => setEditModal(false)}
                className="text-gray-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    İsim
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                    maxLength={50}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                    rows={3}
                    maxLength={160}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Konum
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                    maxLength={30}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                    placeholder="https://"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="px-4 py-2 rounded-full border border-gray-500 text-gray-300 hover:bg-gray-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}