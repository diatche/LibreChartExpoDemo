import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Menu from './Menu';
import BarChart from './Demos/BarChart';
import LineChart from './Demos/LineChart';
import DateChart from './Demos/DateChart';
import { MainStackList } from './types';
import AutoScaleLineChart from './Demos/AutoScaleLineChart';
import SubplotChart from './Demos/SubplotChart';
import LineLabelChart from './Demos/LineLabelChart';

const MainStack = createStackNavigator<MainStackList>();

const Main = () => (
    <MainStack.Navigator initialRouteName='Menu'>
        <MainStack.Screen
            name='Menu'
            component={Menu}
            options={{
                title: 'LibreChart',
            }}
        />
        <MainStack.Screen name='BarChart' component={BarChart} />
        <MainStack.Screen name='LineChart' component={LineChart} />
        <MainStack.Screen
            name='AutoScaleLineChart'
            component={AutoScaleLineChart}
        />
        <MainStack.Screen name='DateChart' component={DateChart} />
        <MainStack.Screen name='SubplotChart' component={SubplotChart} />
        <MainStack.Screen name='LineLabelChart' component={LineLabelChart} />
    </MainStack.Navigator>
);

const Pages = () => (
    // TODO: set app background color (scrolling on iOS web shows white in dark mode)
    <NavigationContainer>
        <Main />
    </NavigationContainer>
);

export default Pages;
