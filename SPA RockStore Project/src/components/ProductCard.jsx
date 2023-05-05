import Rating from '@mui/material/Rating';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StarIcon from '@mui/icons-material/Star';

import "./ProductCard.css";
import { Link } from 'react-router-dom';

export default function ProductCard({id=1, src="", itemName="Default Title", callBack, rating=0, cost=0}) {
    
    const cutOff = () => {
        return itemName.length >= 31 ? itemName.substring(0, 29) + "..." : itemName;
    }; 
    
    const decimalPoint = () => {

        if (cost <= 0) {
            return "Free"
        }
        else if ((cost+ "").indexOf(".") == -1) {
            return "$" + cost + ".00"
        }
        else {
            return "$" + cost;
        }
    }

    return(
        <div className="pc-item">
            <img src={src} id={"pc-item-" + id}/>

            <div>
                <Link to={"/item/" + id}>{cutOff()}</Link>

                <button onClick={() => callBack(id)}>
                    <AddShoppingCartIcon/>
                </button>

                <div style={{display: "flex", marginLeft: "0px", marginRight: "0px"}}>
                    <Rating style={{marginRight: "auto"}}
                        value={rating}
                        readOnly
                        precision={0.5}
                        emptyIcon={<StarIcon/>}
                    />

                    {decimalPoint()}
                </div>
            </div>
    </div>
    );
}