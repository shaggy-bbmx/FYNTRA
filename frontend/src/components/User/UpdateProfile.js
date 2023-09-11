import React, { useEffect } from 'react'
import './UpdateProfile.css'
import { useState } from 'react'
import MailOutlineIcon from "@material-ui/icons/MailOutline"
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, loadUser } from '../../actions/userAction'
import FaceIcon from "@material-ui/icons/Face"
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader/Loader'
import { useHistory } from 'react-router-dom'
import { updateProfile } from '../../actions/userAction'
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants'
import MetaData from '../layout/MetaData'


const UpdateProfile = () => {

    const history = useHistory()
    const alert = useAlert()
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.user)
    const { loading, isUpdated, error } = useSelector(state => state.profile)

    //FOR STORING EMAIL PASSWORD PROFILE PIC
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [avatar, setAvatar] = useState(user.avatar.url)
    const [avatarPreview, setAvatarPreview] = useState(user.avatar.url)


    //HANDLE FORM SUBMIT    
    const updateProfileSubmit = (e) => {
        e.preventDefault()

        const myForm = new FormData()
        myForm.set('name', name)
        myForm.set('email', email)
        myForm.set('avatar', avatar)

        dispatch(updateProfile(myForm))

    }




    //HANDLING CHANGES IN PROFILE PIC UPLOAD    
    const updateProfileDataChange = (e) => {
        const reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }


    }



    //USE EFFECT TO CATCH ERRORS
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (isUpdated) {
            alert.success('Profile Updated Successfully!!!')
            dispatch(loadUser())
            history.push('/account')
            dispatch({
                type: UPDATE_PROFILE_RESET
            })
        }
    }, [alert, error, dispatch, isUpdated, history, user])



    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title="Update Profile" />
                    <div className="updateProfileContainer">
                        <div className="updateProfileBox">
                            <h2 className="updateProfileHeading">Update Profile</h2>

                            <form
                                className="updateProfileForm"
                                encType="multipart/form-data"
                                onSubmit={updateProfileSubmit}
                            >
                                <div className="updateProfileName">
                                    <FaceIcon />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="updateProfileEmail">
                                    <MailOutlineIcon />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div id="updateProfileImage">
                                    <img src={avatarPreview} alt="Avatar Preview" />
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={updateProfileDataChange}
                                    />
                                </div>

                                <input
                                    type="submit"
                                    value="Update"
                                    className="updateProfileBtn"
                                />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>

    )
}

export default UpdateProfile
