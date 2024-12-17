import React from 'react';
import PageData from './common/PageData';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

const usersList=()=>{
    window.location.href = 'users-list';
}

class Home extends React.Component{
    render(){
        return(
            <div>
                <PageData title='Home' description='this is a home page' />
                <Container>
                    <Row>
                        <Button variant="primary col-12 col-sm-3 mb-2 me-2" onClick={usersList} >Users</Button>
                    </Row>
                </Container>
                
            </div>
        );
    }
}

export default Home;