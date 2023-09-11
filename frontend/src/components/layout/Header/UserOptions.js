import React, { useState } from 'react'
import './Header.css'
import { SpeedDial, SpeedDialAction } from '@material-ui/lab'
import Backdrop from "@material-ui/core/Backdrop"
import DashboardIcon from "@material-ui/icons/Dashboard"
import PersonIcon from "@material-ui/icons/Person"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import ListAltIcon from "@material-ui/icons/ListAlt"
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAlert } from 'react-alert'
import { logout } from '../../../actions/userAction'
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import { useSelector } from 'react-redux'






const UserOptions = ({ user }) => {

    const [open, setOpen] = useState(false)
    const history = useHistory()
    const dispatch = useDispatch()
    const alert = useAlert()
    const { cartItems } = useSelector(state => state.cart)

    //VARIOUS DASHBOARD ICONS   
    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
        {
            icon: <ShoppingCartIcon style={{ color: cartItems.length > 0 ? "tomato" : "unset" }} />,
            name: `Cart(${cartItems.length})`, func: switchTocart
        }
    ]

    if (user.role === "admin") {
        options.unshift({
            icon: <DashboardIcon />,
            name: "Dashboard",
            func: dashboard,
        })
    }


    //VARIOUS FUNCTIONS OF DASHBOARD
    function dashboard() {
        history.push('/admin/dashboard')
    }

    function orders() {
        history.push('/orders')
    }

    function account() {
        history.push('/account')
    }

    function logoutUser() {
        dispatch(logout())
        alert.success(`Logout successful !!!!`)
        history.push('/login')
    }

    function switchTocart() {
        history.push('/cart')
    }

    return (
        <>
            <Backdrop open={open} style={{ zIndex: '10' }} />
            <SpeedDial
                ariaLabel='SpeedDial tooltip example'
                onClose={() => { setOpen(false) }}
                onOpen={() => { setOpen(true) }}
                open={open}
                direction='down'
                className='speedDial'
                style={{ zIndex: '11' }}
                icon={
                    <img
                        className="speedDialIcon"
                        src={user.avatar.url ? user.avatar.url : "/Profile.png"}
                        alt="Profile"
                    />
                }
            >
                {options.map((item) =>
                    <SpeedDialAction
                        key={item.name}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}
                        tooltipOpen={window.innerWidth <= 600 ? true : false}
                    />
                )}
            </SpeedDial>
        </>
    )
}

export default UserOptions
