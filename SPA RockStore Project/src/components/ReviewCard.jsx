import "./ReviewCard.css";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

export default function ReviewCard({name="No name provided", date="1/1/1970", title="", rating=0, description=""}) {
    return(
        <div className="reviewCard-Body">
            <div className="reviewCard-NameRow"> 
                <h5>{name}</h5>
                <h5 className="reviewCard-Date">{date}</h5>
            </div>

            <div className="reviewCard-RatingRow">
                <Rating
                    value={rating}
                    readOnly
                    precision={0.5}
                    emptyIcon={<StarIcon/>}
                />
                <h5 className="reviewCard-Title">{title}</h5>
            </div>
            
            <span>
                {description}
            </span>
    </div>
    );
}