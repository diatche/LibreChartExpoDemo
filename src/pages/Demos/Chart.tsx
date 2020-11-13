import React from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    View,
} from 'react-native';
import {
    Text,
    Button,
} from 'react-native-paper';
import {
    Chart,
    DataSource,
} from 'liberty-chart';

const kInitialScale = 50;

export default function ChartDemo() {
    const chartRef = React.useRef<Chart>(null);
    const scale$ = React.useRef(new Animated.ValueXY({ x: kInitialScale, y: -kInitialScale})).current;

    const [dataSources] = React.useState(() => [
        new DataSource({
            data: [[0, 0], [1, 1], [2, 2]].map(p => ({ x: p[0], y: p[1] }))
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
