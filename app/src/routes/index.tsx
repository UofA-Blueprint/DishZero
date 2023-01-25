import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";
import LoginRoute from "./login";
import HomeRoute from "./home";
import BorrowRoute from "./borrow";
import ReturnRoute from "./return";
import UserEditRoute from "./admin/modify-user";
import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../firebase";
import { Sidebar } from "../widgets/sidebar";
import DishAPI from "../features/api";
import { getAuth, User } from "firebase/auth";

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
      <Outlet />
    </>
  );
};
const checkAdmin = async (user: User) => {
  console.log("CALLED");
  let idToken = await user.getIdToken(true);
  console.log(idToken);
  const rest = await fetch("http://localhost:8000/api/v1/whoami", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: idToken }),
  });
  console.log(rest);
  //     .then(response => response.json())
  //     .then(data => this.setState({ totalReactPackages: data.total }));
};
const AdminRoute = () => {
  const fbContext = useContext(FirebaseContext);
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<boolean | null>(false);

  useEffect(() => {
    //     console.log(fbContext?.user?.getIdToken(true));
    if (fbContext?.user) {
      console.log(fbContext?.user);
      checkAdmin(fbContext?.user);
      // //         const uid = fbContext?.user?.uid;
      // //         await DishAPI.checkAdmin(uid);
    }
  }, [fbContext?.user]);
  // let idToken = await fbContext?.user.getIdToken(true);
  // useEffect(() => {
  //     fetch('http://localhost:8000/api/v1/whoami',{"method":  "POST",
  //     "headers": { "Content-Type": "application/json" },
  //     "body":    JSON.stringify({ "idToken": idToken })})
  //     .then(response => response.json())
  //     .then(data => this.setState({ totalReactPackages: data.total }));
  // checkAdmin
  // }, []);

  return <>Are you an admin?</>;
  // // console.log(fbContext?.user?.toJSON());
  // if (!fbContext?.user) {
  //     navigate("/login");
  // }
  // const uid = fbContext?.user?.uid;
  // await DishAPI.checkAdmin(uid);
  // useEffect(() => {
  //     if (!fbContext?.user) {
  //         navigate("/login");
  //     }
  // }, [fbContext?.user]);
  // return (
  //     <>
  //         <Sidebar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
  //         <Outlet/>
  //     </>
  // )
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserRoute />,
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
        path: "/borrow",
        element: <BorrowRoute />,
      },
      {
        path: "/return",
        element: <ReturnRoute />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginRoute />,
  },
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        index: true,
        element: <HomeRoute />,
      },
      {
        path: "editUser",
        element: <UserEditRoute />,
      },
    ],
  },
]);

export default () => {
  return <RouterProvider router={router} />;
};
