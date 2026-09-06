import type { RouteObject } from "react-router-dom";
import ClientLayout from "../layouts/ClientLayout";
import Home from "../pages/client/Home";
import CategoryProducts from "../pages/client/CategoryProducts";
import ViewProductDeatils from "../pages/client/ViewProductDetails";
import Account from "../pages/Account";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Checkout from "../pages/client/Checkout";
import RevenueStockDashboard from "../pages/RevenueStockDashboard";
import CatsPage from "../pages/client/CatsPage";
import Promos from "../pages/client/Promos";



export const ClientRoutes:RouteObject[]=[
    {
        path:'/',
        element:(
            <ClientLayout />
        ),
        children:[
            {index:true, element:<Home/>},
            { path: '/categories/:slug/:species_id/:category_slug?', element: <CategoryProducts/> },   
            {path:'get-product-details/:slug', element:<ViewProductDeatils />},
            {path:'auth/account/login',element:<Login/>},
            {path:'auth/acount',element:<Account />},
            {path:'auth/account/register',element:<Register/>},
            {path:'/checkout',element:<Checkout/>},
            {path:'/dashboard',element:<RevenueStockDashboard/>},
            {path:'/cats', element:<CatsPage/>},
            {path:'/promotions',element:<Promos/>}
        ]
        
    }
]