import { useState, useEffect } from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import scan_icon from '../assets/scan.svg'
import leaf_white from '../assets/leaf-white.svg'
import leaf_green from '../assets/leaf-green.svg'
import external_link from '../assets/external_link.svg'
import DishCard from '../widgets/dishcard'
import '../styles/index.css'
import axios from 'axios'
import { Box, AppBar, Typography, Link as LinkMUI } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { BallTriangle } from 'react-loader-spinner'
import MobileBackground from '../assets/leaf-mobile-background.png'

// Display DishCard for unreturned dishes
const DishLog = ({ dishes }) => {
    const { sessionToken } = useAuth()
    if (!dishes) {
        dishes = []
    }
    return (
        <div id="dish-log" className="mt-3">
            {dishes.map((dish) => {
                if (dish.returned.timestamp == '') {
                    return <DishCard dish={dish} token={sessionToken} key={dish.id} />
                }
            })}
        </div>
    )
}

// Get user dishes status to be displayed in the homepage
const GetDishes = (dishesUsed) => {
    const checkedOutDishes = dishesUsed?.filter((dish) => dish.returned.timestamp == '').length
    return (
        <div id="dishes" style={{ marginTop: '24px' }}>
            <div className="d-flex justify-content-between">
                <p className="sub-header-3">My Dishes</p>
                <p className="details-2 mt-1">{checkedOutDishes} in use</p>
            </div>

            {checkedOutDishes != 0 ? (
                <DishLog dishes={dishesUsed} />
            ) : (
                <div className="d-flex flex-column">
                    <div className="mt-5 d-flex justify-content-center">
                        <img src={leaf_green} style={{ transform: 'rotate(-90deg)' }} />
                        <img src={leaf_green} style={{ transform: 'rotate(-45deg)', marginTop: '-16px' }} />
                        <img src={leaf_green} />
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                        <p className="details-1 text-center" style={{ maxWidth: '244px' }}>
                            You don't have any dishes borrowed at the moment. Start borrowing to make an impact!
                        </p>
                    </div>
                    <ReactRouterLink
                        to="/borrow"
                        className="btn-primary align-self-center mt-2 link"
                        style={{ textDecoration: 'none', color: '#FFF' }}>
                        <p className="sub-header-3 text-center m-2">Borrow</p>
                    </ReactRouterLink>
                </div>
            )}
        </div>
    )
}

// Display homepage for new users
const NewUser = (dishesUsed) => {
    const content = GetDishes(dishesUsed)
    return (
        <div style={{ padding: '24px' }}>
            <div className="sub-header-3">
                How It Works
                <div
                    className="light-blue d-flex flex-column justify-content-end"
                    style={{
                        height: '80px',
                        width: '100%',
                        borderRadius: '10px',
                        marginTop: '16px',
                        position: 'relative',
                    }}>
                    <p
                        className="details-1"
                        style={{
                            height: '60px',
                            width: '198px',
                            marginTop: '-32px',
                            marginBottom: '16px',
                            marginLeft: '24px',
                            marginRight: '40px',
                        }}>
                        {' '}
                        More details about the process behind borrowing and returning dishes.
                    </p>
                    <LinkMUI href="https://www.dishzero.ca/how-it-works-1">
                        <img
                            src={external_link}
                            alt="External Link"
                            style={{ position: 'absolute', top: '19px', bottom: '20px', right: '24px' }}
                        />
                    </LinkMUI>
                </div>
            </div>
            <div className="sub-header-3" style={{ marginTop: '24px' }}>
                Our Impact
                <div
                    className="light-blue d-flex flex-column justify-content-end"
                    style={{
                        height: '80px',
                        width: '100%',
                        borderRadius: '10px',
                        marginTop: '16px',
                        position: 'relative',
                    }}>
                    <p
                        className="details-1"
                        style={{
                            height: '48px',
                            width: '198px',
                            marginTop: '-32px',
                            marginBottom: '16px',
                            marginLeft: '24px',
                            marginRight: '40px',
                        }}>
                        {' '}
                        Learn more about the impact we are leaving on the environment.
                    </p>
                    <LinkMUI href="https://www.dishzero.ca/impact">
                        <img
                            src={external_link}
                            alt="External Link"
                            style={{
                                position: 'absolute',
                                top: '19px',
                                bottom: '20px',
                                right: '24px',
                            }}
                        />
                    </LinkMUI>
                </div>
            </div>
            {content}
        </div>
    )
}

// Display homepage for existing users
const ExistingUser = (dishesUsed) => {
    const content = GetDishes(dishesUsed)
    const returnedDishes = dishesUsed?.filter((dish) => dish.returned.timestamp != '').length
    return (
        <div style={{ padding: '24px' }}>
            <div id="impact" className="sub-header-3">
                My Impact
                <div className="d-flex justify-content-between" style={{ marginTop: '16px' }}>
                    <div
                        className="light-blue d-flex flex-column justify-content-end"
                        style={{
                            height: '118px',
                            width: '48%',
                            borderRadius: '10px',
                            padding: '16px',
                            position: 'relative',
                        }}>
                        <img src={leaf_white} alt="leaf" style={{ position: 'absolute', top: '16px', right: '16px' }} />
                        <p className="header mb-0" data-testid="returned-dishes-count">
                            {returnedDishes}
                        </p>
                        <p className="sub-header-3 mb-1">Dishes Used</p>
                    </div>
                    <div
                        className="light-blue d-flex flex-column justify-content-end"
                        style={{
                            height: '118px',
                            width: '48%',
                            borderRadius: '10px',
                            padding: '16px',
                            position: 'relative',
                        }}>
                        <img src={leaf_white} alt="leaf" style={{ position: 'absolute', top: '16px', right: '16px' }} />
                        <div className="d-flex">
                            <p className="header mb-0" data-testid="waste-diverted-amt">
                                {returnedDishes * 0.5}
                            </p>
                            <p className="sub-header-2 mb-1" style={{ alignSelf: 'end', marginLeft: '7px' }}>
                                Lbs
                            </p>
                        </div>
                        <p className="sub-header-3 mb-1">Waste Diverted</p>
                    </div>
                </div>
            </div>
            {content}
        </div>
    )
}

const Header = () => {
    return (
        <div>
            <Box sx={{ flexGrow: 1, position: 'relative', height: '14vh' }}>
                <AppBar
                    position="relative"
                    sx={{
                        backgroundColor: '#68B49A',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Typography sx={{ fontWeight: '500', fontSize: '20px', mb: '-24px' }}> Home </Typography>
                </AppBar>
            </Box>
        </div>
    )
}

const Footer = () => {
    return (
        <div style={{ padding: '24px', position: 'fixed', bottom: '0px', right: '0px' }}>
            <ReactRouterLink to={'/borrow'}>
                <img src={scan_icon} alt="scan icon" />
            </ReactRouterLink>
        </div>
    )
}

export default () => {
    //Show spinner as soon as page is refreshed
    const [isLoading, setIsLoading] = useState(true)
    const { currentUser, sessionToken } = useAuth()
    const [dishesUsed, setDishesUsed] = useState([])
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768) //eslint-disable-line @typescript-eslint/no-unused-vars
    let content
    // Fetch dishes transaction for the user
    useEffect(() => {
        const redirectURL = sessionStorage.getItem('previousURL')
        if (redirectURL) {
            // Redirect to the borrow page
            window.location.href = redirectURL
        } else {
            axios
                .get(`/api/transactions`, {
                    headers: { 'x-api-key': `${process.env.REACT_APP_API_KEY}`, 'session-token': sessionToken! },
                    baseURL: `${process.env.REACT_APP_BACKEND_ADDRESS}`,
                })
                .then(function (response) {
                    setDishesUsed(response.data.transactions)
                    setIsLoading(false)
                })
                .catch(function (error) {
                    console.log(error)
                })
        }

        // Clear the temporary storage
        sessionStorage.removeItem('previousURL')
    }, [])

    const user = currentUser

    if (user) {
        // User is defined
        if (Number(dishesUsed) === 0) {
            content = NewUser(dishesUsed)
        } else {
            content = ExistingUser(dishesUsed)
        }
    }
    if (isLoading) {
        return (
            <Box sx={isMobile ? styles.rootMobileLoader : styles.rootDesktop}>
                <BallTriangle
                    data-testid="ball-triangle-loading"
                    height={100}
                    width={100}
                    radius={5}
                    color="#4fa94d"
                    ariaLabel="ball-triangle-loading"
                    visible={true}
                />
            </Box>
        )
    }
    return (
        <div>
            <Header />
            {content}
            <Footer />
        </div>
    )
}

const styles = {
    rootDesktop: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rootMobileLoader: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${MobileBackground})`,
        backgroundSize: 'cover',
    },
}
