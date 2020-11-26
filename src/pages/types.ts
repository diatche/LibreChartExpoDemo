import { StackNavigationProp } from '@react-navigation/stack';

// Main Stack

export type MainStackList = {
    Menu: undefined;
    Chart: undefined;
    DateChart: undefined;
};

export type MenuNavigationProp = StackNavigationProp<
    MainStackList,
    'Menu'
>;

