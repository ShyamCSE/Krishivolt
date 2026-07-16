document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('mobile-menu-button');
  const overlay = document.getElementById('mobile-menu-overlay');
  const menu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');

  function openMenu() {
    overlay && overlay.classList.add('open');
    menu && menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay && overlay.classList.remove('open');
    menu && menu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (btn) btn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  // close when clicking any link inside mobile menu
  const links = document.querySelectorAll('#mobile-menu nav a');
  links.forEach(l => l.addEventListener('click', closeMenu));
});
