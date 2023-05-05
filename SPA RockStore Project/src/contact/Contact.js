import React from 'react';
import ReactDOM from 'react-dom';

import Appbar from "./../components/Appbar";
import AboutCard from "./../components/AboutCard";

import "./../about/About.css";

export default function Contact() {
    return(
        <>
            <Appbar/>
            <div id="about-Body">
                <div id="about-Title">
                    <h2>Contact Us</h2>
                    <h3>Developed by Team 15</h3>
                </div>
                <div id="about-Group">
                    <AboutCard name="Alfred Langer" contact email="alanger@torontomu.ca" sid="500813614"/>
                    <AboutCard name="Hassaan Abbasi" contact email="hassaan.abbasi@torontomu.ca" sid="500887671"/>
                    <AboutCard name="Katherine Le" contact email="xuan.thanh.le@torontomu.ca" sid="500962159"/>
                    <AboutCard name="Lan Le" contact email="h1le@torontomu.ca" sid=""/>

                    <div id="about-Gap"></div>
                    
                    <AboutCard name="Eric Ku" contact email="eric.ku@torontomu.ca" sid="500910072"/>
                </div>
            </div>
        </>
    );
}