import {useState, useEffect} from 'react';
import InputGroup  from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { BsExclamationTriangle } from "react-icons/bs";

import { DatePicker } from '@y0c/react-datepicker';
import '@y0c/react-datepicker/assets/styles/calendar.scss';
import moment from 'moment';
import jq from 'jquery';

const TimePicker = (props) => {
    const [required, setRequired] = useState(false);
    const [validatethis, setValidation] = useState(false);
    
    const [timeVal, setTimeVal] = useState();

    let value = props.value;
    const [id, setId] = useState('timepicker_id');
    const [label, setLabel] = useState('Time Picker');
    const [maxTimeErr, setMaxTimeErr] = useState();
    const [minTimeErr, setMinTimeErr] = useState();

    const[Renderid, setRenderid] = useState(false);

    jq('.picker-input__icon').html();
    useEffect(()=>{
        if(typeof props.maxTime != 'undefined' && props.maxTime != null && props.maxTime != ''){
            let starttime = moment(props.maxTime, 'h:mm A').valueOf();
            let maxTime = moment(value, 'h:mm A').valueOf();
            if(starttime <= maxTime){
                setMaxTimeErr(false);
            } else {
                setMaxTimeErr(true);
                return;
            }
        }
    
        if(typeof props.minTime != 'undefined' && props.minTime != null && props.minTime != ''){
            let starttime = moment(props.minTime, 'h:mm A').valueOf();
            let minTime = moment(value, 'h:mm A').valueOf();
            if(starttime > minTime){
                setMinTimeErr(false);
            } else {
                setMinTimeErr(true);
                return;
            }
        }
    
        if(typeof props.required != 'undefined' && props.required == true){
            setRequired(true);
        }
    
        if(typeof props.id != 'undefined' && props.id != '' && props.id != null){
            setId(props.id);
        }
        if(typeof props.label != 'undefined' && props.label != '' && props.label != null){
            setLabel(props.label);
        }
        if(typeof props.initialDate != 'undefined' && props.initialDate != '' && props.initialDate != null){
            let newDate = moment(new Date()).format('YYYY-MM-DD');
            let newTime = moment(props.initialDate).format('h:mm A');
            setTimeVal(moment(newDate+' '+props.initialDate, 'YYYY-MM-DD h:mm A'));
            /* setValue(`${id}`,defaultValue); */
        }
        
        if(jq(`input[name="${id}"]`).val() == '' && required){
            jq(`input[name="${id}"]`).addClass('invalid');
            setValidation(true);
        } else {
            jq(`input[name="${id}"]`).removeClass('invalid');
            setValidation(false);
        }

        setRenderid(true);
    },[props]);

    jq(function(){
        if(Renderid){
            jq('.picker-input__icon').html('<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"></path><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"></path></svg>');
            jq(`#${id} input`).attr('name', id);
            jq(`#${id} input`).attr('id', id);

            function validateAndSubmit() {
                // Get the content from the Trumbowyg editor
                var content = jq(`input[name="${id}"]`).val();
                
                if (content.trim() === '') {
                    return true;
                } else {
                    return false;
                }
            }

            jq('button[type="submit"]').on('click', function(e){ 
                var parentForm = jq(this).closest('form');
                if(parentForm.length > 0 && validateAndSubmit() && required){
                jq(`input[name="${id}"]`).addClass('invalid');
                setValidation(true);
                e.preventDefault();
                } else {
                jq(`input[name="${id}"]`).removeClass('invalid');
                setValidation(false);
                }
            });
        }
    });

    return(
        <>
        <style jsx='true'>
            {`
                #endtime .picker__container{
                    position: sticky !important;
                }

                .picker-input__text{
                    display: block;
                    width: 100%;
                    padding: 0.375rem 0.75rem;
                    font-size: 1rem;
                    font-weight: 400;
                    line-height: 1.5;
                    color: var(--bs-body-color);
                    appearance: none;
                    background-color: var(--bs-body-bg);
                    background-clip: padding-box;
                    border: var(--bs-border-width) solid;
                    border-radius: var(--bs-border-radius);
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

                    border-color: var(--bs-primary-border-subtle);
                    border-radius: var(--bs-border-radius-pill) !important;
                }
            `}
        </style>
        
        {Renderid ? 
            <Form.Group id={id} className="mb-2 mb-md-3" controlId={`${id}`}>
                <Form.Label>{label}</Form.Label> <br/>
                    <DatePicker initialDate={timeVal} clear showTimeOnly showDefaultIcon dateFormat='h:mm A' onChange={props.onChange} />

                {validatethis && <p className='error-text text-danger me-1'>
                    <BsExclamationTriangle className='me-1' /> This field is required!</p>}
                {maxTimeErr && <p className='error-text text-danger me-1'>
                    <BsExclamationTriangle className='me-1' /> Max time (End Time) is smaller than (Start Time?)</p>}
                {minTimeErr && <p className='error-text text-danger me-1'>
                    <BsExclamationTriangle className='me-1' /> Max time (Start Time) is smaller than (End Time?)</p>}
            </Form.Group>
            : ''
        }
        </>
    );

}

export default TimePicker;
