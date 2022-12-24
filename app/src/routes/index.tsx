import {
    createBrowserRouter,
    RouterProvider,
    useNavigate,
  } from "react-router-dom";
import Login from './Login';
import CheckOutRoute from './CheckOut';
import CheckInRoute from './CheckIn';
import CheckOutApi from '../widgets/CheckOutApi';
import { useContext, useEffect } from "react";
import { FirebaseContext } from "../firebase";
import { Sidebar } from "../widgets/sidebar";

const AppRoute = () => {
    const fbContext = useContext(FirebaseContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!fbContext.user) {
            navigate("/login");
        }
    }, [fbContext.user]);

    return (
        <Sidebar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppRoute/>,
        children: [
            {
                path: "home",
                element: (
                    <CheckInRoute/>
                ),
            },
        ]
    },
    {
        path: "login",
        element: <Login/>
    },
]);

export default () => {
    return (
        <RouterProvider router={router} />
    )
}