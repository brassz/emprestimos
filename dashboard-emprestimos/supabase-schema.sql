-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  cpf VARCHAR(14) UNIQUE NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de empréstimos
CREATE TABLE IF NOT EXISTS loans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  installments INTEGER NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  paid_amount DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paid', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date DATE NOT NULL
);

-- Criar tabela de usuários (se não existir via auth)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para clientes
CREATE POLICY "Users can view all clients" ON clients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert clients" ON clients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update clients" ON clients
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete clients" ON clients
  FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas de segurança para empréstimos
CREATE POLICY "Users can view all loans" ON loans
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert loans" ON loans
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update loans" ON loans
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete loans" ON loans
  FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas de segurança para perfis de usuário
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Inserir alguns dados de exemplo
INSERT INTO clients (name, email, phone, cpf, address) VALUES
('João Silva', 'joao@example.com', '(11) 99999-9999', '123.456.789-01', 'Rua das Flores, 123'),
('Maria Santos', 'maria@example.com', '(11) 88888-8888', '987.654.321-02', 'Av. Paulista, 456'),
('Pedro Oliveira', 'pedro@example.com', '(11) 77777-7777', '456.789.123-03', 'Rua Augusta, 789');

INSERT INTO loans (client_id, amount, interest_rate, installments, total_amount, paid_amount, status, due_date) VALUES
((SELECT id FROM clients WHERE email = 'joao@example.com'), 5000.00, 2.5, 12, 6500.00, 2000.00, 'active', '2024-12-31'),
((SELECT id FROM clients WHERE email = 'maria@example.com'), 10000.00, 3.0, 24, 14400.00, 14400.00, 'paid', '2024-06-30'),
((SELECT id FROM clients WHERE email = 'pedro@example.com'), 3000.00, 2.0, 6, 3600.00, 0.00, 'overdue', '2024-01-15');