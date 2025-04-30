'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { api } from '@/utils/api'
import { debounce, checkTweetLimit } from '@/utils/helpers'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/Header'
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs'
import TrendsSidebar from '@/components/common/TrendsSidebar'

export default function Home() {
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [tweetContent, setTweetContent] = useState('')
  const [sending, setSending] = useState(false)
  const [retweetModal, setRetweetModal] = useState({ isOpen: false, tweetId: null })
  const [retweetComment, setRetweetComment] = useState('')
  const [user, setUser] = useState(null)
  const observerRef = useRef(null)
  const tweetLimit = checkTweetLimit(tweetContent)

  // Infinity scroll için intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreTweets()
        }
      },
      { threshold: 0.5 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [hasMore, loadingMore])

  useEffect(() => {
    fetchUserAndTweets()
  }, [])

  const fetchUserAndTweets = async () => {
    try {
      setLoading(true)
      const userData = await api.auth.getMe()
      setUser(userData)
      await loadTweets()
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTweets = async () => {
    try {
      const response = await api.tweets.getAll({ page: 1, limit: 20 })
      setTweets(response.tweets || [])
      setPage(2)
      setHasMore(response.tweets?.length === 20)
    } catch (error) {
      console.error('Tweetler yüklenirken hata:', error)
    }
  }

  const loadMoreTweets = async () => {
    if (loadingMore) return

    try {
      setLoadingMore(true)
      const response = await api.tweets.getAll({ page, limit: 20 })
      const newTweets = response.tweets || []

      if (newTweets.length > 0) {
        setTweets(prev => [...prev, ...newTweets])
        setPage(prev => prev + 1)
      }

      setHasMore(newTweets.length === 20)
    } catch (error) {
      console.error('Daha fazla tweet yüklenirken hata:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  // Performans için debounce ile tweet gönderme
  const debouncedTweetSubmit = useCallback(
    debounce(async (content) => {
      try {
        setSending(true)
        await api.tweets.create({ content })
        setTweetContent('')
        // Yeni tweet'i hemen göster
        await loadTweets()
      } catch (error) {
        console.error('Tweet gönderilirken hata:', error)
      } finally {
        setSending(false)
      }
    }, 300),
    []
  )

  const handleTweetSubmit = (e) => {
    e.preventDefault()
    if (!tweetContent.trim() || sending || tweetLimit.isExceeded) return
    debouncedTweetSubmit(tweetContent)
  }

  const handleLike = async (tweetId) => {
    // İlgili tweet'i bul
    const tweetIndex = tweets.findIndex(t => t._id === tweetId)
    if (tweetIndex === -1) return

    const tweet = tweets[tweetIndex]
    const isLiked = tweet.likes?.some(like => like._id === user?._id) || false
    
    // Optimistic update
    const updatedTweets = [...tweets]
    
    if (isLiked) {
      // Like'ı kaldır
      updatedTweets[tweetIndex] = {
        ...tweet,
        likes: tweet.likes.filter(like => like._id !== user._id)
      }
    } else {
      // Like ekle
      updatedTweets[tweetIndex] = {
        ...tweet,
        likes: [...(tweet.likes || []), { _id: user._id }]
      }
    }
    
    setTweets(updatedTweets)

    try {
      await api.tweets.like(tweetId)
    } catch (error) {
      console.error('Tweet beğenilirken hata:', error)
      // Hata durumunda eski haline getir
      setTweets(tweets)
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
      await loadTweets() // Tweet listesini güncelle
    } catch (error) {
      console.error('Tweet retweetlenirken hata:', error)
    }
  }

  const handleBookmark = async (tweetId) => {
    try {
      const response = await api.tweets.bookmark(tweetId)
      if (response.isBookmarked !== undefined) {
        // Tweet listesini güncelle
        const updatedTweets = tweets.map(tweet => {
          if (tweet._id === tweetId) {
            const bookmarks = tweet.bookmarks || []
            if (response.isBookmarked) {
              bookmarks.push({ _id: user._id })
            } else {
              const index = bookmarks.findIndex(b => b._id === user._id)
              if (index !== -1) bookmarks.splice(index, 1)
            }
            return { ...tweet, bookmarks }
          }
          return tweet
        })
        setTweets(updatedTweets)
      }
    } catch (error) {
      console.error('Tweet kaydedilirken hata:', error)
    }
  }

  const handleRemoveBookmark = async (tweetId) => {
    try {
      await api.tweets.removeBookmark(tweetId)
      await loadTweets() // Tweet listesini güncelle
    } catch (error) {
      console.error('Tweet kaydı kaldırılırken hata:', error)
    }
  }

  const isLiked = (tweet) => {
    return tweet.likes?.some(like => like._id === user?._id) || false
  }

  const isBookmarked = (tweet) => {
    return tweet.bookmarks?.some(bookmark => bookmark._id === user?._id) || false
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
        <div className="flex-1 border-l border-r border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <form onSubmit={handleTweetSubmit}>
              <textarea
                value={tweetContent}
                onChange={(e) => setTweetContent(e.target.value)}
                placeholder="Neler oluyor?"
                className="w-full bg-transparent text-white resize-none focus:outline-none"
                rows="3"
                maxLength={280}
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm ${tweetLimit.isExceeded ? 'text-red-500' : 'text-gray-500'}`}>
                  {tweetLimit.remaining} karakter kaldı
                </span>
                <button
                  type="submit"
                  disabled={sending || !tweetContent.trim() || tweetLimit.isExceeded}
                  className={`px-4 py-2 rounded-full ${
                    sending || !tweetContent.trim() || tweetLimit.isExceeded
                      ? 'bg-blue-500/50 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white font-semibold transition-colors`}
                >
                  {sending ? 'Gönderiliyor...' : 'Tweetle'}
                </button>
              </div>
            </form>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : tweets.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              Henüz tweet yok.
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
                          {tweet.user.name} Retweetledi
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
                          src={tweet.user.profilePicture || '/default-avatar.png'}
                          alt={tweet.user.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-bold text-white">{tweet.user.name}</p>
                          <p className="text-gray-500">@{tweet.user.username}</p>
                        </div>
                      </div>
                      <p className="text-white">{tweet.content}</p>
                    </div>
                  )}
                  <div className="flex items-center space-x-6 mt-2 text-gray-500">
                    <button 
                      onClick={() => handleLike(tweet._id)}
                      className={`flex items-center space-x-2 ${isLiked(tweet) ? 'text-red-500' : 'hover:text-red-500'} transition-colors`}
                    >
                      <span>{isLiked(tweet) ? '❤️' : '🤍'}</span>
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
                      onClick={() => isBookmarked(tweet) ? handleRemoveBookmark(tweet._id) : handleBookmark(tweet._id)}
                      className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
                    >
                      {isBookmarked(tweet) ? (
                        <BsBookmarkFill className="w-5 h-5" />
                      ) : (
                        <BsBookmark className="w-5 h-5" />
                      )}
                      <span>{tweet.bookmarks?.length || 0}</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Sonsuz scroll için loading indicator */}
              {hasMore && (
                <div 
                  ref={observerRef} 
                  className="flex justify-center p-4"
                >
                  {loadingMore && (
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Sağ Trend Bölümü */}
      <TrendsSidebar />

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
    </div>
  )
}
