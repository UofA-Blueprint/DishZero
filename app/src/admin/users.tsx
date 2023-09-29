import React from "react";
import leaf_icon from "../assets/leaf.svg";
import { BrowserView, MobileView } from "react-device-detect";
import Toolbar from "./toolbar";
import { StyledAdminPageLayout } from "./styledAdmin";
import { mockUsers, User } from "./usersModels";
import { Table } from "antd";
import type { ColumnsType, TableProps } from 'antd/es/table';

const columns: ColumnsType<User> = [
    {
        title: "Email Address",
        dataIndex: "email",
        key: "email",
        sorter: (a, b) => a.email.localeCompare(b.email)
    },
    {
        title: "In Use",
        dataIndex: "inUse",
        key: "inUse",
        sorter: (a, b) => a.inUse - b.inUse
    },
    {
        title: "Overdue",
        dataIndex: "overdue",
        key: "overdue",
        sorter: (a, b) => a.overdue - b.overdue
    },
    {
        title: "Role",
        dataIndex: "role",
        key: "role",
        filters: [
            {
                text: "Basic",
                value: "Basic"
            },
            {
                text: "Volunteer",
                value: "Volunteer"
            },
            {
                text: "Admin",
                value: "Admin"
            },
        ],
        onFilter: (value, user: User) => user.role === value,
    },
]

const onChange: TableProps<User>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
};

function Users() {
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
                <StyledAdminPageLayout>
                    <Toolbar />
                    <Table dataSource={mockUsers} columns={columns} onChange={onChange} />
                </StyledAdminPageLayout>
            </BrowserView>
        </>
    );
}

export default Users;
