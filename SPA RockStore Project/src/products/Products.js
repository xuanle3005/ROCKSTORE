import React, { useState, useRef, useEffect, useContext } from 'react';

import ProductCard from '../components/ProductCard';
import CartItem from '../components/CartItem';

import "./Products.css";

import { CartContext } from "./../components/CartContext.js";

import { useNavigate } from 'react-router-dom';

export default function Products() {

    const [draggedOver, setDraggedOver] = useState(false);
    const [cart, setCart] = useContext(CartContext);

    const [total, setTotal] = useState(0);
    const [itemList, setItemList] = useState({});
    const [loading, setLoading] = useState(false);

    const cartRef = useRef(null);

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

    const rounding = (number, decimal) => {
        return Number(Math.round(parseFloat(number + "e" + decimal)) + 'e-' + decimal).toFixed(decimal);
    };

    const displayItems = () => {
        
        let array = [];
        
        const keys = Object.keys(itemList);

        for (let i = 0; i < keys.length; i++) {
            array.push(<ProductCard id={itemList[keys[i]].itemId} itemName={itemList[keys[i]].itemName} src={itemList[keys[i]].image} callBack={addToCart} cost={itemList[keys[i]].price} key={"pc" + i} rating={itemList[keys[i]].rating}/>);
        }

        return array;
    }

    const displayCart = () => {
        let array = [];

        const keys = Object.keys(cart);

        for (let i = 0; i < keys.length; i++) {
            array.push(<CartItem id={cart[keys[i]].itemId} itemName={cart[keys[i]].itemName} src={cart[keys[i]].image} cost={cart[keys[i]].price} quantity={cart[keys[i]].quantity} minusCallback={minusToCart} plusCallback={addToCart} key={"ci" + i}/>);
        }

        return array;
    }

    useEffect(() => {
        window.addEventListener("dragstart", (event) => {

            if (event.target && event.target.attributes && event.target.attributes.id) {

                if (event.target.attributes.id.value.includes("pc-item")) {
                    event.dataTransfer.setData("text/dragged-id", event.target.attributes.id.value);
                    setDraggedOver(true);
                }
            }
        });

        window.addEventListener("dragend", () => {
            setDraggedOver(false);
        });

        if (cartRef && cartRef.current) {
            // Turn the cart into a valid drop target
            cartRef.current.addEventListener("dragenter", (event) => { event.preventDefault(); });
            cartRef.current.addEventListener("dragover", (event) => { event.preventDefault(); });
        }
        
        setLoading(true);

        fetch("/api/item/all", {
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
                
            setItemList(data);

            setLoading(false);
            });
    }, []);

    // dirty inefficient way of getting price
    useEffect(() => {
        
        const keys = Object.keys(cart);

        let accum = 0;

        for (let i = 0; i < keys.length; i++) {
            accum = cart[keys[i]].price * cart[keys[i]].quantity + accum;    
        }

        setTotal(accum);
    }, [cart]);

    return (
        <div id="products-body">
            <div id="products-list">
                {displayItems()}

            </div>

            <div ref={cartRef} id="products-cart" onDrop={(event) => {
                event.preventDefault();

                if (event.dataTransfer.getData("text/dragged-id")) {
                    addToCart(event.dataTransfer.getData("text/dragged-id"));
                }
                setDraggedOver(false);
            }}>
                <div id="products-innerCart" className={draggedOver ? "products-innerCart-hover" : ""}>

                    <h4>Shopping Cart</h4>

                    {Object.keys(cart).length ?
                        <>
                            {displayCart()}
                        </> :
                        <>
                            <h5>Nothing here...</h5>
                            <h5>Start adding items by dragging them over! </h5>
                        </>
                    }

                    <div id="products-cartBar">
                        <h4>Subtotal: ${rounding(total, 2)}</h4>
                        <button onClick={() => { navigate("/cart") }}>Go To Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
}