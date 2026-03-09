/* ═══════════════════════════════════════════════════════════
   DIANOMY — Auth Page (Login / OTP)
   Vanilla JS port of auth.tsx
   ═══════════════════════════════════════════════════════════ */

const Auth = {
  loading: false,

  render() {
    const page = document.getElementById('page-login');
    if (!page) return;
    page.classList.add('active');
    page.innerHTML = '';
    page.className = 'page active auth-page animate-fade-in';

    const container = document.createElement('div');
    container.className = 'auth-container animate-fade-in-up';

    container.innerHTML = `
      <button class="auth-back-link" id="auth-back">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        Back to Home
      </button>

      <div class="glass-strong p-8" style="border-radius:var(--radius)">
        <div class="auth-header">
          <div class="auth-icon-box coral animate-scale-in">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
          <h1 class="auth-title">Welcome to DIANOMY</h1>
          <p class="auth-desc">Sign in with your @student.nitw.ac.in account</p>
        </div>

        <div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:2rem">
          <div id="auth-error" class="error-box hidden" style="margin-bottom:1rem"></div>

          <button class="btn btn-outline w-full" id="google-signin-btn" style="height:3.5rem; font-size:1rem; font-weight:600">
            <svg width="22" height="22" viewBox="0 0 24 24" style="margin-right:0.5rem">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p class="auth-footer-text">Only NITW student emails are authorized to access this platform.</p>
      </div>
    `;

    page.appendChild(container);
    this._bindEvents(container);
  },

  _showError(msg) {
    const el = document.getElementById('auth-error');
    if (!el) return;
    el.classList.remove('hidden');
    el.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      ${msg}
    `;
  },

  _hideError() {
    const el = document.getElementById('auth-error');
    if (el) el.classList.add('hidden');
  },

  _setLoading(loading) {
    this.loading = loading;
    const btn = document.getElementById('google-signin-btn');
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
      btn.innerHTML = `<span class="spinner"></span> Signing in...`;
    } else {
      btn.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" style="margin-right:0.5rem">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      `;
    }
  },

  _bindEvents(container) {
    const self = this;

    const backBtn = container.querySelector('#auth-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => Router.navigate('#/'));
    }

    const googleBtn = container.querySelector('#google-signin-btn');
    if (googleBtn) {
      googleBtn.addEventListener('click', async function () {
        self._hideError();
        self._setLoading(true);
        sounds.click();
        try {
          const result = await auth.signInWithPopup(googleProvider);
          const user = result.user;

          if (user.email && !user.email.endsWith('@student.nitw.ac.in')) {
            console.warn('[DIANOMY] Unauthorized domain:', user.email);
            await auth.signOut();
            self._setLoading(false);
            self._showError('Invalid Email: Only @student.nitw.ac.in accounts are allowed.');
            sounds.error();
            return;
          }

          console.log('[DIANOMY] Google Sign-in Success:', user.email);

          // Auto-extract data from email
          const extractedData = Utils.extractNitwEmailData(user.email) || {};

          // Map user data for the Profile page
          const userData = {
            uid: user.uid,
            email: user.email || '',
            name: user.displayName || 'NITW Student',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            provider: 'google',
            avatarInitial: (user.displayName || 'U').charAt(0).toUpperCase(),
            rollNumber: user.email ? user.email.split('@')[0] : 'NITW Student',
            year: extractedData.year || 'Unknown',
            department: extractedData.department || 'Unknown',
            branch: extractedData.branch || 'Unknown',
            hostel: 'Not set',
            phone: user.phoneNumber || ''
          };

          // Save to storage IMMEDIATELY before navigating to fix the race condition
          Storage.saveUser(userData);

          // Proactively sync to Firestore during login as well to ensure persistence
          try {
            await db.collection('users').doc(user.uid).set(userData, { merge: true });
            console.log('[DIANOMY] Profile synced to DB on login');
          } catch (e) {
            console.error('[DIANOMY] Failed to sync on login:', e);
          }

          self._setLoading(false);

          // Check if phone verification is needed
          if (!userData.phone || userData.phone === '+91 XXXXX XXXXX' || userData.phone === '') {
            console.log('[DIANOMY] Phone verification required.');
            Router.navigate('#/verify-phone');
          } else {
            Router.navigate('#/profile');
          }
        } catch (error) {
          console.error('[DIANOMY] Google Sign-in Error:', error);

          if (error.code === 'auth/popup-blocked') {
            console.log('[DIANOMY] Popup blocked, falling back to redirect...');
            try {
              await auth.signInWithRedirect(googleProvider);
              return; // Browser will redirect
            } catch (redirError) {
              console.error('[DIANOMY] Redirect sign-in failed:', redirError);
              self._showError('Login failed: Popup was blocked and redirect failed.');
            }
          } else {
            self._showError(error.message);
          }

          self._setLoading(false);
          sounds.error();
        }
      });
    }
  }
};
