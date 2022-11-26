import {DishCheckoutLoginCallback, DishCheckout} from "../widgets";
import Login from './Login';

// Export all routes here
const router = [
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/checkout/:id",
        element: <DishCheckout />,
    },
    {
        path: "/checkout/login/callback/:id",
        element: <DishCheckoutLoginCallback />,
    },
];

export default router;