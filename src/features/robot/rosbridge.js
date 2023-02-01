import ROSLIB from 'roslib';
import { updateTopView, updateRosBridgeStatus, updateVidBridgeStatus } from './RobotSlice';
// exports so we can access this elsewhere
// can't use redux store b/c they won't be serializable
export let speechPublisher = undefined;
export let posePublisher = undefined;
export let gesturePublisher = undefined;
export let enablePublisher = undefined;
export let saveProject = undefined;
export let loadProject = undefined;
export let listProjects = undefined;
export let rosBridge = undefined;
export let vidBridge = undefined;
export let topViewListener = undefined;
export let topViewCroppedListener = undefined;

export function closeRosBridges(){
    if(rosBridge != undefined){
        rosBridge.close();
        rosBridge = undefined;
    }
    if(vidBridge != undefined){
        vidBridge.close();
        vidBridge = undefined;
    }
}

export function closeRosBridge(){
    if(rosBridge != undefined){
        rosBridge.close();
        rosBridge = undefined;
    }
}

export function closeVidBridge(){
    if(vidBridge != undefined){
        vidBridge.close();
        vidBridge = undefined;
    }
}

export function setupVidBridge(url, dispatch, port="8080") {
    closeVidBridge(); //just in case there's one hanging around!
    vidBridge = new ROSLIB.Ros({
        url: `${url}:${port}`
    });

    vidBridge.on('connection', function() {
        console.log('Connected to video websocket server.');
        dispatch(updateVidBridgeStatus(true,null));
        
    });
    vidBridge.on('error', function(error) {
        console.log('Error connecting to video websocket server: ',error);
        dispatch(updateVidBridgeStatus(false,error));
    });
    vidBridge.on('close', function() {
        console.log('Connection to video websocket server closed.');
        dispatch(updateVidBridgeStatus(false,null));
    });

    topViewListener = new ROSLIB.Topic({
        ros: vidBridge,
        name: '/hiro_dynamixel/encoded_top_view',
        messageType: 'sensor_msgs/CompressedImage'
    });

    topViewListener.subscribe(function(message) {
        dispatch(updateTopView(message.data))
    });

}

export function setupRosBridge(url, dispatch, port="9090") {
    rosBridge = new ROSLIB.Ros({
        url: `${url}:${port}`
    });

    rosBridge.on('connection', function() {
        console.log('Connected to robot websocket server.');
        dispatch(updateRosBridgeStatus(true,null));
    });
    rosBridge.on('error', function(error) {
        console.log('Error connecting to robot websocket server: ',error);
        dispatch(updateRosBridgeStatus(false,error));
    });
    rosBridge.on('close', function() {
        console.log('Connection to robot websocket server closed.');
        dispatch(updateRosBridgeStatus(false,null));
    });

    speechPublisher = new ROSLIB.Topic({
        ros: rosBridge,
        name: '/hiro_dynamixel/speech',
        messageType: 'std_msgs/String'
    });
    // dispatch(updateSpeechPublisher(speechPublisher));

    posePublisher = new ROSLIB.Topic({
        ros: rosBridge,
        name: '/hiro_dynamixel/jsontarget',
        messageType: 'std_msgs/String'
    });

    gesturePublisher = new ROSLIB.Topic({
        ros: rosBridge,
        name: '/hiro_dynamixel/play_gesture',
        messageType: 'std_msgs/String'
    });

    enablePublisher = new ROSLIB.Topic({
        ros: rosBridge,
        name: '/hiro_dynamixel/hiro_joint_enable',
        messageType: 'std_msgs/String'
    });

    saveProject = new ROSLIB.Topic({
        ros: rosBridge,
        name: '/hiro_dynamixel/save_project',
        messageTYpe: 'std_msgs/String'
    });

    loadProject = new ROSLIB.Service({
        ros: rosBridge,
        name: '/hiro_dynamixel/load_project',
        serviceType: 'hiro_msgs/LoadProject'
    });

    listProjects = new ROSLIB.Service({
        ros: rosBridge,
        name: '/hiro_dynamixel/list_projects',
        serviceType: 'hiro_msgs/ListProjects'
    })
}


export function setupRosBridges(url,dispatch,rosPort="9090", vidPort="8080") {
    console.log("Setting up RosBridge");
    rosBridge = new ROSLIB.Ros({
        url: `${url}:${rosPort}`
    });
    
    vidBridge = new ROSLIB.Ros({
        url: `${url}:${vidPort}`
    });
    
    // dispatch(updateRosBridge(ros));
    rosBridge.on('connection', function() {
        console.log('Connected to websocket server.');
    });
    rosBridge.on('error', function(error) {
        console.log('Error connecting to websocket server: ',error);
    });
    rosBridge.on('close', function() {
        console.log('Connection to websocket server closed.');
    });
    topViewListener = new ROSLIB.Topic({
        ros: vidBridge,
        name: '/hiro_dynamixel/encoded_top_view',
        messageType: 'sensor_msgs/CompressedImage'
    });

    topViewListener.subscribe(function(message) {
        dispatch(updateTopView(message.data))
    });

    // topViewCroppedListener = new ROSLIB.Topic({
    //     ros: vidBridge,
    //     name: '/hiro_dynamixel/encoded_top_view_cropped',
    //     messageType: 'std_msgs/String'
    // });

    // topViewCroppedListener.subscribe(function(message) {
    //     dispatch(updateTopViewCropped(message.data))
    // });

    speechPublisher = new ROSLIB.Topic({
        ros: rosBridge,
        name: '/hiro_dynamixel/speech',
        messageType: 'std_msgs/String'
    });
    // dispatch(updateSpeechPublisher(speechPublisher));

    posePublisher = new ROSLIB.Topic({
        ros: rosBridge,
        name: '/hiro_dynamixel/jsontarget',
        messageType: 'std_msgs/String'
    });

    gesturePublisher = new ROSLIB.Topic({
        ros: rosBridge,
        name: '/hiro_dynamixel/play_gesture',
        messageType: 'std_msgs/String'
    });

    enablePublisher = new ROSLIB.Topic({
        ros: rosBridge,
        name: '/hiro_dynamixel/hiro_joint_enable',
        messageType: 'std_msgs/String'
    });

    saveProject = new ROSLIB.Topic({
        ros: rosBridge,
        name: '/hiro_dynamixel/save_project',
        messageTYpe: 'std_msgs/String'
    });

    loadProject = new ROSLIB.Service({
        ros: rosBridge,
        name: '/hiro_dynamixel/load_project',
        serviceType: 'hiro_msgs/LoadProject'
    });

    listProjects = new ROSLIB.Service({
        ros: rosBridge,
        name: '/hiro_dynamixel/list_projects',
        serviceType: 'hiro_msgs/ListProjects'
    })


}

export function getServiceRequest(){
    return new ROSLIB.ServiceRequest({});
}

// export function refreshProjectList() {
//     const dispatch = useDispatch()
//     let request = new ROSLIB.ServiceRequest({});
//     listProjects.callService(request, (result) => {
//         return dispatch(updateProjectList(result.projects));
//     });

// }