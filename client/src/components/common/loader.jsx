import React from 'react';

class Loader extends React.Component{
    render(){
        return(
            <div className='loader'>
                <div className="loaderCircle"></div>
            </div>
        );
    }
}

export default Loader;