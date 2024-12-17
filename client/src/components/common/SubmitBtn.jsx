import React from 'react';
import Button from 'react-bootstrap/Button';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const SubmitBtn = (props) => { 
    return(
        <Button type='submit' variant='primary' className={`${props.className} text-uppercase d-flex align-items-center justify-content-center`} style={{letterSpacing: '1.1px'}} disabled={props.isDisable} >
            <AiOutlineLoading3Quarters  style={{width: '20px'}} className={`spinner-border border-0 me-1 ${props.isDiable === true ? 'd-block' : 'd-none'}`} />
        {props.text}</Button>
    );
}

export default SubmitBtn;