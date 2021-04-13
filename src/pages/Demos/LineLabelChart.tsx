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
    Colors,
    Chart,
    LabelDataSource,
    LineDataSource,
    ChartLayout,
} from 'librechart';

const kInitialScale = 50;

export default function ChartDemo() {
    const chartRef = React.useRef<Chart>(null);
    const mainScale$ = React.useRef(
        new Animated.ValueXY({
            x: kInitialScale,
            y: -kInitialScale,
        }),
    ).current;

    const [chartLayout] = React.useState(() => {
        const data = [
            [0, 0],
            [1, 1.2],
            [2, 1],
            [5, 4],
            [6, 3],
            [7, 2],
        ];
        return new ChartLayout({
            plots: [
                {
                    offset: { x: 1, y: 1 },
                    scale: mainScale$,
                    anchor: { x: 0, y: 0 },
                    dataSources: [
                        new LineDataSource({
                            data,
                            transform: p => ({
                                x: p[0],
                                y: p[1],
                            }),
                            style: {
                                pointInnerRadius: 2.5,
                                pointOuterRadius: 4.5,
                                strokeWidth: 2,
                                strokeColor: Colors.indigo700,
                                pointInnerColor: Colors.white,
                            },
                        }),
                        new LabelDataSource({
                            data,
                            transform: p => ({
                                x: p[0],
                                y: p[1],
                            }),
                            getLabel: p => {
                                return `(${p[0]}, ${p[1]})`;
                            },
                            style: {
                                viewOffset: { y: -20 },
                            },
                        }),
                    ],
                    axes: {
                        bottomAxis: true,
                        leftAxis: true,
                    },
                    grid: {
                        horizontal: true,
                        vertical: true,
                    },
                },
            ],
        });
    });

    const applyScale = React.useCallback((coef: number) => {
        let animation = Animated.parallel([
            Animated.timing(mainScale$, {
                toValue: {
                    x: (mainScale$.x as any)._value * coef,
                    y: (mainScale$.y as any)._value * coef,
                },
                duration: 400,
                useNativeDriver: false,
            }),
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
