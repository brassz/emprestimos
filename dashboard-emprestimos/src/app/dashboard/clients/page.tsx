'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Modal } from '@/components/Modal'
import { ClientForm } from '@/components/ClientForm'
import { supabase, Client } from '@/lib/supabase'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClient = async (clientData: Partial<Client>) => {
    setFormLoading(true)
    try {
      const { error } = await supabase
        .from('clients')
        .insert([clientData])

      if (error) throw error
      
      await fetchClients()
      setIsModalOpen(false)
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error)
      alert('Erro ao criar cliente: ' + error.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateClient = async (clientData: Partial<Client>) => {
    if (!editingClient) return
    
    setFormLoading(true)
    try {
      const { error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', editingClient.id)

      if (error) throw error
      
      await fetchClients()
      setIsModalOpen(false)
      setEditingClient(null)
    } catch (error: any) {
      console.error('Erro ao atualizar cliente:', error)
      alert('Erro ao atualizar cliente: ' + error.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)

      if (error) throw error
      
      await fetchClients()
    } catch (error: any) {
      console.error('Erro ao excluir cliente:', error)
      alert('Erro ao excluir cliente: ' + error.message)
    }
  }

  const openCreateModal = () => {
    setEditingClient(null)
    setIsModalOpen(true)
  }

  const openEditModal = (client: Client) => {
    setEditingClient(client)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingClient(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
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
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600">Gerencie seus clientes</p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Cliente</span>
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {clients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum cliente cadastrado</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {clients.map((client) => (
                <li key={client.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {client.name}
                          </p>
                          <p className="text-sm text-gray-500">{client.email}</p>
                          <p className="text-sm text-gray-500">
                            CPF: {client.cpf} | Tel: {client.phone}
                          </p>
                          <p className="text-xs text-gray-400">
                            Cadastrado em: {formatDate(client.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(client)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
        title={editingClient ? 'Editar Cliente' : 'Novo Cliente'}
      >
        <ClientForm
          client={editingClient || undefined}
          onSubmit={editingClient ? handleUpdateClient : handleCreateClient}
          onCancel={closeModal}
          loading={formLoading}
        />
      </Modal>
    </DashboardLayout>
  )
}