import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { publicURL, isObjEmpty, routeCheck } from '../Helper';
import { useForm } from "react-hook-form";
import Login from './Login';
import Register from './Register';
import SubmitBtn from './common/SubmitBtn';
import useAPI from './common/useAPI';

let leftMiddle_file;
const type = 'image';
if(type === 'video'){
    leftMiddle_file = 'P_Video.mp4';
    const video_type = 'video/mp4';
} else {
    leftMiddle_file = 'girl_studing.jpg';
}


const back_image = 'background.jpg';
const back_style = {
    backgroundImage : `url(${publicURL()}/images/login/${back_image})`,
    backgroundSize : 'cover',
    overflow: 'hidden'
};

const container_style = {
    height: '100vh',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center'
};

const card_style = {
    height : 'auto',
    margin: 'auto',
    width: '100%'
};

function TextChangeHeading(){
    const Etexts = [
        'Your Education Companion.', 'Where Knowledge Meets Innovation.', 'Your Personal Education Guru.'
    ]

    const [currentText, setCurrentText] = useState(Etexts[0]);

    function setRandomText() {
        const index = Math.floor(Math.random() * Etexts.length);
        let newName = Etexts[index]
        if (newName === currentText) { setRandomText() }
        else { setCurrentText(newName) }
        return
    }

    useEffect(() => {
        setTimeout(() => {
        setRandomText()
        }, 4000);
    }, [currentText])

    return (
        <div className="px-2 py-4">
        <h4 className='text-center fs-5'> 
            <img style={{width:'43px'}} src={publicURL()+'/images/login/books.gif'} alt="books" className="me-3" />     
            {currentText}
        </h4>
        </div>
    )
}

function LoginOrRegister(){
    const [showLoginOrReg, setLoginOrReg] = useState('login');
    function switchFormHandle(){
        showLoginOrReg === 'login' ? setLoginOrReg('register') : setLoginOrReg('login'); 
    }
    
    const {register, watch, getValues, setValue, formState: { errors }, handleSubmit } = useForm({mode: 'all'});

    let [btnDisable, setBTNDisable] = useState(false);
    let sendData = null, setURL;

    const {response, error, isLoading, execute} = useAPI();
    const onSubmit = (data) => {
        if(isObjEmpty(errors)){
            setBTNDisable(true);
            btnDisable = true;
            sendData = data;
            if(showLoginOrReg !== 'login'){
                setURL = '/register';
            } else {
                setURL = '/login';
            }
            execute(setURL, 'post', sendData);

        } else {
            setBTNDisable(false);
        }
        
    };
    
    useEffect(()=>{
        if(error !== null){
            if(error.message.length > 0){
                setBTNDisable(false);
            }
        } else {
            if(response !== null){
                if(response.status === 200){
                    setBTNDisable(true);
                } else {
                    setBTNDisable(false);
                }
            }
        }
    },[error, response]);
    

    return(
        <Form onSubmit={handleSubmit(onSubmit)} className='px-0 px-md-4'>
        {showLoginOrReg === 'login' ? <Login register={register} watch={watch} setValue={setValue} errors={errors} disabled={false} /> : <Register register={register} watch={watch} setValue={setValue} errors={errors} getValues={getValues} disabled={false} />}
            <div className='p-3 pt-4 d-flex justify-content-between align-items-center'>
                <SubmitBtn className='w-50 rounded-pill' text={showLoginOrReg} isDisable={btnDisable} />

                <Button variant='outline-primary'
                    className='rounded-pill text-uppercase' style={{letterSpacing: '1.1px'}}
                    onClick={switchFormHandle}>{showLoginOrReg === 'login' ? 'register' : 'login'}</Button>
            </div>
        </Form>
    );
}

const MediaLeftSide = () => { return type === 'video' ? <video playsInline loop muted autoPlay alt="video"
    src={publicURL()+'/images/login/'+leftMiddle_file} /> : <img src={publicURL()+'/images/login/'+leftMiddle_file} alt="
    girl-study" style={{width : '100%', height : '100%'}} /> };

const LoginAndRegister = () => {
    

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
        setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (windowWidth <= 576) {
        $('.videoAreaCol').fadeOut(5000, function () {
            $('.btnCeleb').css({ display: 'block' });
            $('.formArea').fadeIn(500);
        });
        }
    }, [windowWidth]);

    const handleBtnCelebClick = () => {
        $('.btnCeleb').fadeOut(0, function () {
        $(this).fadeIn(800);
        });

        if ($('.videoAreaCol').is(':visible')) {
        $('.videoAreaCol').css({ display: 'none' });
        $('.btnCeleb img').css({ transform: 'rotateZ(0deg)' });
        $('.formArea').fadeIn(500);
        } else {
        $('.videoAreaCol').fadeIn(500);
        $('.btnCeleb img').css({ transform: 'rotateZ(90deg)' });
        $('.formArea').css({ display: 'none' });
        }
    };
    
        return(
            <div style={back_style}>
                <Button onClick={handleBtnCelebClick} className="position-absolute end-0 btnCeleb rounded-start-pill" variant="white">
                    <img src={publicURL()+'/images/login/click.gif'} alt="click" className='rounded-circle' />
                </Button>

                <Container style={container_style}>
                    <Card style={card_style}>
                        <Card.Body style={{padding : '0'}}>
                            <Row>
                                <Col className="videoAreaCol d-md-flex justify-content-center" xs={12} md={5} style={{padding : '0px'}}>
                                    <div className="videoArea">
                                        <MediaLeftSide />
                                    </div>
                                </Col>
                                <Col className="formArea" xs={12} md={7}>
                                    <TextChangeHeading/>
                                    <LoginOrRegister/>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Container>

                <style jsx="true">
                {`
                  .videoArea video{
                    width: 100%;
                    height: 100%;
                  }

                  .btnCeleb{
                    display: none;
                  }

                  @media (max-width: 576px) { 
                    .btnCeleb{
                        padding-left: 10px;
                        padding-right: 20px;
                    }

                    .btnCeleb img{
                        width: 62px;
                    }

                    .formArea{
                        display: none;
                    }
                  }
                `}
                </style>
            </div>
        );
}

export default LoginAndRegister;