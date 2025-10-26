import { ReactNode } from 'react'

export interface IdoQuestion {
  id: string
  question: string
  answer: ReactNode
}

export const idoQuestions: IdoQuestion[] = [
  {
    id: '1',
    question: 'What is an IDO?',
    answer: 'An Initial DEX Offering (IDO) is a fundraising method where new tokens are offered through a decentralized exchange.',
  },
  {
    id: '2', 
    question: 'How do I participate?',
    answer: 'Connect your wallet and follow the participation instructions for each IDO.',
  },
]