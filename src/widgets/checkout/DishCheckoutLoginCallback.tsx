import {useParams} from "react-router-dom";

const DishCheckoutLoginCallback = () => {
    const { id } = useParams();

    return (
        <>
            {/*TODO: Add Login functionality*/}
            LOGIN USER: {id}
        </>
    )
}

export default DishCheckoutLoginCallback;