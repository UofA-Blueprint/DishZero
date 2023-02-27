import {
    Link
} from "react-router-dom";

const Error404 = () => {
    return (<p>404 - Page not found</p>)
}

const AdminOnMobile = () => {
    return (<p>Hello Admin, you are on mobile!</p>)
}

const WelcomePage = () => {
    return (<div>
        <p>Welcome Prompt</p>
        <Link to="/home"/>
    </div>)
}

export {Error404, AdminOnMobile, WelcomePage}