import React, { useState, useEffect } from "react";
import leaf_icon from "../assets/leaf.svg";
import { MobileView, BrowserView } from "react-device-detect";
import Toolbar from "../admin/toolbar";
import '../styles/admin.css';
import leaf_white from "../assets/leaf-white.svg";
import search_icon from "../assets/search.svg";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";



function dishStatus(dishNumbers: number[]) {

  return(
    <div className="d-flex">

      <div className="admin-container" style={{position: 'relative'}}>
        <img src={leaf_white} style={{position:'absolute', top:'16px', right:'16px'}}/>
        <p className="header" style={{marginTop: 10}}>{dishNumbers[0]}</p>
        <p className="sub-header-4">Currently in use</p>
      </div>
      <div className="admin-container" style={{position: 'relative'}}>
        <img src={leaf_white} style={{position:'absolute', top:'16px', right:'16px'}}/>
        <p className="header" style={{marginTop: 10}}>{dishNumbers[1]}</p>
        <p className="sub-header-4">Returned</p>
      </div>
      <div className="admin-container" style={{position: 'relative'}}>
        <img src={leaf_white} style={{position:'absolute', top:'16px', right:'16px'}}/>
        <p className="header" style={{marginTop: 10}}>{dishNumbers[2]}</p>
        <p className="sub-header-4">Overdue</p>
      </div>
      <div className="admin-container" style={{position: 'relative'}}>
        <img src={leaf_white} style={{position:'absolute', top:'16px', right:'16px'}}/>
        <p className="header" style={{marginTop: 10}}>{dishNumbers[3]}</p>
        <p className="sub-header-4">Broken/lost</p>
      </div>

  </div>

  );
}

function dishTag(text) {
  let color = '';
  switch(text) {
    case "mug":
      color = '#496EA5';
      break;
    case "dish":
      color = '#496EA5';
      break;
    case "overdue":
      color = '#BF4949';
      break;
    case "in use":
      color = '#68B49A';
      break;
    case "returned":
      color = '#29604D';
      break;
    case "broken":
      color = '#BF4949'
      break;
    case "lost":
      color = '#BF4949'
      break;
  }
  return(
    <div className="tag-container d-flex" style={{borderColor: color, marginTop: '-4px'}}>
      <p style={{color: color}}>{text}</p>
    </div>
  );
}

function searchBar() {
  return(
    <div className="search-container d-flex" style={{marginRight: '8px'}}>
      <img src={search_icon} style={{height: '14px', width: '14px', alignSelf: 'center', marginRight: '8px'}}/>
      <p>Type text here...</p>
    </div>
  );
}

function searchButton() {
  return(
    <div className="search-b d-flex">
      <p className='sub-header-3'>Search</p>
    </div>
  );
}

function addDish() {
  return(
    <div className="add-dish d-flex">
      <p className='sub-header-3'>+ Add new dish</p>
    </div>
  );
}

function dishTable() {
  return(
    <div className="table-header d-flex" style={{position: 'relative'}}>
      <p style={{position: "absolute", marginLeft: '4%'}}>Dish ID</p>
      <p style={{position: "absolute", marginLeft: '22%'}}>Dish type</p>
      <p style={{position: "absolute", marginLeft: '41%'}}>Dish Status</p>
      <p style={{position: "absolute", marginLeft: '65%'}}>Overdue</p>
      <p style={{position: "absolute", marginLeft: '84%'}}>Email</p>
    </div>
  );
}

function findEmail(ID, users) {
  if (ID == null) {
    return('')
  }
  const user = users.filter(user => user.id == ID);
  if (user[0] == undefined) {
    return('');
  }
  return(user[0].email)
}

function findDish(ID, dishesUsed) {
  if (ID == null) {
    return('')
  }
  const dish = dishesUsed.filter(dish => dish.id == ID);
  if (dish[0] == undefined) {
    return(null);
  }
  return(dish)
}

function findOverdue(dishesUsed, transactionsUsed) {
  const transactions = transactionsUsed.filter(transaction => transaction.returned.timestamp == "");
  const timeToday = new Date();
  var num = 0;
  transactions.map(transaction => 
    {
      var time = transaction.timestamp.slice(0,10);
      time = new Date(time);
      var difference = (timeToday.getTime() - time.getTime()) / 86400000;
      difference = parseInt(difference.toString());
      if (difference > 2) {
        num += 1;
      }
  });
  return num;
}

function createRows(dishesUsed, transactionsUsed, users) {
  const list: any[] = [];
  const timeToday = new Date();
  transactionsUsed.map(transaction => {
    let dish = findDish(transaction.dish, dishesUsed);
    if (dish == null) {
      return [];
    }
    else {
      dish = dish[0];
    }
    let id = dish.qid;
    let type = dish.type;
    let email = findEmail(transaction.userId, users);
    var status = '';
    let overdue = '';
    let timestamp = transaction.timestamp
    if (transaction.returned.timestamp == "") {
      var time = transaction.timestamp.slice(0,10);
      time = new Date(time);
      var difference = (timeToday.getTime() - time.getTime()) / 86400000;
      difference = parseInt(difference.toString());
      if (difference > 2) {
        status = 'overdue';
        difference = difference - 2;
        overdue = difference.toString()+' days';
      }
      else {
        status = 'in use';
      }
    }
    else if (transaction.returned.timestamp != "") {
      status = 'returned';
    }
    const row = {id: id, type: type, email: email, status: status, overdue: overdue, timestamp: timestamp};
    list.push(row);
  });
  return list;
}

function Rows(tableRows) {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = tableRows.slice(firstIndex, lastIndex);
  const npage = Math.ceil(tableRows.length / recordsPerPage);
  const numbers: number[] = [];
  for (let i = 1; i <= npage; i++) {
    numbers.push(i);
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
  return(
    <div>
      <div>
      {records.map(row =>
        <div className="row-container d-flex" style={{position: 'relative'}}>
          <p style={{position: "absolute", marginLeft: '4%'}}>{row.id}</p>
          <div style={{position: "absolute", marginLeft: '22%'}}>{dishTag(row.type)}</div>
          <p style={{position: "absolute", marginLeft: '41%'}}>{dishTag(row.status)}</p>
          <p style={{position: "absolute", marginLeft: '65%'}}>{row.overdue}</p>
          <p style={{position: "absolute", marginLeft: '84%'}}>xxxxx1@ualberta.ca</p>
        </div>
      )}
      </div>
      <nav>
        <ul className='pagination'>
          <li className='page-item'>
            <a href='#' className='page-link'
            onClick={prePage}>Prev</a>
          </li>
          {
            numbers.map((n, i) => (
              <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i}>
                <a href='#' className='page-link'
                onClick={()=> changeCPage(n)}>{n}</a>
              </li>
            ))
          }
          <li className='page-item'>
            <a href='#' className='page-link'
            onClick={nextPage}>Next</a>
          </li>
        </ul>
      </nav>
    </div>
    
    );
}

function sortRows(rows) {
  const tableRows = rows.sort(function(a, b) {
    var aTime = a.timestamp.slice(0,10);
    aTime = new Date(aTime);
    var bTime = b.timestamp.slice(0,10);
    bTime = new Date(bTime);
    if (aTime.getTime() < bTime.getTime()) {
      return 1;
    }
    if (aTime.getTime() > bTime.getTime()) {
      return -1;
    }
    return 0;
  });
  return tableRows;

}

function Admin() {

  const { currentUser, sessionToken } = useAuth();
  const [dishesUsed, setDishesUsed] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [transactionsUsed, setTransactionsUsed] = useState<any[]>([]);

  //get dishes
  useEffect(() => {
    axios
    .get(`${process.env.REACT_APP_BACKEND_ADDRESS}/api/dish`, {
      headers: { "x-api-key": `${process.env.REACT_APP_API_KEY}`, "session-token": sessionToken },
      params: {all: true, transaction: true},
    })
    .then(function (response) {
      setDishesUsed(response.data.dishes);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  //get users
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_ADDRESS}/api/users`, {
        headers: { "x-api-key": `${process.env.REACT_APP_API_KEY}`, "session-token": sessionToken },
      })
      .then(function (response) {
        setUsers(response.data.users);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  //get transactions
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_ADDRESS}/api/transactions`, {
        headers: { "x-api-key": `${process.env.REACT_APP_API_KEY}`, "session-token": sessionToken },
        params: {all: true},
      })
      .then(function (response) {
        setTransactionsUsed(response.data.transactions);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);


  const numBorrowedDishes = dishesUsed.filter(dish => dish.borrowed == true).length;
  const returnedDishes = dishesUsed.filter(dish => dish.borrowed == false).length;
  const brokenDishes = dishesUsed.filter(dish => dish.condition == 'shattered').length;
  const overdue = findOverdue(dishesUsed, transactionsUsed);

  let dishNumbers = [numBorrowedDishes, returnedDishes, overdue, brokenDishes];
  let tableRows = createRows(dishesUsed, transactionsUsed, users);
  tableRows = sortRows(tableRows);
  let row = Rows(tableRows); 
  let bar = dishStatus(dishNumbers);
  let table = dishTable();
  let search = searchBar();
  let button = searchButton();
  let add = addDish();

  return (
    <>
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
          <div style={{marginTop: '48px', marginLeft: '40px', marginRight: '40px', flexGrow: 1}}>
            <p className="sub-header-2">Home</p>
            {bar}
            <p className="sub-header-2" style={{marginTop: 40}}>Recent transactions</p>
 
            <div className="d-flex" style={{marginBottom: '16px'}}>
              {search}
              {button}
              <div className="d-flex justify-content-end" style={{width: '100%'}}>
                {add}
              </div>
            </div>
            {table}
            {row}
          </div>
        </div>
      </BrowserView>
    </>
  );
}

export default Admin;
