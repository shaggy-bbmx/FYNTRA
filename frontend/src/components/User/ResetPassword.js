import React from 'react'
import './ResetPassword.css'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors } from '../../actions/userAction'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader/Loader'
import { useHistory, useParams } from 'react-router-dom'
import { resetPassword } from '../../actions/userAction'
import MetaData from '../layout/MetaData'
import LockOpenIcon from "@material-ui/icons/LockOpen"








const ResetPassword = () => {
    const alert = useAlert()
    const dispatch = useDispatch()
    const history = useHistory()
    const { token } = useParams()

    const { loading, error, success } = useSelector((state) => state.forgotPassword)

    //FOR STORING PASSWORDS
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")


    //HANDLE FORM SUBMIT    
    const resetPasswordSubmit = (e) => {
        e.preventDefault()
        const myForm = new FormData()
        myForm.set('newPassword', newPassword)
        myForm.set('confirmPassword', confirmPassword)


        dispatch(resetPassword(myForm, token))

    }


    //USE EFFECT TO CATCH ERRORS
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success("Password Updated Successfully");

            history.push("/login");
        }
    }, [dispatch, error, alert, history, success]);



    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title="Reset Password" />
                    <div className="resetPasswordContainer">
                        <div className="resetPasswordBox">
                            <h2 className="resetPasswordHeading">Reset Password</h2>

                            <form
                                className="resetPasswordForm"
                                onSubmit={resetPasswordSubmit}
                                encType="multipart/form-data"
                            >
                                <div className='newPassword'>
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        required
                                        name="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className='confirmPassword'>
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        required
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <input
                                    type="submit"
                                    value="Change"
                                    className="resetPasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}


export default ResetPassword
