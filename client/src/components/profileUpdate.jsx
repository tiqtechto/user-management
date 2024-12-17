import React, {useEffect, useState, useRef} from 'react';

import { useForm } from "react-hook-form";


import Card from 'react-bootstrap/Card';
import InputGroup  from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { BsExclamationTriangle, BsCheckCircleFill, BsFillXCircleFill } from 'react-icons/bs';
import BTooltip from './common/BTooltip';
import PasswordField from './PasswordField';
import ProfilePic from './common/profilePic';
import SubmitBtn from './common/SubmitBtn';
import Button  from "react-bootstrap/Button";
import Loader from './common/loader';

import { isObjEmpty } from '../Helper';
import useAPI from './common/useAPI';
import useFetchData from './common/useFetchData';
import { useLocation } from "react-router-dom";


const ProfileUpdate = (props) => {
    const location = useLocation();
    const { email } = location.state || {};
    let [btnDisable, setBTNDisable] = useState(false);
    let [resetStatus, setResetStatus] = useState(false);

    const {response, error, isLoading, execute} = useAPI();

    const onSubmitDetail = (data) => {
        if(isObjEmpty(errors)){
            setBTNDisable(true);
            execute('/profile-update', 'post', data);
        } else {
            setBTNDisable(false);
        }

        if(isLoading){
            return(<Loader/>);
        }
    }

    const onSubmitPassword = (data) => {
        if(isObjEmpty(errors)){
            setBTNDisable(true);
            execute('/update-password', 'post', data);
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
                    if(email){
                        executef('/get-profile-data', 'post', {email: email});
                    } else {
                        executef('/get-profile-data');
                    }
                    setBTNDisable(true);
                } else {
                    setBTNDisable(false);
                }
            }
        }
    },[error, response]);

    /* get user data */
    const [userData, setUserData] = useState({firstName: '', lastName: '', email: '', verified: '', image:''});
    const values = userData;
    const {register, watch, getValues, setValue, formState: { errors }, handleSubmit } = useForm({mode: 'all', values});
    const {responsef, errorf, isLoadingf, executef} = useFetchData();
    
        useEffect(()=>{
            if(email){
                executef('/get-profile-data', 'post', {email: email});
            } else {
                executef('/get-profile-data');
            }
            
            
        },[]);
    
        useEffect(()=>{
            
            if(errorf !== null){
                if(errorf.message.length > 0){
                    
                }
            } else {
                    if(responsef !== null && responsef.status === 200){
                        setUserData({firstName: responsef.data?.firstName, lastName: responsef.data?.lastName, email: responsef.data?.email, verified: responsef.data?.verified, image: responsef.data?.image});
                        console.log('check==>',responsef.data);
                        if(responsef.data.resetPassword == 1){
                            setResetStatus(true);
                        } else {
                            setResetStatus(false);
                        }
                    }
            }  
        },[errorf, responsef]);
    /* get user data */

    /* send update password request */
    const passRequest = () => {
        let data = {
            token : localStorage.getItem('token'),
            domain : window.location.host
        }
        execute('/reset-request', 'post', data);
    }
    /* send update password request */

    const iconRef = useRef();
    return(
        <div className="row">
            <div className="col-12 col-md-4">
                <div className="profile-section mb-2 mb-md-0">
                    <Card>
                        <Card.Body className='d-flex flex-column align-items-center justify-content-center'>
                            <ProfilePic name='file' width='w-32' height='h-32' image={userData.image} regex={/image\/(png|jpeg|jpg)/} size='1' required='false' message='File type should be PNG, JPEG, or JPG' />

                            <small className='fs-6 fw-bold text-secondary'>{userData.firstName} {userData.lastName}</small>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <div className="col-12 col-md-8">
                <Card>
                    <Card.Body>
                    <Form className='mb-4' onSubmit={handleSubmit(onSubmitDetail)}>
                        <div className='d-block d-md-flex justify-content-between align-items-baseline'>
                            <Form.Group className="w-100 mb-2 mb-md-3 me-0 me-md-2" controlId="firstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control className={`rounded-pill bg-gray-100 border-primary-subtle
                                    ${errors.firstName ? 'invalid' : '' }`} type="text"
                                    {...register('firstName',{pattern: /^([a-zA-Z',.-]+( [a-zA-Z',.-]+)*)/,  minLength: 3, maxLength: 50, required: true })} defaultValue={userData.firstName} placeholder="Vidhya" />

                                {errors?.firstName?.type === "required" && <p className='error-text text-danger me-1'>
                                    <BsExclamationTriangle className='me-1' /> This field is required!</p>}
                                {errors?.firstName?.type === "pattern" && (
                                <p className='error-text text-danger me-1'>
                                    <BsExclamationTriangle className='me-1' /> First name is not valid!</p>
                                )}

                                {errors?.firstName?.type === "maxLength" && <p className='error-text text-danger me-1'>
                                    <BsExclamationTriangle className='me-1' /> First name is too large!</p>}
                                {errors?.firstName?.type === "minLength" && <p className='error-text text-danger me-1'>
                                    <BsExclamationTriangle className='me-1' /> First name is too short!</p>}
                            </Form.Group>

                            <Form.Group className="w-100 mb-2 mb-md-3" controlId="lastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control className={`rounded-pill bg-gray-100 border-primary-subtle
                                    ${errors.lastName ? 'invalid' : '' }`} type="text"
                                    {...register('lastName',{pattern: /^([a-zA-Z',.-]+( [a-zA-Z',.-]+)*)/,  minLength: 3, maxLength: 50, required: true })} defaultValue={userData.lastName} placeholder="Guru" />

                                {errors?.lastName?.type === "pattern" && (
                                <p className='error-text text-danger me-1'>
                                    <BsExclamationTriangle className='me-1' /> Last name is not valid!</p>
                                )}

                                {errors?.lastName?.type === "maxLength" && <p className='error-text text-danger me-1'>
                                    <BsExclamationTriangle className='me-1' /> Last name is too large!</p>}
                                {errors?.lastName?.type === "minLength" && <p className='error-text text-danger me-1'>
                                    <BsExclamationTriangle className='me-1' /> Last name is too short!</p>}
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-2 mb-md-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <InputGroup>
                            <Form.Control className={`rounded-start-pill bg-gray-100 border-primary-subtle border-end-0 ${errors?.email
                                ? 'invalid' : '' }`} type="email" {...register('email',
                                {pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, required: true})} defaultValue={userData.email}
                                placeholder="name@example.com" />

                                <InputGroup.Text className={`rounded-end-pill bg-gray-100 border-primary-subtle border-start-0`}>
                                    {userData.verified == 1 ? (
                                        <BTooltip bg='' color='' className='' place='top' id='successTip' title='Verified' ref={iconRef}>
                                            <BsCheckCircleFill className='text-success' />
                                        </BTooltip>
                                        ) : (
                                        <BTooltip className='' place='top' id='errorTip' title='Not Verified' ref={iconRef}>
                                            <BsFillXCircleFill className='text-danger' />
                                        </BTooltip>
                                    )}
                                </InputGroup.Text>
                            </InputGroup>

                            {errors?.email?.type === "required" && <p className='error-text text-danger me-1'>
                                <BsExclamationTriangle className='me-1' /> This field is required</p>}
                            {errors?.email?.type === "pattern" && (
                            <p className='error-text text-danger me-1'>
                                <BsExclamationTriangle className='me-1' /> Email is not valid</p>
                            )}
                        </Form.Group>

                            <SubmitBtn className='ms-auto rounded-pill px-3' text='Update Profile' isDisable={btnDisable} />
                        </Form>

                        {/* password request */}
                        { resetStatus == false ? 
                        ( <Button className="ms-auto rounded-pill px-3 text-uppercase d-flex align-items-center justify-content-center" onClick={() => passRequest()} >
                            Reset Password Request
                        </Button> ) 
                        : 
                        (<Form onSubmit={handleSubmit(onSubmitPassword)}>
                            <Form.Group className="mb-2 mb-md-3" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <InputGroup>
                                    <PasswordField required={false} fname="password" register={register} setValue={setValue}
                                        errors={errors} disabled={false} />
                                </InputGroup>
                                {errors?.password?.type === "pattern" && (
                                <p className='error-text text-danger me-1'>
                                    <BsExclamationTriangle className='me-1' /> Password requirement of at least one symbol
                                    and at least one numeric value!</p>
                                )}
                                {errors?.password?.type === "maxLength" && <p className='error-text text-danger me-1'>
                                    <BsExclamationTriangle className='me-1' /> Password is too large!</p>}
                                {errors?.password?.type === "minLength" && <p className='error-text text-danger me-1'>
                                    <BsExclamationTriangle className='me-1' /> Password is too short!</p>}
                            </Form.Group>

                            <Form.Group className="mb-2 mb-md-3" controlId="repassword">
                                <Form.Label>Repeat Password</Form.Label>
                                <InputGroup>
                                    <PasswordField required={false} fname="repassword" register={register} setValue={setValue}
                                        errors={errors} disabled={false} />
                                </InputGroup>

                                {(() => {
                                if(errors?.repassword?.type === "maxLength"){
                                return(<p className='error-text text-danger me-1'>
                                    <BsExclamationTriangle className='me-1' /> RePassword is too large!</p>);
                                }
                                else if(errors?.repassword?.type === "minLength"){
                                return(<p className='error-text text-danger me-1'>
                                    <BsExclamationTriangle className='me-1' /> RePassword is too short!</p>);
                                }
                                else if(getValues('password') !== '' && getValues('repassword') !== '' &&
                                getValues('password') !== getValues('repassword')){
                                return(<p className='error-text text-danger me-1'>
                                    <BsExclamationTriangle className='me-1' /> Oops! Passwords don't match. Please re-enter.
                                </p>);
                                }
                                })()}
                            </Form.Group>

                            <SubmitBtn className='ms-auto text-nowrap rounded-pill px-3' text='Update Password' isDisable={btnDisable} />
                        </Form>)
                        }
                        
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

export default ProfileUpdate;