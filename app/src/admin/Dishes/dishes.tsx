/*eslint-disable*/
import leaf_icon from '../../assets/leaf.svg'
import { BrowserView, MobileView } from 'react-device-detect'
import Toolbar from '../toolbar'
import { dishes } from '../constants'
import { StyledAdminPageLayout } from '../styledAdmin'
import { StyledDishDataLayout } from '../styledDishes'
import AdminDishHeader from './dishHeader'
import AdminDishTable from './dishTable'

export default function Dishes() {
    return (
        <>
            {/* on mobile */}
            {/* <MobileView>
                <div>
                    <h1>Admin Panel</h1>
                </div>

                <img src={leaf_icon} alt="" />
                <h2>You're on mobile! Please go to desktop to view admin panel.</h2>
            </MobileView> */}

            {/* on desktop */}
            <BrowserView>
                <StyledAdminPageLayout>
                    <Toolbar />
                    <StyledDishDataLayout>
                        <AdminDishHeader />
                        <AdminDishTable origDishList={dishes} />
                    </StyledDishDataLayout>
                </StyledAdminPageLayout>
            </BrowserView>
        </>
    )
}

const TransactionHistory = () => {
    return (
        <div>
            <div className="dishDashboard-main-title">Transactions History</div>
            <div className="transaction-daterange">Date Range</div>
        </div>
    )
}
