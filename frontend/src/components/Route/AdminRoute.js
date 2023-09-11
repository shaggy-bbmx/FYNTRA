import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'






const AdminRoute = ({ component: Component, ...rest }) => {
    const { loading, isAuthenticated, user } = useSelector((state) => state.user)

    return (
        <>
            {(!loading && user && user.role === 'admin') ? (
                <Route {...rest} render={(props) => {
                    if (isAuthenticated === false) {
                        return <Redirect to='/login' />
                    }
                    return <Component {...props} />
                }} />
            ) : <></>}
        </>
    )
}

export default AdminRoute