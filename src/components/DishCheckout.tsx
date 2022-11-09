import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import {Button, Container} from "react-bootstrap";
import CreateTempDishes from "./temp/CreateTempDishes";
import {useEffect, useState} from "react";
import DishApi from "../api/DishApi";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    databaseURL: process.env.REACT_APP_databaseURL,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId,
};

const firestoreApp = initializeApp(firebaseConfig);
const db = getFirestore(firestoreApp);

const DishListItem = ({dish, index}: any) => {
    let checkoutDish = function () {
        console.log(`Checked out: ${dish.id}`);
    };

    let checkinDish = function () {
        console.log("checked in: ", dish.id);
    }
    return (
        <>
            <tr>
                <th scope="row">{index}</th>
                <td>{dish.id}</td>
                <td>{dish.oid}</td>
                <td>
                {dish.status == 0 && (
                    <Button variant="warning" onClick={checkoutDish}>Check Out</Button>
                )}
                {dish.status == 1 && (
                    <Button variant="success" onClick={checkinDish}>Check In</Button>
                )}
                </td>
            </tr>
        </>
    )
}

const DishCheckout = () => {
    const [dishesAvail, setDishesAvail] = useState([]);
    useEffect(() => {
        DishApi.getAvailableDishes(db)
            .then((dishesAvailResp: any) => {
                setDishesAvail(dishesAvailResp);
            })
    }, [])

    return (
        <>
            <Container fluid className={"bg-light p-5 vh-100"}>
                <h2>Dish Checkout</h2>
                <div className={"mt-5"}>
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Id</th>
                            <th scope="col">OID</th>
                            <th scope="col">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                            {dishesAvail.map((dish: any, key: any) => (
                                <DishListItem dish={dish} index={key+1} />
                            ))}
                        </tbody>
                    </table>
                    {JSON.stringify(dishesAvail)}
                </div>
            </Container>

        </>
    )
}

export default DishCheckout;