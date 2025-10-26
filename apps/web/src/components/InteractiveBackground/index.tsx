import React, { useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'

const BackgroundCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -10;
  pointer-events: auto;
  background: ${({ theme }) => 
    theme.isDark 
      ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' 
      : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
  };
`

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  connections: number[]
}

interface InteractiveBackgroundProps {
  particleCount?: number
  maxDistance?: number
  particleSpeed?: number
  enableGlow?: boolean
  enableRipple?: boolean
}

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({
  particleCount = 80,
  maxDistance = 120,
  particleSpeed = 0.5,
  enableGlow = true,
  enableRipple = true, // eslint-disable-line @typescript-eslint/no-unused-vars
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, isActive: false })
  const animationRef = useRef<number>()
  const isDarkRef = useRef(false)
  const maxParticlesRef = useRef(particleCount + 50) // 允许额外50个粒子
  
  // 检测主题
  useEffect(() => {
    const updateTheme = () => {
      isDarkRef.current = document.documentElement.classList.contains('dark') || 
                          document.body.classList.contains('dark') ||
                          window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    updateTheme()
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateTheme)
    
    return () => mediaQuery.removeEventListener('change', updateTheme)
  }, [])

  // 初始化粒子
  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = []
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * particleSpeed,
        vy: (Math.random() - 0.5) * particleSpeed,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        connections: [],
      })
    }
    
    particlesRef.current = particles
  }, [particleCount, particleSpeed])

  // 绘制粒子
  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    const isDark = isDarkRef.current
    
    ctx.save()
    
    // 主粒�?    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
    
    if (enableGlow) {
      // 创建径向渐变
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * 3
      )
      
      if (isDark) {
        gradient.addColorStop(0, `rgba(139, 92, 246, ${particle.opacity})`)
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${particle.opacity * 0.5})`)
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)')
      } else {
        gradient.addColorStop(0, `rgba(59, 130, 246, ${particle.opacity})`)
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${particle.opacity * 0.5})`)
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
      }
      
      // eslint-disable-next-line no-param-reassign
      ctx.fillStyle = gradient
    } else {
      // eslint-disable-next-line no-param-reassign
      ctx.fillStyle = isDark 
        ? `rgba(139, 92, 246, ${particle.opacity})`
        : `rgba(59, 130, 246, ${particle.opacity})`
    }
    
    ctx.fill()
    ctx.restore()
  }, [enableGlow])

  // 绘制连线
  const drawConnection = useCallback((
    ctx: CanvasRenderingContext2D, 
    p1: Particle, 
    p2: Particle, 
    distance: number
  ) => {
    const isDark = isDarkRef.current
    const opacity = (1 - distance / maxDistance) * 0.5
    
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    // eslint-disable-next-line no-param-reassign
    ctx.strokeStyle = isDark 
      ? `rgba(139, 92, 246, ${opacity})` // 紫色连线 (深色主题)
      : `rgba(59, 130, 246, ${opacity})`  // 蓝色连线 (浅色主题)
    // eslint-disable-next-line no-param-reassign
    ctx.lineWidth = 1
    ctx.stroke()
  }, [maxDistance])

  // 更新粒子位置
  const updateParticles = useCallback((width: number, height: number) => {
    const particles = particlesRef.current
    const mouse = mouseRef.current
    
    particles.forEach((particle) => {
      // 更新位置
      // eslint-disable-next-line no-param-reassign
      particle.x += particle.vx
      // eslint-disable-next-line no-param-reassign
      particle.y += particle.vy
      
      // 边界检测
      // eslint-disable-next-line no-param-reassign
      if (particle.x < 0 || particle.x > width) particle.vx *= -1
      // eslint-disable-next-line no-param-reassign
      if (particle.y < 0 || particle.y > height) particle.vy *= -1
      
      // 鼠标交互
      if (mouse.isActive) {
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          const force = (100 - distance) / 100
          // eslint-disable-next-line no-param-reassign
          particle.vx += (dx / distance) * force * 0.01
          // eslint-disable-next-line no-param-reassign
          particle.vy += (dy / distance) * force * 0.01
        }
      }
      
      // 限制速度
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
      if (speed > particleSpeed * 2) {
        // eslint-disable-next-line no-param-reassign
        particle.vx = (particle.vx / speed) * particleSpeed * 2
        // eslint-disable-next-line no-param-reassign
        particle.vy = (particle.vy / speed) * particleSpeed * 2
      }
      
      // 保持在边界内
      // eslint-disable-next-line no-param-reassign
      particle.x = Math.max(0, Math.min(width, particle.x))
      // eslint-disable-next-line no-param-reassign
      particle.y = Math.max(0, Math.min(height, particle.y))
    })
  }, [particleSpeed])

  // 动画循环
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const { width, height } = canvas
    
    // 清空画布
    ctx.clearRect(0, 0, width, height)
    
    // 更新粒子
    updateParticles(width, height)
    
    const particles = particlesRef.current
    
    // 绘制连线
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < maxDistance) {
          drawConnection(ctx, particles[i], particles[j], distance)
        }
      }
    }
    
    // 绘制粒子
    particles.forEach((particle) => {
      drawParticle(ctx, particle)
    })
    
    animationRef.current = requestAnimationFrame(animate)
  }, [updateParticles, maxDistance, drawConnection, drawParticle])

  // 处理鼠标事件
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    mouseRef.current.x = event.clientX - rect.left
    mouseRef.current.y = event.clientY - rect.top
  }, [])

  const handleMouseEnter = useCallback(() => {
    mouseRef.current.isActive = true
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.isActive = false
  }, [])

  // 处理点击事件 - 创建三个新粒子
  const handleClick = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const clickY = event.clientY - rect.top
    
    const particles = particlesRef.current
    
    // 创建三个新粒子，围绕点击位置形成三角形
    const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3] // 120度间隔
    const radius = 25 // 距离点击位置的半径
    
    // 检查粒子数量限制
    if (particles.length < maxParticlesRef.current) {
      angles.forEach((angle) => {
        const offsetX = Math.cos(angle) * radius
        const offsetY = Math.sin(angle) * radius
        
        const newParticle: Particle = {
          x: clickX + offsetX,
          y: clickY + offsetY,
          vx: Math.cos(angle) * particleSpeed * 0.3, // 轻微向外运动
          vy: Math.sin(angle) * particleSpeed * 0.3,
          radius: Math.random() * 1.5 + 1.5, // 与现有粒子相似大小
          opacity: Math.random() * 0.6 + 0.4, // 与现有粒子相似透明度
          connections: [],
        }
        
        particles.push(newParticle)
      })
    } else {
      // 如果粒子太多，移除最老的3个粒子再添加新的
      particles.splice(0, 3)
      angles.forEach((angle) => {
        const offsetX = Math.cos(angle) * radius
        const offsetY = Math.sin(angle) * radius
        
        const newParticle: Particle = {
          x: clickX + offsetX,
          y: clickY + offsetY,
          vx: Math.cos(angle) * particleSpeed * 0.3,
          vy: Math.sin(angle) * particleSpeed * 0.3,
          radius: Math.random() * 1.5 + 1.5,
          opacity: Math.random() * 0.6 + 0.4,
          connections: [],
        }
        
        particles.push(newParticle)
      })
    }
    
    // 给附近的现有粒子添加向外的力（涟漪效果）
    const nearbyParticles = particles.filter(p => {
      const dx = p.x - clickX
      const dy = p.y - clickY
      return Math.sqrt(dx * dx + dy * dy) < 120
    })
    
    nearbyParticles.forEach(particle => {
      const dx = particle.x - clickX
      const dy = particle.y - clickY
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance > 0) {
        const force = (120 - distance) / 120
        // eslint-disable-next-line no-param-reassign
        particle.vx += (dx / distance) * force * 1.5
        // eslint-disable-next-line no-param-reassign
        particle.vy += (dy / distance) * force * 1.5
      }
    })
  }, [particleSpeed])

  // 处理窗口大小变化
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    // 重新初始化粒子（如果需要）
    if (particlesRef.current.length === 0) {
      initParticles(canvas.width, canvas.height)
    }
  }, [initParticles])

  // 初始化
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    
    // 设置画布大小
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    // 初始化粒子
    initParticles(canvas.width, canvas.height)
    
    // 开始动画
    animate()
    
    // 添加事件监听器
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseenter', handleMouseEnter)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('click', handleClick)
    window.addEventListener('resize', handleResize)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseenter', handleMouseEnter)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
    }
  }, [
    initParticles, 
    animate, 
    handleMouseMove, 
    handleMouseEnter, 
    handleMouseLeave, 
    handleClick, 
    handleResize
  ])

  return <BackgroundCanvas ref={canvasRef} />
}

export default InteractiveBackground


