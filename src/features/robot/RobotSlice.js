import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const robotSlice = createSlice({
    name:  'robot',
    initialState: {
        'topViewb64': '',
        'topViewCroppedb64': '',
        'frontViewb64': '',
        'ros': undefined,
        'speechPublisher': undefined,
        'motorConfig': {
            'base': {
                'speed': 0,
                'punch': 0,
                'enabled': true
            },
            'shoulder': {
                'speed': 0,
                'punch': 0,
                'enabled': true
            },
            'elbow': {
                'speed': 0,
                'punch': 0,
                'enabled': true
            }
        },
        'dummy': 5
    },
    reducers: {
        setTopViewb64: (state, action) => {
            state.topViewb64 = action.payload
        },
        setTopViewCroppedb64: (state, action) => {
            state.topViewCroppedb64 = action.payload
        },
        setFrontViewb64: (state, action) => {
            state.frontViewb64 = action.payload
        },
        setRosBridge: (state, action) => {
            state.rosBridge = action.payload
        },
        setSpeechPublisher: (state, action) => {
            state.speechPublisher = action.payload
        },
        setBaseSpeed: (state, action) => {
            state.motorConfig.base.speed = action.payload
        },
        setPower: (state, action) => {
            state.motorConfig.base.enabled = action.payload;
            state.motorConfig.shoulder.enabled = action.payload;
            state.motorConfig.elbow.enabled = action.payload;
        },
        setDummy: (state, action) => action.payload
    }
  });

export default robotSlice;

export const selectTopViewb64 = (state) => state.robot.topViewb64;
export const selectTopViewCroppedb64 = (state) => state.robot.topViewCroppedb64;
export const selectFrontViewb64 = (state) => state.robot.frontViewb64;
export const selectRosBridge = (state) => state.robot.rosBridge;
export const selectSpeechPublisher = (state) => state.robot.speechPublisher;
export const selectBaseSpeed = (state) => state.robot.motorConfig.base.speed;
export const selectBasePunch = (state) => state.robot.motorConfig.base.punch;
//return true if any motor is enabled
export const selectEnable = (state) => state.robot.motorConfig.base.enabled;


const { setTopViewb64, setTopViewCroppedb64, setFrontViewb64, setRosBridge, setSpeechPublisher, setDummy, setPower } = robotSlice.actions;


export function updateMotorEnable(enable) {
    return dispatch => {
        dispatch(setPower(enable));
    }
}

export function updateRosBridge(rosBridge) {
    console.log("setting the rosbridge")
    console.log(setRosBridge(rosBridge));
    return dispatch => {
      dispatch(setRosBridge(rosBridge));
    }
}

export function updateMotorConfig(){
    
}


export function updateSpeechPublisher(publisher) {
    console.log("setting up the speech publisher")
    return dispatch => {
      dispatch(setSpeechPublisher(publisher));
    }
}


export function updateTopView(b64img) {
    console.log("Top View", b64img);
    return dispatch => {
      dispatch(setTopViewb64(btoa(String.fromCharCode(...b64img))));
    }
}

export function updateTopViewCropped(b64img) {
    return dispatch => {
      dispatch(setTopViewCroppedb64(b64img));
    }
}