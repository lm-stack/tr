/* ==========================================================================
   Main JS — Menu, Dropdown, Accordion, Parallax, Smooth Scroll, Forms
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Mobile Menu ----
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    mobileClose.focus();
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    burger.focus();
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', openMobileMenu);
  }

  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when clicking a link
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Focus trap — keep Tab/Shift+Tab within the mobile menu
    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !mobileMenu.classList.contains('open')) return;

      const focusableElements = mobileMenu.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // ---- Mobile Accordion ----
  document.querySelectorAll('.header__mobile-dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const submenu = trigger.nextElementSibling;
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      trigger.setAttribute('aria-expanded', String(!isOpen));

      if (isOpen) {
        submenu.style.maxHeight = null;
        submenu.style.paddingTop = '';
        submenu.style.paddingBottom = '';
      } else {
        submenu.style.maxHeight = submenu.scrollHeight + 'px';
        submenu.style.paddingTop = '16px';
        submenu.style.paddingBottom = '16px';
      }
    });
  });

  // ---- Desktop Dropdown ----
  document.querySelectorAll('.header__dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.header__dropdown-trigger');
    let hoverTimeout: ReturnType<typeof setTimeout> | undefined;

    function openDropdown() {
      clearTimeout(hoverTimeout);
      dropdown.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      hoverTimeout = setTimeout(() => {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }, 150);
    }

    dropdown.addEventListener('mouseenter', openDropdown);
    dropdown.addEventListener('mouseleave', closeDropdown);

    // Keyboard support
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = dropdown.classList.contains('open');
      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // Close on Escape
    dropdown.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        clearTimeout(hoverTimeout);
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });

  // ---- Sticky Header ----
  const header = document.getElementById('header');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ---- Contact Form Validation & Webhook ----
  document.querySelectorAll('form[data-webhook]').forEach(form => {
    const feedbackEl = form.querySelector('[id$="form-feedback"], #form-feedback');
    const submitBtn = form.querySelector('button[type="submit"]');
    const webhookUrl = form.dataset.webhook;
    const webhookToken = form.dataset.webhookToken;
    const honeypotField = form.querySelector('input[name="website"]');

    // Rate limiting — cooldown entre les soumissions
    let lastSubmitTime = 0;
    const SUBMIT_COOLDOWN = 10000; // 10 secondes

    // Dynamic validators based on required fields
    const requiredFields = form.querySelectorAll('[required]');

    function validateField(field) {
      const errorEl = document.getElementById(`${field.id}-error`);
      let valid = true;
      let msg = '';

      if (field.type === 'email') {
        // RFC 5322 simplifié — vérifie la structure et le TLD (min 2 chars)
        valid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/.test(field.value);
        msg = 'Veuillez entrer une adresse email valide.';
      } else if (field.tagName === 'TEXTAREA') {
        const len = field.value.trim().length;
        if (len < 10) {
          valid = false;
          msg = 'Ce champ doit contenir au moins 10 caractères.';
        } else if (field.maxLength > 0 && len > field.maxLength) {
          valid = false;
          msg = `Ce champ ne peut pas dépasser ${field.maxLength} caractères.`;
        }
      } else if (field.tagName === 'SELECT') {
        valid = field.value !== '';
        msg = 'Veuillez sélectionner une option.';
      } else {
        const len = field.value.trim().length;
        if (len < 2) {
          valid = false;
          msg = 'Ce champ doit contenir au moins 2 caractères.';
        } else if (field.maxLength > 0 && len > field.maxLength) {
          valid = false;
          msg = `Ce champ ne peut pas dépasser ${field.maxLength} caractères.`;
        }
      }

      if (!valid) {
        field.classList.add('form-input--error');
        field.setAttribute('aria-invalid', 'true');
        if (errorEl) {
          field.setAttribute('aria-describedby', `${field.id}-error`);
          errorEl.textContent = msg;
        }
        return false;
      }

      field.classList.remove('form-input--error');
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
      if (errorEl) errorEl.textContent = '';
      return true;
    }

    // Real-time validation on blur
    requiredFields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('form-input--error')) validateField(field);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot — si le champ caché est rempli, c'est un bot
      if (honeypotField && honeypotField.value) {
        // Simuler un succès pour ne pas alerter le bot
        if (feedbackEl) {
          feedbackEl.className = 'form-feedback form-feedback--success';
          feedbackEl.textContent = 'Message envoyé avec succès !';
        }
        form.reset();
        return;
      }

      // Rate limiting — empêcher les soumissions trop rapides
      const now = Date.now();
      if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
        if (feedbackEl) {
          feedbackEl.className = 'form-feedback form-feedback--error';
          feedbackEl.textContent = 'Veuillez patienter quelques secondes avant de renvoyer.';
        }
        return;
      }

      // Validate all required fields
      let valid = true;
      requiredFields.forEach(field => {
        if (!validateField(field)) valid = false;
      });
      if (!valid) return;

      if (feedbackEl) {
        feedbackEl.className = '';
        feedbackEl.textContent = '';
      }
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<svg class="inline-block w-4 h-4 animate-spin mr-1" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" opacity="0.2"/><path d="M232,128a104,104,0,0,1-208,0c0-29,11.8-54.9,34.6-75.9a8,8,0,0,1,10.8,11.8C48.2,83.3,40,104.6,40,128a88,88,0,0,0,176,0c0-23.4-8.2-44.7-29.4-64.1a8,8,0,0,1,10.8-11.8C220.2,73.1,232,99,232,128Z"/></svg> Envoi...';

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        // Collect form data (exclure le honeypot)
        const formData: Record<string, FormDataEntryValue> = {};
        new FormData(form as HTMLFormElement).forEach((value, key) => {
          if (key !== 'website') formData[key] = value;
        });

        // Inclure le token Turnstile pour validation serveur
        const turnstileInput = form.querySelector('input[name="cf-turnstile-response"]');
        if (turnstileInput) {
          formData['cf-turnstile-response'] = turnstileInput.value;
        }

        // Headers avec authentification webhook si configuré
        const headers = { 'Content-Type': 'application/json' };
        if (webhookToken) {
          headers['Authorization'] = `Bearer ${webhookToken}`;
        }

        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers,
          signal: controller.signal,
          body: JSON.stringify(formData)
        });

        clearTimeout(timeout);
        if (!res.ok) throw new Error(res.statusText);

        lastSubmitTime = Date.now();

        if (feedbackEl) {
          feedbackEl.className = 'form-feedback form-feedback--success';
          feedbackEl.textContent = 'Message envoyé avec succès !';
        }
        form.reset();
        form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        if (window.turnstile) turnstile.reset();
      } catch (err) {
        if (feedbackEl) {
          feedbackEl.className = 'form-feedback form-feedback--error';
          const isAbort = err instanceof Error && err.name === 'AbortError';
          feedbackEl.textContent = isAbort
            ? 'Le serveur ne répond pas. Vérifiez votre connexion et réessayez.'
            : 'Une erreur est survenue. Veuillez réessayer.';
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  });

  // ---- Smooth Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
