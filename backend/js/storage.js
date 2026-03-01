/* ═══════════════════════════════════════════════════════════
   DIANOMY — Storage Module
   SessionStorage helpers for auth state persistence.
   ═══════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'dianomy_user';

const Storage = {
  getUser() {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  saveUser(user) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch { /* noop */ }
  },

  removeUser() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch { /* noop */ }
  },

  isLoggedIn() {
    return this.getUser() !== null;
  },

  // Helpers for Email Link Auth
  saveUserEmail(email) {
    localStorage.setItem('dianomy_email_for_signin', email);
  },
  getStoredEmail() {
    return localStorage.getItem('dianomy_email_for_signin');
  },
  removeStoredEmail() {
    localStorage.removeItem('dianomy_email_for_signin');
  }
};
