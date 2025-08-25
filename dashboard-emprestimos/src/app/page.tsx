'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (!loading && !redirecting) {
      setRedirecting(true)
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [user, loading, router, redirecting])

  // Fallback: se demorar muito, redirecionar diretamente
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!redirecting) {
        setRedirecting(true)
        router.push('/login')
      }
    }, 3000)

    return () => clearTimeout(timeout)
  }, [redirecting, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando...</p>
        <p className="mt-2 text-sm text-gray-500">Redirecionando para login...</p>
      </div>
    </div>
  )
}