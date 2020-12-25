import { StackNavigationProp } from '@react-navigation/stack';

// Main Stack

export type MainStackList = {
    Menu: undefined;
    BarChart: undefined;
    LineChart: undefined;
    DateChart: undefined;
};

export type MenuNavigationProp = StackNavigationProp<
    MainStackList,
    'Menu'
>;

