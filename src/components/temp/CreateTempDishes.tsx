import {Button} from "react-bootstrap";
import {addDoc, collection} from "firebase/firestore";

let tempDishes = [
    {
        id: 1,
        oid: 1,
        registeredAt: Date.now(),
        status: 0,
    },
    {
        id: 2,
        oid: 2,
        registeredAt: Date.now(),
        status: 0,
    }
]

const CreateTempDishes = ({db}: any) => {
    let createDishes = async () => {
        for (let it of tempDishes) {
            const docId = await addDoc(collection(db, "dishes"), it);
            console.log("Document created with id: ", docId)
        }
    };

    return (
        <>
            <Button variant="primary" onClick={createDishes}>Create Template Dishes</Button>
        </>
    )
};

export default CreateTempDishes;