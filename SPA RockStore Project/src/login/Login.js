import React, { useState, useEffect, useRef, useContext } from 'react';

import Alert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";

import { UserContext } from "./../components/UserContext.js";
import "./Login.css";

import { useNavigate } from 'react-router-dom';
import { getCookie } from "./../components/Utility";

export default function Login() {

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const [user, setUser] = useContext(UserContext);

    // add loader and dimmer

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const navigate = useNavigate();

    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        
        setShowToast(false);
    };

    function onSubmit() {
        setLoading(true);

        let toSubmit = true;

        if (emailRef.current.value === "" && !regex.test(emailRef.current.value)) {
            setEmailError(true);
            toSubmit = false;
        }

        if (!passwordRef.current?.value) {
            setPasswordError(true);
            toSubmit = false;
        }

        if (toSubmit) {
            // go fetch

            fetch("/api/user/login", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({email: emailRef.current.value, password: passwordRef.current.value})
            })
            .then((response) => {
                if (response.status === 200) {

                    setUser(getCookie("name"));
                    navigate("/");
                }
                else {
                    setShowToast(true);
                }
            })
        }

        setLoading(false);
    }

    function onChange(type) {
        if (emailError && type === "email" && regex.test(emailRef.current.value)) {
            setEmailError(false);
        }
        else if (passwordError && type === "password" && passwordRef.current?.value !== "") {
            setPasswordError(false);
        }
    }

    useEffect(() => {
        fetch("/api/user/verify", { method: "GET"})
        .then((response) => {
            
            if (response.status === 200) {
                setUser(getCookie("name"));
                
                navigate("/");
            }
        })
    }, []);

    return (
        <div className="login-body">
            <div className="login-card">
                <div className="login-inner">
                    <h2>Sign In</h2>

                    <div><b>Email</b></div>
                    <input placeholder="example@example.com" type="email" className={"login-input " + (emailError ? "login-invalid" : "login-gap")} ref={emailRef} onChange={() => onChange("email")} />
                    <div hidden={!emailError} className="login-gap-message">Please fill in a valid email.</div>

                    <div><b>Password</b></div>
                    <input placeholder="Password" type="password" className={"login-input " + (passwordError ? "login-invalid" : "login-gap")} ref={passwordRef} onChange={() => onChange("password")} />
                    <div hidden={!passwordError} className="login-gap-message">Please fill in a password.</div>

                    <div style={{ display: "flex" }}>
                        <label><input type="checkbox" /> Remember me</label>

                        <div style={{ marginLeft: "auto" }}>
                            <button className="login-gap-button">Forgot password?</button>
                        </div>
                    </div>

                    <div style={{ userSelect: "none" }}>
                        Don't have an account? <button className="login-gap-button" onClick={() => { navigate("/signup") }}>Register here.</button>
                    </div>

                    <button className="login-submit" onClick={onSubmit}><b>Login</b></button>
                </div>
            </div>

            <Snackbar open={showToast} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="error" sx={{ width: '100%' }} onClose={handleClose}>
                    Your email address or password is incorrect.
                </Alert>
            </Snackbar>
            
            { loading ? <Loader fullScreen /> : null }
        </div>
    );
}