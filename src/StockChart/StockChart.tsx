import { format } from 'd3-format';
import { timeFormat, timeParse } from 'd3-time-format';
import * as React from 'react';
import {
    discontinuousTimeScaleProviderBuilder,
    Chart,
    ChartCanvas,
    BarSeries,
    CandlestickSeries,
    OHLCTooltip,
    lastVisibleItemBasedZoomAnchor,
    SingleTooltip,
    XAxis,
    YAxis,
    CrossHairCursor,
    EdgeIndicator,
    MouseCoordinateX,
    MouseCoordinateY,
    withDeviceRatio,
    withSize,
} from 'react-financial-charts';
import { IOHLCData, ITwelveData, ITwelveMeta } from './interfaces';
import { fetchBySymbol } from './api';

interface StockChartProps {
    readonly symbol: string;
    readonly height: number;
    readonly dateTimeFormat?: string;
    readonly width: number;
    readonly ratio: number;
}

interface WithOHLCState {
    data?: IOHLCData[];
    currency?: string;
    message: string;
}

const parseDate = timeParse('%Y-%m-%d');

const parseData = (data: Array<ITwelveData>) => {
    return data.map((d: ITwelveData) => {
        const date = parseDate(d.datetime);
        if (date === null) {
            d.date = new Date(Number(d.datetime));
        } else {
            d.date = new Date(date);
        }

        d.close = +d.close;
        d.high = +d.high;
        d.low = +d.low;
        d.open = +d.open;
        d.volume = +d.volume;

        return d as IOHLCData;
    });
};

class StockChart extends React.Component<StockChartProps, WithOHLCState> {
    private readonly margin = { left: 0, right: 48, top: 0, bottom: 24 };
    private readonly pricesDisplayFormat = format('.2f');
    private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
        (d: IOHLCData) => d.date
    );

    public constructor(props: StockChartProps) {
        super(props);

        this.state = {
            message: `Loading ${props.symbol} data...`,
        };
    }

    public componentDidMount() {
        const { symbol } = this.props;
        function fetchStock<T>(symbol: string): Promise<T> {
            return fetchBySymbol(symbol).then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            });
        }

        fetchStock<{ values: Array<ITwelveData>; meta: ITwelveMeta }>(symbol)
            .then((res) => {
                const data = parseData(res.values);
                this.setState({
                    data,
                    currency: res.meta.currency,
                });
            })
            .catch(() => {
                this.setState({
                    message: `Failed to fetch data.`,
                });
            });
    }

    public render() {
        const { dateTimeFormat = '%B %Y', height, ratio, width, symbol } = this.props;
        const { data: initialData, message, currency } = this.state;
        const { margin, xScaleProvider } = this;

        const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(initialData || []);

        const max = xAccessor(data[data.length - 1]);
        const min = xAccessor(data[Math.max(0, data.length - 100)]);
        const xExtents = [min, max + 5];

        const gridHeight = height - margin.top - margin.bottom;

        const barChartHeight = gridHeight / 4;
        const barChartOrigin = (_: number, h: number) => [0, h - barChartHeight];
        const chartHeight = gridHeight;

        const timeDisplayFormat = timeFormat(dateTimeFormat);

        if (initialData === undefined) {
            return <div className="center">{message}</div>;
        }

        return (
            <ChartCanvas
                height={height}
                ratio={ratio}
                width={width}
                margin={margin}
                data={data}
                displayXAccessor={displayXAccessor}
                seriesName="Data"
                xScale={xScale}
                xAccessor={xAccessor}
                xExtents={xExtents}
                zoomAnchor={lastVisibleItemBasedZoomAnchor}
            >
                <Chart id={2} height={barChartHeight} origin={barChartOrigin} yExtents={this.barChartExtents}>
                    <BarSeries fillStyle={this.volumeColor} yAccessor={this.volumeSeries} />
                    <MouseCoordinateY rectWidth={margin.right} displayFormat={this.pricesDisplayFormat} />
                </Chart>
                <Chart id={3} height={chartHeight} yExtents={this.candleChartExtents}>
                    <XAxis showGridLines gridLinesStrokeStyle="#e0e3eb" />
                    <YAxis showGridLines tickFormat={this.pricesDisplayFormat} />
                    <CandlestickSeries />
                    <MouseCoordinateY rectWidth={margin.right} displayFormat={this.pricesDisplayFormat} />
                    <MouseCoordinateX displayFormat={timeDisplayFormat} />
                    <EdgeIndicator
                        itemType="last"
                        rectWidth={margin.right}
                        fill={this.openCloseColor}
                        lineStroke={this.openCloseColor}
                        displayFormat={this.pricesDisplayFormat}
                        yAccessor={this.yEdgeIndicator}
                    />
                    <OHLCTooltip origin={[8, 40]} />
                    <SingleTooltip
                        yLabel={symbol}
                        yValue={`${this.pricesDisplayFormat(data[data.length - 1]?.close)} ${currency}`}
                        origin={[8, 16]}
                        fontSize={16}
                        forChart={3}
                        options={null}
                        layout="horizontal"
                    />
                </Chart>
                <CrossHairCursor />
            </ChartCanvas>
        );
    }

    private readonly barChartExtents = (data: IOHLCData) => {
        return data.volume;
    };

    private readonly candleChartExtents = (data: IOHLCData) => {
        return [data.high, data.low];
    };

    private readonly yEdgeIndicator = (data: IOHLCData) => {
        return data.close;
    };

    private readonly volumeColor = (data: IOHLCData) => {
        return data.close > data.open ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)';
    };

    private readonly volumeSeries = (data: IOHLCData) => {
        return data.volume;
    };

    private readonly openCloseColor = (data: IOHLCData) => {
        return data.close > data.open ? '#26a69a' : '#ef5350';
    };
}

export default withSize({ style: { minHeight: 600 } })(withDeviceRatio()(StockChart));
