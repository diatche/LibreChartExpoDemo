import React from 'react';
import {
    Animated,
    Platform,
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';
import { Button } from 'react-native-paper';
import {
    Axis,
    Colors,
    Chart,
    LineDataSource,
    ScaleLayout,
    ChartLayout,
    RectDataSource,
    FixedScaleController,
} from 'librechart';

const kInitialYScale = 50;
const kInitialXScale = 50;

// const topAxis = new DateAxis({ axisType: 'topAxis' });
const bottomAxis = new Axis({ axisType: 'bottomAxis' });
const rightAxis = new Axis({ axisType: 'rightAxis' });

const xScaleLayout = new ScaleLayout();

export default function ChartDemo() {
    const chartRef = React.useRef<Chart>(null);
    const xOffset$ = React.useRef(new Animated.Value(-5)).current;
    const xViewOffset$ = React.useRef(new Animated.Value(0)).current;
    const mainScale$ = React.useRef(
        new Animated.ValueXY({
            x: kInitialXScale,
            y: -kInitialYScale,
        }),
    ).current;
    const secondaryScale$ = React.useRef(
        new Animated.ValueXY({
            x: mainScale$.x,
            y: new Animated.Value(-kInitialYScale),
        }),
    ).current;

    const [chartLayout] = React.useState(
        () =>
            new ChartLayout({
                rowHeights: [
                    { flex: 3 },
                    { flex: 1 },
                    // 200,
                ],
                plots: [
                    {
                        offset: { x: xOffset$, y: 1 },
                        viewOffset: { x: xViewOffset$ },
                        // ownsViewOffset: true,
                        scale: mainScale$,
                        anchor: { x: 0.5, y: 0 },
                        xLayout: xScaleLayout,
                        dataSources: [
                            new LineDataSource({
                                data: [
                                    [0, 0],
                                    [1, 1.2],
                                    [2, 1],
                                    [5, 4],
                                    [10, 11],
                                    [20, 24],
                                    [30, 20],
                                    [100, 90],
                                    [200, 240],
                                    [300, 100],
                                ],
                                transform: p => ({
                                    x: p[0],
                                    y: p[1],
                                    // style: {
                                    //     pointInnerRadius: Math.log(p[1] + 1) + 2,
                                    //     pointOuterRadius: Math.log(p[1] + 1) + 4,
                                    // }
                                }),
                                style: {
                                    // curve: 'monotoneX',
                                    pointInnerRadius: 2.5,
                                    pointOuterRadius: 4.5,
                                    strokeWidth: 2,
                                    // strokeDashArray: [2, 4],
                                    strokeColor: Colors.indigo700,
                                    pointInnerColor: Colors.white,
                                },
                            }),
                        ],
                        axes: {
                            // topAxis,
                            // leftAxis: {},
                            rightAxis,
                            // bottomAxis,
                        },
                        grid: {
                            horizontal: true,
                            vertical: true,
                        },
                    },
                    {
                        offset: { x: xOffset$ },
                        viewOffset: { x: xViewOffset$ },
                        // ownsViewOffset: { x: false, y: true },
                        scale: secondaryScale$,
                        anchor: { x: 0.5, y: 0 },
                        xLayout: xScaleLayout,
                        yLayout: new ScaleLayout({
                            controller: new FixedScaleController({
                                min: 0,
                                max: 1,
                                viewPaddingRel: 0.1,
                            }),
                        }),
                        verticalPanEnabled: false,
                        dataSources: [
                            new RectDataSource({
                                data: [
                                    [-2, 0, 1],
                                    [-1, 1, 1],
                                    [0, 0, 1],
                                    [1, 1, 1],
                                    [1.5, 0.5, 1],
                                    [7, 0.5, 1],
                                    [8, 0.25, 1],
                                    [9, 0.75, 1],
                                    [10, 0.25, 1],
                                    [11, 0.75, 1],
                                ],
                                transform: p => ({
                                    x: p[0],
                                    y: p[1],
                                    x2: p[0] + p[2],
                                    y2: p[1],
                                }),
                                style: {
                                    strokeColor: Colors.red700,
                                    strokeWidth: 4,
                                    fillColor: Colors.red700,
                                    cornerRadius: 4,
                                },
                            }),
                            // new LineDataSource({
                            //     data: [
                            //         [-2, 0],
                            //         [-1, 1],
                            //         [0, 0],
                            //         [1, 1],
                            //         [1.5, 0.5],
                            //         [7, 0.5],
                            //         [8, 0.25],
                            //         [9, 0.75],
                            //         [10, 0.25],
                            //         [11, 0.75],
                            //     ],
                            //     transform: p => ({
                            //         x: kOriginDate.clone().add(p[0], 'days'),
                            //         y: p[1],
                            //     }),
                            //     style: {
                            //         // curve: 'monotoneX',
                            //         pointInnerRadius: 2.5,
                            //         pointOuterRadius: 4.5,
                            //         strokeWidth: 2,
                            //         strokeColor: Colors.red700,
                            //         pointInnerColor: Colors.white,
                            //     }
                            // }),
                        ],
                        axes: {
                            bottomAxis,
                            rightAxis: {},
                        },
                        grid: {
                            vertical: true,
                        },
                    },
                ],
            }),
    );

    const applyScale = React.useCallback((coef: number) => {
        let animation = Animated.parallel([
            Animated.timing(mainScale$, {
                toValue: {
                    x: (mainScale$.x as any)._value * coef,
                    y: (mainScale$.y as any)._value,
                    // y: (mainScale$.y as any)._value * coef,
                },
                duration: 400,
                useNativeDriver: false,
            }),
            // Animated.timing(secondaryScale$.y, {
            //     toValue: (mainScale$.y as any)._value * coef,
            //     duration: 400,
            //     useNativeDriver: false,
            // }),
        ]);
        animation.start();
        return () => animation.stop();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Chart ref={chartRef} layout={chartLayout} style={styles.chart} />
            <View style={styles.toolbar}>
                <Button onPress={() => applyScale(1 / 1.6)}>Scale –</Button>
                <Button onPress={() => applyScale(1.6)}>Scale +</Button>
                {/* <Button
                    mode='contained'
                    onPress={() => chartRef.current?.scrollToLocation({
                        location: { x: 0, y: 0 },
                        animated: true,
                    })}
                >
                    Origin
                </Button> */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    chart: {
        flex: 1,
        backgroundColor: 'white',
    },
    toolbar: {
        height: 50,
        marginBottom: Platform.OS === 'ios' ? 10 : 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderColor: 'gray',
        borderTopWidth: 1,
    },
});
