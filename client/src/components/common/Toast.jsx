import React from 'react';
import Toast from 'react-bootstrap/Toast';
import { AiOutlineCheckCircle, AiOutlineInfoCircle, AiOutlineWarning } from "react-icons/ai";
import moment from 'moment';

function IconType(props){
    if(props.type.toLowerCase() === 'warning'){
        return(
            <AiOutlineWarning className='text-warning fs-4 me-2' />
        );
    } 
    else if(props.type.toLowerCase() === 'error'){
        return(
            <AiOutlineInfoCircle className='text-danger fs-4 me-2' />
        );
    }
    else if(props.type.toLowerCase() === 'success'){
        return(
            <AiOutlineCheckCircle className='text-success fs-4 me-2' />
        );
    }
    else if(props.type.toLowerCase() === 'info'){
        return(
            <AiOutlineInfoCircle className='text-info fs-4 me-2' />
        );
    }
    else if(props.type.toLowerCase() === 'image'){
        return(
            <img src={props.imgLocation} className="rounded me-2" alt="icon-img" />
        );
    }
}

function timeAgo(time){
   return moment(time ? new Date(time) : new Date()).fromNow();
}

var variant, text_color = '';

const ToastR = (props) => {
    if(typeof props === undefined){
        variant = 'danger';
        props.type = 'Server Error';
        props.bodyText = 'something went wrong on server!';
    } else {
        if(props.type.toLowerCase() === 'error'){
            variant = 'danger';
            text_color = 'text-white';
        }
        else {
            text_color = 'text-white';
            variant = props.type.toLowerCase();
        }
    }
    
    return(
            <>
                <Toast variant={`${props.type}`} bg={variant}
                    style={{"zIndex" : 99}} >
                    <Toast.Header className='py-1'>
                        <IconType type={props.type} />
                        <strong className={`me-auto ${props.headText ? 'd-block' : 'd-none'
                            }`}>{props.headText}</strong>
                        <small>{timeAgo()}</small>
                    </Toast.Header>
                    <Toast.Body className={`py-2 ${text_color}`}>{props.bodyText}</Toast.Body>
                </Toast>
            </>
    );
}

export default ToastR;