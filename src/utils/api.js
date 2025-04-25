import Cookies from 'js-cookie'

const API_URL = 'https://twitterapi-kg5q.onrender.com/api'

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = Cookies.get('token')
  
  const defaultHeaders = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  })

  if (response.status === 401) {
    Cookies.remove('token')
    window.location.href = '/auth/login'
    return null
  }

  return response
}

export const api = {
  // Auth işlemleri
  auth: {
    login: async (credentials) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
      const data = await response.json()
      if (response.ok && data.token) {
        Cookies.set('token', data.token)
      }
      return { data, ok: response.ok }
    },
    register: async (userData) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      return { data: await response.json(), ok: response.ok }
    },
    logout: () => {
      Cookies.remove('token')
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/auth/login'
    },
    getMe: async () => {
      const response = await fetchWithAuth('/auth/me')
      return response.json()
    }
  },

  // Tweet işlemleri
  tweets: {
    create: async (data) => {
      const response = await fetchWithAuth('/tweets', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      return response.json()
    },
    getAll: async () => {
      const response = await fetchWithAuth('/tweets')
      return response.json()
    },
    getUserTweets: async (userId) => {
      const response = await fetchWithAuth('/tweets')
      const data = await response.json()
      return {
        ...data,
        tweets: data.tweets.filter(tweet => tweet.user._id === userId || 
          (tweet.retweetData && tweet.retweetData.user === userId))
      }
    },
    like: async (tweetId) => {
      const response = await fetchWithAuth(`/tweets/like/${tweetId}`, {
        method: 'POST'
      })
      return response.json()
    },
    retweet: async (tweetId, comment = '') => {
      const response = await fetchWithAuth(`/tweets/retweet/${tweetId}`, {
        method: 'POST',
        body: JSON.stringify({ quoteContent: comment })
      })
      return response.json()
    },
    getBookmarks: async () => {
      const response = await fetchWithAuth('/tweets/bookmarks')
      return response.json()
    },
    bookmark: async (tweetId) => {
      const response = await fetchWithAuth(`/tweets/bookmark/${tweetId}`, {
        method: 'POST'
      })
      return response.json()
    },
    removeBookmark: async (tweetId) => {
      const response = await fetchWithAuth(`/tweets/bookmark/${tweetId}`, {
        method: 'DELETE'
      })
      return response.json()
    }
  },

  // Kullanıcı işlemleri
  user: {
    getProfile: async (username) => {
      const response = await fetchWithAuth(`/users/profile/${username}`)
      return response.json()
    },
    updateProfile: async (data) => {
      const response = await fetchWithAuth('/users/update', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      return response.json()
    },
    follow: async (userId) => {
      const response = await fetchWithAuth(`/users/follow/${userId}`, {
        method: 'POST'
      })
      return response.json()
    },
    uploadImage: async (type, formData) => {
      try {
        const response = await fetchWithAuth(`/users/upload/${type}`, {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('Resim yükleme başarısız')
        }
        
        return response.json()
      } catch (error) {
        console.error('Resim yükleme hatası:', error)
        throw error
      }
    }
  }
} 