import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse, faBellConcierge, faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons'

import "../styles/admin.css"
export default () => {
    return (
        <>
        <nav id="sidebarMenu" className={`col-md-3 col-lg-2 d-md-block bg-light sidebar collapse`} >
                <div className={`position-sticky pt-3 sidebar-sticky`}>
                    
                    <ul className="nav flex-column">
                        <div className="sidebar-heading d-flex align-items-center px-3 mt-4 mb-1  justify-content-start">
                            <img src="/admin_logo.svg"/>
                            <h4>
                                DishZero
                            </h4>
                        </div>
                        <p className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-uppercase">
                            Admin Panel
                        </p>
                        <li className="nav-item">
                            <a className={`nav-link mt-3`} >
                                <FontAwesomeIcon icon={faHouse} className="sidebar-icon"/>    
                                Home
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link mt-3`} >
                                <FontAwesomeIcon icon={faBellConcierge} className="sidebar-icon"/>    
                                Dishes
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link mt-3">
                                <FontAwesomeIcon icon={faUser} className="sidebar-icon"/>    
                                Users
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link mt-3`} aria-current="page">
                                <FontAwesomeIcon icon={faEnvelope} className="sidebar-icon"/>    
                                Email
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}