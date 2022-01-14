import React, { Fragment, useEffect, useState } from "react";
import { CgMouse } from "react-icons/all";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import StoryCard from "./StoryCard";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { getStory } from "../../actions/storyAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import axios from "axios";

const Home = () => {

  const alert=useAlert();

  const dispatch = useDispatch();
  const { loading, error, products } = useSelector(state=>state.products);
  const { stories } = useSelector(state=>state.stories);

  const [featuredProducts, setFeaturedProducts] = useState([]);


  const getFeaturedProducts = () => {
    axios.get("/api/v1/products/featured")
    .then((response) => {
      const products = response.data.result;
      console.log(products);
      setFeaturedProducts(products);
    })
    .catch((error) => {console.log(error)})
  };
  

  useEffect(() => {

    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }
    getFeaturedProducts();
    dispatch(getProduct());
    dispatch(getStory());
    window.scrollTo(0, 0);
  }, [dispatch, error, alert]);

    return (
        <Fragment>

          {loading ? (<Loader />) : (
            <Fragment>

            <MetaData title="SHOPPERZZ" />
              <div className="banner">
                  <p>Welcome to Shopperzz</p>
                  <h1>FIND AMAZING PRODUCTS BELOW</h1>
      
                  <a href="#container">
                    <button>
                      Scroll <CgMouse />
                    </button>
                  </a>
              </div>
  
              <h2 className="homeHeading">Stories from Top Brands</h2>

              <div className="stories">
                
                {stories && stories.map(story => (
                  <StoryCard story={story} />
                ))}

              </div>

              <h2 className="homeHeading">Featured Products</h2>
  
              <div className="container" id="container">
                
                {products && products.map(product => (
                  <ProductCard product={product} />
                ))}
  
              </div>
  
           </Fragment>
          )}
        </Fragment>
      );
};


export default Home;