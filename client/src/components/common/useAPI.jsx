import React, {useState, useEffect} from 'react';
import axios from 'axios';
import ToastR from './Toast';
import { routeCheck, upperFirst } from '../../Helper';
import $ from 'jquery';
import { AuthProvider } from '../../AuthContext';

import { toast } from "react-toastify";
import { token, host } from './constant';

const useAPI = (url, method = "get", sendData = null) => {
    const [response, setData] = useState(null);
    const [error, setError] = useState(null);
    const [cururl, setCurUrl] = useState('');
    
    const [isLoading, setLoading] = useState(true);
    
    const apiInstance = axios.create({
        baseURL: host,
        timeout: false,
        headers: {Authorization: `Bearer: ${token}`}
    });
    
    const handleUrl = async (url, method, sendData) => { 
        $('button[type="submit"] svg').removeClass('d-none');

        setData(null);
        setError(null);
        setLoading(true);
        
        let getToken = localStorage.getItem('token');
        if(typeof getToken != 'undefined' && getToken != '' && getToken != null){
            sendData.token = getToken;
        }

        if(typeof url !== undefined){
            try{
                setTimeout(async function () {
                    await apiInstance.request({
                    method: method,
                    url: url,
                    data: sendData
                }).then((data) => {
                    $('button[type="submit"]').prop('disabled',false);
                    $('button[type="submit"] svg').addClass('d-none');
                    setData(data.data);
                }).catch((error)=>{
                    $('button[type="submit"] svg').addClass('d-none');
                    setError(error);
                });
                }, 400);
            }
            catch(error){
                $('button[type="submit"] svg').addClass('d-none');
                setError(error);
            }
            finally{
                setLoading(false);
                $('button[type="submit"]').prop('disabled',false);
            }
        }
        setCurUrl(url);
    }
    var toastR;
    useEffect(() => {
        if(error !== null){
            if(error.message.length > 0){
                toastR = <AuthProvider><ToastR type='error' headText='Oops!' bodyText={error.message} /></AuthProvider>;
                
                toast(toastR,{ 
                    autoClose: 5000 
                });
            }
        } else {
            if(response !== null){ 
                if(response.status === 200){
                    
                    /* for login and logout */
                    if(typeof response.token != 'undefined' && response.token != '' && response.token != null){
                        localStorage.setItem('token',response.token);
                    }

                    let getToken = localStorage.getItem('token'); console.log(getToken);
                    if(typeof getToken != 'undefined' && typeof response.logout != 'undefined' && response.logout == 1){
                        localStorage.removeItem('token');
                    }
                    /* for login and logout */
                    
                    if(typeof response.loggedin == 'undefined' && response.loggedin == null && (routeCheck() == 'login' || routeCheck() == 'register')){
                        if(typeof response.title != undefined && response.title !== ''){
                            toastR = <ToastR type={response.type} headText={response.title} bodyText={response.msg} />;
                        } else {
                            toastR = <ToastR type={response.type} headText={upperFirst(response.type)} bodyText={response.msg} />;
                        }
                        
                        if(cururl != '/checkloggedin'){
                            toast(toastR, {
                                autoClose: 3000,
                                pauseOnHover: false,
                                onClose: () => {
                                    setTimeout(() => {
                                        window.location.href = '/';
                                    },3000);
                                }
                              });
                        }
                        
                    } else {
                        if(typeof response.title != undefined && response.title !== ''){
                            toastR = <AuthProvider><ToastR type={response.type} headText={response.title} bodyText={response.msg} /></AuthProvider>;
                        } else {
                            toastR = <AuthProvider><ToastR type={response.type} headText={upperFirst(response.type)} bodyText={response.msg} /></AuthProvider>;
                        }
                        
                        if(cururl != '/checkloggedin'){
                            toast(toastR,{ 
                                autoClose: 5000 
                            });
                        }
                        
                    }
                    
                } else {
                    toastR = <AuthProvider><ToastR type={response.type} bodyText={response.msg} /></AuthProvider>;
                    if(cururl != '/checkloggedin'){
                        toast(toastR,{ 
                            autoClose: 5000 
                        });
                    }
                    
                    if(response?.errors){ 
                        response.errors.forEach((item) => { 
                            toastR = <AuthProvider><ToastR type="error" bodyText={item.message} /></AuthProvider>;
                            toast(toastR,{ 
                                autoClose: 5000 
                            });
                        });
                    }
                }
            }
        }
    }, [error, response]);

    return {response, error, isLoading, execute : handleUrl};
}

export default useAPI;