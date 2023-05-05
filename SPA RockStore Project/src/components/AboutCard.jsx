import "./AboutCard.css";

import placeholder from "./../assets/person-placeholder.jpg";

export default function AboutCard({ name, title = "", bio = "", src = "", contact = false, sid = "", email = "", phone = "N/A" }) {
    return (
        <div className="aboutCard">
            <img src={src === "" ? placeholder : src} />

            <div className="aboutCard-Text">
                <h3>{name}</h3>
                
                { contact ?
                    <>
                        <p>Student Number: {sid}</p>
                        <p>Email: {email}</p>
                        <p>Phone: {phone}</p>
                    </> :
                    <>
                        <h4>{title}</h4>
                        <p>{bio}</p>
                    </>
                }
            </div>
        </div>
    );
}