document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if(loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }
    }, 2000); 
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorOutline = document.querySelector('.custom-cursor-outline');
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        if (cursorDot && cursorOutline) {
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            setTimeout(() => {
                cursorOutline.style.left = `${posX}px`;
                cursorOutline.style.top = `${posY}px`;
            }, 50);
        }
    });
    document.querySelectorAll('a, button, .card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorOutline) cursorOutline.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            if (cursorOutline) cursorOutline.classList.remove('hover');
        });
    });
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
    const canvas = document.getElementById('cyber-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.radius = Math.random() * 2 + 1;
                this.color = Math.random() > 0.5 ? '#00f3ff' : '#ff003c';
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }
        function initParticles() {
            particles = [];
            const particleCount = Math.floor((width * height) / 15000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist/150})`;
                        if (particles[i].color === particles[j].color) {
                            const hex = particles[i].color;
                            const r = parseInt(hex.slice(1, 3), 16);
                            const g = parseInt(hex.slice(3, 5), 16);
                            const b = parseInt(hex.slice(5, 7), 16);
                            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(1 - dist/150) * 0.5})`;
                        } else {
                            ctx.strokeStyle = `rgba(100, 100, 100, ${(1 - dist/150) * 0.2})`;
                        }
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        initParticles();
        animateParticles();
    }
    const hudDashboard = document.querySelector(".hud-dashboard");
    if (hudDashboard) {
        const bars = hudDashboard.querySelectorAll('.hud-animate');
        const dataStream = document.getElementById('data-stream');
        let streamInterval;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                    if (!streamInterval && dataStream) {
                        streamInterval = setInterval(() => {
                            const chars = '0123456789ABCDEF';
                            let hexString = '0x';
                            for(let i=0; i<8; i++) hexString += chars[Math.floor(Math.random() * chars.length)];
                            const texts = [
                                `[OK] BLOCK_CHAIN_SYNC: ${hexString}`,
                                `[!] ANOMALY_DETECTED: OFFSET_0x00A`,
                                `[>>] PARSING_DATA_STREAM...`,
                                `[OK] NEURAL_HANDSHAKE_ESTABLISHED`,
                                `[..] RECALIBRATING_SENSORS...`,
                                `[OK] SECTOR_7G_SECURE: ${hexString}`
                            ];
                            const p = document.createElement('div');
                            p.innerText = '> ' + texts[Math.floor(Math.random() * texts.length)];
                            p.style.color = Math.random() > 0.8 ? '#ff003c' : (Math.random() > 0.5 ? '#00f3ff' : '#fff');
                            dataStream.appendChild(p);
                            if (dataStream.children.length > 10) {
                                dataStream.removeChild(dataStream.firstChild);
                            }
                        }, 200);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(hudDashboard);
    }
    const title = document.querySelector('.glitch-title');
    if (title) {
        const originalText = title.getAttribute('data-text');
        const chars = '!<>-_\\/[]{}—=+*^?#_';
        title.addEventListener('mouseover', () => {
            let iterations = 0;
            const interval = setInterval(() => {
                title.innerText = title.innerText.split('')
                    .map((letter, index) => {
                        if(index < iterations) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)]
                    })
                    .join('');
                if(iterations >= originalText.length) {
                    clearInterval(interval);
                }
                iterations += 1 / 3;
            }, 30);
        });
    }
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'neon') {
                document.documentElement.removeAttribute('data-theme');
                themeToggleBtn.innerText = 'NEON MODE';
            } else {
                document.documentElement.setAttribute('data-theme', 'neon');
                themeToggleBtn.innerText = 'STEALTH MODE';
            }
        });
    }
});

