import { Box, Button, Text } from '@0xsequence/design-system'
import { useOpenConnectModal } from '@0xsequence/kit'
import { useAccount, useDisconnect } from 'wagmi'

function App() {
  const { address, isConnected  } = useAccount()
  const { setOpenConnectModal } = useOpenConnectModal()
  const { disconnect } = useDisconnect()

  if (!isConnected) {
    return (
      <Box height="full" width="full" gap="2" flexDirection="column" background="backgroundPrimary">
        <Text color="text100">Not Connected</Text>
        <Button label="Connect" onClick={() => setOpenConnectModal(true)} />
      </Box>
    )
  }

  return (
    <Box height="full" width="full" gap="2" flexDirection="column" background="backgroundPrimary">
      <Text color="text100">Address: {address}</Text>
      <Button label="Buy With Credit Card" />
      <Button label="Disconnect" onClick={disconnect} />
    </Box>
  )
}

export default App
