import '../styles/index.css'
import {useEffect, useState } from "react";
import axios from "axios";
import mug from '../assets/mug_icon_contained.svg'
import container from '../assets/dish_icon_contained.svg'

export default ({dish,token}) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long'};
  const [dishAPI, setDishAPI] = useState([])     

    useEffect(()=>{
        axios.get('http://ec2-34-213-210-231.us-west-2.compute.amazonaws.com/api/dish', {headers:{"x-api-key":"test","session-token":token}, params:{"id":dish.dish}})
        .then(function (response) {
          setDishAPI(response.data.dish)
        })
        .catch(function (error) {
          console.log(error);
        });
      },[])

    // console.log(dishAPI['type'])

    if (dishAPI['type'] == 'mug'){
      var icon = mug
    } else {
      var icon = container
    }

    const dishCheckOut = new Date(dish.timestamp)
    // date.setDate(date.getDate() + 1);
    // console.log(dishCheckOut.getDate())
    const dishDue = new Date(dishCheckOut.getTime() + 86400000)
    // console.log(dishDue)
    // console.log("dishapi:", dishAPI)
    // console.log("dish:", dish.timestamp)
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