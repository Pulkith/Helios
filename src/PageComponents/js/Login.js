import React from 'react';
import '../css/login.scss'
import '../css/global.scss'

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EastIcon from '@mui/icons-material/East';
import { useState } from 'react';
import { Navigate } from 'react-router';

import {TextWithDividersEqual} from './UtilComponents'

const Login = () => {
    const [loginstate, setloginstate] = useState('login');

    const handleLogin = () => {
        window.location.href = '/Dashboard';
    }

    const hospitalNames = [
        {label: "Personal Project"},
        {label: "Educational Project"},
        {label: "Business Project"},
        {label: "Just to test it out"},
    ];
    

    return (
        <div className="login-wrapper">
            <div className=" maxheight">
                <div className="content centervertwrapper">
                    <div className="centervertwrapperabs">
                        {
                            loginstate === 'login' &&
                            <div className="centerwrapper flexdown">
                            <div className="header textwhite fw900 fs350 gradtext centerchild">Welcome back</div>
                            <div className="details">
                                <div className="textwhite fs20">Sign in to continue</div>
                            </div>
                            <div className="loginform">
                                <div className='mtop20 extralogin flex flexdown'>
                                    <TextField id="outlined-basic" label="Username" variant="outlined" sx={{width:350}} className="mtop10" />
                                    <TextField id="outlined-basic" type="password" label="Password" variant="outlined" sx={{width:350}} className="mtop10" />

                                    <div className="shiftright">
                                        <div className="innershiftright" onClick={() => setloginstate('forgot')}>Forgot Password?</div>
                                    </div>

                                    <button className="btn btn-primary textwhite fs125 mtop50 btnhovermovearrow" onClick={() => handleLogin()}>Login <EastIcon className="movearrowright" /></button>

                                    <div className="mtop30"> 
                                        <TextWithDividersEqual text="OR" className="" onClick={() => setloginstate('login')} />
                                    </div>

                                    <button className="btn btn-primary textwhite fs125 mtop30 btnhovermovearrow" onClick={() => setloginstate('sign')}>Sign Up <EastIcon className="movearrowright" /></button>
                                </div>
                            </div>
                        </div>
                        }

                        {
                            loginstate === 'forgot' &&
                            <div className="centerwrapper flexdown">
                            <div className="header textwhite fw900 fs350 gradtext centerchild">Forgot Password</div>
                            <div className="details">
                                <div className="textwhite fs20">Enter your username to recieve a password reset email.</div>
                            </div>
                            <div className="loginform">
                                <div className='mtop20 extralogin flex flexdown'>
                                    <TextField id="outlined-basic" label="Username" variant="outlined" sx={{width:350}} className="mtop10" />

                                    <button className="btn btn-primary textwhite fs125 mtop20 btnhovermovearrow" onClick={() => handleLogin()}>Continue <EastIcon className="movearrowright" /></button>

                                    <div className="mtop20">
                                    <TextWithDividersEqual text="OR" className="" onClick={() => setloginstate('login')} />
                                </div>
                            </div>
                            <div className="mtop10">
                                <button className="btn btn-primary textwhite fs125 mtop20 btnhovermovearrow right" onClick={() => setloginstate('login')}>Back to Login <EastIcon className="movearrowright" /></button>
                            </div>
                                </div>


                        </div>
                        }

                        {
                            loginstate === 'sign' &&
                            <div className="centerwrapper flexdown">
                            <div className="header textwhite fw900 fs350 gradtext centerchild">Welcome to Helios</div>
                            <div className="details">
                                <div className="textwhite fs20">Find bugs in seconds</div>
                            </div>
                            <div className="loginform">
                                <div className='mtop20 extralogin flex flexdown'>
                                    <TextField id="outlined-basic" label="Full Name" variant="outlined" sx={{width:350}} className="mtop10" />
                                    <TextField id="outlined-basic" type="email" label="Email" variant="outlined" sx={{width:350}} className="mtop10" />
                                    <TextField id="outlined-basic" className="mtop20" type="password" label="Password" variant="outlined" sx={{width:350}} />
                                    <TextField id="outlined-basic" type="password" label="Confirm Password" variant="outlined" sx={{width:350}} className="mtop10" />

                                    <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={hospitalNames}
                                    sx={{ width: 350, style : {color: 'white'} }}
                                    // onChange={(e, v) => onHospChange(e, v)}
                                    renderInput={(params) => <TextField {...params} label="What are you using Helios for?" />}
                                    className="mtop30"
                                    />


                                    <button className="btn btn-primary textwhite fs125 mtop50 btnhovermovearrow" onClick={() => handleLogin()}>Sign Up <EastIcon className="movearrowright" /></button>

                                    <div className="mtop30"> 
                                        <TextWithDividersEqual text="OR" className="" onClick={() => handleLogin()} />
                                    </div>

                                    <div className="centerwrapper">
                                    <button className="btn btn-primary textwhite fs125 mtop20 btnhovermovearrow right" onClick={() => setloginstate('login')}>Back to Login <EastIcon className="movearrowright" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login