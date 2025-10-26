let swapSound: HTMLAudioElement

const swapSoundURL = 'https://cdn.cometswap.com/swap.mp3'

export const getSwapSound = () => {
  if (!swapSound) {
    swapSound = new Audio(swapSoundURL)
  }
  return swapSound
}

