/*eslint-disable*/
import leaf_icon from '../../assets/leaf.svg'
import { BrowserView, MobileView } from 'react-device-detect'
import Toolbar from '../toolbar'
import { dishes } from '../constants'
import AdminDishHeader from './dishHeader'
import AdminDishTable from './dishTable'
import { Box } from '@mui/material'
import { useState } from 'react'

export default function Dishes() {
    const [rows, setRows] = useState(dishes)
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
                <Box display="flex">
                    <Toolbar />
                    <Box sx={{ m: '20px' }}>
                        <AdminDishHeader allRows={dishes} setRows={setRows} />
                        <AdminDishTable rows={rows} setRows={setRows} />
                    </Box>
                </Box>
            </BrowserView>
        </>
    )
}
