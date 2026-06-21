document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Navbar styling on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.style.backgroundColor = 'rgba(8, 11, 17, 0.85)';
            navbar.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.5)';
            navbar.style.padding = '0.8rem 0';
        } else {
            navbar.style.backgroundColor = 'rgba(8, 11, 17, 0.7)';
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '1.1rem 0';
        }
    });

    // 2. Smooth Scrolling for Anchor Links (adjusting for fixed navbar) with cinematic transition
    document.querySelectorAll('.nav-links a, .hero-actions a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offset = 85; // fixed navbar offset
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = targetElement.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;
                    
                    // Trigger Rockstar cinematic viewport scaling
                    document.body.classList.add('cinematic-transitioning');
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    setTimeout(() => {
                        document.body.classList.remove('cinematic-transitioning');
                    }, 850);
                }
            }
        });
    });

    // 3. Toast Notification Helper
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    function showToast(message) {
        if (!toast) return;
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        
        // Hide after 3.5 seconds
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3500);
    }

    // 4. Copy Email to Clipboard
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailAddress = 'angeldelsh@gmail.com';

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(emailAddress).then(() => {
                showToast('Email address copied to clipboard!');
                
                // Temporary button feedback
                copyEmailBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyEmailBtn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                showToast('Failed to copy. Please highlight & copy.');
            });
        });
    }

    // 5. Contact Form with AJAX + Native Fallback
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnHTML = submitBtn.innerHTML;
            
            // Set loading state
            submitBtn.innerHTML = 'Sending... <span class="spinner"></span>';
            submitBtn.disabled = true;
            
            // Serialize the form data including configurations
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Post via FormSubmit AJAX endpoint
            fetch("https://formsubmit.co/ajax/angeldelsh@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    showToast('Message sent! Ángel will write back soon.');
                    contactForm.reset();
                } else {
                    throw new Error('Server returned error status');
                }
            })
            .catch(error => {
                console.warn('FormSubmit AJAX failed, submitting natively:', error);
                showToast('Redirecting to confirm form...');
                
                // Fall back to native form submission to handle confirmation/activation
                setTimeout(() => {
                    contactForm.submit();
                }, 800);
            })
            .finally(() => {
                // Restore submit button
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnHTML;
                    submitBtn.disabled = false;
                }, 1000);
            });
        });
    }

    // 6. Section Active Observer for Dynamic Background Glows and Nav Highlights
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const glowObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -40% 0px', // Trigger when section is in the middle of the viewport
        threshold: 0
    };

    const sectionActiveObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Update body class for background glows
                // Remove existing active-section classes
                document.body.className = document.body.className.replace(/\bactive-section-\S+/g, '');
                document.body.classList.add(`active-section-${id}`);
                
                // Highlight corresponding navigation link
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, glowObserverOptions);

    sections.forEach(section => sectionActiveObserver.observe(section));

    // 7. Scroll Animations (Intersection Observer for Cinematic Reveal and Exit)
    const revealObserverOptions = {
        root: null,
        rootMargin: '-5% 0px -10% 0px',
        threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
            } else {
                // Fade out and scale back down when exiting the viewport
                entry.target.classList.remove('active-reveal');
            }
        });
    }, revealObserverOptions);

    // Collect all elements we want to reveal
    const itemsToReveal = document.querySelectorAll(
        '.section-title, .about-text, .about-card, .timeline-content, .project-card, .skill-category, .contact-info, .contact-form-wrapper'
    );
    
    itemsToReveal.forEach(item => {
        item.classList.add('reveal-item');
        revealObserver.observe(item);
    });
});
