const Profile = {
  render() {
    const page = document.getElementById('page-profile');
    page.classList.add('active');
    page.className = 'page active profile-page';

    const user = Storage.getUser();

    if (!user) {
      page.innerHTML = `
        <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.5rem;position:relative">
          <div class="glass-strong p-8 text-center animate-scale-in" style="max-width:24rem;border-radius:var(--radius)">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--muted-foreground);margin:0 auto 1rem;display:block"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <h2 style="font-family:var(--font-display);font-size:1.125rem;font-weight:700;color:var(--foreground);margin-bottom:0.5rem">Not signed in</h2>
            <p style="font-size:0.875rem;color:var(--muted-foreground);margin-bottom:1rem">Please log in to view your profile.</p>
            <button class="btn btn-primary glow-coral hover-glow-coral" id="profile-login-btn">Sign In</button>
          </div>
        </div>
      `;
      const loginBtn = page.querySelector('#profile-login-btn');
      if (loginBtn) loginBtn.addEventListener('click', () => Router.navigate('#/login'));
      return;
    }

    const userEmail = user.email;
    const ordersPosted = Dashboard.requests.filter(r => r.requesterEmail === userEmail).length;
    const ordersAccepted = Dashboard.requests.filter(r => (r.status === 'accepted' || r.status === 'waiting_confirmation' || r.status === 'delivered') && r.acceptedByEmail === userEmail).length;
    const ordersDelivered = Dashboard.requests.filter(r => r.status === 'delivered' && r.acceptedByEmail === userEmail).length;

    const googleBadge = user.provider === 'google' ? `
      <span class="glass-subtle profile-provider-badge">
        <svg width="12" height="12" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Signed in with Google
      </span>
    ` : '';

    page.innerHTML = `
      <div class="profile-content">
        <div class="animate-fade-in-up">
          <div class="glass-strong card profile-header p-8" style="border-radius:var(--radius)">
            <div class="profile-banner"></div>
            <div class="profile-avatar">
              <span class="profile-avatar-initial">${user.avatarInitial}</span>
            </div>
            
            <h1 class="profile-name">${user.name}</h1>
            <p class="profile-roll">${user.rollNumber || ''}</p>

            <div class="profile-details-grid">
              <div class="glass-subtle profile-detail-item">
                <span class="profile-detail-label">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  Class Of
                </span>
                <p class="profile-detail-value">${user.year}</p>
              </div>
              <div class="glass-subtle profile-detail-item">
                <span class="profile-detail-label">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  Department
                </span>
                <p class="profile-detail-value truncate" title="${user.department}">${user.department}</p>
              </div>
              <div class="glass-subtle profile-detail-item">
                <span class="profile-detail-label">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Phone
                </span>
                <p class="profile-detail-value">${user.phone}</p>
              </div>
              <div class="glass-subtle profile-detail-item">
                <span class="profile-detail-label">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-7-7 7"/><path d="M12 14V3"/></svg>
                  Branch
                </span>
                <p class="profile-detail-value">${user.branch || 'Auto-filled'}</p>
              </div>
            </div>

            ${googleBadge}
          </div>
        </div>
        
        <div class="profile-stats animate-fade-in-up delay-400">
          <div class="glass card card-hover profile-stat" style="border-radius:var(--radius)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="profile-stat-icon"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            <p class="profile-stat-value">${ordersPosted}</p>
            <p class="profile-stat-label">Orders Posted</p>
          </div>
          <div class="glass card card-hover profile-stat" style="border-radius:var(--radius)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="profile-stat-icon"><circle cx="12" cy="10" r="3"/><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/></svg>
            <p class="profile-stat-value">${ordersAccepted}</p>
            <p class="profile-stat-label">Orders Accepted</p>
          </div>
          <div class="glass card card-hover profile-stat" style="border-radius:var(--radius)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="profile-stat-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <p class="profile-stat-value">${ordersDelivered}</p>
            <p class="profile-stat-label">Orders Delivered</p>
          </div>
        </div>

        <div class="animate-fade-in delay-600">
          <button class="btn btn-destructive w-full" id="profile-logout-btn" style="margin-top:1rem;padding:0.75rem">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </div>
    `;

    this._bindEvents(page);
  },

  _bindEvents(page) {
    const logoutBtn = page.querySelector('#profile-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async function () {
        sounds.click();
        try {
          await auth.signOut();
          Storage.removeUser();
          Router.navigate('#/');
        } catch (err) {
          console.error('Logout error:', err);
          Notifications.error('Failed to sign out neatly.');
        }
      });
    }
  }
};
