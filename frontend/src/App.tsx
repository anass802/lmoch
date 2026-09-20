import './App.css'
import { BrowserRouter, useRoutes, HashRouter } from 'react-router-dom'
import { ClientRoutes } from './routes/clientRoutes'
import { adminRoutes } from './routes/adminRoutes'
import Home from './pages/client/Home'
import ScrollToTop from './components/ScrollToTop'
import { CartProvider } from './context/CartContext'
import { CheckoutProvider } from './context/CheckoutContext'
import { Capacitor } from "@capacitor/core"

function AppRoutes() {
  const element = useRoutes([
    ...adminRoutes,
    ...ClientRoutes,
    { path: '*', element: <Home /> }
  ]);
  return element;
}

function App() {
  const Router = Capacitor.isNativePlatform() ? HashRouter : BrowserRouter;

  return (
    <Router>
      <ScrollToTop />
      <CartProvider>
        <CheckoutProvider>
          <AppRoutes />
        </CheckoutProvider>
      </CartProvider>
    </Router>
  )
}

export default App