import { 
  Box,
  Card,
  TokenImage,
  Text,
  Spinner,
  useMediaQuery
} from '@0xsequence/design-system'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'

import { BuyWithCreditCardButton } from './BuyWithCreditCardButton'
import { CollectibleTileImage } from '../CollectibleTileImage'
import {
  useTokenMetadata,
  useCollectionBalance,
  useContractInfo
} from '../../hooks/data'
import {  
  CHAIN_ID,
  itemsForSales,
  NFT_TOKEN_ADDRESS,
  salesCurrency,
} from '../../constants'

interface ItemsForSaleProps {
  collectionAddress: string
  chainId: number
}

export const ItemsForSale = ({
  collectionAddress,
  chainId
}: ItemsForSaleProps) => {
  const isMobile = useMediaQuery('isMobile')
  const { address: userAddress } = useAccount()
  const { data: collectionBalanceData, isLoading: collectionBalanceIsLoading } = useCollectionBalance({
    accountAddress: userAddress || '',
    contractAddress: collectionAddress,
    chainId,
    includeMetadata: false,
    verifiedOnly: false
  })

  const { data: tokenMetadatas, isLoading: tokenMetadatasLoading } = useTokenMetadata(
    chainId,
    collectionAddress,
    itemsForSales.map(item => item.tokenId)
  )

  const { data: currencyContractInfoData, isLoading: currencyContractInfoIsLoading } = useContractInfo(
    CHAIN_ID,
    salesCurrency.currencyAddress
  )

  const isLoading = tokenMetadatasLoading || collectionBalanceIsLoading || currencyContractInfoIsLoading

  if (isLoading) {
    return (
      <Box
        margin="2"
        color="text100"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="2"
      >
        <Text color="text100">Loading...</Text>
        <Spinner />
      </Box>
    )
  }

  return (
    <Box
      flexDirection={"row"}
      alignItems="center"
      flexWrap="wrap"
      style={{
        width: 'calc(100% + 8px)'
      }}
    >
      {tokenMetadatas?.map(tokenMetadata => {
        const collectibleBalance = collectionBalanceData?.find(balance => (
          balance?.tokenID === tokenMetadata.tokenId 
        ))

        const amountOwned = collectibleBalance?.balance || '0'

        const price = itemsForSales.find(item => (
          item.tokenId === tokenMetadata.tokenId
        ))?.priceRaw || '100000'

        const priceFormatted = formatUnits(BigInt(price), salesCurrency.decimals)

        return (
          <Box
            padding="1"
            width="full"
            flexDirection="column"
            style={{
              flexBasis: isMobile ? '100%' : '50%'
            }}
          >
            <Card>
              <CollectibleTileImage imageUrl={tokenMetadata?.image || ''} />

              <Box flexDirection="column" marginTop="1">
                <Text variant="small" color="text100">
                  {`Token Id: ${tokenMetadata.tokenId}`}
                </Text>
                <Text variant="small" color="text100">
                  {`Amount Owned: ${amountOwned}`}
                </Text>
                <Box flexDirection="row" gap="1" alignItems="center">
                  <Text variant="small" color="text100">
                    {`Price: ${priceFormatted}`}
                  </Text>
                  <TokenImage size="xs" src={currencyContractInfoData?.logoURI} />
                </Box>
                <Text color="text100">
                  {tokenMetadata.name}
                </Text>
              </Box>
              <Box marginTop="1">
                <BuyWithCreditCardButton
                  chainId={chainId}
                  collectionAddress={NFT_TOKEN_ADDRESS}
                  tokenId={tokenMetadata.tokenId}
                />
              </Box>
            </Card>
          </Box>
        )
      })}
    </Box>
  )
}