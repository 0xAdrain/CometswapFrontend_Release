import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface AnimatedLayoutProps {
  children: ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  duration?: number
}

// CometSwap: 通用动画 Layout 组件
const getVariants = (direction: 'left' | 'right' | 'up' | 'down') => {
  const directionMap = {
    right: { x: 100, y: 0 },
    left: { x: -100, y: 0 },
    down: { x: 0, y: 100 },
    up: { x: 0, y: -100 },
  }

  const { x, y } = directionMap[direction]

  return {
    initial: {
      opacity: 0,
      x,
      y,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      x: -x,
      y: -y,
      scale: 1.05,
    },
  }
}

const AnimatedLayout: React.FC<AnimatedLayoutProps> = ({ 
  children, 
  direction = 'right',
  duration = 0.4 
}) => {
  const variants = getVariants(direction)
  
  const transition = {
    type: 'tween' as const,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
    duration,
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      style={{
        width: '100%',
        minHeight: '100vh',
      }}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedLayout















