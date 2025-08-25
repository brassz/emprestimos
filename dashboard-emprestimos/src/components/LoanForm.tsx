'use client'

import { useState, useEffect } from 'react'
import { Client, Loan } from '@/lib/supabase'

interface LoanFormProps {
  loan?: Loan
  clients: Client[]
  onSubmit: (loanData: Partial<Loan>) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function LoanForm({ loan, clients, onSubmit, onCancel, loading }: LoanFormProps) {
  const [formData, setFormData] = useState({
    client_id: loan?.client_id || '',
    amount: loan?.amount?.toString() || '',
    interest_rate: loan?.interest_rate?.toString() || '2.5',
    installments: loan?.installments?.toString() || '12',
    due_date: loan?.due_date || '',
  })
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    const amount = parseFloat(formData.amount) || 0
    const rate = parseFloat(formData.interest_rate) || 0
    const installments = parseInt(formData.installments) || 1
    
    // Cálculo simples de juros compostos
    const total = amount * Math.pow(1 + (rate / 100), installments)
    setTotalAmount(total)
  }, [formData.amount, formData.interest_rate, formData.installments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const loanData = {
      client_id: formData.client_id,
      amount: parseFloat(formData.amount),
      interest_rate: parseFloat(formData.interest_rate),
      installments: parseInt(formData.installments),
      total_amount: totalAmount,
      due_date: formData.due_date,
      status: 'active' as const,
    }

    await onSubmit(loanData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
          Cliente
        </label>
        <select
          id="client_id"
          name="client_id"
          required
          value={formData.client_id}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
        >
          <option value="">Selecione um cliente</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} - {client.cpf}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Valor do Empréstimo
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          required
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          placeholder="0,00"
        />
      </div>

      <div>
        <label htmlFor="interest_rate" className="block text-sm font-medium text-gray-700">
          Taxa de Juros (% ao mês)
        </label>
        <input
          type="number"
          id="interest_rate"
          name="interest_rate"
          required
          step="0.1"
          min="0"
          value={formData.interest_rate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="installments" className="block text-sm font-medium text-gray-700">
          Número de Parcelas
        </label>
        <input
          type="number"
          id="installments"
          name="installments"
          required
          min="1"
          value={formData.installments}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
          Data de Vencimento
        </label>
        <input
          type="date"
          id="due_date"
          name="due_date"
          required
          value={formData.due_date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
        />
      </div>

      {formData.amount && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-900">Resumo do Empréstimo</h4>
          <div className="mt-2 text-sm text-gray-600">
            <p>Valor emprestado: {formatCurrency(parseFloat(formData.amount) || 0)}</p>
            <p>Taxa: {formData.interest_rate}% ao mês</p>
            <p>Parcelas: {formData.installments}x</p>
            <p className="font-medium">Valor total: {formatCurrency(totalAmount)}</p>
            <p>Valor por parcela: {formatCurrency(totalAmount / (parseInt(formData.installments) || 1))}</p>
          </div>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : (loan ? 'Atualizar' : 'Criar Empréstimo')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}