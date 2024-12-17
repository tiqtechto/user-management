import React, {useState, useEffect} from 'react';
import axios from 'axios';

import ToastR from './Toast';
import { toast } from "react-toastify";

import { AuthProvider } from '../../AuthContext';
import { token, host } from './constant';

const useFetchData = (url, method = "get") => {
    const [responsef, setData] = useState(null);
    const [errorf, seterrorf] = useState(null);
    
    const [isLoadingf, setLoading] = useState(true);
    
    const apiInstance = axios.create({
        baseURL: host,
        timeout: false,
        headers: {Authorization: `Bearer: ${token}`}
    });

    const handleUrl = async (url, method = 'post', sendData = {}) => {
        setData(null);
        seterrorf(null);
        setLoading(true);
        
        let getToken = localStorage.getItem('token');
        if(typeof getToken != 'undefined' && getToken != '' && getToken != null){
            sendData.token = getToken;
        }
        if(method.toLowerCase() == 'get'){
            url = url+'/'+getToken;
        }
        if(typeof url !== undefined){
            try{
                setTimeout(async function () {
                    await apiInstance.request({
                    method: method,
                    url: url,
                    data: sendData
                }).then((data) => {
                    setData(data.data);
                }).catch((errorf)=>{
                    seterrorf(errorf);
                });
                }, 400);
            }
            catch(errorf){
                seterrorf(errorf);
            }
            finally{
                setLoading(false);
            }
        }
    }

    var toastR;
    useEffect(() => {
        if(errorf !== null){
            if(errorf.message.length > 0){
                toastR = <AuthProvider><ToastR type='errorf' headText='Oops!' bodyText={errorf.message} /></AuthProvider>;
                
                toast(toastR,{ 
                    autoClose: 5000 
                });
            }
        } else {
            if(responsef !== null){ 
                if(responsef.status === 200){
                    
                } else {
                    toastR = <AuthProvider><ToastR type={responsef.type} bodyText={responsef.msg} /></AuthProvider>;
                    
                    toast(toastR,{ 
                        autoClose: 5000 
                    });
                }
            }
        }
    }, [errorf, responsef]);

    return {responsef, errorf, isLoadingf, executef : handleUrl};
}

export default useFetchData;