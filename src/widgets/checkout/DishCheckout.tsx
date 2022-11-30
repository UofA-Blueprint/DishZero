import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import DishApi from "../../stores/api"
import {db} from "../../firebase"

/**
 * Component that checks out the dish and redirects to the page with the url
 */
const DishCheckout = () => {
    let navigate = useNavigate();
    const { id } = useParams();
    // used to ensure that the checkout only happens once
    const idLastCheckedOut = useRef("0");

    const checkoutDish = async function(qid: string) {
        // TODO: Add handler that does not require the User Id
        let user = "1";
        const dish = await DishApi.getDishID(db, user, qid)
        const docRef = await DishApi.CheckOutDish(db, user, dish.docId);
        // If user logged in then go to home page, TODO
        // else 
        navigate(`/checkout/login/callback/${id}`);
    }

    useEffect(() => {
        if (idLastCheckedOut.current != id) {
            // TODO: Use handler function to update the status of the dish
            checkoutDish(id || "0")
            idLastCheckedOut.current = id || "0";
        }
    }, [])
    return (
        <>
        </>
    )
}

export default DishCheckout;