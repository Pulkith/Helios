import React from 'react';
import '../css/dashboard.scss'
import '../css/global.scss'

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import { useState } from 'react';
import { Navigate } from 'react-router';

import { Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import {TextWithDividers, TextWithDividersEqual, PersonPicker} from './UtilComponents.js'
import {useEffect} from 'react';

import * as Papa from 'papaparse';
import { ViewCarousel } from '@mui/icons-material';

// import * as tf from '@tensorflow/tfjs';
// import * as use from '@tensorflow-models/universal-sentence-encoder';

import axios from 'axios';

var people = []


const Compare = () => {

    


    return (
        <div>Hi</div>
    )
}


export default Compare
