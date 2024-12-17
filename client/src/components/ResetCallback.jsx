import {useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAPI from './common/useAPI';

const ResetCallback = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const {response, error, isLoading, execute} = useAPI();
    
    useEffect(()=>{
        execute('/reset-update', 'post', {email: email});
    });
    

    useEffect(()=>{
        if(error !== null){
            if(error.message.length > 0){
                
            }
        } else {
                if(response !== null && response.status === 200){
                    navigate('/profile');
                } else {
                    
                }
        }
    },[error, response]);
};

export default ResetCallback;
