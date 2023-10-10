/*eslint-disable*/
import { StyledDishDataLayout } from "./styledDishes";
import AdminDishHeader from "./Dishes/dishHeader";
import AdminDishTable from "./Dishes/dishTable";
import { dishInterface } from "./constants";

const AdminDishTableRow = ({ dish, selectedHandler, index, selectedList }) => {
    return (
        <>
        <tr>
            <th scope="row">
            <input
                checked={selectedList[index]}
                type="checkbox"
                onClick={() => selectedHandler(index)}
            />
            </th>
            <td>{dish.id}</td>
            <td>{dish.type}</td>
            <td>{dish.status}</td>
            <td>{dish.overdue}</td>
            <td>{dish.timesBorrowed}</td>
            <td>{dish.dateAdded || ""}</td>
        </tr>
        </>
    );
};

interface Props {
    origDishList: dishInterface[];
};

export default function DishData ({ origDishList }:Props) {
    return (
        <StyledDishDataLayout>
        <AdminDishHeader />
        <AdminDishTable origDishList={origDishList} />
        </StyledDishDataLayout>
    );
};
const TransactionHistory = () => {
    return (
        <div>
        <div className="dishDashboard-main-title">Transactions History</div>
        <div className="transaction-daterange">Date Range</div>
        </div>
    );
};
