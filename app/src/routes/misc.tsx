import { useContext } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../firebase";
import leaf_icon from "../assets/leaf.svg";

const Error404 = () => {
  const fbContext = useContext(FirebaseContext);

  return (
    <>
      <img src={leaf_icon} alt="" />
      <h1>404</h1>
      <h2>Page not found!</h2>

      {fbContext?.user ? (
        // logged in
        <>
          <p>
            We're sorry. The page you requested could not be found. Please go
            back to the homepage.
          </p>
          <Link to="/">
            <button>Home</button>
          </Link>
        </>
      ) : (
        // not logged in
        <>
          <p>
            We're sorry. The page you requested could not be found. Please
            login.
          </p>
          <Link to="/">
            <button>Login</button>
          </Link>
        </>
      )}
    </>
  );
};

const AdminOnMobile = () => {
  return <p>Hello Admin, you are on mobile!</p>;
};

const WelcomePage = () => {
  return (
    <div>
      <p>Welcome Prompt</p>
      <Link to="/home" />
    </div>
  );
};

export { Error404, AdminOnMobile, WelcomePage };
