/* eslint-disable */
import { useState, useEffect } from 'react'
import leaf_icon from '../assets/leaf.svg'
import { MobileView, BrowserView } from 'react-device-detect'
import Toolbar from '../admin/toolbar'
import '../styles/admin.css'
import leaf_white from '../assets/leaf-white.svg'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { Box, ThemeProvider, createTheme } from '@mui/material'
import AdminDishes from '../admin/Dishes/dishesPage'
import { SnackbarProvider } from 'notistack'
import {
    DISHZERO_COLOR,
    DISHZERO_COLOR_DARK,
    DISHZERO_COLOR_LIGHT,
    DishStatus,
    SECONDARY,
    SECONDARY_DARK,
    SECONDARY_LIGHT,
} from '../admin/Dishes/constants'

function dishStatus(dishNumbers: number[]) {
    return (
        <div className="d-flex">
            <div className="admin-container" style={{ position: 'relative' }}>
                <img src={leaf_white} style={{ position: 'absolute', top: '16px', right: '16px' }} />
                <p className="header" style={{ marginTop: 10 }} data-testid="in-use">
                    {dishNumbers[0]}
                </p>
                <p className="sub-header-4">Currently in use</p>
            </div>
            <div className="admin-container" style={{ position: 'relative' }}>
                <img src={leaf_white} style={{ position: 'absolute', top: '16px', right: '16px' }} />
                <p className="header" style={{ marginTop: 10 }} data-testid="returned">
                    {dishNumbers[1]}
                </p>
                <p className="sub-header-4">Available</p>
            </div>
            <div className="admin-container" style={{ position: 'relative' }}>
                <img src={leaf_white} style={{ position: 'absolute', top: '16px', right: '16px' }} />
                <p className="header" style={{ marginTop: 10 }} data-testid="overdue-count">
                    {dishNumbers[2]}
                </p>
                <p className="sub-header-4" data-testid="overdue-text">
                    Overdue
                </p>
            </div>
            <div className="admin-container" style={{ position: 'relative' }}>
                <img src={leaf_white} style={{ position: 'absolute', top: '16px', right: '16px' }} />
                <p className="header" style={{ marginTop: 10 }} data-testid="lost-count">
                    {dishNumbers[3]}
                </p>
                <p className="sub-header-4">Dishes Lost</p>
            </div>
        </div>
    )
}

function dishTag(text) {
    let color = ''
    switch (text) {
        case 'mug':
            color = '#496EA5'
            break
        case 'dish':
            color = '#496EA5'
            break
        case 'overdue':
            color = '#BF4949'
            break
        case 'in use':
            color = '#68B49A'
            break
        case 'returned':
            color = '#29604D'
            break
        case 'broken':
            color = '#BF4949'
            break
        case 'lost':
            color = '#BF4949'
            break
    }
    return (
        <div className="tag-container d-flex" style={{ borderColor: color, marginTop: '-4px' }}>
            <p style={{ color: color }}>{text}</p>
        </div>
    )
}

function addDish() {
    return (
        <div className="add-dish d-flex">
            <p className="sub-header-3">+ Add new dish</p>
        </div>
    )
}

function dishTable() {
    return (
        <div className="table-header d-flex" style={{ position: 'relative' }}>
            <p style={{ position: 'absolute', marginLeft: '4%' }}>Dish ID</p>
            <p style={{ position: 'absolute', marginLeft: '22%' }}>Dish type</p>
            <p style={{ position: 'absolute', marginLeft: '41%' }}>Dish Status</p>
            <p style={{ position: 'absolute', marginLeft: '65%' }} data-testid="overdue-table">
                Overdue
            </p>
            <p style={{ position: 'absolute', marginLeft: '84%' }} data-testid="email-table">
                Email
            </p>
        </div>
    )
}

function findDish(ID, dishesUsed) {
    if (ID == null) {
        return ''
    }
    const dish = dishesUsed.filter((dish) => dish.id == ID)
    if (dish[0] == undefined) {
        return null
    }
    return dish
}

function findOverdue(dishesUsed, transactionsUsed) {
    const transactions = transactionsUsed.filter((transaction) => transaction.returned.timestamp == '')
    const timeToday = new Date()
    let num = 0
    transactions.map((transaction) => {
        let time = transaction.timestamp.slice(0, 10)
        time = new Date(time)
        let difference = (timeToday.getTime() - time.getTime()) / 86400000
        difference = parseInt(difference.toString())
        if (difference > 2) {
            num += 1
        }
    })
    return num
}

function findLost(dishesUsed, transactionsUsed) {
    const transactions = transactionsUsed.filter((transaction) => transaction.returned.timestamp == '')
    const timeToday = new Date()
    let num = 0
    transactions.map((transaction) => {
        let time = transaction.timestamp.slice(0, 10)
        time = new Date(time)
        let difference = (timeToday.getTime() - time.getTime()) / 86400000
        difference = parseInt(difference.toString())
        if (difference >= 30) {
            num += 1
        }
    })
    return num
}

function createRows(dishesUsed, transactionsUsed) {
    const list: any[] = []
    const timeToday = new Date()
    transactionsUsed.map((transaction) => {
        let dish = findDish(transaction.dish, dishesUsed)
        if (dish == null) {
            return []
        } else {
            dish = dish[0]
        }
        const id = dish.qid // this is a number
        const type = dish.type
        let email = ''
        if (transaction.user == undefined) {
            email = 'NULL'
        } else {
            email = transaction.user.email
        }
        let status = ''
        let overdue = ''
        let timestamp
        if (transaction.returned.timestamp != '') {
            timestamp = transaction.returned.timestamp
        } else {
            timestamp = transaction.timestamp
        }
        if (transaction.returned.timestamp == '') {
            let time = transaction.timestamp.slice(0, 10)
            time = new Date(time)
            let difference = (timeToday.getTime() - time.getTime()) / 86400000
            difference = parseInt(difference.toString())
            if (difference >= 30) {
                status = 'lost'
            } else if (difference > 2) {
                status = 'overdue'
                difference = difference - 2
                overdue = difference.toString() + ' day(s)'
            } else {
                status = 'in use'
            }
        } else if (transaction.returned.timestamp != '') {
            status = 'returned'
        }
        const row = { id: id, type: type, email: email, status: status, overdue: overdue, timestamp: timestamp }
        list.push(row)
    })
    return list
}

function Rows(tableRows, search) {
    function searchFilter(item) {
        return item.id == search
    }

    if (search.length > 0) {
        const rows = tableRows.filter(searchFilter)
        tableRows = rows
    }

    const [currentPage, setCurrentPage] = useState(1)
    const recordsPerPage = 6
    const lastIndex = currentPage * recordsPerPage
    const firstIndex = lastIndex - recordsPerPage
    const records = tableRows.slice(firstIndex, lastIndex)
    const npage = Math.ceil(tableRows.length / recordsPerPage)
    const numbers: number[] = []

    for (let i = 1; i <= npage; i++) {
        numbers.push(i)
    }
    function nextPage() {
        if (currentPage !== npage) {
            setCurrentPage(currentPage + 1)
        }
    }
    function prePage() {
        if (currentPage != 1) {
            setCurrentPage(currentPage - 1)
        }
    }
    function changeCPage(id) {
        setCurrentPage(id)
    }
    return (
        <div>
            <div>
                {records.map((row) => (
                    <div className="row-container d-flex" style={{ position: 'relative' }}>
                        <p style={{ position: 'absolute', marginLeft: '4%' }} data-testid={`row-${row.id}`}>
                            {row.id}
                        </p>
                        <div style={{ position: 'absolute', marginLeft: '22%' }} data-testid={`row-${row.type}`}>
                            {dishTag(row.type)}
                        </div>
                        <p style={{ position: 'absolute', marginLeft: '41%' }} data-testid={`row-${row.status}`}>
                            {dishTag(row.status)}
                        </p>
                        <p style={{ position: 'absolute', marginLeft: '65%' }} data-testid={`row-${row.overdue}`}>
                            {row.overdue}
                        </p>
                        <p style={{ position: 'absolute', marginLeft: '84%' }} data-testid={`row-${row.email}`}>
                            {row.email}
                        </p>
                    </div>
                ))}
            </div>
            <nav>
                <ul className="pagination">
                    <li className="page-item">
                        <a href="#" className="page-link" onClick={prePage}>
                            Prev
                        </a>
                    </li>
                    {numbers.map((n, i) => (
                        <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i}>
                            <a href="#" className="page-link" onClick={() => changeCPage(n)}>
                                {n}
                            </a>
                        </li>
                    ))}
                    <li className="page-item">
                        <a href="#" className="page-link" onClick={nextPage}>
                            Next
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

function sortRows(rows) {
    const tableRows = rows.sort(function (a, b) {
        let aTime = a.timestamp.slice(0, 19)
        aTime = new Date(aTime)
        let bTime = b.timestamp.slice(0, 19)
        bTime = new Date(bTime)
        if (aTime.getTime() < bTime.getTime()) {
            return 1
        }
        if (aTime.getTime() > bTime.getTime()) {
            return -1
        }
        return 0
    })
    return tableRows
}

function Admin() {
    const { currentUser, sessionToken } = useAuth()
    const [dishesUsed, setDishesUsed] = useState<any[]>([])
    const [transactionsUsed, setTransactionsUsed] = useState<any[]>([])
    const [searchInput, setSearchInput] = useState('')
    const [searchValue, setSearchValue] = useState('')

    //get dishes
    useEffect(() => {
        axios
            .get(`/api/dish`, {
                headers: { 'x-api-key': `${process.env.REACT_APP_API_KEY}`, 'session-token': sessionToken! },
                params: { all: true, transaction: true },
                baseURL: `${process.env.REACT_APP_BACKEND_ADDRESS}`,
            })
            .then(function (response) {
                setDishesUsed(response.data.dishes)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])

    //get transactions
    useEffect(() => {
        axios
            .get(`/api/transactions`, {
                headers: { 'x-api-key': `${process.env.REACT_APP_API_KEY}`, 'session-token': sessionToken! },
                params: { all: true },
                baseURL: `${process.env.REACT_APP_BACKEND_ADDRESS}`,
            })
            .then(function (response) {
                setTransactionsUsed(response.data.transactions)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])

    const searchChange = (value) => {
        value.preventDefault()
        setSearchInput(value.target.value)
    }

    const handleClick = () => {
        setSearchValue(searchInput)
    }

    const numBorrowedDishes = dishesUsed.filter((dish) => dish.borrowed == true).length
    const returnedDishes = dishesUsed.filter((dish) => dish.borrowed == false).length
    const lost = findLost(dishesUsed, transactionsUsed)
    const overdue = findOverdue(dishesUsed, transactionsUsed) - lost

    const dishNumbers = [numBorrowedDishes, returnedDishes, overdue, lost]
    let tableRows = createRows(dishesUsed, transactionsUsed)
    tableRows = sortRows(tableRows)
    const row = Rows(tableRows, searchValue)
    const bar = dishStatus(dishNumbers)
    const table = dishTable()
    const add = addDish()

    // const theme = createTheme({
    //     palette: {
    //         primary: {
    //             dark: DISHZERO_COLOR_DARK,
    //             light: DISHZERO_COLOR_LIGHT,
    //             main: DISHZERO_COLOR,
    //         },
    //         secondary: {
    //             dark: SECONDARY_DARK,
    //             light: SECONDARY_LIGHT,
    //             main: SECONDARY,
    //         },
    //     },
    // })

    return (
        // <ThemeProvider theme={theme}>
        <SnackbarProvider>
            {/* on mobile */}
            <MobileView>
                <div>
                    <h1>Admin Panel</h1>
                </div>
                <img src={leaf_icon} alt="" />
                <h2>You're on mobile! Please go to desktop to view admin panel.</h2>
            </MobileView>

            {/* on desktop */}
            <BrowserView>
                <div className="d-flex">
                    <Toolbar />
                    <div style={{ marginTop: '48px', marginLeft: '40px', marginRight: '40px', flexGrow: 1 }}>
                        <p className="sub-header-2">Home</p>
                        {bar}
                        <p className="sub-header-2" style={{ marginTop: 40 }}>
                            Recent transactions
                        </p>

                        <div className="d-flex" style={{ marginBottom: '16px' }}>
                            {/* search Bar */}

                            <input
                                className="search-container d-flex"
                                type="text"
                                placeholder="Type text here..."
                                onChange={searchChange}
                                value={searchInput}
                                style={{ marginRight: '8px' }}
                            />

                            <button className="search-b d-flex" onClick={handleClick}>
                                <p className="sub-header-3">Search</p>
                            </button>

                            <div className="d-flex justify-content-end" style={{ width: '100%' }}>
                                {add}
                            </div>
                        </div>
                        {table}
                        {row}
                    </div>
                </div>
            </BrowserView>
        </SnackbarProvider>
        // </ThemeProvider>
    )
}

export default Admin
