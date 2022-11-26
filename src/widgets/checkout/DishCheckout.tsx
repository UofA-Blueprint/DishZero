import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import { useNavigate } from 'react-router-dom';

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
            // If user logged in then go to home page
            // else
            navigate(`/checkout/login/callback/${id}`);
        }
    }, [])
    return (
        <>
        </>
    )
}

export default DishCheckout;