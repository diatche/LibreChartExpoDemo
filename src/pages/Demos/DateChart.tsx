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
    Chart,
    DataSource,
    DateAxis,
} from 'librechart';
import moment from 'moment';
import Decimal from 'decimal.js';

const kInitialScale = 50;
const kInitialDateScale = 50;
// const kInitialDateScale = moment.duration(1, 'day').asMilliseconds();

const bottomAxis = new DateAxis('bottomAxis');
const rightAxis = new Axis('rightAxis');

const originDate = moment('2020-01-01');

export default function ChartDemo() {
    const chartRef = React.useRef<Chart>(null);
    const scale$ = React.useRef(new Animated.ValueXY({
        x: kInitialDateScale,
        y: -kInitialScale
    })).current;

    const [dataSources] = React.useState(() => [
        new DataSource({
            data: [
                [0, 0],
                [1, 1],
                [2, 2],
                [10, 10],
                [20, 20],
                [30, 30],
                [100, 100],
                [200, 200],
                [300, 300],
            ].map(p => ({
                x: originDate.clone().add(p[0], 'days'),
                y: new Decimal(p[1]),
            })),
            scale: {
                x: bottomAxis.scale,
                y: rightAxis.scale,
            },
        }),
    ]);

    const applyScale = React.useCallback((coef: number) => {
        let animation = Animated.timing(scale$, {
            toValue: {
                x: (scale$.x as any)._value * coef,
                y: (scale$.y as any)._value * coef,
            },
            duration: 400,
            useNativeDriver: false,
        });
        animation.start();
        return () => animation.stop();
    }, []);

    return (
        <View style={styles.container}>
            <Chart
                ref={chartRef}
                scale={scale$}
                dataSources={dataSources}
                style={styles.chart}
                axes={{
                    bottomAxis,
                    rightAxis,
                }}
                grid={{
                    horizontalAxis: 'bottomAxis',
                    verticalAxis: 'rightAxis',
                }}
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
