import React from "react";
import leaf_icon from "../assets/leaf.svg";
import { MobileView, BrowserView } from "react-device-detect";
import Toolbar from "../admin/toolbar";
import '../styles/admin.css';
import leaf_white from "../assets/leaf-white.svg";
import search_icon from "../assets/search.svg";
import Dishaddmodal from "../admin/dishaddmodal";


// for the 4 status blocks at top, currently using dummy data
function dishStatus() {

  let dishNumbers = [34, 30, 1, 1]

  return(
    <div className="d-flex">


      <div className="admin-container" style={{position: 'relative'}}>
        <img src={leaf_white} style={{position:'absolute', top:'16px', right:'16px'}}/>
        <p className="header" style={{marginTop: 10}}>34</p>
        <p className="sub-header-4">Currently in use</p>
      </div>


      <div className="admin-container" style={{position: 'relative'}}>
        <img src={leaf_white} style={{position:'absolute', top:'16px', right:'16px'}}/>
        <p className="header" style={{marginTop: 10}}>30</p>
        <p className="sub-header-4">Returned</p>
      </div>


      <div className="admin-container" style={{position: 'relative'}}>
        <img src={leaf_white} style={{position:'absolute', top:'16px', right:'16px'}}/>
        <p className="header" style={{marginTop: 10}}>1</p>
        <p className="sub-header-4">Overdue</p>
      </div>


      <div className="admin-container" style={{position: 'relative'}}>
        <img src={leaf_white} style={{position:'absolute', top:'16px', right:'16px'}}/>
        <p className="header" style={{marginTop: 10}}>1</p>
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

// styling for search bar
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

// Header for table
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

// styling for a single row in table, currently hard coded for styling purposes 
function rows() {

  let mug = dishTag('mug');
  let overdue = dishTag('returned');

  return(
    <div className="row-container d-flex" style={{position: 'relative'}}>
      <p style={{position: "absolute", marginLeft: '4%'}}>1234567</p>
      <div style={{position: "absolute", marginLeft: '22%'}}> {mug} </div>
      <p style={{position: "absolute", marginLeft: '41%'}}> {overdue} </p>
      <p style={{position: "absolute", marginLeft: '65%'}}>2 days</p>
      <p style={{position: "absolute", marginLeft: '84%'}}>xxxxx1@ualberta.ca</p>
    </div>
    );
}


function admin() {

  let bar = dishStatus();
  let table = dishTable();
  let search = searchBar();
  let button = searchButton();
  let row = rows();

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

        {/* pop up for add dish button */}
        <Dishaddmodal show={undefined} onCancel={undefined} />

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
                <button className="add-dish d-flex border-0">
                  <p className='sub-header-3'>+ Add new dish</p>
                </button>
              </div> 
            </div>
            {table}
            {row}
            {row}
            {row}
          </div>
        </div>
        


      </BrowserView>
    </>
  );
}


export default admin;