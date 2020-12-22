import React from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    View,
} from 'react-native';
import {
    Button,
} from 'react-native-paper';
import {
    Axis,
    Colors,
    Chart,
    LineDataSource,
    DateAxis,
    ScaleLayout,
    ChartLayout,
    DateScale,
    Hysteresis,
    LinearScale,
    RangeDataSource,
    AutoScaleController,
} from 'librechart';
import moment from 'moment';
import Decimal from 'decimal.js';

const kInitialScale = 50;
const kInitialDateScale = 50;
// const kInitialDateScale = moment.duration(1, 'day').asMilliseconds();
const kOriginDate = moment('2020-01-01');

const dateScaleLayout = new ScaleLayout({
    scale: new DateScale({
        originDate: kOriginDate,
    }),
});

// const topAxis = new DateAxis('topAxis');
const bottomAxis = new DateAxis('bottomAxis');
const rightAxis = new Axis('rightAxis');

export default function ChartDemo() {
    const chartRef = React.useRef<Chart>(null);
    const dateOffset$ = React.useRef(new Animated.Value(0)).current;
    const dateViewOffset$ = React.useRef(new Animated.Value(0)).current;
    const mainScale$ = React.useRef(new Animated.ValueXY({
        x: kInitialDateScale,
        y: -kInitialScale,
    })).current;
    const secondaryScale$ = React.useRef(new Animated.ValueXY({
        x: mainScale$.x,
        y: new Animated.Value(-kInitialScale),
    })).current;

    const [chartLayout] = React.useState(() => new ChartLayout({
        rowHeights: [
            { flex: 3 },
            { flex: 1 },
            // 200,
        ],
        plots: [
            {
                offset: { x: dateOffset$ },
                viewOffset: { x: dateViewOffset$ },
                // ownsViewOffset: true,
                scale: mainScale$,
                // anchor: { x: 0.5, y: 0 },
                xLayout: dateScaleLayout,
                yLayout: new ScaleLayout({
                    controller: new AutoScaleController({
                        anchor: 0,
                        viewPaddingAbs: [10, 10],
                        hysteresis: Hysteresis.withScale(new LinearScale({
                            constraints: { maxCount: 5 }
                        })),
                    }),
                }),
                verticalPanEnabled: false,
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
                            x: kOriginDate.clone().add(p[0], 'days'),
                            y: new Decimal(p[1]),
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
                        }
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
                offset: { x: dateOffset$ },
                viewOffset: { x: dateViewOffset$ },
                // ownsViewOffset: { x: false, y: true },
                scale: secondaryScale$,
                anchor: { x: 0.5, y: 0 },
                xLayout: dateScaleLayout,
                yLayout: new ScaleLayout({
                    controller: new AutoScaleController({
                        anchor: 0,
                        viewPaddingAbs: [10, 10],
                        hysteresis: Hysteresis.withScale(new LinearScale({
                            constraints: { maxCount: 3 }
                        })),
                    }),
                }),
                verticalPanEnabled: false,
                dataSources: [
                    new RangeDataSource({
                        data: [
                            [-2, 0, 1, 0.1],
                            [-1, 1, 1, 0.1],
                            [0, 0, 1, 0.1],
                            [1, 1, 1, 0.1],
                            [1.5, 0.5, 1, 0.1],
                            [7, 0.5, 1, 0.1],
                            [8, 0.25, 1, 0.1],
                            [9, 0.75, 1, 0.1],
                            [10, 0.25, 1, 0.1],
                            [11, 0.75, 1, 0.1],
                        ],
                        transform: p => ({
                            x: kOriginDate.clone().add(p[0], 'days'),
                            y: new Decimal(p[1]),
                            x2: kOriginDate.clone().add(p[0] + p[2], 'days'),
                            y2: new Decimal(p[1] + p[3]),
                        }),
                        style: {
                            fillColor: Colors.red700,
                            cornerRadius: 5,
                        }
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
                    //         y: new Decimal(p[1]),
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
    }));

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
        ])
        animation.start();
        return () => animation.stop();
    }, []);

    return (
        <View style={styles.container}>
            <Chart
                ref={chartRef}
                layout={chartLayout}
                style={styles.chart}
            />
            <View style={styles.toolbar}>
                <Button onPress={() => applyScale(1/1.6)}>Scale –</Button>
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
        </View>
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
    }
});
