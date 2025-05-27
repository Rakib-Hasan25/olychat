import { createBrowserClient } from "@supabase/ssr";
    
export const createSupabaseClient = () => {
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_ANON_KEY as string
  );
};

export const handleGetStarted = async () => {
    console.log( import.meta.env.VITE_SUPABASE_URL )
    console.log(import.meta.env.VITE_MAIN_FRONTEND_URL)
  const supabase = createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    console.log("user is authenticated")
    // If user is authenticated, redirect to dashboard
    window.location.href = `${import.meta.env.VITE_MAIN_FRONTEND_URL}/dashboard`;
  } 
  else {
    console.log("user is not authenticated")
    // If user is not authenticated, redirect to login
    window.location.href = `${import.meta.env.VITE_MAIN_FRONTEND_URL}/auth/login`;
  }
}; 