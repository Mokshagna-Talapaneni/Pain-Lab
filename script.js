/* ==========================================================================
   Pain Neuroscience Research Lab — JavaScript
   University of Arizona · College of Nursing
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // DOM References
  // -------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const allNavAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  // -------------------------------------------------------------------------
  // 1. Sticky Navbar — transparent → solid on scroll
  // -------------------------------------------------------------------------
  const handleNavbarScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // initial check

  // -------------------------------------------------------------------------
  // 2. Smooth Scroll Navigation with navbar offset
  // -------------------------------------------------------------------------
  allNavAnchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      e.preventDefault();

      const target = document.querySelector(href);
      if (!target) return;

      // Close mobile menu if open
      if (navbar && navbar.classList.contains('nav-open')) {
        navbar.classList.remove('nav-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }

      // Scroll with offset for fixed navbar
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // -------------------------------------------------------------------------
  // 3. Active Nav Link Highlighting via IntersectionObserver
  // -------------------------------------------------------------------------
  const activeLinkObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          // Remove active from all
          allNavAnchors.forEach(a => a.classList.remove('active'));
          // Add active to matching link
          const match = document.querySelector(`.nav-links a[href="#${id}"]`);
          if (match) match.classList.add('active');
        }
      });
    },
    {
      root: null,
      rootMargin: '-40% 0px -55% 0px', // fires when section is in the middle of viewport
      threshold: 0,
    }
  );

  sections.forEach(section => activeLinkObserver.observe(section));

  // -------------------------------------------------------------------------
  // 4. Mobile Menu Toggle
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
  }

  // -------------------------------------------------------------------------
  // 5 & 7. Scroll Animations + Accessibility (reduced motion)
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
  // 6. Contact Form Handling
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
