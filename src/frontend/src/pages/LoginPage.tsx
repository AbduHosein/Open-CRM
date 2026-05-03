import { useEffect, useRef, useState } from 'react'
import { Paper, Text, Divider, Center, LoadingOverlay, Stack, Button } from '@mantine/core'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/LoginPage.module.css'

export function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

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

            // Subtle gradient background
            const grad = ctx.createLinearGradient(0, 0, w, h)
            grad.addColorStop(0, '#1a1d2e')
            grad.addColorStop(0.5, '#2d3142')
            grad.addColorStop(1, '#1e2035')
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, w, h)

            // Move particles
            for (const p of particles) {
                p.x += p.vx
                p.y += p.vy
                if (p.x < 0) p.x = w
                if (p.x > w) p.x = 0
                if (p.y < 0) p.y = h
                if (p.y > h) p.y = 0
            }

            // Draw connections
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

            // Draw particles
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
                {/* Branding left side */}
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7h20L12 2z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h1 className={styles.brandName}>RTS-CRM</h1>
                    <p className={styles.brandTagline}>
                        Relationships. Tracked. Scaled.
                    </p>
                    <ul className={styles.featureList}>
                        <li className={styles.featureItem}>
                            <span className={styles.dot} />
                            Manage leads from first contact to close
                        </li>
                        <li className={styles.featureItem}>
                            <span className={styles.dot} />
                            Track clients, projects, and follow-ups
                        </li>
                        <li className={styles.featureItem}>
                            <span className={styles.dot} />
                            Real-time analytics across your pipeline
                        </li>
                    </ul>
                </div>

                {/* Login card right side */}
                <Paper className={styles.card} radius="lg" p="xl" pos="relative">
                    <LoadingOverlay
                        visible={loading}
                        loaderProps={{ color: 'icyBlue', type: 'bars' }}
                        overlayProps={{ blur: 4, backgroundOpacity: 0.3 }}
                    />

                    <Text className={styles.cardTitle} fw={600} size="xl" mb={4}>
                        Welcome back
                    </Text>
                    <Text className={styles.cardSubtitle} size="sm" mb="xl">
                        Sign in to your RTS-CRM account
                    </Text>

                    <Center mb="md">
                        <GoogleLogin
                            onSuccess={async (response) => {
                                if (response.credential) {
                                    setLoading(true)
                                    setError(null)
                                    try {
                                        const result = await login(response.credential)
                                        if (result === 'approved') navigate('/home')
                                        if (result === 'pending') navigate('/pending')
                                        if (result === 'rejected') setError('Your account request has been rejected. Contact your administrator.')
                                    } catch {
                                        setError('Login failed. You may not have an authorized account.')
                                    } finally {
                                        setLoading(false)
                                    }
                                }
                            }}
                            onError={() => setError('Google sign-in failed. Please try again.')}
                        />
                    </Center>

                    {error && (
                        <Text ta="center" size="xs" c="red" mt="sm">
                            {error}
                        </Text>
                    )}

                    <Divider
                        label="Secure SSO via Google"
                        labelPosition="center"
                        my="md"
                        styles={{ label: { color: 'var(--text-secondary)', fontSize: 11, opacity: 0.7 } }}
                    />

                    <Text ta="center" size="xs" className={styles.footerNote}>
                        Access is restricted to authorized accounts only.
                        <br />
                        Contact your administrator to request access.
                    </Text>
                </Paper>
            </div>
        </div>
    )
}