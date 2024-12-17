import React, {useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { AuthProvider } from './AuthContext';

function Protected(props){
    const {Component} = props;
    const navigate = useNavigate();
    const  isLoggedIn  = localStorage.getItem('token');

    useEffect(()=>{
        if(isLoggedIn == null || isLoggedIn == ''){
            navigate('login');
        }
    },[]);
    

    return(
        <AuthProvider>
        <Component/>
        </AuthProvider>
    );
}

export default Protected;