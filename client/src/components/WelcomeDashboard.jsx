import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const WelcomeDashboard = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Optimized configuration for smooth performance
        const particles = [];
        const particleCount = 100; // Reduced from 200
        const connectionDistance = 100; // Reduced for better performance
        const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
        let time = 0;

        // Optimized 3D Particle
        class Particle {
            constructor() {
                const angle = Math.random() * Math.PI * 2;
                const radius = 80 + Math.random() * 180;

                this.x = canvas.width / 2 + Math.cos(angle) * radius;
                this.y = canvas.height / 2 + Math.sin(angle) * radius * 0.6;
                this.z = Math.random() * 300 - 150; // Reduced depth range

                this.baseX = this.x;
                this.baseY = this.y;
                this.baseZ = this.z;

                this.vx = (Math.random() - 0.5) * 0.2;
                this.vy = (Math.random() - 0.5) * 0.2;

                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.5;
                this.hue = Math.random() * 40 + 180; // Cyan to blue range
            }

            update(time) {
                // Simplified motion
                this.x += this.vx;
                this.y += this.vy;

                // Gentle wave (simplified)
                this.y += Math.sin(time * 0.001 + this.baseX * 0.01) * 0.3;

                // Return to base
                this.x += (this.baseX - this.x) * 0.02;
                this.y += (this.baseY - this.y) * 0.02;
                this.z += (this.baseZ - this.z) * 0.02;

                // Mouse interaction (simplified)
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const force = (120 - distance) / 120;
                    this.x -= dx * force * 0.03;
                    this.y -= dy * force * 0.03;
                    this.z += force * 20;
                }

                // Simple 3D rotation
                const rotationSpeed = 0.0003;
                const centerX = canvas.width / 2;
                const relX = this.x - centerX;
                const relZ = this.z;

                this.x = centerX + relX * Math.cos(rotationSpeed) - relZ * Math.sin(rotationSpeed);
                this.z = relX * Math.sin(rotationSpeed) + relZ * Math.cos(rotationSpeed);
            }

            draw() {
                // 3D perspective
                const focalLength = 250;
                const scale = focalLength / (focalLength + this.z);
                const size = this.size * scale * 1.5;

                // Depth-based opacity
                const depthOpacity = (this.z + 150) / 300;
                const finalOpacity = this.opacity * scale * depthOpacity;

                // Simplified glow
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, size * 3);
                gradient.addColorStop(0, `hsla(${this.hue}, 100%, 60%, ${finalOpacity * 0.8})`);
                gradient.addColorStop(0.5, `hsla(${this.hue}, 80%, 50%, ${finalOpacity * 0.4})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, size * 3, 0, Math.PI * 2);
                ctx.fill();

                // Core
                ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${finalOpacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Mouse tracking
        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Optimized animation loop
        let animationId;
        function animate() {
            time++;

            // Clear with fade
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Sort by depth
            particles.sort((a, b) => b.z - a.z);

            // Update and draw
            particles.forEach(particle => {
                particle.update(time);
                particle.draw();
            });

            // Draw connections (optimized - check fewer particles)
            ctx.lineWidth = 0.8;
            for (let i = 0; i < particles.length; i++) {
                // Only check next 5 particles for connections (optimization)
                for (let j = i + 1; j < Math.min(i + 6, particles.length); j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = (1 - distance / connectionDistance) * 0.3;
                        const dz = Math.abs(particles[i].z - particles[j].z);
                        const depthFade = (300 - dz) / 300;

                        ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * depthFade})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animate);
        }

        animate();

        // Resize handler
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden">
            {/* Optimized Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{
                    background: 'radial-gradient(ellipse at center, #0a0a1f 0%, #000000 100%)'
                }}
            />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="z-10 text-center px-4 md:px-6"
            >
                <motion.h1
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    style={{
                        textShadow: '0 0 30px rgba(6, 182, 212, 0.6), 0 0 60px rgba(139, 92, 246, 0.3)'
                    }}
                >
                    <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        TECHNEXUS
                    </span>
                </motion.h1>

                <motion.p
                    className="text-xl sm:text-2xl md:text-3xl text-cyan-300 mb-8 font-bold tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    style={{ textShadow: '0 0 15px rgba(6, 182, 212, 0.5)' }}
                >
                    One Platform. All Opportunities.
                </motion.p>

                <motion.p
                    className="text-base sm:text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    The ultimate hub for tech students. Innovate. Collaborate. Dominate.
                </motion.p>

                <motion.button
                    whileHover={{
                        scale: 1.08,
                        boxShadow: "0 0 40px rgba(6,182,212,0.6)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/dashboard')}
                    className="px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-2xl font-bold text-lg tracking-widest transition-all shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    style={{ border: '2px solid rgba(6, 182, 212, 0.4)' }}
                >
                    ENTER SYSTEM
                </motion.button>

                <motion.p
                    className="text-xs text-cyan-400/60 mt-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    ✨ Move your mouse to interact with the 3D particles ✨
                </motion.p>
            </motion.div>

            {/* Simplified ambient effects */}
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
    );
};

export default WelcomeDashboard;
