import React, {useEffect, useState} from 'react';
import { Helmet } from 'react-helmet';

const PageData = ({ title, description, CustomTags  }) => { 
    /* const [TagState, setTagState] = useState(<></>); */

    /* useEffect(()=>{
        if(CustomTags){
            CustomTags.map(function(tag, index){
                if(tag.type === 'meta'){
                    setTagState(<meta key={index} name={tag.name} content={tag.content} />);
                }
                if(tag.type === 'text/javascript'){
                    setTagState(<script type="text/javascript" src={tag.src}></script>);
                }
                if(tag.type === 'css'){
                    setTagState(<link key={index} rel={tag.rel} href={tag.href} />);
                }
            });
        }
    },[CustomTags]); */
    
  return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* Custom meta tags */}
      </Helmet>
  );
};

export default PageData;
