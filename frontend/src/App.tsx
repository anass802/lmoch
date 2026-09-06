
  import './App.css'
  import { BrowserRouter,useRoutes } from 'react-router-dom'
  import { ClientRoutes } from './routes/clientRoutes'
  import { adminRoutes } from './routes/adminRoutes'
  import Home from './pages/client/Home'
  import ScrollToTop from './components/ScrollToTop'
  import { CartProvider } from './context/CartContext'
  import { CheckoutProvider } from './context/CheckoutContext'

  function App() {
      const AppRoutes=()=>{
        const element=useRoutes([
          ...adminRoutes,
          ...ClientRoutes,
          {path:'*', element:<Home/>}
        ]);
        return element
      }

    return (
      <BrowserRouter>
          <ScrollToTop />
          <CartProvider>
          <CheckoutProvider>
            <AppRoutes />
          </CheckoutProvider>
            
          </CartProvider>
          
      </BrowserRouter>
    )
  }

  export default App
