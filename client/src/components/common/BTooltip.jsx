import React, {useEffect, useState} from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const BTooltip = React.forwardRef((props , ref) => {
    // Your component logic here
    const [bgcolor, setBgColor] = useState('');
    const [tcolor, setTColor] = useState('');
    
    useEffect(()=>{
      if(props.bg != ''){
        setBgColor(props.bg);
      }
      if(props.color != ''){
        setTColor(props.color);
      }
    },[bgcolor]);
    
  
    return (
      <>
      { bgcolor != '' ?
      <style jsx='true'>
        {`
          .tooltip{
            z-index: 19999;
          }

          .bs-tooltip-bottom .tooltip-arrow::before, .bs-tooltip-auto[data-popper-placement^=bottom] .tooltip-arrow::before{
            border-bottom-color: ${bgcolor} !important;
          }
          .tooltip-inner{
            color: ${tcolor};
            background-color: ${bgcolor};
          }
        `}
      </style> : ''
      }
      <OverlayTrigger placement={props.place} overlay={<Tooltip className={props.className} ref={ref} id={props.id}>{props.title}</Tooltip>}>
        <span >{props.children}</span>
      </OverlayTrigger>
      </>
    );
});

export default BTooltip;