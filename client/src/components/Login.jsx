import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import PasswordField from './PasswordField';

import useFormPersist from "react-hook-form-persist";
import { BsExclamationTriangle } from 'react-icons/bs';

const Login = (props) => {
    const register = props.register;
    const watch = props.watch;
    const setValue = props.setValue;
    const errors = props.errors;
    
    useFormPersist("login", { watch, setValue, exclude: ['password','repassword'] });
    
        return(
            <>
                <Form.Group className="p-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control className={`rounded-pill bg-gray-100 border-primary-subtle ${errors.email ? 'invalid' : ''}`} type="text" {...register('email',{pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, required: true, minLength: 3, maxLength: 50 })}
                            placeholder="example@user.com" disabled={props.disabled ? true : false} />

                    {errors?.email?.type === "required" && <p className='error-text text-danger me-1'>
                        <BsExclamationTriangle className='me-1' /> This field is required!</p>}
                    {errors?.email?.type === "pattern" && (
                    <p className='error-text text-danger me-1'>
                        <BsExclamationTriangle className='me-1' /> Last name is not valid!</p>
                    )}

                    {errors?.email?.type === "maxLength" && <p className='error-text text-danger me-1'>
                        <BsExclamationTriangle className='me-1' /> Last name is too large!</p>}
                    {errors?.email?.type === "minLength" && <p className='error-text text-danger me-1'>
                        <BsExclamationTriangle className='me-1' /> Last name is too short!</p>}
                </Form.Group>

                <Form.Group className="p-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                        <PasswordField required={true} fname="password" register={register} setValue={setValue} errors={errors} disabled={props.disabled} />
                    </InputGroup>

                {errors?.password?.type === "required" && <p className='error-text text-danger me-1'>
                    <BsExclamationTriangle className='me-1' /> This field is required</p>}
                {errors?.password?.type === "pattern" && (
                    <p className='error-text text-danger me-1'><BsExclamationTriangle className='me-1' /> Password requirement of at least one symbol and at least one numeric value!</p>
                    )}
                {errors?.password?.type === "maxLength" && <p className='error-text text-danger me-1'>
                    <BsExclamationTriangle className='me-1' /> Password is too large!</p>}
                {errors?.password?.type === "minLength" && <p className='error-text text-danger me-1'>
                    <BsExclamationTriangle className='me-1' /> Password is too short!</p>}
                </Form.Group>
            </>
        );
}

export default Login;