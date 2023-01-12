import ROSLIB from 'roslib';
import { useDispatch } from 'react-redux';
import { updateTopView, updateTopViewCropped, updateSpeechPublisher, updateRosBridge } from './RobotSlice';

// exports so we can access this elsewhere
// can't use redux store b/c they won't be serializable
export let speechPublisher = undefined;
export let posePublisher = undefined;
export let enablePublisher = undefined;
export let rosBridge = undefined;
export let topViewListener = undefined;
export let topViewCroppedListener = undefined;

export function setupRosBridge(url,dispatch) {
    console.log("Setting up RosBridge");
    rosBridge = new ROSLIB.Ros({
        url: url
    });
    // dispatch(updateRosBridge(ros));
    rosBridge.on('connection', function() {
        console.log('Connected to websocket server.');
    });
    rosBridge.on('error', function() {
        console.log('Error connecting to websocket server: ',error);
    });
    rosBridge.on('close', function() {
        console.log('Connection to websocket server closed.');
    });

    topViewListener = new ROSLIB.Topic({
        ros: rosBridge,
        name: '/hiro_dynamixel/encoded_top_view',
        messageType: 'sensor_msgs/CompressedImage'
    });

    topViewListener.subscribe(function(message) {
        dispatch(updateTopView(message.data))
    });

    topViewCroppedListener = new ROSLIB.Topic({
        ros: rosBridge,
        name: '/hiro_dynamixel/encoded_top_view_cropped',
        messageType: 'std_msgs/String'
    });

    topViewCroppedListener.subscribe(function(message) {
        dispatch(updateTopViewCropped(message.data))
    });

    speechPublisher = new ROSLIB.Topic({
        ros: rosBridge,
        name: '/hiro_dynamixel/speech',
        messageType: 'std_msgs/String'
    });
    // dispatch(updateSpeechPublisher(speechPublisher));

    posePublisher = new ROSLIB.Topic({
        ros: rosBridge,
        name: '/hiro_dynamixel/cartesian_target',
        messageType: 'std_msgs/String'
    });

    enablePublisher = new ROSLIB.Topic({
        ros: rosBridge,
        name: '/hiro_dynamixel/hiro_joint_enable',
        messageType: 'std_msgs/String'
    })
}

