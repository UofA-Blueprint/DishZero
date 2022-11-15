import CheckOutPopUp from "./CheckOutPopUp"
import CheckOutInput from "./CheckOutInput"
import CheckOutButton from "./CheckOutButton"
import { useState } from "react"
const CheckOut = () => {

  return (
    <div>
        <CheckOutInput />
        <CheckOutButton  />
        <CheckOutPopUp  />
    </div>
  )
}

export default CheckOut