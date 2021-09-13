import { fetchBySymbol } from './api';

const dummyGOOGLMeta = {
    currency: 'USD',
    exchange: 'NASDAQ',
    exchange_timezone: 'America/New_York',
    interval: '1month',
    symbol: 'GOOGL',
    type: 'Common Stock',
};

const dummyGOOGLData = {
    close: '51.23624',
    datetime: '2004-08-01',
    high: '56.79679',
    low: '48.02803',
    open: '50.05005',
    volume: '133606300',
};

const dummyGOOGMeta = {
    currency: 'USD',
    exchange: 'NASDAQ',
    exchange_timezone: 'America/New_York',
    interval: '1month',
    symbol: 'GOOG',
    type: 'Common Stock',
};

const dummyGOOGData = {
    close: '50.99386',
    datetime: '2004-08-01',
    high: '56.52812',
    low: '47.80083',
    open: '49.81329',
    volume: '134241100',
};

test('twelve GOOGL fetch', async () => {
    const response = await (await fetchBySymbol('GOOGL')).json();

    expect(response.meta).toEqual(dummyGOOGLMeta);
    expect(response.values[0]).toEqual(dummyGOOGLData);
});

test('twelve GOOG fetch', async () => {
    const response = await (await fetchBySymbol('GOOG')).json();

    expect(response.meta).toEqual(dummyGOOGMeta);
    expect(response.values[0]).toEqual(dummyGOOGData);
});
