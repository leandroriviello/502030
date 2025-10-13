/**
 * Hook futuro para consultar precios de divisas y cripto.
 * Por ahora solo deja la firma preparada para integrar APIs externas.
 */
export interface MarketDataResponse {
  symbol: string;
  price: number;
  change24h?: number;
  lastUpdated: string;
}

export const fetchMarketData = async (
  symbols: string[]
): Promise<MarketDataResponse[]> => {
  console.info('[API] fetchMarketData no está implementado aún.', symbols);
  return Promise.resolve([]);
};
