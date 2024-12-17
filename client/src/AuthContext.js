import React, { createContext, useState, useEffect } from 'react';
import useAPI from './components/common/useAPI';
import { routeCheck } from './Helper';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { response, error, execute } = useAPI();

  const checkAuthentication = async () => {
    const getToken = await localStorage.getItem('token');

    if (!getToken && routeCheck() != 'login' && routeCheck() != 'register') {
      handleLogout();
    }

    /* execute('/checkloggedin', 'post', { token: getToken }); */
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkAuthentication();
    }, 1 * 60 * 1000); // Check authentication every 5 minutes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (error !== null || (response && response.loggedin !== 1)) {
      handleLogout();
    } else if (response && response.loggedin === 1) {
      setIsLoggedIn(true);
    } else if (routeCheck() !== 'login' && routeCheck() !== 'register'){

    }
    else if(response && response.logout === 1){
      handleLogout();
    }
    else {
      
      setIsLoggedIn(false);
    }
  }, [response, error]);

  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

