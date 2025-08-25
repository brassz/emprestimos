import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Verificar se as variáveis de ambiente estão configuradas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Se as variáveis não estiverem configuradas, permitir acesso direto
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured in middleware')
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    // Verificar autenticação para rotas protegidas
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Se não estiver autenticado e tentando acessar dashboard, redirecionar para login
    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Se estiver autenticado e tentando acessar login, redirecionar para dashboard
    if (user && request.nextUrl.pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirecionar raiz para dashboard se autenticado, senão para login
    if (request.nextUrl.pathname === '/') {
      if (user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    return supabaseResponse
  } catch (error) {
    console.error('Middleware error:', error)
    // Em caso de erro, permitir acesso direto
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}