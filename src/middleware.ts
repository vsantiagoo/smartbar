import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const DEMO_COOKIE = "smartbar_demo_admin";

/**
 * Protege /admin/*. Com Supabase: renova a sessão e exige usuário.
 * Em modo demo (sem env): exige o cookie de demonstração.
 * A verificação de VÍNCULO com o hotel acontece em requireAdmin() + RLS.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseMode = Boolean(url && anon && process.env.SUPABASE_SERVICE_ROLE_KEY);

  let response = NextResponse.next({ request });
  let authenticated: boolean;

  if (supabaseMode) {
    const supabase = createServerClient(url!, anon!, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    const { data } = await supabase.auth.getUser();
    authenticated = Boolean(data.user);
  } else {
    authenticated = request.cookies.get(DEMO_COOKIE)?.value === "1";
  }

  if (!authenticated && !isLogin) {
    const login = request.nextUrl.clone();
    login.pathname = "/admin/login";
    login.search = "";
    return NextResponse.redirect(login);
  }
  if (authenticated && isLogin) {
    const home = request.nextUrl.clone();
    home.pathname = "/admin";
    return NextResponse.redirect(home);
  }
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
