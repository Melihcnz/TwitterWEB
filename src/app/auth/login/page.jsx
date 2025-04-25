'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/utils/api'

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { ok, data } = await api.auth.login(formData)
      if (ok) {
        router.push('/')
      } else {
        setError(data.message || 'Giriş yapılırken bir hata oluştu')
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center">Twitter'a giriş yap</h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="E-posta"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            required
          />
        </div>
        
        <div>
          <input
            type="password"
            placeholder="Şifre"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 bg-transparent border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-full font-semibold ${
            loading
              ? 'bg-blue-500/50 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } transition-colors`}
        >
          {loading ? 'Giriş yapılıyor...' : 'Giriş yap'}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-500">
        Hesabın yok mu?{' '}
        <Link href="/auth/register" className="text-blue-500 hover:underline">
          Kaydol
        </Link>
      </p>
    </div>
  )
} 