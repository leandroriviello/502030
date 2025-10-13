# 📊 APIs Financieras - Guía de Configuración

## 🎯 **APIs Implementadas**

He implementado un sistema completo de APIs para obtener datos financieros en tiempo real:

### 📈 **1. Yahoo Finance API (Gratuita)**
- **Para**: Acciones, ETFs, índices
- **API Key**: No requerida
- **Límites**: Sin límites conocidos para uso básico
- **Ejemplos**: AAPL, TSLA, SPY, QQQ

### ₿ **2. CoinMarketCap API (Gratuita con API Key)**
- **Para**: Criptomonedas
- **API Key**: Requerida (gratuita hasta 10,000 requests/mes)
- **Fallback**: Precios simulados para desarrollo
- **Ejemplos**: BTC, ETH, ADA, DOT

### 💱 **3. Exchange Rate API (Gratuita)**
- **Para**: Tasas de cambio entre monedas
- **API Key**: No requerida
- **Actualización**: Diaria
- **Ejemplos**: USD/ARS, EUR/USD, BTC/USD

## 🚀 **Configuración de APIs**

### 📋 **Variables de Entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# CoinMarketCap API Key (opcional)
NEXT_PUBLIC_CMC_API_KEY=tu_api_key_aqui

# Alpha Vantage API Key (opcional, alternativa)
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=tu_api_key_aqui

# Finnhub API Key (opcional, alternativa)
NEXT_PUBLIC_FINNHUB_API_KEY=tu_api_key_aqui
```

### 🔑 **Cómo Obtener API Keys**

#### **CoinMarketCap (Recomendado para Crypto)**
1. Ve a [coinmarketcap.com/api](https://coinmarketcap.com/api/)
2. Regístrate gratis
3. Obtén hasta 10,000 requests/mes
4. Copia tu API key

#### **Alpha Vantage (Alternativa para Acciones)**
1. Ve a [alphavantage.co](https://www.alphavantage.co/support/#api-key)
2. Regístrate gratis
3. Obtén hasta 5 requests/minuto
4. Copia tu API key

#### **Finnhub (Alternativa Premium)**
1. Ve a [finnhub.io](https://finnhub.io/register)
2. Regístrate gratis
3. Obtén hasta 60 requests/minuto
4. Copia tu API key

## 🛠️ **Uso en la Aplicación**

### 📊 **Crear Posición con API**

Cuando agregues una posición en un fondo:

1. **Símbolo**: Ingresa el símbolo (AAPL, BTC, ETH)
2. **Tipo**: Selecciona Acciones, Crypto, etc.
3. **Ubicación**: Especifica dónde está (Binance, Broker, etc.)
4. **Auto-sync**: Se activará automáticamente si hay API configurada

### 🔄 **Actualización Automática**

El sistema puede:
- ✅ **Actualizar precios** en tiempo real
- ✅ **Calcular valores totales** automáticamente
- ✅ **Mostrar cambios** de precio (+/- %)
- ✅ **Sincronizar múltiples fuentes** (acciones + crypto)

## 📱 **Funcionalidades del Módulo de Fondos**

### 🎯 **Tipos de Fondos Disponibles**

1. **🛡️ Fondo de Emergencia**
   - Para imprevistos y gastos urgentes
   - Recomendado: 3-6 meses de gastos

2. **✈️ Fondo de Vacaciones**
   - Para viajes y tiempo libre
   - Objetivos a corto/medio plazo

3. **📈 Fondo de Inversiones**
   - Para crecimiento a largo plazo
   - Acciones, ETFs, fondos mutuos

4. **₿ Fondo Crypto**
   - Para inversiones en criptomonedas
   - BTC, ETH, altcoins

5. **🎯 Fondo Personalizado**
   - Para objetivos específicos
   - Casa, auto, educación, etc.

### 💰 **Tipos de Inversiones Soportadas**

- **📈 Acciones**: AAPL, TSLA, MSFT, etc.
- **🏛️ Bonos**: Bonos gubernamentales y corporativos
- **📊 Fondos**: Fondos mutuos e indexados
- **₿ Crypto**: Bitcoin, Ethereum, altcoins
- **🥇 Commodities**: Oro, plata, petróleo
- **💵 Efectivo**: Dinero en cuentas bancarias

### 🌍 **Monedas Soportadas**

- **ARS**: Peso Argentino
- **USD**: Dólar Estadounidense
- **EUR**: Euro
- **BRL**: Real Brasileño
- **CLP**: Peso Chileno
- **COP**: Peso Colombiano
- **BTC**: Bitcoin
- **ETH**: Ethereum

## 🔧 **APIs Alternativas (Sin API Key)**

Si no quieres configurar API keys, el sistema incluye:

### 🎭 **Modo Simulación**
- Precios simulados para desarrollo
- Cambios de precio aleatorios
- Funcionalidad completa sin APIs externas

### 📊 **APIs Gratuitas Sin Límites**
- **Yahoo Finance**: Para acciones (sin API key)
- **Exchange Rate API**: Para tasas de cambio (sin API key)
- **CoinGecko**: Para crypto (sin API key, con límites)

## 🚀 **Próximas Mejoras**

### 📈 **APIs Adicionales**
- **Binance API**: Para portfolios de crypto
- **Broker APIs**: Para cuentas de trading
- **Bancos**: Para cuentas corrientes/ahorro

### 🔄 **Sincronización Automática**
- **Webhooks**: Actualizaciones en tiempo real
- **Cron Jobs**: Actualización periódica
- **Push Notifications**: Alertas de cambios importantes

### 📊 **Análisis Avanzado**
- **Gráficos de rendimiento**: Histórico de precios
- **Análisis de riesgo**: Volatilidad y correlaciones
- **Recomendaciones**: Sugerencias de rebalanceo

## 🎯 **Ejemplo de Uso Completo**

```typescript
// Crear fondo de inversiones
const fondoInversiones = {
  name: "Fondo de Crecimiento",
  fundType: "inversiones",
  targetAmount: 100000,
  currency: "USD",
  positions: [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      amount: 10,
      currency: "USD",
      investmentType: "acciones",
      location: "Interactive Brokers",
      apiSource: "yahoo"
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      amount: 0.5,
      currency: "USD",
      investmentType: "crypto",
      location: "Binance",
      apiSource: "coinmarketcap"
    }
  ]
};
```

¡El módulo de Fondos está completamente funcional y listo para usar! 🎉✨
