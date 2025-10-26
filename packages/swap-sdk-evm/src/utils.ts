import { type Address, getAddress } from 'viem'
import invariant from 'tiny-invariant'
import warning from 'tiny-warning'

// warns if addresses are not checksummed
export function validateAndParseAddress(address: string): Address {
  try {
    const checksummedAddress = getAddress(address)
    warning(address === checksummedAddress, `${address} is not checksummed.`)
    return checksummedAddress
  } catch (error) {
    invariant(false, `${address} is not a valid address.`)
    // This line will never be reached due to invariant throwing, but TypeScript needs it
    throw new Error(`${address} is not a valid address.`)
  }
}
