
import { useSelector, useDispatch } from 'react-redux';
import { selectTopViewb64 } from '../robot/RobotSlice';


function AnalysisView(props) {
    const topView = useSelector(selectTopViewb64)
    return <img src={`data:image/jpeg;base64,${topView}`} />
}

export default AnalysisView;