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
    faSearch,
    faPaperPlane
} from "@fortawesome/free-solid-svg-icons";


const BottomTextInput = (props) => {
    const [input, setInput] = useState("");
    
    const handleSubmit = async (e) => {
        
     
        e.preventDefault();
        await props.onSubmit(props.value)
        return false;
    }
    return (
        <div className="start-50 position-fixed bottom-0 p-2 translate-middle" style={{width:"95%"}}>
            <div>
                <Form onSubmit={handleSubmit}>
                    <InputGroup className="mb-1 qr-search-container shadow-sm">
                        <InputGroup.Text className="search-icon">
                            <FontAwesomeIcon icon={faSearch} />                            
                        </InputGroup.Text>

                        <Form.Control className="search-bar" value={props.value} onChange={props.onChange} type="text" placeholder="Enter dish id #" />

                        <Button variant="outline-secondary" id="button-addon2" onSubmit={handleSubmit} type="submit" disabled = {props.disabled} className="search-button">
                            <FontAwesomeIcon icon={faPaperPlane} fontSize={"1.4em"}/>                            
                        </Button>

                    </InputGroup >
                </Form>
            </div>
        </div>
        
    )
}

export default BottomTextInput