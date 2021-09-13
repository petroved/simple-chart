const getApiUrl = (symbol: string) =>
    `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1month&outputsize=1000&order=ASC&apikey=cb18d98428194d0bbea439e9dc62c2aa`;

export const fetchBySymbol = (symbol: string): Promise<Response> => fetch(getApiUrl(symbol));
