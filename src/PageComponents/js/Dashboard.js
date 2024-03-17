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

import axios from 'axios';
import { NoFlash } from '@mui/icons-material';
import { trim } from 'jquery';
import { waitFor } from '@testing-library/react';
import { red } from '@mui/material/colors';

import ReactTooltip from "react-tooltip"


const Dashboard = () => {

    const [text, setText] = useState('Hu');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [output, recievedOutput] = useState(false);
    const [formatText, setFormatText] = useState('');
    const [fuzzy, setFuzzy] = useState('');


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

    const uploadFileToServer = () => {
        setLoading(true);
        recievedOutput(false);
        const formData = new FormData();
        formData.append('file', file);

        fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            console.log('Success:', data);
            analyzeIssues()
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        // analyzeIssues();

        // analyzeIssues()

        // fetch('http://127.0.0.1:5000/test', {
        //     method: 'GET',
        // }).then(response => console.log(response))

        // axios.get('http://127.0.0.1:5000/test').then(r => {
        //   console.log(r)
        // })
    }

    const analyzeIssues = () => {
        axios.get('http://127.0.0.1:5000/analyze')
        .then(data => {
            setLoading(false);
            writeErrors(data)
            console.log(data)
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        // writeErrors(sampleData)
    }

    const writeErrors = (startd) => {
        recievedOutput(true);

        // let textOutput = "";
        // initdata.forEach(element => {
        //     textOutput += element.token;
        // });  

        let initdata = startd.data.data;
        setFuzzy(startd.break);


        fetch('http://127.0.0.1:5000/send-file-data')
  .then(response => response.json())
  .then(data => {
        // document.getElementById('output').innerHTML = '<div style="color: red">' + atob(data.file_data) + '</div>'
        const trimString = (str) => str.substring(6, str.length - 3);
        const trimArray = (arr) => arr.slice(2, -1);
        const formatdata = trimArray(initdata)

        const nonfoOutput = atob(data.file_data)

        // const formatted = (formatStringA(formatdata, nonfoOutput))

        document.getElementById('output').innerHTML = getRawString(formatdata);
        document.getElementById('output2').innerHTML = startd.data.break;
    });
    }

    const getRawString = (formatdata) => {
        let string = "";
        for(var i = 0; i < formatdata.length; i++) {
            // console.log(formatdata[i])
            let redness = Math.abs((1 - (formatdata[i].prob  <0 ?  0 : formatdata[i].prob)) * 255);
            let thresh = 250;
            redness = (redness > thresh ? redness : 0);
            const go = (redness > thresh ? `rgb(${Math.round(redness)}, 0, 0)` : "rgb(255, 255, 255)")

            const bestword = formatdata[i]["predicted_tokens"][0].token;

            string += `<span style="color: ${go}">${formatdata[i].token}</span>`;

            // string += `<span style="color: ${go}" data-tip=${bestword}}>${formatdata[i].token}</span>`;
        }
        return string
    }

    const formatStringA = (a, b) => {

        let res = "";
        let j = 0;
        let acur = "";
        let curnext = 0;

        const thiswordred = false;
        
        for(let i = 0; i < b.length; i++) {
            if(j >= acur.length) {
                let token =  a[curnext].token;

                if(token == "(\\" || token == "\\") {
                    token = '('
                }

                acur += token;
                
                console.log(token);

                curnext++;
            }
            console.log(b[i], acur[j])
            if(b[i] === acur[j]) {
                res += b[i];
                j++;
            } else {
                res += b[i];
            }
        }

        return res;

    }

    function formatString(a, b) {
        // Find the start and end indexes where a matches b
        let start = 0;
        while (start < a.length && b.indexOf(a[start]) === -1) {
          start++;
        }
        let end = a.length - 1;
        while (end >= 0 && b.indexOf(a[end]) === -1) {
          end--;
        }
      
        // Trim a to the matching part
        const trimmedA = a.substring(start, end + 1);



        let formattedA = '';
        let j = 0; // Pointer for string b
      
        for (let i = 0; i < trimmedA.length; i++) {
          // Skip non-matching characters in b (spaces and other characters)
          while (j < b.length && trimmedA[i] !== b[j]) {
            // Add the non-matching character (like spaces) from b to formattedA
            formattedA += b[j];
            j++;
          }
          // Add the current character from trimmedA to formattedA
          formattedA += trimmedA[i];
          // Move to the next character in b
          j++;
        }
      

      
        return formattedA;
      }

    return (
        <div className="dashboard-wrapper">
            <div className="max-contentwrapper">
                <div className="content ptop20">
                    <div className="fs400 fw900">Helios</div>
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
                                    {
                                        !output &&
                                        <div className="nooutputw">
                                            <div className="nooutput">
                                                { loading && 
                                                    <div >
                                                        <div style={{color: "rgb(130, 130, 251)" }} className="loading loading-lg loading-spinner"></div>
                                                        <div className="mtop20">Processing</div>
                                                    </div>
                                                }
                                                { !loading && <button className="btn btn-primary textwhite fs125 btnhovermovearrow maxwidth" onClick={()=>uploadFileToServer()}>Find Issues</button>}
                                            </div>
                                        </div>
                                    }

                                    {
                                        output &&
                                        <div>
                                            <button className="btn btn-primary textwhite fs125 btnhovermovearrow maxwidth" onClick={()=>uploadFileToServer()}>Reanalyze</button>
                                            <div className="pythonerrors">
                                                {formatText}
                                            </div>
                                            <div className='fs150 whitetext mtop20'>
                                                Red highlighted text indicates possible errors.
                                            </div>
                                            <pre className="output mtop20" id="output">

                                            </pre>

                                            <div className='fs150 whitetext mtop20'>
                                                The following inputs break your code:
                                            </div>

                                            <pre className="output mtop20" id="output2">

                                            </pre>
                                        </div>

                                    }
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

let sampleData = [
    {
        "log_prob": -21.494922637939453,
        "predicted_tokens": [
            {
                "log_prob": 15.166650772094727,
                "prob": 3861826.5,
                "token": "▁Question"
            },
            {
                "log_prob": 14.925838470458984,
                "prob": 3035353.5,
                "token": "▁Q"
            },
            {
                "log_prob": 13.4065580368042,
                "prob": 664345.8125,
                "token": "▁#"
            },
            {
                "log_prob": 12.966731071472168,
                "prob": 427936.90625,
                "token": "▁User"
            },
            {
                "log_prob": 10.30380916595459,
                "prob": 29846.08984375,
                "token": "▁package"
            }
        ],
        "prob": 4.6224657435089966e-10,
        "token": "<s>"
    },
    {
        "log_prob": -10.007392883300781,
        "predicted_tokens": [
            {
                "log_prob": 15.166651725769043,
                "prob": 3861830,
                "token": "▁Question"
            },
            {
                "log_prob": 14.92584228515625,
                "prob": 3035365.25,
                "token": "▁Q"
            },
            {
                "log_prob": 13.40655517578125,
                "prob": 664343.875,
                "token": "▁#"
            },
            {
                "log_prob": 12.966730117797852,
                "prob": 427936.5,
                "token": "▁User"
            },
            {
                "log_prob": 10.303807258605957,
                "prob": 29846.033203125,
                "token": "▁package"
            }
        ],
        "prob": 0.00004506553159444593,
        "token": "```"
    },
    {
        "log_prob": -10.629670143127441,
        "predicted_tokens": [
            {
                "log_prob": 13.334182739257812,
                "prob": 617962.3125,
                "token": "<0x0A>"
            },
            {
                "log_prob": 8.741545677185059,
                "prob": 6257.560546875,
                "token": "c"
            },
            {
                "log_prob": 8.70549201965332,
                "prob": 6035.97119140625,
                "token": "python"
            },
            {
                "log_prob": 8.085671424865723,
                "prob": 3247.599609375,
                "token": "javascript"
            },
            {
                "log_prob": 7.582748889923096,
                "prob": 1964.0203857421875,
                "token": "java"
            }
        ],
        "prob": 0.00002418760777800344,
        "token": "def"
    },
    {
        "log_prob": -4.614089012145996,
        "predicted_tokens": [
            {
                "log_prob": 8.843021392822266,
                "prob": 6925.88671875,
                "token": "▁fib"
            },
            {
                "log_prob": 8.23793888092041,
                "prob": 3781.73779296875,
                "token": "▁main"
            },
            {
                "log_prob": 7.803375244140625,
                "prob": 2448.853515625,
                "token": "▁solution"
            },
            {
                "log_prob": 7.4359130859375,
                "prob": 1695.805419921875,
                "token": "▁sum"
            },
            {
                "log_prob": 7.4133429527282715,
                "prob": 1657.9595947265625,
                "token": "▁find"
            }
        ],
        "prob": 0.009911208413541317,
        "token": "function"
    },
    {
        "log_prob": -6.7696757316589355,
        "predicted_tokens": [
            {
                "log_prob": 11.617219924926758,
                "prob": 110992.7265625,
                "token": "_"
            },
            {
                "log_prob": 10.126606941223145,
                "prob": 24999.39453125,
                "token": "("
            },
            {
                "log_prob": 10.019632339477539,
                "prob": 22463.169921875,
                "token": "1"
            },
            {
                "log_prob": 8.968024253845215,
                "prob": 7848.08056640625,
                "token": "▁name"
            },
            {
                "log_prob": 8.120146751403809,
                "prob": 3361.51416015625,
                "token": "▁sum"
            }
        ],
        "prob": 0.0011480668326839805,
        "token": "To"
    },
    {
        "log_prob": -0.48778027296066284,
        "predicted_tokens": [
            {
                "log_prob": 15.167587280273438,
                "prob": 3865444.75,
                "token": "Test"
            },
            {
                "log_prob": 13.059589385986328,
                "prob": 469577.875,
                "token": "Be"
            },
            {
                "log_prob": 12.992112159729004,
                "prob": 438937.4375,
                "token": "Find"
            },
            {
                "log_prob": 12.577618598937988,
                "prob": 289994.875,
                "token": "Print"
            },
            {
                "log_prob": 12.220717430114746,
                "prob": 202950.515625,
                "token": "Cal"
            }
        ],
        "prob": 0.6139878034591675,
        "token": "Test"
    },
    {
        "log_prob": -0.17589618265628815,
        "predicted_tokens": [
            {
                "log_prob": 15.00027084350586,
                "prob": 3269903,
                "token": "("
            },
            {
                "log_prob": 12.724201202392578,
                "prob": 335776.5625,
                "token": "():"
            },
            {
                "log_prob": 11.96554183959961,
                "prob": 157242.09375,
                "token": "()"
            },
            {
                "log_prob": 10.555066108703613,
                "prob": 38371.33984375,
                "token": "▁("
            },
            {
                "log_prob": 9.862066268920898,
                "prob": 19188.49609375,
                "token": "<0x0A>"
            }
        ],
        "prob": 0.8387050032615662,
        "token": "("
    },
    {
        "log_prob": -2.1290700435638428,
        "predicted_tokens": [
            {
                "log_prob": 11.828773498535156,
                "prob": 137142.1875,
                "token": "input"
            },
            {
                "log_prob": 11.758307456970215,
                "prob": 127810.953125,
                "token": "x"
            },
            {
                "log_prob": 11.690308570861816,
                "prob": 119408.8515625,
                "token": "num"
            },
            {
                "log_prob": 11.521697998046875,
                "prob": 100881.1171875,
                "token": "a"
            },
            {
                "log_prob": 11.456697463989258,
                "prob": 94532.359375,
                "token": "n"
            }
        ],
        "prob": 0.11894784867763519,
        "token": "input"
    },
    {
        "log_prob": -3.6522960662841797,
        "predicted_tokens": [
            {
                "log_prob": 14.401958465576172,
                "prob": 1797591.875,
                "token": ")"
            },
            {
                "log_prob": 13.762441635131836,
                "prob": 948314.625,
                "token": "):"
            },
            {
                "log_prob": 13.086198806762695,
                "prob": 482240.75,
                "token": "String"
            },
            {
                "log_prob": 13.027182579040527,
                "prob": 454604.28125,
                "token": "Array"
            },
            {
                "log_prob": 12.971880912780762,
                "prob": 430146.40625,
                "token": "){"
            }
        ],
        "prob": 0.025931520387530327,
        "token": "_"
    },
    {
        "log_prob": -1.8668853044509888,
        "predicted_tokens": [
            {
                "log_prob": 14.44214153289795,
                "prob": 1871295.625,
                "token": "list"
            },
            {
                "log_prob": 14.319887161254883,
                "prob": 1655953,
                "token": "string"
            },
            {
                "log_prob": 14.118544578552246,
                "prob": 1353960.5,
                "token": "str"
            },
            {
                "log_prob": 13.936003684997559,
                "prob": 1128053,
                "token": "array"
            },
            {
                "log_prob": 13.114617347717285,
                "prob": 496141.9375,
                "token": "data"
            }
        ],
        "prob": 0.1546044498682022,
        "token": "str"
    },
    {
        "log_prob": -0.8700478672981262,
        "predicted_tokens": [
            {
                "log_prob": 16.432207107543945,
                "prob": 13690422,
                "token": "):"
            },
            {
                "log_prob": 15.872668266296387,
                "prob": 7823701,
                "token": ")"
            },
            {
                "log_prob": 15.381586074829102,
                "prob": 4787821.5,
                "token": ","
            },
            {
                "log_prob": 15.344654083251953,
                "prob": 4614223,
                "token": ":"
            },
            {
                "log_prob": 13.912603378295898,
                "prob": 1101962.625,
                "token": "){"
            }
        ],
        "prob": 0.4189315140247345,
        "token": "):"
    },
    {
        "log_prob": -0.0027366350404918194,
        "predicted_tokens": [
            {
                "log_prob": 19.537717819213867,
                "prob": 305578688,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.60973072052002,
                "prob": 299458.375,
                "token": "▁#"
            },
            {
                "log_prob": 11.711833000183105,
                "prob": 122006.9140625,
                "token": "#"
            },
            {
                "log_prob": 11.698446273803711,
                "prob": 120384.5234375,
                "token": "▁"
            },
            {
                "log_prob": 10.692877769470215,
                "prob": 44041.06640625,
                "token": "▁▁▁"
            }
        ],
        "prob": 0.9972670674324036,
        "token": "\n"
    },
    {
        "log_prob": -1.1225308179855347,
        "predicted_tokens": [
            {
                "log_prob": 13.325940132141113,
                "prob": 612889.5625,
                "token": "<0x0A>"
            },
            {
                "log_prob": 13.263699531555176,
                "prob": 575905.875,
                "token": "▁▁▁"
            },
            {
                "log_prob": 12.35792350769043,
                "prob": 232797.34375,
                "token": "#"
            },
            {
                "log_prob": 12.232657432556152,
                "prob": 205388.25,
                "token": "▁"
            },
            {
                "log_prob": 11.041637420654297,
                "prob": 62419.7734375,
                "token": "<0x09>"
            }
        ],
        "prob": 0.32545509934425354,
        "token": "  "
    },
    {
        "log_prob": -2.296633720397949,
        "predicted_tokens": [
            {
                "log_prob": 12.565357208251953,
                "prob": 286460.84375,
                "token": "▁#"
            },
            {
                "log_prob": 12.213201522827148,
                "prob": 201430.875,
                "token": "▁\"\"\""
            },
            {
                "log_prob": 12.070526123046875,
                "prob": 174647.703125,
                "token": "▁if"
            },
            {
                "log_prob": 11.960261344909668,
                "prob": 156413.953125,
                "token": "▁output"
            },
            {
                "log_prob": 11.86054515838623,
                "prob": 141569.375,
                "token": "▁result"
            }
        ],
        "prob": 0.10059691220521927,
        "token": "if"
    },
    {
        "log_prob": -4.291679382324219,
        "predicted_tokens": [
            {
                "log_prob": 15.514588356018066,
                "prob": 5468901.5,
                "token": "▁len"
            },
            {
                "log_prob": 14.538686752319336,
                "prob": 2060968.875,
                "token": "▁not"
            },
            {
                "log_prob": 14.44729232788086,
                "prob": 1880959.125,
                "token": "▁input"
            },
            {
                "log_prob": 14.22386646270752,
                "prob": 1504342.625,
                "token": "▁type"
            },
            {
                "log_prob": 13.52625846862793,
                "prob": 748823.4375,
                "token": "▁isinstance"
            }
        ],
        "prob": 0.013681929558515549,
        "token": "'"
    },
    {
        "log_prob": -7.796127796173096,
        "predicted_tokens": [
            {
                "log_prob": 11.056591033935547,
                "prob": 63360.19140625,
                "token": "a"
            },
            {
                "log_prob": 10.04437255859375,
                "prob": 23025.845703125,
                "token": "▁'"
            },
            {
                "log_prob": 9.421565055847168,
                "prob": 12351.8984375,
                "token": ".'"
            },
            {
                "log_prob": 9.309779167175293,
                "prob": 11045.5087890625,
                "token": ",'"
            },
            {
                "log_prob": 8.973405838012695,
                "prob": 7890.4296875,
                "token": "apple"
            }
        ],
        "prob": 0.0004113246104680002,
        "token": "invalid"
    },
    {
        "log_prob": -0.15120641887187958,
        "predicted_tokens": [
            {
                "log_prob": 14.613005638122559,
                "prob": 2219973.25,
                "token": "'"
            },
            {
                "log_prob": 12.248242378234863,
                "prob": 208614.296875,
                "token": "_"
            },
            {
                "log_prob": 10.201570510864258,
                "prob": 26945.470703125,
                "token": "-"
            },
            {
                "log_prob": 9.602360725402832,
                "prob": 14799.6787109375,
                "token": "▁input"
            },
            {
                "log_prob": 9.216182708740234,
                "prob": 10058.59375,
                "token": "▁character"
            }
        ],
        "prob": 0.8596702218055725,
        "token": "'"
    },
    {
        "log_prob": -0.059736188501119614,
        "predicted_tokens": [
            {
                "log_prob": 20.14216423034668,
                "prob": 559281920,
                "token": "▁in"
            },
            {
                "log_prob": 17.33651351928711,
                "prob": 33818332,
                "token": "▁not"
            },
            {
                "log_prob": 12.247172355651855,
                "prob": 208391.203125,
                "token": "▁=="
            },
            {
                "log_prob": 11.808823585510254,
                "prob": 134433.328125,
                "token": "▁or"
            },
            {
                "log_prob": 11.55107307434082,
                "prob": 103888.4609375,
                "token": "▁"
            }
        ],
        "prob": 0.9420130252838135,
        "token": "in"
    },
    {
        "log_prob": -0.0033404999412596226,
        "predicted_tokens": [
            {
                "log_prob": 19.513044357299805,
                "prob": 298131264,
                "token": "▁input"
            },
            {
                "log_prob": 13.12294864654541,
                "prob": 500292.71875,
                "token": "▁str"
            },
            {
                "log_prob": 11.419146537780762,
                "prob": 91048.3984375,
                "token": "▁["
            },
            {
                "log_prob": 11.290020942687988,
                "prob": 80019.125,
                "token": "▁['"
            },
            {
                "log_prob": 11.235421180725098,
                "prob": 75767.234375,
                "token": "▁set"
            }
        ],
        "prob": 0.9966650605201721,
        "token": "input"
    },
    {
        "log_prob": -0.0001255195093108341,
        "predicted_tokens": [
            {
                "log_prob": 23.936004638671875,
                "prob": 24847044608,
                "token": "_"
            },
            {
                "log_prob": 14.78281307220459,
                "prob": 2630838.25,
                "token": ":"
            },
            {
                "log_prob": 11.766687393188477,
                "prob": 128886.4921875,
                "token": "Str"
            },
            {
                "log_prob": 11.623805046081543,
                "prob": 111726.03125,
                "token": "."
            },
            {
                "log_prob": 11.372427940368652,
                "prob": 86892.578125,
                "token": "▁or"
            }
        ],
        "prob": 0.9998745322227478,
        "token": "_"
    },
    {
        "log_prob": -0.000006318072337307967,
        "predicted_tokens": [
            {
                "log_prob": 27.71965980529785,
                "prob": 1092685725696,
                "token": "str"
            },
            {
                "log_prob": 15.481470108032227,
                "prob": 5290747.5,
                "token": "▁str"
            },
            {
                "log_prob": 13.518325805664062,
                "prob": 742906.75,
                "token": "string"
            },
            {
                "log_prob": 12.133757591247559,
                "prob": 186047.546875,
                "token": "Str"
            },
            {
                "log_prob": 12.063040733337402,
                "prob": 173345.28125,
                "token": "strap"
            }
        ],
        "prob": 0.9999936819076538,
        "token": "str"
    },
    {
        "log_prob": -3.5285775661468506,
        "predicted_tokens": [
            {
                "log_prob": 19.83977699279785,
                "prob": 413338304,
                "token": ":"
            },
            {
                "log_prob": 17.22323989868164,
                "prob": 30196600,
                "token": "▁or"
            },
            {
                "log_prob": 16.417755126953125,
                "prob": 13493993,
                "token": "."
            },
            {
                "log_prob": 14.304006576538086,
                "prob": 1629863.25,
                "token": "▁:"
            },
            {
                "log_prob": 13.56545639038086,
                "prob": 778758.625,
                "token": "▁and"
            }
        ],
        "prob": 0.029346629977226257,
        "token": "."
    },
    {
        "log_prob": -0.07431799173355103,
        "predicted_tokens": [
            {
                "log_prob": 19.672149658203125,
                "prob": 349547360,
                "token": "lower"
            },
            {
                "log_prob": 17.000185012817383,
                "prob": 24159422,
                "token": "split"
            },
            {
                "log_prob": 13.595443725585938,
                "prob": 802465.1875,
                "token": "upper"
            },
            {
                "log_prob": 12.995901107788086,
                "prob": 440603.6875,
                "token": "strip"
            },
            {
                "log_prob": 12.385478019714355,
                "prob": 239301.140625,
                "token": "replace"
            }
        ],
        "prob": 0.9283763766288757,
        "token": "lower"
    },
    {
        "log_prob": -0.021689709275960922,
        "predicted_tokens": [
            {
                "log_prob": 21.22641372680664,
                "prob": 1653919488,
                "token": "():"
            },
            {
                "log_prob": 17.314037322998047,
                "prob": 33066700,
                "token": "()"
            },
            {
                "log_prob": 14.628470420837402,
                "prob": 2254571.5,
                "token": "()."
            },
            {
                "log_prob": 13.535639762878418,
                "prob": 755881.4375,
                "token": ":"
            },
            {
                "log_prob": 10.896450996398926,
                "prob": 53984.43359375,
                "token": "▁or"
            }
        ],
        "prob": 0.978543758392334,
        "token": "():"
    },
    {
        "log_prob": -0.01719038560986519,
        "predicted_tokens": [
            {
                "log_prob": 20.591632843017578,
                "prob": 876662656,
                "token": "<0x0A>"
            },
            {
                "log_prob": 15.916224479675293,
                "prob": 8172002,
                "token": "▁#"
            },
            {
                "log_prob": 15.076772689819336,
                "prob": 3529874,
                "token": "▁"
            },
            {
                "log_prob": 13.19624137878418,
                "prob": 538337.75,
                "token": "▁▁▁"
            },
            {
                "log_prob": 12.824217796325684,
                "prob": 371096.65625,
                "token": "▁▁▁▁"
            }
        ],
        "prob": 0.9829564690589905,
        "token": "\n"
    },
    {
        "log_prob": -0.020526601001620293,
        "predicted_tokens": [
            {
                "log_prob": 20.791452407836914,
                "prob": 1070565056,
                "token": "▁▁▁▁▁▁▁"
            },
            {
                "log_prob": 15.996499061584473,
                "prob": 8855055,
                "token": "▁▁▁▁▁"
            },
            {
                "log_prob": 15.92611312866211,
                "prob": 8253212.5,
                "token": "▁▁▁▁▁▁"
            },
            {
                "log_prob": 14.722856521606445,
                "prob": 2477737.75,
                "token": "▁▁▁▁▁▁▁▁"
            },
            {
                "log_prob": 13.951108932495117,
                "prob": 1145221.875,
                "token": "▁▁▁▁▁▁▁▁▁▁▁"
            }
        ],
        "prob": 0.9796826839447021,
        "token": "      "
    },
    {
        "log_prob": -2.136068105697632,
        "predicted_tokens": [
            {
                "log_prob": 17.643712997436523,
                "prob": 45979812,
                "token": "▁return"
            },
            {
                "log_prob": 15.762823104858398,
                "prob": 7009823.5,
                "token": "▁raise"
            },
            {
                "log_prob": 15.36343765258789,
                "prob": 4701713.5,
                "token": "▁print"
            },
            {
                "log_prob": 12.988960266113281,
                "prob": 437556.125,
                "token": "▁result"
            },
            {
                "log_prob": 12.735271453857422,
                "prob": 339514.34375,
                "token": "▁output"
            }
        ],
        "prob": 0.11811835318803787,
        "token": "raise"
    },
    {
        "log_prob": -0.24638031423091888,
        "predicted_tokens": [
            {
                "log_prob": 17.730581283569336,
                "prob": 50152620,
                "token": "▁ValueError"
            },
            {
                "log_prob": 16.359718322753906,
                "prob": 12733136,
                "token": "▁Exception"
            },
            {
                "log_prob": 12.42300033569336,
                "prob": 248450.859375,
                "token": "▁Invalid"
            },
            {
                "log_prob": 11.918377876281738,
                "prob": 149998.09375,
                "token": "▁Type"
            },
            {
                "log_prob": 11.706656455993652,
                "prob": 121376.9765625,
                "token": "▁Argument"
            }
        ],
        "prob": 0.7816248536109924,
        "token": "ValueError"
    },
    {
        "log_prob": -12.644230842590332,
        "predicted_tokens": [
            {
                "log_prob": 18.297733306884766,
                "prob": 88431016,
                "token": "('"
            },
            {
                "log_prob": 18.263351440429688,
                "prob": 85442264,
                "token": "(\""
            },
            {
                "log_prob": 14.915210723876953,
                "prob": 3003265.5,
                "token": "("
            },
            {
                "log_prob": 14.374073028564453,
                "prob": 1748157.625,
                "token": "<0x0A>"
            },
            {
                "log_prob": 13.684144973754883,
                "prob": 876897.125,
                "token": "()"
            }
        ],
        "prob": 0.000003226118451493676,
        "token": "(\\"
    },
    {
        "log_prob": -3.155433416366577,
        "predicted_tokens": [
            {
                "log_prob": 17.12224578857422,
                "prob": 27295866,
                "token": "<0x0A>"
            },
            {
                "log_prob": 14.036092758178711,
                "prob": 1246802.5,
                "token": "\""
            },
            {
                "log_prob": 13.24804401397705,
                "prob": 566960,
                "token": "'"
            },
            {
                "log_prob": 10.62220573425293,
                "prob": 41036.02734375,
                "token": "▁'"
            },
            {
                "log_prob": 10.024829864501953,
                "prob": 22580.2265625,
                "token": "▁\""
            }
        ],
        "prob": 0.04261992499232292,
        "token": "\""
    },
    {
        "log_prob": -1.638866662979126,
        "predicted_tokens": [
            {
                "log_prob": 14.525943756103516,
                "prob": 2034872.5,
                "token": "String"
            },
            {
                "log_prob": 14.193693161010742,
                "prob": 1459629.375,
                "token": "Input"
            },
            {
                "log_prob": 14.07685375213623,
                "prob": 1298673.375,
                "token": "Invalid"
            },
            {
                "log_prob": 13.372246742248535,
                "prob": 641937.875,
                "token": "The"
            },
            {
                "log_prob": 13.122855186462402,
                "prob": 500245.96875,
                "token": "'"
            }
        ],
        "prob": 0.19420000910758972,
        "token": "Input"
    },
    {
        "log_prob": -0.543529212474823,
        "predicted_tokens": [
            {
                "log_prob": 16.423030853271484,
                "prob": 13565372,
                "token": "▁string"
            },
            {
                "log_prob": 15.529566764831543,
                "prob": 5551434,
                "token": "▁contains"
            },
            {
                "log_prob": 14.052312850952148,
                "prob": 1267190.625,
                "token": "▁cannot"
            },
            {
                "log_prob": 13.508199691772461,
                "prob": 735422,
                "token": "▁must"
            },
            {
                "log_prob": 13.3927001953125,
                "prob": 655202.875,
                "token": "▁can"
            }
        ],
        "prob": 0.5806952714920044,
        "token": "string"
    },
    {
        "log_prob": -0.369600385427475,
        "predicted_tokens": [
            {
                "log_prob": 18.256011962890625,
                "prob": 84817456,
                "token": "▁contains"
            },
            {
                "log_prob": 16.863557815551758,
                "prob": 21074152,
                "token": "▁cannot"
            },
            {
                "log_prob": 15.550663948059082,
                "prob": 5669797.5,
                "token": "▁can"
            },
            {
                "log_prob": 15.209941864013672,
                "prob": 4032680.5,
                "token": "▁should"
            },
            {
                "log_prob": 15.128181457519531,
                "prob": 3716085.75,
                "token": "▁must"
            }
        ],
        "prob": 0.6910104155540466,
        "token": "contains"
    },
    {
        "log_prob": -0.8896833062171936,
        "predicted_tokens": [
            {
                "log_prob": 17.12158203125,
                "prob": 27277754,
                "token": "▁the"
            },
            {
                "log_prob": 16.787616729736328,
                "prob": 19533018,
                "token": "▁'"
            },
            {
                "log_prob": 16.66290855407715,
                "prob": 17242858,
                "token": "▁invalid"
            },
            {
                "log_prob": 13.956521034240723,
                "prob": 1151436.75,
                "token": "▁an"
            },
            {
                "log_prob": 12.852583885192871,
                "prob": 381773.9375,
                "token": "▁word"
            }
        ],
        "prob": 0.41078585386276245,
        "token": "the"
    },
    {
        "log_prob": -2.225184917449951,
        "predicted_tokens": [
            {
                "log_prob": 18.347518920898438,
                "prob": 92945040,
                "token": "▁word"
            },
            {
                "log_prob": 16.28904151916504,
                "prob": 11864265,
                "token": "▁sub"
            },
            {
                "log_prob": 14.025325775146484,
                "prob": 1233450,
                "token": "▁invalid"
            },
            {
                "log_prob": 13.9241943359375,
                "prob": 1114809.75,
                "token": "▁term"
            },
            {
                "log_prob": 13.517587661743164,
                "prob": 742358.5625,
                "token": "▁for"
            }
        ],
        "prob": 0.10804744064807892,
        "token": "sub"
    },
    {
        "log_prob": -0.0024033491499722004,
        "predicted_tokens": [
            {
                "log_prob": 22.484333038330078,
                "prob": 5818643456,
                "token": "string"
            },
            {
                "log_prob": 16.189481735229492,
                "prob": 10739959,
                "token": "-"
            },
            {
                "log_prob": 14.548727989196777,
                "prob": 2081767.875,
                "token": "▁string"
            },
            {
                "log_prob": 12.7473726272583,
                "prob": 343647.8125,
                "token": "strings"
            },
            {
                "log_prob": 12.494750022888184,
                "prob": 266932.21875,
                "token": "String"
            }
        ],
        "prob": 0.9975995421409607,
        "token": "string"
    },
    {
        "log_prob": -0.03404692932963371,
        "predicted_tokens": [
            {
                "log_prob": 19.530147552490234,
                "prob": 303274080,
                "token": "▁'"
            },
            {
                "log_prob": 15.541218757629395,
                "prob": 5616497,
                "token": "▁\\\""
            },
            {
                "log_prob": 14.021979331970215,
                "prob": 1229329.25,
                "token": "▁\\"
            },
            {
                "log_prob": 13.901076316833496,
                "prob": 1089333.125,
                "token": ":"
            },
            {
                "log_prob": 13.572168350219727,
                "prob": 784003.125,
                "token": "▁invalid"
            }
        ],
        "prob": 0.9665261507034302,
        "token": "'"
    },
    {
        "log_prob": -0.00022289653134066612,
        "predicted_tokens": [
            {
                "log_prob": 23.661598205566406,
                "prob": 18884327424,
                "token": "invalid"
            },
            {
                "log_prob": 14.130766868591309,
                "prob": 1370610.625,
                "token": "Invalid"
            },
            {
                "log_prob": 14.107956886291504,
                "prob": 1339700.875,
                "token": "INVALID"
            },
            {
                "log_prob": 13.710939407348633,
                "prob": 900710.75,
                "token": "▁invalid"
            },
            {
                "log_prob": 11.575032234191895,
                "prob": 106407.6015625,
                "token": "input"
            }
        ],
        "prob": 0.9997771382331848,
        "token": "invalid"
    },
    {
        "log_prob": -5.085226058959961,
        "predicted_tokens": [
            {
                "log_prob": 20.01638412475586,
                "prob": 493179680,
                "token": "'\\"
            },
            {
                "log_prob": 18.364229202270508,
                "prob": 94511224,
                "token": "'"
            },
            {
                "log_prob": 15.118106842041016,
                "prob": 3678835.5,
                "token": "'."
            },
            {
                "log_prob": 14.382772445678711,
                "prob": 1763432,
                "token": "':"
            },
            {
                "log_prob": 13.22581958770752,
                "prob": 554498.625,
                "token": "''"
            }
        ],
        "prob": 0.006187488324940205,
        "token": "'."
    },
    {
        "log_prob": -0.016369923949241638,
        "predicted_tokens": [
            {
                "log_prob": 16.278268814086914,
                "prob": 11737141,
                "token": "\\"
            },
            {
                "log_prob": 10.508443832397461,
                "prob": 36623.44140625,
                "token": "▁\\"
            },
            {
                "log_prob": 10.106472969055176,
                "prob": 24501.091796875,
                "token": "▁Please"
            },
            {
                "log_prob": 9.996918678283691,
                "prob": 21958.69921875,
                "token": "\\\""
            },
            {
                "log_prob": 8.76176929473877,
                "prob": 6385.3994140625,
                "token": ")\\"
            }
        ],
        "prob": 0.9837633371353149,
        "token": "\\"
    },
    {
        "log_prob": -0.0010800487361848354,
        "predicted_tokens": [
            {
                "log_prob": 21.16643524169922,
                "prob": 1557636224,
                "token": "\")"
            },
            {
                "log_prob": 13.965388298034668,
                "prob": 1161692.25,
                "token": "n"
            },
            {
                "log_prob": 11.593538284301758,
                "prob": 108395.1171875,
                "token": "\");"
            },
            {
                "log_prob": 11.276606559753418,
                "prob": 78952.8828125,
                "token": "\"):"
            },
            {
                "log_prob": 10.902365684509277,
                "prob": 54304.6796875,
                "token": "<0x0A>"
            }
        ],
        "prob": 0.9989205598831177,
        "token": "\")"
    },
    {
        "log_prob": -0.002556153805926442,
        "predicted_tokens": [
            {
                "log_prob": 19.963369369506836,
                "prob": 467714848,
                "token": "<0x0A>"
            },
            {
                "log_prob": 13.141900062561035,
                "prob": 509864.375,
                "token": "▁"
            },
            {
                "log_prob": 12.624919891357422,
                "prob": 304041.625,
                "token": "▁#"
            },
            {
                "log_prob": 11.510927200317383,
                "prob": 99800.375,
                "token": "▁\\"
            },
            {
                "log_prob": 11.02627944946289,
                "prob": 61468.4609375,
                "token": "▁▁▁"
            }
        ],
        "prob": 0.99744713306427,
        "token": "\n"
    },
    {
        "log_prob": -1.2172014713287354,
        "predicted_tokens": [
            {
                "log_prob": 16.792879104614258,
                "prob": 19636076,
                "token": "▁▁▁"
            },
            {
                "log_prob": 16.05500602722168,
                "prob": 9388593,
                "token": "<0x0A>"
            },
            {
                "log_prob": 14.36039924621582,
                "prob": 1724416.5,
                "token": "▁▁▁▁▁▁▁"
            },
            {
                "log_prob": 12.750105857849121,
                "prob": 344588.375,
                "token": "▁▁▁▁▁▁▁▁"
            },
            {
                "log_prob": 12.747304916381836,
                "prob": 343624.53125,
                "token": "▁▁▁▁"
            }
        ],
        "prob": 0.2960575222969055,
        "token": "\n"
    },
    {
        "log_prob": -0.010557042434811592,
        "predicted_tokens": [
            {
                "log_prob": 18.915523529052734,
                "prob": 164024032,
                "token": "▁▁▁"
            },
            {
                "log_prob": 13.279379844665527,
                "prob": 585007.4375,
                "token": "#"
            },
            {
                "log_prob": 12.939409255981445,
                "prob": 416403.1875,
                "token": "▁▁▁▁▁▁▁"
            },
            {
                "log_prob": 12.160179138183594,
                "prob": 191028.734375,
                "token": "def"
            },
            {
                "log_prob": 12.012555122375488,
                "prob": 164811.078125,
                "token": "input"
            }
        ],
        "prob": 0.989498496055603,
        "token": "  "
    },
    {
        "log_prob": -1.5300625562667847,
        "predicted_tokens": [
            {
                "log_prob": 12.967878341674805,
                "prob": 428428.15625,
                "token": "▁if"
            },
            {
                "log_prob": 12.669702529907227,
                "prob": 317966.90625,
                "token": "▁#"
            },
            {
                "log_prob": 11.939369201660156,
                "prob": 153180.03125,
                "token": "▁try"
            },
            {
                "log_prob": 11.89887809753418,
                "prob": 147101.5,
                "token": "▁result"
            },
            {
                "log_prob": 11.648962020874023,
                "prob": 114572.3828125,
                "token": "▁output"
            }
        ],
        "prob": 0.21652212738990784,
        "token": "if"
    },
    {
        "log_prob": -1.573243260383606,
        "predicted_tokens": [
            {
                "log_prob": 16.893362045288086,
                "prob": 21711704,
                "token": "▁len"
            },
            {
                "log_prob": 16.036706924438477,
                "prob": 9218353,
                "token": "▁not"
            },
            {
                "log_prob": 15.766570091247559,
                "prob": 7036138.5,
                "token": "▁'"
            },
            {
                "log_prob": 14.751360893249512,
                "prob": 2549380.25,
                "token": "▁input"
            },
            {
                "log_prob": 13.92320442199707,
                "prob": 1113706.75,
                "token": "▁type"
            }
        ],
        "prob": 0.2073715329170227,
        "token": "not"
    },
    {
        "log_prob": -1.632727026939392,
        "predicted_tokens": [
            {
                "log_prob": 15.876272201538086,
                "prob": 7851947.5,
                "token": "▁input"
            },
            {
                "log_prob": 14.832673072814941,
                "prob": 2765337.25,
                "token": "▁isinstance"
            },
            {
                "log_prob": 14.06803035736084,
                "prob": 1287265,
                "token": "▁all"
            },
            {
                "log_prob": 13.331192016601562,
                "prob": 616116.9375,
                "token": "▁re"
            },
            {
                "log_prob": 13.287863731384277,
                "prob": 589991.6875,
                "token": "▁("
            }
        ],
        "prob": 0.19539597630500793,
        "token": "isinstance"
    },
    {
        "log_prob": -0.00011514954530866817,
        "predicted_tokens": [
            {
                "log_prob": 22.900367736816406,
                "prob": 8820705280,
                "token": "("
            },
            {
                "log_prob": 13.104000091552734,
                "prob": 490902.125,
                "token": "▁("
            },
            {
                "log_prob": 12.339202880859375,
                "prob": 228479.765625,
                "token": "(\\"
            },
            {
                "log_prob": 11.788756370544434,
                "prob": 131762.5,
                "token": "(("
            },
            {
                "log_prob": 10.377915382385254,
                "prob": 32141.88671875,
                "token": "('"
            }
        ],
        "prob": 0.999884843826294,
        "token": "("
    },
    {
        "log_prob": -0.003371628001332283,
        "predicted_tokens": [
            {
                "log_prob": 21.552051544189453,
                "prob": 2290535680,
                "token": "input"
            },
            {
                "log_prob": 15.355412483215332,
                "prob": 4664133,
                "token": "eval"
            },
            {
                "log_prob": 14.286236763000488,
                "prob": 1601156.625,
                "token": "int"
            },
            {
                "log_prob": 12.364952087402344,
                "prob": 234439.328125,
                "token": "len"
            },
            {
                "log_prob": 11.977835655212402,
                "prob": 159187.125,
                "token": "float"
            }
        ],
        "prob": 0.9966340661048889,
        "token": "input"
    },
    {
        "log_prob": -0.00002253030106658116,
        "predicted_tokens": [
            {
                "log_prob": 24.61043357849121,
                "prob": 48772554752,
                "token": "_"
            },
            {
                "log_prob": 13.403416633605957,
                "prob": 662262.0625,
                "token": ","
            },
            {
                "log_prob": 12.402612686157227,
                "prob": 243436.8125,
                "token": "<0x0A>"
            },
            {
                "log_prob": 10.888298034667969,
                "prob": 53546.08984375,
                "token": "\\_"
            },
            {
                "log_prob": 10.725821495056152,
                "prob": 45516.1015625,
                "token": "Str"
            }
        ],
        "prob": 0.9999774694442749,
        "token": "_"
    },
    {
        "log_prob": -0.000007748573807475623,
        "predicted_tokens": [
            {
                "log_prob": 27.27821922302246,
                "prob": 702716444672,
                "token": "str"
            },
            {
                "log_prob": 14.958273887634277,
                "prob": 3135420.5,
                "token": "▁str"
            },
            {
                "log_prob": 13.212810516357422,
                "prob": 547331.8125,
                "token": "string"
            },
            {
                "log_prob": 12.412572860717773,
                "prob": 245873.59375,
                "token": "arr"
            },
            {
                "log_prob": 12.387200355529785,
                "prob": 239713.65625,
                "token": "int"
            }
        ],
        "prob": 0.9999922513961792,
        "token": "str"
    },
    {
        "log_prob": -0.004668764304369688,
        "predicted_tokens": [
            {
                "log_prob": 21.05514144897461,
                "prob": 1393579520,
                "token": ","
            },
            {
                "log_prob": 15.226974487304688,
                "prob": 4101956.25,
                "token": "."
            },
            {
                "log_prob": 14.347532272338867,
                "prob": 1702370.625,
                "token": "["
            },
            {
                "log_prob": 12.602849006652832,
                "prob": 297404.65625,
                "token": "[:"
            },
            {
                "log_prob": 12.149452209472656,
                "prob": 188990.546875,
                "token": ",("
            }
        ],
        "prob": 0.9953420758247375,
        "token": ","
    },
    {
        "log_prob": -0.07438626885414124,
        "predicted_tokens": [
            {
                "log_prob": 20.455623626708984,
                "prob": 765181568,
                "token": "▁str"
            },
            {
                "log_prob": 17.841352462768555,
                "prob": 56027460,
                "token": "▁("
            },
            {
                "log_prob": 14.638457298278809,
                "prob": 2277200.5,
                "token": "str"
            },
            {
                "log_prob": 12.943220138549805,
                "prob": 417993.0625,
                "token": "▁string"
            },
            {
                "log_prob": 11.71904468536377,
                "prob": 122889.96875,
                "token": "▁type"
            }
        ],
        "prob": 0.9283130168914795,
        "token": "str"
    },
    {
        "log_prob": -0.04898764565587044,
        "predicted_tokens": [
            {
                "log_prob": 20.693342208862305,
                "prob": 970519616,
                "token": "):"
            },
            {
                "log_prob": 17.695058822631836,
                "prob": 48402348,
                "token": ")"
            },
            {
                "log_prob": 11.759181022644043,
                "prob": 127922.6484375,
                "token": "):\r"
            },
            {
                "log_prob": 11.08315658569336,
                "prob": 65065.94921875,
                "token": ")\\"
            },
            {
                "log_prob": 10.948421478271484,
                "prob": 56864.21484375,
                "token": ")):"
            }
        ],
        "prob": 0.9521928429603577,
        "token": "):"
    },
    {
        "log_prob": -0.0003875934926327318,
        "predicted_tokens": [
            {
                "log_prob": 23.254257202148438,
                "prob": 12565957632,
                "token": "<0x0A>"
            },
            {
                "log_prob": 14.188718795776367,
                "prob": 1452386.75,
                "token": "▁#"
            },
            {
                "log_prob": 14.159031867980957,
                "prob": 1409903.625,
                "token": "▁"
            },
            {
                "log_prob": 12.964025497436523,
                "prob": 426780.65625,
                "token": "▁▁▁"
            },
            {
                "log_prob": 12.72131633758545,
                "prob": 334809.28125,
                "token": "▁▁▁▁"
            }
        ],
        "prob": 0.9996125102043152,
        "token": "\n"
    },
    {
        "log_prob": -0.00031609306461177766,
        "predicted_tokens": [
            {
                "log_prob": 23.593027114868164,
                "prob": 17632808960,
                "token": "▁▁▁▁▁▁▁"
            },
            {
                "log_prob": 14.5665864944458,
                "prob": 2119279,
                "token": "▁▁▁▁▁▁▁▁"
            },
            {
                "log_prob": 14.26205062866211,
                "prob": 1562895.375,
                "token": "▁▁▁▁▁▁"
            },
            {
                "log_prob": 13.600960731506348,
                "prob": 806904.625,
                "token": "▁▁▁▁▁▁▁▁▁▁▁"
            },
            {
                "log_prob": 12.8941068649292,
                "prob": 397960.03125,
                "token": "▁▁▁▁▁"
            }
        ],
        "prob": 0.9996839165687561,
        "token": "      "
    },
    {
        "log_prob": -7.651546478271484,
        "predicted_tokens": [
            {
                "log_prob": 20.536279678344727,
                "prob": 829455232,
                "token": "▁raise"
            },
            {
                "log_prob": 12.8871431350708,
                "prob": 395198.375,
                "token": "▁return"
            },
            {
                "log_prob": 12.750988960266113,
                "prob": 344892.8125,
                "token": "▁type"
            },
            {
                "log_prob": 12.651717185974121,
                "prob": 312299.25,
                "token": "▁input"
            },
            {
                "log_prob": 12.430572509765625,
                "prob": 250339.3125,
                "token": "▁try"
            }
        ],
        "prob": 0.0004753085086122155,
        "token": "return"
    },
    {
        "log_prob": -7.708529472351074,
        "predicted_tokens": [
            {
                "log_prob": 16.387365341186523,
                "prob": 13090081,
                "token": "▁\""
            },
            {
                "log_prob": 14.08403491973877,
                "prob": 1308032.875,
                "token": "▁'"
            },
            {
                "log_prob": 13.039331436157227,
                "prob": 460160.875,
                "token": "▁Type"
            },
            {
                "log_prob": 12.607600212097168,
                "prob": 298821.0625,
                "token": "▁type"
            },
            {
                "log_prob": 12.30757999420166,
                "prob": 221367.609375,
                "token": "▁None"
            }
        ],
        "prob": 0.0004489812417887151,
        "token": "("
    },
    {
        "log_prob": -3.456796169281006,
        "predicted_tokens": [
            {
                "log_prob": 14.598790168762207,
                "prob": 2188638.5,
                "token": "Type"
            },
            {
                "log_prob": 13.502143859863281,
                "prob": 730981.8125,
                "token": "type"
            },
            {
                "log_prob": 13.232523918151855,
                "prob": 558228.625,
                "token": "input"
            },
            {
                "log_prob": 13.069612503051758,
                "prob": 474308.125,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.743492126464844,
                "prob": 342316.875,
                "token": "f"
            }
        ],
        "prob": 0.03153061866760254,
        "token": "None"
    },
    {
        "log_prob": -0.07795774936676025,
        "predicted_tokens": [
            {
                "log_prob": 19.63550567626953,
                "prob": 336970432,
                "token": ","
            },
            {
                "log_prob": 17.089033126831055,
                "prob": 26404188,
                "token": ")"
            },
            {
                "log_prob": 12.61305046081543,
                "prob": 300454.15625,
                "token": ",\\"
            },
            {
                "log_prob": 12.486098289489746,
                "prob": 264632.75,
                "token": "▁if"
            },
            {
                "log_prob": 11.796774864196777,
                "prob": 132823.28125,
                "token": ",\""
            }
        ],
        "prob": 0.9250034689903259,
        "token": ","
    },
    {
        "log_prob": -5.459795951843262,
        "predicted_tokens": [
            {
                "log_prob": 16.974069595336914,
                "prob": 23536656,
                "token": "▁\""
            },
            {
                "log_prob": 15.954819679260254,
                "prob": 8493568,
                "token": "▁Type"
            },
            {
                "log_prob": 15.8871488571167,
                "prob": 7937817,
                "token": "▁'"
            },
            {
                "log_prob": 12.886885643005371,
                "prob": 395096.625,
                "token": "▁\\\""
            },
            {
                "log_prob": 12.080300331115723,
                "prob": 176363.125,
                "token": "▁None"
            }
        ],
        "prob": 0.004254424013197422,
        "token": "None"
    },
    {
        "log_prob": -2.5203440189361572,
        "predicted_tokens": [
            {
                "log_prob": 21.839929580688477,
                "prob": 3054646272,
                "token": ")"
            },
            {
                "log_prob": 19.403629302978516,
                "prob": 267232416,
                "token": ","
            },
            {
                "log_prob": 12.06301498413086,
                "prob": 173340.828125,
                "token": ")\\"
            },
            {
                "log_prob": 11.440196990966797,
                "prob": 92985.328125,
                "token": "),"
            },
            {
                "log_prob": 11.409875869750977,
                "prob": 90208.21875,
                "token": ",\\"
            }
        ],
        "prob": 0.08043193072080612,
        "token": ","
    },
    {
        "log_prob": -0.7783777713775635,
        "predicted_tokens": [
            {
                "log_prob": 16.705711364746094,
                "prob": 17996922,
                "token": "▁None"
            },
            {
                "log_prob": 16.31275177001953,
                "prob": 12148932,
                "token": "▁\""
            },
            {
                "log_prob": 15.738724708557129,
                "prob": 6842917.5,
                "token": "▁'"
            },
            {
                "log_prob": 13.558065414428711,
                "prob": 773024.0625,
                "token": "▁Type"
            },
            {
                "log_prob": 12.403965950012207,
                "prob": 243766.46875,
                "token": "▁input"
            }
        ],
        "prob": 0.4591502547264099,
        "token": "None"
    },
    {
        "log_prob": -3.218170642852783,
        "predicted_tokens": [
            {
                "log_prob": 22.427995681762695,
                "prob": 5499899904,
                "token": ")"
            },
            {
                "log_prob": 19.25086212158203,
                "prob": 229373472,
                "token": ","
            },
            {
                "log_prob": 12.707372665405273,
                "prob": 330173.1875,
                "token": ")\\"
            },
            {
                "log_prob": 11.899977684020996,
                "prob": 147263.34375,
                "token": ",\\"
            },
            {
                "log_prob": 11.841547012329102,
                "prob": 138905.203125,
                "token": "),"
            }
        ],
        "prob": 0.04002821817994118,
        "token": ","
    },
    {
        "log_prob": -0.39353471994400024,
        "predicted_tokens": [
            {
                "log_prob": 16.829975128173828,
                "prob": 20378178,
                "token": "▁None"
            },
            {
                "log_prob": 15.570653915405273,
                "prob": 5784277,
                "token": "▁\""
            },
            {
                "log_prob": 14.726479530334473,
                "prob": 2486731,
                "token": "▁'"
            },
            {
                "log_prob": 12.482892990112305,
                "prob": 263785.90625,
                "token": "▁Type"
            },
            {
                "log_prob": 12.337121963500977,
                "prob": 228004.796875,
                "token": "▁"
            }
        ],
        "prob": 0.6746679544448853,
        "token": "None"
    },
    {
        "log_prob": -1.8588627576828003,
        "predicted_tokens": [
            {
                "log_prob": 20.7327823638916,
                "prob": 1009561984,
                "token": ")"
            },
            {
                "log_prob": 19.043912887573242,
                "prob": 186494592,
                "token": ","
            },
            {
                "log_prob": 12.160722732543945,
                "prob": 191132.609375,
                "token": ")\\"
            },
            {
                "log_prob": 11.567137718200684,
                "prob": 105570.8671875,
                "token": ",\\"
            },
            {
                "log_prob": 10.891825675964355,
                "prob": 53735.31640625,
                "token": "),"
            }
        ],
        "prob": 0.15584976971149445,
        "token": ","
    },
    {
        "log_prob": -0.14563266932964325,
        "predicted_tokens": [
            {
                "log_prob": 17.5072021484375,
                "prob": 40112644,
                "token": "▁None"
            },
            {
                "log_prob": 14.900985717773438,
                "prob": 2960846.25,
                "token": "▁\""
            },
            {
                "log_prob": 14.460433006286621,
                "prob": 1905839.25,
                "token": "▁'"
            },
            {
                "log_prob": 12.881477355957031,
                "prob": 392965.59375,
                "token": "▁"
            },
            {
                "log_prob": 12.551530838012695,
                "prob": 282527.40625,
                "token": "▁False"
            }
        ],
        "prob": 0.8644752502441406,
        "token": "None"
    },
    {
        "log_prob": -1.8799906969070435,
        "predicted_tokens": [
            {
                "log_prob": 20.813064575195312,
                "prob": 1093954048,
                "token": ")"
            },
            {
                "log_prob": 19.099523544311523,
                "prob": 197159488,
                "token": ","
            },
            {
                "log_prob": 13.124323844909668,
                "prob": 500981.1875,
                "token": ")\\"
            },
            {
                "log_prob": 12.396244049072266,
                "prob": 241891.375,
                "token": ",\\"
            },
            {
                "log_prob": 10.488470077514648,
                "prob": 35899.19140625,
                "token": "),"
            }
        ],
        "prob": 0.1525915265083313,
        "token": ","
    },
    {
        "log_prob": -0.08120859414339066,
        "predicted_tokens": [
            {
                "log_prob": 17.391904830932617,
                "prob": 35744424,
                "token": "▁None"
            },
            {
                "log_prob": 13.854401588439941,
                "prob": 1039657.125,
                "token": "▁\""
            },
            {
                "log_prob": 13.463606834411621,
                "prob": 703347.875,
                "token": "▁'"
            },
            {
                "log_prob": 12.82056999206543,
                "prob": 369745.40625,
                "token": "▁"
            },
            {
                "log_prob": 12.256084442138672,
                "prob": 210256.71875,
                "token": "▁input"
            }
        ],
        "prob": 0.9220013618469238,
        "token": "None"
    },
    {
        "log_prob": -1.1909165382385254,
        "predicted_tokens": [
            {
                "log_prob": 19.5910701751709,
                "prob": 322324768,
                "token": ")"
            },
            {
                "log_prob": 18.76396942138672,
                "prob": 140957568,
                "token": ","
            },
            {
                "log_prob": 12.314806938171387,
                "prob": 222973.21875,
                "token": ")\\"
            },
            {
                "log_prob": 11.758116722106934,
                "prob": 127786.5625,
                "token": ",\\"
            },
            {
                "log_prob": 9.903874397277832,
                "prob": 20007.73828125,
                "token": ");"
            }
        ],
        "prob": 0.30394256114959717,
        "token": ","
    },
    {
        "log_prob": -0.06453678756952286,
        "predicted_tokens": [
            {
                "log_prob": 17.4017276763916,
                "prob": 36097264,
                "token": "▁None"
            },
            {
                "log_prob": 13.219289779663086,
                "prob": 550889.625,
                "token": "▁\""
            },
            {
                "log_prob": 13.04227352142334,
                "prob": 461516.6875,
                "token": "▁input"
            },
            {
                "log_prob": 12.96446418762207,
                "prob": 426967.9375,
                "token": "▁'"
            },
            {
                "log_prob": 12.420269012451172,
                "prob": 247773.1875,
                "token": "▁"
            }
        ],
        "prob": 0.9375016093254089,
        "token": "None"
    },
    {
        "log_prob": -1.0370965003967285,
        "predicted_tokens": [
            {
                "log_prob": 19.03616714477539,
                "prob": 185055648,
                "token": ","
            },
            {
                "log_prob": 18.43794822692871,
                "prob": 101741744,
                "token": ")"
            },
            {
                "log_prob": 11.54367733001709,
                "prob": 103122.9609375,
                "token": ")\\"
            },
            {
                "log_prob": 10.627504348754883,
                "prob": 41254.0390625,
                "token": ",\\"
            },
            {
                "log_prob": 8.989545822143555,
                "prob": 8018.814453125,
                "token": ");"
            }
        ],
        "prob": 0.35448241233825684,
        "token": ")"
    },
    {
        "log_prob": -0.02531484328210354,
        "predicted_tokens": [
            {
                "log_prob": 20.724855422973633,
                "prob": 1001590912,
                "token": "<0x0A>"
            },
            {
                "log_prob": 16.796661376953125,
                "prob": 19710486,
                "token": "▁#"
            },
            {
                "log_prob": 15.27359676361084,
                "prob": 4297727,
                "token": "▁"
            },
            {
                "log_prob": 12.885207176208496,
                "prob": 394434.03125,
                "token": "▁\\"
            },
            {
                "log_prob": 12.363719940185547,
                "prob": 234150.640625,
                "token": "▁▁"
            }
        ],
        "prob": 0.9750028252601624,
        "token": "\n"
    },
    {
        "log_prob": -0.09313692897558212,
        "predicted_tokens": [
            {
                "log_prob": 18.964984893798828,
                "prob": 172340880,
                "token": "<0x0A>"
            },
            {
                "log_prob": 15.57905387878418,
                "prob": 5833069,
                "token": "▁▁▁"
            },
            {
                "log_prob": 15.179778099060059,
                "prob": 3912856,
                "token": "▁▁▁▁▁▁▁▁"
            },
            {
                "log_prob": 15.024748802185059,
                "prob": 3350931,
                "token": "▁▁▁▁▁▁▁"
            },
            {
                "log_prob": 14.993066787719727,
                "prob": 3246431,
                "token": "▁▁▁▁"
            }
        ],
        "prob": 0.9110687971115112,
        "token": "\n"
    },
    {
        "log_prob": -0.0012837749673053622,
        "predicted_tokens": [
            {
                "log_prob": 20.15671157836914,
                "prob": 567477440,
                "token": "▁▁▁"
            },
            {
                "log_prob": 12.295089721679688,
                "prob": 218619.859375,
                "token": "#"
            },
            {
                "log_prob": 12.211714744567871,
                "prob": 201131.625,
                "token": "▁▁▁▁▁▁▁"
            },
            {
                "log_prob": 10.678183555603027,
                "prob": 43398.64453125,
                "token": "▁▁"
            },
            {
                "log_prob": 10.638728141784668,
                "prob": 41719.67578125,
                "token": "<0x09>"
            }
        ],
        "prob": 0.9987170696258545,
        "token": "  "
    },
    {
        "log_prob": -8.65186595916748,
        "predicted_tokens": [
            {
                "log_prob": 12.738753318786621,
                "prob": 340698.53125,
                "token": "▁if"
            },
            {
                "log_prob": 11.916050910949707,
                "prob": 149649.46875,
                "token": "▁input"
            },
            {
                "log_prob": 11.74116325378418,
                "prob": 125638.40625,
                "token": "▁words"
            },
            {
                "log_prob": 11.645271301269531,
                "prob": 114150.3046875,
                "token": "▁#"
            },
            {
                "log_prob": 11.324075698852539,
                "prob": 82791.0859375,
                "token": "▁try"
            }
        ],
        "prob": 0.00017480037058703601,
        "token": "original"
    },
    {
        "log_prob": -0.16632620990276337,
        "predicted_tokens": [
            {
                "log_prob": 19.253480911254883,
                "prob": 229974944,
                "token": "_"
            },
            {
                "log_prob": 17.434648513793945,
                "prob": 37305396,
                "token": "▁="
            },
            {
                "log_prob": 14.337624549865723,
                "prob": 1685587.25,
                "token": ","
            },
            {
                "log_prob": 14.15656852722168,
                "prob": 1406434.75,
                "token": "Str"
            },
            {
                "log_prob": 13.409353256225586,
                "prob": 666205.375,
                "token": "String"
            }
        ],
        "prob": 0.8467699885368347,
        "token": "_"
    },
    {
        "log_prob": -0.33222660422325134,
        "predicted_tokens": [
            {
                "log_prob": 19.699697494506836,
                "prob": 359310496,
                "token": "str"
            },
            {
                "log_prob": 18.37485694885254,
                "prob": 95521032,
                "token": "string"
            },
            {
                "log_prob": 17.193737030029297,
                "prob": 29318730,
                "token": "input"
            },
            {
                "log_prob": 14.906237602233887,
                "prob": 2976437.5,
                "token": "length"
            },
            {
                "log_prob": 14.633127212524414,
                "prob": 2265095,
                "token": "list"
            }
        ],
        "prob": 0.7173247933387756,
        "token": "str"
    },
    {
        "log_prob": -0.020119164139032364,
        "predicted_tokens": [
            {
                "log_prob": 21.205686569213867,
                "prob": 1619991296,
                "token": "▁="
            },
            {
                "log_prob": 17.093711853027344,
                "prob": 26528016,
                "token": ","
            },
            {
                "log_prob": 15.281342506408691,
                "prob": 4331145,
                "token": "_"
            },
            {
                "log_prob": 12.91429328918457,
                "prob": 406075.0625,
                "token": "▁"
            },
            {
                "log_prob": 12.762843132019043,
                "prob": 349005.5625,
                "token": "▁▁▁▁"
            }
        ],
        "prob": 0.9800819158554077,
        "token": "="
    },
    {
        "log_prob": -0.026782555505633354,
        "predicted_tokens": [
            {
                "log_prob": 19.524375915527344,
                "prob": 301528736,
                "token": "▁input"
            },
            {
                "log_prob": 15.798384666442871,
                "prob": 7263590,
                "token": "▁str"
            },
            {
                "log_prob": 12.12549877166748,
                "prob": 184517.34375,
                "token": "▁list"
            },
            {
                "log_prob": 11.935773849487305,
                "prob": 152630.296875,
                "token": "▁''"
            },
            {
                "log_prob": 11.925013542175293,
                "prob": 150996.75,
                "token": "▁\"\""
            }
        ],
        "prob": 0.9735729098320007,
        "token": "input"
    },
    {
        "log_prob": -0.000006198863957251888,
        "predicted_tokens": [
            {
                "log_prob": 25.690860748291016,
                "prob": 143680913408,
                "token": "_"
            },
            {
                "log_prob": 13.12075424194336,
                "prob": 499196.0625,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.468404769897461,
                "prob": 95645.578125,
                "token": "."
            },
            {
                "log_prob": 11.165091514587402,
                "prob": 70621.609375,
                "token": "\\_"
            },
            {
                "log_prob": 11.129779815673828,
                "prob": 68171.359375,
                "token": "_."
            }
        ],
        "prob": 0.9999938607215881,
        "token": "_"
    },
    {
        "log_prob": -0.000024199192921514623,
        "predicted_tokens": [
            {
                "log_prob": 28.051584243774414,
                "prob": 1522818875392,
                "token": "str"
            },
            {
                "log_prob": 16.966724395751953,
                "prob": 23364406,
                "token": "string"
            },
            {
                "log_prob": 15.823568344116211,
                "prob": 7448836.5,
                "token": "▁str"
            },
            {
                "log_prob": 14.268754005432129,
                "prob": 1573407.25,
                "token": "stra"
            },
            {
                "log_prob": 13.48723030090332,
                "prob": 720161.1875,
                "token": "strings"
            }
        ],
        "prob": 0.9999758005142212,
        "token": "str"
    },
    {
        "log_prob": -0.2418411523103714,
        "predicted_tokens": [
            {
                "log_prob": 18.869752883911133,
                "prob": 156685776,
                "token": "<0x0A>"
            },
            {
                "log_prob": 17.35709571838379,
                "prob": 34521596,
                "token": "."
            },
            {
                "log_prob": 15.61058521270752,
                "prob": 6019924,
                "token": "[:"
            },
            {
                "log_prob": 13.717212677001953,
                "prob": 906378.875,
                "token": "▁#"
            },
            {
                "log_prob": 12.805846214294434,
                "prob": 364341.25,
                "token": "▁+"
            }
        ],
        "prob": 0.7851808667182922,
        "token": "\n"
    },
    {
        "log_prob": -0.21920935809612274,
        "predicted_tokens": [
            {
                "log_prob": 18.375877380371094,
                "prob": 95618552,
                "token": "▁▁▁"
            },
            {
                "log_prob": 16.96131134033203,
                "prob": 23238276,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.557531356811523,
                "prob": 104561.5703125,
                "token": "``"
            },
            {
                "log_prob": 10.892255783081055,
                "prob": 53758.4296875,
                "token": "▁▁▁▁"
            },
            {
                "log_prob": 9.179463386535645,
                "prob": 9695.9482421875,
                "token": "<0x09>"
            }
        ],
        "prob": 0.8031536340713501,
        "token": "  "
    },
    {
        "log_prob": -3.2999680042266846,
        "predicted_tokens": [
            {
                "log_prob": 11.791206359863281,
                "prob": 132085.71875,
                "token": "▁v"
            },
            {
                "log_prob": 11.214865684509277,
                "prob": 74225.6953125,
                "token": "▁input"
            },
            {
                "log_prob": 11.088905334472656,
                "prob": 65441.0703125,
                "token": "▁lower"
            },
            {
                "log_prob": 10.913687705993652,
                "prob": 54923.015625,
                "token": "▁revers"
            },
            {
                "log_prob": 10.72107219696045,
                "prob": 45300.4453125,
                "token": "▁stripped"
            }
        ],
        "prob": 0.03688434511423111,
        "token": "str"
    },
    {
        "log_prob": -0.007932824082672596,
        "predicted_tokens": [
            {
                "log_prob": 18.778841018676758,
                "prob": 143069504,
                "token": "_"
            },
            {
                "log_prob": 13.30506420135498,
                "prob": 600227.625,
                "token": "1"
            },
            {
                "log_prob": 12.003165245056152,
                "prob": 163270.765625,
                "token": "▁="
            },
            {
                "log_prob": 11.544638633728027,
                "prob": 103222.140625,
                "token": "list"
            },
            {
                "log_prob": 10.737190246582031,
                "prob": 46036.51953125,
                "token": "Length"
            }
        ],
        "prob": 0.9920985102653503,
        "token": "_"
    },
    {
        "log_prob": -1.1277439594268799,
        "predicted_tokens": [
            {
                "log_prob": 15.759498596191406,
                "prob": 6986558,
                "token": "length"
            },
            {
                "log_prob": 15.653388977050781,
                "prob": 6283193.5,
                "token": "list"
            },
            {
                "log_prob": 14.964027404785156,
                "prob": 3153512.5,
                "token": "len"
            },
            {
                "log_prob": 13.385194778442383,
                "prob": 650303.75,
                "token": "without"
            },
            {
                "log_prob": 12.973501205444336,
                "prob": 430843.9375,
                "token": "split"
            }
        ],
        "prob": 0.3237628638744354,
        "token": "length"
    },
    {
        "log_prob": -0.004354756325483322,
        "predicted_tokens": [
            {
                "log_prob": 21.557022094726562,
                "prob": 2301949184,
                "token": "▁="
            },
            {
                "log_prob": 15.467666625976562,
                "prob": 5218218.5,
                "token": "_"
            },
            {
                "log_prob": 14.829282760620117,
                "prob": 2755977.5,
                "token": ","
            },
            {
                "log_prob": 12.936054229736328,
                "prob": 415008.46875,
                "token": "▁"
            },
            {
                "log_prob": 12.406426429748535,
                "prob": 244366.984375,
                "token": "▁▁▁▁"
            }
        ],
        "prob": 0.9956547617912292,
        "token": "="
    },
    {
        "log_prob": -0.001128632458858192,
        "predicted_tokens": [
            {
                "log_prob": 21.558948516845703,
                "prob": 2306387968,
                "token": "▁len"
            },
            {
                "log_prob": 13.579005241394043,
                "prob": 789381.6875,
                "token": "▁str"
            },
            {
                "log_prob": 13.063871383666992,
                "prob": 471592.875,
                "token": "▁int"
            },
            {
                "log_prob": 13.052507400512695,
                "prob": 466264.0625,
                "token": "▁"
            },
            {
                "log_prob": 12.77397632598877,
                "prob": 352912.8125,
                "token": "▁input"
            }
        ],
        "prob": 0.9988720417022705,
        "token": "len"
    },
    {
        "log_prob": -0.00003886147169396281,
        "predicted_tokens": [
            {
                "log_prob": 25.15312385559082,
                "prob": 83919503360,
                "token": "("
            },
            {
                "log_prob": 13.786539077758789,
                "prob": 971444.125,
                "token": "(("
            },
            {
                "log_prob": 13.463252067565918,
                "prob": 703098.3125,
                "token": "▁("
            },
            {
                "log_prob": 12.598868370056152,
                "prob": 296223.15625,
                "token": "('"
            },
            {
                "log_prob": 12.469925880432129,
                "prob": 260387.421875,
                "token": "(\""
            }
        ],
        "prob": 0.9999611377716064,
        "token": "("
    },
    {
        "log_prob": -0.0018172431737184525,
        "predicted_tokens": [
            {
                "log_prob": 23.9840087890625,
                "prob": 26068897792,
                "token": "input"
            },
            {
                "log_prob": 17.20524024963379,
                "prob": 29657934,
                "token": "original"
            },
            {
                "log_prob": 16.51618766784668,
                "prob": 14889810,
                "token": "str"
            },
            {
                "log_prob": 13.573744773864746,
                "prob": 785240,
                "token": "origin"
            },
            {
                "log_prob": 12.759408950805664,
                "prob": 347809.0625,
                "token": "list"
            }
        ],
        "prob": 0.9981843829154968,
        "token": "input"
    },
    {
        "log_prob": -8.344646857949556e-7,
        "predicted_tokens": [
            {
                "log_prob": 28.355438232421875,
                "prob": 2063527968768,
                "token": "_"
            },
            {
                "log_prob": 14.107008934020996,
                "prob": 1338431.5,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.463886260986328,
                "prob": 258819.515625,
                "token": "\\_"
            },
            {
                "log_prob": 11.886930465698242,
                "prob": 145354.4375,
                "token": ")"
            },
            {
                "log_prob": 11.607205390930176,
                "prob": 109886.734375,
                "token": "_)"
            }
        ],
        "prob": 0.9999991059303284,
        "token": "_"
    },
    {
        "log_prob": -0.000030874729418428615,
        "predicted_tokens": [
            {
                "log_prob": 28.301488876342773,
                "prob": 1955151740928,
                "token": "str"
            },
            {
                "log_prob": 17.150611877441406,
                "prob": 28081228,
                "token": "string"
            },
            {
                "log_prob": 16.1378116607666,
                "prob": 10199116,
                "token": "▁str"
            },
            {
                "log_prob": 15.903806686401367,
                "prob": 8071151,
                "token": "stra"
            },
            {
                "log_prob": 15.693427085876465,
                "prob": 6539865.5,
                "token": "STR"
            }
        ],
        "prob": 0.9999691247940063,
        "token": "str"
    },
    {
        "log_prob": -0.004666035063564777,
        "predicted_tokens": [
            {
                "log_prob": 23.4093074798584,
                "prob": 14673477632,
                "token": ")"
            },
            {
                "log_prob": 18.028230667114258,
                "prob": 67540008,
                "token": "."
            },
            {
                "log_prob": 12.005636215209961,
                "prob": 163674.703125,
                "token": "▁+"
            },
            {
                "log_prob": 11.930867195129395,
                "prob": 151883.21875,
                "token": "▁or"
            },
            {
                "log_prob": 11.782291412353516,
                "prob": 130913.4140625,
                "token": ")*"
            }
        ],
        "prob": 0.9953448176383972,
        "token": ")"
    },
    {
        "log_prob": -0.005668399389833212,
        "predicted_tokens": [
            {
                "log_prob": 21.22043800354004,
                "prob": 1644065664,
                "token": "<0x0A>"
            },
            {
                "log_prob": 15.250592231750488,
                "prob": 4199988,
                "token": "▁+"
            },
            {
                "log_prob": 14.228978157043457,
                "prob": 1512051.875,
                "token": "▁#"
            },
            {
                "log_prob": 13.823929786682129,
                "prob": 1008454.75,
                "token": "▁if"
            },
            {
                "log_prob": 13.36159896850586,
                "prob": 635138.875,
                "token": "▁-"
            }
        ],
        "prob": 0.9943476915359497,
        "token": "\n"
    },
    {
        "log_prob": -0.7077038884162903,
        "predicted_tokens": [
            {
                "log_prob": 16.391624450683594,
                "prob": 13145952,
                "token": "<0x0A>"
            },
            {
                "log_prob": 16.382532119750977,
                "prob": 13026967,
                "token": "▁▁▁"
            },
            {
                "log_prob": 11.993775367736816,
                "prob": 161744.84375,
                "token": "▁▁▁▁"
            },
            {
                "log_prob": 11.265836715698242,
                "prob": 78107.1328125,
                "token": "``"
            },
            {
                "log_prob": 8.439077377319336,
                "prob": 4624.2861328125,
                "token": "▁▁"
            }
        ],
        "prob": 0.4927743673324585,
        "token": "  "
    },
    {
        "log_prob": -0.7140076160430908,
        "predicted_tokens": [
            {
                "log_prob": 13.551884651184082,
                "prob": 768260.875,
                "token": "▁v"
            },
            {
                "log_prob": 11.34257698059082,
                "prob": 84337.09375,
                "token": "▁lower"
            },
            {
                "log_prob": 11.342498779296875,
                "prob": 84330.4921875,
                "token": "▁first"
            },
            {
                "log_prob": 11.217527389526367,
                "prob": 74423.5234375,
                "token": "▁str"
            },
            {
                "log_prob": 10.902739524841309,
                "prob": 54324.98828125,
                "token": "▁is"
            }
        ],
        "prob": 0.4896778464317322,
        "token": "v"
    },
    {
        "log_prob": -0.001416275859810412,
        "predicted_tokens": [
            {
                "log_prob": 21.60015106201172,
                "prob": 2403401984,
                "token": "ow"
            },
            {
                "log_prob": 14.513811111450195,
                "prob": 2010333.5,
                "token": "ov"
            },
            {
                "log_prob": 12.756179809570312,
                "prob": 346687.75,
                "token": "_"
            },
            {
                "log_prob": 12.565607070922852,
                "prob": 286532.4375,
                "token": "eto"
            },
            {
                "log_prob": 12.500100135803223,
                "prob": 268364.15625,
                "token": "1"
            }
        ],
        "prob": 0.9985847473144531,
        "token": "ow"
    },
    {
        "log_prob": -0.01521939318627119,
        "predicted_tokens": [
            {
                "log_prob": 21.70341682434082,
                "prob": 2664858624,
                "token": "els"
            },
            {
                "log_prob": 17.514440536499023,
                "prob": 40404048,
                "token": "el"
            },
            {
                "log_prob": 11.434281349182129,
                "prob": 92436.8828125,
                "token": "ells"
            },
            {
                "log_prob": 11.313082695007324,
                "prob": 81885.953125,
                "token": "les"
            },
            {
                "log_prob": 10.927658081054688,
                "prob": 55695.6953125,
                "token": "ls"
            }
        ],
        "prob": 0.9848958849906921,
        "token": "els"
    },
    {
        "log_prob": -0.07775747776031494,
        "predicted_tokens": [
            {
                "log_prob": 21.391054153442383,
                "prob": 1949920000,
                "token": "▁="
            },
            {
                "log_prob": 18.865840911865234,
                "prob": 156074016,
                "token": "_"
            },
            {
                "log_prob": 13.831992149353027,
                "prob": 1016618.1875,
                "token": ","
            },
            {
                "log_prob": 12.249198913574219,
                "prob": 208813.953125,
                "token": "="
            },
            {
                "log_prob": 11.321356773376465,
                "prob": 82566.2890625,
                "token": "▁"
            }
        ],
        "prob": 0.9251887798309326,
        "token": "="
    },
    {
        "log_prob": -1.3261103630065918,
        "predicted_tokens": [
            {
                "log_prob": 17.740312576293945,
                "prob": 50643052,
                "token": "▁['"
            },
            {
                "log_prob": 17.583541870117188,
                "prob": 43294748,
                "token": "▁'"
            },
            {
                "log_prob": 17.506032943725586,
                "prob": 40065772,
                "token": "▁\""
            },
            {
                "log_prob": 16.279611587524414,
                "prob": 11752912,
                "token": "▁set"
            },
            {
                "log_prob": 15.433143615722656,
                "prob": 5041144,
                "token": "▁[\""
            }
        ],
        "prob": 0.2655079960823059,
        "token": "'"
    },
    {
        "log_prob": -0.005076139234006405,
        "predicted_tokens": [
            {
                "log_prob": 20.07044219970703,
                "prob": 520573792,
                "token": "ae"
            },
            {
                "log_prob": 14.326536178588867,
                "prob": 1667000,
                "token": "AE"
            },
            {
                "log_prob": 12.977639198303223,
                "prob": 432630.46875,
                "token": "a"
            },
            {
                "log_prob": 12.143512725830078,
                "prob": 187871.359375,
                "token": "ai"
            },
            {
                "log_prob": 11.226236343383789,
                "prob": 75074.515625,
                "token": "A"
            }
        ],
        "prob": 0.9949367046356201,
        "token": "ae"
    },
    {
        "log_prob": -0.0007796823629178107,
        "predicted_tokens": [
            {
                "log_prob": 22.856441497802734,
                "prob": 8441631744,
                "token": "i"
            },
            {
                "log_prob": 14.796174049377441,
                "prob": 2666224.75,
                "token": "io"
            },
            {
                "log_prob": 14.531560897827148,
                "prob": 2046334.875,
                "token": "iu"
            },
            {
                "log_prob": 12.530316352844238,
                "prob": 276596.875,
                "token": "ui"
            },
            {
                "log_prob": 12.038180351257324,
                "prob": 169088.984375,
                "token": "iour"
            }
        ],
        "prob": 0.9992206692695618,
        "token": "i"
    },
    {
        "log_prob": -0.0003718638326972723,
        "predicted_tokens": [
            {
                "log_prob": 23.949657440185547,
                "prob": 25188603904,
                "token": "ou"
            },
            {
                "log_prob": 14.788150787353516,
                "prob": 2644918.5,
                "token": "you"
            },
            {
                "log_prob": 14.510214805603027,
                "prob": 2003116.5,
                "token": "oul"
            },
            {
                "log_prob": 14.21324634552002,
                "prob": 1488450.75,
                "token": "io"
            },
            {
                "log_prob": 14.067427635192871,
                "prob": 1286489.375,
                "token": "▁ou"
            }
        ],
        "prob": 0.9996281862258911,
        "token": "ou"
    },
    {
        "log_prob": -2.5890979766845703,
        "predicted_tokens": [
            {
                "log_prob": 17.348508834838867,
                "prob": 34226436,
                "token": "'"
            },
            {
                "log_prob": 14.849491119384766,
                "prob": 2812238,
                "token": "AE"
            },
            {
                "log_prob": 11.612510681152344,
                "prob": 110471.2578125,
                "token": "ae"
            },
            {
                "log_prob": 11.173004150390625,
                "prob": 71182.640625,
                "token": "▁'"
            },
            {
                "log_prob": 10.347933769226074,
                "prob": 31192.5234375,
                "token": "'."
            }
        ],
        "prob": 0.07508774101734161,
        "token": "AE"
    },
    {
        "log_prob": -0.0014509160537272692,
        "predicted_tokens": [
            {
                "log_prob": 26.3710880279541,
                "prob": 283673001984,
                "token": "IO"
            },
            {
                "log_prob": 19.818119049072266,
                "prob": 404482528,
                "token": "I"
            },
            {
                "log_prob": 14.920268058776855,
                "prob": 3018492.5,
                "token": "Io"
            },
            {
                "log_prob": 14.072286605834961,
                "prob": 1292755.5,
                "token": "ISO"
            },
            {
                "log_prob": 13.918364524841309,
                "prob": 1108329.625,
                "token": "IA"
            }
        ],
        "prob": 0.9985501170158386,
        "token": "IO"
    },
    {
        "log_prob": -0.000014185804502631072,
        "predicted_tokens": [
            {
                "log_prob": 26.84587287902832,
                "prob": 456052113408,
                "token": "U"
            },
            {
                "log_prob": 14.599066734313965,
                "prob": 2189243.75,
                "token": "UE"
            },
            {
                "log_prob": 13.438264846801758,
                "prob": 685747.5625,
                "token": "У"
            },
            {
                "log_prob": 13.207405090332031,
                "prob": 544381.25,
                "token": "UI"
            },
            {
                "log_prob": 12.677300453186035,
                "prob": 320391.96875,
                "token": "UL"
            }
        ],
        "prob": 0.9999858140945435,
        "token": "U"
    },
    {
        "log_prob": -0.005178609397262335,
        "predicted_tokens": [
            {
                "log_prob": 19.395200729370117,
                "prob": 264989488,
                "token": "'"
            },
            {
                "log_prob": 14.017467498779297,
                "prob": 1223795.25,
                "token": "'."
            },
            {
                "log_prob": 10.569976806640625,
                "prob": 38947.76953125,
                "token": "▁'"
            },
            {
                "log_prob": 9.193880081176758,
                "prob": 9836.744140625,
                "token": "abc"
            },
            {
                "log_prob": 8.71731948852539,
                "prob": 6107.78515625,
                "token": "ae"
            }
        ],
        "prob": 0.9948347806930542,
        "token": "'"
    },
    {
        "log_prob": -0.0015128131490200758,
        "predicted_tokens": [
            {
                "log_prob": 21.354066848754883,
                "prob": 1879115264,
                "token": "<0x0A>"
            },
            {
                "log_prob": 13.967560768127441,
                "prob": 1164218.75,
                "token": "▁#"
            },
            {
                "log_prob": 13.954455375671387,
                "prob": 1149060.75,
                "token": "▁"
            },
            {
                "log_prob": 12.024011611938477,
                "prob": 166710.09375,
                "token": "▁*"
            },
            {
                "log_prob": 11.33234691619873,
                "prob": 83478.7109375,
                "token": "▁▁▁▁"
            }
        ],
        "prob": 0.9984883069992065,
        "token": "\n"
    },
    {
        "log_prob": -0.2855490744113922,
        "predicted_tokens": [
            {
                "log_prob": 17.114959716796875,
                "prob": 27097710,
                "token": "▁▁▁"
            },
            {
                "log_prob": 15.995009422302246,
                "prob": 8841874,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.187772750854492,
                "prob": 72241.703125,
                "token": "▁▁▁▁"
            },
            {
                "log_prob": 9.837620735168457,
                "prob": 18725.111328125,
                "token": "``"
            },
            {
                "log_prob": 8.388958930969238,
                "prob": 4398.236328125,
                "token": "▁▁"
            }
        ],
        "prob": 0.7516014575958252,
        "token": "  "
    },
    {
        "log_prob": -0.6239635348320007,
        "predicted_tokens": [
            {
                "log_prob": 13.416030883789062,
                "prob": 670668.9375,
                "token": "▁cons"
            },
            {
                "log_prob": 11.200849533081055,
                "prob": 73192.59375,
                "token": "▁result"
            },
            {
                "log_prob": 11.141242027282715,
                "prob": 68957.25,
                "token": "▁count"
            },
            {
                "log_prob": 11.058247566223145,
                "prob": 63465.23828125,
                "token": "▁first"
            },
            {
                "log_prob": 10.328207969665527,
                "prob": 30583.2578125,
                "token": "▁words"
            }
        ],
        "prob": 0.535816490650177,
        "token": "cons"
    },
    {
        "log_prob": -0.0012738931691274047,
        "predicted_tokens": [
            {
                "log_prob": 22.62407875061035,
                "prob": 6691331584,
                "token": "on"
            },
            {
                "log_prob": 15.58985424041748,
                "prob": 5896410,
                "token": "▁="
            },
            {
                "log_prob": 14.466723442077637,
                "prob": 1917865.625,
                "token": "_"
            },
            {
                "log_prob": 11.89995288848877,
                "prob": 147259.6875,
                "token": "ont"
            },
            {
                "log_prob": 11.599831581115723,
                "prob": 109079.421875,
                "token": "ants"
            }
        ],
        "prob": 0.9987269639968872,
        "token": "on"
    },
    {
        "log_prob": -0.011070968583226204,
        "predicted_tokens": [
            {
                "log_prob": 22.691993713378906,
                "prob": 7161560576,
                "token": "ants"
            },
            {
                "log_prob": 18.08492660522461,
                "prob": 71479880,
                "token": "ant"
            },
            {
                "log_prob": 15.599188804626465,
                "prob": 5951708,
                "token": "ents"
            },
            {
                "log_prob": 13.845844268798828,
                "prob": 1030798.4375,
                "token": "ats"
            },
            {
                "log_prob": 12.325582504272461,
                "prob": 225388.859375,
                "token": "ans"
            }
        ],
        "prob": 0.9889901280403137,
        "token": "ants"
    },
    {
        "log_prob": -0.000653530121780932,
        "predicted_tokens": [
            {
                "log_prob": 23.02867317199707,
                "prob": 10028262400,
                "token": "▁="
            },
            {
                "log_prob": 15.447466850280762,
                "prob": 5113869.5,
                "token": "_"
            },
            {
                "log_prob": 13.245064735412598,
                "prob": 565273.375,
                "token": "="
            },
            {
                "log_prob": 12.773502349853516,
                "prob": 352745.59375,
                "token": "▁"
            },
            {
                "log_prob": 12.361990928649902,
                "prob": 233746.140625,
                "token": ","
            }
        ],
        "prob": 0.9993467330932617,
        "token": "="
    },
    {
        "log_prob": -0.006373199634253979,
        "predicted_tokens": [
            {
                "log_prob": 20.1342716217041,
                "prob": 554885056,
                "token": "▁'"
            },
            {
                "log_prob": 14.430908203125,
                "prob": 1850392.25,
                "token": "▁\""
            },
            {
                "log_prob": 13.824901580810547,
                "prob": 1009435.25,
                "token": "▁''"
            },
            {
                "log_prob": 12.041967391967773,
                "prob": 169730.546875,
                "token": "▁set"
            },
            {
                "log_prob": 11.532244682312012,
                "prob": 101950.7109375,
                "token": "'"
            }
        ],
        "prob": 0.993647038936615,
        "token": "'"
    },
    {
        "log_prob": -0.005127256736159325,
        "predicted_tokens": [
            {
                "log_prob": 18.22310447692871,
                "prob": 82071752,
                "token": "b"
            },
            {
                "log_prob": 11.369180679321289,
                "prob": 86610.875,
                "token": "bd"
            },
            {
                "log_prob": 10.923572540283203,
                "prob": 55468.609375,
                "token": "bf"
            },
            {
                "log_prob": 10.882497787475586,
                "prob": 53236.41015625,
                "token": "'."
            },
            {
                "log_prob": 10.799771308898926,
                "prob": 49009.58984375,
                "token": "bc"
            }
        ],
        "prob": 0.9948859214782715,
        "token": "b"
    },
    {
        "log_prob": -0.00047088501742109656,
        "predicted_tokens": [
            {
                "log_prob": 22.109128952026367,
                "prob": 3998275328,
                "token": "cd"
            },
            {
                "log_prob": 13.249804496765137,
                "prob": 567959,
                "token": "▁cd"
            },
            {
                "log_prob": 12.603774070739746,
                "prob": 297679.90625,
                "token": "cf"
            },
            {
                "log_prob": 12.372084617614746,
                "prob": 236117.4375,
                "token": "cp"
            },
            {
                "log_prob": 11.242074966430664,
                "prob": 76273.0546875,
                "token": "df"
            }
        ],
        "prob": 0.999529242515564,
        "token": "cd"
    },
    {
        "log_prob": -0.0011233931872993708,
        "predicted_tokens": [
            {
                "log_prob": 20.58798599243164,
                "prob": 873471488,
                "token": "f"
            },
            {
                "log_prob": 13.294149398803711,
                "prob": 593711.8125,
                "token": "fg"
            },
            {
                "log_prob": 10.543773651123047,
                "prob": 37940.46875,
                "token": "fl"
            },
            {
                "log_prob": 10.536943435668945,
                "prob": 37682.21484375,
                "token": "ef"
            },
            {
                "log_prob": 10.103921890258789,
                "prob": 24438.66796875,
                "token": "gh"
            }
        ],
        "prob": 0.998877227306366,
        "token": "f"
    },
    {
        "log_prob": -0.0000036954811548639555,
        "predicted_tokens": [
            {
                "log_prob": 25.143346786499023,
                "prob": 83103014912,
                "token": "gh"
            },
            {
                "log_prob": 11.17703914642334,
                "prob": 71470.4375,
                "token": "j"
            },
            {
                "log_prob": 10.352787017822266,
                "prob": 31344.27734375,
                "token": "gl"
            },
            {
                "log_prob": 10.326502799987793,
                "prob": 30531.150390625,
                "token": "h"
            },
            {
                "log_prob": 10.259361267089844,
                "prob": 28548.544921875,
                "token": "▁g"
            }
        ],
        "prob": 0.9999963045120239,
        "token": "gh"
    },
    {
        "log_prob": -0.0010039533954113722,
        "predicted_tokens": [
            {
                "log_prob": 24.21075439453125,
                "prob": 32703711232,
                "token": "j"
            },
            {
                "log_prob": 17.07485008239746,
                "prob": 26032340,
                "token": "jk"
            },
            {
                "log_prob": 15.332566261291504,
                "prob": 4558783,
                "token": "ij"
            },
            {
                "log_prob": 14.145492553710938,
                "prob": 1390943,
                "token": "m"
            },
            {
                "log_prob": 12.600476264953613,
                "prob": 296699.8125,
                "token": "▁j"
            }
        ],
        "prob": 0.9989966154098511,
        "token": "j"
    },
    {
        "log_prob": -0.0006491222884505987,
        "predicted_tokens": [
            {
                "log_prob": 24.340106964111328,
                "prob": 37219811328,
                "token": "kl"
            },
            {
                "log_prob": 16.70111083984375,
                "prob": 17914318,
                "token": "km"
            },
            {
                "log_prob": 14.049152374267578,
                "prob": 1263192,
                "token": "ks"
            },
            {
                "log_prob": 14.040642738342285,
                "prob": 1252488.25,
                "token": "l"
            },
            {
                "log_prob": 13.840485572814941,
                "prob": 1025289.5,
                "token": "▁kl"
            }
        ],
        "prob": 0.9993510842323303,
        "token": "kl"
    },
    {
        "log_prob": -0.007357761263847351,
        "predicted_tokens": [
            {
                "log_prob": 22.93118667602539,
                "prob": 9096782848,
                "token": "m"
            },
            {
                "log_prob": 17.97598648071289,
                "prob": 64102024,
                "token": "mn"
            },
            {
                "log_prob": 14.303786277770996,
                "prob": 1629504.125,
                "token": "mp"
            },
            {
                "log_prob": 13.30227279663086,
                "prob": 598554.4375,
                "token": "p"
            },
            {
                "log_prob": 11.690290451049805,
                "prob": 119406.6875,
                "token": "mq"
            }
        ],
        "prob": 0.9926692843437195,
        "token": "m"
    },
    {
        "log_prob": -0.0008474572678096592,
        "predicted_tokens": [
            {
                "log_prob": 21.207815170288086,
                "prob": 1623443328,
                "token": "np"
            },
            {
                "log_prob": 12.385079383850098,
                "prob": 239205.765625,
                "token": "ng"
            },
            {
                "log_prob": 12.13881778717041,
                "prob": 186991.390625,
                "token": "▁np"
            },
            {
                "log_prob": 12.01283073425293,
                "prob": 164856.515625,
                "token": "NP"
            },
            {
                "log_prob": 11.681026458740234,
                "prob": 118305.609375,
                "token": "pr"
            }
        ],
        "prob": 0.9991529583930969,
        "token": "np"
    },
    {
        "log_prob": -0.00036971885128878057,
        "predicted_tokens": [
            {
                "log_prob": 22.01228904724121,
                "prob": 3629239808,
                "token": "q"
            },
            {
                "log_prob": 13.026505470275879,
                "prob": 454296.5625,
                "token": "qs"
            },
            {
                "log_prob": 12.604219436645508,
                "prob": 297812.53125,
                "token": "▁q"
            },
            {
                "log_prob": 11.890942573547363,
                "prob": 145938.78125,
                "token": "qt"
            },
            {
                "log_prob": 11.394552230834961,
                "prob": 88836.4453125,
                "token": "qq"
            }
        ],
        "prob": 0.999630331993103,
        "token": "q"
    },
    {
        "log_prob": -0.00043644916149787605,
        "predicted_tokens": [
            {
                "log_prob": 23.606874465942383,
                "prob": 17878673408,
                "token": "r"
            },
            {
                "log_prob": 15.292386054992676,
                "prob": 4379241.5,
                "token": "rs"
            },
            {
                "log_prob": 14.560619354248047,
                "prob": 2106670.75,
                "token": "st"
            },
            {
                "log_prob": 13.234530448913574,
                "prob": 559349.875,
                "token": "RST"
            },
            {
                "log_prob": 12.823073387145996,
                "prob": 370672.1875,
                "token": "rt"
            }
        ],
        "prob": 0.9995636940002441,
        "token": "r"
    },
    {
        "log_prob": -0.00010287232726113871,
        "predicted_tokens": [
            {
                "log_prob": 23.822826385498047,
                "prob": 22188197888,
                "token": "st"
            },
            {
                "log_prob": 14.27793025970459,
                "prob": 1587911.625,
                "token": "sts"
            },
            {
                "log_prob": 12.622553825378418,
                "prob": 303323.09375,
                "token": "ts"
            },
            {
                "log_prob": 11.22352409362793,
                "prob": 74871.1640625,
                "token": "ST"
            },
            {
                "log_prob": 11.203299522399902,
                "prob": 73372.1328125,
                "token": "sty"
            }
        ],
        "prob": 0.9998971819877625,
        "token": "st"
    },
    {
        "log_prob": -0.001207933179102838,
        "predicted_tokens": [
            {
                "log_prob": 21.890056610107422,
                "prob": 3211668992,
                "token": "v"
            },
            {
                "log_prob": 14.946855545043945,
                "prob": 3099822.75,
                "token": "w"
            },
            {
                "log_prob": 12.713214874267578,
                "prob": 332107.8125,
                "token": "uv"
            },
            {
                "log_prob": 11.837584495544434,
                "prob": 138355.890625,
                "token": "vy"
            },
            {
                "log_prob": 10.61607837677002,
                "prob": 40785.35546875,
                "token": "p"
            }
        ],
        "prob": 0.998792827129364,
        "token": "v"
    },
    {
        "log_prob": -0.001033129869028926,
        "predicted_tokens": [
            {
                "log_prob": 22.71076202392578,
                "prob": 7297240064,
                "token": "w"
            },
            {
                "log_prob": 15.570563316345215,
                "prob": 5783753,
                "token": "wx"
            },
            {
                "log_prob": 13.078067779541016,
                "prob": 478335.5625,
                "token": "wy"
            },
            {
                "log_prob": 12.976391792297363,
                "prob": 432091.125,
                "token": "x"
            },
            {
                "log_prob": 12.906696319580078,
                "prob": 403001.8125,
                "token": "xy"
            }
        ],
        "prob": 0.9989674687385559,
        "token": "w"
    },
    {
        "log_prob": -0.0010340826120227575,
        "predicted_tokens": [
            {
                "log_prob": 21.47469711303711,
                "prob": 2120032128,
                "token": "xy"
            },
            {
                "log_prob": 13.50296401977539,
                "prob": 731581.625,
                "token": "z"
            },
            {
                "log_prob": 12.907384872436523,
                "prob": 403279.40625,
                "token": "x"
            },
            {
                "log_prob": 12.253355026245117,
                "prob": 209683.609375,
                "token": "XY"
            },
            {
                "log_prob": 12.117828369140625,
                "prob": 183107.4375,
                "token": "xc"
            }
        ],
        "prob": 0.9989664554595947,
        "token": "xy"
    },
    {
        "log_prob": -0.0002273062855238095,
        "predicted_tokens": [
            {
                "log_prob": 22.380550384521484,
                "prob": 5245048832,
                "token": "z"
            },
            {
                "log_prob": 12.883692741394043,
                "prob": 393837.15625,
                "token": "Z"
            },
            {
                "log_prob": 11.658859252929688,
                "prob": 115711.953125,
                "token": "B"
            },
            {
                "log_prob": 11.593562126159668,
                "prob": 108397.6953125,
                "token": "zw"
            },
            {
                "log_prob": 11.46164608001709,
                "prob": 95001.3203125,
                "token": "zh"
            }
        ],
        "prob": 0.9997727274894714,
        "token": "z"
    },
    {
        "log_prob": -0.003078485606238246,
        "predicted_tokens": [
            {
                "log_prob": 19.941343307495117,
                "prob": 457525568,
                "token": "BC"
            },
            {
                "log_prob": 13.053831100463867,
                "prob": 466881.6875,
                "token": "BD"
            },
            {
                "log_prob": 12.653327941894531,
                "prob": 312802.71875,
                "token": "B"
            },
            {
                "log_prob": 12.32664966583252,
                "prob": 225629.515625,
                "token": "'"
            },
            {
                "log_prob": 11.579185485839844,
                "prob": 106850.453125,
                "token": "AB"
            }
        ],
        "prob": 0.9969262480735779,
        "token": "BC"
    },
    {
        "log_prob": -0.00010227633902104571,
        "predicted_tokens": [
            {
                "log_prob": 27.770668029785156,
                "prob": 1149867786240,
                "token": "DF"
            },
            {
                "log_prob": 18.17559242248535,
                "prob": 78263544,
                "token": "D"
            },
            {
                "log_prob": 16.624460220336914,
                "prob": 16592482,
                "token": "DEF"
            },
            {
                "log_prob": 16.50984001159668,
                "prob": 14795594,
                "token": "GF"
            },
            {
                "log_prob": 14.438929557800293,
                "prob": 1865294.625,
                "token": "F"
            }
        ],
        "prob": 0.9998977184295654,
        "token": "DF"
    },
    {
        "log_prob": -0.000009298280929215252,
        "predicted_tokens": [
            {
                "log_prob": 24.435344696044922,
                "prob": 40938827776,
                "token": "G"
            },
            {
                "log_prob": 12.408082962036133,
                "prob": 244772.140625,
                "token": "H"
            },
            {
                "log_prob": 9.651552200317383,
                "prob": 15545.8994140625,
                "token": "Г"
            },
            {
                "log_prob": 9.188164710998535,
                "prob": 9780.6845703125,
                "token": "J"
            },
            {
                "log_prob": 9.149049758911133,
                "prob": 9405.4990234375,
                "token": "M"
            }
        ],
        "prob": 0.999990701675415,
        "token": "G"
    },
    {
        "log_prob": -0.0011797142215073109,
        "predicted_tokens": [
            {
                "log_prob": 23.823328018188477,
                "prob": 22199330816,
                "token": "H"
            },
            {
                "log_prob": 16.908653259277344,
                "prob": 22046254,
                "token": "HI"
            },
            {
                "log_prob": 14.753545761108398,
                "prob": 2554956.5,
                "token": "J"
            },
            {
                "log_prob": 13.431714057922363,
                "prob": 681270.0625,
                "token": "▁Hij"
            },
            {
                "log_prob": 12.081725120544434,
                "prob": 176614.59375,
                "token": "▁H"
            }
        ],
        "prob": 0.9988210201263428,
        "token": "H"
    },
    {
        "log_prob": -0.000004410734163684538,
        "predicted_tokens": [
            {
                "log_prob": 26.237245559692383,
                "prob": 248136679424,
                "token": "J"
            },
            {
                "log_prob": 13.558600425720215,
                "prob": 773437.6875,
                "token": "▁J"
            },
            {
                "log_prob": 11.43680191040039,
                "prob": 92670.171875,
                "token": "K"
            },
            {
                "log_prob": 10.990945816040039,
                "prob": 59334.4765625,
                "token": "JS"
            },
            {
                "log_prob": 10.779875755310059,
                "prob": 48044.15625,
                "token": "j"
            }
        ],
        "prob": 0.9999955892562866,
        "token": "J"
    },
    {
        "log_prob": -0.00018630675913300365,
        "predicted_tokens": [
            {
                "log_prob": 22.413372039794922,
                "prob": 5420056064,
                "token": "K"
            },
            {
                "log_prob": 12.207414627075195,
                "prob": 200268.578125,
                "token": "LM"
            },
            {
                "log_prob": 11.821284294128418,
                "prob": 136118.9375,
                "token": "KK"
            },
            {
                "log_prob": 11.66742992401123,
                "prob": 116707.953125,
                "token": "▁Kl"
            },
            {
                "log_prob": 10.923836708068848,
                "prob": 55483.265625,
                "token": "PK"
            }
        ],
        "prob": 0.9998137354850769,
        "token": "K"
    },
    {
        "log_prob": -0.0021685673855245113,
        "predicted_tokens": [
            {
                "log_prob": 26.251358032226562,
                "prob": 251663335424,
                "token": "LM"
            },
            {
                "log_prob": 20.09379768371582,
                "prob": 532875104,
                "token": "L"
            },
            {
                "log_prob": 16.253870010375977,
                "prob": 11454235,
                "token": "LP"
            },
            {
                "log_prob": 13.086209297180176,
                "prob": 482245.8125,
                "token": "LL"
            },
            {
                "log_prob": 12.902443885803223,
                "prob": 401291.71875,
                "token": "M"
            }
        ],
        "prob": 0.997833788394928,
        "token": "LM"
    },
    {
        "log_prob": -0.002228278899565339,
        "predicted_tokens": [
            {
                "log_prob": 25.378990173339844,
                "prob": 105185386496,
                "token": "NP"
            },
            {
                "log_prob": 19.190664291381836,
                "prob": 215973072,
                "token": "NOP"
            },
            {
                "log_prob": 16.341842651367188,
                "prob": 12507545,
                "token": "N"
            },
            {
                "log_prob": 14.962443351745605,
                "prob": 3148521,
                "token": "np"
            },
            {
                "log_prob": 14.43471908569336,
                "prob": 1857457.375,
                "token": "▁Nap"
            }
        ],
        "prob": 0.9977742433547974,
        "token": "NP"
    },
    {
        "log_prob": -0.0000066756979322235566,
        "predicted_tokens": [
            {
                "log_prob": 25.13039779663086,
                "prob": 82033844224,
                "token": "Q"
            },
            {
                "log_prob": 11.809510231018066,
                "prob": 134525.65625,
                "token": "▁Q"
            },
            {
                "log_prob": 11.601707458496094,
                "prob": 109284.2421875,
                "token": "QU"
            },
            {
                "log_prob": 11.17170238494873,
                "prob": 71090.03125,
                "token": "ST"
            },
            {
                "log_prob": 10.5880126953125,
                "prob": 39656.59765625,
                "token": "Qt"
            }
        ],
        "prob": 0.9999933242797852,
        "token": "Q"
    },
    {
        "log_prob": -0.0007214327342808247,
        "predicted_tokens": [
            {
                "log_prob": 25.254934310913086,
                "prob": 92913451008,
                "token": "RST"
            },
            {
                "log_prob": 17.79847526550293,
                "prob": 53675936,
                "token": "RT"
            },
            {
                "log_prob": 15.636429786682129,
                "prob": 6177535,
                "token": "ST"
            },
            {
                "log_prob": 15.57949161529541,
                "prob": 5835623,
                "token": "R"
            },
            {
                "log_prob": 13.28591251373291,
                "prob": 588841.625,
                "token": "RS"
            }
        ],
        "prob": 0.9992788434028625,
        "token": "RST"
    },
    {
        "log_prob": -0.0036493625957518816,
        "predicted_tokens": [
            {
                "log_prob": 21.42914581298828,
                "prob": 2025628416,
                "token": "V"
            },
            {
                "log_prob": 15.725574493408203,
                "prob": 6753520.5,
                "token": "W"
            },
            {
                "log_prob": 13.113968849182129,
                "prob": 495820.3125,
                "token": "UV"
            },
            {
                "log_prob": 10.285074234008789,
                "prob": 29292.134765625,
                "token": "VT"
            },
            {
                "log_prob": 10.085857391357422,
                "prob": 24001.16015625,
                "token": "В"
            }
        ],
        "prob": 0.996357262134552,
        "token": "V"
    },
    {
        "log_prob": -0.000064490144723095,
        "predicted_tokens": [
            {
                "log_prob": 23.646835327148438,
                "prob": 18607589376,
                "token": "W"
            },
            {
                "log_prob": 13.564545631408691,
                "prob": 778049.6875,
                "token": "XY"
            },
            {
                "log_prob": 11.551409721374512,
                "prob": 103923.4375,
                "token": "▁W"
            },
            {
                "log_prob": 11.448513984680176,
                "prob": 93761.9140625,
                "token": "w"
            },
            {
                "log_prob": 10.546393394470215,
                "prob": 38039.99609375,
                "token": "WW"
            }
        ],
        "prob": 0.999935507774353,
        "token": "W"
    },
    {
        "log_prob": -0.0003860443539451808,
        "predicted_tokens": [
            {
                "log_prob": 25.321813583374023,
                "prob": 99339943936,
                "token": "XY"
            },
            {
                "log_prob": 17.328109741210938,
                "prob": 33535320,
                "token": "X"
            },
            {
                "log_prob": 14.943161964416504,
                "prob": 3088394.75,
                "token": "▁X"
            },
            {
                "log_prob": 13.39226245880127,
                "prob": 654916.125,
                "token": "xy"
            },
            {
                "log_prob": 13.301475524902344,
                "prob": 598077.4375,
                "token": "XX"
            }
        ],
        "prob": 0.9996140599250793,
        "token": "XY"
    },
    {
        "log_prob": -0.0000507818695041351,
        "predicted_tokens": [
            {
                "log_prob": 23.606006622314453,
                "prob": 17863163904,
                "token": "Z"
            },
            {
                "log_prob": 13.50430965423584,
                "prob": 732566.6875,
                "token": "'"
            },
            {
                "log_prob": 10.670723915100098,
                "prob": 43076.11328125,
                "token": "z"
            },
            {
                "log_prob": 10.192240715026855,
                "prob": 26695.2421875,
                "token": "W"
            },
            {
                "log_prob": 9.912835121154785,
                "prob": 20187.828125,
                "token": "▁Z"
            }
        ],
        "prob": 0.9999492168426514,
        "token": "Z"
    },
    {
        "log_prob": -0.022178011015057564,
        "predicted_tokens": [
            {
                "log_prob": 18.616727828979492,
                "prob": 121658416,
                "token": "'"
            },
            {
                "log_prob": 14.132360458374023,
                "prob": 1372796.5,
                "token": "1"
            },
            {
                "log_prob": 13.841919898986816,
                "prob": 1026761.125,
                "token": "2"
            },
            {
                "log_prob": 11.268350601196289,
                "prob": 78303.734375,
                "token": "'."
            },
            {
                "log_prob": 10.931136131286621,
                "prob": 55889.7421875,
                "token": "0"
            }
        ],
        "prob": 0.978066086769104,
        "token": "'"
    },
    {
        "log_prob": -0.0002076410164590925,
        "predicted_tokens": [
            {
                "log_prob": 21.568838119506836,
                "prob": 2329310464,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.097249031066895,
                "prob": 179377.71875,
                "token": "▁#"
            },
            {
                "log_prob": 11.235998153686523,
                "prob": 75810.9609375,
                "token": "▁"
            },
            {
                "log_prob": 10.903928756713867,
                "prob": 54389.62890625,
                "token": "▁*"
            },
            {
                "log_prob": 10.091893196105957,
                "prob": 24146.462890625,
                "token": "▁\\"
            }
        ],
        "prob": 0.9997923970222473,
        "token": "\n"
    },
    {
        "log_prob": -0.5414590835571289,
        "predicted_tokens": [
            {
                "log_prob": 17.61472511291504,
                "prob": 44666084,
                "token": "▁▁▁"
            },
            {
                "log_prob": 17.27583885192871,
                "prob": 31827426,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.140144348144531,
                "prob": 187239.59375,
                "token": "▁▁▁▁"
            },
            {
                "log_prob": 10.611852645874023,
                "prob": 40613.37109375,
                "token": "``"
            },
            {
                "log_prob": 9.031076431274414,
                "prob": 8358.8525390625,
                "token": "▁▁▁▁▁▁▁"
            }
        ],
        "prob": 0.5818986296653748,
        "token": "  "
    },
    {
        "log_prob": -3.1540756225585938,
        "predicted_tokens": [
            {
                "log_prob": 11.737058639526367,
                "prob": 125123.765625,
                "token": "▁double"
            },
            {
                "log_prob": 11.711380004882812,
                "prob": 121951.65625,
                "token": "▁first"
            },
            {
                "log_prob": 10.896763801574707,
                "prob": 54001.3203125,
                "token": "▁words"
            },
            {
                "log_prob": 10.736464500427246,
                "prob": 46003.12109375,
                "token": "▁sy"
            },
            {
                "log_prob": 10.500843048095703,
                "prob": 36346.1328125,
                "token": "▁result"
            }
        ],
        "prob": 0.04267783463001251,
        "token": "dig"
    },
    {
        "log_prob": -0.00011860620725201443,
        "predicted_tokens": [
            {
                "log_prob": 23.573232650756836,
                "prob": 17287208960,
                "token": "its"
            },
            {
                "log_prob": 12.91880989074707,
                "prob": 407913.3125,
                "token": "itals"
            },
            {
                "log_prob": 12.848990440368652,
                "prob": 380404.5,
                "token": "itis"
            },
            {
                "log_prob": 12.41507339477539,
                "prob": 246489.1875,
                "token": "itos"
            },
            {
                "log_prob": 12.185736656188965,
                "prob": 195973.875,
                "token": "_"
            }
        ],
        "prob": 0.999881386756897,
        "token": "its"
    },
    {
        "log_prob": -0.0014499637763947248,
        "predicted_tokens": [
            {
                "log_prob": 22.589683532714844,
                "prob": 6465094656,
                "token": "▁="
            },
            {
                "log_prob": 14.498164176940918,
                "prob": 1979122.625,
                "token": "▁"
            },
            {
                "log_prob": 14.235547065734863,
                "prob": 1522017.25,
                "token": "='"
            },
            {
                "log_prob": 14.10400390625,
                "prob": 1334415.375,
                "token": "_"
            },
            {
                "log_prob": 14.096858978271484,
                "prob": 1324915.125,
                "token": "▁▁▁"
            }
        ],
        "prob": 0.998551070690155,
        "token": "="
    },
    {
        "log_prob": -0.00974174216389656,
        "predicted_tokens": [
            {
                "log_prob": 22.03963279724121,
                "prob": 3729846016,
                "token": "▁'"
            },
            {
                "log_prob": 17.215211868286133,
                "prob": 29955152,
                "token": "▁\""
            },
            {
                "log_prob": 15.183706283569336,
                "prob": 3928256.5,
                "token": "▁['"
            },
            {
                "log_prob": 13.321554183959961,
                "prob": 610207.4375,
                "token": "▁{'"
            },
            {
                "log_prob": 13.234488487243652,
                "prob": 559326.4375,
                "token": "'"
            }
        ],
        "prob": 0.9903055429458618,
        "token": "'"
    },
    {
        "log_prob": -0.0024802894331514835,
        "predicted_tokens": [
            {
                "log_prob": 22.469623565673828,
                "prob": 5733681152,
                "token": "0"
            },
            {
                "log_prob": 16.453771591186523,
                "prob": 13988856,
                "token": "1"
            },
            {
                "log_prob": 11.684805870056152,
                "prob": 118753.578125,
                "token": "2"
            },
            {
                "log_prob": 10.948219299316406,
                "prob": 56852.71875,
                "token": "9"
            },
            {
                "log_prob": 8.88602066040039,
                "prob": 7230.1904296875,
                "token": "3"
            }
        ],
        "prob": 0.9975228309631348,
        "token": "0"
    },
    {
        "log_prob": -0.0009993088897317648,
        "predicted_tokens": [
            {
                "log_prob": 22.96881675720215,
                "prob": 9445617664,
                "token": "1"
            },
            {
                "log_prob": 15.887918472290039,
                "prob": 7943928.5,
                "token": "-"
            },
            {
                "log_prob": 13.583298683166504,
                "prob": 792778.125,
                "token": "9"
            },
            {
                "log_prob": 13.350296020507812,
                "prob": 628000.3125,
                "token": "2"
            },
            {
                "log_prob": 9.56694507598877,
                "prob": 14284.7119140625,
                "token": ","
            }
        ],
        "prob": 0.9990012049674988,
        "token": "1"
    },
    {
        "log_prob": -0.0000040531076592742465,
        "predicted_tokens": [
            {
                "log_prob": 24.52872085571289,
                "prob": 44945698816,
                "token": "2"
            },
            {
                "log_prob": 11.470552444458008,
                "prob": 95851.21875,
                "token": "3"
            },
            {
                "log_prob": 10.787689208984375,
                "prob": 48421.015625,
                "token": "'"
            },
            {
                "log_prob": 9.5234956741333,
                "prob": 13677.3388671875,
                "token": "9"
            },
            {
                "log_prob": 8.674602508544922,
                "prob": 5852.37353515625,
                "token": "1"
            }
        ],
        "prob": 0.9999960064888,
        "token": "2"
    },
    {
        "log_prob": -0.000001311301275563892,
        "predicted_tokens": [
            {
                "log_prob": 25.405553817749023,
                "prob": 108016926720,
                "token": "3"
            },
            {
                "log_prob": 11.085240364074707,
                "prob": 65201.671875,
                "token": "4"
            },
            {
                "log_prob": 10.871646881103516,
                "prob": 52661.8671875,
                "token": "2"
            },
            {
                "log_prob": 9.898852348327637,
                "prob": 19907.51171875,
                "token": "'"
            },
            {
                "log_prob": 8.254823684692383,
                "prob": 3846.1337890625,
                "token": "5"
            }
        ],
        "prob": 0.9999986886978149,
        "token": "3"
    },
    {
        "log_prob": -0.000012278481335670222,
        "predicted_tokens": [
            {
                "log_prob": 23.382492065429688,
                "prob": 14285231104,
                "token": "4"
            },
            {
                "log_prob": 11.505165100097656,
                "prob": 99226.9609375,
                "token": "5"
            },
            {
                "log_prob": 9.713079452514648,
                "prob": 16532.43359375,
                "token": "'"
            },
            {
                "log_prob": 9.635758399963379,
                "prob": 15302.298828125,
                "token": "6"
            },
            {
                "log_prob": 9.552879333496094,
                "prob": 14085.1923828125,
                "token": "3"
            }
        ],
        "prob": 0.9999877214431763,
        "token": "4"
    },
    {
        "log_prob": -0.0000036954811548639555,
        "predicted_tokens": [
            {
                "log_prob": 24.196020126342773,
                "prob": 32225378304,
                "token": "5"
            },
            {
                "log_prob": 11.071162223815918,
                "prob": 64290.1796875,
                "token": "6"
            },
            {
                "log_prob": 10.034072875976562,
                "prob": 22789.90234375,
                "token": "4"
            },
            {
                "log_prob": 9.048566818237305,
                "prob": 8506.337890625,
                "token": "'"
            },
            {
                "log_prob": 8.348867416381836,
                "prob": 4225.392578125,
                "token": "7"
            }
        ],
        "prob": 0.9999963045120239,
        "token": "5"
    },
    {
        "log_prob": -0.000014185804502631072,
        "predicted_tokens": [
            {
                "log_prob": 23.58001136779785,
                "prob": 17404790784,
                "token": "6"
            },
            {
                "log_prob": 11.434179306030273,
                "prob": 92427.4453125,
                "token": "5"
            },
            {
                "log_prob": 11.003403663635254,
                "prob": 60078.28125,
                "token": "'"
            },
            {
                "log_prob": 10.858322143554688,
                "prob": 51964.8203125,
                "token": "7"
            },
            {
                "log_prob": 8.798789024353027,
                "prob": 6626.21484375,
                "token": "8"
            }
        ],
        "prob": 0.9999858140945435,
        "token": "6"
    },
    {
        "log_prob": -0.000010371154530730564,
        "predicted_tokens": [
            {
                "log_prob": 24.643356323242188,
                "prob": 50405007360,
                "token": "7"
            },
            {
                "log_prob": 12.48149299621582,
                "prob": 263416.84375,
                "token": "6"
            },
            {
                "log_prob": 11.991854667663574,
                "prob": 161434.484375,
                "token": "8"
            },
            {
                "log_prob": 10.251169204711914,
                "prob": 28315.62890625,
                "token": "'"
            },
            {
                "log_prob": 10.215821266174316,
                "prob": 27332.212890625,
                "token": "9"
            }
        ],
        "prob": 0.9999896287918091,
        "token": "7"
    },
    {
        "log_prob": -0.000010490362910786644,
        "predicted_tokens": [
            {
                "log_prob": 23.736186981201172,
                "prob": 20346748928,
                "token": "8"
            },
            {
                "log_prob": 11.89452838897705,
                "prob": 146463.046875,
                "token": "9"
            },
            {
                "log_prob": 9.957176208496094,
                "prob": 21103.12109375,
                "token": "'"
            },
            {
                "log_prob": 9.933184623718262,
                "prob": 20602.84765625,
                "token": "7"
            },
            {
                "log_prob": 8.652239799499512,
                "prob": 5722.95068359375,
                "token": "eight"
            }
        ],
        "prob": 0.9999895691871643,
        "token": "8"
    },
    {
        "log_prob": -0.000004768360213347478,
        "predicted_tokens": [
            {
                "log_prob": 24.140932083129883,
                "prob": 30498156544,
                "token": "9"
            },
            {
                "log_prob": 11.558960914611816,
                "prob": 104711.15625,
                "token": "8"
            },
            {
                "log_prob": 9.986127853393555,
                "prob": 21723.021484375,
                "token": "'"
            },
            {
                "log_prob": 8.5517578125,
                "prob": 5175.8447265625,
                "token": "0"
            },
            {
                "log_prob": 7.511585235595703,
                "prob": 1829.11083984375,
                "token": "7"
            }
        ],
        "prob": 0.999995231628418,
        "token": "9"
    },
    {
        "log_prob": -0.0016037471359595656,
        "predicted_tokens": [
            {
                "log_prob": 20.593698501586914,
                "prob": 878475456,
                "token": "'"
            },
            {
                "log_prob": 13.910454750061035,
                "prob": 1099597.5,
                "token": "0"
            },
            {
                "log_prob": 11.336531639099121,
                "prob": 83828.78125,
                "token": "\\"
            },
            {
                "log_prob": 11.108572006225586,
                "prob": 66740.8203125,
                "token": "AB"
            },
            {
                "log_prob": 9.921830177307129,
                "prob": 20370.236328125,
                "token": ".'"
            }
        ],
        "prob": 0.9983975887298584,
        "token": "'"
    },
    {
        "log_prob": -0.00006437094270950183,
        "predicted_tokens": [
            {
                "log_prob": 21.94219207763672,
                "prob": 3383552768,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.138930320739746,
                "prob": 68798.0234375,
                "token": "▁#"
            },
            {
                "log_prob": 10.32895565032959,
                "prob": 30606.130859375,
                "token": "▁-"
            },
            {
                "log_prob": 9.858843803405762,
                "prob": 19126.76171875,
                "token": "▁"
            },
            {
                "log_prob": 9.819889068603516,
                "prob": 18396.009765625,
                "token": "▁+"
            }
        ],
        "prob": 0.9999356865882874,
        "token": "\n"
    },
    {
        "log_prob": -0.7994310259819031,
        "predicted_tokens": [
            {
                "log_prob": 15.956137657165527,
                "prob": 8504769,
                "token": "<0x0A>"
            },
            {
                "log_prob": 15.767834663391113,
                "prob": 7045042,
                "token": "▁▁▁"
            },
            {
                "log_prob": 11.111388206481934,
                "prob": 66929.0390625,
                "token": "▁▁▁▁"
            },
            {
                "log_prob": 10.391885757446289,
                "prob": 32594.072265625,
                "token": "``"
            },
            {
                "log_prob": 8.2084321975708,
                "prob": 3671.781494140625,
                "token": "▁▁"
            }
        ],
        "prob": 0.4495846927165985,
        "token": "  "
    },
    {
        "log_prob": -4.055574417114258,
        "predicted_tokens": [
            {
                "log_prob": 11.968181610107422,
                "prob": 157657.71875,
                "token": "▁words"
            },
            {
                "log_prob": 10.763419151306152,
                "prob": 47259.984375,
                "token": "▁result"
            },
            {
                "log_prob": 10.10151481628418,
                "prob": 24379.912109375,
                "token": "▁first"
            },
            {
                "log_prob": 10.088201522827148,
                "prob": 24057.486328125,
                "token": "▁word"
            },
            {
                "log_prob": 9.993096351623535,
                "prob": 21874.92578125,
                "token": "▁double"
            }
        ],
        "prob": 0.017325524240732193,
        "token": "special"
    },
    {
        "log_prob": -0.024968301877379417,
        "predicted_tokens": [
            {
                "log_prob": 21.959007263183594,
                "prob": 3440928768,
                "token": "_"
            },
            {
                "log_prob": 17.739532470703125,
                "prob": 50603560,
                "token": "▁="
            },
            {
                "log_prob": 17.254070281982422,
                "prob": 31142074,
                "token": "s"
            },
            {
                "log_prob": 14.564681053161621,
                "prob": 2115244.75,
                "token": "Ch"
            },
            {
                "log_prob": 14.075973510742188,
                "prob": 1297530.625,
                "token": "chars"
            }
        ],
        "prob": 0.9753407835960388,
        "token": "_"
    },
    {
        "log_prob": -0.641060471534729,
        "predicted_tokens": [
            {
                "log_prob": 22.736974716186523,
                "prob": 7491049472,
                "token": "chars"
            },
            {
                "log_prob": 22.552770614624023,
                "prob": 6230799872,
                "token": "char"
            },
            {
                "log_prob": 19.94436264038086,
                "prob": 458909056,
                "token": "symbol"
            },
            {
                "log_prob": 16.534093856811523,
                "prob": 15158832,
                "token": "ch"
            },
            {
                "log_prob": 16.270614624023438,
                "prob": 11647645,
                "token": "sym"
            }
        ],
        "prob": 0.5267335176467896,
        "token": "chars"
    },
    {
        "log_prob": -0.0010509926360100508,
        "predicted_tokens": [
            {
                "log_prob": 22.34165382385254,
                "prob": 5044951040,
                "token": "▁="
            },
            {
                "log_prob": 15.147320747375488,
                "prob": 3787894,
                "token": "_"
            },
            {
                "log_prob": 13.473124504089355,
                "prob": 710074.0625,
                "token": "="
            },
            {
                "log_prob": 12.693585395812988,
                "prob": 325652.25,
                "token": "='"
            },
            {
                "log_prob": 12.088501930236816,
                "prob": 177815.53125,
                "token": ","
            }
        ],
        "prob": 0.9989495277404785,
        "token": "="
    },
    {
        "log_prob": -0.15246827900409698,
        "predicted_tokens": [
            {
                "log_prob": 19.415416717529297,
                "prob": 270401024,
                "token": "▁'"
            },
            {
                "log_prob": 17.278223037719727,
                "prob": 31903396,
                "token": "▁\""
            },
            {
                "log_prob": 15.019926071166992,
                "prob": 3334809.5,
                "token": "▁'@"
            },
            {
                "log_prob": 14.674203872680664,
                "prob": 2360074.75,
                "token": "▁'-"
            },
            {
                "log_prob": 14.270759582519531,
                "prob": 1576566,
                "token": "▁'#"
            }
        ],
        "prob": 0.8585861921310425,
        "token": "'"
    },
    {
        "log_prob": -0.025178031995892525,
        "predicted_tokens": [
            {
                "log_prob": 19.20975685119629,
                "prob": 220136176,
                "token": "!"
            },
            {
                "log_prob": 14.922840118408203,
                "prob": 3026266.25,
                "token": "!\""
            },
            {
                "log_prob": 13.58735466003418,
                "prob": 796000.125,
                "token": "▁!"
            },
            {
                "log_prob": 12.85020637512207,
                "prob": 380867.34375,
                "token": "~"
            },
            {
                "log_prob": 12.572973251342773,
                "prob": 288650.875,
                "token": ".,"
            }
        ],
        "prob": 0.9751362800598145,
        "token": "!"
    },
    {
        "log_prob": -9.263785362243652,
        "predicted_tokens": [
            {
                "log_prob": 19.852109909057617,
                "prob": 418467552,
                "token": "@"
            },
            {
                "log_prob": 16.402210235595703,
                "prob": 13285851,
                "token": "#"
            },
            {
                "log_prob": 13.056779861450195,
                "prob": 468260.40625,
                "token": "?"
            },
            {
                "log_prob": 12.434866905212402,
                "prob": 251416.671875,
                "token": "$"
            },
            {
                "log_prob": 12.26220989227295,
                "prob": 211548.5625,
                "token": "▁@"
            }
        ],
        "prob": 0.00009479581058258191,
        "token": "\\\""
    },
    {
        "log_prob": -0.00978624727576971,
        "predicted_tokens": [
            {
                "log_prob": 21.146562576293945,
                "prob": 1526987392,
                "token": "#"
            },
            {
                "log_prob": 16.31722068786621,
                "prob": 12203345,
                "token": "$"
            },
            {
                "log_prob": 14.017271041870117,
                "prob": 1223554.875,
                "token": "\\"
            },
            {
                "log_prob": 12.822793006896973,
                "prob": 370568.28125,
                "token": "£"
            },
            {
                "log_prob": 12.704302787780762,
                "prob": 329161.1875,
                "token": "§"
            }
        ],
        "prob": 0.9902614951133728,
        "token": "#"
    },
    {
        "log_prob": -0.002090889262035489,
        "predicted_tokens": [
            {
                "log_prob": 21.893558502197266,
                "prob": 3222935808,
                "token": "$"
            },
            {
                "log_prob": 15.421516418457031,
                "prob": 4982869,
                "token": "\\"
            },
            {
                "log_prob": 13.25322151184082,
                "prob": 569903.0625,
                "token": "\\\\"
            },
            {
                "log_prob": 13.14947509765625,
                "prob": 513741.28125,
                "token": "%"
            },
            {
                "log_prob": 11.488608360290527,
                "prob": 97597.6171875,
                "token": "\\%"
            }
        ],
        "prob": 0.997911274433136,
        "token": "$"
    },
    {
        "log_prob": -0.00024196557933464646,
        "predicted_tokens": [
            {
                "log_prob": 23.83353614807129,
                "prob": 22427105280,
                "token": "%"
            },
            {
                "log_prob": 14.792224884033203,
                "prob": 2655716,
                "token": "&"
            },
            {
                "log_prob": 13.694090843200684,
                "prob": 885662.125,
                "token": "%."
            },
            {
                "log_prob": 13.408279418945312,
                "prob": 665490.3125,
                "token": "%,"
            },
            {
                "log_prob": 12.398719787597656,
                "prob": 242490.984375,
                "token": "▁%"
            }
        ],
        "prob": 0.9997580647468567,
        "token": "%"
    },
    {
        "log_prob": -0.47398149967193604,
        "predicted_tokens": [
            {
                "log_prob": 18.971771240234375,
                "prob": 173514416,
                "token": "&\\"
            },
            {
                "log_prob": 18.431787490844727,
                "prob": 101116872,
                "token": "&"
            },
            {
                "log_prob": 13.602858543395996,
                "prob": 808437.375,
                "token": "\\'"
            },
            {
                "log_prob": 13.56673812866211,
                "prob": 779757.4375,
                "token": "^"
            },
            {
                "log_prob": 13.14909553527832,
                "prob": 513546.3125,
                "token": "\\"
            }
        ],
        "prob": 0.6225187182426453,
        "token": "&\\"
    },
    {
        "log_prob": -0.03573576360940933,
        "predicted_tokens": [
            {
                "log_prob": 19.297794342041016,
                "prob": 240395088,
                "token": "'"
            },
            {
                "log_prob": 15.75853443145752,
                "prob": 6979825,
                "token": "'*"
            },
            {
                "log_prob": 13.517011642456055,
                "prob": 741931.125,
                "token": "'\\"
            },
            {
                "log_prob": 12.76702880859375,
                "prob": 350469.4375,
                "token": "''"
            },
            {
                "log_prob": 12.415371894836426,
                "prob": 246562.78125,
                "token": "*"
            }
        ],
        "prob": 0.9648951888084412,
        "token": "'"
    },
    {
        "log_prob": -0.009981834329664707,
        "predicted_tokens": [
            {
                "log_prob": 19.491247177124023,
                "prob": 291703136,
                "token": "()"
            },
            {
                "log_prob": 13.24971866607666,
                "prob": 567910.25,
                "token": "(),"
            },
            {
                "log_prob": 12.952597618103027,
                "prob": 421931.25,
                "token": "(\\"
            },
            {
                "log_prob": 12.748909950256348,
                "prob": 344176.53125,
                "token": "(*"
            },
            {
                "log_prob": 12.615066528320312,
                "prob": 301060.53125,
                "token": "():"
            }
        ],
        "prob": 0.9900678396224976,
        "token": "()"
    },
    {
        "log_prob": -0.008104652166366577,
        "predicted_tokens": [
            {
                "log_prob": 20.110380172729492,
                "prob": 541785216,
                "token": "*"
            },
            {
                "log_prob": 14.386240005493164,
                "prob": 1769557.375,
                "token": "+"
            },
            {
                "log_prob": 12.83919906616211,
                "prob": 376698,
                "token": "-"
            },
            {
                "log_prob": 12.697860717773438,
                "prob": 327047.5,
                "token": "_+"
            },
            {
                "log_prob": 12.696395874023438,
                "prob": 326568.78125,
                "token": "\\"
            }
        ],
        "prob": 0.9919281005859375,
        "token": "*"
    },
    {
        "log_prob": -0.004044330678880215,
        "predicted_tokens": [
            {
                "log_prob": 20.776397705078125,
                "prob": 1054568704,
                "token": "+"
            },
            {
                "log_prob": 14.459511756896973,
                "prob": 1904084.375,
                "token": "+-"
            },
            {
                "log_prob": 13.487349510192871,
                "prob": 720247.0625,
                "token": "+\\"
            },
            {
                "log_prob": 13.134225845336914,
                "prob": 505966.5625,
                "token": "_+"
            },
            {
                "log_prob": 12.668986320495605,
                "prob": 317739.25,
                "token": "+("
            }
        ],
        "prob": 0.9959638118743896,
        "token": "+"
    },
    {
        "log_prob": -0.03348772972822189,
        "predicted_tokens": [
            {
                "log_prob": 20.114187240600586,
                "prob": 543851712,
                "token": ",-"
            },
            {
                "log_prob": 16.313928604125977,
                "prob": 12163237,
                "token": ","
            },
            {
                "log_prob": 15.029450416564941,
                "prob": 3366723,
                "token": ",\\"
            },
            {
                "log_prob": 13.330780029296875,
                "prob": 615863.125,
                "token": ":-"
            },
            {
                "log_prob": 13.300383567810059,
                "prob": 597424.75,
                "token": ".,"
            }
        ],
        "prob": 0.967066764831543,
        "token": ",-"
    },
    {
        "log_prob": -0.004629726056009531,
        "predicted_tokens": [
            {
                "log_prob": 22.34899139404297,
                "prob": 5082105344,
                "token": "./"
            },
            {
                "log_prob": 15.786114692687988,
                "prob": 7175010,
                "token": "/:"
            },
            {
                "log_prob": 15.65373706817627,
                "prob": 6285381.5,
                "token": ".;"
            },
            {
                "log_prob": 15.446558952331543,
                "prob": 5109228.5,
                "token": ".:"
            },
            {
                "log_prob": 13.85006046295166,
                "prob": 1035153.6875,
                "token": "/"
            }
        ],
        "prob": 0.9953809976577759,
        "token": "./"
    },
    {
        "log_prob": -0.003615273628383875,
        "predicted_tokens": [
            {
                "log_prob": 20.819107055664062,
                "prob": 1100584320,
                "token": ":"
            },
            {
                "log_prob": 13.978683471679688,
                "prob": 1177240.25,
                "token": ";"
            },
            {
                "log_prob": 13.674283027648926,
                "prob": 868291.75,
                "token": ":'"
            },
            {
                "log_prob": 12.76136302947998,
                "prob": 348489.375,
                "token": ":_"
            },
            {
                "log_prob": 12.759154319763184,
                "prob": 347720.5,
                "token": ":`"
            }
        ],
        "prob": 0.996391236782074,
        "token": ":"
    },
    {
        "log_prob": -0.002689318498596549,
        "predicted_tokens": [
            {
                "log_prob": 21.002792358398438,
                "prob": 1322503552,
                "token": ";"
            },
            {
                "log_prob": 14.184685707092285,
                "prob": 1446541,
                "token": ";\\"
            },
            {
                "log_prob": 13.88477611541748,
                "prob": 1071720.75,
                "token": "<"
            },
            {
                "log_prob": 13.104978561401367,
                "prob": 491382.71875,
                "token": ";\""
            },
            {
                "log_prob": 11.611817359924316,
                "prob": 110394.703125,
                "token": ";&"
            }
        ],
        "prob": 0.9973142743110657,
        "token": ";"
    },
    {
        "log_prob": -0.0029337245505303144,
        "predicted_tokens": [
            {
                "log_prob": 21.378076553344727,
                "prob": 1924778112,
                "token": "<"
            },
            {
                "log_prob": 14.486305236816406,
                "prob": 1955791,
                "token": "<="
            },
            {
                "log_prob": 13.938075065612793,
                "prob": 1130392,
                "token": "<>"
            },
            {
                "log_prob": 13.816359519958496,
                "prob": 1000849.25,
                "token": "?"
            },
            {
                "log_prob": 12.587311744689941,
                "prob": 292819.53125,
                "token": ".<"
            }
        ],
        "prob": 0.9970705509185791,
        "token": "<"
    },
    {
        "log_prob": -0.0037785815075039864,
        "predicted_tokens": [
            {
                "log_prob": 21.547496795654297,
                "prob": 2280126720,
                "token": "=>"
            },
            {
                "log_prob": 15.445091247558594,
                "prob": 5101735,
                "token": ">="
            },
            {
                "log_prob": 13.97079086303711,
                "prob": 1167985.375,
                "token": "->"
            },
            {
                "log_prob": 13.873663902282715,
                "prob": 1059877.5,
                "token": ">?"
            },
            {
                "log_prob": 12.94228458404541,
                "prob": 417602.1875,
                "token": "▁=>"
            }
        ],
        "prob": 0.9962285757064819,
        "token": "=>"
    },
    {
        "log_prob": -0.003859809832647443,
        "predicted_tokens": [
            {
                "log_prob": 20.344751358032227,
                "prob": 684878080,
                "token": "?"
            },
            {
                "log_prob": 13.988714218139648,
                "prob": 1189108.25,
                "token": "@"
            },
            {
                "log_prob": 13.015386581420898,
                "prob": 449273.25,
                "token": "?'"
            },
            {
                "log_prob": 12.356780052185059,
                "prob": 232531.28125,
                "token": "?_"
            },
            {
                "log_prob": 11.824227333068848,
                "prob": 136520.125,
                "token": "\\"
            }
        ],
        "prob": 0.9961476922035217,
        "token": "?"
    },
    {
        "log_prob": -0.0007998128421604633,
        "predicted_tokens": [
            {
                "log_prob": 22.501846313476562,
                "prob": 5921444864,
                "token": "@"
            },
            {
                "log_prob": 14.918319702148438,
                "prob": 3012617.25,
                "token": "@{"
            },
            {
                "log_prob": 13.24065113067627,
                "prob": 562783.9375,
                "token": "[@"
            },
            {
                "log_prob": 12.816036224365234,
                "prob": 368072.875,
                "token": "▁@"
            },
            {
                "log_prob": 11.912306785583496,
                "prob": 149090.203125,
                "token": "\\\\"
            }
        ],
        "prob": 0.9992005228996277,
        "token": "@"
    },
    {
        "log_prob": -0.18445545434951782,
        "predicted_tokens": [
            {
                "log_prob": 16.751293182373047,
                "prob": 18836240,
                "token": "["
            },
            {
                "log_prob": 14.62870979309082,
                "prob": 2255111,
                "token": "[\\"
            },
            {
                "log_prob": 12.870471000671387,
                "prob": 388664.21875,
                "token": "[]"
            },
            {
                "log_prob": 12.626850128173828,
                "prob": 304629.0625,
                "token": "\\\\"
            },
            {
                "log_prob": 12.586540222167969,
                "prob": 292593.6875,
                "token": "^"
            }
        ],
        "prob": 0.8315569758415222,
        "token": "["
    },
    {
        "log_prob": -0.0011243456974625587,
        "predicted_tokens": [
            {
                "log_prob": 19.774616241455078,
                "prob": 387263648,
                "token": "\\\\"
            },
            {
                "log_prob": 10.840693473815918,
                "prob": 51056.77734375,
                "token": "{"
            },
            {
                "log_prob": 10.801358222961426,
                "prob": 49087.42578125,
                "token": "]"
            },
            {
                "log_prob": 10.675056457519531,
                "prob": 43263.1484375,
                "token": "\\\""
            },
            {
                "log_prob": 10.439423561096191,
                "prob": 34180.94140625,
                "token": "▁\\"
            }
        ],
        "prob": 0.9988763332366943,
        "token": "\\\\"
    },
    {
        "log_prob": -0.0022512348368763924,
        "predicted_tokens": [
            {
                "log_prob": 22.891578674316406,
                "prob": 8743519232,
                "token": "]"
            },
            {
                "log_prob": 15.79006290435791,
                "prob": 7203394.5,
                "token": "\\]"
            },
            {
                "log_prob": 15.75053596496582,
                "prob": 6924220,
                "token": "]\\"
            },
            {
                "log_prob": 14.160096168518066,
                "prob": 1411405,
                "token": "\\\\"
            },
            {
                "log_prob": 13.282772064208984,
                "prob": 586995.3125,
                "token": "]/"
            }
        ],
        "prob": 0.9977512955665588,
        "token": "]"
    },
    {
        "log_prob": -0.010731722228229046,
        "predicted_tokens": [
            {
                "log_prob": 20.34524154663086,
                "prob": 685213888,
                "token": "^"
            },
            {
                "log_prob": 15.529640197753906,
                "prob": 5551841,
                "token": "^{"
            },
            {
                "log_prob": 13.112915992736816,
                "prob": 495298.5625,
                "token": "_"
            },
            {
                "log_prob": 12.474629402160645,
                "prob": 261615.046875,
                "token": "▁^"
            },
            {
                "log_prob": 12.283835411071777,
                "prob": 216173.25,
                "token": "^\\"
            }
        ],
        "prob": 0.9893256425857544,
        "token": "^"
    },
    {
        "log_prob": -0.005691157653927803,
        "predicted_tokens": [
            {
                "log_prob": 21.888599395751953,
                "prob": 3206992640,
                "token": "_"
            },
            {
                "log_prob": 15.902090072631836,
                "prob": 8057308,
                "token": "_\\"
            },
            {
                "log_prob": 15.699607849121094,
                "prob": 6580411,
                "token": "_{"
            },
            {
                "log_prob": 14.641094207763672,
                "prob": 2283213,
                "token": "`"
            },
            {
                "log_prob": 12.297477722167969,
                "prob": 219142.5625,
                "token": "_{\\"
            }
        ],
        "prob": 0.9943249821662903,
        "token": "_"
    },
    {
        "log_prob": -0.005666858050972223,
        "predicted_tokens": [
            {
                "log_prob": 21.016342163085938,
                "prob": 1340545024,
                "token": "`"
            },
            {
                "log_prob": 15.721516609191895,
                "prob": 6726171.5,
                "token": "▁`"
            },
            {
                "log_prob": 12.750844955444336,
                "prob": 344843.15625,
                "token": "'"
            },
            {
                "log_prob": 11.4911470413208,
                "prob": 97845.703125,
                "token": "``"
            },
            {
                "log_prob": 11.401596069335938,
                "prob": 89464.40625,
                "token": "`."
            }
        ],
        "prob": 0.9943491220474243,
        "token": "`"
    },
    {
        "log_prob": -0.0062485807575285435,
        "predicted_tokens": [
            {
                "log_prob": 20.061298370361328,
                "prob": 515835424,
                "token": "{"
            },
            {
                "log_prob": 13.7365083694458,
                "prob": 924037.9375,
                "token": "{'"
            },
            {
                "log_prob": 13.537505149841309,
                "prob": 757292.6875,
                "token": "{}"
            },
            {
                "log_prob": 13.504417419433594,
                "prob": 732645.625,
                "token": "{\\"
            },
            {
                "log_prob": 12.741189956665039,
                "prob": 341529.71875,
                "token": "{("
            }
        ],
        "prob": 0.9937708973884583,
        "token": "{"
    },
    {
        "log_prob": -0.0008081507403403521,
        "predicted_tokens": [
            {
                "log_prob": 22.803977966308594,
                "prob": 8010171392,
                "token": "|"
            },
            {
                "log_prob": 14.763984680175781,
                "prob": 2581767.25,
                "token": "||"
            },
            {
                "log_prob": 14.69541072845459,
                "prob": 2410659.25,
                "token": "|\\"
            },
            {
                "log_prob": 13.356185913085938,
                "prob": 631710.125,
                "token": "▁|"
            },
            {
                "log_prob": 13.031133651733398,
                "prob": 456404.03125,
                "token": "}|"
            }
        ],
        "prob": 0.9991921782493591,
        "token": "|"
    },
    {
        "log_prob": -0.0006871246150694788,
        "predicted_tokens": [
            {
                "log_prob": 22.45951271057129,
                "prob": 5676000768,
                "token": "}"
            },
            {
                "log_prob": 14.246672630310059,
                "prob": 1539045,
                "token": "}'"
            },
            {
                "log_prob": 13.916059494018555,
                "prob": 1105777.75,
                "token": "}\\"
            },
            {
                "log_prob": 12.525056838989258,
                "prob": 275145.90625,
                "token": "}/"
            },
            {
                "log_prob": 12.12774658203125,
                "prob": 184932.578125,
                "token": "}|"
            }
        ],
        "prob": 0.9993131160736084,
        "token": "}"
    },
    {
        "log_prob": -0.006700429134070873,
        "predicted_tokens": [
            {
                "log_prob": 21.037084579467773,
                "prob": 1368641664,
                "token": "~"
            },
            {
                "log_prob": 15.813117980957031,
                "prob": 7371398.5,
                "token": "~\\"
            },
            {
                "log_prob": 13.809110641479492,
                "prob": 993620.5,
                "token": "▁~"
            },
            {
                "log_prob": 12.562508583068848,
                "prob": 285646,
                "token": "▁'"
            },
            {
                "log_prob": 12.366049766540527,
                "prob": 234696.796875,
                "token": "'"
            }
        ],
        "prob": 0.99332195520401,
        "token": "~"
    },
    {
        "log_prob": -0.019167792052030563,
        "predicted_tokens": [
            {
                "log_prob": 17.20383071899414,
                "prob": 29616158,
                "token": "'"
            },
            {
                "log_prob": 12.813814163208008,
                "prob": 367255.90625,
                "token": "▁'"
            },
            {
                "log_prob": 10.832738876342773,
                "prob": 50652.25,
                "token": "\\\\"
            },
            {
                "log_prob": 10.669638633728027,
                "prob": 43029.390625,
                "token": "`"
            },
            {
                "log_prob": 9.513388633728027,
                "prob": 13539.798828125,
                "token": "▁\\"
            }
        ],
        "prob": 0.9810147285461426,
        "token": "'"
    },
    {
        "log_prob": -0.0074737234972417355,
        "predicted_tokens": [
            {
                "log_prob": 19.664684295654297,
                "prob": 346947616,
                "token": "<0x0A>"
            },
            {
                "log_prob": 13.63675594329834,
                "prob": 836311.0625,
                "token": "▁*"
            },
            {
                "log_prob": 13.271453857421875,
                "prob": 580389,
                "token": "▁#"
            },
            {
                "log_prob": 13.088383674621582,
                "prob": 483295.5625,
                "token": "▁\\"
            },
            {
                "log_prob": 12.719724655151367,
                "prob": 334276.8125,
                "token": "▁+"
            }
        ],
        "prob": 0.9925541281700134,
        "token": "\n"
    },
    {
        "log_prob": -0.4447517991065979,
        "predicted_tokens": [
            {
                "log_prob": 15.324481010437012,
                "prob": 4522072.5,
                "token": "<0x0A>"
            },
            {
                "log_prob": 14.691778182983398,
                "prob": 2401918.25,
                "token": "▁▁▁"
            },
            {
                "log_prob": 11.623154640197754,
                "prob": 111653.390625,
                "token": "▁▁▁▁"
            },
            {
                "log_prob": 8.012069702148438,
                "prob": 3017.1552734375,
                "token": "``"
            },
            {
                "log_prob": 7.706795692443848,
                "prob": 2223.406494140625,
                "token": "▁▁▁▁▁▁▁▁"
            }
        ],
        "prob": 0.6409833431243896,
        "token": "\n"
    },
    {
        "log_prob": -0.0008337597246281803,
        "predicted_tokens": [
            {
                "log_prob": 20.790645599365234,
                "prob": 1069701696,
                "token": "▁▁▁"
            },
            {
                "log_prob": 12.941064834594727,
                "prob": 417093.125,
                "token": "#"
            },
            {
                "log_prob": 11.198334693908691,
                "prob": 73008.7578125,
                "token": "▁▁▁▁"
            },
            {
                "log_prob": 11.155927658081055,
                "prob": 69977.40625,
                "token": "<0x09>"
            },
            {
                "log_prob": 11.084360122680664,
                "prob": 65144.30078125,
                "token": "▁▁"
            }
        ],
        "prob": 0.9991665482521057,
        "token": "  "
    },
    {
        "log_prob": -4.642983436584473,
        "predicted_tokens": [
            {
                "log_prob": 14.452061653137207,
                "prob": 1889951.375,
                "token": "▁v"
            },
            {
                "log_prob": 14.348597526550293,
                "prob": 1704185,
                "token": "▁num"
            },
            {
                "log_prob": 12.6670560836792,
                "prob": 317126.53125,
                "token": "▁#"
            },
            {
                "log_prob": 12.481612205505371,
                "prob": 263448.25,
                "token": "▁count"
            },
            {
                "log_prob": 12.259777069091797,
                "prob": 211034.546875,
                "token": "▁number"
            }
        ],
        "prob": 0.00962892733514309,
        "token": "no"
    },
    {
        "log_prob": -0.0007683662115596235,
        "predicted_tokens": [
            {
                "log_prob": 21.109657287597656,
                "prob": 1471660672,
                "token": "_"
            },
            {
                "log_prob": 13.250605583190918,
                "prob": 568414.1875,
                "token": "Of"
            },
            {
                "log_prob": 12.288505554199219,
                "prob": 217185.171875,
                "token": "V"
            },
            {
                "log_prob": 11.548717498779297,
                "prob": 103644.03125,
                "token": "v"
            },
            {
                "log_prob": 10.59510612487793,
                "prob": 39938.90234375,
                "token": "Cons"
            }
        ],
        "prob": 0.9992319345474243,
        "token": "_"
    },
    {
        "log_prob": -0.38745856285095215,
        "predicted_tokens": [
            {
                "log_prob": 19.048009872436523,
                "prob": 187260240,
                "token": "v"
            },
            {
                "log_prob": 17.263532638549805,
                "prob": 31438148,
                "token": "of"
            },
            {
                "log_prob": 16.97341537475586,
                "prob": 23521264,
                "token": "con"
            },
            {
                "log_prob": 16.884824752807617,
                "prob": 21527134,
                "token": "dig"
            },
            {
                "log_prob": 15.804916381835938,
                "prob": 7311188.5,
                "token": "cons"
            }
        ],
        "prob": 0.6787797212600708,
        "token": "v"
    },
    {
        "log_prob": -0.0001851148990681395,
        "predicted_tokens": [
            {
                "log_prob": 23.643985748291016,
                "prob": 18554640384,
                "token": "ow"
            },
            {
                "log_prob": 14.34237003326416,
                "prob": 1693605.25,
                "token": "_"
            },
            {
                "log_prob": 13.426051139831543,
                "prob": 677423,
                "token": "ows"
            },
            {
                "log_prob": 13.033578872680664,
                "prob": 457521.375,
                "token": "ocal"
            },
            {
                "log_prob": 12.511641502380371,
                "prob": 271479.375,
                "token": "▁="
            }
        ],
        "prob": 0.9998148679733276,
        "token": "ow"
    },
    {
        "log_prob": -0.03757078945636749,
        "predicted_tokens": [
            {
                "log_prob": 20.175186157226562,
                "prob": 578058816,
                "token": "els"
            },
            {
                "log_prob": 16.90062713623047,
                "prob": 21870016,
                "token": "el"
            },
            {
                "log_prob": 11.022608757019043,
                "prob": 61243.2421875,
                "token": "ells"
            },
            {
                "log_prob": 10.82683277130127,
                "prob": 50353.96875,
                "token": "ls"
            },
            {
                "log_prob": 10.149232864379883,
                "prob": 25571.478515625,
                "token": "les"
            }
        ],
        "prob": 0.9631262421607971,
        "token": "els"
    },
    {
        "log_prob": -0.24600669741630554,
        "predicted_tokens": [
            {
                "log_prob": 20.40215492248535,
                "prob": 725342784,
                "token": "▁="
            },
            {
                "log_prob": 19.0582275390625,
                "prob": 189183408,
                "token": "_"
            },
            {
                "log_prob": 16.379684448242188,
                "prob": 12989923,
                "token": ","
            },
            {
                "log_prob": 9.898843765258789,
                "prob": 19907.33984375,
                "token": ":"
            },
            {
                "log_prob": 9.800271987915039,
                "prob": 18038.650390625,
                "token": "="
            }
        ],
        "prob": 0.7819169759750366,
        "token": "="
    },
    {
        "log_prob": -5.199387550354004,
        "predicted_tokens": [
            {
                "log_prob": 17.297964096069336,
                "prob": 32539462,
                "token": "▁''"
            },
            {
                "log_prob": 15.646903991699219,
                "prob": 6242579.5,
                "token": "▁[]"
            },
            {
                "log_prob": 15.37121295928955,
                "prob": 4738413.5,
                "token": "▁\"\""
            },
            {
                "log_prob": 14.643769264221191,
                "prob": 2289329,
                "token": "▁["
            },
            {
                "log_prob": 14.532767295837402,
                "prob": 2048805.125,
                "token": "▁"
            }
        ],
        "prob": 0.005519943777471781,
        "token": "'"
    },
    {
        "log_prob": -0.02875581569969654,
        "predicted_tokens": [
            {
                "log_prob": 17.266765594482422,
                "prob": 31539952,
                "token": "'."
            },
            {
                "log_prob": 13.542778968811035,
                "prob": 761297.125,
                "token": "▁'"
            },
            {
                "log_prob": 10.448657989501953,
                "prob": 34498.046875,
                "token": "':"
            },
            {
                "log_prob": 9.928659439086914,
                "prob": 20509.828125,
                "token": "▁'."
            },
            {
                "log_prob": 9.28548812866211,
                "prob": 10780.43359375,
                "token": "`"
            }
        ],
        "prob": 0.9716536998748779,
        "token": "'."
    },
    {
        "log_prob": -0.0001784403866622597,
        "predicted_tokens": [
            {
                "log_prob": 26.206745147705078,
                "prob": 240682647552,
                "token": "join"
            },
            {
                "log_prob": 17.264389038085938,
                "prob": 31465086,
                "token": "▁join"
            },
            {
                "log_prob": 15.398042678833008,
                "prob": 4867264.5,
                "token": "Join"
            },
            {
                "log_prob": 14.748834609985352,
                "prob": 2542948.25,
                "token": "translate"
            },
            {
                "log_prob": 13.950489044189453,
                "prob": 1144512.125,
                "token": "▁Join"
            }
        ],
        "prob": 0.9998215436935425,
        "token": "join"
    },
    {
        "log_prob": -0.3616176247596741,
        "predicted_tokens": [
            {
                "log_prob": 20.59340476989746,
                "prob": 878217408,
                "token": "(["
            },
            {
                "log_prob": 19.756935119628906,
                "prob": 380476544,
                "token": "("
            },
            {
                "log_prob": 13.92604923248291,
                "prob": 1116879.625,
                "token": "(("
            },
            {
                "log_prob": 13.032609939575195,
                "prob": 457078.28125,
                "token": "(['"
            },
            {
                "log_prob": 11.215797424316406,
                "prob": 74294.890625,
                "token": "('"
            }
        ],
        "prob": 0.6965486407279968,
        "token": "(["
    },
    {
        "log_prob": -1.1323676109313965,
        "predicted_tokens": [
            {
                "log_prob": 17.438907623291016,
                "prob": 37464624,
                "token": "c"
            },
            {
                "log_prob": 16.886621475219727,
                "prob": 21565846,
                "token": "char"
            },
            {
                "log_prob": 14.619966506958008,
                "prob": 2235480,
                "token": "i"
            },
            {
                "log_prob": 14.443029403686523,
                "prob": 1872957.75,
                "token": "letter"
            },
            {
                "log_prob": 13.963010787963867,
                "prob": 1158933.5,
                "token": "x"
            }
        ],
        "prob": 0.32226935029029846,
        "token": "char"
    },
    {
        "log_prob": -0.003703760216012597,
        "predicted_tokens": [
            {
                "log_prob": 20.750648498535156,
                "prob": 1027761088,
                "token": "▁for"
            },
            {
                "log_prob": 15.016142845153809,
                "prob": 3322216.75,
                "token": "."
            },
            {
                "log_prob": 12.757424354553223,
                "prob": 347119.5,
                "token": "▁if"
            },
            {
                "log_prob": 10.827263832092285,
                "prob": 50375.6796875,
                "token": "_"
            },
            {
                "log_prob": 10.362614631652832,
                "prob": 31653.8359375,
                "token": "<0x0A>"
            }
        ],
        "prob": 0.9963030815124512,
        "token": "for"
    },
    {
        "log_prob": -0.00007199982064776123,
        "predicted_tokens": [
            {
                "log_prob": 23.73309898376465,
                "prob": 20284014592,
                "token": "▁char"
            },
            {
                "log_prob": 13.187097549438477,
                "prob": 533437.6875,
                "token": "▁i"
            },
            {
                "log_prob": 12.480913162231445,
                "prob": 263264.15625,
                "token": "char"
            },
            {
                "log_prob": 12.411249160766602,
                "prob": 245548.359375,
                "token": "▁character"
            },
            {
                "log_prob": 12.20449447631836,
                "prob": 199684.609375,
                "token": "▁index"
            }
        ],
        "prob": 0.9999279975891113,
        "token": "char"
    },
    {
        "log_prob": -0.000018715683836489916,
        "predicted_tokens": [
            {
                "log_prob": 22.87883949279785,
                "prob": 8632841216,
                "token": "▁in"
            },
            {
                "log_prob": 10.9886474609375,
                "prob": 59198.26171875,
                "token": "_"
            },
            {
                "log_prob": 10.159088134765625,
                "prob": 25824.73828125,
                "token": "<0x0A>"
            },
            {
                "log_prob": 9.95822811126709,
                "prob": 21125.330078125,
                "token": "▁"
            },
            {
                "log_prob": 9.111175537109375,
                "prob": 9055.9345703125,
                "token": "▁\\"
            }
        ],
        "prob": 0.9999812841415405,
        "token": "in"
    },
    {
        "log_prob": -0.0030648186802864075,
        "predicted_tokens": [
            {
                "log_prob": 20.369300842285156,
                "prob": 701899584,
                "token": "▁input"
            },
            {
                "log_prob": 13.96485710144043,
                "prob": 1161075.25,
                "token": "▁original"
            },
            {
                "log_prob": 13.309196472167969,
                "prob": 602713.0625,
                "token": "▁str"
            },
            {
                "log_prob": 11.928813934326172,
                "prob": 151571.6875,
                "token": "▁list"
            },
            {
                "log_prob": 11.1469144821167,
                "prob": 69349.515625,
                "token": "▁string"
            }
        ],
        "prob": 0.9969398975372314,
        "token": "input"
    },
    {
        "log_prob": -0.0000023841830625315197,
        "predicted_tokens": [
            {
                "log_prob": 26.838354110717773,
                "prob": 452636016640,
                "token": "_"
            },
            {
                "log_prob": 12.922821998596191,
                "prob": 409553.15625,
                "token": "\\_"
            },
            {
                "log_prob": 12.877573013305664,
                "prob": 391434.34375,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.369438171386719,
                "prob": 235493.390625,
                "token": "▁if"
            },
            {
                "log_prob": 10.8833589553833,
                "prob": 53282.2734375,
                "token": "▁str"
            }
        ],
        "prob": 0.999997615814209,
        "token": "_"
    },
    {
        "log_prob": -0.000011086402082582936,
        "predicted_tokens": [
            {
                "log_prob": 29.284257888793945,
                "prob": 5223860928512,
                "token": "str"
            },
            {
                "log_prob": 17.094003677368164,
                "prob": 26535756,
                "token": "▁str"
            },
            {
                "log_prob": 17.084388732910156,
                "prob": 26281838,
                "token": "string"
            },
            {
                "log_prob": 13.732731819152832,
                "prob": 920554.8125,
                "token": "stat"
            },
            {
                "log_prob": 13.442683219909668,
                "prob": 688784.125,
                "token": "STR"
            }
        ],
        "prob": 0.9999889731407166,
        "token": "str"
    },
    {
        "log_prob": -0.005842394195497036,
        "predicted_tokens": [
            {
                "log_prob": 21.017271041870117,
                "prob": 1341790976,
                "token": "▁if"
            },
            {
                "log_prob": 15.041444778442383,
                "prob": 3407347.75,
                "token": "<0x0A>"
            },
            {
                "log_prob": 14.863642692565918,
                "prob": 2852318.25,
                "token": "."
            },
            {
                "log_prob": 13.892216682434082,
                "prob": 1079724.75,
                "token": "▁\\"
            },
            {
                "log_prob": 12.710177421569824,
                "prob": 331100.5625,
                "token": "▁"
            }
        ],
        "prob": 0.9941746592521667,
        "token": "if"
    },
    {
        "log_prob": -0.004633998032659292,
        "predicted_tokens": [
            {
                "log_prob": 21.731910705566406,
                "prob": 2741882880,
                "token": "▁char"
            },
            {
                "log_prob": 16.32098388671875,
                "prob": 12249355,
                "token": "▁not"
            },
            {
                "log_prob": 12.390765190124512,
                "prob": 240569.703125,
                "token": "▁("
            },
            {
                "log_prob": 11.796156883239746,
                "prob": 132741.234375,
                "token": "char"
            },
            {
                "log_prob": 9.351377487182617,
                "prob": 11514.673828125,
                "token": "▁str"
            }
        ],
        "prob": 0.995376706123352,
        "token": "char"
    },
    {
        "log_prob": -0.016691554337739944,
        "predicted_tokens": [
            {
                "log_prob": 22.217315673828125,
                "prob": 4455101440,
                "token": "▁not"
            },
            {
                "log_prob": 18.10178565979004,
                "prob": 72695184,
                "token": "."
            },
            {
                "log_prob": 14.455303192138672,
                "prob": 1896087.75,
                "token": "▁in"
            },
            {
                "log_prob": 12.24923324584961,
                "prob": 208821.109375,
                "token": "▁NOT"
            },
            {
                "log_prob": 10.709785461425781,
                "prob": 44792.02734375,
                "token": "not"
            }
        ],
        "prob": 0.9834469556808472,
        "token": "not"
    },
    {
        "log_prob": -0.000023245540432981215,
        "predicted_tokens": [
            {
                "log_prob": 22.86048698425293,
                "prob": 8475851264,
                "token": "▁in"
            },
            {
                "log_prob": 11.813318252563477,
                "prob": 135038.90625,
                "token": "in"
            },
            {
                "log_prob": 9.498419761657715,
                "prob": 13338.6318359375,
                "token": "<0x0A>"
            },
            {
                "log_prob": 9.480496406555176,
                "prob": 13101.6884765625,
                "token": "▁not"
            },
            {
                "log_prob": 9.460409164428711,
                "prob": 12841.13671875,
                "token": "▁"
            }
        ],
        "prob": 0.9999767541885376,
        "token": "in"
    },
    {
        "log_prob": -0.0002686616498976946,
        "predicted_tokens": [
            {
                "log_prob": 22.796485900878906,
                "prob": 7950382592,
                "token": "▁v"
            },
            {
                "log_prob": 13.84292221069336,
                "prob": 1027790.75,
                "token": "▁("
            },
            {
                "log_prob": 13.014537811279297,
                "prob": 448892.09375,
                "token": "▁'"
            },
            {
                "log_prob": 12.468247413635254,
                "prob": 259950.734375,
                "token": "▁set"
            },
            {
                "log_prob": 11.668378829956055,
                "prob": 116818.75,
                "token": "▁list"
            }
        ],
        "prob": 0.9997313618659973,
        "token": "v"
    },
    {
        "log_prob": -0.000001311301275563892,
        "predicted_tokens": [
            {
                "log_prob": 26.61809539794922,
                "prob": 363154931712,
                "token": "ow"
            },
            {
                "log_prob": 12.271259307861328,
                "prob": 213471.65625,
                "token": "ows"
            },
            {
                "log_prob": 11.433938980102539,
                "prob": 92405.2421875,
                "token": "owe"
            },
            {
                "log_prob": 11.033510208129883,
                "prob": 61914.53515625,
                "token": "owed"
            },
            {
                "log_prob": 10.258551597595215,
                "prob": 28525.439453125,
                "token": "ov"
            }
        ],
        "prob": 0.9999986886978149,
        "token": "ow"
    },
    {
        "log_prob": -1.1920928244535389e-7,
        "predicted_tokens": [
            {
                "log_prob": 33.1234245300293,
                "prob": 242840152047616,
                "token": "els"
            },
            {
                "log_prob": 16.28949737548828,
                "prob": 11869674,
                "token": "als"
            },
            {
                "log_prob": 16.212465286254883,
                "prob": 10989659,
                "token": "el"
            },
            {
                "log_prob": 15.939773559570312,
                "prob": 8366729.5,
                "token": "▁els"
            },
            {
                "log_prob": 15.335637092590332,
                "prob": 4572803.5,
                "token": "▁Els"
            }
        ],
        "prob": 0.9999998807907104,
        "token": "els"
    },
    {
        "log_prob": -0.0033131728414446115,
        "predicted_tokens": [
            {
                "log_prob": 21.162227630615234,
                "prob": 1551096064,
                "token": "])"
            },
            {
                "log_prob": 14.899910926818848,
                "prob": 2957665.75,
                "token": "])."
            },
            {
                "log_prob": 13.00346851348877,
                "prob": 443950.5625,
                "token": "▁and"
            },
            {
                "log_prob": 12.882368087768555,
                "prob": 393315.75,
                "token": "▁or"
            },
            {
                "log_prob": 12.798551559448242,
                "prob": 361693.1875,
                "token": "."
            }
        ],
        "prob": 0.9966922998428345,
        "token": "])"
    },
    {
        "log_prob": -0.0011634016409516335,
        "predicted_tokens": [
            {
                "log_prob": 21.992366790771484,
                "prob": 3557652736,
                "token": "<0x0A>"
            },
            {
                "log_prob": 14.331881523132324,
                "prob": 1675934.625,
                "token": "▁"
            },
            {
                "log_prob": 13.923705101013184,
                "prob": 1114264.5,
                "token": "▁#"
            },
            {
                "log_prob": 13.107324600219727,
                "prob": 492536.875,
                "token": "▁if"
            },
            {
                "log_prob": 12.5592679977417,
                "prob": 284721.84375,
                "token": "▁▁▁"
            }
        ],
        "prob": 0.9988372921943665,
        "token": "\n"
    },
    {
        "log_prob": -0.015169140882790089,
        "predicted_tokens": [
            {
                "log_prob": 21.203399658203125,
                "prob": 1616290688,
                "token": "▁▁▁"
            },
            {
                "log_prob": 17.01505470275879,
                "prob": 24521348,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.18889331817627,
                "prob": 72322.703125,
                "token": "▁▁▁▁"
            },
            {
                "log_prob": 10.525869369506836,
                "prob": 37267.21875,
                "token": "``"
            },
            {
                "log_prob": 9.441481590270996,
                "prob": 12600.3720703125,
                "token": "▁▁▁▁▁▁▁"
            }
        ],
        "prob": 0.9849453568458557,
        "token": "  "
    },
    {
        "log_prob": -0.12644273042678833,
        "predicted_tokens": [
            {
                "log_prob": 16.4686336517334,
                "prob": 14198312,
                "token": "▁no"
            },
            {
                "log_prob": 13.969602584838867,
                "prob": 1166598.25,
                "token": "▁num"
            },
            {
                "log_prob": 11.644220352172852,
                "prob": 114030.3984375,
                "token": "▁count"
            },
            {
                "log_prob": 11.563258171081543,
                "prob": 105162.09375,
                "token": "▁only"
            },
            {
                "log_prob": 11.443892478942871,
                "prob": 93329.59375,
                "token": "▁first"
            }
        ],
        "prob": 0.8812245726585388,
        "token": "no"
    },
    {
        "log_prob": -0.0000295634672511369,
        "predicted_tokens": [
            {
                "log_prob": 23.651195526123047,
                "prob": 18688899072,
                "token": "_"
            },
            {
                "log_prob": 11.831124305725098,
                "prob": 137464.96875,
                "token": "Con"
            },
            {
                "log_prob": 11.408454895019531,
                "prob": 90080.125,
                "token": "Cons"
            },
            {
                "log_prob": 11.060507774353027,
                "prob": 63608.84375,
                "token": "Dig"
            },
            {
                "log_prob": 10.800705909729004,
                "prob": 49055.41796875,
                "token": "__"
            }
        ],
        "prob": 0.9999704360961914,
        "token": "_"
    },
    {
        "log_prob": -0.052240096032619476,
        "predicted_tokens": [
            {
                "log_prob": 22.211502075195312,
                "prob": 4429276160,
                "token": "con"
            },
            {
                "log_prob": 18.862279891967773,
                "prob": 155519232,
                "token": "cons"
            },
            {
                "log_prob": 18.000545501708984,
                "prob": 65695800,
                "token": "dig"
            },
            {
                "log_prob": 15.619504928588867,
                "prob": 6073860.5,
                "token": "special"
            },
            {
                "log_prob": 15.11452579498291,
                "prob": 3665685.25,
                "token": "v"
            }
        ],
        "prob": 0.9491009712219238,
        "token": "con"
    },
    {
        "log_prob": -0.0010399178136140108,
        "predicted_tokens": [
            {
                "log_prob": 21.93948745727539,
                "prob": 3374413824,
                "token": "son"
            },
            {
                "log_prob": 14.60512924194336,
                "prob": 2202556.5,
                "token": "so"
            },
            {
                "log_prob": 12.672818183898926,
                "prob": 318959.09375,
                "token": "secut"
            },
            {
                "log_prob": 11.796399116516113,
                "prob": 132773.390625,
                "token": "▁="
            },
            {
                "log_prob": 11.34922981262207,
                "prob": 84900.03125,
                "token": "_"
            }
        ],
        "prob": 0.9989606142044067,
        "token": "son"
    },
    {
        "log_prob": -0.0014807938132435083,
        "predicted_tokens": [
            {
                "log_prob": 23.596309661865234,
                "prob": 17690783744,
                "token": "ants"
            },
            {
                "log_prob": 16.863300323486328,
                "prob": 21068726,
                "token": "ant"
            },
            {
                "log_prob": 14.762141227722168,
                "prob": 2577012.25,
                "token": "ents"
            },
            {
                "log_prob": 14.331591606140137,
                "prob": 1675448.75,
                "token": "ats"
            },
            {
                "log_prob": 12.357643127441406,
                "prob": 232732.0625,
                "token": "_"
            }
        ],
        "prob": 0.9985203146934509,
        "token": "ants"
    },
    {
        "log_prob": -0.0010976725025102496,
        "predicted_tokens": [
            {
                "log_prob": 23.774293899536133,
                "prob": 21137061888,
                "token": "▁="
            },
            {
                "log_prob": 16.871423721313477,
                "prob": 21240572,
                "token": "_"
            },
            {
                "log_prob": 13.894041061401367,
                "prob": 1081696.375,
                "token": "="
            },
            {
                "log_prob": 12.852338790893555,
                "prob": 381680.375,
                "token": "▁"
            },
            {
                "log_prob": 12.676630973815918,
                "prob": 320177.5625,
                "token": ","
            }
        ],
        "prob": 0.9989029169082642,
        "token": "="
    },
    {
        "log_prob": -0.002217336092144251,
        "predicted_tokens": [
            {
                "log_prob": 22.196138381958008,
                "prob": 4361746432,
                "token": "▁'"
            },
            {
                "log_prob": 15.844030380249023,
                "prob": 7602824.5,
                "token": "▁''"
            },
            {
                "log_prob": 13.539362907409668,
                "prob": 758700.875,
                "token": "▁\""
            },
            {
                "log_prob": 12.781339645385742,
                "prob": 355521.03125,
                "token": "▁input"
            },
            {
                "log_prob": 12.435906410217285,
                "prob": 251678.171875,
                "token": "▁["
            }
        ],
        "prob": 0.9977851510047913,
        "token": "'"
    },
    {
        "log_prob": -0.00027426297310739756,
        "predicted_tokens": [
            {
                "log_prob": 24.579730987548828,
                "prob": 47297867776,
                "token": "'."
            },
            {
                "log_prob": 16.205293655395508,
                "prob": 10911127,
                "token": "▁'."
            },
            {
                "log_prob": 13.402691841125488,
                "prob": 661782.25,
                "token": ".'"
            },
            {
                "log_prob": 13.365084648132324,
                "prob": 637356.625,
                "token": "'.$"
            },
            {
                "log_prob": 12.352173805236816,
                "prob": 231462.65625,
                "token": "▁'"
            }
        ],
        "prob": 0.9997258186340332,
        "token": "'."
    },
    {
        "log_prob": -0.000013708974620385561,
        "predicted_tokens": [
            {
                "log_prob": 29.6190242767334,
                "prob": 7300940562432,
                "token": "join"
            },
            {
                "log_prob": 18.085783004760742,
                "prob": 71541128,
                "token": "▁join"
            },
            {
                "log_prob": 16.831510543823242,
                "prob": 20409490,
                "token": "Join"
            },
            {
                "log_prob": 14.652578353881836,
                "prob": 2309585,
                "token": "joint"
            },
            {
                "log_prob": 14.527122497558594,
                "prob": 2037272.625,
                "token": "▁joining"
            }
        ],
        "prob": 0.9999862909317017,
        "token": "join"
    },
    {
        "log_prob": -0.0007893307483755052,
        "predicted_tokens": [
            {
                "log_prob": 24.464805603027344,
                "prob": 42162860032,
                "token": "(["
            },
            {
                "log_prob": 17.081859588623047,
                "prob": 26215452,
                "token": "("
            },
            {
                "log_prob": 15.583700180053711,
                "prob": 5860234.5,
                "token": "(['"
            },
            {
                "log_prob": 12.46533489227295,
                "prob": 259194.71875,
                "token": "('"
            },
            {
                "log_prob": 12.463377952575684,
                "prob": 258688,
                "token": "(("
            }
        ],
        "prob": 0.9992110133171082,
        "token": "(["
    },
    {
        "log_prob": -0.00009357491217087954,
        "predicted_tokens": [
            {
                "log_prob": 24.75872039794922,
                "prob": 56568627200,
                "token": "char"
            },
            {
                "log_prob": 14.524622917175293,
                "prob": 2032186.625,
                "token": "▁char"
            },
            {
                "log_prob": 13.934316635131836,
                "prob": 1126151.5,
                "token": "c"
            },
            {
                "log_prob": 13.14323616027832,
                "prob": 510546.0625,
                "token": "i"
            },
            {
                "log_prob": 12.711689949035645,
                "prob": 331601.75,
                "token": "x"
            }
        ],
        "prob": 0.9999064207077026,
        "token": "char"
    },
    {
        "log_prob": -0.000571326119825244,
        "predicted_tokens": [
            {
                "log_prob": 22.298538208007812,
                "prob": 4832057344,
                "token": "▁for"
            },
            {
                "log_prob": 14.19461727142334,
                "prob": 1460978.875,
                "token": "."
            },
            {
                "log_prob": 13.605502128601074,
                "prob": 810577.375,
                "token": "▁if"
            },
            {
                "log_prob": 12.690632820129395,
                "prob": 324692.15625,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.198107719421387,
                "prob": 72992.1875,
                "token": "▁"
            }
        ],
        "prob": 0.9994288086891174,
        "token": "for"
    },
    {
        "log_prob": -0.000028609820219571702,
        "predicted_tokens": [
            {
                "log_prob": 24.47581672668457,
                "prob": 42629689344,
                "token": "▁char"
            },
            {
                "log_prob": 13.173073768615723,
                "prob": 526009.125,
                "token": "▁character"
            },
            {
                "log_prob": 12.56202220916748,
                "prob": 285507.09375,
                "token": "char"
            },
            {
                "log_prob": 11.489991188049316,
                "prob": 97732.6796875,
                "token": "▁i"
            },
            {
                "log_prob": 11.346939086914062,
                "prob": 84705.78125,
                "token": "▁index"
            }
        ],
        "prob": 0.9999714493751526,
        "token": "char"
    },
    {
        "log_prob": -0.0000046491513785440475,
        "predicted_tokens": [
            {
                "log_prob": 24.27248191833496,
                "prob": 34786037760,
                "token": "▁in"
            },
            {
                "log_prob": 10.931341171264648,
                "prob": 55901.203125,
                "token": "<0x0A>"
            },
            {
                "log_prob": 10.526168823242188,
                "prob": 37278.37890625,
                "token": "▁"
            },
            {
                "log_prob": 9.33456039428711,
                "prob": 11322.6494140625,
                "token": "_"
            },
            {
                "log_prob": 8.77174186706543,
                "prob": 6449.39697265625,
                "token": "in"
            }
        ],
        "prob": 0.9999953508377075,
        "token": "in"
    },
    {
        "log_prob": -0.0013448490062728524,
        "predicted_tokens": [
            {
                "log_prob": 21.999732971191406,
                "prob": 3583955712,
                "token": "▁input"
            },
            {
                "log_prob": 14.980819702148438,
                "prob": 3206914,
                "token": "▁no"
            },
            {
                "log_prob": 13.97712516784668,
                "prob": 1175407.125,
                "token": "▁original"
            },
            {
                "log_prob": 11.350074768066406,
                "prob": 84971.8046875,
                "token": "▁revers"
            },
            {
                "log_prob": 10.868688583374023,
                "prob": 52506.30859375,
                "token": "▁str"
            }
        ],
        "prob": 0.9986560344696045,
        "token": "input"
    },
    {
        "log_prob": -0.000002145764938177308,
        "predicted_tokens": [
            {
                "log_prob": 27.28469467163086,
                "prob": 707281551360,
                "token": "_"
            },
            {
                "log_prob": 13.8724946975708,
                "prob": 1058639.125,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.994245529174805,
                "prob": 161820.921875,
                "token": "_*"
            },
            {
                "log_prob": 11.988846778869629,
                "prob": 160949.640625,
                "token": "\\_"
            },
            {
                "log_prob": 11.419007301330566,
                "prob": 91035.7265625,
                "token": "▁if"
            }
        ],
        "prob": 0.9999978542327881,
        "token": "_"
    },
    {
        "log_prob": -0.00000834461570775602,
        "predicted_tokens": [
            {
                "log_prob": 32.1273307800293,
                "prob": 89685552529408,
                "token": "str"
            },
            {
                "log_prob": 19.964702606201172,
                "prob": 468338848,
                "token": "▁str"
            },
            {
                "log_prob": 18.798917770385742,
                "prob": 145970896,
                "token": "string"
            },
            {
                "log_prob": 18.185386657714844,
                "prob": 79033840,
                "token": "stra"
            },
            {
                "log_prob": 16.74614143371582,
                "prob": 18739448,
                "token": "strings"
            }
        ],
        "prob": 0.9999917149543762,
        "token": "str"
    },
    {
        "log_prob": -0.0002694958820939064,
        "predicted_tokens": [
            {
                "log_prob": 22.28580093383789,
                "prob": 4770900480,
                "token": "▁if"
            },
            {
                "log_prob": 13.179532051086426,
                "prob": 529417.1875,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.69618034362793,
                "prob": 326498.375,
                "token": "."
            },
            {
                "log_prob": 11.981057167053223,
                "prob": 159700.78125,
                "token": "▁\\"
            },
            {
                "log_prob": 11.772233009338379,
                "prob": 129603.2265625,
                "token": "▁"
            }
        ],
        "prob": 0.9997305274009705,
        "token": "if"
    },
    {
        "log_prob": -0.0021870045457035303,
        "predicted_tokens": [
            {
                "log_prob": 22.24733543395996,
                "prob": 4590870016,
                "token": "▁char"
            },
            {
                "log_prob": 16.043128967285156,
                "prob": 9277744,
                "token": "▁not"
            },
            {
                "log_prob": 12.9124174118042,
                "prob": 405314,
                "token": "▁("
            },
            {
                "log_prob": 11.66616153717041,
                "prob": 116560.015625,
                "token": "char"
            },
            {
                "log_prob": 10.500344276428223,
                "prob": 36328.0078125,
                "token": "▁"
            }
        ],
        "prob": 0.9978153705596924,
        "token": "char"
    },
    {
        "log_prob": -0.023360395804047585,
        "predicted_tokens": [
            {
                "log_prob": 22.347169876098633,
                "prob": 5072856576,
                "token": "▁not"
            },
            {
                "log_prob": 18.525312423706055,
                "prob": 111030160,
                "token": "▁in"
            },
            {
                "log_prob": 15.903440475463867,
                "prob": 8068196,
                "token": "."
            },
            {
                "log_prob": 13.3436918258667,
                "prob": 623866.625,
                "token": "▁!="
            },
            {
                "log_prob": 10.79324722290039,
                "prob": 48690.88671875,
                "token": "▁=="
            }
        ],
        "prob": 0.9769102931022644,
        "token": "not"
    },
    {
        "log_prob": -0.00003123234637314454,
        "predicted_tokens": [
            {
                "log_prob": 21.89027214050293,
                "prob": 3212361216,
                "token": "▁in"
            },
            {
                "log_prob": 10.742609024047852,
                "prob": 46286.66015625,
                "token": "in"
            },
            {
                "log_prob": 9.592581748962402,
                "prob": 14655.658203125,
                "token": "<0x0A>"
            },
            {
                "log_prob": 9.304145812988281,
                "prob": 10983.4599609375,
                "token": "▁"
            },
            {
                "log_prob": 8.401039123535156,
                "prob": 4451.6904296875,
                "token": "▁not"
            }
        ],
        "prob": 0.9999688267707825,
        "token": "in"
    },
    {
        "log_prob": -0.015067102387547493,
        "predicted_tokens": [
            {
                "log_prob": 20.55914306640625,
                "prob": 848637824,
                "token": "▁cons"
            },
            {
                "log_prob": 16.245685577392578,
                "prob": 11360870,
                "token": "▁("
            },
            {
                "log_prob": 13.544623374938965,
                "prob": 762702.5,
                "token": "▁v"
            },
            {
                "log_prob": 12.25899887084961,
                "prob": 210870.375,
                "token": "▁('"
            },
            {
                "log_prob": 12.14417839050293,
                "prob": 187996.46875,
                "token": "▁dig"
            }
        ],
        "prob": 0.985045850276947,
        "token": "cons"
    },
    {
        "log_prob": -1.1920928244535389e-7,
        "predicted_tokens": [
            {
                "log_prob": 28.393007278442383,
                "prob": 2142527291392,
                "token": "on"
            },
            {
                "log_prob": 12.601646423339844,
                "prob": 297047.21875,
                "token": "an"
            },
            {
                "log_prob": 11.078181266784668,
                "prob": 64743.02734375,
                "token": "ON"
            },
            {
                "log_prob": 11.062458992004395,
                "prob": 63733.078125,
                "token": "ont"
            },
            {
                "log_prob": 9.485444068908691,
                "prob": 13166.6728515625,
                "token": "ant"
            }
        ],
        "prob": 0.9999998807907104,
        "token": "on"
    },
    {
        "log_prob": -0.000004529942543740617,
        "predicted_tokens": [
            {
                "log_prob": 31.098438262939453,
                "prob": 32053846343680,
                "token": "ants"
            },
            {
                "log_prob": 18.69255256652832,
                "prob": 131241872,
                "token": "ant"
            },
            {
                "log_prob": 16.091304779052734,
                "prob": 9735648,
                "token": "ents"
            },
            {
                "log_prob": 13.771038055419922,
                "prob": 956501.9375,
                "token": "ats"
            },
            {
                "log_prob": 13.585867881774902,
                "prob": 794817.5625,
                "token": "antes"
            }
        ],
        "prob": 0.9999954700469971,
        "token": "ants"
    },
    {
        "log_prob": -0.22393697500228882,
        "predicted_tokens": [
            {
                "log_prob": 19.046119689941406,
                "prob": 186906608,
                "token": "])"
            },
            {
                "log_prob": 17.568126678466797,
                "prob": 42632468,
                "token": "▁and"
            },
            {
                "log_prob": 14.477845191955566,
                "prob": 1939314.75,
                "token": "▁+"
            },
            {
                "log_prob": 14.333251953125,
                "prob": 1678233,
                "token": "▁or"
            },
            {
                "log_prob": 12.145140647888184,
                "prob": 188177.453125,
                "token": "])."
            }
        ],
        "prob": 0.7993655204772949,
        "token": "])"
    },
    {
        "log_prob": -0.00009178694017464295,
        "predicted_tokens": [
            {
                "log_prob": 23.26582908630371,
                "prob": 12712213504,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.813977241516113,
                "prob": 367315.78125,
                "token": "▁#"
            },
            {
                "log_prob": 12.562353134155273,
                "prob": 285601.59375,
                "token": "▁"
            },
            {
                "log_prob": 11.383829116821289,
                "prob": 87888.9296875,
                "token": "▁▁▁"
            },
            {
                "log_prob": 11.183783531188965,
                "prob": 71954.0859375,
                "token": "▁//"
            }
        ],
        "prob": 0.9999082088470459,
        "token": "\n"
    },
    {
        "log_prob": -0.017855381593108177,
        "predicted_tokens": [
            {
                "log_prob": 22.138614654541016,
                "prob": 4117922560,
                "token": "▁▁▁"
            },
            {
                "log_prob": 18.11786460876465,
                "prob": 73873488,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.123194694519043,
                "prob": 184092.703125,
                "token": "▁▁▁▁"
            },
            {
                "log_prob": 11.099581718444824,
                "prob": 66143.484375,
                "token": "``"
            },
            {
                "log_prob": 9.593819618225098,
                "prob": 14673.8115234375,
                "token": "<0x09>"
            }
        ],
        "prob": 0.9823030233383179,
        "token": "  "
    },
    {
        "log_prob": -0.0722901001572609,
        "predicted_tokens": [
            {
                "log_prob": 17.9372501373291,
                "prob": 61666424,
                "token": "▁no"
            },
            {
                "log_prob": 14.489953994750977,
                "prob": 1962940.125,
                "token": "▁only"
            },
            {
                "log_prob": 13.546429634094238,
                "prob": 764081.4375,
                "token": "▁has"
            },
            {
                "log_prob": 13.25747299194336,
                "prob": 572331.125,
                "token": "▁dig"
            },
            {
                "log_prob": 13.246526718139648,
                "prob": 566100.375,
                "token": "▁num"
            }
        ],
        "prob": 0.930260956287384,
        "token": "no"
    },
    {
        "log_prob": -0.00002372236667724792,
        "predicted_tokens": [
            {
                "log_prob": 24.76991081237793,
                "prob": 57205211136,
                "token": "_"
            },
            {
                "log_prob": 13.732190132141113,
                "prob": 920056.25,
                "token": "Dig"
            },
            {
                "log_prob": 10.981233596801758,
                "prob": 58761,
                "token": "V"
            },
            {
                "log_prob": 10.891083717346191,
                "prob": 53695.4609375,
                "token": "dig"
            },
            {
                "log_prob": 10.707927703857422,
                "prob": 44708.89453125,
                "token": "Special"
            }
        ],
        "prob": 0.9999763369560242,
        "token": "_"
    },
    {
        "log_prob": -0.0051497905515134335,
        "predicted_tokens": [
            {
                "log_prob": 23.06163215637207,
                "prob": 10364290048,
                "token": "dig"
            },
            {
                "log_prob": 16.504268646240234,
                "prob": 14713392,
                "token": "special"
            },
            {
                "log_prob": 16.266530990600586,
                "prob": 11600178,
                "token": "v"
            },
            {
                "log_prob": 16.04977035522461,
                "prob": 9339566,
                "token": "num"
            },
            {
                "log_prob": 15.901472091674805,
                "prob": 8052330.5,
                "token": "wh"
            }
        ],
        "prob": 0.9948634505271912,
        "token": "dig"
    },
    {
        "log_prob": -0.001191621064208448,
        "predicted_tokens": [
            {
                "log_prob": 22.994808197021484,
                "prob": 9694341120,
                "token": "its"
            },
            {
                "log_prob": 15.877290725708008,
                "prob": 7859949.5,
                "token": "it"
            },
            {
                "log_prob": 14.736617088317871,
                "prob": 2512068.75,
                "token": "s"
            },
            {
                "log_prob": 12.32905387878418,
                "prob": 226172.65625,
                "token": "▁="
            },
            {
                "log_prob": 12.226858139038086,
                "prob": 204200.609375,
                "token": "ts"
            }
        ],
        "prob": 0.9988091588020325,
        "token": "its"
    },
    {
        "log_prob": -0.002079587895423174,
        "predicted_tokens": [
            {
                "log_prob": 22.825424194335938,
                "prob": 8183814144,
                "token": "▁="
            },
            {
                "log_prob": 16.463462829589844,
                "prob": 14125084,
                "token": "_"
            },
            {
                "log_prob": 13.733887672424316,
                "prob": 921619.4375,
                "token": "='"
            },
            {
                "log_prob": 13.578351020812988,
                "prob": 788865.375,
                "token": "="
            },
            {
                "log_prob": 13.48225212097168,
                "prob": 716585,
                "token": ","
            }
        ],
        "prob": 0.9979225993156433,
        "token": "="
    },
    {
        "log_prob": -0.004613232798874378,
        "predicted_tokens": [
            {
                "log_prob": 21.09284019470215,
                "prob": 1447118592,
                "token": "▁'"
            },
            {
                "log_prob": 15.375955581665039,
                "prob": 4760939.5,
                "token": "▁input"
            },
            {
                "log_prob": 13.939857482910156,
                "prob": 1132408.75,
                "token": "▁''"
            },
            {
                "log_prob": 12.481315612792969,
                "prob": 263370.125,
                "token": "▁["
            },
            {
                "log_prob": 11.649529457092285,
                "prob": 114637.4140625,
                "token": "▁\""
            }
        ],
        "prob": 0.9953973293304443,
        "token": "'"
    },
    {
        "log_prob": -0.00013004888023715466,
        "predicted_tokens": [
            {
                "log_prob": 25.09111213684082,
                "prob": 78873575424,
                "token": "'."
            },
            {
                "log_prob": 16.04627227783203,
                "prob": 9306953,
                "token": "▁'."
            },
            {
                "log_prob": 13.182119369506836,
                "prob": 530788.6875,
                "token": ".'"
            },
            {
                "log_prob": 11.985654830932617,
                "prob": 160436.71875,
                "token": "’."
            },
            {
                "log_prob": 11.465975761413574,
                "prob": 95413.5390625,
                "token": "'.$"
            }
        ],
        "prob": 0.9998700022697449,
        "token": "'."
    },
    {
        "log_prob": -0.00001680836794548668,
        "predicted_tokens": [
            {
                "log_prob": 30.380361557006836,
                "prob": 15632318857216,
                "token": "join"
            },
            {
                "log_prob": 19.133893966674805,
                "prob": 204053744,
                "token": "▁join"
            },
            {
                "log_prob": 17.48552703857422,
                "prob": 39252552,
                "token": "Join"
            },
            {
                "log_prob": 15.754034996032715,
                "prob": 6948490.5,
                "token": "▁joining"
            },
            {
                "log_prob": 15.614141464233398,
                "prob": 6041371,
                "token": "▁Join"
            }
        ],
        "prob": 0.9999831914901733,
        "token": "join"
    },
    {
        "log_prob": -0.0006808108882978559,
        "predicted_tokens": [
            {
                "log_prob": 24.174415588378906,
                "prob": 31536631808,
                "token": "(["
            },
            {
                "log_prob": 16.77156639099121,
                "prob": 19222006,
                "token": "("
            },
            {
                "log_prob": 14.130492210388184,
                "prob": 1370234.125,
                "token": "(['"
            },
            {
                "log_prob": 12.19365406036377,
                "prob": 197531.65625,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.020594596862793,
                "prob": 166141.421875,
                "token": "(("
            }
        ],
        "prob": 0.9993193745613098,
        "token": "(["
    },
    {
        "log_prob": -0.00017712931730784476,
        "predicted_tokens": [
            {
                "log_prob": 24.561418533325195,
                "prob": 46439608320,
                "token": "char"
            },
            {
                "log_prob": 15.026362419128418,
                "prob": 3356342.75,
                "token": "c"
            },
            {
                "log_prob": 14.785292625427246,
                "prob": 2637369.75,
                "token": "▁char"
            },
            {
                "log_prob": 13.437399864196777,
                "prob": 685154.6875,
                "token": "i"
            },
            {
                "log_prob": 13.018880844116211,
                "prob": 450845.90625,
                "token": "x"
            }
        ],
        "prob": 0.9998229146003723,
        "token": "char"
    },
    {
        "log_prob": -0.0006087357178330421,
        "predicted_tokens": [
            {
                "log_prob": 22.58233070373535,
                "prob": 6417732608,
                "token": "▁for"
            },
            {
                "log_prob": 14.635807037353516,
                "prob": 2271173.25,
                "token": "▁if"
            },
            {
                "log_prob": 14.136453628540039,
                "prob": 1378427.125,
                "token": "."
            },
            {
                "log_prob": 11.520315170288086,
                "prob": 100741.71875,
                "token": "▁"
            },
            {
                "log_prob": 10.849801063537598,
                "prob": 51523.90234375,
                "token": "<0x0A>"
            }
        ],
        "prob": 0.999391496181488,
        "token": "for"
    },
    {
        "log_prob": -0.000027656173188006505,
        "predicted_tokens": [
            {
                "log_prob": 24.458600997924805,
                "prob": 41902067712,
                "token": "▁char"
            },
            {
                "log_prob": 13.275259971618652,
                "prob": 582602.25,
                "token": "▁character"
            },
            {
                "log_prob": 12.117121696472168,
                "prob": 182978.078125,
                "token": "char"
            },
            {
                "log_prob": 11.714654922485352,
                "prob": 122351.6953125,
                "token": "▁i"
            },
            {
                "log_prob": 11.360686302185059,
                "prob": 85878.28125,
                "token": "▁index"
            }
        ],
        "prob": 0.9999723434448242,
        "token": "char"
    },
    {
        "log_prob": -0.000002861018856492592,
        "predicted_tokens": [
            {
                "log_prob": 24.580530166625977,
                "prob": 47335682048,
                "token": "▁in"
            },
            {
                "log_prob": 10.59576416015625,
                "prob": 39965.19140625,
                "token": "▁"
            },
            {
                "log_prob": 10.197423934936523,
                "prob": 26833.970703125,
                "token": "<0x0A>"
            },
            {
                "log_prob": 9.653676986694336,
                "prob": 15578.966796875,
                "token": "_"
            },
            {
                "log_prob": 8.733338356018066,
                "prob": 6206.41259765625,
                "token": "▁if"
            }
        ],
        "prob": 0.9999971389770508,
        "token": "in"
    },
    {
        "log_prob": -0.0000840390202938579,
        "predicted_tokens": [
            {
                "log_prob": 23.152294158935547,
                "prob": 11347850240,
                "token": "▁input"
            },
            {
                "log_prob": 12.821842193603516,
                "prob": 370216.125,
                "token": "▁no"
            },
            {
                "log_prob": 11.994614601135254,
                "prob": 161880.640625,
                "token": "▁str"
            },
            {
                "log_prob": 11.453269004821777,
                "prob": 94208.8125,
                "token": "input"
            },
            {
                "log_prob": 11.179121017456055,
                "prob": 71619.3828125,
                "token": "▁string"
            }
        ],
        "prob": 0.9999160170555115,
        "token": "input"
    },
    {
        "log_prob": -0.00000250339189733495,
        "predicted_tokens": [
            {
                "log_prob": 27.34235191345215,
                "prob": 749259980800,
                "token": "_"
            },
            {
                "log_prob": 14.139216423034668,
                "prob": 1382240.625,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.787083625793457,
                "prob": 357569,
                "token": "\\_"
            },
            {
                "log_prob": 11.062782287597656,
                "prob": 63753.6875,
                "token": "▁str"
            },
            {
                "log_prob": 10.038469314575195,
                "prob": 22890.318359375,
                "token": "_*"
            }
        ],
        "prob": 0.9999974966049194,
        "token": "_"
    },
    {
        "log_prob": -0.000012993727978027891,
        "predicted_tokens": [
            {
                "log_prob": 29.035568237304688,
                "prob": 4073681321984,
                "token": "str"
            },
            {
                "log_prob": 16.728239059448242,
                "prob": 18406952,
                "token": "▁str"
            },
            {
                "log_prob": 16.440404891967773,
                "prob": 13803116,
                "token": "string"
            },
            {
                "log_prob": 16.088043212890625,
                "prob": 9703947,
                "token": "stra"
            },
            {
                "log_prob": 14.955804824829102,
                "prob": 3127688.5,
                "token": "STR"
            }
        ],
        "prob": 0.999987006187439,
        "token": "str"
    },
    {
        "log_prob": -0.0000883301836438477,
        "predicted_tokens": [
            {
                "log_prob": 23.333621978759766,
                "prob": 13603895296,
                "token": "▁if"
            },
            {
                "log_prob": 13.156647682189941,
                "prob": 517439.40625,
                "token": "."
            },
            {
                "log_prob": 12.175768852233887,
                "prob": 194030.15625,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.165806770324707,
                "prob": 192106.8125,
                "token": "▁"
            },
            {
                "log_prob": 11.500753402709961,
                "prob": 98790.171875,
                "token": "_"
            }
        ],
        "prob": 0.9999117255210876,
        "token": "if"
    },
    {
        "log_prob": -0.006615759804844856,
        "predicted_tokens": [
            {
                "log_prob": 22.8109073638916,
                "prob": 8065869824,
                "token": "▁char"
            },
            {
                "log_prob": 17.784835815429688,
                "prob": 52948792,
                "token": "▁not"
            },
            {
                "log_prob": 12.1332426071167,
                "prob": 185951.765625,
                "token": "▁("
            },
            {
                "log_prob": 11.704949378967285,
                "prob": 121169.9453125,
                "token": "char"
            },
            {
                "log_prob": 10.910654067993164,
                "prob": 54756.6484375,
                "token": "▁chr"
            }
        ],
        "prob": 0.9934059977531433,
        "token": "char"
    },
    {
        "log_prob": -0.0002131234941771254,
        "predicted_tokens": [
            {
                "log_prob": 23.762937545776367,
                "prob": 20898379776,
                "token": "▁not"
            },
            {
                "log_prob": 15.159065246582031,
                "prob": 3832643.25,
                "token": "."
            },
            {
                "log_prob": 12.792427062988281,
                "prob": 359484.75,
                "token": "▁in"
            },
            {
                "log_prob": 11.238895416259766,
                "prob": 76030.921875,
                "token": "▁"
            },
            {
                "log_prob": 10.397740364074707,
                "prob": 32785.4609375,
                "token": "▁!="
            }
        ],
        "prob": 0.9997868537902832,
        "token": "not"
    },
    {
        "log_prob": -0.000006556489552167477,
        "predicted_tokens": [
            {
                "log_prob": 23.116878509521484,
                "prob": 10952992768,
                "token": "▁in"
            },
            {
                "log_prob": 9.711786270141602,
                "prob": 16511.0703125,
                "token": "in"
            },
            {
                "log_prob": 8.63524341583252,
                "prob": 5626.5029296875,
                "token": "<0x0A>"
            },
            {
                "log_prob": 8.512459754943848,
                "prob": 4976.388671875,
                "token": "▁digit"
            },
            {
                "log_prob": 8.413015365600586,
                "prob": 4505.3251953125,
                "token": "_"
            }
        ],
        "prob": 0.9999934434890747,
        "token": "in"
    },
    {
        "log_prob": -0.0000345700973412022,
        "predicted_tokens": [
            {
                "log_prob": 23.626935958862305,
                "prob": 18240970752,
                "token": "▁dig"
            },
            {
                "log_prob": 11.789151191711426,
                "prob": 131814.53125,
                "token": "▁digit"
            },
            {
                "log_prob": 11.766529083251953,
                "prob": 128866.0859375,
                "token": "▁'"
            },
            {
                "log_prob": 11.1451997756958,
                "prob": 69230.7109375,
                "token": "dig"
            },
            {
                "log_prob": 10.769783020019531,
                "prob": 47561.69921875,
                "token": "▁("
            }
        ],
        "prob": 0.9999654293060303,
        "token": "dig"
    },
    {
        "log_prob": -2.3841855067985307e-7,
        "predicted_tokens": [
            {
                "log_prob": 30.801149368286133,
                "prob": 23810537422848,
                "token": "its"
            },
            {
                "log_prob": 15.233879089355469,
                "prob": 4130376.25,
                "token": "ITS"
            },
            {
                "log_prob": 13.833060264587402,
                "prob": 1017704.5625,
                "token": "ts"
            },
            {
                "log_prob": 13.285730361938477,
                "prob": 588734.375,
                "token": "▁its"
            },
            {
                "log_prob": 13.255553245544434,
                "prob": 571233.4375,
                "token": "itos"
            }
        ],
        "prob": 0.9999997615814209,
        "token": "its"
    },
    {
        "log_prob": -0.002093982184305787,
        "predicted_tokens": [
            {
                "log_prob": 21.335336685180664,
                "prob": 1844246656,
                "token": "])"
            },
            {
                "log_prob": 14.128028869628906,
                "prob": 1366862.875,
                "token": "▁and"
            },
            {
                "log_prob": 14.060220718383789,
                "prob": 1277251,
                "token": "])."
            },
            {
                "log_prob": 12.913409233093262,
                "prob": 405716.21875,
                "token": "▁or"
            },
            {
                "log_prob": 12.372669219970703,
                "prob": 236255.515625,
                "token": "▁+"
            }
        ],
        "prob": 0.9979082345962524,
        "token": "])"
    },
    {
        "log_prob": -0.00005602679812000133,
        "predicted_tokens": [
            {
                "log_prob": 24.09129524230957,
                "prob": 29021280256,
                "token": "<0x0A>"
            },
            {
                "log_prob": 13.13076114654541,
                "prob": 504216.59375,
                "token": "▁"
            },
            {
                "log_prob": 13.12451171875,
                "prob": 501075.34375,
                "token": "▁#"
            },
            {
                "log_prob": 11.469093322753906,
                "prob": 95711.4609375,
                "token": "▁▁▁"
            },
            {
                "log_prob": 11.231560707092285,
                "prob": 75475.296875,
                "token": "▁if"
            }
        ],
        "prob": 0.9999440312385559,
        "token": "\n"
    },
    {
        "log_prob": -0.010568484663963318,
        "predicted_tokens": [
            {
                "log_prob": 23.03414535522461,
                "prob": 10083289088,
                "token": "▁▁▁"
            },
            {
                "log_prob": 18.481626510620117,
                "prob": 106284136,
                "token": "<0x0A>"
            },
            {
                "log_prob": 13.100713729858398,
                "prob": 489291.53125,
                "token": "``"
            },
            {
                "log_prob": 12.174626350402832,
                "prob": 193808.59375,
                "token": "▁▁▁▁"
            },
            {
                "log_prob": 10.894560813903809,
                "prob": 53882.48828125,
                "token": "<0x09>"
            }
        ],
        "prob": 0.9894871711730957,
        "token": "  "
    },
    {
        "log_prob": -0.044330619275569916,
        "predicted_tokens": [
            {
                "log_prob": 18.10733985900879,
                "prob": 73100064,
                "token": "▁no"
            },
            {
                "log_prob": 13.987334251403809,
                "prob": 1187468.375,
                "token": "▁has"
            },
            {
                "log_prob": 13.642600059509277,
                "prob": 841212.875,
                "token": "▁only"
            },
            {
                "log_prob": 13.210612297058105,
                "prob": 546130,
                "token": "▁num"
            },
            {
                "log_prob": 11.729207038879395,
                "prob": 124145.1796875,
                "token": "▁v"
            }
        ],
        "prob": 0.9566376805305481,
        "token": "no"
    },
    {
        "log_prob": -0.000024914430468925275,
        "predicted_tokens": [
            {
                "log_prob": 24.17559242248535,
                "prob": 31573766144,
                "token": "_"
            },
            {
                "log_prob": 12.928841590881348,
                "prob": 412025.9375,
                "token": "Special"
            },
            {
                "log_prob": 10.877361297607422,
                "prob": 52963.66015625,
                "token": "__"
            },
            {
                "log_prob": 10.870521545410156,
                "prob": 52602.640625,
                "token": "V"
            },
            {
                "log_prob": 10.749341011047363,
                "prob": 46599.30859375,
                "token": "▁special"
            }
        ],
        "prob": 0.9999750852584839,
        "token": "_"
    },
    {
        "log_prob": -0.039040930569171906,
        "predicted_tokens": [
            {
                "log_prob": 21.476652145385742,
                "prob": 2124180992,
                "token": "special"
            },
            {
                "log_prob": 17.667558670043945,
                "prob": 47089408,
                "token": "spec"
            },
            {
                "log_prob": 16.22860336303711,
                "prob": 11168449,
                "token": "v"
            },
            {
                "log_prob": 15.375746726989746,
                "prob": 4759945,
                "token": "sp"
            },
            {
                "log_prob": 14.911609649658203,
                "prob": 2992470,
                "token": "p"
            }
        ],
        "prob": 0.9617113471031189,
        "token": "special"
    },
    {
        "log_prob": -0.04585622251033783,
        "predicted_tokens": [
            {
                "log_prob": 21.793880462646484,
                "prob": 2917171968,
                "token": "_"
            },
            {
                "log_prob": 18.715280532836914,
                "prob": 134258896,
                "token": "▁="
            },
            {
                "log_prob": 14.618446350097656,
                "prob": 2232084.25,
                "token": "chars"
            },
            {
                "log_prob": 11.912147521972656,
                "prob": 149066.453125,
                "token": "Ch"
            },
            {
                "log_prob": 10.747053146362305,
                "prob": 46492.81640625,
                "token": "char"
            }
        ],
        "prob": 0.9551792740821838,
        "token": "_"
    },
    {
        "log_prob": -0.002942163497209549,
        "predicted_tokens": [
            {
                "log_prob": 22.814952850341797,
                "prob": 8098566144,
                "token": "chars"
            },
            {
                "log_prob": 16.68918228149414,
                "prob": 17701896,
                "token": "char"
            },
            {
                "log_prob": 15.309896469116211,
                "prob": 4456599,
                "token": "ch"
            },
            {
                "log_prob": 13.12202262878418,
                "prob": 499829.625,
                "token": "chs"
            },
            {
                "log_prob": 12.529097557067871,
                "prob": 276259.96875,
                "token": "symbol"
            }
        ],
        "prob": 0.9970621466636658,
        "token": "chars"
    },
    {
        "log_prob": -0.000436925794929266,
        "predicted_tokens": [
            {
                "log_prob": 23.622915267944336,
                "prob": 18167775232,
                "token": "▁="
            },
            {
                "log_prob": 15.403144836425781,
                "prob": 4892162,
                "token": "_"
            },
            {
                "log_prob": 14.345688819885254,
                "prob": 1699235.375,
                "token": "="
            },
            {
                "log_prob": 13.389432907104492,
                "prob": 653065.625,
                "token": "='"
            },
            {
                "log_prob": 12.701382637023926,
                "prob": 328201.375,
                "token": "▁"
            }
        ],
        "prob": 0.9995631575584412,
        "token": "="
    },
    {
        "log_prob": -0.0032238198909908533,
        "predicted_tokens": [
            {
                "log_prob": 20.71154022216797,
                "prob": 988342848,
                "token": "▁'"
            },
            {
                "log_prob": 14.089577674865723,
                "prob": 1315303.125,
                "token": "▁''"
            },
            {
                "log_prob": 13.704675674438477,
                "prob": 895086.5,
                "token": "▁input"
            },
            {
                "log_prob": 12.322599411010742,
                "prob": 224717.515625,
                "token": "▁\\"
            },
            {
                "log_prob": 11.98773193359375,
                "prob": 160770.3125,
                "token": "▁["
            }
        ],
        "prob": 0.9967813491821289,
        "token": "'"
    },
    {
        "log_prob": -0.00018130090029444546,
        "predicted_tokens": [
            {
                "log_prob": 24.574365615844727,
                "prob": 47044771840,
                "token": "'."
            },
            {
                "log_prob": 15.884392738342285,
                "prob": 7915970,
                "token": "▁'."
            },
            {
                "log_prob": 12.83225154876709,
                "prob": 374089.96875,
                "token": ".'"
            },
            {
                "log_prob": 11.186934471130371,
                "prob": 72181.1640625,
                "token": "'.$"
            },
            {
                "log_prob": 10.662137985229492,
                "prob": 42707.84765625,
                "token": "’."
            }
        ],
        "prob": 0.999818742275238,
        "token": "'."
    },
    {
        "log_prob": -0.000027656173188006505,
        "predicted_tokens": [
            {
                "log_prob": 29.536773681640625,
                "prob": 6724466507776,
                "token": "join"
            },
            {
                "log_prob": 18.745996475219727,
                "prob": 138446768,
                "token": "▁join"
            },
            {
                "log_prob": 17.269245147705078,
                "prob": 31618254,
                "token": "Join"
            },
            {
                "log_prob": 15.68930721282959,
                "prob": 6512977,
                "token": "▁joining"
            },
            {
                "log_prob": 15.416027069091797,
                "prob": 4955591.5,
                "token": "▁Join"
            }
        ],
        "prob": 0.9999723434448242,
        "token": "join"
    },
    {
        "log_prob": -0.002019510604441166,
        "predicted_tokens": [
            {
                "log_prob": 23.803895950317383,
                "prob": 21772115968,
                "token": "(["
            },
            {
                "log_prob": 17.501792907714844,
                "prob": 39896252,
                "token": "("
            },
            {
                "log_prob": 14.596040725708008,
                "prob": 2182629.25,
                "token": "(['"
            },
            {
                "log_prob": 14.00547981262207,
                "prob": 1209212.5,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.03170394897461,
                "prob": 167997.421875,
                "token": "([]"
            }
        ],
        "prob": 0.9979825019836426,
        "token": "(["
    },
    {
        "log_prob": -0.0006205302197486162,
        "predicted_tokens": [
            {
                "log_prob": 23.134403228759766,
                "prob": 11146632192,
                "token": "char"
            },
            {
                "log_prob": 14.942245483398438,
                "prob": 3085565.5,
                "token": "c"
            },
            {
                "log_prob": 14.255688667297363,
                "prob": 1552983.75,
                "token": "▁char"
            },
            {
                "log_prob": 13.433935165405273,
                "prob": 682784.875,
                "token": "i"
            },
            {
                "log_prob": 13.27097225189209,
                "prob": 580109.5625,
                "token": "<0x0A>"
            }
        ],
        "prob": 0.9993796944618225,
        "token": "char"
    },
    {
        "log_prob": -0.0026115619111806154,
        "predicted_tokens": [
            {
                "log_prob": 21.62592315673828,
                "prob": 2466147840,
                "token": "▁for"
            },
            {
                "log_prob": 14.990259170532227,
                "prob": 3237329,
                "token": "."
            },
            {
                "log_prob": 14.36003589630127,
                "prob": 1723790.125,
                "token": "▁if"
            },
            {
                "log_prob": 14.04979419708252,
                "prob": 1264002.875,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.406535148620605,
                "prob": 89907.359375,
                "token": "▁"
            }
        ],
        "prob": 0.9973918795585632,
        "token": "for"
    },
    {
        "log_prob": -0.000024318398573086597,
        "predicted_tokens": [
            {
                "log_prob": 24.126399993896484,
                "prob": 30058160128,
                "token": "▁char"
            },
            {
                "log_prob": 12.572996139526367,
                "prob": 288657.5,
                "token": "▁character"
            },
            {
                "log_prob": 11.67541217803955,
                "prob": 117643.2734375,
                "token": "char"
            },
            {
                "log_prob": 11.6416654586792,
                "prob": 113739.4375,
                "token": "▁i"
            },
            {
                "log_prob": 10.405366897583008,
                "prob": 33036.45703125,
                "token": "▁index"
            }
        ],
        "prob": 0.9999756813049316,
        "token": "char"
    },
    {
        "log_prob": -0.000016212332411669195,
        "predicted_tokens": [
            {
                "log_prob": 23.797143936157227,
                "prob": 21625606144,
                "token": "▁in"
            },
            {
                "log_prob": 12.323124885559082,
                "prob": 224835.640625,
                "token": "<0x0A>"
            },
            {
                "log_prob": 10.742551803588867,
                "prob": 46284.0078125,
                "token": "▁"
            },
            {
                "log_prob": 10.25883960723877,
                "prob": 28533.658203125,
                "token": "_"
            },
            {
                "log_prob": 8.523959159851074,
                "prob": 5033.9443359375,
                "token": "▁for"
            }
        ],
        "prob": 0.9999838471412659,
        "token": "in"
    },
    {
        "log_prob": -0.00014673586701974273,
        "predicted_tokens": [
            {
                "log_prob": 22.56981086730957,
                "prob": 6337884672,
                "token": "▁input"
            },
            {
                "log_prob": 12.518594741821289,
                "prob": 273373.625,
                "token": "▁string"
            },
            {
                "log_prob": 12.019327163696289,
                "prob": 165930.984375,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.875248908996582,
                "prob": 143666.34375,
                "token": "▁str"
            },
            {
                "log_prob": 11.440167427062988,
                "prob": 92982.578125,
                "token": "▁"
            }
        ],
        "prob": 0.9998533129692078,
        "token": "input"
    },
    {
        "log_prob": -0.000004887569048150908,
        "predicted_tokens": [
            {
                "log_prob": 27.605953216552734,
                "prob": 975243706368,
                "token": "_"
            },
            {
                "log_prob": 15.297186851501465,
                "prob": 4400316,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.033452033996582,
                "prob": 168291.359375,
                "token": "\\_"
            },
            {
                "log_prob": 11.775443077087402,
                "prob": 130019.9296875,
                "token": "▁if"
            },
            {
                "log_prob": 11.163837432861328,
                "prob": 70533.1015625,
                "token": "_*"
            }
        ],
        "prob": 0.9999951720237732,
        "token": "_"
    },
    {
        "log_prob": -0.0000019073468138230965,
        "predicted_tokens": [
            {
                "log_prob": 31.60606575012207,
                "prob": 53252490002432,
                "token": "str"
            },
            {
                "log_prob": 18.044815063476562,
                "prob": 68669456,
                "token": "▁str"
            },
            {
                "log_prob": 16.522785186767578,
                "prob": 14988371,
                "token": "string"
            },
            {
                "log_prob": 15.334465980529785,
                "prob": 4567451.5,
                "token": "STR"
            },
            {
                "log_prob": 14.840538024902344,
                "prob": 2787172,
                "token": "strap"
            }
        ],
        "prob": 0.9999980330467224,
        "token": "str"
    },
    {
        "log_prob": -0.000816250394564122,
        "predicted_tokens": [
            {
                "log_prob": 22.228910446166992,
                "prob": 4507058176,
                "token": "▁if"
            },
            {
                "log_prob": 14.508561134338379,
                "prob": 1999806.75,
                "token": "<0x0A>"
            },
            {
                "log_prob": 13.451114654541016,
                "prob": 694616.125,
                "token": "."
            },
            {
                "log_prob": 12.894428253173828,
                "prob": 398087.9375,
                "token": "▁\\"
            },
            {
                "log_prob": 12.76198959350586,
                "prob": 348707.78125,
                "token": "▁"
            }
        ],
        "prob": 0.9991840720176697,
        "token": "if"
    },
    {
        "log_prob": -0.004347397480159998,
        "predicted_tokens": [
            {
                "log_prob": 22.025768280029297,
                "prob": 3678490368,
                "token": "▁char"
            },
            {
                "log_prob": 16.523517608642578,
                "prob": 14999353,
                "token": "▁not"
            },
            {
                "log_prob": 13.383131980895996,
                "prob": 648963.6875,
                "token": "▁("
            },
            {
                "log_prob": 11.370148658752441,
                "prob": 86694.7578125,
                "token": "char"
            },
            {
                "log_prob": 10.737894058227539,
                "prob": 46068.9296875,
                "token": "▁len"
            }
        ],
        "prob": 0.9956620931625366,
        "token": "char"
    },
    {
        "log_prob": -0.003115326166152954,
        "predicted_tokens": [
            {
                "log_prob": 22.03362464904785,
                "prob": 3707503872,
                "token": "▁not"
            },
            {
                "log_prob": 15.928866386413574,
                "prob": 8275967.5,
                "token": "▁in"
            },
            {
                "log_prob": 14.91475772857666,
                "prob": 3001905.25,
                "token": "."
            },
            {
                "log_prob": 11.870207786560059,
                "prob": 142943.953125,
                "token": "▁!="
            },
            {
                "log_prob": 10.455763816833496,
                "prob": 34744.05859375,
                "token": "▁"
            }
        ],
        "prob": 0.9968894720077515,
        "token": "not"
    },
    {
        "log_prob": -0.00005769562994828448,
        "predicted_tokens": [
            {
                "log_prob": 22.474834442138672,
                "prob": 5763636736,
                "token": "▁in"
            },
            {
                "log_prob": 12.474872589111328,
                "prob": 261678.671875,
                "token": "in"
            },
            {
                "log_prob": 10.0198335647583,
                "prob": 22467.689453125,
                "token": "<0x0A>"
            },
            {
                "log_prob": 9.268059730529785,
                "prob": 10594.1767578125,
                "token": "▁special"
            },
            {
                "log_prob": 8.991657257080078,
                "prob": 8035.76318359375,
                "token": "▁"
            }
        ],
        "prob": 0.9999423623085022,
        "token": "in"
    },
    {
        "log_prob": -0.0005423743859864771,
        "predicted_tokens": [
            {
                "log_prob": 20.820127487182617,
                "prob": 1101707904,
                "token": "▁special"
            },
            {
                "log_prob": 12.333747863769531,
                "prob": 227236.796875,
                "token": "▁("
            },
            {
                "log_prob": 11.489861488342285,
                "prob": 97720,
                "token": "▁"
            },
            {
                "log_prob": 10.799293518066406,
                "prob": 48986.1796875,
                "token": "<0x0A>"
            },
            {
                "log_prob": 10.26762866973877,
                "prob": 28785.546875,
                "token": "special"
            }
        ],
        "prob": 0.9994577765464783,
        "token": "special"
    },
    {
        "log_prob": -0.000022291887944447808,
        "predicted_tokens": [
            {
                "log_prob": 23.061676025390625,
                "prob": 10364744704,
                "token": "_"
            },
            {
                "log_prob": 11.567061424255371,
                "prob": 105562.8125,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.165390968322754,
                "prob": 70642.7578125,
                "token": "\\_"
            },
            {
                "log_prob": 9.784836769104004,
                "prob": 17762.357421875,
                "token": "▁ch"
            },
            {
                "log_prob": 9.15720272064209,
                "prob": 9482.4951171875,
                "token": "chars"
            }
        ],
        "prob": 0.999977707862854,
        "token": "_"
    },
    {
        "log_prob": -0.0001517419150331989,
        "predicted_tokens": [
            {
                "log_prob": 26.321889877319336,
                "prob": 270054572032,
                "token": "chars"
            },
            {
                "log_prob": 17.289316177368164,
                "prob": 32259278,
                "token": "char"
            },
            {
                "log_prob": 14.816445350646973,
                "prob": 2720824,
                "token": "CHAR"
            },
            {
                "log_prob": 14.129240989685059,
                "prob": 1368520.875,
                "token": "chs"
            },
            {
                "log_prob": 14.080756187438965,
                "prob": 1303751.25,
                "token": "ch"
            }
        ],
        "prob": 0.9998482465744019,
        "token": "chars"
    },
    {
        "log_prob": -0.0007587176514789462,
        "predicted_tokens": [
            {
                "log_prob": 22.385099411010742,
                "prob": 5268962816,
                "token": "])"
            },
            {
                "log_prob": 13.827679634094238,
                "prob": 1012243.4375,
                "token": "▁or"
            },
            {
                "log_prob": 13.654440879821777,
                "prob": 851232.75,
                "token": "])."
            },
            {
                "log_prob": 13.4048433303833,
                "prob": 663207.625,
                "token": "▁if"
            },
            {
                "log_prob": 13.168848037719727,
                "prob": 523791,
                "token": "▁and"
            }
        ],
        "prob": 0.9992416501045227,
        "token": "])"
    },
    {
        "log_prob": -0.00007676783570786938,
        "predicted_tokens": [
            {
                "log_prob": 22.2242431640625,
                "prob": 4486071296,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.364171028137207,
                "prob": 86178.0703125,
                "token": "▁▁▁▁"
            },
            {
                "log_prob": 10.976786613464355,
                "prob": 58500.2734375,
                "token": "▁"
            },
            {
                "log_prob": 10.475886344909668,
                "prob": 35450.27734375,
                "token": "▁▁▁"
            },
            {
                "log_prob": 9.77427864074707,
                "prob": 17575.806640625,
                "token": "▁▁"
            }
        ],
        "prob": 0.9999232888221741,
        "token": "\n"
    },
    {
        "log_prob": -2.0639569759368896,
        "predicted_tokens": [
            {
                "log_prob": 16.421663284301758,
                "prob": 13546832,
                "token": "<0x0A>"
            },
            {
                "log_prob": 14.514245986938477,
                "prob": 2011207.875,
                "token": "▁▁▁"
            },
            {
                "log_prob": 12.469950675964355,
                "prob": 260393.875,
                "token": "▁▁▁▁"
            },
            {
                "log_prob": 8.748730659484863,
                "prob": 6302.68310546875,
                "token": "``"
            },
            {
                "log_prob": 8.21483325958252,
                "prob": 3695.360107421875,
                "token": "▁▁▁▁▁▁▁▁"
            }
        ],
        "prob": 0.12695063650608063,
        "token": "  "
    },
    {
        "log_prob": -4.630324840545654,
        "predicted_tokens": [
            {
                "log_prob": 14.049942016601562,
                "prob": 1264189.75,
                "token": "▁num"
            },
            {
                "log_prob": 13.102438926696777,
                "prob": 490136.34375,
                "token": "▁has"
            },
            {
                "log_prob": 12.99636459350586,
                "prob": 440807.9375,
                "token": "▁no"
            },
            {
                "log_prob": 12.8675537109375,
                "prob": 387532,
                "token": "▁only"
            },
            {
                "log_prob": 12.055499076843262,
                "prob": 172042.890625,
                "token": "▁v"
            }
        ],
        "prob": 0.00975159090012312,
        "token": "is"
    },
    {
        "log_prob": -0.002030455507338047,
        "predicted_tokens": [
            {
                "log_prob": 20.43545150756836,
                "prob": 749900736,
                "token": "_"
            },
            {
                "log_prob": 12.750831604003906,
                "prob": 344838.53125,
                "token": "V"
            },
            {
                "log_prob": 11.825313568115234,
                "prob": 136668.5,
                "token": "Pal"
            },
            {
                "log_prob": 11.8152437210083,
                "prob": 135299.171875,
                "token": "Dig"
            },
            {
                "log_prob": 11.44670295715332,
                "prob": 93592.265625,
                "token": "dig"
            }
        ],
        "prob": 0.9979716539382935,
        "token": "_"
    },
    {
        "log_prob": -7.664853572845459,
        "predicted_tokens": [
            {
                "log_prob": 17.91187858581543,
                "prob": 60121536,
                "token": "pal"
            },
            {
                "log_prob": 15.633691787719727,
                "prob": 6160643.5,
                "token": "long"
            },
            {
                "log_prob": 15.402458190917969,
                "prob": 4888804,
                "token": "even"
            },
            {
                "log_prob": 15.17225456237793,
                "prob": 3883528,
                "token": "empty"
            },
            {
                "log_prob": 15.003901481628418,
                "prob": 3281796.25,
                "token": "v"
            }
        ],
        "prob": 0.000469025457277894,
        "token": "alph"
    },
    {
        "log_prob": -0.09916146844625473,
        "predicted_tokens": [
            {
                "log_prob": 20.811668395996094,
                "prob": 1092427776,
                "token": "an"
            },
            {
                "log_prob": 18.268964767456055,
                "prob": 85923232,
                "token": "ab"
            },
            {
                "log_prob": 17.084426879882812,
                "prob": 26282842,
                "token": "abet"
            },
            {
                "log_prob": 12.88624382019043,
                "prob": 394843.125,
                "token": "numeric"
            },
            {
                "log_prob": 12.736863136291504,
                "prob": 340055.15625,
                "token": "num"
            }
        ],
        "prob": 0.9055964946746826,
        "token": "an"
    },
    {
        "log_prob": -0.041769079864025116,
        "predicted_tokens": [
            {
                "log_prob": 22.5223331451416,
                "prob": 6044007936,
                "token": "umeric"
            },
            {
                "log_prob": 19.275373458862305,
                "prob": 235065200,
                "token": "um"
            },
            {
                "log_prob": 16.832544326782227,
                "prob": 20430600,
                "token": "umer"
            },
            {
                "log_prob": 14.05377197265625,
                "prob": 1269040.875,
                "token": "umber"
            },
            {
                "log_prob": 12.227638244628906,
                "prob": 204359.96875,
                "token": "ump"
            }
        ],
        "prob": 0.9590912461280823,
        "token": "umeric"
    },
    {
        "log_prob": -0.005404029972851276,
        "predicted_tokens": [
            {
                "log_prob": 21.80349349975586,
                "prob": 2945350144,
                "token": "▁="
            },
            {
                "log_prob": 16.4719295501709,
                "prob": 14245185,
                "token": "_"
            },
            {
                "log_prob": 14.072364807128906,
                "prob": 1292856.625,
                "token": ","
            },
            {
                "log_prob": 12.094922065734863,
                "prob": 178960.8125,
                "token": "="
            },
            {
                "log_prob": 11.680440902709961,
                "prob": 118236.359375,
                "token": "▁"
            }
        ],
        "prob": 0.9946105480194092,
        "token": "="
    },
    {
        "log_prob": -0.5068957805633545,
        "predicted_tokens": [
            {
                "log_prob": 17.006345748901367,
                "prob": 24308722,
                "token": "▁all"
            },
            {
                "log_prob": 16.115520477294922,
                "prob": 9974281,
                "token": "▁bool"
            },
            {
                "log_prob": 14.483431816101074,
                "prob": 1950179.125,
                "token": "▁len"
            },
            {
                "log_prob": 13.802511215209961,
                "prob": 987084.75,
                "token": "▁("
            },
            {
                "log_prob": 13.674284934997559,
                "prob": 868293.375,
                "token": "▁not"
            }
        ],
        "prob": 0.6023625731468201,
        "token": "all"
    },
    {
        "log_prob": -0.3955448269844055,
        "predicted_tokens": [
            {
                "log_prob": 20.403535842895508,
                "prob": 726345152,
                "token": "("
            },
            {
                "log_prob": 19.649080276489258,
                "prob": 341575840,
                "token": "(["
            },
            {
                "log_prob": 15.945556640625,
                "prob": 8415254,
                "token": "(("
            },
            {
                "log_prob": 13.479390144348145,
                "prob": 714537.0625,
                "token": "(['"
            },
            {
                "log_prob": 13.22938346862793,
                "prob": 556478.3125,
                "token": "([]"
            }
        ],
        "prob": 0.6733131408691406,
        "token": "("
    },
    {
        "log_prob": -0.04576398804783821,
        "predicted_tokens": [
            {
                "log_prob": 19.01772689819336,
                "prob": 181674448,
                "token": "char"
            },
            {
                "log_prob": 14.830442428588867,
                "prob": 2759175.5,
                "token": "x"
            },
            {
                "log_prob": 14.18145751953125,
                "prob": 1441878.75,
                "token": "c"
            },
            {
                "log_prob": 14.018628120422363,
                "prob": 1225216.5,
                "token": "input"
            },
            {
                "log_prob": 13.544069290161133,
                "prob": 762280.0625,
                "token": "is"
            }
        ],
        "prob": 0.9552674293518066,
        "token": "char"
    },
    {
        "log_prob": -0.4539279043674469,
        "predicted_tokens": [
            {
                "log_prob": 18.709400177001953,
                "prob": 133471720,
                "token": "."
            },
            {
                "log_prob": 18.15004539489746,
                "prob": 76289464,
                "token": "▁in"
            },
            {
                "log_prob": 12.415361404418945,
                "prob": 246560.1875,
                "token": "▁not"
            },
            {
                "log_prob": 11.10245132446289,
                "prob": 66333.5625,
                "token": "_"
            },
            {
                "log_prob": 10.360937118530273,
                "prob": 31600.783203125,
                "token": "▁is"
            }
        ],
        "prob": 0.6351284980773926,
        "token": "."
    },
    {
        "log_prob": -0.0017239484004676342,
        "predicted_tokens": [
            {
                "log_prob": 24.260360717773438,
                "prob": 34366935040,
                "token": "is"
            },
            {
                "log_prob": 17.817522048950195,
                "prob": 54708088,
                "token": "isl"
            },
            {
                "log_prob": 15.057232856750488,
                "prob": 3461570.25,
                "token": "lower"
            },
            {
                "log_prob": 12.498435020446777,
                "prob": 267917.65625,
                "token": "▁is"
            },
            {
                "log_prob": 11.221657752990723,
                "prob": 74731.5625,
                "token": "iss"
            }
        ],
        "prob": 0.9982775449752808,
        "token": "is"
    },
    {
        "log_prob": -0.03912564739584923,
        "predicted_tokens": [
            {
                "log_prob": 24.318445205688477,
                "prob": 36422234112,
                "token": "al"
            },
            {
                "log_prob": 20.964534759521484,
                "prob": 1272863232,
                "token": "alpha"
            },
            {
                "log_prob": 18.821226119995117,
                "prob": 149263856,
                "token": "dig"
            },
            {
                "log_prob": 17.022062301635742,
                "prob": 24693790,
                "token": "alph"
            },
            {
                "log_prob": 15.263175964355469,
                "prob": 4253173.5,
                "token": "numeric"
            }
        ],
        "prob": 0.9616298675537109,
        "token": "al"
    },
    {
        "log_prob": -0.0006522196927107871,
        "predicted_tokens": [
            {
                "log_prob": 28.686641693115234,
                "prob": 2873758056448,
                "token": "num"
            },
            {
                "log_prob": 20.00860023498535,
                "prob": 489355744,
                "token": "▁num"
            },
            {
                "log_prob": 19.987503051757812,
                "prob": 479139840,
                "token": "phan"
            },
            {
                "log_prob": 19.805389404296875,
                "prob": 399366240,
                "token": "numeric"
            },
            {
                "log_prob": 18.556127548217773,
                "prob": 114504824,
                "token": "▁numer"
            }
        ],
        "prob": 0.999347984790802,
        "token": "num"
    },
    {
        "log_prob": -0.0024758896324783564,
        "predicted_tokens": [
            {
                "log_prob": 21.254501342773438,
                "prob": 1701032704,
                "token": "()"
            },
            {
                "log_prob": 15.185283660888672,
                "prob": 3934458,
                "token": "▁for"
            },
            {
                "log_prob": 11.525736808776855,
                "prob": 101289.375,
                "token": "("
            },
            {
                "log_prob": 11.52315902709961,
                "prob": 101028.609375,
                "token": "▁or"
            },
            {
                "log_prob": 9.593680381774902,
                "prob": 14671.7685546875,
                "token": "())"
            }
        ],
        "prob": 0.9975271821022034,
        "token": "()"
    },
    {
        "log_prob": -0.045085277408361435,
        "predicted_tokens": [
            {
                "log_prob": 22.26276206970215,
                "prob": 4662241280,
                "token": "▁for"
            },
            {
                "log_prob": 19.173490524291992,
                "prob": 212295664,
                "token": "▁or"
            },
            {
                "log_prob": 14.075166702270508,
                "prob": 1296484.25,
                "token": "▁if"
            },
            {
                "log_prob": 13.707869529724121,
                "prob": 897949.8125,
                "token": "for"
            },
            {
                "log_prob": 12.146217346191406,
                "prob": 188380.171875,
                "token": "▁"
            }
        ],
        "prob": 0.9559159874916077,
        "token": "for"
    },
    {
        "log_prob": -0.000007033323527139146,
        "predicted_tokens": [
            {
                "log_prob": 25.126554489135742,
                "prob": 81719173120,
                "token": "▁char"
            },
            {
                "log_prob": 11.907687187194824,
                "prob": 148403.046875,
                "token": "char"
            },
            {
                "log_prob": 11.563020706176758,
                "prob": 105137.1328125,
                "token": "▁i"
            },
            {
                "log_prob": 11.129579544067383,
                "prob": 68157.7109375,
                "token": "▁Char"
            },
            {
                "log_prob": 10.856853485107422,
                "prob": 51888.55859375,
                "token": "▁charity"
            }
        ],
        "prob": 0.9999930262565613,
        "token": "char"
    },
    {
        "log_prob": -0.000009536697689327411,
        "predicted_tokens": [
            {
                "log_prob": 23.97496795654297,
                "prob": 25834276864,
                "token": "▁in"
            },
            {
                "log_prob": 11.637560844421387,
                "prob": 113273.546875,
                "token": "<0x0A>"
            },
            {
                "log_prob": 10.841255187988281,
                "prob": 51085.4609375,
                "token": "_"
            },
            {
                "log_prob": 10.589210510253906,
                "prob": 39704.1328125,
                "token": "▁"
            },
            {
                "log_prob": 8.536500930786133,
                "prob": 5097.4765625,
                "token": "▁\\"
            }
        ],
        "prob": 0.9999904632568359,
        "token": "in"
    },
    {
        "log_prob": -0.0005013877525925636,
        "predicted_tokens": [
            {
                "log_prob": 22.611055374145508,
                "prob": 6604752896,
                "token": "▁input"
            },
            {
                "log_prob": 14.141413688659668,
                "prob": 1385281.25,
                "token": "▁original"
            },
            {
                "log_prob": 13.487549781799316,
                "prob": 720391.25,
                "token": "▁no"
            },
            {
                "log_prob": 13.144624710083008,
                "prob": 511255.46875,
                "token": "▁str"
            },
            {
                "log_prob": 12.29814624786377,
                "prob": 219289.109375,
                "token": "▁list"
            }
        ],
        "prob": 0.9994987845420837,
        "token": "input"
    },
    {
        "log_prob": -0.000007271740287251305,
        "predicted_tokens": [
            {
                "log_prob": 27.958911895751953,
                "prob": 1388037406720,
                "token": "_"
            },
            {
                "log_prob": 15.86113452911377,
                "prob": 7733982.5,
                "token": "\\_"
            },
            {
                "log_prob": 13.812812805175781,
                "prob": 997305.8125,
                "token": "<0x0A>"
            },
            {
                "log_prob": 13.767223358154297,
                "prob": 952860.125,
                "token": ")"
            },
            {
                "log_prob": 12.587209701538086,
                "prob": 292789.65625,
                "token": "_)"
            }
        ],
        "prob": 0.9999927878379822,
        "token": "_"
    },
    {
        "log_prob": -0.000013828182090946939,
        "predicted_tokens": [
            {
                "log_prob": 30.17620849609375,
                "prob": 12745616392192,
                "token": "str"
            },
            {
                "log_prob": 18.634601593017578,
                "prob": 123852464,
                "token": "▁str"
            },
            {
                "log_prob": 16.709239959716797,
                "prob": 18060538,
                "token": "Str"
            },
            {
                "log_prob": 16.402572631835938,
                "prob": 13290667,
                "token": "STR"
            },
            {
                "log_prob": 15.770255088806152,
                "prob": 7062115,
                "token": "string"
            }
        ],
        "prob": 0.9999861717224121,
        "token": "str"
    },
    {
        "log_prob": -0.0010131231974810362,
        "predicted_tokens": [
            {
                "log_prob": 22.805374145507812,
                "prob": 8021362688,
                "token": ")"
            },
            {
                "log_prob": 14.933004379272461,
                "prob": 3057183,
                "token": "."
            },
            {
                "log_prob": 14.379905700683594,
                "prob": 1758383.875,
                "token": "▁or"
            },
            {
                "log_prob": 14.017576217651367,
                "prob": 1223928.375,
                "token": "▁if"
            },
            {
                "log_prob": 14.010449409484863,
                "prob": 1215236.75,
                "token": ")\\"
            }
        ],
        "prob": 0.9989874362945557,
        "token": ")"
    },
    {
        "log_prob": -0.00944160483777523,
        "predicted_tokens": [
            {
                "log_prob": 20.52616310119629,
                "prob": 821106304,
                "token": "<0x0A>"
            },
            {
                "log_prob": 15.498650550842285,
                "prob": 5382430,
                "token": "▁or"
            },
            {
                "log_prob": 13.68139362335205,
                "prob": 874487.8125,
                "token": "▁if"
            },
            {
                "log_prob": 13.407219886779785,
                "prob": 664785.6875,
                "token": "▁#"
            },
            {
                "log_prob": 12.926172256469727,
                "prob": 410927.5625,
                "token": "▁and"
            }
        ],
        "prob": 0.9906028509140015,
        "token": "\n"
    },
    {
        "log_prob": -0.8953565359115601,
        "predicted_tokens": [
            {
                "log_prob": 15.949259757995605,
                "prob": 8446475,
                "token": "▁▁▁"
            },
            {
                "log_prob": 15.595653533935547,
                "prob": 5930704,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.518994331359863,
                "prob": 100608.7421875,
                "token": "▁▁▁▁"
            },
            {
                "log_prob": 10.121194839477539,
                "prob": 24864.462890625,
                "token": "``"
            },
            {
                "log_prob": 7.705812931060791,
                "prob": 2221.222412109375,
                "token": "▁▁"
            }
        ],
        "prob": 0.40846192836761475,
        "token": "\n"
    },
    {
        "log_prob": -0.0004919749335385859,
        "predicted_tokens": [
            {
                "log_prob": 21.357635498046875,
                "prob": 1885833216,
                "token": "▁▁▁"
            },
            {
                "log_prob": 12.760509490966797,
                "prob": 348192.0625,
                "token": "#"
            },
            {
                "log_prob": 11.444732666015625,
                "prob": 93408.0390625,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.249531745910645,
                "prob": 76843.921875,
                "token": "▁▁▁▁"
            },
            {
                "log_prob": 11.189401626586914,
                "prob": 72359.46875,
                "token": "<0x09>"
            }
        ],
        "prob": 0.9995082020759583,
        "token": "  "
    },
    {
        "log_prob": -1.4482238292694092,
        "predicted_tokens": [
            {
                "log_prob": 14.222734451293945,
                "prob": 1502640.625,
                "token": "▁result"
            },
            {
                "log_prob": 13.78492546081543,
                "prob": 969877.875,
                "token": "▁return"
            },
            {
                "log_prob": 13.067852020263672,
                "prob": 473473.90625,
                "token": "▁num"
            },
            {
                "log_prob": 12.627104759216309,
                "prob": 304706.65625,
                "token": "▁if"
            },
            {
                "log_prob": 12.349020957946777,
                "prob": 230734.03125,
                "token": "▁output"
            }
        ],
        "prob": 0.2349873036146164,
        "token": "return"
    },
    {
        "log_prob": -0.16830897331237793,
        "predicted_tokens": [
            {
                "log_prob": 17.988149642944336,
                "prob": 64886468,
                "token": "▁("
            },
            {
                "log_prob": 15.247053146362305,
                "prob": 4185150.5,
                "token": "▁original"
            },
            {
                "log_prob": 15.09738826751709,
                "prob": 3603399.75,
                "token": "▁str"
            },
            {
                "log_prob": 14.386117935180664,
                "prob": 1769341.375,
                "token": "▁{"
            },
            {
                "log_prob": 13.170528411865234,
                "prob": 524671.9375,
                "token": "("
            }
        ],
        "prob": 0.8450926542282104,
        "token": "("
    },
    {
        "log_prob": -0.9404361248016357,
        "predicted_tokens": [
            {
                "log_prob": 17.664403915405273,
                "prob": 46941084,
                "token": "<0x0A>"
            },
            {
                "log_prob": 17.65447425842285,
                "prob": 46477288,
                "token": "original"
            },
            {
                "log_prob": 16.509841918945312,
                "prob": 14795623,
                "token": "str"
            },
            {
                "log_prob": 15.330729484558105,
                "prob": 4550417,
                "token": "len"
            },
            {
                "log_prob": 15.11744213104248,
                "prob": 3676391.25,
                "token": "no"
            }
        ],
        "prob": 0.39045751094818115,
        "token": "original"
    },
    {
        "log_prob": -0.000030278701160568744,
        "predicted_tokens": [
            {
                "log_prob": 27.412641525268555,
                "prob": 803820273664,
                "token": "_"
            },
            {
                "log_prob": 16.988056182861328,
                "prob": 23868168,
                "token": "\\_"
            },
            {
                "log_prob": 12.656883239746094,
                "prob": 313916.78125,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.985279083251953,
                "prob": 160376.4375,
                "token": ","
            },
            {
                "log_prob": 10.3384428024292,
                "prob": 30897.87890625,
                "token": "_,"
            }
        ],
        "prob": 0.9999697208404541,
        "token": "_"
    },
    {
        "log_prob": -0.0000019073468138230965,
        "predicted_tokens": [
            {
                "log_prob": 34.4971923828125,
                "prob": 959268664639488,
                "token": "str"
            },
            {
                "log_prob": 20.398752212524414,
                "prob": 722878848,
                "token": "▁str"
            },
            {
                "log_prob": 19.65994644165039,
                "prob": 345307712,
                "token": "strap"
            },
            {
                "log_prob": 19.59783172607422,
                "prob": 324511552,
                "token": "string"
            },
            {
                "log_prob": 18.64043617248535,
                "prob": 124577200,
                "token": "STR"
            }
        ],
        "prob": 0.9999980330467224,
        "token": "str"
    },
    {
        "log_prob": -0.0005617947317659855,
        "predicted_tokens": [
            {
                "log_prob": 21.53724479675293,
                "prob": 2256870144,
                "token": ","
            },
            {
                "log_prob": 13.093270301818848,
                "prob": 485663.03125,
                "token": "."
            },
            {
                "log_prob": 12.695995330810547,
                "prob": 326438,
                "token": ",\\"
            },
            {
                "log_prob": 11.89293384552002,
                "prob": 146229.671875,
                "token": "[:"
            },
            {
                "log_prob": 11.86679458618164,
                "prob": 142456.875,
                "token": "["
            }
        ],
        "prob": 0.9994384050369263,
        "token": ","
    },
    {
        "log_prob": -0.0618247464299202,
        "predicted_tokens": [
            {
                "log_prob": 19.271333694458008,
                "prob": 234117504,
                "token": "▁str"
            },
            {
                "log_prob": 15.774989128112793,
                "prob": 7095626,
                "token": "▁no"
            },
            {
                "log_prob": 15.068546295166016,
                "prob": 3500954.75,
                "token": "▁len"
            },
            {
                "log_prob": 14.458661079406738,
                "prob": 1902465.25,
                "token": "<0x0A>"
            },
            {
                "log_prob": 13.621307373046875,
                "prob": 823490.5625,
                "token": "▁is"
            }
        ],
        "prob": 0.9400476217269897,
        "token": "str"
    },
    {
        "log_prob": -0.00019870213873218745,
        "predicted_tokens": [
            {
                "log_prob": 23.998798370361328,
                "prob": 26457311232,
                "token": "_"
            },
            {
                "log_prob": 15.417612075805664,
                "prob": 4963452,
                "token": "("
            },
            {
                "log_prob": 11.724896430969238,
                "prob": 123611.2109375,
                "token": "\\_"
            },
            {
                "log_prob": 11.069655418395996,
                "prob": 64193.38671875,
                "token": "."
            },
            {
                "log_prob": 9.284499168395996,
                "prob": 10769.7783203125,
                "token": "('"
            }
        ],
        "prob": 0.9998013377189636,
        "token": "_"
    },
    {
        "log_prob": -0.00003683499380713329,
        "predicted_tokens": [
            {
                "log_prob": 26.981136322021484,
                "prob": 522105913344,
                "token": "length"
            },
            {
                "log_prob": 16.605104446411133,
                "prob": 16274409,
                "token": "▁length"
            },
            {
                "log_prob": 14.09537410736084,
                "prob": 1322949.25,
                "token": "Length"
            },
            {
                "log_prob": 12.911349296569824,
                "prob": 404881.34375,
                "token": "LENGTH"
            },
            {
                "log_prob": 12.585077285766602,
                "prob": 292165.96875,
                "token": "len"
            }
        ],
        "prob": 0.9999631643295288,
        "token": "length"
    },
    {
        "log_prob": -0.00005864924969500862,
        "predicted_tokens": [
            {
                "log_prob": 22.928478240966797,
                "prob": 9072178176,
                "token": ","
            },
            {
                "log_prob": 12.022085189819336,
                "prob": 166389.25,
                "token": ",\\"
            },
            {
                "log_prob": 11.755707740783691,
                "prob": 127479.1015625,
                "token": "▁,"
            },
            {
                "log_prob": 11.095606803894043,
                "prob": 65881.09375,
                "token": "_"
            },
            {
                "log_prob": 10.376039505004883,
                "prob": 32081.650390625,
                "token": "<0x0A>"
            }
        ],
        "prob": 0.999941349029541,
        "token": ","
    },
    {
        "log_prob": -2.7157962322235107,
        "predicted_tokens": [
            {
                "log_prob": 17.836475372314453,
                "prob": 55754876,
                "token": "▁len"
            },
            {
                "log_prob": 16.233436584472656,
                "prob": 11222560,
                "token": "▁str"
            },
            {
                "log_prob": 15.424398422241211,
                "prob": 4997250.5,
                "token": "▁no"
            },
            {
                "log_prob": 14.319902420043945,
                "prob": 1655978.125,
                "token": "▁is"
            },
            {
                "log_prob": 13.431092262268066,
                "prob": 680846.5625,
                "token": "<0x0A>"
            }
        ],
        "prob": 0.06615225970745087,
        "token": "no"
    },
    {
        "log_prob": -5.960462772236497e-7,
        "predicted_tokens": [
            {
                "log_prob": 26.711271286010742,
                "prob": 398618755072,
                "token": "_"
            },
            {
                "log_prob": 12.352638244628906,
                "prob": 231570.171875,
                "token": "\\_"
            },
            {
                "log_prob": 9.741076469421387,
                "prob": 17001.833984375,
                "token": "v"
            },
            {
                "log_prob": 9.50838565826416,
                "prob": 13472.228515625,
                "token": "__"
            },
            {
                "log_prob": 9.270320892333984,
                "prob": 10618.158203125,
                "token": "▁v"
            }
        ],
        "prob": 0.9999993443489075,
        "token": "_"
    },
    {
        "log_prob": -0.003789744805544615,
        "predicted_tokens": [
            {
                "log_prob": 25.30680274963379,
                "prob": 97859911680,
                "token": "v"
            },
            {
                "log_prob": 19.393321990966797,
                "prob": 264492096,
                "token": "con"
            },
            {
                "log_prob": 18.372150421142578,
                "prob": 95262848,
                "token": "dig"
            },
            {
                "log_prob": 15.914693832397461,
                "prob": 8159503,
                "token": "cons"
            },
            {
                "log_prob": 14.132644653320312,
                "prob": 1373186.625,
                "token": "special"
            }
        ],
        "prob": 0.9962173700332642,
        "token": "v"
    },
    {
        "log_prob": -1.1920928244535389e-7,
        "predicted_tokens": [
            {
                "log_prob": 28.72669792175293,
                "prob": 2991206432768,
                "token": "ow"
            },
            {
                "log_prob": 12.225381851196289,
                "prob": 203899.375,
                "token": "ows"
            },
            {
                "log_prob": 11.399054527282715,
                "prob": 89237.3125,
                "token": "owe"
            },
            {
                "log_prob": 11.386881828308105,
                "prob": 88157.640625,
                "token": "owed"
            },
            {
                "log_prob": 11.22110366821289,
                "prob": 74690.1640625,
                "token": "ocal"
            }
        ],
        "prob": 0.9999998807907104,
        "token": "ow"
    },
    {
        "log_prob": -0.0000015497195136049413,
        "predicted_tokens": [
            {
                "log_prob": 30.122093200683594,
                "prob": 12074213179392,
                "token": "els"
            },
            {
                "log_prob": 15.523649215698242,
                "prob": 5518679.5,
                "token": "el"
            },
            {
                "log_prob": 15.137784004211426,
                "prob": 3751941.5,
                "token": "ells"
            },
            {
                "log_prob": 15.042661666870117,
                "prob": 3411496.75,
                "token": "ls"
            },
            {
                "log_prob": 14.844632148742676,
                "prob": 2798606.5,
                "token": "▁els"
            }
        ],
        "prob": 0.9999984502792358,
        "token": "els"
    },
    {
        "log_prob": -0.0010278901318088174,
        "predicted_tokens": [
            {
                "log_prob": 22.519775390625,
                "prob": 6028568576,
                "token": ","
            },
            {
                "log_prob": 15.439050674438477,
                "prob": 5071010.5,
                "token": "."
            },
            {
                "log_prob": 13.65664291381836,
                "prob": 853109.3125,
                "token": "▁if"
            },
            {
                "log_prob": 11.052765846252441,
                "prob": 63118.29296875,
                "token": "▁,"
            },
            {
                "log_prob": 10.964902877807617,
                "prob": 57809.1796875,
                "token": "▁or"
            }
        ],
        "prob": 0.9989726543426514,
        "token": ","
    },
    {
        "log_prob": -0.011148188263177872,
        "predicted_tokens": [
            {
                "log_prob": 21.291656494140625,
                "prob": 1765423616,
                "token": "▁no"
            },
            {
                "log_prob": 16.27814483642578,
                "prob": 11735686,
                "token": "▁len"
            },
            {
                "log_prob": 15.67404842376709,
                "prob": 6414351.5,
                "token": "▁str"
            },
            {
                "log_prob": 13.510103225708008,
                "prob": 736823.1875,
                "token": "▁is"
            },
            {
                "log_prob": 12.8033447265625,
                "prob": 363431,
                "token": "<0x0A>"
            }
        ],
        "prob": 0.9889137148857117,
        "token": "no"
    },
    {
        "log_prob": -0.000002622600959512056,
        "predicted_tokens": [
            {
                "log_prob": 26.256221771240234,
                "prob": 252890333184,
                "token": "_"
            },
            {
                "log_prob": 13.126378059387207,
                "prob": 502011.375,
                "token": "<0x0A>"
            },
            {
                "log_prob": 10.772008895874023,
                "prob": 47667.68359375,
                "token": "\\_"
            },
            {
                "log_prob": 10.332880973815918,
                "prob": 30726.505859375,
                "token": "con"
            },
            {
                "log_prob": 9.637850761413574,
                "prob": 15334.3515625,
                "token": "▁cons"
            }
        ],
        "prob": 0.9999973773956299,
        "token": "_"
    },
    {
        "log_prob": -0.0006170752458274364,
        "predicted_tokens": [
            {
                "log_prob": 27.046619415283203,
                "prob": 557439254528,
                "token": "con"
            },
            {
                "log_prob": 19.46071434020996,
                "prob": 282931200,
                "token": "cons"
            },
            {
                "log_prob": 17.82661247253418,
                "prob": 55207676,
                "token": "dig"
            },
            {
                "log_prob": 14.674673080444336,
                "prob": 2361182.5,
                "token": "▁cons"
            },
            {
                "log_prob": 13.266541481018066,
                "prob": 577544.9375,
                "token": "consum"
            }
        ],
        "prob": 0.9993831515312195,
        "token": "con"
    },
    {
        "log_prob": -0.00002753696753643453,
        "predicted_tokens": [
            {
                "log_prob": 26.329532623291016,
                "prob": 272126443520,
                "token": "son"
            },
            {
                "log_prob": 14.991868019104004,
                "prob": 3242541.5,
                "token": "SON"
            },
            {
                "log_prob": 14.83078670501709,
                "prob": 2760125.5,
                "token": "▁son"
            },
            {
                "log_prob": 12.556130409240723,
                "prob": 283829.90625,
                "token": "▁sons"
            },
            {
                "log_prob": 12.402188301086426,
                "prob": 243333.515625,
                "token": "сон"
            }
        ],
        "prob": 0.9999724626541138,
        "token": "son"
    },
    {
        "log_prob": -0.000006318072337307967,
        "predicted_tokens": [
            {
                "log_prob": 27.729049682617188,
                "prob": 1102994341888,
                "token": "ants"
            },
            {
                "log_prob": 14.968948364257812,
                "prob": 3169069,
                "token": "ents"
            },
            {
                "log_prob": 14.365419387817383,
                "prob": 1733095.125,
                "token": "ats"
            },
            {
                "log_prob": 13.977663040161133,
                "prob": 1176039.5,
                "token": "ant"
            },
            {
                "log_prob": 12.039681434631348,
                "prob": 169342.984375,
                "token": "ands"
            }
        ],
        "prob": 0.9999936819076538,
        "token": "ants"
    },
    {
        "log_prob": -0.0014300844632089138,
        "predicted_tokens": [
            {
                "log_prob": 23.956157684326172,
                "prob": 25352867840,
                "token": ","
            },
            {
                "log_prob": 17.313739776611328,
                "prob": 33056864,
                "token": ",\\"
            },
            {
                "log_prob": 14.622650146484375,
                "prob": 2241487.25,
                "token": "."
            },
            {
                "log_prob": 13.349309921264648,
                "prob": 627381.375,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.789093017578125,
                "prob": 131806.875,
                "token": "▁,"
            }
        ],
        "prob": 0.99857097864151,
        "token": ","
    },
    {
        "log_prob": -0.013260036706924438,
        "predicted_tokens": [
            {
                "log_prob": 21.076868057250977,
                "prob": 1424188544,
                "token": "▁no"
            },
            {
                "log_prob": 16.171247482299805,
                "prob": 10545898,
                "token": "<0x0A>"
            },
            {
                "log_prob": 15.35299301147461,
                "prob": 4652861.5,
                "token": "▁is"
            },
            {
                "log_prob": 14.469573020935059,
                "prob": 1923338.5,
                "token": "▁\\"
            },
            {
                "log_prob": 13.731395721435547,
                "prob": 919325.6875,
                "token": "▁len"
            }
        ],
        "prob": 0.9868274927139282,
        "token": "no"
    },
    {
        "log_prob": -0.0000010728830375228426,
        "predicted_tokens": [
            {
                "log_prob": 27.56820297241211,
                "prob": 939114233856,
                "token": "_"
            },
            {
                "log_prob": 13.647924423217773,
                "prob": 845703.8125,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.258162498474121,
                "prob": 77510.015625,
                "token": "\\_"
            },
            {
                "log_prob": 10.395464897155762,
                "prob": 32710.94140625,
                "token": "▁dig"
            },
            {
                "log_prob": 9.579876899719238,
                "prob": 14470.6376953125,
                "token": "-"
            }
        ],
        "prob": 0.999998927116394,
        "token": "_"
    },
    {
        "log_prob": -0.00035744477645494044,
        "predicted_tokens": [
            {
                "log_prob": 26.63558578491211,
                "prob": 369562517504,
                "token": "dig"
            },
            {
                "log_prob": 18.45751953125,
                "prob": 103752576,
                "token": "special"
            },
            {
                "log_prob": 16.995481491088867,
                "prob": 24046054,
                "token": "▁dig"
            },
            {
                "log_prob": 14.211472511291504,
                "prob": 1485812.875,
                "token": "spec"
            },
            {
                "log_prob": 12.824697494506836,
                "prob": 371274.6875,
                "token": "Dig"
            }
        ],
        "prob": 0.9996426701545715,
        "token": "dig"
    },
    {
        "log_prob": -0.000005364403477869928,
        "predicted_tokens": [
            {
                "log_prob": 27.545141220092773,
                "prob": 917704474624,
                "token": "its"
            },
            {
                "log_prob": 14.238372802734375,
                "prob": 1526324,
                "token": "ITS"
            },
            {
                "log_prob": 13.575810432434082,
                "prob": 786863.75,
                "token": "<0x0A>"
            },
            {
                "log_prob": 13.470499038696289,
                "prob": 708212.25,
                "token": "it"
            },
            {
                "log_prob": 12.935836791992188,
                "prob": 414918.28125,
                "token": "itis"
            }
        ],
        "prob": 0.9999946355819702,
        "token": "its"
    },
    {
        "log_prob": -0.011572729796171188,
        "predicted_tokens": [
            {
                "log_prob": 22.868080139160156,
                "prob": 8540454912,
                "token": ","
            },
            {
                "log_prob": 18.40306282043457,
                "prob": 98253640,
                "token": ",\\"
            },
            {
                "log_prob": 13.284274101257324,
                "prob": 587877.625,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.381845474243164,
                "prob": 238433.4375,
                "token": "."
            },
            {
                "log_prob": 11.253352165222168,
                "prob": 77138.0703125,
                "token": "▁\\"
            }
        ],
        "prob": 0.9884939789772034,
        "token": ","
    },
    {
        "log_prob": -0.03363689407706261,
        "predicted_tokens": [
            {
                "log_prob": 20.02878189086914,
                "prob": 499332064,
                "token": "▁no"
            },
            {
                "log_prob": 15.899290084838867,
                "prob": 8034779,
                "token": "<0x0A>"
            },
            {
                "log_prob": 15.681184768676758,
                "prob": 6460290.5,
                "token": "▁is"
            },
            {
                "log_prob": 13.772563934326172,
                "prob": 957962.5,
                "token": "▁str"
            },
            {
                "log_prob": 13.741750717163086,
                "prob": 928894.75,
                "token": "▁\\"
            }
        ],
        "prob": 0.9669225215911865,
        "token": "no"
    },
    {
        "log_prob": -0.000005125986263010418,
        "predicted_tokens": [
            {
                "log_prob": 26.54935073852539,
                "prob": 339028738048,
                "token": "_"
            },
            {
                "log_prob": 14.076651573181152,
                "prob": 1298410.75,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.734880447387695,
                "prob": 339381.625,
                "token": "\\_"
            },
            {
                "log_prob": 10.877708435058594,
                "prob": 52982.046875,
                "token": "▁special"
            },
            {
                "log_prob": 9.935491561889648,
                "prob": 20650.43359375,
                "token": "-"
            }
        ],
        "prob": 0.9999949336051941,
        "token": "_"
    },
    {
        "log_prob": -0.00007807903602952138,
        "predicted_tokens": [
            {
                "log_prob": 26.77089500427246,
                "prob": 423108739072,
                "token": "special"
            },
            {
                "log_prob": 16.973073959350586,
                "prob": 23513234,
                "token": "▁special"
            },
            {
                "log_prob": 15.127360343933105,
                "prob": 3713035.75,
                "token": "spec"
            },
            {
                "log_prob": 14.268781661987305,
                "prob": 1573450.625,
                "token": "Special"
            },
            {
                "log_prob": 13.576217651367188,
                "prob": 787184.3125,
                "token": "▁especial"
            }
        ],
        "prob": 0.999921977519989,
        "token": "special"
    },
    {
        "log_prob": -0.00003707340147229843,
        "predicted_tokens": [
            {
                "log_prob": 26.149450302124023,
                "prob": 227280404480,
                "token": "_"
            },
            {
                "log_prob": 15.876425743103027,
                "prob": 7853154,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.846753120422363,
                "prob": 379554.375,
                "token": "\\_"
            },
            {
                "log_prob": 11.910802841186523,
                "prob": 148866.140625,
                "token": ","
            },
            {
                "log_prob": 10.898269653320312,
                "prob": 54082.69921875,
                "token": "chars"
            }
        ],
        "prob": 0.9999629259109497,
        "token": "_"
    },
    {
        "log_prob": -0.00002682172998902388,
        "predicted_tokens": [
            {
                "log_prob": 24.289077758789062,
                "prob": 35368157184,
                "token": "chars"
            },
            {
                "log_prob": 12.84924030303955,
                "prob": 380499.5625,
                "token": "ch"
            },
            {
                "log_prob": 12.134538650512695,
                "prob": 186192.9375,
                "token": "char"
            },
            {
                "log_prob": 11.2616605758667,
                "prob": 77781.6328125,
                "token": "CHAR"
            },
            {
                "log_prob": 10.596468925476074,
                "prob": 39993.3671875,
                "token": "charg"
            }
        ],
        "prob": 0.9999731779098511,
        "token": "chars"
    },
    {
        "log_prob": -0.0005812147865071893,
        "predicted_tokens": [
            {
                "log_prob": 22.644472122192383,
                "prob": 6829191680,
                "token": ","
            },
            {
                "log_prob": 14.974164009094238,
                "prob": 3185640.75,
                "token": "."
            },
            {
                "log_prob": 12.512892723083496,
                "prob": 271819.28125,
                "token": ",\\"
            },
            {
                "log_prob": 12.156011581420898,
                "prob": 190234.28125,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.15556526184082,
                "prob": 190149.375,
                "token": "▁,"
            }
        ],
        "prob": 0.9994189739227295,
        "token": ","
    },
    {
        "log_prob": -0.007087683770805597,
        "predicted_tokens": [
            {
                "log_prob": 19.84649085998535,
                "prob": 416122752,
                "token": "▁is"
            },
            {
                "log_prob": 14.077621459960938,
                "prob": 1299670.75,
                "token": "▁bool"
            },
            {
                "log_prob": 13.180047035217285,
                "prob": 529689.875,
                "token": "<0x0A>"
            },
            {
                "log_prob": 12.444768905639648,
                "prob": 253918.5625,
                "token": "▁int"
            },
            {
                "log_prob": 12.398996353149414,
                "prob": 242558.0625,
                "token": "▁str"
            }
        ],
        "prob": 0.9929373264312744,
        "token": "is"
    },
    {
        "log_prob": -4.768370445162873e-7,
        "predicted_tokens": [
            {
                "log_prob": 28.749481201171875,
                "prob": 3060138246144,
                "token": "_"
            },
            {
                "log_prob": 14.172321319580078,
                "prob": 1428765.375,
                "token": "\\_"
            },
            {
                "log_prob": 12.240304946899414,
                "prob": 206965,
                "token": "alph"
            },
            {
                "log_prob": 11.5891752243042,
                "prob": 107923.2109375,
                "token": "<0x0A>"
            },
            {
                "log_prob": 11.222431182861328,
                "prob": 74789.3828125,
                "token": "_*"
            }
        ],
        "prob": 0.9999995231628418,
        "token": "_"
    },
    {
        "log_prob": -0.00012170527770649642,
        "predicted_tokens": [
            {
                "log_prob": 26.292837142944336,
                "prob": 262321602560,
                "token": "alph"
            },
            {
                "log_prob": 16.716079711914062,
                "prob": 18184492,
                "token": "alf"
            },
            {
                "log_prob": 15.54459285736084,
                "prob": 5635480,
                "token": "al"
            },
            {
                "log_prob": 13.655505180358887,
                "prob": 852139.25,
                "token": "alg"
            },
            {
                "log_prob": 13.4832763671875,
                "prob": 717319.375,
                "token": "alter"
            }
        ],
        "prob": 0.9998783469200134,
        "token": "alph"
    },
    {
        "log_prob": -8.344646857949556e-7,
        "predicted_tokens": [
            {
                "log_prob": 27.824174880981445,
                "prob": 1213069393920,
                "token": "an"
            },
            {
                "log_prob": 13.185081481933594,
                "prob": 532363.3125,
                "token": "ab"
            },
            {
                "log_prob": 11.772449493408203,
                "prob": 129631.2890625,
                "token": "ann"
            },
            {
                "log_prob": 11.245087623596191,
                "prob": 76503.1875,
                "token": "AN"
            },
            {
                "log_prob": 11.159000396728516,
                "prob": 70192.75,
                "token": "numeric"
            }
        ],
        "prob": 0.9999991059303284,
        "token": "an"
    },
    {
        "log_prob": -0.000014185804502631072,
        "predicted_tokens": [
            {
                "log_prob": 33.19600296020508,
                "prob": 261120472383488,
                "token": "umeric"
            },
            {
                "log_prob": 21.71150016784668,
                "prob": 2686487040,
                "token": "umer"
            },
            {
                "log_prob": 20.2017879486084,
                "prob": 593642560,
                "token": "numeric"
            },
            {
                "log_prob": 19.306671142578125,
                "prob": 242538528,
                "token": "um"
            },
            {
                "log_prob": 17.585351943969727,
                "prob": 43373184,
                "token": "emic"
            }
        ],
        "prob": 0.9999858140945435,
        "token": "umeric"
    },
    {
        "log_prob": -0.008718166500329971,
        "predicted_tokens": [
            {
                "log_prob": 21.081989288330078,
                "prob": 1431500800,
                "token": ")"
            },
            {
                "log_prob": 16.19523811340332,
                "prob": 10801959,
                "token": ")\\"
            },
            {
                "log_prob": 13.756564140319824,
                "prob": 942757.3125,
                "token": ","
            },
            {
                "log_prob": 12.62088394165039,
                "prob": 302817,
                "token": ")\r"
            },
            {
                "log_prob": 11.839201927185059,
                "prob": 138579.84375,
                "token": ")**"
            }
        ],
        "prob": 0.9913197159767151,
        "token": ")"
    },
    {
        "log_prob": -1.6381380558013916,
        "predicted_tokens": [
            {
                "log_prob": 18.87563705444336,
                "prob": 157610448,
                "token": "<0x0A>"
            },
            {
                "log_prob": 17.455821990966797,
                "prob": 38103704,
                "token": "``"
            },
            {
                "log_prob": 11.999305725097656,
                "prob": 162641.828125,
                "token": "▁```"
            },
            {
                "log_prob": 10.588231086730957,
                "prob": 39665.26171875,
                "token": "▁"
            },
            {
                "log_prob": 10.482373237609863,
                "prob": 35680.98828125,
                "token": "▁#"
            }
        ],
        "prob": 0.19434155523777008,
        "token": "``"
    },
    {
        "log_prob": -0.0005508335889317095,
        "predicted_tokens": [
            {
                "log_prob": 27.59783363342285,
                "prob": 967357169664,
                "token": "`"
            },
            {
                "log_prob": 20.074403762817383,
                "prob": 522640128,
                "token": "``"
            },
            {
                "log_prob": 15.863245010375977,
                "prob": 7750322.5,
                "token": "<0x0A>"
            },
            {
                "log_prob": 14.250551223754883,
                "prob": 1545026,
                "token": "`)"
            },
            {
                "log_prob": 13.443523406982422,
                "prob": 689363.125,
                "token": "`."
            }
        ],
        "prob": 0.9994493126869202,
        "token": "`"
    }
]


export default Dashboard;
