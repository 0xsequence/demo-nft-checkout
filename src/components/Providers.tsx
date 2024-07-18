import React from 'react'

import { ThemeProvider } from '@0xsequence/design-system'
import { KitProvider } from '@0xsequence/kit'
import { getDefaultConnectors } from '@0xsequence/kit-connectors'
import { KitCheckoutProvider } from '@0xsequence/kit-checkout'
import { ChainId } from '@0xsequence/network'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Transport, zeroAddress } from 'viem'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { mainnet, polygon, Chain } from 'wagmi/chains'
import { sign } from 'viem/accounts'

const queryClient = new QueryClient()

export const Providers = ({
  children
}: { children: React.ReactNode }) => {
  const projectAccessKey = 'AQAAAAAAAEGvyZiWA9FMslYeG_yayXaHnSI'

  const connectors = getDefaultConnectors({
    walletConnectProjectId: 'c65a6cb1aa83c4e24500130f23a437d8',
    defaultChainId: ChainId.POLYGON,
    appName: 'demo app',
    projectAccessKey
  })

  const chains = [polygon] as [Chain, ...Chain[]]
  const transports = chains.reduce<Record<number, Transport>>((acc, chain) => {
    acc[chain.id] = http()
    return acc
  }, {})

  const wagmiConfig = createConfig({
    transports,
    chains,
    connectors
  })

  const kitConfig = {
    projectAccessKey,
    signIn: {
      projectName: 'Demo'
    }
  }

  return (
    <ThemeProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <KitProvider config={kitConfig}>
              <KitCheckoutProvider>{children}</KitCheckoutProvider>
          </KitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}