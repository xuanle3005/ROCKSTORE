import React, { useEffect, useRef } from 'react';

export default function Maps({ start, end, zoom, path }) {
    
    const ref = useRef();

    useEffect(() => {
        let temp = new google.maps.Map(ref.current, {center:start, zoom, disableDefaultUI: true});
        
        new google.maps.Marker({position: start, map:temp, title: "Warehouse"});
        new google.maps.Marker({position: end, map:temp, title: "Destination"});

        if (path) {
            const pairs = google.maps.geometry.encoding.decodePath(path);

            new google.maps.Polyline({
                path: pairs,
                map: temp,
                strokeColor: "#610303"
            });
        }

    });

    return <div style={{width: "512px", height: "512px"}} ref={ref} id="map" />;
}