// SPA page navigation
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('[data-page]');

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetPage = e.target.getAttribute('data-page');
      showPage(targetPage);
    });
  });

  // Function to show one page and hide others
  function showPage(pageId) {
    const pages = document.querySelectorAll('body > .container-fluid');
    pages.forEach(p => {
      if (p.id === pageId) {
        p.classList.remove('d-none');
      } else {
        p.classList.add('d-none');
      }
    });

    // Update URL without reload
    history.pushState({ page: pageId }, '', pageId);
  }

  // Handle back/forward buttons
  window.addEventListener('popstate', (e) => {
    const pageId = e.state?.page || 'home';
    showPage(pageId);
  });
});
