import React from 'react';
import {Link} from "react-router-dom";
import { Rating } from "@material-ui/lab";
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

const ProductCard = ({ product }) => {

  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
   
    return (
      <Link className="productCard" to={`/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <Rating {...options} />{" "}
        <span className="productCardSpan">
          {" "}
          ({product.numOfReviews} Reviews)
        </span>
      </div>
      <span>{`₹${product.price}`}</span>
      <p id="Discount"><LocalOfferIcon id="OfferIcon"/>Available at {product.discount}% discount</p>
    </Link>
    );
  };
  
  export default ProductCard;
