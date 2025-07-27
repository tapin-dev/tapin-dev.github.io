// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all interactive features
    initSmoothScrolling();
    initNavbarEffects();
    initScrollAnimations();
    initFormHandling();
    initInteractiveElements();
    initMobileMenu();
    initParallaxEffects();
    
    console.log('TapIn website initialized successfully!');
    
    // Smooth scrolling for navigation links
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link, a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Only handle internal links that start with #
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const navbarHeight = document.querySelector('.navbar').offsetHeight || 80;
                        const targetPosition = targetElement.offsetTop - navbarHeight;
                        
                        // Add smooth scroll animation
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Add visual feedback
                        this.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            this.style.transform = '';
                        }, 150);
                    }
                }
            });
        });
    }

    // Enhanced navbar scroll effects
    function initNavbarEffects() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        let lastScrollY = window.pageYOffset;
        let ticking = false;
        
        function updateNavbar() {
            const scrollY = window.pageYOffset;
            
            // Add/remove scrolled class
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll direction
            if (scrollY > 100) {
                if (scrollY > lastScrollY) {
                    // Scrolling down
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up
                    navbar.style.transform = 'translateY(0)';
                }
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = scrollY;
            ticking = false;
        }
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });
    }

    // Scroll-triggered animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, parseInt(delay));
                    
                    // Add stagger effect for grids
                    const siblingCards = entry.target.parentElement.querySelectorAll('[data-aos]');
                    siblingCards.forEach((card, index) => {
                        if (card !== entry.target) {
                            setTimeout(() => {
                                card.classList.add('aos-animate');
                            }, index * 100);
                        }
                    });
                }
            });
        }, observerOptions);

        // Observe all elements with data-aos attribute
        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach(element => {
            observer.observe(element);
        });

        // Observe sections for fade-in effect
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                const sectionObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }
                    });
                }, { threshold: 0.1 });
                
                sectionObserver.observe(section);
            }, index * 200);
        });
    }

    // Enhanced form handling
    function initFormHandling() {
        const waitlistForm = document.getElementById('waitlistForm');
        const formMessage = document.getElementById('form-message');
        const submitBtn = waitlistForm?.querySelector('.submit-btn');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoader = submitBtn?.querySelector('.btn-loader');

        if (!waitlistForm) return;

        // Real-time validation
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');

        [nameInput, emailInput].forEach(input => {
            if (!input) return;
            
            input.addEventListener('input', function() {
                validateField(this);
            });
            
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Add focus effects
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-2px)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
            });
        });

        waitlistForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = nameInput?.value.trim();
            const email = emailInput?.value.trim();
            
            // Validate form
            if (!name) {
                showFormMessage('Please enter your name.', 'error');
                nameInput?.focus();
                return;
            }
            
            if (!email) {
                showFormMessage('Please enter your email address.', 'error');
                emailInput?.focus();
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                emailInput?.focus();
                return;
            }
            
            // Show loading state
            if (submitBtn && btnText && btnLoader) {
                submitBtn.disabled = true;
                btnText.style.opacity = '0';
                btnLoader.classList.remove('hidden');
                submitBtn.style.transform = 'scale(0.98)';
            }
            
            // Simulate form submission
            setTimeout(function() {
                showFormMessage(`Thanks ${name}! You've been added to our waitlist. We'll be in touch soon.`, 'success');
                
                // Reset form with animation
                waitlistForm.reset();
                
                // Reset button state
                if (submitBtn && btnText && btnLoader) {
                    submitBtn.disabled = false;
                    btnText.style.opacity = '1';
                    btnLoader.classList.add('hidden');
                    submitBtn.style.transform = 'scale(1)';
                }
                
                // Celebration effect
                createCelebrationEffect();
                
                // Add success animation to form
                waitlistForm.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    waitlistForm.style.transform = 'scale(1)';
                }, 200);
                
            }, 2000);
        });

        function validateField(field) {
            const value = field.value.trim();
            const isEmail = field.type === 'email';
            
            // Remove existing validation classes
            field.classList.remove('valid', 'invalid');
            
            if (value) {
                if (isEmail && !isValidEmail(value)) {
                    field.classList.add('invalid');
                    field.style.borderColor = '#ef4444';
                } else {
                    field.classList.add('valid');
                    field.style.borderColor = '#10b981';
                }
            } else {
                field.style.borderColor = '#e5e7eb';
            }
        }

        function showFormMessage(message, type) {
            if (formMessage) {
                formMessage.textContent = message;
                formMessage.className = `form-message ${type}`;
                formMessage.style.transform = 'translateY(-10px)';
                formMessage.style.opacity = '0';
                
                // Animate in
                setTimeout(() => {
                    formMessage.style.transform = 'translateY(0)';
                    formMessage.style.opacity = '1';
                }, 10);
                
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Auto-hide error messages after 5 seconds
                if (type === 'error') {
                    setTimeout(function() {
                        if (formMessage.classList.contains('error')) {
                            formMessage.style.opacity = '0';
                            setTimeout(() => {
                                formMessage.classList.add('hidden');
                            }, 300);
                        }
                    }, 5000);
                }
            }
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function createCelebrationEffect() {
            // Create multiple celebration emojis
            const emojis = ['🎉', '✨', '🚀', '💙', '🎊'];
            
            emojis.forEach((emoji, index) => {
                setTimeout(() => {
                    const celebration = document.createElement('div');
                    celebration.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: ${50 + (Math.random() - 0.5) * 40}%;
                        transform: translate(-50%, -50%);
                        font-size: ${40 + Math.random() * 20}px;
                        z-index: 9999;
                        pointer-events: none;
                        animation: celebrate ${2 + Math.random()}s ease-out forwards;
                    `;
                    celebration.textContent = emoji;
                    
                    document.body.appendChild(celebration);
                    
                    setTimeout(() => {
                        if (celebration.parentNode) {
                            document.body.removeChild(celebration);
                        }
                    }, 3000);
                }, index * 200);
            });
            
            // Add CSS animation if not already added
            if (!document.querySelector('#celebration-styles')) {
                const style = document.createElement('style');
                style.id = 'celebration-styles';
                style.textContent = `
                    @keyframes celebrate {
                        0% { 
                            opacity: 0; 
                            transform: translate(-50%, -50%) scale(0.5) rotate(0deg); 
                        }
                        50% { 
                            opacity: 1; 
                            transform: translate(-50%, -50%) scale(1.2) rotate(180deg); 
                        }
                        100% { 
                            opacity: 0; 
                            transform: translate(-50%, -50%) scale(1) rotate(360deg) translateY(-100px); 
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    // Interactive elements and micro-interactions
    function initInteractiveElements() {
        // Enhanced button interactions
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            // Ripple effect
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
            
            // Hover effects
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Card interactions
        const interactiveCards = document.querySelectorAll('.interactive-card');
        interactiveCards.forEach((card, index) => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                
                // Add glow effect
                this.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.1)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '';
            });
            
            // Add click animation
            card.addEventListener('click', function() {
                this.style.transform = 'translateY(-8px) scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                }, 150);
            });
        });

        // Demo button interaction
        const demoBtn = document.querySelector('.preview-demo-btn');
        if (demoBtn) {
            demoBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Create modal overlay for demo
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                
                const modalContent = document.createElement('div');
                modalContent.style.cssText = `
                    background: white;
                    padding: 2rem;
                    border-radius: 16px;
                    text-align: center;
                    max-width: 400px;
                    transform: scale(0.9);
                    transition: transform 0.3s ease;
                `;
                
                modalContent.innerHTML = `
                    <h3 style="margin-bottom: 1rem; color: #111827;">🚀 Demo Coming Soon!</h3>
                    <p style="color: #6b7280; margin-bottom: 2rem;">Our interactive demo is currently in development. Join the waitlist to be notified when it's ready!</p>
                    <button onclick="this.closest('[style*=position]').remove()" style="background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600;">Got it!</button>
                `;
                
                modal.appendChild(modalContent);
                document.body.appendChild(modal);
                
                // Animate in
                setTimeout(() => {
                    modal.style.opacity = '1';
                    modalContent.style.transform = 'scale(1)';
                }, 10);
                
                // Close on background click
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });
            });
        }

        // Email link interaction
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Add click feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Show copied message (simulate)
                const rect = this.getBoundingClientRect();
                const tooltip = document.createElement('div');
                tooltip.textContent = 'Opening email client...';
                tooltip.style.cssText = `
                    position: fixed;
                    top: ${rect.top - 40}px;
                    left: ${rect.left + rect.width / 2}px;
                    transform: translateX(-50%);
                    background: #111827;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    z-index: 1000;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                
                document.body.appendChild(tooltip);
                setTimeout(() => tooltip.style.opacity = '1', 10);
                setTimeout(() => {
                    tooltip.style.opacity = '0';
                    setTimeout(() => tooltip.remove(), 300);
                }, 2000);
            });
        });

        // Add ripple effect CSS
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Mobile menu functionality
    function initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (!mobileToggle || !navLinks) return;
        
        let isOpen = false;
        
        mobileToggle.addEventListener('click', function() {
            isOpen = !isOpen;
            
            // Animate hamburger
            const spans = this.querySelectorAll('span');
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                
                // Show menu
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'rgba(255, 255, 255, 0.98)';
                navLinks.style.backdropFilter = 'blur(20px)';
                navLinks.style.padding = '1rem';
                navLinks.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                navLinks.style.borderTop = '1px solid rgba(0, 0, 0, 0.08)';
                navLinks.style.transform = 'translateY(-10px)';
                navLinks.style.opacity = '0';
                
                setTimeout(() => {
                    navLinks.style.transform = 'translateY(0)';
                    navLinks.style.opacity = '1';
                }, 10);
                
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
                
                // Hide menu
                navLinks.style.transform = 'translateY(-10px)';
                navLinks.style.opacity = '0';
                
                setTimeout(() => {
                    navLinks.style.display = '';
                    navLinks.style.flexDirection = '';
                    navLinks.style.position = '';
                    navLinks.style.top = '';
                    navLinks.style.left = '';
                    navLinks.style.right = '';
                    navLinks.style.background = '';
                    navLinks.style.backdropFilter = '';
                    navLinks.style.padding = '';
                    navLinks.style.boxShadow = '';
                    navLinks.style.borderTop = '';
                    navLinks.style.transform = '';
                    navLinks.style.opacity = '';
                }, 300);
            }
        });
        
        // Close menu when clicking nav links
        navLinks.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link') && isOpen) {
                mobileToggle.click();
            }
        });
    }

    // Parallax and scroll effects
    function initParallaxEffects() {
        const hero = document.querySelector('.hero');
        const shapes = document.querySelectorAll('.shape');
        
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.2;
            
            // Hero parallax
            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${rate}px)`;
            }
            
            // Floating shapes parallax
            shapes.forEach((shape, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = scrolled * speed;
                shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
            });
            
            ticking = false;
        }
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
        
        // Add scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #06b6d4);
            z-index: 10001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrolled / maxHeight) * 100;
            progressBar.style.width = Math.min(progress, 100) + '%';
        });
    }

    // Keyboard navigation enhancement
    document.addEventListener('keydown', function(e) {
        // ESC key closes modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('[style*="position: fixed"]');
            modals.forEach(modal => {
                if (modal.style.zIndex >= 10000) {
                    modal.remove();
                }
            });
        }
        
        // Tab navigation enhancements
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Add enhanced focus styles for keyboard navigation
    if (!document.querySelector('#keyboard-styles')) {
        const style = document.createElement('style');
        style.id = 'keyboard-styles';
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 2px solid #3b82f6 !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize intersection observer for performance
    const performanceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-viewport');
            }
        });
    }, { threshold: 0.1 });

    // Observe all sections for performance tracking
    document.querySelectorAll('section').forEach(section => {
        performanceObserver.observe(section);
    });

    // Debug helper
    window.debugTapIn = function() {
        console.log('TapIn Debug Info:');
        console.log('Navigation links:', document.querySelectorAll('.nav-link').length);
        console.log('Interactive cards:', document.querySelectorAll('.interactive-card').length);
        console.log('Buttons:', document.querySelectorAll('.btn').length);
        console.log('Form elements:', document.querySelectorAll('.form-control').length);
        console.log('Animated elements:', document.querySelectorAll('[data-aos]').length);
    };
});