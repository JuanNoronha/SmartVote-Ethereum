import { useEffect } from 'react';
import {useDispatch} from 'react-redux';
import { getUserDetails } from '../features/auth/authSlice';

const useAuth = () => {
    const dispatch = useDispatch(); 
    const token = localStorage.getItem('token');

    useEffect(() => {
        if(token) {
            const {accessToken,role} = JSON.parse(token);
            if(accessToken) {
                dispatch(getUserDetails(role));
            }
        }
    },[token]);
  
    
}

export default useAuth