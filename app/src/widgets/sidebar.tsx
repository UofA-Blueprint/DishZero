import { useContext } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom"; // TODO: convert <a> tags to <Link> components
import { FirebaseAuth, FirebaseContext, Role } from "../firebase";
import "../styles/sidebar.css"
import how_it_works_icon from "../assets/how_it_works.svg";
import logout_icon from "../assets/logout.svg";
import our_impact_icon from "../assets/our_impact.svg";
import home_icon from "../assets/home.svg";
import logo from "../assets/logo.svg";

export const Sidebar = () => {
  const fbContext = useContext(FirebaseContext);
  let showAdmin = false;
  let showVolunteer = false;
  if (fbContext?.role == Role.ADMIN) {
      showAdmin = true;
      showVolunteer = true;
  } else if (fbContext?.role == Role.VOLUNTEER) {
      showVolunteer = true
  }
  
  return (
    <Menu>
      <p
        className="memu-title"
        style={{
          textAlign: "left",
          position:"absolute"
        }}
      >
        <img style={{ paddingRight: 16, height: 32 }} src={logo} alt="" />
        DishZero
      </p>
      <a className="menu-item" href="/home">
        <p>MENU</p>
        <img style={{ paddingRight: 16 }} src={home_icon} alt="" />
        Home
      </a>
      <a className="menu-item" href="/dishes">
        <img style={{ paddingRight: 16 }} src=" " alt="" />
        My dishes
      </a>
      <div style={{ paddingTop: 280 }}></div>
      <a className="menu-item" href="/dishes" style={{}}>
        <img style={{ paddingRight: 16 }} src={how_it_works_icon} alt="" />
        How it works
      </a>
      <a className="menu-item" href="/dishes">
        <img src={our_impact_icon} style={{ paddingRight: 16 }} alt="" />
        Our impact
      </a>
      <button
        className="menu-item"
        onClick={() => {
          FirebaseAuth.signOut();
        }}
      >
        <img src={logout_icon} style={{ paddingRight: 16 }} alt="" />
        Logout
      </button>
    </Menu>
  );
};
