import { useEffect, useRef } from 'react'
import { Paper, Text, ThemeIcon, Stack, Button } from '@mantine/core'
import { IconClock } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/LoginPage.module.css'
import pendingStyles from '../styles/PendingPage.module.css'

export function PendingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width = w
    canvas.height = h

    const PARTICLE_COUNT = 80
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    const CONNECTION_DIST = 140

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const grad = ctx.createLinearGradient(0, 0, w, h)
      grad.addColorStop(0, '#1a1d2e')
      grad.addColorStop(0.5, '#2d3142')
      grad.addColorStop(1, '#1e2035')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(176, 215, 255, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(234, 232, 255, ${p.opacity})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className={styles.root}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.content}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7h20L12 2z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className={styles.brandName}>RTS-CRM</h1>
          <p className={styles.brandTagline}>Relationships. Tracked. Scaled.</p>
        </div>

        <Paper className={styles.card} radius="lg" p="xl">
          <Stack align="center" gap="md">
            <ThemeIcon size={56} radius="xl" className={pendingStyles.icon}>
              <IconClock size={28} stroke={1.5} />
            </ThemeIcon>

            <Text fw={600} size="xl" className={styles.cardTitle} ta="center">
              Request Received
            </Text>

            <Text size="sm" className={styles.cardSubtitle} ta="center" lh={1.6}>
              Your account is pending approval. An administrator will review
              your request and grant access shortly.
            </Text>

            <Button
              variant="outline"
              size="sm"
              mt="xs"
              onClick={() => navigate('/login')}
              style={{
                borderColor: 'rgba(176, 215, 255, 0.3)',
                color: 'var(--color-blue-light)',
              }}
            >
              Back to sign in
            </Button>
          </Stack>
        </Paper>
      </div>
    </div>
  )
}