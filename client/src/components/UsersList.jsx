import { useState, useEffect, lazy } from 'react';
import { useNavigate } from "react-router-dom";
import useFetchData from './common/useFetchData';
import useAPI from './common/useAPI';
import { BsPencil, BsTrash } from "react-icons/bs";

import TTable from "./common/TTable";
import Button  from "react-bootstrap/Button";
import { createRoot } from "react-dom/client";

const UsersList = () => {
    const navigate = useNavigate();
    const {responsef, errorf, isLoadingf, executef} = useFetchData();
    const {execute} = useAPI();
    const [eventData, setEventData] = useState([]);
    const [renderid, setRenderIt] = useState(false);
    var columns = []; 

    useEffect(()=>{
        executef('/get-users','get');
    },[]); 

    const editAction = (email) => { 
        navigate("/profile", {
            state: { email: email },
        });
    }

    const deleteAction = (email) => {
        execute('/delete-user', 'post', {email: email});
    }

    const actionsFormater = (cell, formatterParams, onRendered) => { 
        let data = cell.getData();
        
        const ActionLink = () => (
        <> 
            <Button className="bg-transparent border-0 p-0 text-primary px-1 me-2" onClick={() => editAction(data.email)}>
                <BsPencil/>
            </Button> 
            <Button className="bg-transparent border-0 p-0 text-danger px-1" onClick={() => deleteAction(data.email)}>
                <BsTrash/>
            </Button>
        </> );

        const cellElement = cell.getElement();
        const root = createRoot(cellElement); 
        root.render(<ActionLink />);
    };

    useEffect(()=>{
        if(errorf !== null){
            if(errorf.message.length > 0){
                
            }
        } else {
                if(responsef !== null && responsef.status === 200){ 
                    columns.push(
                        {title:'First Name', field: 'firstName', width: 0},
                        {title:'Last Name', field: 'lastName', width: 0},
                        {title:'Email', field: 'email', width: 0},
                        {title:'Actions', field:'actions', headerSort: false, width: 80, formatter: actionsFormater}
                    );
                    setEventData(responsef.data);
                    setRenderIt(true);
                }
        }  
    },[errorf, responsef, columns]);
    
    return(
        <>
        {
            renderid ? 
            <TTable id='eventsTable' tableDate={eventData} paginateUrl='/get-users' columns={columns} paginate='remote' datatree={true} /> 
            : ''
        }
        </>
    );
}

export default UsersList;