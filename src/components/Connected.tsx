import { Box, Button, Card, Text } from '@0xsequence/design-system'
import { Hex } from 'viem'
import { useAccount, useDisconnect } from 'wagmi'

import { ItemsForSale } from './ItemsForSale'
import {
  NFT_TOKEN_ADDRESS,
  SALES_CONTRACT_ADDRESS,
  CHAIN_ID,
  salesCurrency
} from '../constants'

export const Connected = () => {
  const { address: userAddress } = useAccount()
  const { disconnect } = useDisconnect()

  const AddressDisplay = ({
    label,
    address
  }: { label: string; address: string | Hex | undefined }) => {
    return (
      <Box justifyContent="space-between">
        <Text variant="normal" color="text100" style={{ width: 205}}>
          {label}: &nbsp;
        </Text>
        <Text
          variant="normal"
          as="a"
          color="text100"
          href={`https://polygonscan.com/address/${address}`}
          target="_blank"
          rel="noreferrer "
        >
          {address}
        </Text>
      </Box>
    )
  }

  return (
    <Card justifyContent="center" alignItems="center" width="4" flexDirection="column" gap="3" style={{ width: 700 }}>
      <Box gap="1" flexDirection="column">
        <AddressDisplay label="User Address" address={userAddress} />
        <AddressDisplay label="Sales Contract" address={SALES_CONTRACT_ADDRESS} />
        <AddressDisplay label="NFT token Contract" address={NFT_TOKEN_ADDRESS} />
        <AddressDisplay label="Payment currency Address" address={salesCurrency.currencyAddress} />
      </Box>
      
      <ItemsForSale chainId={CHAIN_ID} collectionAddress={NFT_TOKEN_ADDRESS} />

      <Button label="Disconnect" onClick={disconnect} />
    </Card>
  )
}