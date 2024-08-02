import { 
  Box,
  Card,
  Text
} from '@0xsequence/design-system'
import { useAccount } from 'wagmi'

import { CollectibleTileImage } from './CollectibleTileImage'
import { useTokenMetadata, useCollectionBalance } from '../hooks/data'

interface ItemsForSaleProps {
  collectionAddress: string
  chainId: number
}

export const ItemsForSale = ({
  collectionAddress,
  chainId
}: ItemsForSaleProps) => {
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
    ['1', '2', '3', '4']
  )

  const isLoading = tokenMetadatasLoading || collectionBalanceIsLoading

  // TODO: move buy button between each card
  // add cache clearing onSuccess

  if (isLoading) {
    return (
      <Box>
        Loading
      </Box>
    )
  }

  return (
    <Box
      flexDirection={"row"}
      justifyContent="space-between"
      alignItems="center"
      gap="2"
      flexWrap="wrap"
    >
      {tokenMetadatas?.map(tokenMetadata => {
        const collectibleBalance = collectionBalanceData?.find(balance => (
          balance?.tokenID === tokenMetadata.tokenId 
        ))

        const amountOwned = collectibleBalance?.balance || '0'

        return (
          <Card style={{ width: '200px' }}>
            <CollectibleTileImage imageUrl={tokenMetadata.image} />

            <Box flexDirection="column" marginTop="1">
              <Text variant="small" color="text100">
                {`Token Id: ${tokenMetadata.tokenId}`}
              </Text>
              <Text variant="small" color="text100">
                {`Amount Owned: ${amountOwned}`}
              </Text>
              <Text color="text100">
                {tokenMetadata.name}
              </Text>
            </Box>
          </Card>
        )
      })}
    </Box>
  )
}