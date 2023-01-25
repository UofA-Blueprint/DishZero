import {
    createBrowserRouter,
    Outlet,
    RouterProvider,
    useLocation,
    useNavigate,
  } from "react-router-dom";
import LoginRoute from './login';
import HomeRoute from './home';
import BorrowRoute from './borrow';
import ReturnRoute from './return';
import UserEditRoute from './admin/modify-user';
import { useContext, useEffect } from "react";
import { FirebaseContext } from "../firebase";
import { Sidebar } from "../widgets/sidebar";

const UserRoute = () => {
    const fbContext = useContext(FirebaseContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!fbContext?.user) {
            navigate("/login");
        }
    }, [fbContext?.user]);

    return (
        <>
            <Sidebar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
            <Outlet/>
        </>
    )
}
const AdminRoute = () => {
    const fbContext = useContext(FirebaseContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!fbContext?.user) {
            navigate("/login");
        }
    }, [fbContext?.user]);

    return (
        <>
            <Sidebar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
            <Outlet/>
        </>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <UserRoute/>,
        children: [
            {
                index: true,
                element: <HomeRoute/>,
            },
            {
                path: "/home",
                element: <HomeRoute/>,
            },
            {
                path: "/borrow",
                element: <BorrowRoute/>,
            },
            {
                path: "/return",
                element: <ReturnRoute/>,
            },
            {
                path: "/admin",
                element: <AdminRoute/>,
                children: [
                    {
                        path: '/editUser',
                        element: <UserEditRoute/>
                    }
                ]
            }
        ]
    },
    
    {
        path: "/login",
        element: <LoginRoute/>
    },
]);

export default () => {
    return (
        <RouterProvider router={router} />
    )
}