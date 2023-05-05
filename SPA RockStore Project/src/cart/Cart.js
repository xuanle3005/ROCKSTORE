import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import CartItem from "./../components/CartItem";
import { CartContext } from "./../components/CartContext.js";
import { UserContext } from "./../components/UserContext.js";

import "./Cart.css";

export default function Cart() {
    
    const [cart, setCart] = useContext(CartContext);
    const [user, setUser] = useContext(UserContext);

    const [itemTotal, setTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [overall, setOverall] = useState(0);
    
    const navigate = useNavigate();
    
    const minusToCart = (id) => {
        let tempCart = JSON.parse(JSON.stringify(cart));

        if (tempCart[id + ""].quantity > 1) {

            let tempValues = Object.assign({}, tempCart[id + ""]);

            tempValues.quantity -= 1;

            tempCart[id] = Object.assign({}, tempValues);
        }
        else {
            delete tempCart[id + ""];
        }

        setCart(tempCart);
    };

    const addToCart = (id) => {
        let tempCart = JSON.parse(JSON.stringify(cart));

        let cleanedId = (id + "").replace("pc-item-", "");
        
        if (tempCart[cleanedId + ""]) {

            let tempValues = Object.assign({}, tempCart[cleanedId + ""]);

            tempValues.quantity += 1;

            tempCart[cleanedId] = Object.assign({}, tempValues);
        }
        else {
            tempCart[cleanedId + ""] = {
                itemId: cleanedId,
                itemName: itemList[cleanedId + ""].itemName,
                image: itemList[cleanedId + ""].image,
                price: itemList[cleanedId + ""].price,
                quantity: 1
            }
        }

        setCart(tempCart);
    };

    const displayCart = () => {
        let array = [];

        const keys = Object.keys(cart);

        if (keys.length) {
            for (let i = 0; i < keys.length; i++) {
                array.push(<CartItem id={cart[keys[i]].itemId} itemName={cart[keys[i]].itemName} src={cart[keys[i]].image} cost={cart[keys[i]].price} quantity={cart[keys[i]].quantity} minusCallback={minusToCart} plusCallback={addToCart}/>);
            }

            return array;
        } 
        else {
            return (<>
                <h5>Nothing here...</h5>
                <h5>Start adding items! </h5>
            </>); 
        }
    }
    
    const rounding = (number, decimal) => {
        return Number(Math.round(parseFloat(number + "e" + decimal)) + 'e-' + decimal).toFixed(decimal);
    };

    useEffect(() => {
        
        const keys = Object.keys(cart);

        let accum = 0;

        for (let i = 0; i < keys.length; i++) {
            accum = cart[keys[i]].price * cart[keys[i]].quantity + accum;    
        }

        setTax(accum * 0.13);
        setTotal(accum);
        setOverall((accum * 0.13) + accum);
    }, [cart]);

    return (

        <div id="cart-Body">
            <div id="cart-List">
                <h1>Cart</h1>
                {displayCart()}
            </div>

            <div id="cart-Total">
                <h4 id="cart-TotalHeader">Order Summary</h4>

                <div id="cart-TotalGroup">
                    <div className="cart-TotalItems">
                        <span className="cart-TotalNums"> Items: </span>
                        <span>${rounding(itemTotal, 2)}</span>
                    </div>

                    <div className="cart-TotalItems">
                        <span className="cart-TotalNums"> Delivery Fees: </span>
                        <span>TBD</span>
                    </div>

                    <div className="cart-TotalItems">
                        <span className="cart-TotalNums"> Subtotal: </span>
                        <span>${rounding(itemTotal, 2)}</span>
                    </div>

                    <div className="cart-TotalItems">
                        <span className="cart-TotalNums"> GST/HST: </span>
                        <span>${rounding(tax, 2)}</span>
                    </div>
                </div>

                <div className="cart-TotalItems">
                    <h4 className="cart-TotalNums">Order Total: </h4>
                    <span className="cart-TotalOrderNum">${rounding(overall, 2)}</span>
                </div>

                <button disabled={!Object.keys(cart).length} onClick={() => {
                    if (user) {
                        navigate("/payment");
                    }
                    else {
                        navigate("/login");
                    }
                }}>Proceed with Checkout</button>
            </div>
        </div>
    );
}