import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import LoginRoute from "./login";
import HomeRoute from "./home";
import BorrowRoute from "./borrow";
import ReturnRoute from "./return";
import Admin from "./admin";
import { useContext } from "react";
import { FirebaseContext, Role } from "../firebase";
import { Sidebar } from "../widgets/sidebar";
import { Error404 } from "./misc";
import DishAPI from "../features/api";
import Dishes from "../admin/dishes";
import Email from "../admin/email";
import Users from "../admin/users";

const UserRoute = () => {
  const fbContext = useContext(FirebaseContext);

  if (fbContext?.user) {
    return (
      <>
        {
          //<Sidebar />
        }
        <Outlet />
      </>
    );
  }

  return <LoginRoute />;
};

const PermissionsRoute = (props: any) => {
  const fbContext = useContext(FirebaseContext);

  if (props?.validator && props.validator(fbContext?.role)) {
    return <Outlet />;
  }
  return <Error404 />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserRoute />,
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        element: <HomeRoute />,
      },
      {
        path: "/home",
        element: <HomeRoute />,
      },
      {
        // will be removed here after the frontend for this page is completed
        path: "/admin/users",
        element: <Users />,
      },
      {
        path: "/borrow",
        element: <BorrowRoute />,
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const qid = url.searchParams.get("q");
          if (!qid) {
            return null;
          }

          try {
            const tid = await DishAPI.addDishBorrow(qid, null);
            return { qid: qid, tid: tid };
          } catch (e) {
            console.log("Unable to immediately borrow:", e);
            return { qid: qid, error: e };
          }
        },
      },
      {
        path: "/volunteer",
        element: (
          <PermissionsRoute
            validator={(r) => r == Role.VOLUNTEER || r == Role.ADMIN}
          />
        ),
        children: [
          {
            // TODO: wrap in "VOLUNTEER" route
            path: "/volunteer/return",
            element: <ReturnRoute />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <PermissionsRoute validator={(r) => r == Role.ADMIN} />,
    children: [
      // TODO: put admin related children here
      {
        path: "/admin",
        element: <Admin />,
      }, {
        path: "/admin/dishes",
        element: <Dishes />,
      }, {
        path: "/admin/users",
        element: <Users />,
      }, {
        path: "/admin/email",
        element: <Email />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginRoute />,
  },
  {
    path: "/login/:transaction_id",
    element: <LoginRoute />,
  },
]);

export default () => {
  return <RouterProvider router={router} fallbackElement={<Error404 />} />;
};
