import {DishCheckoutLoginCallback, DishCheckout} from "../widgets";

// Export all routes here
const router = [
    {
        path: "/",
        element: <div>DishZero!</div>,
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