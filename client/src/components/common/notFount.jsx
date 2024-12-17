import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { publicURL } from '../../Helper';

const NotFound = () => {
    const navigate = useNavigate(); 
    const routeChange = (path) =>{
        navigate(path);
    }

        return(
            <div>
                <style jsx="true">
                {`
                    .page{ 
                        padding:40px 0; background:#fff;
                    }
            
                    .offline_bg img{
                        height: 46vh;
                    }
            
            
                    .offline_bg h1{
                        font-size: 50px;
                        margin: 0;
                    }
            
                    .offline_bg h3{
                        font-size: 50px;
                        margin: 0;
                    }
            
                    .link{
                    color: #fff!important;
                    padding: 10px 20px;
                    background: #39ac31;
                    margin: 20px 0;
                    display: inline-block;}
                    .contant_box{ margin-top:-50px;}
                `}
                </style>

                <section className="page">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 d-flex align-items-center justify-content-center">
                                <div className="col-sm-10 col-sm-offset-1  text-center">
                                    <div className="offline_bg">
                                        <h1 className="text-center ">404!</h1>
                                        <img src={`${publicURL()}/images/offline-bg.svg`} alt="404" />
                                    </div>

                                    <div className="contant_box mt-auto">
                                        <h3 className="h2">
                                            404 - Page Not Found
                                        </h3>

                                        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>

                                        <Button variant='primary' className='rounded-pill' onClick={() => routeChange('/')} >Home</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
}

export default NotFound;