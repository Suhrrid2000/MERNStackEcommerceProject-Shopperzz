import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import "./Cart.css";
import CartItemCard from "./CartItemCard.js";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction";
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import { Link } from "react-router-dom";

const Cart = ({ history }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (1 >= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemsFromCart(id));
  };

  const checkoutHandler = () => {
    history.push("/login?redirect=shipping");
  };

  //Checking if cash on delivery is available for all the cart items
  const [flag, setFlag] = useState(true);

  async function cashOnDeliveryAvailableForAll() {
    for(var i = 0; i<cartItems.length; i++){
      const id = cartItems[i].product;

      await axios.get(`/api/v1/product/${id}`)
      .then (function(response){
        if(!response.data.product.cod) {
          setFlag(false);
        }
      })
      .catch (function(error) {
        console.log(error);  
      })
    }
}

  useEffect(() => {
    cashOnDeliveryAvailableForAll();
  },[]);

  return (
    <Fragment>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon />

          <Typography>Oops!!<br/>No Products to show in Your Cart</Typography>
          <Link to="/products">View Products</Link>
        </div>
      ) : (
        <Fragment>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>

            {cartItems &&
              cartItems.map((item) => (
                <div className="cartContainer" key={item.product}>
                  <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                  <div className="cartInput">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.product, item.quantity)
                      }
                    >
                      -
                    </button>
                    <input type="number" value={item.quantity} readOnly />
                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.product,
                          item.quantity,
                          item.stock
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="cartSubtotal">{`₹${
                    (Math.round(item.price-(item.discount*item.price/100))) * item.quantity
                  }`}</p>
                </div>
              ))}

            <div className="cartGrossProfit">
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Gross Total</p>
                <p>{`₹${cartItems.reduce(
                  (acc, item) => acc + item.quantity * (Math.round(item.price-(item.discount*item.price/100))),
                  0
                )}`}</p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick={checkoutHandler}>Place Order</button> 
                </div>
                <br /> <br />
                <div id="noteSection">
                {!flag && cartItems.length > 1 &&
                  <p>
                    <PriorityHighIcon />Your cart contains product(s) for which <b>Cash On Delivery is not available</b>.
                    As a result you cannot avail Cash on delivery on the entire transaction. To avail cash on delivery,
                    please ensure you have only those products in your cart for which cash on delivery is available.
                    You can still go for checkout, in which case you have to pay via card.
                  </p>}
                </div>
              
              
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;