import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from 'react-router-dom';

import "./Appbar.css";
import { UserContext } from "./UserContext.js";

import systemLogo from "./logo.png";

import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home'; /*
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login'; */
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

import Alert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";

import { Link } from 'react-router-dom';
import { getCookie } from "./Utility.js";

export default function Appbar() {

    const [searchFocus, setSearchFocus] = useState(false);
    const [hamburgerMenu, setHamburgerMenu] = useState(false);
    const [hamburgerFocus, setHamburgerFocus] = useState(false);
    const [miniMenuFocus, setMiniMenuFocus] = useState(false);
    const [orderFocus, setOrderFocus] = useState(false);

    const [firstRun, setFirstRun] = useState(true);
    const [showToast, setShowToast] = useState(false);

    const [user, setUser] = useContext(UserContext);

    const [searchResults, setSearchResults] = useState(<h4> Start typing to search! </h4>);
    const [orderResults, setOrderResults] = useState(user ? <span> No results found... </span> : <span> Please log in to search your order(s).</span>);
    const [browser, setBrowser] = useState("");

    const ref = useRef(null);
    const lastClosed = useRef(0); //0 none, 1 ham, 2 minimenu, 3 ham & order, 4 mini & order
    const hamFocusRef = useRef(false);
    const miniFocusRef = useRef(false);
    const orderFocusRef = useRef(false);
    const stayOpen = useRef(false);
    const searchTextRef = useRef(null);
    const searchOrderRef = useRef(null);
    
    const navigate = useNavigate();

    const setAllHamburgerFocus = (bool) => {
        hamFocusRef.current = bool;
        setHamburgerFocus(bool);
    };

    const setAllMiniFocus = (bool) => {
        miniFocusRef.current = bool;
        setMiniMenuFocus(bool);
    };

    const setAllOrderFocus = (bool) => {
        orderFocusRef.current = bool;
        setOrderFocus(bool);
    };
    

    const logout = () => {
        fetch("/api/user/logout", { method: "GET"})
        .then((response) => {

            searchOrderRef.current.value = ""; // just to clear saved text
            // disregard response, force the logout
            setUser("");
            // insert toast
            navigate("/");
            
        })
    };


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        
        setShowToast(false);
    };


    // Should debounce? displaying loader could be optional depends on style
    const toSearch = () => {
        const temp = searchTextRef.current.value;

        fetch("/api/item/search?q=" + encodeURIComponent(temp), {
            headers: {
                'Accept': 'application/json'
            },
            method: "GET"
        })
        .then((response) => {
            
            if (response.status === 404 || response.status === 400) {
                return <h4> No results found... </h4>;
            }

            return response.json()})
        .then(data => {
            setSearchResults(data);
        });
    };

    const orderSearch = () => {
        const temp = searchOrderRef.current.value;

        fetch("/api/order/search?q=" + encodeURIComponent(temp), {
            headers: {
                'Accept': 'application/json'
            },
            method: "GET"
        })
        .then((response) => {
            
            if (response.status === 404 || response.status === 400) {
                return user ? <span> No results found... </span> : <span> Please log in to search your order(s).</span>;
            }

            return response.json()})
        .then(data => {
            setOrderResults(data);
        });
    };

    const displayOrderResults = () => {

        let array = [];

        if (orderResults.length) {
            for (let i = 0; i < orderResults.length; i++) {
                array.push(
                    <Link to={"/status/" + orderResults[i].orderId} className="appbar-SearchItems" style={{display: "block", borderTop: "none", borderBottom: "1px solid #E2E2E2"}}>
                        <div style={{display: "flex"}}> <h3>Order #{orderResults[i].orderId}</h3> <h3 style={{marginLeft: "auto"}}>Placed on: {orderResults[i].date}</h3> </div>
                        <h4>Status: {orderResults[i].done ? "Delivered" : "In Progress"}</h4>
                    </Link>
                );
            }

            return array;
        }
        else {
            return orderResults;
        }
    }

    const displaySearchResults = () => {

        let array = [];

        if (searchResults.length) {
            for (let i = 0; i < searchResults.length; i++) {
                array.push(<Link to={"/item/" + searchResults[i].itemId} className="appbar-SearchItems"><h3>{searchResults[i].itemName}</h3></Link>);
            }

            return array;
        }
        else {
            return searchResults;
        }
    }


    // Resize listener
    useEffect(() => {

        if (ref && ref.current) {

            const resize = (event) => {

                if (event) { event.stopPropagation(); }
                
                const temp = ref.current;
                const styleWidth = getComputedStyle(temp).getPropertyValue("width");
                const numWidth = parseFloat(styleWidth.substring(0, styleWidth.length - 2));
                
                // to change later to debounce and refs instead, event listeners cant read the state past init need refs
                if (numWidth < 900) {

                    if (miniFocusRef.current) {
                        lastClosed.current = 2;

                        if (orderFocusRef.current) {
                            setAllOrderFocus(false);
                            lastClosed.current = 4;
                        }
                    }

                    setHamburgerMenu(true);
                    setAllMiniFocus(false);

                    // if minmenu open
                    // lastClosed.current = 2;

                    document.getElementById("app").style.overflowY = "";
                    document.getElementById("app").style.height = "";
                }
                else if (numWidth >= 900) {

                    if (hamFocusRef.current) {
                        lastClosed.current = 1;

                        if (orderFocusRef.current) {
                            setAllOrderFocus(false);
                            lastClosed.current = 3;
                        }
                    }

                    setHamburgerMenu(false);
                    setAllHamburgerFocus(false);

                    // if ham was open
                    // lastClosed.current = 1;

                    document.getElementById("app").style.overflowY = "";
                    document.getElementById("app").style.height = "";
                }
            }

            // First run only
            resize(null);
            
            if (document.readyState !== 'loading') {
                window.addEventListener("resize", resize);
            }
            else {
                window.addEventListener("DOMContentLoaded", () => {

                    window.addEventListener("resize", resize);

                    return () => {
                        window.removeEventListener("resize", resize);
                    }
                });
            }
        }
    }, []);


    // verify cookie
    useEffect(() => {
        fetch("/api/user/verify", { method: "GET"})
        .then((response) => {

            if (response.status === 200) {
                setUser(getCookie("name"));
            }
        })
    }, []);

    // Browser detection
    useEffect(() => {

        let ua = navigator.userAgent;

        if (ua.match(/chrome|chromium|crios/i)) {
            setBrowser("Chrome");
        }
        else if (ua.match(/firefox|fxios/i)) {
            setBrowser("Firefox");
        }
        else if (ua.match(/safari/i)) {
            setBrowser("Safari");
        }
        else if (ua.match(/opr\//i)) {
            setBrowser("Opera");
        }
        else if (ua.match(/edg/i)) {
            setBrowser("Internet Explorer/Edge");
        }
    }, []);

    // If a rerender occurs do not play animation if it was previously open
    useEffect(() => {
        
        stayOpen.current = false;

        if (hamburgerFocus) {
            stayOpen.current = true;
        }
        else if (miniMenuFocus) {
            stayOpen.current = true;
        }

    });

    useEffect(() => {

        if (!user) {
            setOrderResults(<span> Please log in to search your order(s).</span>);
        }
        else {
            setOrderResults(<span> No results found... </span>);
        }
    }, [user])

    return (
        <div ref={ref} id="appbar-bg">
            <div id="appbar-content">
                <Link to="/" id="appbar-logolink">
                    <img id="appbar-logo" src={systemLogo} />
                </Link>

                <div id="appbar-temp">
                    <div id="appbar-sb-wrapper">
                        <input ref={searchTextRef} className="appbar-searchbar" placeholder="Search for rocks" onClick={() => {
                            // dims the page for searching
                            // suppose to prevent scrolling to make the dimmer take the whole screen
                            // side effect scroll bar disapppears and reappears when undimed shifting elements
                            setSearchFocus(true);

                            lastClosed.current = 0;

                            if (hamburgerFocus && orderFocus) {
                                setAllHamburgerFocus(false);
                                setAllOrderFocus(false);
                                lastClosed.current = 3;
                            }
                            else if (miniMenuFocus && orderFocus) {
                                setAllMiniFocus(false);
                                setAllOrderFocus(false);
                                lastClosed.current = 4;
                            }
                            else if (hamburgerFocus) {
                                setAllHamburgerFocus(false);
                                lastClosed.current = 1;
                            }
                            else if (miniMenuFocus) {
                                setAllMiniFocus(false);
                                lastClosed.current = 2;
                            }

                            document.getElementById("app").style.overflowY = "clip";
                            document.getElementById("app").style.height = "100vh";
                        }} onChange={toSearch}/>

                        <button id="appbar-searchbutton">
                            <SearchIcon id="appbar-searchicon" htmlColor="white" />
                        </button>
                    </div>

                    {searchFocus ? 
                        <div className="appbar-searchcontent">
                            {displaySearchResults()}
                        </div> : null}

                </div>
                {hamburgerMenu ?
                    <>
                        {hamburgerMenu && hamburgerFocus ?

                            <button id="appbar-closeIcon" onClick={() => {
                                lastClosed.current = 1;
                                setAllHamburgerFocus(false);

                                if (orderFocus) {
                                    setAllOrderFocus(false);
                                    lastClosed.current = 3;
                                }

                                document.getElementById("app").style.overflowY = "";
                                document.getElementById("app").style.height = "";

                            }}>
                                <CloseIcon fontSize="large" className="appbar-itemicon" />
                            </button> :

                            <button id="appbar-burgerIcon" onClick={() => {

                                lastClosed.current = 0;
                                setAllHamburgerFocus(true);
                                setFirstRun(false);

                                if (searchFocus) {
                                    setSearchFocus(false);
                                }
                                else if (miniMenuFocus) {
                                    setAllMiniFocus(false);
                                }

                                document.getElementById("app").style.overflowY = "clip";
                                document.getElementById("app").style.height = "100vh";
                            }}>
                                <MenuIcon fontSize="large" className="appbar-itemicon" />
                            </button>}
                    </> :
                    <div id="appbar-itemgroup">
                        <Link className="appbar-item" to="/">
                            <h4>Home</h4>
                        </Link>

                        <Link className="appbar-item" to="/products">
                            <h4>Products</h4>
                        </Link>

                        <Link className="appbar-item" to="/cart">
                            <h4>Cart</h4>
                        </Link>
                        {user !== "" ? 
                        
                        <Link className="appbar-item" onClick={() => {logout(); setShowToast(true);}}>
                            <h4>Logout</h4>
                        </Link> :
                        <Link className="appbar-item" to="/login">
                            <h4>Sign In</h4>
                        </Link>
                        }
                        {miniMenuFocus ?
                            <button id="appbar-closeIcon" onClick={() => {
                                lastClosed.current = 2;
                                setAllMiniFocus(false);

                                if (orderFocus) {
                                    setAllOrderFocus(false);
                                    lastClosed.current = 4;
                                }

                                document.getElementById("app").style.overflowY = "";
                                document.getElementById("app").style.height = "";
                            }}>
                                <CloseIcon fontSize="large" className="appbar-itemicon" />
                            </button> :

                            <MoreVertIcon fontSize="large" className="appbar-itemicon" onClick={() => {

                                lastClosed.current = 0;
                                setAllMiniFocus(true);
                                setFirstRun(false);

                                if (searchFocus) {
                                    setSearchFocus(false);
                                }
                                else if (hamburgerFocus) {
                                    setAllHamburgerFocus(false);
                                }

                                document.getElementById("app").style.overflowY = "clip";
                                document.getElementById("app").style.height = "100vh";
                            }} />
                        }
                    </div>}

                {searchFocus || hamburgerFocus || miniMenuFocus ?
                    <div id="appbar-dimmer" onClick={() => {

                        if (hamburgerFocus && orderFocus) {
                            lastClosed.current = 3;
                        }
                        else if (miniMenuFocus && orderFocus) {
                            lastClosed.current = 4;
                        }
                        else if (hamburgerFocus) {
                            lastClosed.current = 1;
                        }
                        else if (miniMenuFocus) {
                            lastClosed.current = 2;
                        }
                        else {
                            lastClosed.current = 0;
                        }

                        setSearchFocus(false);
                        setAllHamburgerFocus(false);
                        setAllMiniFocus(false);
                        setAllOrderFocus(false);

                        document.getElementById("app").style.overflowY = "";
                        document.getElementById("app").style.height = "";
                    }}>
                    </div> : null}
            </div>

            <div style={{ position: "absolute", top: "75px", right: "0px", overflow: "hidden" }}>
                <div id="appbar-menu" hidden={firstRun || miniMenuFocus} className={hamburgerFocus ? (stayOpen.current ? "" : "appbar-menuAnimIn") : ((lastClosed.current === 1 || lastClosed.current === 3) ? "appbar-menuAnimOut" : "appbar-Dead")}>
                    <Link to="/"><div className="appbar-menuItem"><HomeIcon htmlColor="black" /><h3>Home</h3></div> </Link>
                    <Link to="/products"><div className="appbar-menuItem"><h3>Products</h3></div> </Link>
                    <Link to="/cart"><div className="appbar-menuItem"><h3>Cart</h3></div> </Link>
                    {user !== "" ? 
                        <Link onClick={() => {logout(); setShowToast(true);}}>
                            <div className="appbar-menuItem"><h3>Logout</h3></div>
                        </Link> : 
                        
                        <Link to="/login"><div className="appbar-menuItem"><h3>Sign In</h3></div> </Link>}
                    <div className="appbar-menuItem" onClick={() => {
                        setAllOrderFocus(true);
                    }}><h3>Search Orders</h3></div>
                    <Link to="/contact"><div className="appbar-menuItem"><h3>Contact Us</h3></div> </Link>
                    <Link to="/about"><div className="appbar-menuItem"><h3>About Us</h3></div> </Link>
                    {getCookie("admin") ? <Link to="/admin"><div className="appbar-menuItem"><h3>Admin Mode</h3></div> </Link> : null}
                    {user ? <div className="appbar-menuItemNH"><h3>Signed in as {decodeURIComponent(user)}</h3></div> : null}
                    <div className="appbar-menuItemNH"><h3>Running on {browser}</h3></div>
                </div>
            </div>

            <div style={{ position: "absolute", top: "75px", right: "0px", overflow: "hidden" }}>
                <div id="appbar-menu" hidden={firstRun || hamburgerFocus} className={miniMenuFocus ? (stayOpen.current ? "" : "appbar-menuAnimIn") : ((lastClosed.current === 2 || lastClosed.current === 4) ? "appbar-menuAnimOut" : "appbar-Dead")}>
                    <div className="appbar-menuItem" onClick={() => {
                        setAllOrderFocus(true);
                    }}><h3>Search Orders</h3></div>
                    <Link to="/contact"><div className="appbar-menuItem"><h3>Contact Us</h3></div> </Link>
                    <Link to="/about"><div className="appbar-menuItem"><h3>About Us</h3></div> </Link>
                    {getCookie("admin") ? <Link to="/admin"><div className="appbar-menuItem"><h3>Admin Mode</h3></div> </Link> : null}
                    {user ? <div className="appbar-menuItemNH"><h3>Signed in as {decodeURIComponent(user)}</h3></div> : null}
                    {browser ? <div className="appbar-menuItemNH"><h3>Running on {browser}</h3></div> : null}
                </div>
            </div>

            <div style={{ position: "absolute", top: "75px", right: "0px", overflow: "hidden" }}>
                <div id="appbar-menu" hidden={firstRun} className={orderFocus ? "appbar-menuAnimIn" : ((lastClosed.current === 3 || lastClosed.current === 4) ? "appbar-menuAnimOut" : "appbar-Dead")}>
                    <div id="appbar-OrderSearchGroup">

                        <h3 style={{ marginTop: "10px", marginBottom: "10px" }}>Order Search</h3>

                        <div id="appbar-sb-wrapper" className="appbar-DirtyOveride">
                            <input className="appbar-searchbar appbar-DirtySearch" placeholder="#Order number" disabled={!user} ref={searchOrderRef} onChange={orderSearch}/>

                            <button id="appbar-searchbutton" disabled={!user}>
                                <SearchIcon id="appbar-searchicon" htmlColor="white" />
                            </button>
                        </div>

                        <h4 style={{ marginTop: "10px", paddingBottom: "10px", borderBottom: "1px solid #E2E2E2" }}>Results</h4>
                        {displayOrderResults()}

                    </div>
                </div>
            </div>

            <Snackbar open={showToast} autoHideDuration={1500} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" sx={{ width: '100%' }} onClose={handleClose}>
                    Logged out successfully.
                </Alert>
            </Snackbar>
        </div>
    );
}