import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';

import Trumbowyg from 'react-trumbowyg';
import 'trumbowyg/dist/plugins/colors/trumbowyg.colors.min.js';
import 'react-trumbowyg/dist/trumbowyg.min.css'
import 'trumbowyg/dist/plugins/colors/ui/trumbowyg.colors.min.css';

import 'trumbowyg/dist/plugins/base64/trumbowyg.base64.min.js';
import 'trumbowyg/dist/plugins/cleanpaste/trumbowyg.cleanpaste.min.js';

import {BsExclamationTriangle} from 'react-icons/bs';

import {upperFirst} from '../../Helper';

const TEditorComp = (props) => {
    const setValue = props.setValue;
    
    const [id, setIdName] = useState('trumbowyg_id');
    const [required, setRequired] = useState(false);
    const [content, setContent] = useState('');
    const [validatethis, setValidation] = useState(false);
    
    const[Renderid, setRenderid] = useState(false);
    useEffect(()=>{
      if(typeof props.required != 'undefined' && props.required == true){
        setRequired(true);
      }
      if(typeof props.id != 'undefined' && props.id != '' && props.id != null){
        setIdName(props.id);
      }
      if(typeof props.value != 'undefined' && props.value != '' && props.value != null){
        setContent(props.value);
      }

      setRenderid(true);
    },[props, id, required]);
    

    let valCheck = '';
    const myInputRef = useRef(null);
    const changeInEditor = () => {
      let editorValue = $(`#${id}`).html(); 
      setValue(`${id}`,editorValue);
      $(`textarea[name="${id}"]`).val(editorValue.toString());
      $(`textarea[name="${id}"]`).html(editorValue.toString());
      
      
      valCheck = $(`textarea[name="${id}"]`).val();
      var parentElement = $(`textarea[name="${id}"]`).parent();
      if(valCheck == '' && required){
        parentElement.addClass('invalid');
        setValidation(true);
      } else {
        parentElement.removeClass('invalid');
        setValidation(false);
      }
      console.log('change->',valCheck);
    }

    function validateAndSubmit() {
      // Get the content from the Trumbowyg editor
      var content = $(`textarea[name="${id}"]`).val();
      
      if (content.trim() === '') {
          return true;
      } else {
          return false;
      }
    }
    
    $(function(){
      if(Renderid){
        let editorValue = $(`#${id}`).html(); 
        setValue(`${id}`,editorValue);

        $('button[type="submit"]').on('click', function(e){
          var parentForm = $(this).closest('form');
          var parentElement = $(`textarea[name="${id}"]`).parent();
          if(parentForm.length > 0 && validateAndSubmit() && required){
            parentElement.addClass('invalid');
            setValidation(true);
            e.preventDefault();
          } else {
            parentElement.removeClass('invalid');
            setValidation(false);
          }
        });
      }
    });
    
    return (
      <>
      {
        Renderid ? 
            <div className='mb-3'>
              <label className="form-label" htmlFor={id}>{upperFirst(id)}</label>
              <Trumbowyg id={id}
                buttons={ [ 
                  ['strong', 'em', 'br', 'h1', 'h2', 'h3', 'h4'],
                    ['undo', 'redo'], // Only supported in Blink browsers
                    ['formatting'],
                    ['strong', 'em', 'del'],
                    ['superscript', 'subscript'],
                    ['link'],

                    ['foreColor', 'backColor'],
                    ['base64'],
                    ['insertImage'],
                    ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                    ['unorderedList', 'orderedList'],
                    ['horizontalRule'],
                    ['removeformat'],

                    ['viewHTML'],
                    ['fullscreen']
                ] }
                
                autogrow={true} 
                imageWidthModalEdit={true} 
                minimalLinks={true} 
                linkTargets={['_blank', '_self']} 

                data={content}
                placeholder='Type your text!' 
                onChange={changeInEditor}
                ref={myInputRef} />

                {validatethis && <p className='error-text text-danger me-1'>
                <BsExclamationTriangle className='me-1' /> This field is required</p>}
            </div>
          : ''
      }
      </>
    );
};

export default TEditorComp;
