import { Box, Button, Card, Image, Text } from '@0xsequence/design-system'
import { useOpenConnectModal } from '@0xsequence/kit'
import { useCheckoutModal, CheckoutSettings } from '@0xsequence/kit-checkout'
import { encodeFunctionData, Hex, toHex } from 'viem'
import { useAccount, useDisconnect, usePublicClient, useWalletClient } from 'wagmi'

import { SALES_CONTRACT_ABI } from './utils/abi'

const nftTokenAddress = '0xa80f129750d800711372541122754a53d6716f55'
const salesContractAddress = '0xdf96ab1fb12fe800fb1a64836c1949e2c162e830'
const currencyAddress = '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359'

function App() {
  const { address: userAddress, isConnected  } = useAccount()
  const { setOpenConnectModal } = useOpenConnectModal()
  const { disconnect } = useDisconnect()
  const { triggerCheckout } = useCheckoutModal()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const onClickBuy = () => {
    if (!publicClient || !walletClient || !userAddress) {
      return
    }

    const currencyPrice = '100000'

    /**
     * Mint tokens.
     * @param to Address to mint tokens to.
     * @param tokenIds Token IDs to mint.
     * @param amounts Amounts of tokens to mint.
     * @param data Data to pass if receiver is contract.
     * @param expectedPaymentToken ERC20 token address to accept payment in. address(0) indicates ETH.
     * @param maxTotal Maximum amount of payment tokens.
     * @param proof Merkle proof for allowlist minting.
     * @notice Sale must be active for all tokens.
     * @dev tokenIds must be sorted ascending without duplicates.
     * @dev An empty proof is supplied when no proof is required.
     */

    const calldata = encodeFunctionData({
      abi: SALES_CONTRACT_ABI,
      functionName: 'mint',
      args: [
        userAddress,
        [BigInt(1)],
        [BigInt(1)],
        toHex(0),
        currencyAddress,
        BigInt(currencyPrice),
        [toHex(0, { size: 32 })],
      ]
    })

    // https://dev.sequence.build/project/424/contracts/1088?view=read
    const checkoutSettings: CheckoutSettings = {
      creditCardCheckout: {
        chainId: 137,
        contractAddress: salesContractAddress,
        recipientAddress: userAddress || '',
        currencyQuantity: currencyPrice,
        currencySymbol: 'USDC',
        currencyAddress,
        currencyDecimals: '6',
        nftId: '1',
        nftAddress: nftTokenAddress,
        nftQuantity: '1',
        nftDecimals: '0',
        approvedSpenderAddress: salesContractAddress,
        calldata,
        isDev: location.hostname === "localhost",
        onSuccess: async (txnHash) => {
          await publicClient?.waitForTransactionReceipt({
            hash: txnHash as Hex,
            confirmations: 5
          })
        },
        onError: error => {
          console.error(error)
        }
      }
    }
    
    triggerCheckout(checkoutSettings)
  }

  const Header = () => {
    return (
      <>
        <Text as="h2" variant="lg" color="text100" marginBottom="0">NFT Checkout Demo</Text>
        <Image src="sequence-icon-cropped.png" style={{ width: 100 }} />
        <Box marginTop="5" marginBottom="4" style={{ width: 600 }}>
          <Text color="text100">This demo has been built using the &nbsp;
            <Text 
              color="text100"
              as="a"
              href={
                "https://sequence.build"
              }
              target="_blank"
              rel="noreferrer "
            >
              Sequence Builer
            </Text> &nbsp;, used to create an NFT collection and an associated sales contract to mint new tokens. It demonstrates the ability to make purchases using a credit card.
          </Text>
        </Box>
      </>
    )
  }

  const Footer = () => {
    return (
      <Box>
        <Text color="text100" variant="small">
        Want to learn more? Read the{" "}
        <Text
          color="text100"
          as="a"
          href={
            "https://docs.sequence.xyz/"
          }
          target="_blank"
          rel="noreferrer "
        >
          docs
        </Text>
        !
      </Text>
    </Box>
    )
  }

  const Content = () => {
    if (!isConnected) {
      return (
        <Card justifyContent="center" alignItems="center" flexDirection="column" gap="3" style={{ width: 700 }}>
          <Text color="text100">Not Connected</Text>
          <Button label="Connect" onClick={() => setOpenConnectModal(true)} />
        </Card>
      )
    }

    const AddressDisplay = ({
      label,
      address
    }: { label: string; address: string | Hex | undefined }) => {

      return (
        <Box justifyContent="space-between">
          <Text color="text100">
            {label}: &nbsp;
          </Text>
          <Text
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
          <AddressDisplay label="Sales Contract" address={salesContractAddress} />
          <AddressDisplay label="NFT token Contract" address={nftTokenAddress} />
          <AddressDisplay label="Payment currency Address" address={currencyAddress} />
        </Box>

        <Button label="Buy With Credit Card" onClick={onClickBuy} />
        <Button label="Disconnect" onClick={disconnect} />
      </Card>
    )
  }

  return (
    <Box justifyContent="center" alignItems="center" width="full" gap="2" flexDirection="column" background="backgroundPrimary" style={{ height: '100vh' }}>
      <Header />
      <Content />
      <Footer />
    </Box>
  )
}

export default App
