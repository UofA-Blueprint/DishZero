import '../styles/index.css'
import {useEffect } from "react";
import axios from "axios";

export default ({dish,token}) => {
    const dateFormat = { day: 'numeric', year: 'numeric', month: 'short'}
    console.log("dishid:", dish.dishID)
    
    useEffect(()=>{
        axios.get('http://localhost:8080/api/dish', {headers:{"x-api-key":"test","session-token":token}, params:{"id":dish.dishID}})
        .then(function (response) {
          console.log("resp:", response.data)
        })
        .catch(function (error) {
          console.log(error);
        });
      },[])

    return (
        <div className="dish-card mb-3">
            <div className="type-icon">
                <img />
            </div>
            <div className="d-flex flex-column">
                <p className="small-text-1 m-0">{dish.dishID} # {dish.id}</p>
                {/* <p className="details-1 m-0">Return before {dish.due.toLocaleDateString("en-US", dateFormat)}</p>
                <p className="small-text-1 m-0">{dish.type} # {dish.id}</p>
                <p className="details-2 m-0">Checked out {dish.checkedOut.toLocaleDateString("en-US", dateFormat)}</p> */}
            </div>
        </div>
    )
}