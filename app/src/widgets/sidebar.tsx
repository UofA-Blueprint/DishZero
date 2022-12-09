import {slide as Menu} from "react-burger-menu";
import "../styles/sidebar.css"

type SidemenuProps = {
    pageWrapId: string;
    outerContainerId: string;
};

export const Sidebar = ({pageWrapId, outerContainerId} : SidemenuProps) => {
    return (
        <Menu>
            <p
                className="memu-title"
                style={{
                textAlign: "left"
            }}>
                <img
                style={{paddingRight:20}}
                    width={20}
                    height={20}
                    src="https://image.shutterstock.com/image-vector/plate-vector-illustrationisolated-on-white-260nw-1815162875.jpg"></img>DishZero</p>
            <a className="menu-item" href="/home">
                <p>MENU</p><img
                style={{paddingRight:20}}
                    width={20}
                    height={20}
                    src="https://cdn-icons-png.flaticon.com/512/25/25694.png"></img>
                Home
            </a>
            <a className="menu-item" href="/dishes">
                <img
                  style={{paddingRight:20}}
                    width={20}
                    height={20}
                    src="https://cdn-icons-png.flaticon.com/512/76/76211.png"></img>
                My dishes
            </a>
            <div style={{paddingTop: 280}}></div>
            <a
                className="menu-item"
                href="/dishes"
                style={{
            }}>
                <img
                    style={{paddingRight:20}}
                    width={20}
                    height={20}
                    src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-clipboard-512.png"></img>
                How it works
            </a>
            <a className="menu-item" href="/dishes">
                <img
                style={{paddingRight:20}}
                    width={20}
                    height={20}
                    src="https://static.thenounproject.com/png/4653746-200.png"></img>
                Our impact
            </a>
            <a className="menu-item" href="/dishes">
                <img
                style={{paddingRight:20}}
                    width={20}
                    height={20}
                    src="https://www.iconpacks.net/icons/2/free-exit-logout-icon-2857-thumb.png"></img>
                Logout
            </a>
        </Menu>
    );
};
