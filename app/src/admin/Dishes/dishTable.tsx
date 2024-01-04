/*eslint-disable*/
import { useEffect, useState } from 'react'
import { Simulate } from 'react-dom/test-utils'
import load = Simulate.load
import { dishInterface } from '../constants'
import { useAuth } from '../../contexts/AuthContext'
import adminApi from '../adminApi'
import { dishTag } from '../../routes/admin'

const AdminDishTableRow = ({ dish, selectedHandler, index, selectedList }) => {
    return (
        <>
            <tr>
                <th
                    scope="row"
                    style={{
                        textAlign: 'center',
                    }}>
                    <input checked={selectedList[index]} type="checkbox" onClick={() => selectedHandler(index)} />
                </th>
                <td>{dish.id}</td>
                {/* <td>{dish.type}</td> */}
                <td>{dishTag(dish.type)}</td>
                <td>{dishTag(dish.status)}</td>
                {/* <td>{dish.status}</td> */}
                <td>
                    {dish.overdue} {dish.overdue > 0 && 'days'}
                </td>
                <td>{dish.timesBorrowed}</td>
                <td>{dish.dateAdded || ''}</td>
            </tr>
        </>
    )
}

interface Props {
    origDishList: dishInterface[]
}

export default function AdminDishTable({ origDishList }: Props) {
    console.log(origDishList)

    // get dishlist using useEffect
    const [dishList, setDishList] = useState(origDishList)
    const [query, setQuery] = useState('')
    const [headerChecked, setHeaderChecked] = useState(false)
    const [selectedList, setSelectedList] = useState(Array(dishList.length).fill(false))
    const [selectedCount, setSelectedCount] = useState(0)
    const [shownDishList, setShownDishList] = useState(dishList)
    const [dishTypeFilter, setDishTypeFilter] = useState({
        All: false,
        Mug: false,
        Dish: false,
    })
    const [dishFilterClick, setDishFilterClick] = useState(false)
    const [dishStatusFilter, setDishStatusFilter] = useState({
        All: false,
        InUse: false,
        Returned: false,
        Overdue: false,
    })
    const [dishStatusClick, setDishStatusClick] = useState(false)
    const { currentUser, sessionToken } = useAuth()
    /// filter function
    const GetfilteredDish = (filter, dishes) => {
        return dishes.filter((dish) => {
            if (filter.dishType.includes(dish.type) && filter.dishStatus.includes(dish.status)) {
                return true
            } else {
                return false
            }
        })
    }
    const CreateFilter = () => {
        let dishType = ['']
        let dishStatus = ['']
        if (dishTypeFilter.Mug) {
            dishType.push('Mug')
        }
        if (dishTypeFilter.Dish) {
            dishType.push('Dish')
        }
        if (dishStatusFilter.InUse) {
            dishStatus.push('In Use')
        }
        if (dishStatusFilter.Returned) {
            dishStatus.push('Returned')
        }
        if (dishStatusFilter.Overdue) {
            dishStatus.push('Overdue')
        }
        if (dishType.length === 1) {
            dishType = ['Mug', 'Dish']
        }
        if (dishStatus.length === 1) {
            dishStatus = ['In Use', 'Returned', 'Overdue']
        }
        return {
            dishStatus,
            dishType,
        }
    }

    const loadDataFromBackend = async function () {
        let dishData = []
        if (sessionToken) {
            dishData = await adminApi.getAllDishes(sessionToken)
        }
        setDishList(dishData)
        resetStateVars(dishData)
    }

    const resetStateVars = function (dishData) {
        setQuery('')
        setHeaderChecked(false)
        setSelectedList(Array(dishList.length).fill(false))
        setSelectedCount(0)
        setShownDishList(dishData)
        setDishTypeFilter({ All: false, Mug: false, Dish: false })
        setDishFilterClick(false)
        setDishStatusFilter({
            All: false,
            InUse: false,
            Returned: false,
            Overdue: false,
        })
        setDishStatusClick(false)
    }

    useEffect(() => {
        if (origDishList.length == 0) {
            // load the data again
            loadDataFromBackend()
        }
    }, [])

    useEffect(() => {
        const filter = CreateFilter()
        setShownDishList(GetfilteredDish(filter, dishList))
    }, [dishStatusFilter, dishTypeFilter])
    ///
    ///
    const handleDishStatusClick = () => {
        setDishStatusClick(!dishStatusClick)
    }
    const handleAllStatus = () => {
        if (dishStatusFilter.All === false) {
            setDishStatusFilter({
                All: true,
                InUse: true,
                Returned: true,
                Overdue: true,
            })
        } else {
            setDishStatusFilter({ ...dishStatusFilter, All: !dishStatusFilter.All })
        }
    }
    const handleInUseFilter = () => {
        setDishStatusFilter({
            ...dishStatusFilter,
            InUse: !dishStatusFilter.InUse,
        })
    }
    const handleReturnFilter = () => {
        setDishStatusFilter({
            ...dishStatusFilter,
            Returned: !dishStatusFilter.Returned,
        })
    }
    const handleOverdueFilter = () => {
        setDishStatusFilter({
            ...dishStatusFilter,
            Overdue: !dishStatusFilter.Overdue,
        })
    }
    ///
    ///
    const handleDishFilterClick = () => {
        setDishFilterClick(!dishFilterClick)
    }
    const handleAllFilter = () => {
        if (dishTypeFilter.All === false) {
            setDishTypeFilter({ All: true, Mug: true, Dish: true })
        } else {
            setDishTypeFilter({ ...dishTypeFilter, All: !dishTypeFilter.All })
        }
    }
    const handleDishFilter = () => {
        setDishTypeFilter({ ...dishTypeFilter, Dish: !dishTypeFilter.Dish })
    }
    const handleMugFilter = () => {
        setDishTypeFilter({ ...dishTypeFilter, Mug: !dishTypeFilter.Mug })
    }

    // Handles state change of checkbox in rows
    const selectItemHandler = (i: number) => {
        const newSelItems = [...selectedList]
        if (i >= newSelItems.length) {
            return
        }
        newSelItems[i] = !newSelItems[i]
        setSelectedList(newSelItems)
    }

    // Handles the state change of the checkbox in table head
    const handleHeaderCheckChange = () => {
        const newHeaderVal = !headerChecked
        setHeaderChecked(newHeaderVal)
        if (newHeaderVal) {
            setSelectedList(Array(selectedList.length).fill(true))
        } else {
            setSelectedList(Array(selectedList.length).fill(false))
        }
    }

    const getSearchedDishes = (query, dishes) => {
        if (!query) {
            return dishes
        }
        return dishes.filter((dish) => dish.id.includes(query))
    }
    const searchBarHandleChange = (value) => {
        setQuery(value)
        setShownDishList(getSearchedDishes(query, dishList))
    }
    return (
        <>
            <div className="dishDashboard-main-title">
                <table className="table table-striped dishes-table-hover">
                    <thead
                        className=""
                        style={{
                            textAlign: 'left',
                            verticalAlign: 'middle',
                        }}>
                        <tr className="dishes-table-header">
                            <th
                                scope="col"
                                align="center"
                                style={{
                                    borderTopLeftRadius: '10px',
                                    textAlign: 'center',
                                }}>
                                <input type="checkbox" checked={headerChecked} onChange={handleHeaderCheckChange} />
                            </th>
                            <th scope="col">Dish ID</th>

                            <th scope="col">
                                <div className="dropdown">
                                    Dish Type
                                    <button
                                        className="btn  dropdown-toggle border-0 p-0 mx-1"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        onClick={handleDishFilterClick}
                                    />
                                    <ul className="dropdown-menu">
                                        <li>
                                            <input
                                                checked={dishTypeFilter.All}
                                                type="checkbox"
                                                onChange={handleAllFilter}
                                                className="mx-2"
                                            />
                                            <label>All</label>
                                        </li>
                                        <li>
                                            <input
                                                checked={dishTypeFilter.Dish}
                                                type="checkbox"
                                                onChange={handleDishFilter}
                                                className="mx-2"
                                            />
                                            <label>Dish</label>
                                        </li>
                                        <li>
                                            <input
                                                checked={dishTypeFilter.Mug}
                                                type="checkbox"
                                                onChange={handleMugFilter}
                                                className="mx-2"
                                            />
                                            <label>Mug</label>
                                        </li>
                                    </ul>
                                </div>
                            </th>
                            <th scope="col">
                                <div className="dropdown">
                                    Status
                                    <button
                                        className="btn dropdown-toggle border-0 p-0 mx-1"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    />
                                    <ul className="dropdown-menu">
                                        <li>
                                            <input
                                                checked={dishStatusFilter.All}
                                                type="checkbox"
                                                onChange={handleAllStatus}
                                                className="mx-2"
                                            />
                                            <label>All</label>
                                        </li>
                                        <li>
                                            <input
                                                checked={dishStatusFilter.InUse}
                                                type="checkbox"
                                                onChange={handleInUseFilter}
                                                className="mx-2"
                                            />
                                            <label>In Use</label>
                                        </li>
                                        <li>
                                            <input
                                                checked={dishStatusFilter.Returned}
                                                type="checkbox"
                                                onChange={handleReturnFilter}
                                                className="mx-2"
                                            />
                                            <label>Returned</label>
                                        </li>
                                        <li>
                                            <input
                                                checked={dishStatusFilter.Overdue}
                                                type="checkbox"
                                                onChange={handleOverdueFilter}
                                                className="mx-2"
                                            />
                                            <label>Overdue</label>
                                        </li>
                                    </ul>
                                </div>
                            </th>
                            <th scope="col">
                                Overdue
                                <button
                                    className="btn border-0 p-0 mx-1"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                />
                            </th>
                            <th scope="col">
                                Times Borrowed
                                <button
                                    className="btn border-0 p-0 mx-1"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                />
                            </th>
                            <th
                                scope="col"
                                style={{
                                    borderTopRightRadius: '10px',
                                }}>
                                Date Added
                                <button
                                    className="btn border-0 p-0 mx-1"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {shownDishList.map((dish, key) => (
                            <AdminDishTableRow
                                dish={dish}
                                key={key}
                                selectedHandler={selectItemHandler}
                                index={key}
                                selectedList={selectedList}
                            />
                        ))}
                    </tbody>
                </table>
                {/* 
                <div className="dishDashboard-pagenumber">
                </div> */}
            </div>
        </>
    )
}
