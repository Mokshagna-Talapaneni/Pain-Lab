/* ==========================================================================
   Pain Neuroscience Research Lab — JavaScript
   University of Arizona · College of Nursing
   Multi-page version
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // DOM References
  // -------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  // -------------------------------------------------------------------------
  // 1. Sticky Navbar — transparent → solid on scroll (home page only)
  //    On inner pages the navbar uses .navbar-solid class and stays solid.
  // -------------------------------------------------------------------------
  const isHomePage = navbar && !navbar.classList.contains('navbar-solid');

  const handleNavbarScroll = () => {
    if (!navbar || !isHomePage) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // initial check

  // -------------------------------------------------------------------------
  // 2. Mobile Menu Toggle
  // -------------------------------------------------------------------------
  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu if clicking outside on the overlay
    navbar.addEventListener('click', (e) => {
      if (e.target === navbar && navbar.classList.contains('nav-open')) {
        navbar.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when a nav link is clicked (for mobile)
    const mobileNavAnchors = document.querySelectorAll('.nav-links a');
    mobileNavAnchors.forEach(anchor => {
      anchor.addEventListener('click', () => {
        if (navbar.classList.contains('nav-open')) {
          navbar.classList.remove('nav-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 3. Scroll Animations + Accessibility (reduced motion)
  // -------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show everything immediately for users who prefer reduced motion
    animatedElements.forEach(el => el.classList.add('visible'));
  } else {
    const animationObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15,
      }
    );

    animatedElements.forEach(el => animationObserver.observe(el));
  }

  // -------------------------------------------------------------------------
  // 4. Contact Form Handling (demonstration — no backend)
  // -------------------------------------------------------------------------
  if (contactForm) {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    // Clear error on input
    [nameInput, emailInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('error');
          const errorEl = document.getElementById(input.id.replace('contact', '').toLowerCase() + 'Error');
          if (errorEl) errorEl.textContent = '';
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!nameInput || !nameInput.value.trim()) {
        isValid = false;
        if (nameInput) nameInput.classList.add('error');
        if (nameError) nameError.textContent = 'Please enter your name.';
      } else {
        nameInput.classList.remove('error');
        if (nameError) nameError.textContent = '';
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailInput.value.trim()) {
        isValid = false;
        if (emailInput) emailInput.classList.add('error');
        if (emailError) emailError.textContent = 'Please enter your email.';
      } else if (!emailRegex.test(emailInput.value.trim())) {
        isValid = false;
        emailInput.classList.add('error');
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
      } else {
        emailInput.classList.remove('error');
        if (emailError) emailError.textContent = '';
      }

      // Validate Message
      if (!messageInput || !messageInput.value.trim()) {
        isValid = false;
        if (messageInput) messageInput.classList.add('error');
        if (messageError) messageError.textContent = 'Please enter a message.';
      } else {
        messageInput.classList.remove('error');
        if (messageError) messageError.textContent = '';
      }

      if (isValid) {
        // Show success message
        if (formSuccess) {
          formSuccess.hidden = false;
        }

        // Reset form
        contactForm.reset();

        // Scroll to success message
        if (formSuccess) {
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Hide success message after 6 seconds
        setTimeout(() => {
          if (formSuccess) formSuccess.hidden = true;
        }, 6000);
      }
    });
  }
});
