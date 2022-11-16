import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import {Button, Container} from "react-bootstrap";
import CreateTempDishes from "../../components/temp/CreateTempDishes";
import {useEffect, useRef, useState} from "react";
import DishApi from "../../api/DishApi";
import {useParams} from "react-router-dom";
import { useNavigate } from 'react-router-dom';

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

const TempDishCheckout = () => {
    let db: any;
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
                            <DishListItem key={key} db={db} dish={dish} index={key+1} updateList={updateList}/>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Container>
        </>
    )
}

/**
 * Component that checks out the dish and redirects to the page with the url
 */
const DishCheckout = ({db}: any) => {
    let navigate = useNavigate();
    const { id } = useParams();
    // used to ensure that the checkout only happens once
    const idLastCheckedOut = useRef("0");

    useEffect(() => {
        if (idLastCheckedOut.current != id) {
            // TODO: Use handler function to update the status of the dish
            console.log(`Use handler function, checkout: ${id}`)
            idLastCheckedOut.current = id || "0";
            navigate(`/QRCodeScanCheckout/${id}`);
        }
    }, [])
    return (
        <>
        </>
    )
}

export default DishCheckout;