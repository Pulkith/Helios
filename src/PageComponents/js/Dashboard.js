import React from 'react';
import '../css/dashboard.scss'
import '../css/global.scss'

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EastIcon from '@mui/icons-material/East';
import { useState } from 'react';
import { Navigate } from 'react-router';
import {TextWithDividers, TextWithDividersEqual, PersonPicker} from './UtilComponents.js'
import Database from './Database.js';

import FileUploadIcon from '@mui/icons-material/FileUpload';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const Dashboard = () => {

    const [text, setText] = useState('Hu');
    const [file, setFile] = useState(null);


    const rotate = (log) => {
        window.location.href = '/Compare';
    }

    const handleUpload = (event) => {
        const reader = new FileReader()
        reader.onload = handleFileLoad;
        reader.readAsText(event.target.files[0])
        setFile(event.target.files[0]);
    }

    const handleFileLoad = (event) => {;
        var textcont = event.target.result;
        console.log(document.getElementById('txtarea1').value)
        document.getElementById('txtarea1').value = event.target.result;
        setText(textcont);
      }

    const uploadInputStyle = {
        display: 'none',
    };

    const findIssues = () => {
        const formData = new FormData();
        formData.append('file', file);

        fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
        })
        .then(response => response.text())
        .then(data => {
        console.log('Success:', data);
        })
        .catch((error) => {
        console.error('Error:', error);
        });
    }

    return (
        <div className="dashboard-wrapper">
            <div className="max-contentwrapper">
                <div className="content ptop20">
                    <div className="fs400 fw900">Debug your Code</div>
                    <Container>
                         <div className="contentwrapper">
                            <Row>
                                <Col>
                                    <div className="leftc">
                                        <textarea placeholder="Paste Source Code" id="txtarea1" className="pyinput textarea textarea-bordered textarea-lg w-full h-full">
                                            
                                        </textarea>
                                        <div className="mtop20">
                                            <TextWithDividersEqual text="OR" className="mtop20" />
                                        </div>
                                        <div className="mtop20">
                                            <button className="btn btn-outline btn-primary textwhite fs125 btnhovermovearrow maxwidth"
                                            onClick={() =>{document.getElementById('fileInput').click();}}>Upload a File<FileUploadIcon className="movearrowright" /></button>
                                            <input
                                                    id="fileInput"
                                                    type="file"
                                                    style={uploadInputStyle}
                                                    onChange={handleUpload}
                                                    onInput={handleUpload}
                                                    accept=""
                                                    />
                                        </div>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="rightc">
                                        <button className="btn btn-primary textwhite fs125 btnhovermovearrow maxwidth" onClick={()=>findIssues()}>Find Issues</button>
                                    </div>
                                </Col>
                            </Row>
                         </div>
                        <Row>

                        </Row>
                    </Container>
                   

                </div>
            </div>
        </div>
    )
}


export default Dashboard;
