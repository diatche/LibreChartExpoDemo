import React from 'react';
import {
    Animated,
    StyleSheet,
} from 'react-native';
import {
    Axis,
    Colors,
    Chart,
    DiscreteScale,
    ScaleLayout,
    ChartLayout,
    Hysteresis,
    LinearScale,
    RectDataSource,
    AutoScaleController,
    FixedScaleController,
    PlotLayout,
} from 'librechart';
import { SafeAreaView } from 'react-native';

const kCategories = ['A', 'B', 'C'];
const kInitialScale = 50;

const bottomAxis = new Axis({
    axisType: 'bottomAxis',
    getTickLabel: tick => kCategories[tick.value] || '',
});

export default function BarChart() {
    const chartRef = React.useRef<Chart>(null);
    const mainScale$ = React.useRef(new Animated.ValueXY({
        x: kInitialScale,
        y: -kInitialScale,
    })).current;

    const [chartLayout] = React.useState(() => new ChartLayout({
        plots: [
            new PlotLayout({
                scale: mainScale$,
                anchor: { x: 0.5, y: 0 },
                xLayout: new ScaleLayout({
                    scale: new DiscreteScale(),
                    controller: new FixedScaleController({
                        min: -1,
                        max: 3,
                    }),
                }),
                yLayout: new ScaleLayout({
                    controller: new AutoScaleController({
                        anchor: 0,
                        contentPaddingRel: 0.2,
                        hysteresis: Hysteresis.withScale(new LinearScale({
                            constraints: { maxCount: 5 }
                        })),
                    }),
                }),
                panEnabled: false,
                dataSources: [
                    new RectDataSource({
                        data: [
                            [0, 3],
                            [1, 6],
                            [2, 5],
                        ],
                        transform: p => ({
                            x: p[0] - 0.4,
                            y: 0,
                            x2: p[0] + 0.4,
                            y2: p[1],
                        }),
                        style: {
                            fillColor: Colors.blue500,
                            topLeftCornerRadius: Animated.multiply(0.08, mainScale$.x),
                            topRightCornerRadius: Animated.multiply(0.08, mainScale$.x),
                        },
                        itemStyle: (item, i) => {
                            return {
                                fillColor: [
                                    Colors.blue500,
                                    Colors.green600,
                                    Colors.yellow600,
                                ][i % 3]
                            };
                        },
                    }),
                ],
                axes: {
                    leftAxis: true,
                    bottomAxis,
                },
                grid: {
                    horizontal: true,
                },
            }),
        ],
    }));

    return (
        <SafeAreaView style={styles.container}>
            <Chart
                ref={chartRef}
                layout={chartLayout}
                style={styles.chart}
            />
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
});
