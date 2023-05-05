import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Alert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";

import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import GMap from "./../components/GMap";
import { UserContext } from "./../components/UserContext.js";
import { CartContext } from "./../components/CartContext.js";
import { DistanceContext } from '../components/DistanceContext.js';
import { rounding } from '../components/Utility';
import Loader from "./../components/Loader";


import "./Payment.css";
import { LocalizationProvider } from '@mui/x-date-pickers';

export default function Payment() {

    // Address & Branch
    const [branch, setBranch] = useState("");

    const nameRef = useRef(null);
    const phoneRef = useRef(null);
    const addressRef = useRef(null);
    const cityRef = useRef(null);
    const postalRef = useRef(null);

    // Credit Card
    const billingNameRef = useRef(null);
    const billingCreditRef = useRef(null);
    const billingDateRef = useRef(null);
    const billingCVVRef = useRef(null);

    const [addressStates, setAddressStates] = useState(["", "", "", "", ""]);
    const [addressErrors, setAddressErrors] = useState([false, false, false, false, false]);
    const [branchError, setBranchError] = useState(false);

    const [distance, setDistance] = useState({distance: 0, time: 0}); // time & dist combo
    const [cart, setCart] = useContext(CartContext);

    const [creditStates, setCreditStates] = useState(["", "", "", ""]);
    const [creditError, setCreditError] = useState([false, false, false, false])

    const [shippingSpeed, setShippingSpeed] = useState("normal");

    const [itemTotal, setItemTotal] = useState(0);
    const [deliveryTotal, setDeliveryTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const [deliveryDate, setDeliveryDate] = useState("");
    const [user, setUser] = useContext(UserContext);

    const [orderError, setOrderError] = useState("");

    const [loading, setLoading] = useState(false);

    const apiKey = 'AIzaSyBTyihH9QhzFp2TKI6aBx912hXitQdZglk';

    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    // strict statscan regex
    const postalRegex = /^[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z] [0-9][ABCEGHJ-NPRSTV-Z][0-9]$/;

    // Payment Confirmation
    const [stage, setStage] = useState(0);

    const navigate = useNavigate();

    const onSubmit = () => {
        
        if (stage === 0) { 
            let tempErrors = Array.from(addressErrors);

            if (!nameRef.current.value.length) {
                tempErrors[0] = true;
            }

            if (!phoneRef.current.value.length || !phoneRegex.test(phoneRef.current.value)) {
                tempErrors[1] = true;
            }

            if (!addressRef.current.value.length) {
                tempErrors[2] = true;
            }

            if (!cityRef.current.value.length) {
                tempErrors[3] = true;
            }

            if (!postalRef.current.value.length || !postalRegex.test(postalRef.current.value)) {
                tempErrors[4] = true;
            }
            
            if (!branch.length) {
                setBranchError(true);
            }

            setAddressErrors(tempErrors);

            if (!tempErrors[0] && !tempErrors[1] && !tempErrors[2] && !tempErrors[3] && !tempErrors[4] && branch !== "") {

                setAddressStates([nameRef.current.value,
                    phoneRef.current.value,
                    addressRef.current.value,
                    cityRef.current.value,
                    postalRef.current.value
                ]);

                setStage(1);
            }
        }
        else {
            let tempErrors = Array.from(creditError);

            if (!billingNameRef.current.value.length) {
                tempErrors[0] = true;
            }

            if (!billingCreditRef.current.value.length) {
                tempErrors[1] = true;
            }

            if (!billingDateRef.current.value.length) {
                tempErrors[2] = true;
            }

            if (!billingCVVRef.current.value.length) {
                tempErrors[3] = true;
            }

            setCreditError(tempErrors);

            if(!tempErrors[0] && !tempErrors[1] && !tempErrors[2] && !tempErrors[3]) {
                

                let date = deliveryDate.$d + "";

                let res = {
                    storeCode: "Branch " + branch,
                    totalPrice: total,
                    paymentCode: billingCreditRef.current.value,
                    items: JSON.stringify(cart),
                    destinationCode: addressStates[2] + ", " + addressStates[3],
                    distance: distance.distance,
                    tripPrice: (shippingSpeed === "express" ? 2 * distance.distance : distance.distance),
                    dateReceived: date.replace("GMT-0400 (Eastern Daylight Time)", "")
                };

                setLoading(true);

                fetch("/api/order/create", {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify(res)
                })
                .then((response) => {return response.json()})
                .then(data => {
                    
                    setLoading(false);

                    if (!data.message) {
                        navigate("/status/" + data.orderId);
                    }
                    else {
                        setOrderError(data.message);
                    }


                }); 

            }
        }
    };

    const onChange = () => {

        if (stage === 0) {
            let tempErrors = Array.from(addressErrors);

            if (nameRef.current.value.length) {
                tempErrors[0] = false;
            }

            if (phoneRef.current.value.length && phoneRegex.test(phoneRef.current.value)) {
                tempErrors[1] = false;
            }

            if (addressRef.current.value.length) {
                tempErrors[2] = false;
            }

            if (cityRef.current.value.length) {
                tempErrors[3] = false;
            }

            if (postalRef.current.value.length && postalRegex.test(postalRef.current.value)) {
                tempErrors[4] = false;
            }

            setAddressErrors(tempErrors);
        }
        else {
            let tempErrors = Array.from(creditError);

            let taint = false;

            if (billingNameRef.current.value.length && tempErrors[0]) {
                tempErrors[0] = false;
                taint = true;
            }

            if (billingCreditRef.current.value.length && tempErrors[1]) {
                tempErrors[1] = false;
                taint = true;
            }

            if (billingDateRef.current.value.length && tempErrors[2]) {
                tempErrors[2] = false;
                taint = true;
            }

            if (billingCVVRef.current.value.length && tempErrors[3]) {
                tempErrors[3] = false;
                taint = true;
            }

            if (taint) {
                setCreditError(tempErrors);
            }
        }
    }

    const handleClose = (event, reason) => {

        if (reason === 'clickaway') {
            return;
        }
        if (stage === 0) {
            setBranchError(false);
        }
        else {
            setOrderError("");
        }
    };


    // Bar the user from navigating here without items & account
    useEffect(() => {

        if (!Object.keys(cart).length || !user.length) {
            navigate("/");
        }
    }, []);

    const displayStage = () => {
        switch (stage) {

            case 0:

                return (
                    <>  
                        <h2>Payment Details</h2>
                        <h3>Select a Branch</h3>

                        <div id="payment-BranchRow">
                            <div className={"payment-MapItem payment-MapItemLeft " + (branch === "A" ? "payment-MapItemSelect" : "")} onClick={() => {
                                setBranch("A");
                                setBranchError(false);
                            }}>
                                <img src={"https://maps.googleapis.com/maps/api/staticmap?center=43.61820701903892,-79.76905895548806&zoom=15&size=400x400&markers=color:red|43.61820701903892,-79.76905895548806&key=" + apiKey} />
                                <div style={{ margin: "25px 25px 25px 25px" }}>
                                    <h4 style={{ marginTop: "0px" }}>Branch A</h4>
                                    <h5>Location: 1 Presidents Choice Cir, Brampton, Ontario, Canada</h5>
                                </div>
                            </div>

                            <div className={"payment-MapItem payment-MapItemRight " + (branch === "B" ? "payment-MapItemSelect" : "")} onClick={() => {
                                setBranch("B");
                                setBranchError(false);
                            }}>
                                <img src={"https://maps.googleapis.com/maps/api/staticmap?center=43.65830,-79.38080&zoom=15&size=400x400&markers=color:red|43.65830,-79.38080&key=" + apiKey} />
                                <div style={{ margin: "25px 25px 25px 25px" }}>
                                    <h4 style={{ marginTop: "0px" }}>Branch B</h4>
                                    <h5>Location: 350 Victoria St, Toronto, Ontario, Canada</h5>
                                </div>
                            </div>
                        </div>

                        <h3 className="payment-Headers">Delivery Address</h3>

                        <div className="payment-AddressRow">
                            <div>
                                <h5>Full Name</h5>
                                <input placeholder="John Doe" ref={nameRef} onChange={onChange} className={addressErrors[0] ? "payment-invalid" : ""}/> 
                                <span hidden={!addressErrors[0]} className="payment-message">Please enter a name.</span>
                            </div>

                            <div>
                                <h5>Telephone</h5>
                                <input placeholder="XXX-XXX-XXXX" ref={phoneRef} maxLength={12} type="tel" onChange={onChange} className={addressErrors[1] ? "payment-invalid" : ""}/>
                                <span hidden={!addressErrors[1]} className="payment-message">Please enter a valid phone number.</span>
                            </div>

                            <div>
                                <h5>Street Address</h5>
                                <input placeholder="1 Yonge Street" ref={addressRef} onChange={onChange} className={addressErrors[2] ? "payment-invalid" : ""}/>
                                <span hidden={!addressErrors[2]} className="payment-message">Please enter a valid address.</span>
                            </div>

                            <div>
                                <h5>Town or City</h5>
                                <input placeholder="Toronto" ref={cityRef} onChange={onChange} className={addressErrors[3] ? "payment-invalid" : ""}/>
                                <span hidden={!addressErrors[3]} className="payment-message">Please enter a town/city.</span>
                            </div>

                            <div>
                                <h5>Postal Code</h5>
                                <input placeholder="X0X 0X0" ref={postalRef} maxLength={7} onChange={onChange} className={addressErrors[4] ? "payment-invalid" : ""}/>
                                <span hidden={!addressErrors[4]} className="payment-message">Please enter a valid postal code.</span>
                            </div>

                            <button onClick={() => {onSubmit();}}> Continue to Payment </button>
                        </div>

                        <Snackbar open={branchError} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                            <Alert severity="info" sx={{ width: '100%' }} onClose={handleClose}>
                                Please select a branch.
                            </Alert>
                        </Snackbar>
                    </>
                );

            case 1: // disregard postal code for now
                return (
                    <>
                        <h2>Payment Details</h2>
                        <h3>Delivery Speed</h3>
                        
                        <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row"}}>
                            <GMap branch={branch} address={addressStates[2] + ", " + addressStates[3]}/>

                            <FormControl id="payment-RadioGroup" sx={{padding: "15px", backgroundColor: "#E2E2E2"}}>
                                <FormLabel id="rbg">Select a speed</FormLabel>
                                    <RadioGroup 
                                        aria-labelledby="rbg"
                                        value={shippingSpeed}
                                        onChange={() => {setShippingSpeed(event.target.value)}}
                                    >
                                        <FormControlLabel value="normal" control={<Radio/>} label="Normal Speed"/>
                                        <FormControlLabel value="express" control={<Radio/>} label="Express Speed (2x delivery fees)"/>
                                    </RadioGroup>

                                    <FormLabel sx={{marginTop: "25px"}}>Estimated Delivery Time: {(shippingSpeed === "normal" ? rounding(distance.time, 2) * 2 : rounding(distance.time, 2))} minutes</FormLabel>

                                    <FormLabel sx={{marginTop: "25px"}}>Distance: {rounding(distance.distance, 2)} km</FormLabel>

                                    <FormLabel sx={{marginTop: "50px"}}> Delivery Date </FormLabel>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <MobileDateTimePicker sx={{backgroundColor: "white"}} value={deliveryDate} onChange={(newValue) => {setDeliveryDate(newValue);}} />
                                    </LocalizationProvider>
                            </FormControl>
                        </div>

                        <h3>Credit Card Information</h3>

                        <div className="payment-AddressRow">
                            <div>
                                <h5>Name on Card</h5>
                                <input placeholder="John Doe" ref={billingNameRef} onChange={onChange} className={creditError[0] ? "payment-invalid" : ""}/> 
                                <span hidden={!creditError[0]} className="payment-message">Please enter the name on the card.</span>
                            </div>

                            <div>
                                <h5>Credit Card Number</h5>
                                <input placeholder="XXXX XXXX XXXX XXXX" ref={billingCreditRef} onChange={onChange} maxLength={19} type="tel" className={creditError[1] ? "payment-invalid" : ""}/>
                                <span hidden={!creditError[1]} className="payment-message">Please enter a valid credit card number.</span>
                            </div>

                            <div>
                                <h5>Expiry Date</h5>
                                <input placeholder="01/23" ref={billingDateRef} maxLength={5} onChange={onChange} className={creditError[2] ? "payment-invalid" : ""}/>
                                <span hidden={!creditError[2]} className="payment-message">Please an expiry date.</span>
                            </div>

                            <div>
                                <h5>CVV</h5>
                                <input placeholder="1234" ref={billingCVVRef} maxLength={4} onChange={onChange} className={creditError[3] ? "payment-invalid" : ""}/>
                                <span hidden={!creditError[3]} className="payment-message">Please enter the CVV on you card.</span>
                            </div>

                            <div id="payment-Total">
                                <h4 id="payment-TotalHeader">Order Summary</h4>

                                <div id="payment-TotalGroup">
                                    <div className="payment-TotalItems">
                                        <span className="payment-TotalNums"> Items: </span>
                                        <span>${rounding(itemTotal, 2)}</span>
                                    </div>

                                    <div className="payment-TotalItems">
                                        <span className="payment-TotalNums"> Delivery Fees: </span>
                                        <span>${rounding(deliveryTotal, 2)}</span>
                                    </div>

                                    <div className="payment-TotalItems">
                                        <span className="payment-TotalNums"> Subtotal: </span>
                                        <span>${rounding(itemTotal + deliveryTotal, 2)}</span>
                                    </div>

                                    <div className="payment-TotalItems">
                                        <span className="payment-TotalNums"> GST/HST: </span>
                                        <span>${rounding(tax, 2)}</span>
                                    </div>
                                </div>

                                <div className="payment-TotalItems">
                                    <h4 className="payment-TotalNums">Order Total: </h4>
                                    <span className="payment-TotalOrderNum">${rounding(total, 2)}</span>
                                </div>
                            </div>

                            <div id="payment-ButtonGroup">
                                <button onClick={() => {
                                    setStage(0);
                                }}> Go Back </button>
                                <button onClick={() => {onSubmit();}}> Finalize Payment</button>
                            </div>

                            <Snackbar open={orderError} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                                <Alert severity="info" sx={{ width: '100%' }} onClose={handleClose}>
                                    {orderError}
                                </Alert>
                            </Snackbar>
                        </div>

                        {loading ? <Loader fullScreen/> : null}
                    </>
                );
        }
    }

    useEffect(() => {

        if (stage === 1) {
            const keys = Object.keys(cart);

            let accum = 0;

            for (let i = 0; i < keys.length; i++) {
                accum = cart[keys[i]].price * cart[keys[i]].quantity + accum;    
            }

            setItemTotal(accum);

            let tempDelivery = (shippingSpeed === "express") ? (distance.distance * 2) : distance.distance
            setDeliveryTotal(tempDelivery);

            let tempTax = (accum + tempDelivery) * 0.13
            setTax(tempTax);
            setTotal(accum + tempDelivery + tempTax);
        }
    });

    useEffect(() => {

        setLoading(false);
        
        if (stage === 0) {
            nameRef.current.value = addressStates[0];
            phoneRef.current.value = addressStates[1];
            addressRef.current.value = addressStates[2];
            cityRef.current.value = addressStates[3];
            postalRef.current.value = addressStates[4];
        }
        else if (stage === 1) {
            billingNameRef.current.value = creditStates[0];
            billingCreditRef.current.value = creditStates[1];
            billingDateRef.current.value = creditStates[2];
            billingCVVRef.current.value = creditStates[3];
        }
    }, [stage]);

    return (

        <div id="payment-Body">
            <DistanceContext.Provider value={[distance, setDistance]}>
                {displayStage()}
            </DistanceContext.Provider>
        </div>
    );
}