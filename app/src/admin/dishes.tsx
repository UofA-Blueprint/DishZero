import React from "react";
import leaf_icon from "../assets/leaf.svg";
import { BrowserView, MobileView } from "react-device-detect";
import Toolbar from "./toolbar";
import DishData from "./dishList";
import { dishes } from "./constants";
import { StyledAdminPageLayout } from "./styledAdmin"

function Dishes() {
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
                <StyledAdminPageLayout>
                    <Toolbar />
                    <DishData origDishList={dishes} />
                </StyledAdminPageLayout>
            </BrowserView>
        </>
    );
}

export default Dishes;
