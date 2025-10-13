/**
 * Servicios de APIs para obtener datos financieros en tiempo real
 * Incluye soporte para acciones (Yahoo Finance) y criptomonedas (CoinMarketCap)
 */

export interface StockPrice {
  symbol: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface CryptoPrice {
  symbol: string;
  price: number;
  currency: string;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  lastUpdated: string;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}

// Yahoo Finance API (gratuita, no requiere API key)
export class YahooFinanceAPI {
  private static readonly BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

  /**
   * Obtiene el precio actual de una acción
   * @param symbol Símbolo de la acción (ej: "AAPL", "TSLA")
   * @param currency Moneda en la que se desea el precio
   */
  static async getStockPrice(symbol: string, currency: string = 'USD'): Promise<StockPrice> {
    try {
      const response = await fetch(`${this.BASE_URL}/${symbol}`);
      
      if (!response.ok) {
        throw new Error(`Error al obtener precio de ${symbol}`);
      }

      const data = await response.json();
      const result = data.chart.result[0];
      const quote = result.meta;
      const regularMarketPrice = quote.regularMarketPrice;

      return {
        symbol: symbol.toUpperCase(),
        price: regularMarketPrice,
        currency: currency,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching stock price for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene múltiples precios de acciones en paralelo
   */
  static async getMultipleStockPrices(symbols: string[], currency: string = 'USD'): Promise<StockPrice[]> {
    const promises = symbols.map(symbol => this.getStockPrice(symbol, currency));
    return Promise.allSettled(promises).then(results => 
      results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<StockPrice>).value)
    );
  }
}

// CoinMarketCap API (requiere API key gratuita)
export class CoinMarketCapAPI {
  private static readonly BASE_URL = 'https://pro-api.coinmarketcap.com/v1';
  private static readonly API_KEY = process.env.NEXT_PUBLIC_CMC_API_KEY || '';

  /**
   * Obtiene el precio actual de una criptomoneda
   * @param symbol Símbolo de la crypto (ej: "BTC", "ETH")
   * @param currency Moneda en la que se desea el precio
   */
  static async getCryptoPrice(symbol: string, currency: string = 'USD'): Promise<CryptoPrice> {
    if (!this.API_KEY) {
      console.warn('CoinMarketCap API key no configurada. Usando datos simulados.');
      return this.getSimulatedCryptoPrice(symbol, currency);
    }

    try {
      const response = await fetch(`${this.BASE_URL}/cryptocurrency/quotes/latest?symbol=${symbol}&convert=${currency}`, {
        headers: {
          'X-CMC_PRO_API_KEY': this.API_KEY,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener precio de ${symbol}`);
      }

      const data = await response.json();
      const quote = data.data[symbol.toUpperCase()].quote[currency.toUpperCase()];

      return {
        symbol: symbol.toUpperCase(),
        price: quote.price,
        currency: currency,
        change24h: quote.volume_24h || 0,
        changePercent24h: quote.percent_change_24h || 0,
        marketCap: quote.market_cap || 0,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching crypto price for ${symbol}:`, error);
      return this.getSimulatedCryptoPrice(symbol, currency);
    }
  }

  /**
   * Obtiene múltiples precios de crypto en paralelo
   */
  static async getMultipleCryptoPrices(symbols: string[], currency: string = 'USD'): Promise<CryptoPrice[]> {
    if (!this.API_KEY) {
      const promises = symbols.map(symbol => this.getSimulatedCryptoPrice(symbol, currency));
      return Promise.all(promises);
    }

    try {
      const symbolsParam = symbols.join(',');
      const response = await fetch(`${this.BASE_URL}/cryptocurrency/quotes/latest?symbol=${symbolsParam}&convert=${currency}`, {
        headers: {
          'X-CMC_PRO_API_KEY': this.API_KEY,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener precios de crypto');
      }

      const data = await response.json();
      return symbols.map(symbol => {
        const quote = data.data[symbol.toUpperCase()].quote[currency.toUpperCase()];
        return {
          symbol: symbol.toUpperCase(),
          price: quote.price,
          currency: currency,
          change24h: quote.volume_24h || 0,
          changePercent24h: quote.percent_change_24h || 0,
          marketCap: quote.market_cap || 0,
          lastUpdated: new Date().toISOString()
        };
      });
    } catch (error) {
      console.error('Error fetching multiple crypto prices:', error);
      const promises = symbols.map(symbol => this.getSimulatedCryptoPrice(symbol, currency));
      return Promise.all(promises);
    }
  }

  /**
   * Precios simulados para desarrollo/testing
   */
  private static getSimulatedCryptoPrice(symbol: string, currency: string): CryptoPrice {
    const simulatedPrices: Record<string, number> = {
      'BTC': 45000,
      'ETH': 3000,
      'ADA': 0.5,
      'DOT': 20,
      'LINK': 15,
      'UNI': 8,
      'AAVE': 120,
      'MATIC': 1.2
    };

    const basePrice = simulatedPrices[symbol.toUpperCase()] || 100;
    const changePercent = (Math.random() - 0.5) * 10; // -5% a +5%
    const price = basePrice * (1 + changePercent / 100);

    return {
      symbol: symbol.toUpperCase(),
      price: price,
      currency: currency,
      change24h: price * changePercent / 100,
      changePercent24h: changePercent,
      marketCap: price * 1000000, // Simulado
      lastUpdated: new Date().toISOString()
    };
  }
}

// Exchange Rate API (gratuita)
export class ExchangeRateAPI {
  private static readonly BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

  /**
   * Obtiene la tasa de cambio entre dos monedas
   */
  static async getExchangeRate(from: string, to: string): Promise<ExchangeRate> {
    try {
      const response = await fetch(`${this.BASE_URL}/${from}`);
      
      if (!response.ok) {
        throw new Error(`Error al obtener tasa de cambio ${from}/${to}`);
      }

      const data = await response.json();
      const rate = data.rates[to.toUpperCase()];

      return {
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        rate: rate,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching exchange rate ${from}/${to}:`, error);
      throw error;
    }
  }
}

// Servicio principal que combina todas las APIs
export class FinancialDataService {
  /**
   * Actualiza los precios de todas las posiciones de un fondo
   */
  static async updateFundPositions(fundPositions: any[]): Promise<any[]> {
    const updatedPositions = await Promise.all(
      fundPositions.map(async (position) => {
        try {
          let currentPrice = position.price || position.amount;

          if (position.apiSource === 'yahoo') {
            const stockPrice = await YahooFinanceAPI.getStockPrice(position.symbol, position.currency);
            currentPrice = stockPrice.price;
          } else if (position.apiSource === 'coinmarketcap') {
            const cryptoPrice = await CoinMarketCapAPI.getCryptoPrice(position.symbol, position.currency);
            currentPrice = cryptoPrice.price;
          }

          return {
            ...position,
            currentPrice,
            lastUpdated: new Date().toISOString()
          };
        } catch (error) {
          console.error(`Error updating position ${position.symbol}:`, error);
          return position; // Mantener posición original si hay error
        }
      })
    );

    return updatedPositions;
  }

  /**
   * Calcula el valor total de un fondo basado en sus posiciones
   */
  static calculateFundValue(positions: any[]): number {
    return positions.reduce((total, position) => {
      const value = position.amount * (position.currentPrice || position.price || 0);
      return total + value;
    }, 0);
  }

  /**
   * Convierte un valor de una moneda a otra
   */
  static async convertCurrency(amount: number, from: string, to: string): Promise<number> {
    if (from === to) return amount;

    try {
      const exchangeRate = await ExchangeRateAPI.getExchangeRate(from, to);
      return amount * exchangeRate.rate;
    } catch (error) {
      console.error(`Error converting ${from} to ${to}:`, error);
      return amount; // Retornar valor original si hay error
    }
  }
}

// APIs alternativas gratuitas sin API key
export const ALTERNATIVE_APIS = {
  // Alpha Vantage (gratuita con límite de requests)
  ALPHA_VANTAGE: {
    stocks: 'https://www.alphavantage.co/query',
    crypto: 'https://www.alphavantage.co/query'
  },
  
  // Finnhub (gratuita con límite)
  FINNHUB: {
    stocks: 'https://finnhub.io/api/v1/quote',
    crypto: 'https://finnhub.io/api/v1/crypto/candle'
  },
  
  // CoinGecko (gratuita, sin API key)
  COINGECKO: {
    crypto: 'https://api.coingecko.com/api/v3/simple/price'
  }
};
