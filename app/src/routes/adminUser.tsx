import React from "react";
import leaf_icon from "../assets/leaf.svg";
import { MobileView, BrowserView } from "react-device-detect";

function adminUser() {
  return (
    <>
      {/* on mobile */}
      <MobileView>
        <div>
          <h1>Admin Panel</h1>
        </div>

        <img src={leaf_icon} alt="" />
        <h2>You're on mobile! Please go to desktop to view admin panel.</h2>
      </MobileView>

      {/* on desktop */}
      <BrowserView>
        {/* TODO: implement browser view when user is on desktop */}
        <div>HI this is users route</div>
        
      </BrowserView>
    </>
  );
}

export default adminUser;
