import React, {useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import Card from 'react-bootstrap/Card';
import InputGroup  from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import {BsExclamationTriangle} from 'react-icons/bs';

import TEditorComp from './common/TEditorComp';
import SubmitBtn from './common/SubmitBtn';
import Loader from './common/loader';

import { isObjEmpty } from '../Helper';
import useAPI from './common/useAPI';
import PageData from './common/PageData';

const MailTest = () => {
    
    let [btnDisable, setBTNDisable] = useState(false);

    const {response, error, isLoading, execute} = useAPI();

    const {register, watch, getValues, setValue, formState: { errors }, handleSubmit } = useForm({mode: 'all'});
    useFormPersist("mailform", { watch, setValue });

    const onSubmitData = (data) => {
        if(isObjEmpty(errors)){
            setBTNDisable(true);
            execute('/send-test-mail', 'post', data);
        } else {
            setBTNDisable(false);
        }

        if(isLoading){
            return(<Loader/>);
        }
    }

    useEffect(()=>{
        if(error !== null){
            if(error.message.length > 0){
                setBTNDisable(false);
            }
        } else {
            if(response !== null){
                if(response.status === 200){
                    setBTNDisable(true);
                } else {
                    setBTNDisable(false);
                }
            }
        }
    },[error, response]);

    return(
        <>
        <PageData
        title="Mail"
        description="This is a custom page."
        />
        
        <Card>
            <Card.Body>
                <Form className='mb-4' onSubmit={handleSubmit(onSubmitData)}>
                    <div className='d-block d-md-flex justify-content-between align-items-baseline'>
                        <Form.Group className="mb-2 mb-md-3 w-100 me-0 me-md-2" controlId="email">
                            <Form.Label>Email From</Form.Label>
                            <InputGroup>
                                <Form.Control className={`rounded-2 bg-gray-100 border-primary-subtle ${errors?.email
                                    ? 'invalid' : '' }`} type="email" {...register('emailfrom',
                                    {pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g})}
                                     placeholder="name@example.com" />
                            </InputGroup>

                            {errors?.emailfrom?.type === "required" && <p className='error-text text-danger me-1'>
                                <BsExclamationTriangle className='me-1' /> This field is required</p>}
                            {errors?.emailfrom?.type === "pattern" && (
                            <p className='error-text text-danger me-1'>
                                <BsExclamationTriangle className='me-1' /> Email is not valid</p>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-2 mb-md-3 w-100" controlId="email">
                            <Form.Label>Email To</Form.Label>
                            <InputGroup>
                                <Form.Control className={`rounded-2 bg-gray-100 border-primary-subtle ${errors?.email
                                    ? 'invalid' : '' }`} type="email" {...register('emailto',
                                    {pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, required: true})}
                                     placeholder="name@example.com" />
                            </InputGroup>

                            {errors?.emailto?.type === "required" && <p className='error-text text-danger me-1'>
                                <BsExclamationTriangle className='me-1' /> This field is required</p>}
                            {errors?.emailto?.type === "pattern" && (
                            <p className='error-text text-danger me-1'>
                                <BsExclamationTriangle className='me-1' /> Email is not valid</p>
                            )}
                        </Form.Group>
                    </div>

                    <Form.Group className='mb-2 mb-md-3' controlId="typeselect">
                        <Form.Label>Select Type</Form.Label>
                        <Form.Select className={`rounded-2 bg-gray-100 border-primary-subtle ${errors?.email
                                    ? 'invalid' : '' }`} {...register('type',
                                    {required: true})} aria-label="Default select example">
                            <option defaultValue="" >--Select--</option>
                            <option value="gmail">Gmail</option>
                            <option value="other">other</option>
                        </Form.Select>
                        {errors?.type?.type === "required" && <p className='error-text text-danger me-1'>
                                <BsExclamationTriangle className='me-1' /> This field is required</p>}
                    </Form.Group>

                    <Form.Group controlId="content">
                        <Form.Label>Content</Form.Label>
                        <TEditorComp register={register} setValue={setValue} required={true} id='body' className='' value='' />
                        
                    </Form.Group>

                    <SubmitBtn className='ms-auto text-nowrap rounded-pill px-3' text='Send' isDisable={btnDisable} />
                </Form>
            </Card.Body>
        </Card>
        </>
    );
}

export default MailTest;