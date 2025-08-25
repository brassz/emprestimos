# Dashboard de Empréstimos

Sistema completo de gestão de empréstimos com autenticação, CRUD de clientes e controle financeiro.

## 🚀 Funcionalidades

- **Autenticação**: Sistema de login/registro com Supabase Auth
- **Dashboard**: Métricas financeiras (total faturado, em caixa, a receber, clientes)
- **Gestão de Clientes**: CRUD completo com informações pessoais
- **Gestão de Empréstimos**: Criação, edição e controle de empréstimos com cálculo de juros
- **Interface Responsiva**: Design moderno com Tailwind CSS

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel
- **UI Components**: Lucide React (ícones)

## 📊 Estrutura do Banco de Dados

### Tabelas Principais:

1. **clients** - Informações dos clientes
   - id, name, email, phone, cpf, address, created_at

2. **loans** - Empréstimos
   - id, client_id, amount, interest_rate, installments, total_amount, paid_amount, status, created_at, due_date

3. **user_profiles** - Perfis de usuários autenticados

## 🚀 Como Executar

### Pré-requisitos

1. Node.js 18+ instalado
2. Conta no Supabase
3. Conta no Vercel (para deploy)

### Configuração Local

1. **Clone o repositório**
   ```bash
   git clone <seu-repositorio>
   cd dashboard-emprestimos
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env.local` na raiz do projeto:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://mhtxyxizfnxupwmilith.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1odHh5eGl6Zm54dXB3bWlsaXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzIzMDYsImV4cCI6MjA3MTcwODMwNn0.s1Y9kk2Va5EMcwAEGQmhTxo70Zv0o9oR6vrJixwEkWI
   ```

4. **Configure o banco de dados no Supabase**
   - Acesse o painel do Supabase
   - Vá em SQL Editor
   - Execute o script SQL encontrado em `supabase-schema.sql`

5. **Execute o projeto**
   ```bash
   npm run dev
   ```
   O projeto estará disponível em `http://localhost:3000`

## 🌐 Deploy no Vercel

### Método 1: Via GitHub (Recomendado)

1. **Push para o GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Conectar ao Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Conecte sua conta GitHub
   - Importe o repositório
   - Configure as variáveis de ambiente:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Método 2: Via Vercel CLI

1. **Instale o Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Faça login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Configure as variáveis de ambiente**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

## 📝 Como Usar

### 1. Acesso Inicial
- Acesse a URL do projeto
- Será redirecionado para a página de login
- Crie uma conta ou faça login

### 2. Dashboard Principal
- Visualize métricas financeiras em tempo real
- Total faturado, em caixa, a receber e número de clientes

### 3. Gestão de Clientes
- Acesse "Clientes" no menu lateral
- Adicione novos clientes com informações completas
- Edite ou exclua clientes existentes

### 4. Gestão de Empréstimos
- Acesse "Empréstimos" no menu lateral
- Crie novos empréstimos selecionando um cliente
- Configure valor, taxa de juros, parcelas e vencimento
- Marque empréstimos como pagos quando necessário

### 5. Cálculos Automáticos
- O sistema calcula automaticamente:
  - Valor total com juros compostos
  - Valor por parcela
  - Valores pendentes e pagos
  - Métricas do dashboard

## 🔧 Personalização

### Modificar Taxa de Juros Padrão
Edite o arquivo `src/components/LoanForm.tsx` linha 15:
```typescript
interest_rate: loan?.interest_rate?.toString() || '2.5', // Altere aqui
```

### Adicionar Novos Campos
1. Atualize as interfaces em `src/lib/supabase.ts`
2. Modifique as tabelas no Supabase
3. Atualize os formulários correspondentes

### Customizar UI
- Cores: Modifique as classes Tailwind nos componentes
- Layout: Ajuste `src/components/DashboardLayout.tsx`
- Ícones: Substitua os ícones do Lucide React

## 🔒 Segurança

- **RLS (Row Level Security)** habilitado em todas as tabelas
- **Autenticação** obrigatória para todas as operações
- **Validação** de dados no frontend e backend
- **Sanitização** automática via Supabase

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 Mobile (smartphones)
- 📱 Tablet 
- 💻 Desktop
- 🖥️ Telas grandes

## 🐛 Troubleshooting

### Erro de Conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo

### Erro de Autenticação
- Verifique se o RLS está configurado corretamente
- Confirme se as políticas de segurança estão ativas

### Erro de Deploy
- Verifique se todas as dependências estão no package.json
- Confirme se as variáveis de ambiente estão configuradas no Vercel

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação do [Next.js](https://nextjs.org/docs)
2. Consulte a documentação do [Supabase](https://supabase.com/docs)
3. Revisite este README para configurações

---

**Desenvolvido com ❤️ usando Next.js e Supabase**