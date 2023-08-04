import { useContext, useEffect, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import "../styles/sidebar.css";
import { Link } from "@mui/material";
import how_it_works_icon from "../assets/how_it_works.png";
import logout_icon from "../assets/logout.svg";
import our_impact_icon from "../assets/our_impact.png";
import home_icon from "../assets/home.png";
import admin_panel_icon from "../assets/admin_panel_settings.png";
import task_icon from "../assets/task_icon.png";
import logo from "../assets/logo.svg";
import { useAuth } from "../contexts/AuthContext";

export const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const [admin, setAdmin] = useState(false);
  const [volunteer, setVolunteer] = useState(false);

  //When we load the page or refresh, check the role of the user and setadmin or volunteer accordingly
  useEffect(() => {
    if (currentUser?.role == "admin") {
      setAdmin(true);
      setVolunteer(true);
    } else if (currentUser?.role == "volunteer") {
      setAdmin(false);
      setVolunteer(true);
    }
  }, [currentUser]);

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
      {(admin || volunteer) && (
        <div style={{ flex: 1, flexDirection: "column" }}>
          <p>VOLUNTEERS</p>
          <a className="menu-item" href="/admin">
            <img style={{ paddingRight: 16 }} src={admin_panel_icon} alt="" />
            Admin panel
          </a>
          <br></br>
          <a
            className="menu-item"
            href="/volunteer/return"
            style={{ paddingTop: 10 }}
          >
            <img style={{ paddingRight: 16 }} src={task_icon} alt="" />
            Return Dishes
          </a>
        </div>
      )}
      <div style={{ paddingTop: 280 }}></div>
      <Link
        className="menu-item"
        href="https://www.dishzero.ca/how-it-works-1"
        style={{}}
      >
        <img style={{ paddingRight: 16 }} src={how_it_works_icon} alt="" />
        How it works
      </Link>
      <Link className="menu-item" href="https://www.dishzero.ca/impact">
        <img src={our_impact_icon} style={{ paddingRight: 16 }} alt="" />
        Our impact
      </Link>
      <hr></hr>
      <a className="menu-item" onClick={() => logout()}>
        <img src={logout_icon} style={{ paddingRight: 16 }} alt="" />
        Logout
      </a>
      <br></br>
    </Menu>
  );
};
