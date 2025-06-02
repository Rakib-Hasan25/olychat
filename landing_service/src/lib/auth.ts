import { createBrowserClient } from "@supabase/ssr";
    
export const createSupabaseClient = () => {
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_ANON_KEY as string
  );
};

const checkUrlAvailability = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.log(`URL ${url} is not available:`, error);
    return false;
  }
};

export const handleGetStarted = async () => {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      console.log("user is authenticated");
      const dashboardUrl = `${import.meta.env.VITE_MAIN_FRONTEND_URL}/dashboard`;
      const isAvailable = await checkUrlAvailability(dashboardUrl);
      
      if (isAvailable) {
        window.location.href = dashboardUrl;
      } else {
        throw new Error("Dashboard URL is not available");
      }
    } else {
      console.log("user is not authenticated");
      const loginUrl = `${import.meta.env.VITE_MAIN_FRONTEND_URL}/auth/login`;
      const isAvailable = await checkUrlAvailability(loginUrl);
      
      if (isAvailable) {
        window.location.href = loginUrl;
      } else {
        throw new Error("Login URL is not available");
      }
    }
  } catch (error) {
    console.log("Server or URL is not available at the moment");
    // Show local setup message regardless of authentication status
    const message = "The server or requested URL is currently not available. Please try setting up locally:\n\n" +
      "1. Setup Docker\n" +
      "2. Setup Supabase\n" +
      "3. Clone the repository\n" +
      "4. Set up environment variables\n" +
      "5. Run the command docker compose up --build\n\n" +
      "For more details, please check the README.md file.";
    
    // Use a more modern way to show the message
    const shouldProceed = window.confirm(message + "\n\nWould you like to proceed with local setup?");
    
    if (shouldProceed) {
      // Open the README.md in a new tab
      window.open('https://github.com/Rakib-Hasan25/olychat', '_blank');
    }
  }
}; 