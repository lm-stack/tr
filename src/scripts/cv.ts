/* ==========================================================================
   CV Site — Scroll to top, Isotope filters, Form, Smooth scroll
   ========================================================================== */

function init() {
  // ---- Scroll to Top Button ----
  const scrollBtn = document.querySelector('.cv-scroll-top') as HTMLElement;

  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }, { passive: true });
  }

  // ---- Isotope-style Filters ----
  const filterButtons = document.querySelectorAll('.cv-filters button');
  const projectItems = document.querySelectorAll('.cv-project-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const el = item as HTMLElement;
        if (filter === '*' || el.classList.contains(filter!)) {
          el.style.display = '';
        } else {
          el.style.display = 'none';
        }
      });
    });
  });

  // ---- Progress Bar Animation ----
  const progressBars = document.querySelectorAll('[data-width]') as NodeListOf<HTMLElement>;
  progressBars.forEach(bar => {
    bar.style.transition = 'none';
    bar.style.width = '0%';
  });
  requestAnimationFrame(() => {
    progressBars.forEach(bar => {
      bar.style.transition = 'width 0.8s ease';
      bar.style.width = bar.getAttribute('data-width') || '0%';
    });
  });

  // ---- Contact Form Validation & Webhook ----
  document.querySelectorAll('form[data-webhook]').forEach(form => {
    const feedbackEl = form.querySelector('[id$="form-feedback"], #form-feedback');
    const submitBtn = form.querySelector('button[type="submit"]');
    const webhookUrl = (form as HTMLElement).dataset.webhook;
    const webhookToken = (form as HTMLElement).dataset.webhookToken;
    const honeypotField = form.querySelector('input[name="website"]') as HTMLInputElement;

    let lastSubmitTime = 0;
    const SUBMIT_COOLDOWN = 10000;

    const requiredFields = form.querySelectorAll('[required]');

    function validateField(field: HTMLInputElement | HTMLTextAreaElement) {
      const errorEl = document.getElementById(`${field.id}-error`);
      let valid = true;
      let msg = '';

      if (field.type === 'email') {
        valid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/.test(field.value);
        msg = 'Please enter a valid email address.';
      } else if (field.tagName === 'TEXTAREA') {
        const len = field.value.trim().length;
        if (len < 10) {
          valid = false;
          msg = 'This field must contain at least 10 characters.';
        }
      } else {
        const len = field.value.trim().length;
        if (len < 2) {
          valid = false;
          msg = 'This field must contain at least 2 characters.';
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

    requiredFields.forEach(field => {
      field.addEventListener('blur', () => validateField(field as any));
      field.addEventListener('input', () => {
        if ((field as HTMLElement).classList.contains('form-input--error')) validateField(field as any);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (honeypotField && honeypotField.value) {
        if (feedbackEl) {
          feedbackEl.className = 'form-feedback form-feedback--success';
          feedbackEl.textContent = 'Message sent successfully!';
        }
        (form as HTMLFormElement).reset();
        return;
      }

      const now = Date.now();
      if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
        if (feedbackEl) {
          feedbackEl.className = 'form-feedback form-feedback--error';
          feedbackEl.textContent = 'Please wait a few seconds before sending again.';
        }
        return;
      }

      let valid = true;
      requiredFields.forEach(field => {
        if (!validateField(field as any)) valid = false;
      });
      if (!valid) return;

      if (feedbackEl) {
        feedbackEl.className = '';
        feedbackEl.textContent = '';
      }
      (submitBtn as HTMLButtonElement).disabled = true;
      const originalText = submitBtn!.innerHTML;
      submitBtn!.innerHTML = '<span class="loading">Sending...</span>';

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const formData: Record<string, FormDataEntryValue> = {};
        new FormData(form as HTMLFormElement).forEach((value, key) => {
          if (key !== 'website') formData[key] = value;
        });

        const turnstileInput = form.querySelector('input[name="cf-turnstile-response"]');
        if (turnstileInput) {
          formData['cf-turnstile-response'] = (turnstileInput as HTMLInputElement).value;
        }

        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (webhookToken) {
          headers['Authorization'] = `Bearer ${webhookToken}`;
        }

        const res = await fetch(webhookUrl!, {
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
          feedbackEl.textContent = 'Message sent successfully!';
        }
        (form as HTMLFormElement).reset();
        if ((window as any).turnstile) (window as any).turnstile.reset();
      } catch (err) {
        if (feedbackEl) {
          feedbackEl.className = 'form-feedback form-feedback--error';
          const isAbort = err instanceof Error && err.name === 'AbortError';
          feedbackEl.textContent = isAbort
            ? 'The server is not responding. Please check your connection and try again.'
            : 'An error occurred. Please try again.';
        }
      } finally {
        (submitBtn as HTMLButtonElement).disabled = false;
        submitBtn!.innerHTML = originalText;
      }
    });
  });

  // ---- Smooth Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId!);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Run on initial load and after View Transitions navigation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
document.addEventListener('astro:page-load', init);
