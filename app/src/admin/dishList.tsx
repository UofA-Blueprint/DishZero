import { useEffect, useRef, useState } from 'react';
import Toolbar from './toolbar';
import adminApi from "./adminApi";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;

const AdminDishTableRow = ({dish, selectedHandler, index, selectedList}) => {
    return (
        <>
            <tr>
                <th scope="row">
                    <input checked={selectedList[index]} type="checkbox" onClick={() => selectedHandler(index)}/>
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
}

const DishData = ({origDishList}) =>{
    // get dishlist using useEffect
    const [dishList, setDishList] = useState(origDishList);
    const [query, setQuery] = useState("");
    const [headerChecked, setHeaderChecked] = useState(false);
    const [selectedList, setSelectedList] = useState(Array(dishList.length).fill(false));
    const [selectedCount, setSelectedCount] = useState(0);
    const [shownDishList, setShownDishList] = useState(dishList);
    const [dishTypeFilter, setDishTypeFilter] = useState({"All":false, "Mug":false, "Dish":false});
    const [dishFilterClick, setDishFilterClick] = useState(false);
    const [dishStatusFilter, setDishStatusFilter] = useState({"All":false, "InUse":false, "Returned":false, "Overdue":false});
    const [dishStatusClick, setDishStatusClick] = useState(false);
    /// filter function
    const GetfilteredDish = (filter, dishes) =>{
        return dishes.filter((dish) => {
            if(filter.dishType.includes(dish.type) && filter.dishStatus.includes(dish.status))
            {
                return true;
            }
            else{
                return false;
            }
        })
    }
    const CreateFilter = () => {
        var dishType = [""]
        var dishStatus = [""]
        if (dishTypeFilter.Mug){
            dishType.push("Mug");
        }
        if (dishTypeFilter.Dish){
            dishType.push("Dish");
        }
        if (dishStatusFilter.InUse){
            dishStatus.push("In Use");
        }
        if (dishStatusFilter.Returned){
            dishStatus.push("Returned");
        }
        if (dishStatusFilter.Overdue){
            dishStatus.push("Overdue");
        }
        if (dishType.length === 1){
            dishType = ["Mug","Dish"];
        }
        if (dishStatus.length === 1){
            dishStatus = ["In Use", "Returned", "Overdue"];
        }
        return {
            dishStatus,
            dishType
        }
    }

    const loadDataFromBackend = async function() {
        let dishData = await adminApi.getAllDishes();
        setDishList(dishData);
        resetStateVars(dishData);
    }

    const resetStateVars = function(dishData) {
        setQuery("");
        setHeaderChecked(false);
        setSelectedList(Array(dishList.length).fill(false));
        setSelectedCount(0);
        setShownDishList(dishData);
        setDishTypeFilter({"All":false, "Mug":false, "Dish":false});
        setDishFilterClick(false);
        setDishStatusFilter({"All":false, "InUse":false, "Returned":false, "Overdue":false})
        setDishStatusClick(false);
    }


    useEffect(() => {
        if (origDishList.length == 0) {
            // load the data again
            loadDataFromBackend();
        }
    }, [])


    useEffect(() => {
        const filter = CreateFilter();
        setShownDishList(GetfilteredDish(filter, dishList));
    },[dishStatusFilter, dishTypeFilter]) 
    ///
    ///
    const handleDishStatusClick = () =>{
        setDishStatusClick(!dishStatusClick);
    }
    const handleAllStatus = () => {
        if (dishStatusFilter.All === false){
            setDishStatusFilter({"All":true, "InUse":true, "Returned":true, "Overdue":true});
        }
        else {
            setDishStatusFilter({...dishStatusFilter, "All":!dishStatusFilter.All });            
        }
    }
    const handleInUseFilter = () =>{
        setDishStatusFilter({...dishStatusFilter, "InUse":!dishStatusFilter.InUse});
    }
    const handleReturnFilter = () =>{
        setDishStatusFilter({...dishStatusFilter, "Returned":!dishStatusFilter.Returned});
    }
    const handleOverdueFilter = () =>{
        setDishStatusFilter({...dishStatusFilter, "Overdue":!dishStatusFilter.Overdue});
    }
    ///
    ///
    const handleDishFilterClick = () =>{
        setDishFilterClick(!dishFilterClick);
    }
    const handleAllFilter = () => {
        if (dishTypeFilter.All === false){
            setDishTypeFilter({"All":true, "Mug":true, "Dish":true});
        }
        else {
            setDishTypeFilter({...dishTypeFilter, "All":!dishTypeFilter.All });            
        }                        
    };
    const handleDishFilter = () =>{
        setDishTypeFilter({...dishTypeFilter, "Dish":!dishTypeFilter.Dish});
    }
    const handleMugFilter = () =>{
        setDishTypeFilter({...dishTypeFilter, "Mug":!dishTypeFilter.Mug});
    }
    

    // Handles state change of checkbox in rows
    const selectItemHandler = (i: number) =>{
        const newSelItems = [...selectedList];
        if (i >= newSelItems.length) {return;}
        newSelItems[i] = !newSelItems[i];
        setSelectedList(newSelItems);
        console.log(`Len: ${selectedList.length}; ${selectedList[i]}`);
    }

    // Handles the state change of the checkbox in table head
    const handleHeaderCheckChange = () => {
        const newHeaderVal = !headerChecked;
        setHeaderChecked(newHeaderVal);
        if (newHeaderVal){
            setSelectedList(Array(selectedList.length).fill(true));
        }
        else{
            setSelectedList(Array(selectedList.length).fill(false));
        }
    }

    const getSearchedDishes = (query, dishes) =>{
        if (!query){
            return dishes;
        }
        return dishes.filter(dish => dish.id.includes(query));
    }
    const searchBarHandleChange = (value)=>{
        setQuery(value); 
        setShownDishList(getSearchedDishes(query, dishList));
    }
    
    return(
        <div className='mx-5 my-3'>
            <div className='dishDashboard-main-title fw-bold fs-4'>
                Dish Data
            </div>
            <div className='dishDashboard-data '>
                {/* Top text fields */}
                <div className='d-flex flex-row mb-2 mt-4 justify-content-between'>
                    <div className='d-flex flex-row mb-3'>
                        <div className="input-group me-3 rounded-pill border border-dark py-1 px-2">
                            <input type="text" className="form-control border-0" placeholder="Type text here" />
                        </div>
                        <button type="button" className="btn rounded-pill bg-transparen border border-success text-success px-5">
                            Search
                        </button>
                    </div>

                    <div className='d-flex flex-row mb-3 '>
                        <button type="button" className="btn rounded-pill bg-transparen border border-success text-success px-5 me-3">
                            Export Data
                        </button>
                        <button type="button" className="btn rounded-pill btn-success px-5">
                            + Add new dish
                        </button>
                    </div>
                </div>

                <table className="table">
                    <thead className="table-secondary">
                        <tr>
                        <th scope="col">
                            <input type="checkbox" checked={headerChecked} onChange={handleHeaderCheckChange}/>
                        </th>
                        <th scope="col">Dish ID</th>

                        <th scope="col">
                            <div className="dropdown">
                                <button className="btn  dropdown-toggle border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false"
                                    onClick={handleDishFilterClick}>
                                    Dish type  
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <input checked={dishTypeFilter.All} type="checkbox" onChange={handleAllFilter} className="mx-2"/>
                                        <label>
                                            All
                                        </label>
                                    </li>
                                    <li>
                                        <input checked={dishTypeFilter.Dish} type="checkbox" onChange={handleDishFilter} className="mx-2"/>
                                        <label>
                                            Dish
                                        </label>
                                    </li>
                                    <li>
                                        <input checked={dishTypeFilter.Mug} type="checkbox" onChange={handleMugFilter} className="mx-2"/>
                                        <label>
                                            Mug
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </th>
                        <th scope="col">
                            <div className="dropdown">
                                <button className="btn dropdown-toggle border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Status
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <input checked={dishStatusFilter.All} type="checkbox" onChange={handleAllStatus} className="mx-2" />
                                        <label>
                                            All
                                        </label>
                                    </li>
                                    <li>
                                        <input checked={dishStatusFilter.InUse} type="checkbox" onChange={handleInUseFilter} className="mx-2"/>
                                        <label>
                                            In Use
                                        </label>
                                    </li>
                                    <li>
                                        <input checked={dishStatusFilter.Returned} type="checkbox" onChange={handleReturnFilter} className="mx-2"/>
                                        <label>
                                            Returned
                                        </label>
                                    </li>
                                    <li>
                                        <input checked={dishStatusFilter.Overdue} type="checkbox" onChange={handleOverdueFilter} className="mx-2"/>
                                        <label>
                                            Overdue
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </th>
                        <th scope="col">
                            <button className="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Overdue                                
                            </button>
                        </th>
                        <th scope="col">
                            <button className="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Times Borrowed                                
                            </button>
                        </th>
                        <th scope="col">
                            <button className="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Date Added                             
                            </button>
                        </th>
                        
                        </tr>
                    </thead>
                    <tbody>
                        {shownDishList.map((dish, key) => (
                            <AdminDishTableRow dish={dish} key={key} selectedHandler={selectItemHandler} index={key} selectedList={selectedList}/>
                        ))}
                    </tbody>
                </table>

                <div className='dishDashboard-pagenumber'>
                    {/* TODO: Add pagination */}
                </div>
            </div>
        </div>
    )
}
const TransactionHistory = () => {
    return(
        <div>
            <div className='dishDashboard-main-title'>
                Transactions History
            </div>
            <div className='transaction-daterange'>
                Date Range
            </div>
        </div>
    )
}

const DishDashboard = () =>{
    
}

export default DishData;