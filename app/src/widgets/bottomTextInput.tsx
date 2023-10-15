/*eslint-disable*/

import { useState } from "react";
import Form from 'react-bootstrap/Form';
import Cookies from "js-cookie";
import axios from "axios";
import { useLocation } from "react-router-dom"
import { Container, Button, InputGroup } from 'react-bootstrap';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch
} from "@fortawesome/free-solid-svg-icons";


const BottomTextInput = (props) => {
    const [input, setInput] = useState("");
    
    console.log("woo");
    const handleSubmit = (e) => {
        
        console.log('BhamWham');
        e.preventDefault();
        props.onSubmit(input)
        return false;
    }
    return (
        
        <div className="start-0 position-fixed bottom-0 w-100 p-2" style={{backgroundColor: "rgb(58,58,58)" }} >
            <div>

                <Form onSubmit={handleSubmit}>

                    <InputGroup className="mb-1">


                        <Form.Control className="search-bar" value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Enter dish id #" />

                        <Button onSubmit={handleSubmit} type="submit" disabled = {props.disabled} className="search-button">
                            Enter
                        </Button>

                    </InputGroup >
                </Form>
            </div>
        </div>
        
    )
}

export default BottomTextInput