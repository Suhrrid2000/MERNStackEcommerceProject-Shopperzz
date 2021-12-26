import React, { Fragment,useEffect, useState } from 'react'
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector,useDispatch } from 'react-redux';
import { clearErrors, getProductDetails, newReview, getSuggestedProduct } from '../../actions/productAction';
import ReviewCard from "./ReviewCard.js";
import Loader from "../layout/Loader/Loader";
import {useAlert} from "react-alert";
import MetaData from "../layout/MetaData";
import { addItemsToCart } from '../../actions/cartAction';
import ProductCard from "../Home/ProductCard";
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
  } from "@material-ui/core";
  import { Rating } from "@material-ui/lab";
  import { NEW_REVIEW_RESET } from "../../constants/productConstants";


const ProductDetails = ({match}) => {

    const dispatch = useDispatch();
    const alert = useAlert();

    const {product, loading, error} = useSelector((state) => state.productDetails)

    const { success, error: reviewError } = useSelector(
        (state) => state.newReview
      );


    const { suggestedproducts } = useSelector(state=>state.suggestedproducts);

    // function to skip a particular product 
    function skipThisProduct() {
      console.log("Product skipped");
    }

    const options = {
        size: "large",
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
      };

    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");  

    const increaseQuantity = () => {
        if(product.Stock <= quantity) {return;}
        const qty = quantity + 1;
        setQuantity(qty);
    }

    const decreaseQuantity = () => {
        if(quantity === 1)
            setQuantity(1);
        else{
            const qty = quantity - 1;
            setQuantity(qty);
        }
    }

    const addToCartHandler = () => {
        
        if(product.Stock < 1)
            alert.error("Oops!! Item is currently out of stock");
        else{
            dispatch(addItemsToCart(match.params.id, quantity));
            alert.success("Item Added To Cart");
        }
      };

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
      };
    
    const reviewSubmitHandler = () => {
        const myForm = new FormData();
    
        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", match.params.id);
    
        dispatch(newReview(myForm));
    
        setOpen(false);
      };

      useEffect(() => {
        if (error) {
          alert.error(error);
          dispatch(clearErrors());
        }
    
        if (reviewError) {
          alert.error(reviewError);
          dispatch(clearErrors());
        }
    
        if (success) {
          alert.success("Review Submitted Successfully");
          dispatch({ type: NEW_REVIEW_RESET });
        }
        dispatch(getProductDetails(match.params.id));
        dispatch(getSuggestedProduct(product.category));
        window.scrollTo(0, 0)

      }, [dispatch, match.params.id, error, alert, reviewError, success, product.category]);


    function DiscountedPrice(price, discount) {

      return Math.round(price-(discount*price/100));
  }
    
    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={`${product.name} -- SHOPPERZZ`} />
                <div className="ProductDetails">
                    <div>
                        <Carousel>
                            {product.images && 
                             product.images.map((item,i) => (
                                <img
                                    className="CarouselImage"
                                    key={item.url}
                                    src={item.url}
                                    alt={`${i} Slide`}
                                />
                             ))}
    
                        </Carousel>
                    </div>
    
                    <div>
                        <div className="detailsBlock-1">
                            <h2>{product.name}</h2>
                            <p>Product # {product._id}</p>
                        </div>
                        <div className="detailsBlock-2">
                            <Rating {...options} />
                            <span> ({product.numOfReviews} Reviews) </span>
                        </div>
                        <div className="detailsBlock-3">
                            <h1 id="pricetag">
                              {`₹${product.price}`}
                            </h1>
                            {product.cod ? 
                                <span className="cashOnDelivery">Cash On Delivery Available</span> : 
                                <span className="cashOnDeliveryNotAvailable">Cash On Delivery</span>}
                            <p id="discountedPrice">
                            <LocalOfferIcon id="OfferIcon"/>{`₹${DiscountedPrice(product.price, product.discount)}`}  ({product.discount}% Off)
                            </p> 
                            
                            <div className="detailsBlock-3-1">
                                <div className="detailsBlock-3-1-1">
                                    <button onClick={decreaseQuantity}>-</button>
                                    <input readOnly value={quantity} type="number" />
                                    <button onClick={increaseQuantity}>+</button>
                                </div> {" "}
                                <button onClick={addToCartHandler}>Add to Bucket</button>
                            </div>
                            <p>
                                Status:{" "}
                                <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                                </b>
                            </p>
                        </div>
    
                        <div className="detailsBlock-4">
                            Description: <p>{product.description}</p>
                        </div>
    
                        <button onClick={submitReviewToggle} className="submitReview">Submit Review</button>
                    </div>
                </div>

                <Dialog
                    aria-labelledby="simple-dialog-title"
                    open={open}
                    onClose={submitReviewToggle}
                >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
    
                <h3 className="reviewsHeading">REVIEWS</h3>
                {product.reviews && product.reviews[0] ? (
                    <div className="reviews">
                        {product.reviews && product.reviews.map((review) => <ReviewCard review={review} />)}
                    </div>
                ) : (<p className="noReviews">No Reviews Yet</p>
                )}
              <div className="suggestedProducts">
                <h3 className="reviewsHeading">RELATED PRODUCTS</h3>
                <div className="suggestedProductImages">
                {
                  suggestedproducts && suggestedproducts.map(suggestedproduct => 
                  (suggestedproduct._id !== product._id ? (<ProductCard product={suggestedproduct} />) : (skipThisProduct())
                  ))
                }
                </div>
              </div>
                
                
            </Fragment>
            )}
        </Fragment>
        
    )
}

export default ProductDetails;
