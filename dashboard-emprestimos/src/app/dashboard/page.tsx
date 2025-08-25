'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { MetricCard } from '@/components/MetricCard'
import { supabase } from '@/lib/supabase'
import { 
  DollarSign, 
  Wallet, 
  TrendingUp, 
  Users 
} from 'lucide-react'

interface DashboardMetrics {
  totalFaturado: number
  totalCaixa: number
  totalReceber: number
  totalClientes: number
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalFaturado: 0,
    totalCaixa: 0,
    totalReceber: 0,
    totalClientes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // Buscar total de clientes
        const { count: clientsCount } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })

        // Buscar dados dos empréstimos
        const { data: loans } = await supabase
          .from('loans')
          .select('amount, total_amount, paid_amount, status')

        if (loans) {
          const totalFaturado = loans
            .filter(loan => loan.status === 'paid')
            .reduce((sum, loan) => sum + loan.total_amount, 0)

          const totalCaixa = loans
            .reduce((sum, loan) => sum + loan.paid_amount, 0)

          const totalReceber = loans
            .filter(loan => loan.status === 'active')
            .reduce((sum, loan) => sum + (loan.total_amount - loan.paid_amount), 0)

          setMetrics({
            totalFaturado,
            totalCaixa,
            totalReceber,
            totalClientes: clientsCount || 0,
          })
        }
      } catch (error) {
        console.error('Erro ao buscar métricas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do seu negócio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Faturado"
            value={formatCurrency(metrics.totalFaturado)}
            icon={DollarSign}
            color="bg-green-500"
          />
          <MetricCard
            title="Total em Caixa"
            value={formatCurrency(metrics.totalCaixa)}
            icon={Wallet}
            color="bg-blue-500"
          />
          <MetricCard
            title="Total a Receber"
            value={formatCurrency(metrics.totalReceber)}
            icon={TrendingUp}
            color="bg-yellow-500"
          />
          <MetricCard
            title="Total de Clientes"
            value={metrics.totalClientes.toString()}
            icon={Users}
            color="bg-purple-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Resumo dos Empréstimos
          </h2>
          <div className="text-gray-600">
            <p>• Empréstimos ativos: {formatCurrency(metrics.totalReceber)} pendentes</p>
            <p>• Empréstimos pagos: {formatCurrency(metrics.totalFaturado)} concluídos</p>
            <p>• Total em carteira: {formatCurrency(metrics.totalCaixa + metrics.totalReceber)}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}