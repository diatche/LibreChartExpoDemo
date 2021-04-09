import React from 'react';
import {
    Animated,
    Platform,
    SafeAreaView,
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
    RectDataSource,
    AutoScaleController,
    FixedScaleController,
} from 'librechart';
import moment from 'moment';

const kInitialScale = 50;
const kInitialDateScale = 50;
// const kInitialDateScale = moment.duration(1, 'day').asMilliseconds();
const kOriginDate = moment('2020-01-01');

const dateScaleLayout = new ScaleLayout({
    scale: new DateScale({
        originDate: kOriginDate,
    }),
});

// const topAxis = new DateAxis({ axisType: 'topAxis' });
const bottomAxis = new DateAxis({ axisType: 'bottomAxis' });
const rightAxis = new Axis({ axisType: 'rightAxis' });

export default function ChartDemo() {
    const chartRef = React.useRef<Chart>(null);
    const dateOffset$ = React.useRef(new Animated.Value(0)).current;
    const mainScale$ = React.useRef(new Animated.ValueXY({
        x: kInitialDateScale,
        y: -kInitialScale,
    })).current;

    const [chartLayout] = React.useState(() => new ChartLayout({
        plots: [
            {
                offset: { x: dateOffset$ },
                scale: mainScale$,
                // anchor: { x: 0.5, y: 0 },
                xLayout: dateScaleLayout,
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
                        }
                    }),
                ],
                axes: {
                    // topAxis,
                    // leftAxis: {},
                    rightAxis,
                    bottomAxis,
                },
                grid: {
                    horizontal: true,
                    vertical: true,
                },
            }
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
        <SafeAreaView style={styles.container}>
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
    }
});
