document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('main-card');
    const glow = document.getElementById('glow');
    
    // Interactive mouse glow effect on the card
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        glow.style.opacity = '1';
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
        
        // Subtle 3D tilt effect
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
        const rotateY = ((x - centerX) / centerX) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
    
    // Background particle generation
    const container = document.getElementById('particle-container');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 4 + 1;
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        container.appendChild(particle);
        
        // Animate floating
        animateParticle(particle, duration, delay);
    }
    
    function animateParticle(particle, duration, delay) {
        // Random drift
        const targetX = parseFloat(particle.style.left) + (Math.random() * 200 - 100);
        const targetY = parseFloat(particle.style.top) - (Math.random() * 200 + 100);
        
        particle.animate([
            { transform: 'translate(0, 0)', opacity: Math.random() * 0.5 + 0.1 },
            { transform: `translate(${targetX - parseFloat(particle.style.left)}px, ${targetY - parseFloat(particle.style.top)}px)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            iterations: Infinity,
            easing: 'linear'
        });
    }
});
