import React from "react";
import leaf_icon from "../assets/leaf.svg";
import { MobileView, BrowserView } from "react-device-detect";
import Sidebar from "../admin/toolbar";
import UsersTable from "react-data-table-component";
import { useState, useEffect } from "react"
import CustomStyles from "../admin/tableStyles/customStylesTable";
import "../styles/admin.css"
import PaginationComponentOptions from "../admin/tableStyles/paginationEdit";



function AdminUser() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [perPage, setPerPage] = useState(10)

  const columns = [
    {
      name: "Email Address",
      selector: (row) => row.title,
    },
    {
      name: "In Use",
      selector: (row) => "4 dishes",
      sortable: true,
      highlightOnHover: true
    },
    {
      name: "Overdue",
      selector: (row) => 30,
      sortable: true
    },
    {
      name: "Role",
      selector: (row) => (row.completed ? "Yes" : "No"),
    }
  ]

  useEffect(() => {
    fetchTableData()
  }, [])

  async function fetchTableData() {
    setLoading(true)
    const URL = "https://jsonplaceholder.typicode.com/todos"
    const response = await fetch(URL)
  
    const users = await response.json()
    setData(users)
    setLoading(false)
  }
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
        {/* TODO: implement browser view when user is on desktop */}
        <div className="flex">
          <Sidebar></Sidebar>
          
          <div className="table-container flex flex-column width-80" style={{ margin: "20px" }}>
            <h1 className="h1-style margin-top-2">Users</h1>

            <div className="search-fields margin-top-1">
              <div><input type="text" name="SearchField" id="" placeholder="Type text here" /></div>
              <div><button >Search</button></div>
            </div>
          <UsersTable
            title=""
            columns={columns}
            data={data}
            progressPending={loading}
            pagination
            className="margin-top-1 addRadius"
            customStyles={CustomStyles}
            theme="light"
            paginationComponentOptions={PaginationComponentOptions}
          />
          </div>
        </div>
        
        
      </BrowserView>
    </>
  );
}

export default AdminUser;
