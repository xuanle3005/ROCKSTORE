import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";

import { UserContext } from "./../components/UserContext.js";
import { getCookie } from "./../components/Utility";
import Loader from "./../components/Loader";

import "./Signup.css";

export default function Signup() {
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [addressError, setAddressError] = useState(false);
    const [cityError, setCityError] = useState(false);
    const [countryError, setCountryError] = useState(false);
    const [postalError, setPostalError] = useState(false);

    const [loading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    // add loader and dimmer
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const phoneRef = useRef(null);
    const addressRef = useRef(null);
    const cityRef = useRef(null);
    const countryRef = useRef(null);
    const postalRef = useRef(null);

    const [user, setUser] = useContext(UserContext);

    const navigate = useNavigate();

    // Email regex
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        
        setErrorMessage("");
    };

    // TODO popup if email is already registered
    // check for address validity later
    function onSubmit() {
        setLoading(true);

        let toSubmit = true;

        // not returned as multiple invalid inputs could exist, check all
        if (!nameRef.current?.value) {
            setNameError(true);
            toSubmit = false;
        }

        if (emailRef.current.value === "" && !regex.test(emailRef.current.value)) {
            setEmailError(true);
            toSubmit = false;
        }

        if (!passwordRef.current?.value) {
            setPasswordError(true);
            toSubmit = false;
        }

        if (!phoneRef.current?.value) {
            setPhoneError(true);
            toSubmit = false;
        }

        if (!addressRef.current?.value) {
            setAddressError(true);
            toSubmit = false;
        }

        if (!cityRef.current?.value) {
            setCityError(true);
            toSubmit = false;
        }

        if (!countryRef.current?.value) {
            setCountryError(true);
            toSubmit = false;
        }

        if (!postalRef.current?.value) {
            setPostalError(true);
            toSubmit = false;
        }

        if (toSubmit) {
            // go fetch
            let body = {
                name: nameRef.current.value,
                telephone: phoneRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
                address: addressRef.current.value + ", " + postalRef.current.value,
                cityCode: cityRef.current.value
            }

            fetch("/api/user/create", { 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(body) 
            })
            .then((response) => {
                
                if (response.status === 200) {                    
                    return {};
                }
                else {
                    return response.json();
                    // error
                }
            }).then(data => {

                if (data.message) {
                    setErrorMessage(data.message);
                }
                else {
                    setUser(getCookie("name"));
                }
            });
        }

        setLoading(false);
    }

    useEffect(() => {
        
        if (user !== "") {
            navigate("/");
        }
    }, [user]);

    function onChange(type) {

        if (nameError && type === "name" && nameRef.current?.value !== "") {
            setNameError(false);
        }
        else if (emailError && type === "email" && regex.test(emailRef.current.value)) {
            setEmailError(false);
        }
        else if (passwordError && type === "password" && passwordRef.current?.value !== "") {
            setPasswordError(false);
        }
        else if (phoneError && type === "phone" && phoneError.current?.value !== "") {
            setPhoneError(false);
        }
        else if (addressError && type === "address" && addressRef.current?.value !== "") {
            setAddressError(false);
        }
        else if (cityError && type === "city" && cityRef.current?.value !== "") {
            setCityError(false);
        }
        else if (countryError && type === "country" && countryRef.current?.value !== "") {
            setCountryError(false);
        }
        else if (postalError && type === "postal" && postalRef.current?.value !== "") {
            setPostalError(false);
        }
    }

    return (
        <>
            <div className="signup-body">
                <div className="signup-card">
                    <div className="signup-inner">
                        <h2>Sign Up</h2>

                        <div><b>Name</b></div>
                        <input placeholder="First & Last Name" className={"signup-input " + (nameError ? "signup-invalid" : "signup-gap")} ref={nameRef} onChange={() => onChange("name")} />
                        <div hidden={!nameError} className="signup-gap-message">Please fill in a name.</div>

                        <div><b>Email</b></div>
                        <input placeholder="example@example.com" type="email" className={"signup-input " + (emailError ? "signup-invalid" : "signup-gap")} ref={emailRef} onChange={() => onChange("email")} />
                        <div hidden={!emailError} className="signup-gap-message">Please fill in a valid email.</div>

                        <div><b>Password</b></div>
                        <input placeholder="Password" type="password" className={"signup-input " + (passwordError ? "signup-invalid" : "signup-gap")} ref={passwordRef} onChange={() => onChange("password")} />
                        <div hidden={!passwordError} className="signup-gap-message">Please fill in a password.</div>

                        <div><b>Telephone Number</b></div>
                        <input placeholder="XXX-XXX-XXX" className={"signup-input " + (phoneError ? "signup-invalid" : "signup-gap")} ref={phoneRef} onChange={() => onChange("phone")} />
                        <div hidden={!phoneError} className="signup-gap-message">Please fill in a valid phone number.</div>

                        <div><b>Street Address</b></div>
                        <input placeholder="1 Yonge Street" className={"signup-input " + (addressError ? "signup-invalid" : "signup-gap")} ref={addressRef} onChange={() => onChange("address")} />
                        <div hidden={!addressError} className="signup-gap-message">Please fill in a valid address.</div>

                        <div><b>City/Town</b></div>
                        <input placeholder="Toronto" className={"signup-input " + (cityError ? "signup-invalid" : "signup-gap")} ref={cityRef} onChange={() => onChange("city")} />
                        <div hidden={!cityError} className="signup-gap-message">Please fill in a valid city or town.</div>

                        <div><b>Country</b></div>
                        <input placeholder="Canada" className={"signup-input " + (countryError ? "signup-invalid" : "signup-gap")} ref={countryRef} onChange={() => onChange("country")} />
                        <div hidden={!countryError} className="signup-gap-message">Please fill in a country.</div>

                        <div><b>Postal Code</b></div>
                        <input placeholder="X0X 0X0" className={"signup-input " + (postalError ? "signup-invalid" : "signup-gap")} ref={postalRef} onChange={() => onChange("postal")} />
                        <div hidden={!postalError} className="signup-gap-message">Please fill in a valid postal code</div>

                        <div style={{ userSelect: "none" }}>
                            Have an account? <button className="signup-gap-button" onClick={() => { navigate("/login") }}>Login here.</button>
                        </div>

                        <button className="signup-submit" onClick={onSubmit}><b>Register Account</b></button>
                    </div>
                </div>
            </div>
            { loading ? <Loader fullScreen /> : null }

            <Snackbar open={errorMessage !== ""} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="info" sx={{ width: '100%' }} onClose={handleClose}>
                   {errorMessage}
                </Alert>
            </Snackbar>
        </>
    );
}