import type { RouteObject } from "react-router-dom";
import AdminLayout from "../layouts/Adminlayout";
import RevenueStockDashboard from "../pages/RevenueStockDashboard";
import { RequireAdmin } from "../api/auth/guards";
import ProductsPage from "../pages/ProductsPage";
import OrdersDashboard from "../pages/OrdersDashboard";
import CatListingsPage from "../pages/CatListingsPage";
import Events from "../pages/Event";
export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <RevenueStockDashboard /> },
      { path: "products", element: <ProductsPage /> },
      { path: "orders", element: <OrdersDashboard /> },
      {path:"cats",element:<CatListingsPage/>},
      {path:'events',element:<Events/>}


    ],
  },
];