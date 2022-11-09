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

const DishListItem = ({db, dish, index, updateList}: any) => {
    let checkoutDish = async function () {
        await DishApi.checkOutDish(db, dish);
        updateList();
    };

    let checkinDish = async function () {
        await DishApi.checkInDish(db, dish);
        updateList();
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
    const [refreshList, setRefreshList] = useState(0);

    useEffect(() => {
        DishApi.getAllDishes(db)
            .then((dishesAvailResp: any) => {
                setDishesAvail(dishesAvailResp);
            })
    }, [refreshList])

    let updateList = () => setRefreshList(refreshList + 1);


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
                                <DishListItem db={db} dish={dish} index={key+1} updateList={updateList}/>
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