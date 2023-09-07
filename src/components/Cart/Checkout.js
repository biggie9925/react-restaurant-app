import { useRef, useState } from 'react'
import classes from './Checkout.module.css';

const isEmpty = value => value.trim() === '';
const isFourChars = value => value.trim().length !== 4

const Checkout = (props) => {

    const [formInputsValidity, setFormInputsValidity] = useState ({
        name: true,
        street: true,
        city: true,
        postCode: true,
    })

    const nameInputRef = useRef()
    const streetInputRef = useRef()
    const postCodeInputRef = useRef()
    const cityInputRef = useRef()

    const confirmHandler = (event) => {
        event.preventDefault();

        const enteredName = nameInputRef.current.value;
        const enteredStreet = streetInputRef.current.value;
        const enteredPostCode = postCodeInputRef.current.value;
        const enteredCity = cityInputRef.current.value;

        const enteredNameIsValid = !isEmpty(enteredName);
        const enteredStreetIsValid = !isEmpty(enteredStreet);
        const enteredPostCodeIsValid = !isFourChars(enteredPostCode);
        const enteredCityIsValid = !isEmpty(enteredCity);

        setFormInputsValidity({
            name: enteredNameIsValid,
            street: enteredStreetIsValid,
            postCode: enteredPostCodeIsValid,
            city: enteredCityIsValid,
        })

        const formIsValid =
            enteredNameIsValid &&
            enteredStreetIsValid &&
            enteredPostCodeIsValid &&
            enteredCityIsValid;

        if (!formIsValid) {
            //submit the cart data
            return;
        }

        //submit cart data
        props.onConfirm({
            name: enteredName,
            street: enteredStreet,
            city: enteredCity,
            postCode: enteredPostCode,
        })

    };

    const nameControlClasses = `${classes.control} ${formInputsValidity.name ? '' : classes.invalid}`
    const streetControlClasses = `${classes.control} ${formInputsValidity.street ? '' : classes.invalid}`
    const postCodeControlClasses = `${classes.control} ${formInputsValidity.postCode ? '' : classes.invalid}`
    const cityControlClasses = `${classes.control} ${formInputsValidity.city ? '' : classes.invalid}`

    return (
        <form className={classes.form} onSubmit={confirmHandler}>
            <div className={nameControlClasses}>
                <label htmlFor='name'>Your Name</label>
                <input type='text' id='name' ref={nameInputRef} />
                {!formInputsValidity.name && <p>Please enter a valid name.</p>}
            </div>
            <div className={streetControlClasses}>
                <label htmlFor='street'>Street</label>
                <input type='text' id='street' ref={streetInputRef} />
                {!formInputsValidity.street && <p>Please enter a valid street.</p>}
            </div>
            <div className={postCodeControlClasses}>
                <label htmlFor='postCode'>Post Code</label>
                <input type='text' id='postCode' ref={postCodeInputRef} />
                {!formInputsValidity.postCode && <p>Please enter a valid post code (4 characters).</p>}
            </div>
            <div className={cityControlClasses}>
                <label htmlFor='city'>City</label>
                <input type='text' id='city' ref={cityInputRef} />
                {!formInputsValidity.city && <p>Please enter a valid city.</p>}
            </div>
            <div className={classes.actions}>
                <button type='button' onClick={props.onCancel}>
                    Cancel
                </button>
                <button className={classes.submit}>Confirm</button>
            </div>
        </form>
    );
};

export default Checkout;