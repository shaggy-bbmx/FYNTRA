import React from 'react'
import './UpdatePassword.css'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors } from '../../actions/userAction'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader/Loader'
import { useHistory } from 'react-router-dom'
import { updatePassword } from '../../actions/userAction'
import MetaData from '../layout/MetaData'
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants'


const UpdatePassword = () => {

    const history = useHistory()
    const alert = useAlert()
    const dispatch = useDispatch()

    const { loading, isUpdated, error } = useSelector(state => state.forgotPassword)

    //FOR STORING EMAIL PASSWORD PROFILE PIC
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")


    //HANDLE FORM SUBMIT    
    const updatePasswordSubmit = (e) => {
        e.preventDefault()

        const myForm = new FormData()
        myForm.set('oldPassword', oldPassword)
        myForm.set('newPassword', newPassword)
        myForm.set('confirmPassword', confirmPassword)

        dispatch(updatePassword(myForm))

    }



    //USE EFFECT TO CATCH ERRORS
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (isUpdated) {
            alert.success('Password Updated Successfully!!!')
            history.push('/account')
            dispatch({
                type: UPDATE_PASSWORD_RESET
            })
        }
    }, [alert, error, dispatch, isUpdated, history])




    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title="Update Password" />
                    <div className="updatePasswordContainer">
                        <div className="updatePasswordBox">
                            <h2 className="updatePasswordHeading">Update Password</h2>

                            <form
                                className="updatePasswordForm"
                                onSubmit={updatePasswordSubmit}
                                encType="multipart/form-data"
                            >
                                <div className='oldPassword'>
                                    <LockIcon />
                                    <input
                                        type="password"
                                        placeholder="Old Password"
                                        required
                                        name="oldPassword"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>
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
                                    className="updatePasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>

    )
}

export default UpdatePassword
