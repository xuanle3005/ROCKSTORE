import React, { useState, useEffect, useRef, useContext } from "react";
import "./Main.css";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import redRock from "./../assets/rocks/red.png";

import Alert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";
import { Link, useNavigate } from 'react-router-dom';

import { CartContext } from "./../components/CartContext.js";
import Loader from "../components/Loader";
import { addToCart, rounding } from "../components/Utility";

export default function Main() {

    const [isHovering, setIsHovering] = useState(false);
    const [firstRun, setFirstRun] = useState(true);
    const [isSmall, setIsSmall] = useState(false);
    const [hotItem, setHotItem] = useState({
        itemId: 1,
        itemName: "Filler Item",
        price: 0,
        madeIn: "Canada",
        image: "/imgs/blue.png",
        department: "ROCK",
        rating: 0,
        description: "You shouldn't be reading this..."
    });

    const [recentReview, setRecentReview] = useState({
        itemId: 1,
        name: "John Doe",
        rating: 5,
        image: "/imgs/red.png",
        date: "3/17/2023",
        title: "Best thing I have bought",
        description: "Lorem ipsum, yeah not a real review."
    });

    const [storeReview, setStoreReview] = useState({
        rating: 0,
        review: {
            name: "John Doe",
            rating: 0,
            description: ""
        }
    }); 

    const [isLoadingHot, setIsLoadingHot] = useState(false);
    const [isLoadingReview, setIsLoadingReview] = useState(false);
    const [isLoadingStoreReview, setIsLoadingStoreReview] = useState(false);

    const [showToast, setShowToast] = useState(false);

    const navigate = useNavigate();

    const ref = useRef(null);
    const itemAddedRef = useRef(null);

    const [cart, setCart] = useContext(CartContext);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        
        setShowToast(false);
    };

    useEffect(() => {
        const checkSmall = () => {
            const temp = ref.current;
            const styleWidth = getComputedStyle(temp).getPropertyValue("width");
            const numWidth = parseFloat(styleWidth.substring(0, styleWidth.length - 2));


            if (numWidth <= 850) {
                setIsSmall(true);
            }
            else if (numWidth > 850) {
                setIsSmall(false);
            }
        };

        window.addEventListener("DOMContentLoaded", () => {
            window.addEventListener("resize", checkSmall);

            return () => {
                window.removeEventListener("resize", checkSmall);
            }
        });

        setIsLoadingHot(true);
        setIsLoadingReview(true);
        setIsLoadingStoreReview(true);

        fetch("/api/item/hot", {
            headers: {
                'Accept': 'application/json'
            },
            method: "GET"
        })
        .then((response) => response.json())
        .then(data => {
              
            // Garbage data
            if (!data && !data.errorType) {
                // toast error later
                return;
            }
                
            setHotItem({
                itemId: data.itemId,
                itemName: data.itemName,
                price: data.price,
                madeIn: data.madeIn,
                image: data.image,
                department: data.department,
                rating: data.rating,
                description: data.description
            });

            setIsLoadingHot(false);
        });

        fetch("/api/review/recent", {
            headers: {
                'Accept': 'application/json'
            },
            method: "GET"
        })
        .then((response) => response.json())
        .then(data => {
                
            if (data) {
                setRecentReview({
                    itemId: data.itemId,
                    date: data.date,
                    name: data.name,
                    rating: data.rating,
                    image: data.image,
                    title: data.title,
                    description: data.description
                });
            }
            setIsLoadingReview(false);
        });


        fetch("/api/review/store", {
            headers: {
                'Accept': 'application/json'
            },
            method: "GET"
        })
        .then((response) => response.json())
        .then(data => {
                
            if (data) {

                setStoreReview({
                    rating: data.rating,
                    review: {
                        name: data.review.name,
                        rating: data.review.rating,
                        description: data.review.description
                    }
                });
            }
            setIsLoadingStoreReview(false);
        });
    }, []);

    return (
        <div ref={ref} id="main-body">
            <Snackbar open={showToast} autoHideDuration={1250} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" sx={{ width: '100%' }} onClose={handleClose}>
                    Successfully added 1 x {itemAddedRef.current} to the cart.
                </Alert>
            </Snackbar>
            <div className="main-contentCard">
                <img className="main-contentCardImg" src="https://picsum.photos/seed/picsum/1000/600" />
                <div className="main-contentCardText">
                    <p className="main-contentCardTextMini">The best place to shop!</p>
                    <h3><b>Welcome to the rock store.</b></h3>
                    <p>All organically grown and ethically sourced rocks.</p>
                    <button className="main-contentCardButton" onClick={() => { navigate("/products") }}><ArrowCircleRightIcon fontSize="large" /></button>
                </div>
            </div>

            <div id="main-secondaryRow">
                <div className="main-hotItemBox" onMouseEnter={() => {
                    setIsHovering(true);

                    if (firstRun) {
                        setFirstRun(false);
                    }
                }} onMouseLeave={() => setIsHovering(false)}>

                    <h3 style={{ margin: "25px 0px 25px 25px" }}>Hot Items</h3>

                    {isLoadingHot ?
                        <Loader/>
                        :
                        <div style={{ position: "relative" }}>
                            <img src={hotItem.image} style={{ maxWidth: "100%", width: "100%" }} />

                            <div hidden={firstRun} className={"main-hotItemArrows " + (isHovering ? "main-hotItemAnimIn" : "main-hotItemAnimOut")}>
                                <button style={{ height: "40px", backgroundColor: "transparent", outline: "none", border: "none", color: "white" }}><ArrowBackIosNewIcon /></button>
                                <button style={{ marginLeft: "auto", height: "40px", backgroundColor: "transparent", outline: "none", border: "none", color: "white" }}><ArrowForwardIosIcon /></button>
                            </div>

                            <div hidden={firstRun} className={"main-hotItemBoxDimmer " + (isHovering ? "main-hotItemBoxDimmerAnimIn" : "main-hotItemBoxDimmerAnimOut")}>
                                <div style={{ position: "relative", height: "inherit", width: "inherit" }}>
                                    <div style={{ display: "flex", marginTop: "25px", marginBottom: "25px" }}>
                                        <Link to={"/item/" + hotItem.itemId}><h5 style={{ marginLeft: "25px", marginTop: "0px", marginBottom: "0px" }}>{hotItem.itemName}</h5> </Link>
                                        <h5 style={{ marginLeft: "auto", marginRight: "25px", marginTop: "0px", marginBottom: "0px" }}>${rounding(hotItem.price, 2)}</h5>
                                    </div>

                                    <div style={{ marginTop: "25px", marginLeft: "25px", marginRight: "25px", fontSize: "0.75em", color: "white", overflowX: "hidden", height: "calc(calc(100% - 125px) - 2.5em)", marginBottom: "35px", overflowY: "auto" }}>
                                        <h5>Description</h5>
                                        {hotItem.description}
                                    </div>

                                    <button style={{ position: "absolute", bottom: "45px", right: "25px", color: "white", outline: "none", border: "none", backgroundColor: "green", borderRadius: "5px", width: "50px", height: "35px", cursor: "pointer" }} onClick={
                                        () => {

                                            addToCart(hotItem, setCart, cart);
                                            itemAddedRef.current = hotItem.itemName;
                                            setShowToast(true);
                                        }}>
                                        <AddShoppingCartIcon />
                                    </button>
                                </div>
                            </div>
                        </div>}
                </div>

                <div className="main-reviewBox"> {/* add 10px gap between date and name when isSmall, when smaller turn hot items into row, review into row*/}
                { isLoadingReview ? <Loader/> : <>
                    <h3 style={{ margin: "25px 0px 25px 25px" }}>Recent Reviews</h3>

                    <div style={{ display: "flex", flexDirection: "row", width: "100%", height: "calc(calc(100% - 50px) - 1.25em)" }}>
                        <Link to={"/item/" + recentReview.itemId}><img src={recentReview.image} style={{ maxWidth: "min(30vw, 350px)", maxHeight: "min(30vw, 350px)" }} /> </Link>

                        <div style={{ width: "calc(100% - min(30vw, 350px))", height: "100%", margin: "25px 0px 25px 0px", position: "relative" }}>
                            {isSmall ?
                                <>
                                    <h4 style={{ margin: "0px" }}>{recentReview.name}</h4>
                                    <h4 style={{ margin: "0px 25px 0px auto" }}>{recentReview.date}</h4>
                                </> :
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <h4 style={{ margin: "0px" }}>{recentReview.name}</h4>
                                    <h4 style={{ margin: "0px 25px 0px auto" }}>{recentReview.date}</h4>
                                </div>
                            }

                            <Rating
                                value={recentReview.rating}
                                readOnly
                                precision={0.5}
                                emptyIcon={<StarIcon />}
                            />

                            {isSmall ? <h6 style={{ margin: "25px 0px 25px 0px", position: "absolute", bottom: "25px" }}>{recentReview.title}</h6> : <h6 style={{ margin: "25px 0px 25px 0px" }}>{recentReview.title}</h6>}

                            {isSmall ? null : <div style={{ marginBottom: "25px", marginRight: "25px", overflowY: "auto", height: "calc(calc(calc(100% - 125px) - 2.17em) - 1.125em)" }}>
                                <p style={{ fontSize: "0.75em" }}>
                                    {recentReview.description}
                                </p>
                            </div>}
                        </div>
                    </div>
                </>}
                </div>
            </div>
            
            <div className="main-StoreReview">
                <div className="main-StorePadding">
                    <h3>Store Reviews</h3>
                    <div>
                        <Rating
                            value={storeReview.rating}
                            readOnly
                            precision={0.5}
                            emptyIcon={<StarIcon />} 
                        />

                        <h4>We're proud to provide you the highest quality service </h4>

                    </div>
                </div>
            </div>

            {isLoadingStoreReview ? <Loader/> : <div className="main-StoreReview">
                <div className="main-StorePadding">
                    <h3>Recent Service Review</h3>
                    <div>

                        {storeReview.review.rating ? <span>
                            {storeReview.review.name} gave it a 

                            <Rating
                                value={storeReview.review.rating}
                                readOnly
                                precision={0.5}
                                emptyIcon={<StarIcon />} 
                            />
                        </span> : <span> No reviews yet... </span>}

                        {storeReview.review.description ? <span>                            
                            <br/>
                            <br/>
                            
                            They said "{storeReview.review.description}"
                        </span> : null}
                    </div>
                </div>
            </div>}
        </div>
    );
}