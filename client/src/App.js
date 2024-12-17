import React, { Suspense, lazy } from 'react';
import './css/App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/common/loader";
import Protected from './Protected';

const LayoutMain = lazy(() => import("./components/layoutMain"));
const LoginAndRegister = lazy(() => import("./components/loginAndRegister"));
const Home = lazy(() => import("./components/home"));
const ProfileUpdate = lazy(() => import("./components/profileUpdate"));
const UsersList = lazy(() => import("./components/UsersList"));

const NotFound = lazy(() => import("./components/common/notFount"));
const ResetCallback = lazy(() => import("./components/ResetCallback"));

function App() {
  

  return (
    
      <div className="App">
      <Suspense fallback={<Loader />}>
        <BrowserRouter>
        
        <Routes>

        <Route path="login" element={<LoginAndRegister />} />
        <Route path="*" element={<NotFound />} />
        
          <Route path="/" element={<Protected Component={LayoutMain}/>}>
            <Route index element={<Protected Component={Home}/>} />
            <Route path='profile' element={<Protected Component={ProfileUpdate}/>} />
            <Route path='users-list' element={<Protected Component={UsersList}/>} />
            <Route path="reset-callback/:email" element={<Protected Component={ResetCallback} />} />
          </Route>
          

        </Routes>
        
      </BrowserRouter>
    </Suspense>
    </div>
  );
}

export default App;
