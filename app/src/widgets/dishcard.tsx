import "../styles/index.css";
import { useEffect, useState } from "react";
import axios from "axios";
import mug from "../assets/mug_icon_contained.svg";
import container from "../assets/dish_icon_contained.svg";

export default ({dish,token}) => {
  const [dishAPI, setDishAPI] = useState([])
  const twoDaysInMs = 86400000 * 2
    useEffect(()=>{
        axios.get(`/api/dish`, {headers:{"x-api-key":`${process.env.REACT_APP_API_KEY}`,"session-token":token}, params:{"id":dish.dish}})
        .then(function (response) {
          setDishAPI(response.data.dish)
        })
        .catch(function (error) {
          console.log(error);
        });
      },[])


    const icon = dishAPI['type'] == 'mug' ? mug : container

    const dishCheckOut = new Date(dish.timestamp)
    const dishDue = new Date(dishCheckOut.getTime() + twoDaysInMs)
    return (
        <div className="dish-card mb-3">
            <div className="type-icon">
              <img src={icon}></img>
            </div>
            <div className="flex-column">
                <p className="details-1" style={{marginLeft:'17px'}}>Return before {dishDue.toLocaleDateString("en-US")}</p>
                <p className="first-letter small-text-1" style={{marginLeft:'17px', marginTop:'-16px'}}>{dishAPI['type']} # {dishAPI['qid']}</p>
                <p className="details-1" style={{marginLeft:'17px', marginTop:'-16px'}} >Checked out on {dishCheckOut.toLocaleDateString("en-US")}</p>
            </div>
        </div>
    )
}
