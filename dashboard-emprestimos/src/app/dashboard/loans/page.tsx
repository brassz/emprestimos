'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Modal } from '@/components/Modal'
import { LoanForm } from '@/components/LoanForm'
import { supabase, Client, Loan } from '@/lib/supabase'
import { Plus, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react'

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Buscar empréstimos com dados do cliente
      const { data: loansData, error: loansError } = await supabase
        .from('loans')
        .select(`
          *,
          client:clients(*)
        `)
        .order('created_at', { ascending: false })

      if (loansError) throw loansError

      // Buscar todos os clientes para o formulário
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('name')

      if (clientsError) throw clientsError

      setLoans(loansData || [])
      setClients(clientsData || [])
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLoan = async (loanData: Partial<Loan>) => {
    setFormLoading(true)
    try {
      const { error } = await supabase
        .from('loans')
        .insert([loanData])

      if (error) throw error
      
      await fetchData()
      setIsModalOpen(false)
    } catch (error: any) {
      console.error('Erro ao criar empréstimo:', error)
      alert('Erro ao criar empréstimo: ' + error.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateLoan = async (loanData: Partial<Loan>) => {
    if (!editingLoan) return
    
    setFormLoading(true)
    try {
      const { error } = await supabase
        .from('loans')
        .update(loanData)
        .eq('id', editingLoan.id)

      if (error) throw error
      
      await fetchData()
      setIsModalOpen(false)
      setEditingLoan(null)
    } catch (error: any) {
      console.error('Erro ao atualizar empréstimo:', error)
      alert('Erro ao atualizar empréstimo: ' + error.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteLoan = async (loanId: string) => {
    if (!confirm('Tem certeza que deseja excluir este empréstimo?')) return

    try {
      const { error } = await supabase
        .from('loans')
        .delete()
        .eq('id', loanId)

      if (error) throw error
      
      await fetchData()
    } catch (error: any) {
      console.error('Erro ao excluir empréstimo:', error)
      alert('Erro ao excluir empréstimo: ' + error.message)
    }
  }

  const handleMarkAsPaid = async (loanId: string, totalAmount: number) => {
    try {
      const { error } = await supabase
        .from('loans')
        .update({ 
          status: 'paid',
          paid_amount: totalAmount
        })
        .eq('id', loanId)

      if (error) throw error
      
      await fetchData()
    } catch (error: any) {
      console.error('Erro ao marcar como pago:', error)
      alert('Erro ao marcar como pago: ' + error.message)
    }
  }

  const openCreateModal = () => {
    setEditingLoan(null)
    setIsModalOpen(true)
  }

  const openEditModal = (loan: Loan) => {
    setEditingLoan(loan)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingLoan(null)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Ativo
          </span>
        )
      case 'paid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Pago
          </span>
        )
      case 'overdue':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Vencido
          </span>
        )
      default:
        return null
    }
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Empréstimos</h1>
            <p className="text-gray-600">Gerencie os empréstimos dos seus clientes</p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Empréstimo</span>
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum empréstimo cadastrado</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {loans.map((loan) => (
                <li key={loan.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">
                              {loan.client?.name}
                            </p>
                            {getStatusBadge(loan.status)}
                          </div>
                          <p className="text-sm text-gray-500">
                            CPF: {loan.client?.cpf} | Email: {loan.client?.email}
                          </p>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p>Valor emprestado: {formatCurrency(loan.amount)}</p>
                              <p>Valor total: {formatCurrency(loan.total_amount)}</p>
                            </div>
                            <div>
                              <p>Taxa: {loan.interest_rate}% a.m.</p>
                              <p>Parcelas: {loan.installments}x</p>
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p>Valor pago: {formatCurrency(loan.paid_amount)}</p>
                              <p>Pendente: {formatCurrency(loan.total_amount - loan.paid_amount)}</p>
                            </div>
                            <div>
                              <p>Criado em: {formatDate(loan.created_at)}</p>
                              <p>Vencimento: {formatDate(loan.due_date)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {loan.status === 'active' && (
                        <button
                          onClick={() => handleMarkAsPaid(loan.id, loan.total_amount)}
                          className="text-green-600 hover:text-green-900 text-xs"
                        >
                          Marcar como Pago
                        </button>
                      )}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(loan)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLoan(loan.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingLoan ? 'Editar Empréstimo' : 'Novo Empréstimo'}
      >
        <LoanForm
          loan={editingLoan || undefined}
          clients={clients}
          onSubmit={editingLoan ? handleUpdateLoan : handleCreateLoan}
          onCancel={closeModal}
          loading={formLoading}
        />
      </Modal>
    </DashboardLayout>
  )
}