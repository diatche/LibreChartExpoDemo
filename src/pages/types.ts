import { StackNavigationProp } from '@react-navigation/stack';

// Main Stack

export type MainStackList = {
    Menu: undefined;
    BarChart: undefined;
    LineChart: undefined;
    AutoScaleLineChart: undefined;
    DateChart: undefined;
    SubplotChart: undefined;
    LineLabelChart: undefined;
};

export type MenuNavigationProp = StackNavigationProp<MainStackList, 'Menu'>;
