import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import Alert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";

import Loader from "./../components/Loader";
import GMap from './../components/GMap';

import { DistanceContext } from '../components/DistanceContext';
import { UserContext } from '../components/UserContext';
import { rounding } from '../components/Utility';

import "./Status.css";


export default function Status() {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const [distance, setDistance] = useState({ distance: 0, time: 0 });
    const [user, setUser] = useContext(UserContext);

    const [serviceRating, setServiceRating] = useState(0);
    const serviceTextRef = useRef(null);

    const [itemRatings, setItemRatings] = useState({});
    const itemReviewsTitleRef = useRef([]);
    const itemReviewsRef = useRef([]);

    const [reviewError, setReviewError] = useState(0);

    const snackText = ["", // for the off by one ;)
                       "All reviews need a rating or else leave it fully blank for no review.",
                       "Review(s) successfully submited!",
                       "An error occured during submission."]

    const id = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/order/status/" + id.id, {
            headers: {
                'Accept': 'application/json'
            },
            method: "GET"
        })
            .then((response) => { if (response.status === 403) { navigate("/") } else { return response.json() } })
            .then(data => {

                if (!data.message) {
                    data.storeCode = data.storeCode.replace("Branch ", "");
                    data.items = JSON.parse(data.items);

                    setData(data);
                }
                else {
                    navigate("/");
                }
                setLoading(false);
            });
    }, [id]);

    const displayItems = () => {

        let keys = Object.keys(data.items);

        let array = [];

        for (let i = 0; i < keys.length; i++) {
            array.push(<><span> • {data.items[keys[i]].quantity} x {data.items[keys[i]].itemName}</span> <br /> </>);
        }

        return array;
    };

    const displayReview = () => {
        let keys = Object.keys(data.items);

        let array = [];

        const setValue = (key, value) => {
            let temp = Object.assign({}, itemRatings);
            temp[key + ""] = value;
            setItemRatings(temp);
        }

        for (let i = 0; i < keys.length; i++) {
            array.push(
                <div className="status-ReviewCard">
                    <div className="status-ReviewImg"><img src={data.items[keys[i]].image} /> </div>

                    <div className="status-ReviewText">
                        <h3>{data.items[keys[i]].itemName}</h3>

                        <div className="status-ReviewGroup">
                            <div>
                                <h5> Rating </h5>
                                <div style={{ display: "flex" }}>
                                    <Rating precision={1} emptyIcon={<StarIcon />} value={itemRatings[keys[i]]} onChange={(event, newValue) => { setValue(keys[i], newValue) }} />
                                    <span style={{ marginTop: "auto", marginBottom: "auto", marginLeft: "10px" }}>{itemRatings[keys[i]]} </span>
                                </div>
                            </div>
                            <div>
                                <h5> Review Title </h5>
                                <input className="status-ReviewInput" placeholder="Enter a title for your review." ref={el => itemReviewsTitleRef.current[keys[i] + ""] = el} />
                            </div>

                            <div>
                                <h5> Description </h5>
                                <textarea placeholder="Enter a description of your review." ref={el => itemReviewsRef.current[keys[i] + ""] = el} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return array;
    };

    const onSubmit = () => {

        if (confirm("Do you want to submit all reviews? You only get one submission window.")) {

            let keys = Object.keys(data.items);

            let obj = {};

            if (serviceTextRef.current.value && !serviceRating) {
                setReviewError(1);
                return;
            }

            for (let i = 0; i < keys.length; i++) {

                // guard do not allow the user to submit partial reviews with no rating, rating with title & description is fine
                if ((itemReviewsTitleRef.current[keys[i] + ""].value || itemReviewsRef.current[keys[i] + ""].value) && itemRatings[keys[i] + ""] === 0) {
                    setReviewError(1);
                    return;
                }

                obj[keys[i] + ""] = { title: itemReviewsTitleRef.current[keys[i] + ""].value, description: itemReviewsRef.current[keys[i] + ""].value, rating: itemRatings[keys[i] + ""] }
            }

            setLoading(true);

            fetch("/api/review/create", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({ store: { rating: serviceRating, description: serviceTextRef.current.value }, items: obj, orderId: id.id })
            })
            .then((response) => {
                if (response.status === 200) {
                    setReviewError(2);
                    
                    let tempObj = Object.assign({}, data);
                    tempObj.reviewed = true;

                    setData(tempObj);
                }
                else {
                    console.log(response.status);
                    setReviewError(3);
                }
                
                setLoading(false);
            })
        }
    }

    const handleClose = (event, reason) => {

        if (reason === 'clickaway') {
            return;
        }

        setReviewError(0);
    };

    return (
        <>
            {loading ? <Loader fullScreen /> :
                <>
                    <div id="status-Body">
                        <h2>Status for Order #{data.orderId}</h2>

                        <DistanceContext.Provider value={[distance, setDistance]}>
                            <div id="status-DetailGroup">
                                <div id="status-Map">
                                    <GMap branch={data.storeCode} address={data.destinationCode} />
                                </div>

                                <div id="status-Details">
                                    <h3>Delivery Details</h3>

                                    <span> <b> Recipient: </b> {decodeURIComponent(user)} </span>
                                    <span> <b> Order Submission: </b> {data.dateIssued} </span>
                                    <span> <b> Delivery Date: </b> {data.dateReceived} </span>
                                    <br />
                                    <span> <b> From: </b> {data.sourceCode} </span>
                                    <span> <b> Destination: </b> {data.destinationCode} </span>
                                    <br />
                                    <span> <b> Total Cost: </b> ${rounding(data.totalPrice, 2)} </span>
                                    <span> <b> Status: </b> <b style={{ color: (data.fulfilled ? "green" : "orange") }}> {data.fulfilled ? "Delivery Complete" : "In Progress"} </b> </span>
                                </div>

                                <div id="status-ItemList">
                                    <h3>Items Purchased</h3>

                                    {displayItems()}
                                </div>
                            </div>
                        </DistanceContext.Provider>
                        { !data.reviewed && data.fulfilled ?
                        <>
                        <div>
                            <h2> Reviews </h2>

                            <div id="status-StoreReview">
                                <h3>How was our service? </h3>
                                <div className="status-StoreWrapper" style={{ marginBottom: "25px" }}>
                                    <h4>Rating:</h4>
                                    <Rating precision={1} emptyIcon={<StarIcon />} large value={serviceRating} onChange={() => { setServiceRating(event.target.value) }} />
                                </div>
                                <h3>Please leave a description of the service provided</h3>
                                <div className="status-StoreWrapper"><textarea ref={serviceTextRef} placeholder="Enter a description of your review of the store." /> </div>
                            </div>

                            {displayReview()}

                        </div>
                        <button onClick={onSubmit}>Submit Reviews</button> </>
                        : 
                        <div> 
                            <h2> Reviews </h2>
                            <h5>{data.fulfilled ? "You have already submitted a review for this order" : "Please wait for the order to arrive before reviewing."}</h5>
                        </div>
                        }
                    </div>

                    <Snackbar open={reviewError} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                        <Alert severity="info" sx={{ width: '100%' }} onClose={handleClose}>
                            {snackText[reviewError]} {/* For snackText[0], only if the user puts a title or description & no rating */}
                        </Alert>
                    </Snackbar>
                </>
            }
        </>
    );
}