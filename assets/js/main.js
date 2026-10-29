/**
 * GTNationDEV Portfolio & Auth/Download System
 * Author: Dan Mungufeni (GTNationDEV)
 * High-performance vanilla JavaScript interactive controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const modalOverlay = document.getElementById('authModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const heroImg = document.getElementById('authHeroImg');
  
  // Views
  const loginView = document.getElementById('loginView');
  const registerView = document.getElementById('registerView');
  const downloadView = document.getElementById('downloadView');
  const allViews = [loginView, registerView, downloadView];

  // Forms
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const downloadForm = document.getElementById('downloadForm');

  // User Header State
  const headerGuestActions = document.getElementById('headerGuestActions');
  const headerUserBadge = document.getElementById('headerUserBadge');
  const headerUserName = document.getElementById('headerUserName');
  const btnLogout = document.getElementById('btnLogout');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // Hero assets
  const HERO_IMAGES = {
    login: 'assets/images/hero-login.png',
    register: 'assets/images/hero-register.png',
    download: 'assets/images/hero-register.png'
  };

  // --- Mode Switching ---
  function switchMode(mode) {
    // Hide all views
    allViews.forEach(v => {
      if (v) v.classList.remove('active');
    });

    // Update Hero Image
    if (heroImg && HERO_IMAGES[mode]) {
      heroImg.src = HERO_IMAGES[mode];
    }

    // Activate specific view
    if (mode === 'login' && loginView) {
      loginView.classList.add('active');
    } else if (mode === 'register' && registerView) {
      registerView.classList.add('active');
    } else if (mode === 'download' && downloadView) {
      downloadView.classList.add('active');
    }

    // Update URL hash smoothly if inside modal or page
    if (window.location.hash !== `#${mode}`) {
      history.replaceState(null, null, `#${mode}`);
    }
  }

  // --- Modal Open / Close Logic ---
  function openModal(mode = 'login') {
    if (!modalOverlay) return;
    switchMode(mode);
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    // Reset hash without jump
    if (window.location.hash) {
      history.replaceState(null, null, window.location.pathname + window.location.search);
    }
  }

  // --- Event Listeners for Open Triggers ---
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const mode = trigger.getAttribute('data-open-modal') || 'login';
      openModal(mode);
    });
  });

  // Switch links (e.g. "Don't have an account? Register ->")
  document.querySelectorAll('[data-switch-mode]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetMode = link.getAttribute('data-switch-mode');
      switchMode(targetMode);
    });
  });

  // Close triggers
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Check URL hash on load
  const currentHash = window.location.hash.replace('#', '');
  if (['login', 'register', 'download'].includes(currentHash)) {
    if (modalOverlay) {
      openModal(currentHash);
    } else {
      switchMode(currentHash);
    }
  }

  // --- Password Visibility Toggles ---
  document.querySelectorAll('.btn-toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      // Update Eye Icon
      if (isPassword) {
        // Eye Off (slashed) icon
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        `;
      } else {
        // Eye Normal icon
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;
      }
    });
  });

  // --- Toast Notification System ---
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    
    const icon = type === 'success' 
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `
      ${icon}
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  // --- User Session State ---
  function updateUserSession() {
    const savedUser = localStorage.getItem('gtnation_user');
    if (savedUser && headerGuestActions && headerUserBadge) {
      const user = JSON.parse(savedUser);
      headerGuestActions.style.display = 'none';
      headerUserBadge.style.display = 'flex';
      if (headerUserName) {
        headerUserName.textContent = user.name || 'GTNation Member';
      }
    } else if (headerGuestActions && headerUserBadge) {
      headerGuestActions.style.display = 'flex';
      headerUserBadge.style.display = 'none';
    }
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('gtnation_user');
      updateUserSession();
      showToast('You have been signed out.');
    });
  }

  updateUserSession();

  // --- Login Form Submission ---
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const identifier = document.getElementById('loginIdentifier')?.value.trim();
      const password = document.getElementById('loginPassword')?.value;

      if (!identifier || !password) {
        showToast('Please fill in both email/phone and password.', 'error');
        return;
      }

      // Extract a friendly display name from email or default to Dan Mungufeni
      let displayName = 'Dan Mungufeni';
      if (identifier.includes('@')) {
        displayName = identifier.split('@')[0];
        displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      }

      const userSession = {
        name: displayName,
        identifier: identifier,
        role: 'Developer Member',
        loggedInAt: new Date().toISOString()
      };

      localStorage.setItem('gtnation_user', JSON.stringify(userSession));
      updateUserSession();
      showToast(`Welcome back, ${displayName}! Sign in successful.`);
      loginForm.reset();

      setTimeout(() => {
        closeModal();
      }, 700);
    });
  }

  // --- Register Form Submission ---
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('regFullName')?.value.trim();
      const email = document.getElementById('regEmail')?.value.trim();
      const phone = document.getElementById('regPhone')?.value.trim();
      const password = document.getElementById('regPassword')?.value;
      const confirmPassword = document.getElementById('regConfirmPassword')?.value;
      const role = document.getElementById('regRole')?.value;
      const termsAgree = document.getElementById('regTermsAgree')?.checked;

      if (!fullName || !email || !password || !confirmPassword) {
        showToast('Please complete all required fields.', 'error');
        return;
      }

      if (password.length < 8) {
        showToast('Password must be at least 8 characters long.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showToast('Passwords do not match. Please re-enter.', 'error');
        return;
      }

      if (!termsAgree) {
        showToast('Please agree to the Terms & Conditions.', 'error');
        return;
      }

      const userSession = {
        name: fullName,
        email: email,
        phone: phone || '+256 778 625624',
        role: role || 'Member',
        registeredAt: new Date().toISOString()
      };

      localStorage.setItem('gtnation_user', JSON.stringify(userSession));
      updateUserSession();
      showToast(`Account created successfully! Welcome to GTNationDEV, ${fullName}.`);
      registerForm.reset();

      setTimeout(() => {
        closeModal();
      }, 800);
    });
  }

  // --- Download Form & Asset Delivery ---
  if (downloadForm) {
    downloadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dlName = document.getElementById('dlName')?.value.trim();
      const dlEmail = document.getElementById('dlEmail')?.value.trim();
      const selectedPack = document.querySelector('input[name="downloadPack"]:checked')?.value || 'cv';
      const progressBox = document.getElementById('downloadProgressBox');
      const progressBar = document.getElementById('downloadProgressBar');
      const submitBtn = downloadForm.querySelector('.btn-auth-submit');

      if (!dlName || !dlEmail) {
        showToast('Please provide your name and email to download.', 'error');
        return;
      }

      // Show Progress Bar
      if (progressBox && progressBar) {
        progressBox.style.display = 'block';
        if (submitBtn) submitBtn.disabled = true;

        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          progressBar.style.width = `${progress}%`;
          
          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              // Trigger Real File Download
              triggerFileDownload(selectedPack, dlName);
              showToast(`Download started! Thank you ${dlName}.`);
              downloadForm.reset();
              progressBox.style.display = 'none';
              progressBar.style.width = '0%';
              if (submitBtn) submitBtn.disabled = false;
              
              setTimeout(() => {
                closeModal();
              }, 1200);
            }, 300);
          }
        }, 120);
      }
    });
  }

  // --- Trigger File Download Routine ---
  function triggerFileDownload(packType, requesterName) {
    const fileMap = {
      'cv': {
        url: 'assets/docs/Dan_Mungufeni_CV.html',
        filename: 'Dan_Mungufeni_CV.html'
      },
      'portfolio': {
        url: 'assets/docs/Dan_Mungufeni_CV.html',
        filename: 'GTNationDEV_Portfolio_Pack.html'
      },
      'tech': {
        url: 'assets/docs/Dan_Mungufeni_CV.html',
        filename: 'Dan_Mungufeni_Tech_Profile.html'
      }
    };

    const target = fileMap[packType] || fileMap['cv'];
    const anchor = document.createElement('a');
    anchor.href = target.url;
    anchor.download = target.filename;
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  // --- Social Auth Simulation ---
  document.querySelectorAll('.btn-social').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.textContent.trim();
      const mockUser = {
        name: `Dan Mungufeni (${provider})`,
        provider: provider,
        loggedInAt: new Date().toISOString()
      };
      localStorage.setItem('gtnation_user', JSON.stringify(mockUser));
      updateUserSession();
      showToast(`Authenticated seamlessly with ${provider}!`);
      setTimeout(() => closeModal(), 600);
    });
  });

  // Pack selector styling active state
  document.querySelectorAll('.pack-card-option').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.pack-card-option').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });
});
