import React, {useState} from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import { BiShowAlt, BiHide } from 'react-icons/bi';

function PasswordSwitch(props) {
    const [showPass, setShowPass] = useState(false);
    const HandlePassClick = () => {
    showPass ? setShowPass(false) : setShowPass(true);
    }

    const register = props.register;
    const setValue = props.setValue;
    const errors = props.errors;
    const required = props.required;

    var FieldPassError = '', FieldName = '';
    if(props.fname == 'repassword'){
        FieldPassError = typeof errors.repassword !== 'undefined' ? 'invalid' : '';
        FieldName = 'repassword';
    } else {
        FieldPassError = typeof errors.password !== 'undefined' ? 'invalid' : '';
        FieldName = 'password';
    }
    
    return(
        <>
            <Form.Control className={`rounded-start-pill bg-gray-100 border-primary-subtle border-end-0 ${FieldPassError}`} type={showPass ? "text" : "password"} {...register(FieldName, {pattern: /^(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?])(?=.*[0-9]).*$/, required: required, minLength: 6, maxLength: 60})} placeholder="Hello#123" disabled={props.disabled ? true : false} />
            <InputGroup.Text className={`rounded-end-pill bg-gray-100 border-primary-subtle border-start-0 ${FieldPassError}`} onClick={HandlePassClick}>
                {showPass ? <BiShowAlt className="fs-4" /> : <BiHide className="fs-4" />}
            </InputGroup.Text>
        </>
    );
}

const PasswordField = (props) => {

    const register = props.register;
    const setValue = props.setValue;
    const errors = props.errors;
    const fname = props.fname;
    const required = props.required;

        return(
            <PasswordSwitch required={required} fname={fname} register={register} setValue={setValue} errors={errors} disabled={props.disabled} />
        );
}

export default PasswordField;