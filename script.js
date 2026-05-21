document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader-wrapper');
        if (loader) loader.style.display = 'none';
    });

    // 2. Typing Effect
    const typingText = document.querySelector('.typing-text');
    const roles = ['Computer Engineer', 'Web Developer', 'UI/UX Enthusiast'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 100 : 200;
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    }
    if (typingText) type();

    // 3. Sticky Navbar & Active Links
    const nav = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // 4. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }

    // 5. Reveal Animation
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 6. Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const icon = themeBtn.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // 7. Hero Canvas Particles
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particles = [];
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
            }
            update() {
                this.x += this.speedX; this.y += this.speedY;
                if (this.x > canvas.width) this.x = 0; if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0; if (this.y < 0) this.y = canvas.height;
            }
            draw() {
                ctx.fillStyle = 'rgba(0, 210, 255, 0.3)';
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
            }
        }
        for (let i = 0; i < 50; i++) particles.push(new Particle());
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // 9. Contact Form Submission (AJAX)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const button = contactForm.querySelector('button');
            const originalText = button.textContent;
            
            button.disabled = true;
            button.textContent = 'Sending...';

            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                alert('Thank you! Your message has been sent directly to Syukie.');
                contactForm.reset();
            } else {
                const data = await response.json();
                if (data.errors) {
                    alert(data.errors.map(error => error.message).join(", "));
                } else {
                    alert('Oops! There was a problem. Ensure you replaced YOUR_FORM_ID in Index.html and verified your email with Formspree.');
                }
            }
            button.disabled = false;
            button.textContent = originalText;
        });
    }

    // 8. PDF Generation (Auto-generate CV from Portfolio content)
    const downloadBtn = document.getElementById('download-cv');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // Create a temporary container for PDF content
            const element = document.createElement('div');
            element.style.padding = '30px';
            element.style.color = '#1e293b';
            element.style.background = '#ffffff';
            element.style.width = '210mm'; // Standard width to maintain layout

            // Add Professional Header
            element.innerHTML = `
                <h1 style="color: #3a7bd5; margin-bottom: 5px;">Syukie Ayog Oda</h1>
                <p style="margin-bottom: 20px;">Computer Engineer | ayogsyukie@gmail.com</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;">
            `;

            // Clone relevant sections to include in the PDF
            ['about', 'skills', 'experience'].forEach(id => {
                const section = document.getElementById(id).cloneNode(true);
                
                // Optimize layout for PDF
                section.style.marginBottom = '15px';
                section.style.padding = '0';
                
                const title = section.querySelector('.section-title');
                if (title) {
                    title.style.fontSize = '1.4rem';
                    title.style.marginBottom = '10px';
                    title.style.textAlign = 'left';
                }

                if (id === 'about') {
                    const img = section.querySelector('img');
                    if (img) img.style.width = '120px'; // Smaller profile picture
                    const grid = section.querySelector('.about-grid');
                    if (grid) {
                        grid.style.display = 'flex';
                        grid.style.gap = '20px';
                    }
                }

                if (id === 'skills') {
                    const container = section.querySelector('.skills-grid');
                    if (container) {
                        container.style.gridTemplateColumns = 'repeat(3, 1fr)';
                        container.style.gap = '10px';
                    }
                    section.querySelectorAll('.skill-card').forEach(card => {
                        card.style.padding = '10px';
                        card.style.background = '#f1f5f9';
                        card.style.color = '#1e293b';
                        card.style.textDecoration = 'none';
                    });
                }

                // Ensure content is visible (reveal classes usually hide things initially)
                section.querySelectorAll('.reveal').forEach(el => {
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                });
                element.appendChild(section);
            });

            const opt = {
                margin: 10,
                filename: 'CV_Syukie_Ayog_Oda.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true },
                jsPDF: { unit: 'mm', format: 'legal', orientation: 'portrait' },
                pagebreak: { mode: 'avoid-all' } // Keeps everything on one page if possible
            };

            // Generate and Download
            html2pdf().set(opt).from(element).save();
        });
    }
});