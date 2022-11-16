import {QRCodeCheckout, DishCheckout} from "../widgets";

// Export all routes here
const router = [
    {
        path: "/",
        element: <div>Hello world!</div>,
    },
    {
        path: "/checkout/:id",
        element: <DishCheckout />,
    },
    {
        path: "/QRCodeScanCheckout/:id",
        element: <QRCodeCheckout />,
    },
];

export default router;