import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
})

function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
          <Component {...pageProps} />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
