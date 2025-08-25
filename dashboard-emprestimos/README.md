# Dashboard Empréstimos

Sistema de gestão de empréstimos desenvolvido com Next.js e Supabase.

## Configuração das Variáveis de Ambiente

Para que o sistema funcione corretamente, você precisa configurar as seguintes variáveis de ambiente:

### No Vercel:

1. Acesse o dashboard do seu projeto no Vercel
2. Vá para Settings > Environment Variables
3. Adicione as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### Localmente:

Crie um arquivo `.env.local` na raiz do projeto com:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

## Como obter as credenciais do Supabase:

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto ou acesse um existente
3. Vá para Settings > API
4. Copie a URL do projeto e a anon key

## Problemas comuns:

### Página de login não aparece:
- Verifique se as variáveis de ambiente estão configuradas corretamente no Vercel
- Certifique-se de que o projeto foi redeployado após adicionar as variáveis
- Verifique os logs do Vercel para identificar erros

### Erro de autenticação:
- Verifique se as credenciais do Supabase estão corretas
- Certifique-se de que o projeto Supabase está ativo

## Deploy:

1. Faça push das alterações para o GitHub
2. O Vercel fará o deploy automaticamente
3. Configure as variáveis de ambiente no Vercel
4. Faça um novo deploy se necessário

## Tecnologias utilizadas:

- Next.js 15
- React 19
- Supabase
- Tailwind CSS
- TypeScript