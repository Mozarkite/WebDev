// script.js 
console.log('Script loaded');

//helper: get token
function getToken() {
  return localStorage.getItem('token');
}
//returns an object with an Authorization header containing a Bearer token
function authHeaders() {
  const token = getToken();
  return token ? { 'Authorization': 'Bearer ' + token } : {};
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded");

  //Loads the documents needed
  const loader = document.getElementById('loading-overlay');
  const buttons = document.querySelectorAll('[data-page]');
  const createForm = document.getElementById('createAccountForm');
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const deleteBtn = document.getElementById('deleteAccountBtn');

  //SPA navigation 
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

  //Function used to show page ID
  function showPage(pageId) {
    const pages = document.querySelectorAll('.container-fluid[id]');
    pages.forEach(p => p.classList.toggle('d-none', p.id !== pageId));
    history.pushState({ page: pageId }, '', pageId);

    const nav = document.getElementById('mainNav');
    if (pageId === 'home') nav.classList.add('d-none');
    else nav.classList.remove('d-none');
  }

  window.addEventListener('popstate', (e) => {
    const pageId = e.state?.page || 'home';
    showPage(pageId);
  });

  //Account creation
  if (createForm) {
    createForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('createUsername').value.trim();
      const email = document.getElementById('createEmail').value.trim();
      const password = document.getElementById('createPassword').value.trim();
      if (!username || !email || !password) return alert("Please fill in all fields!");

      try {
        //Fetches the register
        const res = await fetch('/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();

        //if succesful register
        if (data.success) {
          //store token and user
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          alert("Account successfully created!");
          showPage('login');
        } else {
          alert("Error: " + data.error);
        }
        //Catch error
      } catch (err) {
        console.error("Register fetch error:", err);
        alert("Server connection error.");
      }
    });
  }

  //Account log in
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('LoginEmail').value.trim();
      const password = document.getElementById('LoginPassword').value.trim();
      try {
        //Fetches the login
        const res = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        //if log in is succesful
        if (data.success) {

          //stores the token nad user 
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          //welcome header
          const welcomeHeader = document.getElementById('welcomeUser');
          if (welcomeHeader) welcomeHeader.innerHTML = `Welcome <br> ${data.user.username}`;

          //header for username
          const profileHeader = document.getElementById('profileUsername');
          if (profileHeader) profileHeader.innerHTML = `Username - ${data.user.username}`;

          //header for userID
          const profileUser = document.getElementById('profileID');
          if (profileUser) profileUser.innerHTML = `Unique User ID - ${data.user.user_id}`;

          showPage('main');
        } else {
          alert("Error: " + data.error);
        }
        //catch error
      } catch (err) {
        console.error("Login fetch error:", err);
        alert("Server error while logging in.");
      }
    });
  }

  //Updating username
  const changeForm = document.getElementById('changeUsernameForm');
  if (changeForm) {
    changeForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      //get user from local storage 
      const userJSON = localStorage.getItem('user');
      
      //Protected (if the user is not logged in they cannot change their username)
      if (!userJSON) return alert('You must be logged in to change your username');

      //else : operate as usual
      const newUsername = document.getElementById('newUsername').value.trim();
      if (!newUsername) return alert('Enter a new username');

      try {
        const res = await fetch('/update-username', {
          method: 'POST',
          headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
          body: JSON.stringify({ newUsername })
        });

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          const errorText = await res.text();
          console.error('Server returned non-JSON:', errorText);
          return alert('Server error while updating username');
        }

        const data = await res.json();
        if (data.success) {
          alert(`Username updated to ${data.user.username}`);
          localStorage.setItem('user', JSON.stringify(data.user));
          if (data.token) localStorage.setItem('token', data.token);

          //profile header (showcases users)
          const profileHeader = document.getElementById('profileUsername');
          if (profileHeader) profileHeader.textContent = `Username - ${data.user.username}`;

          //welcome header
          const welcomeHeader = document.getElementById('welcomeUser');
          if (welcomeHeader) welcomeHeader.innerHTML = `Welcome <br> ${data.user.username}`;

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

  
  //Delete account (protected)
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return alert('No user logged in');

      if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;

      try {
        //Fetch the delete-account
        const res = await fetch('/delete-account', {
          method: 'POST',
          headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
        });

        const data = await res.json();
        if (data.success) {

          //remove user and token from localstorage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          alert('Account deleted');
          window.location.reload();
        } else {
          //catch the error (debugging)
          alert(`Error: ${data.error}`);
        }
        //catch outer error (debugging)
      } catch (err) {
        console.error('Delete account error:', err);
        alert('Server error while deleting account');
      }
    });
  }

  //Logging out 
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      const welcomeHeader = document.getElementById('welcomeUser');
      if (welcomeHeader) welcomeHeader.innerHTML = `Welcome <br> Guest`;
      //removes the user and token from localstorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      //redirects user
      showPage('login');
    });
  }

  //Database view + scrollable view
  const dbSearchForm = document.getElementById('dbTasksSearchForm');
  const dbTasksList = document.getElementById('dbTasksList');

  //function to load the database tasks
  async function loadDbTasks(q = '') {
    try {
      const url = q ? `/db_tasks?q=${encodeURIComponent(q)}` : '/db_tasks';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        renderDbTasks(data.tasks);
      } else {
        dbTasksList.innerHTML = `<div class="p-2">Error: ${data.error}</div>`;
      }
    } catch (err) {
      console.error('Load DB tasks error:', err);
      dbTasksList.innerHTML = `<div class="p-2">Server error while loading tasks</div>`;
    }
  }
  //function to render the tasks
  function renderDbTasks(tasks) {
    if (!dbTasksList) return;
    if (!tasks || tasks.length === 0) {
      dbTasksList.innerHTML = `<div class="p-2">No tasks found.</div>`;
      return;
    }

    //Update the html

    //showcases the task_name, category and important along with time limit (if applicable)
    dbTasksList.innerHTML = tasks.map(t => `
      <div class="db-task-item" style="padding:10px; border-bottom:1px solid #ddd;">
        <div style="font-weight:600">${escapeHtml(t.task_name)}</div>
        <div style="font-size:0.9rem">Category: ${escapeHtml(t.task_category)} — Importance: ${t.task_importance}</div>
        ${t.task_time_limit ? `<div style="font-size:0.85rem; color:#666">Due: ${new Date(t.task_time_limit).toLocaleString()}</div>` : ''}
      </div>
    `).join('');
  }

  //Simple XSS helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  if (dbSearchForm) {
    dbSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = document.getElementById('dbSearchInput').value.trim();
      loadDbTasks(q);
      if (dbSearchForm) {
  dbSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('dbSearchInput').value.trim();

    if (q === "") {
      loadDbTasks();        //show database tasks
    } else {
      loadDbTasks(q);       //show database tasks
    }
  });
}
    });
  }

  //initial load (public)
  loadDbTasks();

});
