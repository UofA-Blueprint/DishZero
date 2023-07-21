import { useContext } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom"; // TODO: convert <a> tags to <Link> components
import { FirebaseAuth, FirebaseContext, Role } from "../firebase";
import "../styles/sidebar.css"
import how_it_works_icon from "../assets/how_it_works.png";
import logout_icon from "../assets/logout.svg";
import our_impact_icon from "../assets/our_impact.png";
import home_icon from "../assets/home.png";
import admin_panel_icon from "../assets/admin_panel_settings.svg";
import task_icon from '../assets/task.svg';
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
        }}
      >
        <img style={{ paddingRight: 16, height: 32 }} src={logo} alt="" />
        DishZero
      </p>
      <p>MENU</p>
      <a className="menu-item" href="/home">
        <img style={{ paddingRight: 16 }} src={home_icon} alt="" />
        Home
      </a>
      {showVolunteer || showAdmin &&
      <div>
        <p className="menu-item">VOLUNTEERS</p>
        <a className="menu-item" href="/admin">
          <img style={{paddingRight: 16}} src = {admin_panel_icon} alt=""/>
          Admin panel
        </a>
        <a className="menu-item" href="/admin">
          <img style={{paddingRight: 16}} src = {task_icon} alt=""/>
          Return Dishes
        </a>
      </div>}
      <div style={{ paddingTop: 280 }}></div>
      <a className="menu-item" href="/dishes" style={{}}>
        <img style={{ paddingRight: 16 }} src={how_it_works_icon} alt="" />
        How it works
      </a>
      <a className="menu-item" href="/dishes">
        <img src={our_impact_icon} style={{ paddingRight: 16 }} alt="" />
        Our impact
      </a>
      <hr></hr>
       <a className="menu-item" onClick={() => FirebaseAuth.signOut()}>
        <img src={logout_icon} style={{ paddingRight: 16 }} alt="" />
        Logout
      </a>
      
    </Menu>
  );
};
