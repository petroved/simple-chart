export interface IOHLCData {
    readonly close: number;
    readonly date: Date;
    readonly datetime: string;
    readonly high: number;
    readonly low: number;
    readonly open: number;
    readonly volume: number;
}

export interface ITwelveData {
    date?: Date;
    close: string | number;
    datetime: string;
    high: string | number;
    low: string | number;
    open: string | number;
    volume: string | number;
}

export interface ITwelveMeta {
    symbol: string;
    interval: string;
    currency: string;
    exchange_timezone: string;
    exchange: string;
    type: string;
}
