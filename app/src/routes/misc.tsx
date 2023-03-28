import { useContext } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../firebase";
import leaf_icon from "../assets/leaf.svg";
import "../styles/error404.css";

const Error404 = () => {
  const fbContext = useContext(FirebaseContext);

  return (
    <div className="error404-wrapper d-flex flex-column align-items-center justify-content-center px-4">
      <img src={leaf_icon} alt="" />
      <h1 className="my-3 text-center fw-semibold heading-404">404</h1>
      <h2 className="my-2 text-center fw-medium subheading-404">
        Page not found!
      </h2>

      {fbContext?.user ? (
        // logged in
        <>
          <p className="m-0 text-center text-404">
            We're sorry. The page you requested could not be found. Please go
            back to the homepage.
          </p>
          <Link to="/" className="mt-4">
            <button type="button" className="btn-404">
              Home
            </button>
          </Link>
        </>
      ) : (
        // not logged in
        <>
          <p className="m-0 text-center text-404">
            We're sorry. The page you requested could not be found. Please
            login.
          </p>
          <Link to="/" className="mt-4">
            <button type="button" className="btn-404">
              Login
            </button>
          </Link>
        </>
      )}
    </div>
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
