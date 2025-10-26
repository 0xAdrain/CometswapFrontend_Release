import { GameType, GenreType, PostersItemDataType, PostersLayout, TrendingTagType } from '../../types'

export const example: GameType = {
  id: 'comet-protectors',
  projectName: 'Mobox',
  title: 'Comet Protector',
  subTitle: 'Unlock the Power of COMETand Perks for Comet Squad and Bunnies Holders',
  description:
    'CometSwap and Mobox joined forces to launch a tower-defense and PvP game tailored for GameFi players, as well as COMET, Comet Squad, and Bunnies holders.',
  publishDate: 1698044972,
  genre: GenreType.TowerDefense,
  trendingTags: [
    TrendingTagType.Strategy,
    TrendingTagType.CometSquadNFT,
    TrendingTagType.CometBunniesNFT,
    TrendingTagType.TowerDefense,
    TrendingTagType.Multiplayer,
    TrendingTagType.veCometToken,
  ],
  headerImage: 'https://cometprotectors.io/assets/cometswap-game-landing/header.jpeg',
  headerIconImage: {
    desktop: 'https://cometprotectors.io/assets/cometswap-game-landing/desktop-header-icon.png',
    mobile: 'https://cometprotectors.io/assets/cometswap-game-landing/mobile-header-icon.png',
  },
  projectLogo: {
    lightTheme: 'https://cometprotectors.io/assets/cometswap-game-landing/project-logo-light-theme.png',
    darkTheme: 'https://cometprotectors.io/assets/cometswap-game-landing/project-logo-dark-theme.png',
  },
  projectCircleLogo: {
    lightTheme: 'https://cometprotectors.io/assets/cometswap-game-landing/mobox-circle-logo.png',
    darkTheme: 'https://cometprotectors.io/assets/cometswap-game-landing/mobox-circle-logo.png',
  },
  gameLink: {
    playNowLink: 'https://cometprotectors.io/',
  },
  posters: {
    layout: PostersLayout.Vertical,
    items: [
      {
        type: PostersItemDataType.Image,
        image: 'https://cometprotectors.io/assets/cometswap-game-landing/1.png',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://cometprotectors.io/assets/cometswap-game-landing/2.jpg',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://cometprotectors.io/assets/cometswap-game-landing/3.png',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://cometprotectors.io/assets/cometswap-game-landing/4.png',
      },
    ],
  },
  playlist: [
    {
      videoId: '--UcFQ64sjY',
      title: 'Comet Protectors is here! Discover the power of COMETand perks for Comet Squads and Bunnies',
    },
    {
      videoId: '-KViZLhrVE4',
      title: 'Comet Protectors 2 Minute Guide For BEGINNERS | EP 4 Using COMETin the game',
    },
    {
      videoId: '0L8bPhzT-xU',
      title: 'Comet Protectors is here! Discover the power of COMETand perks for Comet Squads and Bunnies',
    },
    {
      videoId: '3gbxF8-eBAg',
      title: 'Comet Protectors Explained in 2 Minutes For BEGINNERS | EP 1: From Connection to Conquest',
    },
    {
      videoId: '--UcFQ64sjY',
      title: 'Comet Protectors is here! Discover the power of COMETand perks for Comet Squads and Bunnies',
    },
    {
      videoId: 'w72vcEV1pcE',
      title: 'Comet Protectors Explained in 2 Minutes For BEGINNERS | EP 1.1: From Connection to Conquest',
    },
  ],
  socialMedia: {
    telegram: 'https://t.me/CometSwap/2991960',
    discord: 'https://discord.gg/cometswap',
  },
}
