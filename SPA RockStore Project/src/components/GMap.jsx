import React, { useState, useEffect, useRef, useContext } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

import Loader from "./Loader";
import Maps from "./Maps";

import { DistanceContext } from "./DistanceContext.js";

// Wrapper class needed for maps
export default function GMap({ address, branch }) {

    const ref = useRef();
    
    const branchLocation = branch === "A" ? {lat:43.61820701903892, lng:-79.76905895548806} : {lat:43.65830, lng:-79.38080}
    const apiKey = 'AIzaSyBTyihH9QhzFp2TKI6aBx912hXitQdZglk';

    const [destination, setDestination] = useState({lat: 0, lng: 0});
    const [path, setPath] = useState("");
    const [loading, setLoading] = useState(true);

    const [distance, setDistance] = useContext(DistanceContext)

    const geocode = () => {
        setLoading(true);

        fetch("/api/map/geocode?address=" + encodeURIComponent(address), {
            headers: {
                'Accept': 'application/json'
            },
            method: "GET"
        })
        .then((response) => response.json())
        .then(data => {
            setDestination(data.results[0].geometry.location);
            setLoading(false);
        });
    };
    
    const pathing = () => {

        fetch("/api/map/directions?origin=" + encodeURIComponent(branch === "A" ? "1 Presidents Choice Cir, Brampton, Ontario" : "350 Victoria St, Toronto, Ontario") + "&destination=" + encodeURIComponent(address), {
            headers: {
                'Accept': 'application/json'
            },
            method: "GET"
        })
        .then((response) => response.json())
        .then(data => {
                
            if (data && data.routes) {
                // data.routes[0].legs[0].duration.value;

                setDistance({distance:(data.routes[0].legs[0].distance.value / 1000), time: (data.routes[0].legs[0].duration.value / 60)});
                setPath(data.routes[0].overview_polyline.points);
            }
        });
    };

    const render = (status) => {

        switch (status) {

            case Status.FAILURE:
                return <h4>An Error occured.</h4>
            
            case Status.LOADING:
                return <Loader/>

            case Status.SUCCESS:
                return <Maps start={branchLocation} end={destination} zoom={12} path={path}/>;
        }
    };

    useEffect(() => {
        geocode();
        pathing();
    }, []);

    return (
        <Wrapper apiKey={apiKey} libraries={["marker", "geometry", "maps"]} render={render}/> 
    );
}