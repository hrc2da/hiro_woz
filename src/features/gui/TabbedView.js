import * as React from 'react';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import {Tab, Tabs, Typography} from '@mui/material';
import PropTypes from 'prop-types';
import {selectActiveTab, updateActiveTab} from './GuiSlice';
import ControlView from './ControlView';
import AnalysisView from './AnalysisView';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export default function TabbedView(props) {
    const tabSelector = useSelector(selectActiveTab);
    const titles = ['HIRO Control Panel', 'Garden Analysis', 'Help']
    const dispatch = useDispatch()
    const handleChange = (event, newValue) => dispatch(updateActiveTab(newValue));
    return (
    <div>
        <Box sx={{ width: '100%'}}>
        <Typography variant="h4" component="h1" gutterBottom>
          {titles[tabSelector]}
        </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabSelector} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Control" {...a11yProps(0)} />
                    <Tab label="Analysis" {...a11yProps(1)} />
                    <Tab label="Help" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={tabSelector} index={0}>
                <ControlView />
            </TabPanel>
            <TabPanel value={tabSelector} index={1}>
                <AnalysisView />
            </TabPanel>
            <TabPanel value={tabSelector} index={2}>
                Help
            </TabPanel>
    </Box>
  </div>
  );

}

