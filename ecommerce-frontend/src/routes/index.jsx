import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/AuthPage';
import App from '../App';
import ProductDetailPage from '../pages/ProductDetailPage';
import CategoriesPage from '../pages/CategoriesPage';
import AccountDetails from '../pages/AccountDetails';
import EditProduct from '../components/EditProduct/EditProduct';
import ProfilePage from '../pages/ProfilePage';
import MyAdsPage from '../pages/MyAdsPage';
import OrdersPage from '../pages/OrdersPage';
import HelpnSupportPage from '../pages/HelpnSupportPage';
import CartPage from '../pages/CartPage';
import UserDetails from '../components/Social/UserDetails';
import ChatWrapper from '../components/Social/ChatWrapper';
import Notifications from '../components/Notifications/Notifications';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'cart',
        element: <CartPage />
      },
      {
        path: 'user/:id',
        element: <UserDetails />,
        children: [
          {
            path: 'chat',
            element: <ChatWrapper />
          }
        ]
      },
      {
        path: '',
        element: <HomePage />,
        children: [
          {
            path: 'categories',
            element: <CategoriesPage />
          }
        ]
      },
      {
        path: '/product/:id',
        element: <ProductDetailPage />
      },
      {
        path: 'auth',
        element: <AuthPage />
      },
      {
        path: 'account',
        element: <AccountDetails />,
        children: [
          { path: 'profile', element: <ProfilePage /> },
          { path: 'helpnSupport', element: <HelpnSupportPage /> },
          {
            path: 'myads',
            element: <MyAdsPage />,
            children: [
              { path: 'editproduct/:productId', element: <EditProduct /> },
              { path: 'editproduct', element: <EditProduct /> }
            ]
          },
          {
            path: 'orders',
            element: <OrdersPage />
          }
        ]
      },
      {
        path: 'notifications',
        element: <Notifications />
      }
    ]
  }
]);

export default router;
