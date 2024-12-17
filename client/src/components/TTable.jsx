import { useState, useEffect, createRef } from "react";
import {TabulatorFull as Tabulator} from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import { token, host } from './constant';
import  { BsXLg }  from "react-icons/bs";

import jq from 'jquery';

const TTable = (props) => {
    /* props */
    const [id, setID] = useState('exampleTable');
    const [datatree, setDataTree] = useState(false);
    const [paginate, setPaginate] = useState(false);
    const [paginateUrl, setPaginateUrl] = useState(null);
    const [tableDate, setTableData] = useState([]);

    const [options, setOptions] = useState({
        height: '100vh',
        movableRows: true,
        movableColumns: true
      });
    
    const [columns, setColumns] = useState([]);

    const [isEditable, setEditable] = useState(true);
    const [isDeletable, setDelete] = useState(true);

    const[Renderid, setRenderid] = useState(false);
    /* props */
    
    var tabulator;
    
    useEffect(()=>{
        if(typeof props.id != 'undefined' && props.id != '' && props.id != null){
            setID(props.id);
        }

        if(typeof props.datatree != 'undefined' && props.datatree != '' && props.datatree != null){
            setDataTree(props.datatree);
        }

        if(typeof props.paginate != 'undefined' && props.paginate != '' && props.paginate != null){
            setPaginate(props.paginate);
        }

        if(typeof props.paginateUrl != 'undefined' && props.paginateUrl != '' && props.paginateUrl != null){
            setPaginateUrl(props.paginateUrl);
        }

        if(typeof props.tableDate != 'undefined' && props.tableDate != '' && props.tableDate != null){
            setTableData(props.tableDate);
        }

        if(typeof props.options != 'undefined' && props.options != '' && props.options != null){
            setOptions(props.options);
        }

        if(typeof props.columns != 'undefined' && props.columns != '' && props.columns != null){
            setColumns(props.columns);
        }

        if(typeof props.editable != 'undefined' && props.editable != '' && props.editable != null){
            setEditable(props.editable);
        }

        if(typeof props.deletable != 'undefined' && props.deletable != '' && props.deletable != null){
            setDelete(props.deletable);
        }

        let token1;
        let getToken = localStorage.getItem('token');
        if(typeof getToken != 'undefined' && getToken != '' && getToken != null){
            token1 = getToken;
        }

        setRenderid(true);
        
        setTimeout(() => {
            if(Renderid){
                tabulator = new Tabulator(`#${id}`, {
                    /* data: tableDate, */ //link data to table
                    reactiveData:true, //enable data reactivity
                    columns: columns, //define table columns
                    options: options,
                    dataTree: datatree,
                    filterMode: "remote",
                    paginationMode:"remote",
                    layout:"fitColumns",
                    pagination: paginate,
                    paginationSize: 10,
                    paginationSizeSelector:[10, 30, 50, 100, 500],
                    movableColumns:true,

                    ajaxURL: host+paginateUrl,
                    ajaxConfig: {
                        headers: {
                            Authorization: `Bearer: ${token}`,
                        },
                    },
                    ajaxParams: {
                        token: token1
                    },

                    ajaxResponse: (url, params, responseData) => {
                        let last_page = responseData.pageTotal
                        const tabulatorItemFormat = {
                          data: responseData.data,
                          last_page
                        };
                        return tabulatorItemFormat;
                    },

                    ajaxURLGenerator: function(url, config, params) {
                        return `${host+paginateUrl}/${token1}?page=${params.page}&limit=${params.size}&search=${params.search != undefined ? params.search : ''}`;
                    },
                    placeholder: function() {
                        return "<div style='text-align: center;'>No data available</div>"; // Custom HTML content for no data
                    }
                });

                
            }

        },100);
        
    },[props, token, tableDate]);

        jq(function(){
            jq('#searchTable').on('input keypress', function(){
                let thisValue = jq(this).val();
                
                setTimeout(function(){
                    if(thisValue != ''){
                        jq('#clearFilter').show(); 
                        if(typeof tabulator != 'undefined'){
                            setTimeout(()=>{
                                tabulator.options.ajaxParams.search = thisValue;
                                tabulator.setData();
                            },200);
                        }
                    } else {
                        jq('#clearFilter').hide();
                        if(typeof tabulator != 'undefined'){
                            setTimeout(()=>{
                                tabulator.options.ajaxParams.search = thisValue;
                                tabulator.setData();
                            },200);
                        }
                    }
                },200);
            });
        
            jq('#clearFilter').on('click', function(){
                if(typeof tabulator != 'undefined'){
                    setTimeout(()=>{
                        jq('#searchTable').val('');
                        tabulator.options.ajaxParams.search = "";
                        tabulator.setData();
                        jq('#clearFilter').hide();
                    },0);
                }
            });
        });

    return(
        <>
        
        <style jsx='true'>
        {`
            #${id}{
                background-color:#ccc;
                border: 1px solid #333;
            }
            
            /*Theme the header*/
            #${id} .tabulator-col, #${id} .tabulator-header {
                background-color:#333;
                color:#fff;
                border-bottom: 3px solid var(--bs-primary);
            }

            #${id} .tabulator-footer .tabulator-footer-contents{
                background-color: var(--bs-primary-bg-subtle);
            }

            #${id} .tabulator-footer .tabulator-paginator{
                color: #000;
            }

            #${id} .tabulator-footer .tabulator-page.active{
                font-weight: 700 !important;
                color: var(--bs-primary);
            }
            
            /*Allow column header names to wrap lines*/
            #${id} .tabulator-header .tabulator-col,
            #${id} .tabulator-header .tabulator-col-row-handle {
                white-space: normal;
            }
            
            /*Color the table rows*/
            #${id} .tabulator-tableHolder .tabulator-table .tabulator-row{
                color:#fff;
                background-color: #666;
            }
            
            /*Color even rows*/
                #${id} .tabulator-tableHolder .tabulator-table .tabulator-row:nth-child(even) {
                background-color: #444;
            }
        `}
        </style>

        {
           Renderid ? 
                <div>
                    <div className="searchArea position-relative d-flex align-items-baseline justify-content-end mx-2 mb-2">
                        <label style={{fontSize: '0.90rem'}} className="me-1 fw-bold" htmlFor="searchTable">Search</label>
                        <input className="rounded-1 border-primary" type="input" name="searchTable" id="searchTable" placeholder="search" />
                        <BsXLg style={{display: 'none'}} className="text-danger position-absolute top-0 my-2 mx-1 cursor-pointer" id="clearFilter" />
                    </div>

                    <div id={id} > </div>
                </div>
                : '' 
           
        }
        </>
    );

}

export default TTable;

