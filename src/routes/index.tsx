import {DishCheckoutLoginCallback, DishCheckout} from "../widgets";
import Checkout from "./CheckOut";
import CheckIn from "./CheckIn";
import Login from './Login';

// Export all routes here
const router = [
    {
        path: "/",
        element: <>
            <Login />
            <Checkout />
            <CheckIn />
        </>,
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