import React, { ReactNode, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

interface PageTransitionProps {
  children: ReactNode
}

// CometSwap: 检测移动端
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}

// CometSwap: 移动端滑动切换动�?- 类似原生APP体验
const mobilePageVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0.8,
  }),
  in: {
    x: 0,
    opacity: 1,
  },
  out: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0.8,
  }),
}

// CometSwap: 桌面端淡入淡出动画
const desktopPageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
}

const mobileTransition = {
  type: 'tween',
  ease: [0.25, 0.46, 0.45, 0.94], // iOS风格缓动
  duration: 0.35,
}

const desktopTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
}

// CometSwap: 路由优先级映�?- 更精确的方向判断
const routePriority: Record<string, number> = {
  '/': 0,
  '/swap': 1,
  '/buy-crypto': 2,
  '/liquidity': 3,
  '/farms': 4,
  '/pools': 5,
  '/info': 6,
  '/nfts': 7,
  '/lottery': 8,
  '/prediction': 9,
  '/trading-competition': 10,
}

const getRoutePriority = (path: string): number => {
  // 精确匹配
  if (routePriority[path] !== undefined) {
    return routePriority[path]
  }
  
  // 前缀匹配
  for (const [route, priority] of Object.entries(routePriority)) {
    if (path.startsWith(route) && route !== '/') {
      return priority
    }
  }
  
  return 999 // 未知路由
}

const getRouteDirection = (from: string, to: string): number => {
  const fromPriority = getRoutePriority(from)
  const toPriority = getRoutePriority(to)
  
  return toPriority > fromPriority ? 1 : -1
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [direction, setDirection] = useState(1)
  const [prevPath, setPrevPath] = useState(router.asPath)

  useEffect(() => {
    if (prevPath !== router.asPath) {
      setDirection(getRouteDirection(prevPath, router.asPath))
      setPrevPath(router.asPath)
    }
  }, [router.asPath, prevPath])

  const variants = isMobile ? mobilePageVariants : desktopPageVariants
  const transition = isMobile ? mobileTransition : desktopTransition

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={router.asPath}
        custom={direction}
        initial="initial"
        animate="in"
        exit="out"
        variants={variants}
        transition={transition}
        style={{
          width: '100%',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden', // 防止移动端滑动时出现滚动条
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition



