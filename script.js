console.log('Script loaded');

// ===========================================
// MAIN DOMContentLoaded WRAPPER
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded");

  const loader = document.getElementById('loading-overlay');
  const buttons = document.querySelectorAll('[data-page]');
  const createForm = document.getElementById('createAccountForm');
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const deleteBtn = document.getElementById('deleteAccountBtn');

  // ===========================================
  // SPA PAGE NAVIGATION
  // ===========================================
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetPage = e.currentTarget.getAttribute('data-page');

      loader.classList.remove('d-none');
      loader.classList.add('show');

      setTimeout(() => {
        loader.classList.remove('show');
        setTimeout(() => loader.classList.add('d-none'), 300);
        showPage(targetPage);
      }, 500);
    });
  });

  function showPage(pageId) {
    const pages = document.querySelectorAll('.container-fluid[id]');
    pages.forEach(p => p.classList.toggle('d-none', p.id !== pageId));
    history.pushState({ page: pageId }, '', pageId);
  }

  window.addEventListener('popstate', (e) => {
    const pageId = e.state?.page || 'home';
    showPage(pageId);
  });

  // ===========================================
  // ACCOUNT CREATION FORM HANDLER
  // ===========================================
  if (createForm) {
    createForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = document.getElementById('createUsername').value.trim();
      const email = document.getElementById('createEmail').value.trim();
      const password = document.getElementById('createPassword').value.trim();

      if (!username || !email || !password) {
        alert("Please fill in all fields!");
        return;
      }

      try {
        const res = await fetch('/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (data.success) {
          alert("Account successfully created!");
          showPage('login');
        } else {
          alert("Error: " + data.error);
        }

      } catch (err) {
        console.error("Register fetch error:", err);
        alert("Server connection error.");
      }
    });
  }

  // ===========================================
  // LOGIN FORM HANDLER
  // ===========================================
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('LoginEmail').value.trim();
      const password = document.getElementById('LoginPassword').value.trim();

      try {
        const res = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
          const welcomeHeader = document.getElementById('welcomeUser');
          if (welcomeHeader) {
            welcomeHeader.innerHTML = `Welcome <br> ${data.user.username}`;
          }

          const profileHeader = document.getElementById('profileUsername');
          if (profileHeader) {
            profileHeader.innerHTML = `Username - ${data.user.username}`;
          }

          const profileUser = document.getElementById('profileID');
          if (profileUser) {
            profileUser.innerHTML = `Unique User ID - ${data.user.user_id}`;
          }

          localStorage.setItem('user', JSON.stringify(data.user));
          showPage('main');

        } else {
          alert("Error: " + data.error);
        }

      } catch (err) {
        console.error("Login fetch error:", err);
        alert("Server error while logging in.");
      }
    });
  }

  // ===========================================
  // CHANGE USERNAME FORM HANDLER
  // ===========================================
  const changeForm = document.getElementById('changeUsernameForm');

  if (changeForm) {
    changeForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const userJSON = localStorage.getItem('user');
      if (!userJSON) return alert('You must be logged in to change your username');

      const user = JSON.parse(userJSON);
      const newUsername = document.getElementById('newUsername').value.trim();
      if (!newUsername) return alert('Enter a new username');

      try {
        const res = await fetch('/update-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ oldUsername: user.username, newUsername })
        });

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const errorText = await res.text();
          console.error('Server returned non-JSON:', errorText);
          return alert('Server error while updating username');
        }

        const data = await res.json();

        if (data.success) {
          alert(`Username updated to ${data.user.username}`);
          localStorage.setItem('user', JSON.stringify(data.user));

          const profileHeader = document.getElementById('profileUsername');
          if (profileHeader) {
            profileHeader.textContent = `Username - ${data.user.username}`;
          }

          const welcomeHeader = document.getElementById('welcomeUser');
          if (welcomeHeader) {
            welcomeHeader.innerHTML = `Welcome <br> ${data.user.username}`;
          }

          showPage('profile');

        } else {
          alert(`Error: ${data.error}`);
        }

      } catch (err) {
        console.error('Update username fetch error:', err);
        alert('Server error while updating username');
      }
    });
  }

  // ===========================================
  // DELETE ACCOUNT BUTTON HANDLER
  // ===========================================
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return alert('No user logged in');

      if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) {
        return;
      }

      try {
        const res = await fetch('/delete-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user.username })
        });

        const data = await res.json();

        if (data.success) {
          localStorage.removeItem('user');
          alert('Account deleted');
          window.location.reload();
        } else {
          alert(`Error: ${data.error}`);
        }

      } catch (err) {
        console.error('Delete account error:', err);
        alert('Server error while deleting account');
      }
    });
  }

  // ===========================================
  // LOGOUT BUTTON HANDLER
  // ===========================================
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      const welcomeHeader = document.getElementById('welcomeUser');

      if (welcomeHeader) {
        welcomeHeader.innerHTML = `Welcome <br> Guest`;
      }

      localStorage.removeItem('user');
      showPage('login');
    });
  }

});
