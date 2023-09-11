import React, { useEffect } from 'react'
import './LoginSignUp.css'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import MailOutlineIcon from "@material-ui/icons/MailOutline"
import LockOpenIcon from "@material-ui/icons/LockOpen"
import FaceIcon from "@material-ui/icons/Face"
import profilePng from '../../images/Profile.png'
import { useSelector, useDispatch } from 'react-redux'
import { login, clearErrors, register } from '../../actions/userAction'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader/Loader'
import { useHistory } from 'react-router-dom'
import { useLocation } from 'react-router-dom'




const LoginSignUp = () => {

    const history = useHistory()
    //FETCHING DISPATE AND STATES
    const alert = useAlert()
    const dispatch = useDispatch()
    const { error, loading, isAuthenticated } = useSelector((state) => state.user)


    //CREATING USESTATE VARIBALE  FOR EMAIL AND PASSWORD
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")


    //MAKING A USER OBJECT WHICH CONTAIN NAME EMAIL PASSWORD AVATAR
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    })

    const { name, email, password } = user
    const [avatar, setAvatar] = useState()
    const [avatarPreview, setAvatarPreview] = useState(profilePng)


    //FUNCTIONALITY OF SWITCHING TABS BETWEEN LOGIN AND REGISTER
    const loginTab = useRef(null)
    const switcherTab = useRef(null)
    const registerTab = useRef(null)

    const switchTabs = (e, tab) => {
        if (tab === 'login') {
            switcherTab.current.classList.add("shiftToNeutral")
            switcherTab.current.classList.remove("shiftToRight")

            registerTab.current.classList.remove("shiftToNeutralForm")
            loginTab.current.classList.remove("shiftToLeft")
        }

        if (tab === "register") {
            switcherTab.current.classList.add("shiftToRight")
            switcherTab.current.classList.remove("shiftToNeutral")

            registerTab.current.classList.add("shiftToNeutralForm")
            loginTab.current.classList.add("shiftToLeft")
        }
    }


    //HANDLING THE LOGIN FORM SUBMISSION
    const loginSubmit = (e) => {
        e.preventDefault()
        dispatch(login(loginEmail, loginPassword))
    }



    //HANDLING THE REGISTER FORM SUBMISSION
    const registerSubmit = (e) => {
        e.preventDefault()

        const myForm = new FormData()
        myForm.set('name', name)
        myForm.set('email', email)
        myForm.set('password', password)
        myForm.set('avatar', avatar)

        dispatch(register(myForm))

    }

    //HANDLING CHANGES IN PROFILE PIC UPLOAD    
    const registerDataChange = (e) => {
        if (e.target.name === 'avatar') {
            const reader = new FileReader()
            reader.readAsDataURL(e.target.files[0])
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }

        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    //USE EFFECT TO CATCH ERRORS
    const location = useLocation()
    const redirect = location.search ? location.search.split('-')[1] : '/account'


    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (isAuthenticated) {
            history.push(redirect)
        }
    }, [alert, error, dispatch, isAuthenticated, history, redirect,location.search])



    return (
        <>
            {
                loading ? <Loader /> :
                    <>
                        <div className='LoginSignUpContainer'>
                            <div className='LoginSignUpBox'>
                                <div>
                                    <div className='login_signUp_toggle'>
                                        <p onClick={(e) => switchTabs(e, 'login')}>LOGIN</p>
                                        <p onClick={(e) => switchTabs(e, 'register')}>REGISTER</p>
                                    </div>
                                    <button ref={switcherTab}></button>
                                </div>
                                <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>
                                    <div className='loginEmail'>
                                        <MailOutlineIcon />
                                        <input
                                            type='email'
                                            placeholder='Email'
                                            required
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className='loginPassword'>
                                        <LockOpenIcon />
                                        <input
                                            type='password'
                                            placeholder='Password'
                                            required
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                        />
                                    </div>
                                    <Link to='/password/forgot'>Forget Password</Link>
                                    <input type='submit' value='Login' className='loginBtn' />
                                </form>
                                <form
                                    className="signUpForm"
                                    ref={registerTab}
                                    encType="multipart/form-data"
                                    onSubmit={registerSubmit}
                                >
                                    <div className="signUpName">
                                        <FaceIcon />
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            required
                                            name="name"
                                            value={name}
                                            onChange={registerDataChange}
                                        />
                                    </div>
                                    <div className="signUpEmail">
                                        <MailOutlineIcon />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            required
                                            name="email"
                                            value={email}
                                            onChange={registerDataChange}
                                        />
                                    </div>
                                    <div className="signUpPassword">
                                        <LockOpenIcon />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            required
                                            name="password"
                                            value={password}
                                            onChange={registerDataChange}
                                        />
                                    </div>

                                    <div id="registerImage">
                                        <img src={avatarPreview} alt="Avatar Preview" />
                                        <input
                                            type="file"
                                            name="avatar"
                                            accept="image/*"
                                            onChange={registerDataChange}
                                        />
                                    </div>
                                    <input type="submit" value="Register" className="signUpBtn" />
                                </form>
                            </div>
                        </div>

                    </>
            }
        </>
    )
}

export default LoginSignUp
