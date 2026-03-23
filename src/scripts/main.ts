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
