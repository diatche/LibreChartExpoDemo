import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Menu from './Menu';
import Chart from './Demos/Chart';
import {
    MainStackList,
} from './types';

const MainStack = createStackNavigator<MainStackList>();

const Main = () => (
    <MainStack.Navigator initialRouteName='Chart'>
        <MainStack.Screen
            name='Menu'
            component={Menu}
            options={{
                title: 'Liberty Chart',
            }}
        />
        <MainStack.Screen
            name='Chart'
            component={Chart}
        />
    </MainStack.Navigator>
);

const Pages = () => (
    // TODO: set app background color (scrolling on iOS web shows white in dark mode)
    <NavigationContainer>
        <Main />
    </NavigationContainer>
);

export default Pages;
