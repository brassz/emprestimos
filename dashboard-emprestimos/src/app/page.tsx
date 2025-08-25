'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { 
  Calculator, 
  Users, 
  TrendingUp, 
  Shield, 
  ArrowRight, 
  CheckCircle,
  BarChart3,
  Clock,
  DollarSign
} from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isHovered, setIsHovered] = useState(false)

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  const features = [
    {
      icon: <Calculator className="w-8 h-8 text-indigo-600" />,
      title: "Cálculos Automáticos",
      description: "Juros compostos, parcelas e valores totais calculados automaticamente"
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: "Gestão de Clientes",
      description: "Cadastro completo com histórico de empréstimos e informações pessoais"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-indigo-600" />,
      title: "Dashboard Intuitivo",
      description: "Métricas em tempo real: faturamento, receitas e status dos empréstimos"
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-600" />,
      title: "Segurança Total",
      description: "Autenticação segura e dados protegidos com Supabase"
    }
  ]

  const benefits = [
    "Controle total dos empréstimos",
    "Relatórios detalhados",
    "Interface responsiva",
    "Backup automático",
    "Suporte 24/7",
    "Atualizações gratuitas"
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Empréstimos</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => router.push('/login')}
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Login
                </button>
              )}
              <button
                onClick={handleGetStarted}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <span>Começar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Sistema de Gestão de
            <span className="text-indigo-600 block">Empréstimos</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gerencie seus empréstimos de forma profissional com cálculos automáticos, 
            controle de clientes e dashboard completo. Simplifique sua operação financeira.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span>Começar Agora</span>
              <ArrowRight className={`w-5 h-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
            </button>
            <button
              onClick={() => router.push('/login')}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-indigo-600 hover:text-indigo-600 transition-colors"
            >
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que escolher nosso sistema?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Desenvolvido com as melhores tecnologias para oferecer uma experiência 
              profissional e intuitiva
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-indigo-100">Seguro e Confiável</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-indigo-100">Disponível</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">0</div>
              <div className="text-indigo-100">Configuração</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Tudo que você precisa para gerenciar empréstimos
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleGetStarted}
                className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Começar Gratuitamente
              </button>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Dashboard Overview</h3>
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Total Faturado</span>
                    </div>
                    <span className="font-semibold text-gray-900">R$ 45.230,00</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">Clientes Ativos</span>
                    </div>
                    <span className="font-semibold text-gray-900">127</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <span className="text-gray-700">Empréstimos Ativos</span>
                    </div>
                    <span className="font-semibold text-gray-900">89</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para simplificar seus empréstimos?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Junte-se a centenas de usuários que já transformaram sua gestão financeira
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Começar Agora - É Gratuito
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Empréstimos</span>
              </div>
              <p className="text-gray-400">
                Sistema profissional de gestão de empréstimos para sua empresa.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Dashboard</li>
                <li>Clientes</li>
                <li>Empréstimos</li>
                <li>Relatórios</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentação</li>
                <li>Contato</li>
                <li>FAQ</li>
                <li>Status</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre</li>
                <li>Blog</li>
                <li>Carreiras</li>
                <li>Privacidade</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Sistema de Empréstimos. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}