/* ═══════════════════════════════════════════════════════════
   DIANOMY — Phone Collection Module
   Collects 10-digit Indian mobile number after Google Sign-in.
   (Simplified version: No OTP verification)
   ═══════════════════════════════════════════════════════════ */

const VerifyPhone = {
    loading: false,

    render() {
        const page = document.getElementById('page-verify-phone');
        if (!page) return;
        page.classList.add('active');
        page.innerHTML = '';
        page.className = 'page active auth-page animate-fade-in';

        const container = document.createElement('div');
        container.className = 'auth-container animate-fade-in-up';

        container.innerHTML = `
            <div class="glass-strong p-8" style="border-radius:var(--radius)">
                <div class="auth-header">
                    <div class="auth-icon-box orange animate-scale-in">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <h1 class="auth-title">Welcome to DIANOMY</h1>
                    <p class="auth-desc">Please enter your 10-digit mobile number to complete your profile.</p>
                </div>

                <div class="auth-step-container">
                    <div style="display:flex; flex-direction:column; gap:1.5rem; margin-top:2rem">
                        <div id="phone-error" class="error-box hidden"></div>
                        
                        <div>
                            <label class="form-label">Mobile Number</label>
                            <div style="display:flex; gap:0.5rem">
                                <div class="input-field" style="width:4.5rem; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.05); font-weight:600">+91</div>
                                <input type="tel" id="phone-number" class="input-field" placeholder="9876543210" maxlength="10" required style="flex:1; font-weight:600; letter-spacing:0.05em">
                            </div>
                            <p style="font-size:0.75rem; color:var(--muted-foreground); margin-top:0.5rem">Enter digits only (e.g. 9876543210)</p>
                        </div>

                        <button class="btn btn-primary w-full glow-coral" id="save-phone-btn" style="height:3.5rem; font-weight:700; font-size:1rem">
                            Complete Profile
                        </button>
                    </div>
                </div>

                <p class="auth-footer-text">This number will be used by runners to contact you for your deliveries.</p>
            </div>
        `;

        page.appendChild(container);
        this._bindEvents(container);
    },

    _showError(msg) {
        const el = document.getElementById('phone-error');
        if (!el) return;
        el.classList.remove('hidden');
        el.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            ${msg}
        `;
        sounds.error();
    },

    _hideError() {
        const el = document.getElementById('phone-error');
        if (el) el.classList.add('hidden');
    },

    async _handleSavePhone() {
        const phoneInput = document.getElementById('phone-number');
        const phone = phoneInput.value.trim();

        if (!/^\d{10}$/.test(phone)) {
            this._showError('Please enter a valid 10-digit mobile number.');
            return;
        }

        const fullPhone = `+91 ${phone}`;
        this._setLoading(true);
        this._hideError();

        try {
            const currentUser = Storage.getUser();
            if (!currentUser) {
                Router.navigate('#/login');
                return;
            }

            const updatedUser = {
                ...currentUser,
                phone: fullPhone
            };

            // Save to Firestore
            const userRef = db.collection('users').doc(currentUser.uid);
            await userRef.set({ phone: fullPhone }, { merge: true });

            // Save to Storage
            Storage.saveUser(updatedUser);

            sounds.success();
            Notifications.success('Profile completed successfully!');

            setTimeout(() => {
                Router.navigate('#/profile');
            }, 8000); // 800ms for visual feedback

        } catch (error) {
            console.error('[DIANOMY] Save Phone Error:', error);
            this._showError('Failed to save phone number. Please check your connection.');
            this._setLoading(false);
        }
    },

    _setLoading(loading) {
        this.loading = loading;
        const btn = document.getElementById('save-phone-btn');
        if (!btn) return;
        btn.disabled = loading;
        if (loading) {
            btn.innerHTML = `<span class="spinner"></span> Saving...`;
        } else {
            btn.innerHTML = 'Complete Profile';
        }
    },

    _bindEvents(container) {
        const phoneInput = container.querySelector('#phone-number');
        const saveBtn = container.querySelector('#save-phone-btn');

        if (phoneInput) {
            // Block non-digit characters
            phoneInput.addEventListener('input', (e) => {
                const val = e.target.value;
                e.target.value = val.replace(/\D/g, ''); // Remove any non-digits
            });

            phoneInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this._handleSavePhone();
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                sounds.click();
                this._handleSavePhone();
            });
        }
    }
};
