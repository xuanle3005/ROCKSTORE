import React, { useState, useRef, useEffect, useContext } from 'react';

import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import Alert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LinearProgress from '@mui/material/LinearProgress';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import ReviewCard from './../components/ReviewCard';

import "./Item.css";
import { addToCart, rounding } from "./../components/Utility";
import { CartContext } from './../components/CartContext';

import { useParams, useNavigate } from "react-router-dom";

import Loader from '../components/Loader';

export default function Item() {

    const [scoreCounts, setScoreCounts] = useState([0, 0, 0, 0, 0]);
    const [reviews, setReviews] = useState([]);

    const [cart, setCart] = useContext(CartContext);

    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(true);

    const [item, setItem] = useState({
        itemId: 1,
        itemName: "Default Name",
        price: 0,
        madeIn: "Canada",
        image: "/imgs/blue.png",
        department: "ROCK",
        rating: 0,
        description: "You shouldn't be reading this, contact support."
    });
    
    const id = useParams();
    
    const navigate = useNavigate();


    const reviewTheme = createTheme({
        components: {
            MuiLinearProgress: {
                styleOverrides: {
                    root: {
                        flexGrow: "1",
                        height: "15px",
                        marginLeft: "10px"
                    },
                    colorPrimary: {
                        backgroundColor: "#E2E2E2"
                    },
                    bar: {
                        backgroundColor: "#FAAF00"
                    }
                }
            }
        }
    });
    

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        
        setShowToast(false);
    };


    // Fetch data
    useEffect(() => {
        
        setLoading(true);

        fetch("/api/item/" + id.id, {
            headers: {
                'Accept': 'application/json'
            },
            method: "GET"
        })
        .then((response) => response.json())
        .then(data => {
                
            // Garbage data
            if (data === undefined || data.errorType) {

                navigate("/404");
                    
                // toast error later
                return;
            }
                
            setItem({
                itemId: data.itemId,
                itemName: data.itemName,
                price: data.price,
                madeIn: data.madeIn,
                image: data.image,
                department: data.department,
                rating: data.rating,
                description: data.description
            });
            
            setLoading(false);
        });

        fetch("/api/review/all/" + id.id, {
            headers: {
                'Accept': 'application/json'
            },
            method: "GET"
        })
        .then((response) => response.json())
        .then(data => {

            // Garbage data
            if (data === undefined || data.errorType) {

                navigate("/404");
                    
                // toast error later
                return;
            }
            
            let total = data.scores[0] + data.scores[1] + data.scores[2] + data.scores[3] + data.scores[4];

            if (total) {
                setScoreCounts([Math.round((data.scores[0] / total) * 100), Math.round((data.scores[1] / total) * 100),
                                Math.round((data.scores[2] / total) * 100), Math.round((data.scores[3] / total) * 100),
                                Math.round((data.scores[4] / total) * 100)]);
            }
            else {
                setScoreCounts([0, 0, 0, 0, 0]);
            }
        
            setReviews(data.reviews);
        });
    }, [id]);

    
    // Used for width manipulation for score count
    useEffect(() => {
        
        let elements = [
            document.getElementById("item-1Star"),
            document.getElementById("item-2Star"),
            document.getElementById("item-3Star"),
            document.getElementById("item-4Star"),
            document.getElementById("item-5Star")
        ];

        let marker = 0;

        let styleWidthFive = getComputedStyle(elements[4]).getPropertyValue("width");
        let numWidthFive = parseFloat(styleWidthFive.substring(0, styleWidthFive.length - 2));
        
        if (numWidthFive > marker) {
            marker = numWidthFive;
        }
        
        let styleWidthFour = getComputedStyle(elements[3]).getPropertyValue("width");
        let numWidthFour = parseFloat(styleWidthFour.substring(0, styleWidthFour.length - 2));

        if (numWidthFour > marker) {
            marker = numWidthFour;
        }

        let styleWidthThree = getComputedStyle(elements[2]).getPropertyValue("width");
        let numWidthThree = parseFloat(styleWidthThree.substring(0, styleWidthThree.length - 2));

        if (numWidthThree > marker) {
            marker = numWidthThree;
        }

        let styleWidthTwo = getComputedStyle(elements[1]).getPropertyValue("width");
        let numWidthTwo = parseFloat(styleWidthTwo.substring(0, styleWidthTwo.length - 2));

        if (numWidthTwo > marker) {
            marker = numWidthTwo;
        }

        let styleWidthOne = getComputedStyle(elements[0]).getPropertyValue("width");
        let numWidthOne = parseFloat(styleWidthOne.substring(0, styleWidthOne.length - 2));

        if (numWidthOne > marker) {
            marker = numWidthOne;
        }

        let totalLength = marker + 5;

        elements[4].style.marginLeft = (totalLength- numWidthFive) + "px";
        elements[3].style.marginLeft = (totalLength - numWidthFour) + "px";
        elements[2].style.marginLeft = (totalLength - numWidthThree) + "px";
        elements[1].style.marginLeft = (totalLength - numWidthTwo) + "px";
        elements[0].style.marginLeft = (totalLength - numWidthOne) + "px";

    }, [scoreCounts]);


    const displayReviews = () => {
        let array = [];
        
        // sanity check
        if (!reviews.length || reviews.length === 1 && !reviews[0].name) {
            return <h5>Be the first to review!</h5>;
        }
        
        for (let i = 0; i < reviews.length; i++) {
            array.push(<ReviewCard name={reviews[i].name} date={reviews[i].date} title={reviews[i].title} rating={reviews[i].rating} description={reviews[i].description} />);
        }
        return array;
    };


    // come back to truly align rating bars
    return (
        <div id="item-Body">
            { loading ? 
                <Loader/> :

                <div id="item-DescriptionGroup">
                    <img src={item.image} />

                    <div id="item-TitleGroup">
                        <h3 id="item-Title"> {item.itemName} </h3>
                        <div id="item-RatingRow">

                            <Rating
                                value={item.rating}
                                readOnly
                                precision={0.5}
                                emptyIcon={<StarIcon />}
                            />

                            <span id="item-RatingRowNumerical">{rounding(item.rating, 1)}</span>
                        </div>

                        <div id="item-PriceRow">
                            <span id="item-Price"> ${rounding(item.price, 2)} </span>
                            <button id="item-CartButton" onClick={() => {addToCart(item, setCart, cart); setShowToast(true);}}>
                                <AddShoppingCartIcon className="item-Center" />
                                <span className="item-Center">Add To Cart</span>
                            </button>
                        </div>

                        <h4>Description</h4>
                        <p>
                            {item.description}
                        </p>
                    </div>
                </div>
            }

            <div id="item-ReviewGroup">
                <div id="item-RatingGroup">
                    <h4>Ratings</h4>

                    <div>
                        <ThemeProvider theme={reviewTheme}>
                            <div className="item-RatingGroupRow">
                                <span>5 Stars:</span>
                                <LinearProgress variant="determinate" value={scoreCounts[4]} />
                                <span id="item-5Star" className="item-RatingGroupPercent">{scoreCounts[4]}%</span>
                            </div>

                            <div className="item-RatingGroupRow">
                                <span>4 Stars:</span>
                                <LinearProgress variant="determinate" value={scoreCounts[3]} />
                                <span id="item-4Star" className="item-RatingGroupPercent">{scoreCounts[3]}%</span>
                            </div>

                            <div className="item-RatingGroupRow">
                                <span>3 Stars:</span>
                                <LinearProgress variant="determinate" value={scoreCounts[2]} />
                                <span id="item-3Star" className="item-RatingGroupPercent">{scoreCounts[2]}%</span>
                            </div>

                            <div className="item-RatingGroupRow">
                                <span>2 Stars:</span>
                                <LinearProgress variant="determinate" value={scoreCounts[1]} />
                                <span id="item-2Star" className="item-RatingGroupPercent">{scoreCounts[1]}%</span>
                            </div>

                            <div className="item-RatingGroupRow">
                                <span>1 Stars:</span>
                                <LinearProgress variant="determinate" value={scoreCounts[0]} />
                                <span id="item-1Star" className="item-RatingGroupPercent">{scoreCounts[0]}%</span>
                            </div>
                        </ThemeProvider>
                    </div>
                </div>

                <div id="item-ReviewList">
                    <h4>Reviews</h4>

                    { displayReviews() }
                </div>
            </div>

            <Snackbar open={showToast} autoHideDuration={1250} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" sx={{ width: '100%' }} onClose={handleClose}>
                    Successfully added 1 x {item.itemName} to the cart.
                </Alert>
            </Snackbar>
        </div>    
    );
}