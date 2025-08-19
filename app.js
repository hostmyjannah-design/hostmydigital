// Initialize Lucide icons
lucide.createIcons();

// Theme Management
class ThemeManager {
  constructor() {
    this.theme = this.getInitialTheme();
    this.themeToggle = document.getElementById('themeToggle');
    this.init();
  }

  getInitialTheme() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }

  init() {
    this.setTheme(this.theme);
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-color-scheme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // Handle localStorage errors silently
    }
    
    // Update theme toggle icon state
    if (this.themeToggle) {
      const lightIcon = this.themeToggle.querySelector('.light-icon');
      const darkIcon = this.themeToggle.querySelector('.dark-icon');
      
      if (lightIcon && darkIcon) {
        if (theme === 'dark') {
          lightIcon.style.opacity = '0';
          lightIcon.style.transform = 'rotate(90deg)';
          darkIcon.style.opacity = '1';
          darkIcon.style.transform = 'rotate(0deg)';
        } else {
          lightIcon.style.opacity = '1';
          lightIcon.style.transform = 'rotate(0deg)';
          darkIcon.style.opacity = '0';
          darkIcon.style.transform = 'rotate(90deg)';
        }
      }
    }
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
    this.navMenu = document.getElementById('navMenu');
    this.isMenuOpen = false;
    this.init();
  }

  init() {
    // Scroll behavior for navbar
    window.addEventListener('scroll', () => this.handleScroll());
    
    // Navigation link clicks
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });

    // Mobile menu toggle
    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.navMenu && this.mobileMenuToggle && 
          !this.navMenu.contains(e.target) && 
          !this.mobileMenuToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Update active link on scroll
    window.addEventListener('scroll', () => this.updateActiveLink());
  }

  handleScroll() {
    if (this.navbar) {
      if (window.scrollY > 100) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
    }
  }

  handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      this.scrollToSection(targetId.substring(1));
    }
    this.closeMobileMenu();
  }

  scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.openMobileMenu();
    } else {
      this.closeMobileMenu();
    }
  }

  openMobileMenu() {
    if (this.navMenu && this.mobileMenuToggle) {
      this.navMenu.classList.add('active');
      this.mobileMenuToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeMobileMenu() {
    if (this.navMenu && this.mobileMenuToggle) {
      this.navMenu.classList.remove('active');
      this.mobileMenuToggle.classList.remove('active');
      document.body.style.overflow = '';
      this.isMenuOpen = false;
    }
  }

  updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }
}

// Portfolio Filter Management
class PortfolioManager {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.portfolioItems = document.querySelectorAll('.portfolio-item');
    this.init();
  }

  init() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleFilterClick(e));
    });
  }

  handleFilterClick(e) {
    const filterValue = e.target.getAttribute('data-filter');
    
    // Update active filter button
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    // Filter portfolio items with animation
    this.portfolioItems.forEach((item, index) => {
      const itemCategory = item.getAttribute('data-category');
      
      if (filterValue === 'all' || itemCategory === filterValue) {
        item.style.display = 'block';
        // Stagger the animation
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, index * 100);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  }
}

// Service Modal Management
class ServiceModalManager {
  constructor() {
    this.modal = document.getElementById('serviceModal');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalBody = document.getElementById('modalBody');
    this.serviceCards = document.querySelectorAll('.service-card');
    this.init();
  }

  init() {
    this.serviceCards.forEach(card => {
      const button = card.querySelector('.service-cta');
      if (button) {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          const serviceType = card.getAttribute('data-service');
          this.openServiceModal(serviceType);
        });
      }
      
      // Also make the entire card clickable
      card.addEventListener('click', () => {
        const serviceType = card.getAttribute('data-service');
        this.openServiceModal(serviceType);
      });
    });

    // Close modal when clicking backdrop or X button
    if (this.modal) {
      const backdrop = this.modal.querySelector('.modal-backdrop');
      const closeBtn = this.modal.querySelector('.modal-close');
      
      if (backdrop) {
        backdrop.addEventListener('click', () => this.closeModal());
      }
      
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal());
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  openServiceModal(serviceType) {
    if (!this.modal || !this.modalTitle || !this.modalBody) return;
    
    const serviceData = this.getServiceData(serviceType);
    
    this.modalTitle.textContent = serviceData.title;
    this.modalBody.innerHTML = this.generateServiceContent(serviceData);
    
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Re-initialize Lucide icons in modal
    setTimeout(() => {
      lucide.createIcons();
    }, 100);
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  getServiceData(serviceType) {
    const services = {
      'web-development': {
        title: 'Web Development & Design',
        description: 'We create stunning, high-performance websites that drive results for your business.',
        features: [
          'Custom responsive design that works on all devices',
          'Lightning-fast loading speeds and optimization',
          'SEO-friendly architecture and best practices',
          'Modern technology stack (React, Next.js, Node.js)',
          'Content Management Systems (CMS)',
          'E-commerce integration and functionality',
          'Analytics and performance tracking',
          'Ongoing maintenance and support'
        ],
        benefits: [
          'Increased online visibility and brand credibility',
          'Higher conversion rates and user engagement',
          'Mobile-optimized experience for all users',
          'Search engine ranking improvements',
          'Fast delivery - some projects in 24 hours'
        ],
        process: [
          'Discovery & Strategy Session',
          'Design Mockups & Approval',
          'Development & Testing',
          'Launch & Optimization'
        ],
        pricing: 'Starting from $2,500 for basic websites, $5,000+ for complex applications'
      },
      'ai-agents': {
        title: 'AI Agent Building & Integration',
        description: 'Transform your business with intelligent AI agents that work 24/7 to automate processes and enhance customer experiences.',
        features: [
          'Custom chatbots for customer support',
          'Lead qualification and scoring systems',
          'Appointment booking and scheduling automation',
          'E-commerce personal shopping assistants',
          'Content creation and management agents',
          'Data analysis and reporting automation',
          'Multi-platform integration (website, social media, email)',
          'Natural language processing and understanding'
        ],
        benefits: [
          'Reduce operational costs by up to 60%',
          '24/7 customer service availability',
          'Improved response times and customer satisfaction',
          'Increased lead qualification accuracy',
          'Automated routine tasks and processes'
        ],
        process: [
          'Business Process Analysis',
          'AI Agent Design & Training',
          'Integration & Testing',
          'Launch & Optimization'
        ],
        pricing: 'Starting from $3,500 for basic chatbots, $7,500+ for complex AI systems'
      },
      'digital-marketing': {
        title: 'Digital Marketing & SEO',
        description: 'Data-driven marketing strategies that deliver measurable results and sustainable growth.',
        features: [
          'Search Engine Optimization (SEO)',
          'Pay-Per-Click (PPC) advertising campaigns',
          'Social media marketing and management',
          'Content marketing and strategy',
          'Email marketing automation',
          'Analytics and performance reporting',
          'Conversion rate optimization',
          'Local SEO and Google My Business optimization'
        ],
        benefits: [
          'Increased organic traffic and visibility',
          'Higher quality leads and conversions',
          'Improved brand awareness and authority',
          'Better ROI on marketing investments',
          'Data-driven decision making'
        ],
        process: [
          'Market Research & Competitor Analysis',
          'Strategy Development & Planning',
          'Campaign Implementation',
          'Monitoring & Optimization'
        ],
        pricing: 'Starting from $1,500/month for SEO, $2,500/month for full digital marketing'
      },
      'brand-strategy': {
        title: 'Brand Strategy & Design',
        description: 'Comprehensive branding solutions that make your business stand out and connect with your audience.',
        features: [
          'Brand strategy and positioning',
          'Logo design and visual identity',
          'Brand guidelines and style guides',
          'Marketing materials design',
          'Website and digital asset design',
          'Packaging and print design',
          'Brand messaging and copywriting',
          'Rebranding and brand refresh services'
        ],
        benefits: [
          'Strong brand recognition and recall',
          'Consistent brand experience across all touchpoints',
          'Increased customer trust and loyalty',
          'Premium positioning and pricing power',
          'Competitive advantage in the market'
        ],
        process: [
          'Brand Discovery & Research',
          'Strategy Development',
          'Creative Design & Concepts',
          'Brand Guidelines & Implementation'
        ],
        pricing: 'Starting from $3,000 for logo design, $8,500+ for complete brand identity'
      },
      'ecommerce': {
        title: 'E-commerce Solutions',
        description: 'Full-featured online stores that drive sales and provide exceptional shopping experiences.',
        features: [
          'Custom e-commerce website development',
          'Shopping cart and checkout optimization',
          'Payment gateway integration',
          'Inventory management systems',
          'Product catalog and search functionality',
          'Mobile commerce optimization',
          'Order management and fulfillment',
          'Analytics and sales reporting'
        ],
        benefits: [
          'Increased online sales and revenue',
          'Reduced cart abandonment rates',
          'Streamlined order management',
          'Better customer shopping experience',
          'Scalable growth platform'
        ],
        process: [
          'Requirements Gathering',
          'Platform Selection & Setup',
          'Custom Development & Design',
          'Testing & Launch'
        ],
        pricing: 'Starting from $4,500 for basic stores, $12,000+ for enterprise solutions'
      },
      'mobile-apps': {
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile applications that engage users and drive business growth.',
        features: [
          'iOS and Android native app development',
          'Cross-platform development (React Native, Flutter)',
          'UI/UX design for mobile interfaces',
          'App Store and Google Play optimization',
          'Push notifications and user engagement',
          'In-app purchases and monetization',
          'Analytics and user behavior tracking',
          'App maintenance and updates'
        ],
        benefits: [
          'Direct customer engagement channel',
          'Increased brand visibility and loyalty',
          'New revenue streams and monetization',
          'Better user experience than mobile web',
          'Access to device features and capabilities'
        ],
        process: [
          'App Concept & Planning',
          'UI/UX Design & Prototyping',
          'Development & Testing',
          'App Store Submission & Launch'
        ],
        pricing: 'Starting from $8,500 for simple apps, $25,000+ for complex applications'
      }
    };

    return services[serviceType] || services['web-development'];
  }

  generateServiceContent(service) {
    return `
      <div class="service-modal-content">
        <p class="service-description">${service.description}</p>
        
        <div class="service-section">
          <h3><i data-lucide="check-circle"></i> What's Included</h3>
          <ul class="service-list">
            ${service.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>

        <div class="service-section">
          <h3><i data-lucide="trending-up"></i> Key Benefits</h3>
          <ul class="service-list benefits">
            ${service.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
          </ul>
        </div>

        <div class="service-section">
          <h3><i data-lucide="workflow"></i> Our Process</h3>
          <div class="process-steps">
            ${service.process.map((step, index) => `
              <div class="process-step">
                <div class="step-number">${index + 1}</div>
                <div class="step-text">${step}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="service-section">
          <h3><i data-lucide="dollar-sign"></i> Investment</h3>
          <p class="pricing-info">${service.pricing}</p>
        </div>

        <div class="service-cta-section">
          <p><strong>Ready to get started?</strong> Contact us today for a free consultation and project quote.</p>
          <button class="btn btn--primary btn--lg" onclick="scrollToSection('contact'); closeServiceModal();">
            Get Started Now <i data-lucide="arrow-right"></i>
          </button>
        </div>
      </div>

      <style>
        .service-modal-content {
          font-size: var(--font-size-base);
          line-height: var(--line-height-normal);
        }
        
        .service-description {
          font-size: var(--font-size-lg);
          color: var(--color-text-secondary);
          margin-bottom: var(--space-24);
        }
        
        .service-section {
          margin-bottom: var(--space-24);
        }
        
        .service-section h3 {
          display: flex;
          align-items: center;
          gap: var(--space-8);
          color: var(--color-primary);
          margin-bottom: var(--space-12);
          font-size: var(--font-size-lg);
        }
        
        .service-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .service-list li {
          display: flex;
          align-items: flex-start;
          gap: var(--space-8);
          margin-bottom: var(--space-8);
          color: var(--color-text-secondary);
        }
        
        .service-list li::before {
          content: '•';
          color: var(--color-primary);
          font-weight: bold;
          margin-top: 2px;
        }
        
        .service-list.benefits li::before {
          content: '✓';
          color: var(--color-success);
        }
        
        .process-steps {
          display: flex;
          flex-direction: column;
          gap: var(--space-12);
        }
        
        .process-step {
          display: flex;
          align-items: center;
          gap: var(--space-12);
        }
        
        .step-number {
          width: 32px;
          height: 32px;
          background: var(--color-primary);
          color: var(--color-btn-primary-text);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-sm);
          flex-shrink: 0;
        }
        
        .step-text {
          color: var(--color-text);
          font-weight: var(--font-weight-medium);
        }
        
        .pricing-info {
          background: var(--color-bg-2);
          padding: var(--space-16);
          border-radius: var(--radius-base);
          color: var(--color-text);
          font-weight: var(--font-weight-medium);
          border-left: 4px solid var(--color-primary);
        }
        
        .service-cta-section {
          background: var(--color-bg-1);
          padding: var(--space-20);
          border-radius: var(--radius-base);
          text-align: center;
          margin-top: var(--space-24);
        }
        
        .service-cta-section p {
          margin-bottom: var(--space-16);
          color: var(--color-text);
        }
      </style>
    `;
  }
}

// Contact Form Management
class ContactFormManager {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.submitBtn = document.getElementById('submitBtn');
    this.formMessage = document.getElementById('formMessage');
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    this.setLoadingState(true);
    
    try {
      const formData = new FormData(this.form);
      
      const response = await fetch(this.form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        this.showMessage('Thank you for your message! We\'ll get back to you within 2 hours.', 'success');
        this.form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      this.showMessage('Sorry, there was an error sending your message. Please try again or call us directly at 347-719-7429.', 'error');
    }
    
    this.setLoadingState(false);
  }

  setLoadingState(loading) {
    if (!this.submitBtn) return;
    
    const btnText = this.submitBtn.querySelector('.btn-text');
    const btnLoading = this.submitBtn.querySelector('.btn-loading');
    
    if (loading) {
      this.submitBtn.disabled = true;
      if (btnText) btnText.classList.add('hidden');
      if (btnLoading) btnLoading.classList.remove('hidden');
    } else {
      this.submitBtn.disabled = false;
      if (btnText) btnText.classList.remove('hidden');
      if (btnLoading) btnLoading.classList.add('hidden');
    }
  }

  showMessage(message, type) {
    if (!this.formMessage) return;
    
    this.formMessage.textContent = message;
    this.formMessage.className = `form-message ${type}`;
    this.formMessage.classList.remove('hidden');
    
    // Hide message after 5 seconds
    setTimeout(() => {
      if (this.formMessage) {
        this.formMessage.classList.add('hidden');
      }
    }, 5000);
  }
}

// Animation on Scroll
class ScrollAnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        this.observerOptions
      );

      // Observe elements for animation
      const animatedElements = document.querySelectorAll(
        '.hero-content, .about-feature, .service-card, .ai-agent-card, .portfolio-item, .testimonial-card, .contact-item'
      );

      animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        this.observer.observe(el);
      });
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// Global utility functions
window.scrollToSection = function(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const offsetTop = element.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
};

window.closeServiceModal = function() {
  const modal = document.getElementById('serviceModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all functionality
  const themeManager = new ThemeManager();
  const navigationManager = new NavigationManager();
  const portfolioManager = new PortfolioManager();
  const serviceModalManager = new ServiceModalManager();
  const contactFormManager = new ContactFormManager();
  const scrollAnimationManager = new ScrollAnimationManager();

  // Initialize Lucide icons
  lucide.createIcons();

  // Add smooth reveal animation to hero content
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    setTimeout(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 200);
  }

  // Initialize CTA button functionality
  const startProjectBtn = document.querySelector('.hero-cta .btn--primary');
  const viewWorkBtn = document.querySelector('.hero-cta .btn--outline');
  
  if (startProjectBtn) {
    startProjectBtn.addEventListener('click', () => {
      scrollToSection('contact');
    });
  }
  
  if (viewWorkBtn) {
    viewWorkBtn.addEventListener('click', () => {
      scrollToSection('portfolio');
    });
  }
});

// Handle window resize for mobile menu
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    const navMenu = document.getElementById('navMenu');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    if (navMenu) navMenu.classList.remove('active');
    if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Preload critical animations and handle reduced motion
const style = document.createElement('style');
style.textContent = `
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
document.head.appendChild(style);