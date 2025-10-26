import { ReactNode } from 'react'

export interface FaqItem {
  question: string
  answer: ReactNode
}

export const BnbSnbnbFaq: FaqItem[] = [
  {
    question: 'What is BNB Liquid Staking?',
    answer: 'BNB Liquid Staking allows you to stake your BNB and receive liquid staking tokens that can be used in DeFi while earning staking rewards.',
  },
  {
    question: 'How does it work?',
    answer: 'When you stake BNB, you receive snBNB tokens that represent your staked position. These tokens can be traded or used in other protocols.',
  },
  {
    question: 'What are the risks?',
    answer: 'Liquid staking involves smart contract risks, validator risks, and potential slashing conditions. Please understand these risks before participating.',
  },
]