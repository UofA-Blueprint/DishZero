import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import LoginRoute from './login'
import HomeRoute from './home'
import BorrowRoute from './borrow'
import ReturnRoute from './return'
import Admin from './admin'
import { Sidebar } from '../widgets/sidebar'
import { Error404 } from './misc'
import { AuthProvider, useAuth } from '../contexts/AuthContext'

const enum Role {
    admin = 'admin',
    volunteer = 'volunteer',
    customer = 'customer',
}

interface PermissionProps {
    validator: (role: string | undefined) => boolean
}

const AuthLayout = () => {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    )
}

const UserRoute = () => {
    const { currentUser } = useAuth()

    if (currentUser) {
        return (
            <>
                <Sidebar />
                <Outlet />
            </>
        )
    }

    return <LoginRoute />
}

const PermissionsRoute = (props: PermissionProps) => {
    const { currentUser } = useAuth()
    if (props.validator(currentUser?.role)) {
        return <Outlet />
    }
    return <Error404 />
}

const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        errorElement: <Error404 />,
        children: [
            {
                path: '/',
                element: <UserRoute />,
                errorElement: <Error404 />,
                children: [
                    {
                        index: true,
                        element: <HomeRoute />,
                    },
                    {
                        path: '/home',
                        element: <HomeRoute />,
                    },
                    {
                        path: '/borrow',
                        element: <BorrowRoute />,
                        loader: async ({ request }) => {
                            const url = new URL(request.url)
                            const qid = url.searchParams.get('q')
                            if (!qid) {
                                return null
                            }

                            try {
                                // const tid = await DishAPI.addDishBorrow(qid, null);
                                const tid = 1
                                return { qid: qid, tid: tid }
                            } catch (e) {
                                console.log('Unable to immediately borrow:', e)
                                return { qid: qid, error: e }
                            }
                        },
                    },
                    {
                        path: '/volunteer',
                        element: <PermissionsRoute validator={(r) => r === Role.volunteer || r === Role.admin} />,
                        children: [
                            {
                                // TODO: wrap in "VOLUNTEER" route
                                path: '/volunteer/return',
                                element: <ReturnRoute noTimer={undefined} />,
                            },
                        ],
                    },
                ],
            },
            {
                path: '/admin',
                element: <PermissionsRoute validator={(r) => r === Role.admin} />,
                errorElement: <Error404 />,

                children: [
                    {
                        path: '/admin',
                        element: <Admin path={''} />,
                    },
                    {
                        path: '/admin/dishes',
                        element: <Admin path={'dishes'} />,
                    },
                    {
                        path: '/admin/users',
                        element: <Admin path={'users'} />,
                    },
                    {
                        path: '/admin/email',
                        element: <Admin path={'email'} />,
                    },
                ],
            },
            {
                path: '/login',
                element: <LoginRoute />,
            },
            {
                path: '/login/:transaction_id',
                element: <LoginRoute />,
            },
        ],
    },
])

export default () => {
    return <RouterProvider router={router} fallbackElement={<Error404 />} />
}
