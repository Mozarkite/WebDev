// SPA page navigation + loading animation
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('[data-page]');
  const loader = document.getElementById('loading-overlay');

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetPage = e.target.getAttribute('data-page');

      // Show loader animation
      loader.classList.remove('d-none');
      loader.classList.add('show'); 

      
      setTimeout(() => {
        loader.classList.remove('show');
        setTimeout(() => loader.classList.add('d-none'), 1000); 
        showPage(targetPage);
      }, 2000); //2 second delay
    });
  });

  //Function to show one page and hide others
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

  // Handle browser back/forward navigation
  window.addEventListener('popstate', (e) => {
    const pageId = e.state?.page || 'home';
    showPage(pageId);
  });
});
