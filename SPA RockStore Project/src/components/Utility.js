// maybe hash and compare cookie if same use hashmap
function getCookie(name) {

    if (typeof document === 'undefined' || !name) {
        return null;
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    let cookies = document.cookie ? document.cookie.split('; ') : [];
    
    for (let i = 0; i < cookies.length; i++) {
        let parts = cookies[i].split('=');
        let value = parts.slice(1).join('=');

        let found = decodeURIComponent(parts[0]);
        
        if (found === name) {
            return value;
        }
    }

    return null;
}


function minusToCart(id, callBack, cart) {
    let tempCart = JSON.parse(JSON.stringify(cart));

    id = id + "";

    if (tempCart[id].quantity > 1) {

        let tempValues = Object.assign({}, tempCart[id]);

        tempValues.quantity -= 1;

        tempCart[id] = Object.assign({}, tempValues);
    }
    else {
        delete tempCart[id];
    }

    callBack(tempCart);
}


function addToCart(item, callBack, cart) {
    
    let tempCart = JSON.parse(JSON.stringify(cart));
    
    const id = item.itemId + "";

    if (tempCart[id]) {

        let tempValues = Object.assign({}, tempCart[id]);

        tempValues.quantity += 1;

        tempCart[id] = Object.assign({}, tempValues);
    }
    else {
        tempCart[id] = {
            itemId: item.itemId,
            itemName: item.itemName,
            image: item.image,
            price: item.price,
            quantity: 1
        }
    }

    callBack(tempCart);
}


function rounding(number, decimal) {
    return Number(Math.round(parseFloat(number + "e" + decimal)) + 'e-' + decimal).toFixed(decimal);
}

export { getCookie, rounding, minusToCart, addToCart };