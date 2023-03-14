import { useEffect, useRef, useState } from 'react';
import {Card} from 'react-bootstrap';
import { dishes } from './constants';

const DishCard = ({dishId, dishType, dishStatus, dishOverdue, dishTimesBorrowed, dishDateAdded, selected}) => {
    const [checked, SetChecked] = useState(selected);

    const handleCheckChange = () => {
        // add or remove from above select list
        SetChecked(!checked);
        
    }
    return (
    <Card>
        <Card.Body>
            <input 
                type="checkbox"           
                checked={checked}
                onChange={handleCheckChange}
            />
            <div className='dishId-card'>
                {dishId}
            </div>
            <div className='dishType-card'>
                {dishType}
            </div>
            <div className='dishStatus-card'>
                {dishStatus}
            </div>
            <div className='dishOverdue-card'>
                {dishOverdue} Days
            </div>
            <div className='dishTimesBorrowed-card'>
                {dishTimesBorrowed}
            </div>
            <div className='dishDateAdded-card'>
                {dishDateAdded}
            </div>
        </Card.Body>
    </Card>
    )
}

const DishData = () =>{
    // get dishlist using useEffect
    const [dishList, SetDishList] = useState(dishes);
    const [query, setQuery] = useState("");
    const [headerChecked, setHeaderChecked] = useState(false);
    const [selectedList, setSelectedList] = useState({});
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
    ///
    const createSelectedList = ()=>{

    }
    const handleHeaderCheckChange = () => {
        // todo
        // add or remove from above select list
        setHeaderChecked(!headerChecked);
        if (headerChecked){
            // select all the dishes
        }
        else{
            // unselect all the dishes

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
                Dishes' Data
            </div>
            <div className='dishDashboard-data '>
                {/* Top text fields */}
                <div className='d-flex flex-row mb-3 justify-content-between'>
                    <div className='d-flex flex-row mb-3'>
                        <div className="input-group me-3 rounded-pill border border-dark py-1 px-2">
                            <input type="text" className="form-control border-0" placeholder="Type text here" />
                        </div>
                        <button type="button" className="btn rounded-pill bg-transparen border border-success text-success px-4">
                            Search
                        </button>
                    </div>

                    <div className='d-flex flex-row mb-3'>
                        <div className="input-group me-3 rounded-pill border border-dark py-1 px-2">
                            <input type="text" className="form-control border-0" placeholder="Enter an id" />
                        </div>
                        <button type="button" className="btn rounded-pill btn-success px-4">
                            + Add new dish
                        </button>
                    </div>
                </div>

                <div className='dishDashboard-header-row'>
                    <input type="checkbox" checked={headerChecked} onChange={handleHeaderCheckChange}/>
                    <div className='dishId-text'>
                        Dish ID
                    </div>
                    <div>
                        <div onClick={handleDishFilterClick} className='dish-text'>
                            Dish Type
                        </div>
                        {dishFilterClick && <div className = "dish-filters">
                            <ul>
                                <li>
                                    <input checked={dishTypeFilter.All} type="checkbox" onChange={handleAllFilter}/>
                                    <label>
                                        All
                                    </label>
                                </li>
                                <li>
                                    <input checked={dishTypeFilter.Dish} type="checkbox" onChange={handleDishFilter}/>
                                    <label>
                                        Dish
                                    </label>
                                </li>
                                <li>
                                    <input checked={dishTypeFilter.Mug} type="checkbox" onChange={handleMugFilter}/>
                                    <label>
                                        Mug
                                    </label>
                                </li>
                            </ul>
                        </div>}
                    </div>
                    <div>
                        <div onClick={handleDishStatusClick} className='dish-text'>
                            Dish Status
                        </div>
                        {dishStatusClick && <div className = "dish-filters">
                            <ul>
                                <li>
                                    <input checked={dishStatusFilter.All} type="checkbox" onChange={handleAllStatus}/>
                                    <label>
                                        All
                                    </label>
                                </li>
                                <li>
                                    <input checked={dishStatusFilter.InUse} type="checkbox" onChange={handleInUseFilter}/>
                                    <label>
                                        In Use
                                    </label>
                                </li>
                                <li>
                                    <input checked={dishStatusFilter.Returned} type="checkbox" onChange={handleReturnFilter}/>
                                    <label>
                                        Returned
                                    </label>
                                </li>
                                <li>
                                    <input checked={dishStatusFilter.Overdue} type="checkbox" onChange={handleOverdueFilter}/>
                                    <label>
                                        Overdue
                                    </label>
                                </li>
                            </ul>
                        </div>}
                    </div>
                </div>
                {shownDishList.map((dish) => {
                    return (
                        <DishCard
                            dishId={dish.id}
                            dishType={dish.type}
                            dishStatus={dish.status}
                            dishOverdue={dish.overdue}
                            dishTimesBorrowed={dish.timesBorrowed}
                            dishDateAdded={dish.dateAdded}
                            selected = {false}
                        />
                    )
                })}
                <div className='dishDashboard-pagenumber'>
                    page number
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