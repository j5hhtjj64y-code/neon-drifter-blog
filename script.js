// ========================
// NEON DRIFTER - Cyberpunk Blog Script
// ========================

// 粒子背景系统
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 80;
        this.connectionDistance = 120;
        this.maxConnections = 3;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 0.5,
                color: Math.random() > 0.5 ? '#00f0ff' : '#ff00a0'
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新和绘制粒子
        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            
            // 边界反弹
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
            
            // 绘制连线
            let connections = 0;
            for (let j = i + 1; j < this.particles.length; j++) {
                if (connections >= this.maxConnections) break;
                
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.connectionDistance) {
                    const opacity = (1 - dist / this.connectionDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                    connections++;
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// 数字计数器动画
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-num[data-target]');
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => this.observer.observe(counter));
    }
    
    animate(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // easeOutExpo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(ease * target);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }
}

// 滚动显示动画
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.post-card, .gallery-item, .about-card, .donate-card');
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(el);
        });
    }
}

// 光标跟随效果
class CursorGlow {
    constructor() {
        this.glow = document.querySelector('.cursor-glow');
        if (!this.glow || window.matchMedia('(pointer: coarse)').matches) return;
        
        this.glow.style.opacity = '0';
        
        document.addEventListener('mousemove', (e) => {
            this.glow.style.left = e.clientX + 'px';
            this.glow.style.top = e.clientY + 'px';
            this.glow.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            this.glow.style.opacity = '0';
        });
    }
}

// 导航栏滚动效果
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                this.navbar.style.background = 'rgba(5, 5, 8, 0.95)';
                this.navbar.style.backdropFilter = 'blur(20px)';
            } else {
                this.navbar.style.background = 'rgba(5, 5, 8, 0.85)';
            }
            
            this.lastScroll = currentScroll;
        });
    }
}

// ========================
// 全局函数
// ========================

// 移动端菜单切换
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('active');
}

// 画廊标签切换
function switchTab(type) {
    const photoGrid = document.getElementById('galleryPhotos');
    const videoGrid = document.getElementById('galleryVideos');
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    if (type === 'photos') {
        photoGrid.classList.remove('hidden');
        videoGrid.classList.add('hidden');
    } else {
        photoGrid.classList.add('hidden');
        videoGrid.classList.remove('hidden');
    }
}

// 打赏功能
let selectedAmount = 50;

function selectAmount(amount) {
    selectedAmount = amount;
    
    // 更新选中状态
    document.querySelectorAll('.donate-card').forEach(card => {
        card.style.borderColor = '';
        card.style.boxShadow = '';
    });
    
    event.currentTarget.style.borderColor = 'var(--neon-cyan)';
    event.currentTarget.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.2)';
    
    // 显示支付区域
    const paymentSection = document.getElementById('paymentSection');
    paymentSection.style.display = 'block';
    document.getElementById('qrDisplay').style.display = 'none';
    
    // 滚动到支付区域
    paymentSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function donateCustom() {
    const input = document.getElementById('customAmount');
    const amount = parseInt(input.value);
    
    if (!amount || amount < 1) {
        alert('请输入有效的金额');
        return;
    }
    
    selectedAmount = amount;
    
    // 显示支付区域
    const paymentSection = document.getElementById('paymentSection');
    paymentSection.style.display = 'block';
    document.getElementById('qrDisplay').style.display = 'none';
    
    paymentSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showQR(method) {
    const qrDisplay = document.getElementById('qrDisplay');
    const qrPlaceholder = document.getElementById('qrPlaceholder');
    const qrAmount = document.getElementById('qrAmount');
    
    qrDisplay.style.display = 'block';
    qrAmount.textContent = `金额：¥${selectedAmount}`;
    
    // 更新二维码占位符样式
    if (method === 'wechat') {
        qrPlaceholder.style.borderColor = '#07C160';
        qrPlaceholder.innerHTML = '<span style="font-size: 3rem;">💚</span><p style="color: #07C160;">微信收款码</p>';
    } else {
        qrPlaceholder.style.borderColor = '#1677FF';
        qrPlaceholder.innerHTML = '<span style="font-size: 3rem;">💙</span><p style="color: #1677FF;">支付宝收款码</p>';
    }
    
    qrDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closePayment() {
    document.getElementById('paymentSection').style.display = 'none';
}

// 点击导航链接关闭移动端菜单
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navMenu').classList.remove('active');
    });
});

// ========================
// 初始化
// ========================
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
    new CounterAnimation();
    new ScrollReveal();
    new CursorGlow();
    new NavbarScroll();
    
    // 添加打字机效果给 hero tag
    const heroTag = document.querySelector('.hero-tag');
    if (heroTag) {
        const text = heroTag.textContent;
        heroTag.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                heroTag.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    }
    
    // 添加随机闪烁效果给状态指示器
    const indicator = document.querySelector('.status-indicator');
    if (indicator) {
        setInterval(() => {
            if (Math.random() > 0.9) {
                indicator.style.opacity = '0.3';
                setTimeout(() => {
                    indicator.style.opacity = '1';
                }, 100);
            }
        }, 2000);
    }
});

// 控制台彩蛋
console.log('%c⚡ NEON DRIFTER SYSTEM ONLINE ⚡', 
    'color: #00f0ff; font-size: 20px; font-family: monospace; font-weight: bold;');
console.log('%c欢迎来到霓虹废土。这里是赛博朋克博客系统 v1.0', 
    'color: #ff00a0; font-size: 12px; font-family: monospace;');
console.log('%c在赛博空间里，没有人知道你是一条狗 🐕', 
    'color: #8888aa; font-size: 11px; font-family: monospace; font-style: italic;');
