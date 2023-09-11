import React from 'react'
import './ForgotPassword.css'
import { useState,useEffect } from 'react'
import MailOutlineIcon from "@material-ui/icons/MailOutline"
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors } from '../../actions/userAction'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader/Loader'
import { forgotPassword } from '../../actions/userAction'
import MetaData from '../layout/MetaData'








const ForgotPassword = () => {

    const alert = useAlert()
    const dispatch = useDispatch()

    const { loading, error, message } = useSelector(state => state.forgotPassword)

    //FOR STORING EMAIL PASSWORD PROFILE PIC
    const [email, setEmail] = useState("")


    //HANDLE FORM SUBMIT    
    const forgotPasswordSubmit = (e) => {
        e.preventDefault()
        dispatch(forgotPassword(email))

    }


    //USE EFFECT TO CATCH ERRORS
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (message) {
            alert.success('check your email !!!!')
        }
    }, [alert, error, dispatch, message])




    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title="Forgot Password" />
                    <div className="forgotPasswordContainer">
                        <div className="forgotPasswordBox">
                            <h2 className="forgotPasswordHeading">Forgot Password</h2>

                            <form
                                className="forgotPasswordForm"
                                onSubmit={forgotPasswordSubmit}
                                encType="multipart/form-data"
                            >
                                <div className='email'>
                                    <MailOutlineIcon />
                                    <input
                                        type="email"
                                        placeholder="Email-ID"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="send"
                                    className="forgotPasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}


export default ForgotPassword
