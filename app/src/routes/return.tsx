import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Scanner from "../widgets/scanner"
import DishAPI from "../features/api"

export default () => {
    const [scanId, setScanId] = useState("")
    const [PopUp, setPopUp] = useState(false)

    const navigate = useNavigate()

    const onScan = (id: string) => {
        setScanId(id);
        DishAPI.updateDishReturn(id);
    }

    return (
        <div>
            <Scanner
                mode="Scan Dishes"
                onScan={onScan}
                onClose={() => navigate("/home")}
            />
        </div>
    )
}