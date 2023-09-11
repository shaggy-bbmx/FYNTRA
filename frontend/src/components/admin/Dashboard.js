import React, { useEffect } from 'react'
import './Dashboard.css'
import Sidebar from './Sidebar.js'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminProduct } from '../../actions/productAction'
import { getALLOrders } from '../../actions/orderAction'
import { getAllUsers } from '../../actions/userAction'
import { Link } from 'react-router-dom/'
import { Typography } from '@material-ui/core'
import { Doughnut, Line } from 'react-chartjs-2'






const Dashboard = () => {

    //...FETCHING DISPATCH AND ALL NEEDED STATES
    const dispatch = useDispatch()
    const { products } = useSelector(state => state.getAdminProduct)
    const { orders, totalAmount } = useSelector(state => state.getAllOrders)
    const { users } = useSelector(state => state.getAllUsers)

    let outOfStock = 0
    products && products.forEach((product) => {
        if (product.Stock === 0) ++outOfStock
    })


    //...BAR GRAPH FOR EARNINGS
    const lineState = {
        labels: ["Initial Amount", "Amount Earned"],
        datasets: [
            {
                label: "TOTAL AMOUNT",
                backgroundColor: ["tomato"],
                hoverBackgroundColor: ["rgb(197, 72, 49)"],
                data: [0, Math.round(totalAmount)]
            }
        ]
    }

    //...PIE GRAPH FOR MEASURING REMAINING STOCK
    const doughnutState = {
        labels: ["Out of Stock", "InStock"],
        datasets: [
            {
                backgroundColor: ["#6800B4", "#00A6B4"],
                hoverBackgroundColor: ["#4B5000", "#35014F"],
                data: [outOfStock, products.length - outOfStock],
            },
        ],
    }


    useEffect(() => {
        dispatch(getAdminProduct())
        dispatch(getALLOrders())
        dispatch(getAllUsers())
    }, [dispatch])

    return (

        <div className='dashboard'>

            <Sidebar />
            <div className="dashboardContainer">
                <Typography component="h1">Dashboard</Typography>

                <div className="dashboardSummary">
                    <div>
                        <p>Total Amount <br /> ${Math.round(totalAmount)}</p>
                    </div>
                    <div className="dashboardSummaryBox2">
                        <Link to="/admin/products">
                            <p>Product</p>
                            <p>{products && products.length}</p>
                        </Link>
                        <Link to="/admin/orders">
                            <p>Orders</p>
                            <p>{orders && orders.length}</p>
                        </Link>
                        <Link to="/admin/users">
                            <p>Users</p>
                            <p>{users && users.length}</p>
                        </Link>
                    </div>
                </div>

                <div className="lineChart">
                    <Line data={lineState} />
                </div>

                <div className="doughnutChart">
                    <Doughnut data={doughnutState} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
