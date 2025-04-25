'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BsTwitter } from 'react-icons/bs'
import { api } from '@/utils/api'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { ok, data } = await api.auth.register(formData)
      
      if (ok) {
        router.push('/auth/login')
      } else {
        setError(data.message || 'Kayıt oluşturulamadı')
      }
    } catch (err) {
      setError('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-black p-8 rounded-lg w-full max-w-md">
        <div className="flex justify-center mb-8">
          <BsTwitter className="text-white text-4xl" />
        </div>
        <h1 className="text-white text-3xl font-bold mb-8 text-center">Twitter'a kaydol</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Ad Soyad"
              className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Kullanıcı adı"
              className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="E-posta"
              className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Şifre"
              className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : 'Kaydol'}
          </button>
        </form>

        <p className="text-gray-500 text-center mt-8">
          Zaten bir hesabın var mı?{' '}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  )
} 