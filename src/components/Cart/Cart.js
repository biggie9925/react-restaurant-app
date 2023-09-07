import React, { useContext, useState } from "react"
import classes from "./Cart.module.css"
import Modal from "../UI/Modal"
import CartItem from "./CartItem"
import CartContext from "../../store/cart-context"
import Checkout from "./Checkout"

const Cart = (props) => {

    const [isCheckout, setIsCheckout] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [httpError, setHttpError] = useState(null)
    const [didSubmit, setDidSubmit] = useState(false)
    const cartCtx = useContext(CartContext)

    const totalAmount = `$${Math.max(cartCtx.totalAmount, 0).toFixed(2)}`;
    const hasItems = cartCtx.items.length > 0;

    const cartItemRemoveHandler = (id) => {
        cartCtx.removeItem(id)
    }

    const cartItemAddHandler = (item) => {
        cartCtx.addItem({ ...item, amount: 1 })
    }

    const orderHandler = () => {
        setIsCheckout(true)
    }

    const submitOrderHandler = async (userData) => {
        setIsSubmitting(true);

        try {
            const response = await fetch('https://react-simple-http-f2e32-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json', {
                method: 'POST',
                body: JSON.stringify({
                    user: userData,
                    orderedItems: cartCtx.items,
                })
            });

            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            setIsSubmitting(false);
            setHttpError(null);
            setDidSubmit(true);
            cartCtx.clearCart();


        } catch (error) {
            setIsSubmitting(false);
            setHttpError(error.message)
        }
    };


    const cartItems = <ul className={classes["cart-items"]}>
        {cartCtx.items.map((item) =>
            <CartItem
                key={item.id}
                name={item.name}
                amount={item.amount}
                price={item.price}
                onRemove={cartItemRemoveHandler.bind(null, item.id)}
                onAdd={cartItemAddHandler.bind(null, item)}
            />)
        }
    </ul>

    const modalActions = (
        <div className={classes.actions}>
            <button className={classes["button--alt"]} onClick={props.onClose}>Close</button>
            {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}
        </div>
    )

    const cartModalContent = (
        <React.Fragment>
            {cartItems}
            < div className={classes.total} >
                <span>Total Amount:</span>
                <span>{totalAmount}</span>
            </div >
            {httpError && <p style={{ color: "red", textAlign: "center" }}>{httpError}</p>}
            {isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />}
            {!isCheckout && modalActions}
        </React.Fragment>
    );

    const isSubmittingModalContent = (
        <p style={{ color: "orange", textAlign: "center" }}>Sending order data...</p>
    )

    const didSubmitModalContent = (
        <React.Fragment>
            <div className={classes.actions}>
                <p style={{ color: "green", textAlign: "center" }}>Successfully sent the order!</p>
                <button className={classes.button} onClick={props.onClose}>Close</button>
            </div>
        </React.Fragment>

    )

    return (
        <Modal onClose={props.onClose}>
            {!isSubmitting && !didSubmit && cartModalContent}
            {isSubmitting && isSubmittingModalContent}
            {didSubmit && didSubmitModalContent}
        </Modal>
    )
}

export default Cart