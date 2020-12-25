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
    Colors,
    Chart,
    LineDataSource,
    ChartLayout,
} from 'librechart';
import Decimal from 'decimal.js';

const kInitialScale = 50;

export default function ChartDemo() {
    const chartRef = React.useRef<Chart>(null);
    const mainScale$ = React.useRef(new Animated.ValueXY({
        x: kInitialScale,
        y: -kInitialScale,
    })).current;

    const [chartLayout] = React.useState(() => new ChartLayout({
        rowHeights: [
            { flex: 3 },
            { flex: 1 },
            // 200,
        ],
        plots: [
            {
                scale: mainScale$,
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
                            x: new Decimal(p[0]),
                            y: new Decimal(p[1]),
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
                    bottomAxis: {},
                    leftAxis: {},
                },
                grid: {
                    horizontal: true,
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
