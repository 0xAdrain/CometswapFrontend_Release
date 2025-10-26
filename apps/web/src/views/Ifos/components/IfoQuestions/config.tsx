import { ReactNode } from 'react'

export interface IfoQuestion {
  id: string
  question: string
  answer: ReactNode
}

export const ifoQuestions: IfoQuestion[] = [
  {
    id: '1',
    question: 'What is an IFO?',
    answer: 'An Initial Farm Offering (IFO) is a fundraising method where new tokens are offered through farming mechanisms.',
  },
  {
    id: '2', 
    question: 'How do I participate in an IFO?',
    answer: 'Connect your wallet and follow the participation instructions for each IFO event.',
  },
]