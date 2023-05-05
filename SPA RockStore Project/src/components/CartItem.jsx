import React, { useState } from "react";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import "./CartItem.css";
import { Link } from "react-router-dom";

export default function CartItem({id=1, src="", cost=0, itemName="Default Title", minusCallback, plusCallback, quantity=1}) {
    const [minus, setMinus] = useState(false);
    const [plus, setPlus] = useState(false);

    const rounding = (number, decimal) => {
        return Number(Math.round(parseFloat(number + "e" + decimal)) + 'e-' + decimal).toFixed(decimal);
    };

    return(
        <div className="cartItem-Body">
            <img src={src}/>

            <div>
                <Link to={"/item/" + id}><p>{itemName}</p></Link>
                <h5 style={{margin: "5px 0px 5px 0px"}}>${rounding(cost, 2)}</h5>
                <div style={{display: "flex"}}>
                    <button className="cartItem-Body-Buttons" onMouseDown={() => {
                        minusCallback(id);
                        setMinus(true);
                    }} onMouseUp={() => {setMinus(false)}}>
                        {minus ? <RemoveCircleOutlineIcon/> : <RemoveCircleIcon/>}
                    </button>
                    <h5 style={{margin: "auto 10px auto 10px"}}>{quantity}</h5>
                    <button className="cartItem-Body-Buttons" onMouseDown={() => {
                        plusCallback(id);
                        setPlus(true)}} onMouseUp={() => {setPlus(false)}}>
                        {plus ? <AddCircleOutlineIcon/> : <AddCircleIcon/>}
                    </button>
                </div>
            </div>
        </div>
    );
}