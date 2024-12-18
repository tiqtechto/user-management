import React, {useState, useEffect, useRef} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import useAPI from './common/useAPI';

import { Outlet } from "react-router-dom";

import { publicURL } from '../Helper';

function Header() {
    const {execute} = useAPI();
    const Logout=()=>{
        let getToken = localStorage.getItem('token');
        if(typeof getToken != 'undefined'){
            execute('/logout', 'post', {token: getToken});
            window.location.href = 'login';
        }
    }
    
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const handleDropdownClick = () => {
        setDropdownVisible(!dropdownVisible);
    };

    /* dropdown dismiss outside (close) */
    const dropdownRef = useRef(null);
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownVisible(false);
        }
      };
    
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
    /* dropdown dismiss outside (close) */

    let userImage;
    if(!userImage){
        userImage = `${publicURL()}/images/noimage.png`;
    }



    return(
        <header>
            <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
            <Container className='justify-content-between'>
                <Navbar.Brand href="/">User Management</Navbar.Brand>

                <Navbar.Collapse id="responsive-navbar-nav" className='justify-content-end'>
                <Nav className="">
                    {/* Your menu items */}
                    <Nav.Link href="/profile">Profile</Nav.Link>
                </Nav>
                </Navbar.Collapse>

                <div className='d-flex align-items-center justify-content-center'>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                
                {/* ... profile dropdown */}
                <Nav.Link onClick={handleDropdownClick} className='m-1'>
                    <div style={{width:'30px'}}>
                        <img className='w-100 rounded-circle border-light border border-2' src={userImage} alt="userImg" />
                    </div>
                </Nav.Link>
                </div>
            </Container>
            </Navbar>

            <div ref={dropdownRef}>
                <NavDropdown className='userDropDown'
                    id="collasible-nav-dropdown"
                    show={dropdownVisible}
                    align="end"
                    onSelect={() => setDropdownVisible(false)}
                >
                    {/* Dropdown menu items */}
                    <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={Logout} href="#">Logout</NavDropdown.Item>
                </NavDropdown>
            </div>
            <style jsx='true'>
            {`
                .userDropDown .dropdown-toggle:empty::after{
                    display: none !important;
                }
            `}
            </style>
        </header>
    );
}

function Footer() {
    return(
        <footer className='mt-auto'> 
        </footer>
    );
}

class LayoutMain extends React.Component{
    render(){
        return(
            <div>
                <Header/>
                    <Container className='my-3'>
                        <Outlet />
                    </Container>

                <Footer/>
            </div>
        );
        
    }
}

export default LayoutMain;