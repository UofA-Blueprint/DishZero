import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Scanner from "../widgets/scanner"

const CheckIn = () => {
    const [DishID, setDishID] = useState("")
    const [PopUp, setPopUp] = useState(false)

    const navigate = useNavigate()

    return (
        <div>
            <Scanner
                mode="Checkin dishes"
                onScan={setDishID}
                onClose={() => navigate("/home")}
            />
            {/* <CheckOutModal DishID={DishID} setPopUp={setPopUp} PopUp={PopUp} /> */}
        </div>
    )
}

export default CheckIn