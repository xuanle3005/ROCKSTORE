import React, { lazy, Suspense, useContext, useState } from 'react';
import { createRoot } from 'react-dom/client';

const Main = lazy(() => import("./main/Main"));
const Products = lazy(() => import("./products/Products"));
const Cart = lazy(() => import("./cart/Cart"));
const Item = lazy(() => import("./item/Item"));
const Login = lazy(() => import("./login/Login"));
const Signup = lazy(() => import("./signup/Signup"));
const About = lazy(() => import("./about/About"));
const Admin = lazy(() => import("./admin/Admin"));
const Payment = lazy(() => import("./payment/Payment"));
const Status = lazy(() => import("./status/Status"));

import Loader from "./components/Loader";
import Appbar from "./components/Appbar";

import { CartContext } from "./components/CartContext.js";
import { UserContext } from "./components/UserContext.js";

import { BrowserRouter, Route, Routes, Link, HashRouter } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const root = createRoot(document.getElementById("app"));

function App() {
    
    const [cart, setCart] = useState({});
    const [user, setUser] = useState("");

    return (<>
            <BrowserRouter> {/*BrowserRouter when served up from server, hashrouter for no server*/}

                <UserContext.Provider value={[user, setUser]}>
                    <CartContext.Provider value={[cart, setCart]}>
                        <Appbar />
                        
                        <Suspense fallback={<Loader fullScreen/>}>
                        <Routes>
                            <Route exact path="/" element={<Main />} />
                            <Route exact path="/products" element={<Products />} />
                            <Route exact path="/cart" element={<Cart />} />
                            <Route path="/item/:id" element={<Item />} />
                            <Route exact path="/login" element={<Login />} />
                            <Route exact path="/signup" element={<Signup />} />
                            <Route exact path="/contact" element={<About contact />} />
                            <Route exact path="/about" element={<About />} />
                            <Route exact path="/admin" element={<Admin />} />
                            <Route exact path="/payment" element={<Payment />} />
                            <Route exact path="/status/:id" element={<Status />} />
                            <Route exact path="*" element={
                                <div style={{ textAlign: "center" }}>
                                    <h3>404 Page not Found</h3>
                                    <Link to="/">Click here to go to the home page</Link>
                                </div>}
                            />
                        </Routes>
                        </Suspense>
                    </CartContext.Provider>
                </UserContext.Provider>
            </BrowserRouter>
        
    </>
    );
}

root.render(<App />);