// sales params
export const NFT_TOKEN_ADDRESS = '0xa80f129750d800711372541122754a53d6716f55'
export const SALES_CONTRACT_ADDRESS = '0xdf96ab1fb12fe800fb1a64836c1949e2c162e830'
export const CHAIN_ID = 137

// Assumption that all tokens have the same price...
export const UNITARY_PRICE_RAW = '100000'

interface Currency {
  currencyAddress: string
  decimals: number
  symbol: string
}
export const salesCurrency: Currency = {
  currencyAddress: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
  decimals: 6,
  symbol: 'USDC'
}

interface SaleItem {
  priceRaw: string,
  tokenId: string,
}

export const itemsForSales: SaleItem[] = [
  {
    tokenId: '1',
    priceRaw: '100000',
  },
  {
    tokenId: '2',
    priceRaw: '100000'
  },
  {
    tokenId: '3',
    priceRaw: '100000'
  },
  {
    tokenId: '4',
    priceRaw: '100000'
  }
] 