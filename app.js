document.getElementById('year').textContent = new Date().getFullYear();

const path = window.location.pathname.replace(/\/index\.html$/, '/');
const pageKey = { '/': 'home', '/products.html': 'products', '/why-us.html': 'why-us', '/contact.html': 'contact' }[path];
if (pageKey) {
  document.querySelectorAll(`[data-nav="${pageKey}"]`).forEach((link) => link.classList.add('active'));
}

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

navLinks.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

const form = document.getElementById('inquiry-form');
if (form) {
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  function setStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.className = 'form-status ' + (isError ? 'error' : 'success');
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('', false);

    const payload = {
      name: form.name.value,
      phone: form.phone.value,
      product: form.product.value,
      message: form.message.value
    };

    if (!payload.name.trim() || !payload.phone.trim()) {
      setStatus('Please fill in your name and phone number.', true);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const lines = ['Hello Toluene Home and Scents!', `Name: ${payload.name}`, `Phone: ${payload.phone}`];
    if (payload.product) lines.push(`Product: ${payload.product}`);
    if (payload.message) lines.push(`Message: ${payload.message}`);

    try {
      // Best-effort server-side save; the order always continues on WhatsApp.
      await fetch('/functions/v1/app/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // Offline or unavailable — WhatsApp below remains the order channel.
    }

    form.reset();
    setStatus('Opening WhatsApp so you can send your order to us…');
    window.open(`https://wa.me/2349135473795?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');

    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Request';
  });
}
