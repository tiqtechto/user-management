import {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import jq from 'jquery';

const BModal = (props) => {
    let show = props.show;
    let setShow = props.setShow;
    let handleSubmit = null;
    
    const [showCloseBtn, setshowCloseBtn] = useState(true);
    const [showSubmitBtn, setshowSubmitBtn] = useState(true);

    let btnName = 'Submit';
    let btnTheme = 'primary';

    useEffect(()=>{
        if(props.show == true){
            setShow(true);
        } else {
            setShow(false);
        }
        
        if(typeof props.btnName != 'undefined' && props.btnName != '' && props.btnName != null){
            btnName = props.btnName;
        }

        if(typeof props.btnTheme != 'undefined' && props.btnTheme != '' && props.btnTheme != null){
            btnTheme = props.btnTheme;
        }

        if(typeof props.showCloseBtn != 'undefined' && props.showCloseBtn != '' && props.showCloseBtn != null){
            setshowCloseBtn(props.showCloseBtn);
        }

        if(typeof props.showSubmitBtn != 'undefined' && props.showSubmitBtn != null){
            setshowSubmitBtn(props.showSubmitBtn); 
        }

        if(typeof props.handleSubmit != 'undefined' && props.handleSubmit != '' && props.handleSubmit != null){
            handleSubmit = props.handleSubmit;
        }
    },[props]);
    
    const handleClose = () =>{
        setShow(false);
    };
    const handleShow = () => {
        setShow(true);
    };

    return(
        <>
            <Modal scrollable={true} show={show} onHide={handleClose} centered >
                <Modal.Header className='p-2 border-0' closeButton>
                    <Modal.Title className='border-bottom border-primary lh-sm fs-5 fw-bold'>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.children}</Modal.Body>
                
                <Modal.Footer className={`border-0 p-1 ${showCloseBtn && showSubmitBtn ? 'd-block' : 'd-none'} `} >
                    <Button className={`${showCloseBtn ? 'd-block' : 'd-none'} text-white py-0 px-2 fw-lighter`} variant="danger" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant={btnTheme} className={`${showSubmitBtn ? 'd-block' : 'd-none'} py-0 px-2`} onClick={handleSubmit}>
                        {btnName}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

};

export default BModal;
