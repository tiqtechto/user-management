import { useState, useEffect } from "react";
import jq from 'jquery';

import useAPI from './useAPI';

const MultiFileUpload = (props) => {
    /* props */
    let fieldName = props.name;
    let size = props.size;
    let required = props.required;
    let regex = props.regex;
    let message = props.message;
    let setValue = props.setValue;
    const [selectedfile, SetSelectedFile] = useState([]);
    const [Files, SetFiles] = useState([]);

    const[Renderid, setRenderid] = useState(false);
    /* props */

    const {response, error, isLoading, execute} = useAPI();

    useEffect(()=>{
        if(typeof props.Files != 'undefined' && props.Files != '' && props.Files != null){
            SetFiles(props.Files);
        }
        if(typeof props.selectedFiles != 'undefined' && props.selectedFiles != '' && props.selectedFiles != null){
            SetSelectedFile(props.selectedFiles);
        }

        setRenderid(true);
    },[props]);

    jq(function(){
        if(Renderid){
            function validateAndSubmit() {
                // Get the content from the Trumbowyg editor
                var content = jq(`input[name="${fieldName}"]`).val();
                
                if (content.trim() === '') {
                    return true;
                } else {
                    return false;
                }
            }

            jq('button[type="submit"]').on('click', function(e){ 
                var parentForm = jq(this).closest('form');
                if(parentForm.length > 0 && validateAndSubmit() && required){
                setError('No file selected.');
                e.preventDefault();
                } else {
                setError('');
                setValue(fieldName, selectedfile);
                }
            });
        }
    });
    
    const [ferror, setError] = useState('');


    const filesizes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const InputChange = (e) => {
        // --For Multiple File Input
        let images = [];
        for (let i = 0; i < e.target.files.length; i++) {
            images.push((e.target.files[i]));
            let reader = new FileReader();
            let file = e.target.files[i];

            if(typeof file != 'undefined' && file != null && file != ''){
                const maxSizeMB = size;
                const fileSizeMB = file.size / (1024 * 1024);
                if (fileSizeMB > maxSizeMB) {
                  setError(`File ${e.target.files[i].name} size should be less than ${maxSizeMB}MB.`);
                  return;
                }
              
          
                if (!file && required) {
                  setError('No file selected.')
                  return;
                }
                
                if (!regex.test(file.type)) {
                  setError(`File ${e.target.files[i].name} : `+message);
                  return;
                }
              
                /* validation */

                reader.onloadend = () => {
                    SetSelectedFile((preValue) => {
                        return [
                            ...preValue,
                            {
                                id: i,
                                filename: e.target.files[i].name,
                                filetype: e.target.files[i].type,
                                fileimage: reader.result,
                                datetime: e.target.files[i].lastModifiedDate.toLocaleString('en-IN'),
                                filesize: filesizes(e.target.files[i].size)
                            }
                        ]
                    });

                }
                if (e.target.files[i]) {
                    reader.readAsDataURL(file);
                }
            }
        }
    }


    const DeleteSelectFile = (id) => { 
        if(window.confirm("Are you sure you want to delete this Image?")){
            const result = selectedfile.filter((data) => data.id !== id);
            SetSelectedFile(result);
        }else{
            // alert('No');
        }
        
    }

    /* const FileUploadSubmit = async (e) => {
        e.preventDefault();

        // form reset on submit 
        e.target.reset();
        if (selectedfile.length > 0 && required) {
            for (let index = 0; index < selectedfile.length; index++) {
                SetFiles((preValue)=>{
                    return[
                        ...preValue,
                        selectedfile[index]
                    ]   
                })
            }
            SetSelectedFile([]);
        } else {
            setError('Please select file');
            return;
        }
    } */


    const DeleteFile = async (id) => {
        if(window.confirm("Are you sure you want to delete this Image?")){
            const result = Files.filter((data)=>data.id !== id);
            let data = {id: id};
            execute('/event/deletefile', 'post', data);
            SetFiles(result);
        }else{
            // alert('No');
        }
    }
   
    return(
        <>
        { Renderid ? 
        <div className="fileupload-view mb-3">
        <style jsx='true'>
        {`
            .kb-data-box {
                width: 100%;
                flex: 1;
            }
            .kb-file-upload {
                margin-bottom: 20px;
            }
            .file-upload-box {
                border: 1px dashed #b6bed1;
                background-color: #f0f2f7;
                border-radius: 4px;
                min-height: 150px;
                position: relative;
                overflow: hidden;
                padding: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #8194aa;
                font-weight: 400;
                font-size: 15px;
            }
            .file-upload-box .file-upload-input {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                opacity: 0;
                cursor: pointer;
            }
            .file-link{
                color: #475f7b;
                text-decoration: underline;
                margin-left: 3px;
            }
            .file-upload-box .file-link:hover{
                text-decoration: none;
            }
            .file-atc-box {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }
            .file-image {
                width: 130px;
                height: 85px;
                background-size: cover;
                border-radius: 5px;
                margin-right: 15px;
                background-color: #eaecf1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30px;
                color: #475f7b;
                padding: 3px;
            }
            .file-image img{
                max-width: 100%;
                max-height: 100%;
                border-radius: 4px;
            }
            .file-detail {
                flex: 1;
                width: calc(100% - 210px);
            }
            .file-detail h6 {
                word-break: break-all;
                font-size: 13px;
                font-weight: 500;
                line-height: 20px;
                margin-bottom: 8px;
            }
            .file-detail p {
                font-size: 12px;
                color: #8194aa;
                line-height: initial;
                font-weight: 400;
                margin-bottom: 8px;
            }
            .file-actions {
                display: -ms-flexbox;
                display: flex;
                -ms-flex-wrap: wrap;
                flex-wrap: wrap;
                align-items: center;
            }
            .file-action-btn {
                font-size: 12px;
                color: #8194aa;
                line-height: 20px;
                font-weight: 400;
                margin-bottom: 0;
                padding: 0;
                background-color: transparent;
                border: none;
                text-decoration: underline;
                margin-right: 15px;
                cursor: pointer;
            }
            .file-action-btn:hover {
                color: #3d546f;
                text-decoration: underline;
            }
            .file-atc-box:last-child{
                margin-bottom: 0;
            }
        `}
        </style>
            <div className="row justify-content-center m-0">
                <div className="col-12 px-0">
                            <div className="kb-data-box">
                                    <div className="kb-file-upload">
                                        <div className="file-upload-box">
                                            <input type="file" name={fieldName} id="fileupload" className="file-upload-input" onChange={InputChange} multiple />
                                            <span>Drag and drop or <span className="file-link">Choose your files</span></span>
                                        </div>
                                    </div>
                                    <div className="kb-attach-box mb-1">
                                        {
                                            selectedfile.map((data, index) => {
                                                const { id, filename, filetype, fileimage, datetime, filesize } = data;
                                                return (
                                                    <div className="file-atc-box" key={id}>
                                                        {
                                                            filetype.match(regex) ?
                                                                <div className="file-image"> <img src={fileimage} alt="" /></div> :
                                                                <div className="file-image"><i className="far fa-file-alt"></i></div>
                                                        }
                                                        <div className="file-detail">
                                                            <h6>{filename}</h6>
                                                            <p></p>
                                                            <p><span>Size : {filesize}</span><span className="ml-2"> Modified Time : {datetime}</span></p>
                                                            <div className="file-actions">
                                                                <button type="button" className="file-action-btn" onClick={() => DeleteSelectFile(id)}>Delete</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                {Files.length > 0 ?
                                    <div className="kb-attach-box">
                                        <hr />
                                        {
                                            Files.map((data, index) => {
                                                const { id, filename, filetype, fileimage, datetime, filesize } = data;
                                                return (
                                                    <div className="file-atc-box" key={index}>
                                                        {
                                                            filetype.match(regex) ?
                                                                <div className="file-image"> <img src={fileimage} alt="" /></div> :
                                                                <div className="file-image"><i className="far fa-file-alt"></i></div>
                                                        }
                                                        <div className="file-detail">
                                                            <h6>{filename}</h6>
                                                            <p><span>Size : {filesize}</span><span className="ml-3"> Modified Time : {datetime}</span></p>
                                                            <div className="file-actions">
                                                                <button className="file-action-btn" onClick={() => DeleteFile(id)}>Delete</button>
                                                                <a href={fileimage}  className="file-action-btn" download={filename}>Download</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    : ''}

                                    {ferror !== '' && <p className='error-text text-danger text-center me-1'>{ferror}</p>}
                            </div>
                </div>
            </div>
        </div>
        : ''
        }
        </>
    );
}

export default MultiFileUpload;

