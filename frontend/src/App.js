import React, { useEffect, useState } from 'react'
import './App.css'
import Header from './components/layout/Header/Header'
import { Switch } from 'react-router-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import WebFont from 'webfontloader'
import Footer from './components/layout/Footer/Footer'
import Home from './components/Home/Home'
import ProductDetails from './components/Product/ProductDetails.js'
import Products from './components/Product/Products'
import Search from './components/Product/Search'
import LoginSignUp from './components/User/LoginSignUp'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from './actions/userAction'
import UserOptions from './components/layout/Header/UserOptions.js'
import Profile from './components/User/Profile.js'
import ProtectedRoute from './components/Route/ProtectedRoute'
import UpdateProfile from './components/User/UpdateProfile.js'
import UpdatePassword from './components/User/UpdatePassword.js'
import ForgotPassword from './components/User/ForgotPassword.js'
import ResetPassword from './components/User/ResetPassword.js'
import Cart from './components/Cart/Cart'
import Shipping from './components/Cart/Shipping.js'
import ConfirmOrder from './components/Cart/ConfirmOrder.js'
import Payment from './components/Cart/Payment.js'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import OrderSuccess from './components/Cart/OrderSuccess.js'
import MyOrders from './components/Order/MyOrders.js'
import OrderDetails from './components/Order/OrderDetails.js'
import Dashboard from './components/admin/Dashboard.js'
import AdminRoute from './components/Route/AdminRoute'
import ProductList from './components/admin/ProductList.js'
import UpdateProduct from './components/admin/UpdateProduct.js'
import NewProduct from './components/admin/NewProduct.js'
import OrderList from './components/admin/OrderList.js'
import UpdateOrder from './components/admin/UpdateOrder.js'
import UserList from './components/admin/UserList.js'
import UpdateUser from './components/admin/UpdateUser.js'
import ProductReviews from './components/admin/ProductReviews.js'
import axios from 'axios'
import NotFound from './components/layout/NotFound/NotFound.js'











function App() {

  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.user)

  //VARIABLE TO STORE PAYMENT API KEY
  const [stripeApiKey, setStripeApiKey] = useState('')

  //FUNCTION TO FETCH PAYMENT API KEY FROM BACKEND AND STORE IT IN ABOVE VARIABLE
  async function getStripeApiKey() {
    const { data } = await axios.get('/stripeApiKey')
    setStripeApiKey(data.stripeApiKey)
  }



  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    })

    if (isAuthenticated) dispatch(loadUser())
    //FETCHING PAYMENY API KEY
    getStripeApiKey()

  }, [dispatch])

  //...DISABLE RIGHT CLICK ON WEBSITE(prevents inspect eleement)
  window.addEventListener("contextmenu", (e) => e.preventDefault())

  return (
    <Router>
      <Header />

      {isAuthenticated && <UserOptions user={user} />}

      {stripeApiKey && <Elements stripe={loadStripe(stripeApiKey)}>
        <ProtectedRoute exact path='/process/payment' component={Payment} />
      </Elements>}

      <Switch>
        <Route exact path='/'><Home /></Route>
        <Route exact path='/product/:id'><ProductDetails /></Route>
        <Route exact path='/products'><Products /></Route>
        <Route exact path='/products/:keyword'><Products /></Route>
        <Route exact path='/search'><Search /></Route>
        <ProtectedRoute exact path='/account' component={Profile} />
        <ProtectedRoute exact path='/me/update' component={UpdateProfile} />
        <ProtectedRoute exact path='/password/update' component={UpdatePassword} />
        <Route exact path='/password/forgot' component={ForgotPassword} />
        <Route exact path='/password/reset/:token' component={ResetPassword} />
        <Route exact path='/cart' component={Cart} />
        <Route exact path='/login'><LoginSignUp /></Route>
        <ProtectedRoute exact path='/shipping' component={Shipping} />




        <ProtectedRoute exact path='/success' component={OrderSuccess} />
        <ProtectedRoute exact path='/orders' component={MyOrders} />
        <ProtectedRoute exact path='/order/confirm' component={ConfirmOrder} />
        <ProtectedRoute exact path='/order/:id' component={OrderDetails} />


        <AdminRoute exact path='/admin/dashboard' component={Dashboard} />
        <AdminRoute exact path='/admin/products' component={ProductList} />
        <AdminRoute exact path='/admin/product' component={NewProduct} />
        <AdminRoute exact path='/admin/product/:id' component={UpdateProduct} />
        <AdminRoute exact path='/admin/orders' component={OrderList} />
        <AdminRoute exact path='/admin/order/:id' component={UpdateOrder} />
        <AdminRoute exact path='/admin/users' component={UserList} />
        <AdminRoute exact path='/admin/user/:id' component={UpdateUser} />
        <AdminRoute exact path='/admin/reviews' component={ProductReviews} />
        <Route component={window.location.pathname === "/process/payment" ? null : NotFound} />
      </Switch>

      <Footer />
    </Router>

  )
}

export default App;
