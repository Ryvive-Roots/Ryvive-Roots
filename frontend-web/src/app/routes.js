import { createBrowserRouter } from "react-router-dom";
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Story from './pages/Story';
import Menu from './pages/Menu';
import Subscription from './pages/Subscription';
import Franchise from './pages/Franchise';
import Career from './pages/Career';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard1 from './pages/Dashboard1';
import SubscriptionCheckout from './pages/SubscriptionCheckout';
export const router = createBrowserRouter([
    {
        path: '/login',
        Component: Login,
    },
    {
        path: '/admin',
        Component: AdminDashboard,
    },
    {
        path: '/',
        Component: Layout,
        children: [
            { index: true, Component: Home },
            { path: 'story', Component: Story },
            { path: 'menu', Component: Menu },
            { path: 'subscription', Component: SubscriptionCheckout },
            { path: 'franchise', Component: Franchise },
            { path: 'career', Component: Career },
            { path: 'contact', Component: Contact },
            { path: 'dashboard', Component: Dashboard1 },
            { path: '*', Component: Home },
        ],
    },
]);
