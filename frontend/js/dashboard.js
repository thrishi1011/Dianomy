/* ═══════════════════════════════════════════════════════════
   DIANOMY — Dashboard Page
   Delivery requests list with tabs.
   ═══════════════════════════════════════════════════════════ */

const Dashboard = {
  requests: [],
  activeTab: 'All',
  searchQuery: '',
  tabs: ['All', 'Pending', 'Accepted', 'Waiting Confirmation', 'Delivered', 'Not Delivered'],

  init() {
    this._listenToOrders();
  },

  _listenToOrders() {
    if (this._unsubscribe) this._unsubscribe();
    this._unsubscribe = db.collection('orders')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        this.requests = snapshot.docs.map(doc => {
          const data = doc.data();
          // Convert timestamp to string for display if needed
          return Object.assign({ id: doc.id }, data, {
            arrivalTime: data.arrivalTime || 'TBD'
          });
        });
        if (Router.currentRoute === '#/dashboard') {
          this.render();
        }
      });
  },

  render() {
    const page = document.getElementById('page-dashboard');
    if (!page) return;
    page.classList.add('active');
    page.className = 'page active dashboard-page';

    let filtered = this.activeTab === 'All'
      ? this.requests.filter(r => r.status !== 'delivered' && r.status !== 'not_delivered')
      : this.requests.filter(r => r.status === this.activeTab.toLowerCase().replace(' ', '_'));

    if (this.searchQuery && (this.activeTab === 'Delivered' || this.activeTab === 'Not Delivered')) {
      filtered = filtered.filter(r => r.description.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }

    const counts = {
      All: this.requests.filter(r => r.status !== 'delivered' && r.status !== 'not_delivered').length,
      Pending: this.requests.filter(r => r.status === 'pending').length,
      Accepted: this.requests.filter(r => r.status === 'accepted').length,
      'Waiting Confirmation': this.requests.filter(r => r.status === 'waiting_confirmation').length,
      Delivered: this.requests.filter(r => r.status === 'delivered').length,
      'Not Delivered': this.requests.filter(r => r.status === 'not_delivered').length
    };

    page.innerHTML = `
      <div class="page-content animate-fade-in-up">
        <div class="mb-6">
          <h1 class="page-title">Delivery Requests</h1>
          <p class="page-subtitle">Browse and manage campus deliveries</p>
        </div>

        <div class="tabs mb-6">
          ${this.tabs.map(tab => `
            <button class="tab-btn ${this.activeTab === tab ? 'active' : ''}" data-tab="${tab}">
              ${tab} (${counts[tab]})
            </button>
          `).join('')}
        </div>

        ${(this.activeTab === 'Delivered' || this.activeTab === 'Not Delivered') ? `
          <div class="search-container mb-6 animate-fade-in">
            <div style="position:relative">
              <input type="text" id="dashboard-search" class="input-field" placeholder="Search orders by name..." value="${this.searchQuery}" style="padding-left:2.75rem">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position:absolute; left:1rem; top:50%; transform:translateY(-50%); color:var(--muted-foreground)"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
        ` : ''}

        <div class="request-list" id="request-list">
          ${filtered.length === 0
        ? '<p class="empty-state">No requests in this category yet.</p>'
        : filtered.map(req => this._renderRequestCard(req, false)).join('')
      }
        </div>
      </div>
    `;

    this._bindEvents(page);
  },

  _renderRequestCard(req, showAccept) {
    const statusClass = 'badge-' + req.status;
    const isRequester = Storage.getUser()?.email === req.requesterEmail;
    const canViewRunner = !showAccept && isRequester && (req.status === 'accepted' || req.status === 'waiting_confirmation' || req.status === 'delivered' || req.status === 'not_delivered');

    return `
      <div class="glass card card-hover p-6 animate-fade-in-up ${canViewRunner ? 'cursor-pointer' : ''}" 
           data-request-id="${req.id}" 
           ${canViewRunner ? 'data-view-runner="true"' : ''}
           style="padding:1.25rem">
        <div class="request-card-header">
          <div>
            <h3 class="request-title">${req.description}</h3>
            <p class="request-subtitle">
              by ${req.requester}
              ${req.runnerName ? `<br><span style="color:var(--primary); font-size:0.7rem; font-weight:600">Accepted by ${req.runnerName}</span>` : ''}
            </p>
          </div>
          <span class="badge ${statusClass}">${req.status.replace('_', ' ')}</span>
        </div>
        ${canViewRunner ? `<p style="font-size:0.75rem; color:var(--primary); margin-top:-0.5rem; margin-bottom:0.75rem; font-weight:600">Click to view Runner details</p>` : ''}
        <div class="request-meta">
          <span class="request-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary)"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            ${req.hostel}, Room ${req.room}
          </span>
          <span class="request-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${req.arrivalTime}
          </span>
          <span class="request-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)"><path d="M6 3h12l4 6-10 13L2 9Z"/></svg>
            ₹${req.reward}
          </span>
        </div>
        ${!showAccept && Storage.getUser()?.email === req.acceptedByEmail && req.deliveryInstructions ? `
          <div class="glass card p-6 mt-4" style="background: hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.1); border: 1px solid hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.2); border-radius: var(--radius-sm)">
            <p style="font-size:0.75rem; font-weight:700; color:var(--primary); margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.05em">Delivery Instructions</p>
            <p style="font-size:0.95rem; color:var(--foreground); line-height:1.6; padding: 0.5rem; background: rgba(0,0,0,0.2); border-radius: 4px;">${req.deliveryInstructions}</p>
          </div>
        ` : ''}
        
        ${(req.status === 'delivered' || req.status === 'not_delivered') ? `
          <div class="mt-4 pt-4 border-t" style="border-color: hsla(0,0%,100%,0.05); display: flex; flex-direction: column; gap: 0.25rem;">
            <p style="font-size:0.7rem; color:var(--muted-foreground)">Posted on: <span style="color:var(--foreground)">${req.createdAt ? new Date(req.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</span></p>
            ${req.acceptedAt ? `<p style="font-size:0.7rem; color:var(--muted-foreground)">Accepted on: <span style="color:var(--foreground)">${new Date(req.acceptedAt.seconds * 1000).toLocaleString()}</span></p>` : ''}
          </div>
        ` : ''}
        ${showAccept && req.status === 'pending' ? `
          <button class="btn btn-primary w-full hover-glow-coral" data-accept-id="${req.id}">
            Accept & Deliver
          </button>
        ` : ''}
        ${!showAccept && req.status === 'accepted' ? `
          <button class="btn btn-outline w-full" data-deliver-id="${req.id}" style="margin-top:0.5rem">
            Mark as Delivered
          </button>
        ` : ''}
        ${!showAccept && req.status === 'waiting_confirmation' && Storage.getUser()?.email === req.requesterEmail ? `
          <div style="display:flex; gap:0.5rem; margin-top:0.5rem">
            <button class="btn btn-primary" data-confirm-id="${req.id}" style="flex:1">Confirm Delivered</button>
            <button class="btn btn-outline" data-reject-id="${req.id}" style="flex:1; border-color:var(--destructive); color:var(--destructive)">Not Delivered</button>
          </div>
        ` : ''}
        ${!showAccept && req.status === 'waiting_confirmation' && Storage.getUser()?.email !== req.requesterEmail ? `
          <p class="empty-state" style="font-size:0.75rem; margin-top:0.5rem">Waiting for requester to confirm delivery...</p>
        ` : ''}
      </div>
    `;
  },

  _bindEvents(page) {
    const self = this;

    // Tab clicks
    page.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        self.activeTab = this.getAttribute('data-tab');
        sounds.click();
        self.render();
      });
    });

    // Search events
    const searchInput = page.querySelector('#dashboard-search');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        self.searchQuery = this.value;
        const list = document.getElementById('request-list');
        const filtered = self.activeTab === 'Delivered'
          ? self.requests.filter(r => r.status === 'delivered')
          : self.requests.filter(r => r.status === 'not_delivered');

        const matching = filtered.filter(r => r.description.toLowerCase().includes(self.searchQuery.toLowerCase()));

        list.innerHTML = matching.length === 0
          ? '<p class="empty-state">No matching orders found.</p>'
          : matching.map(req => self._renderRequestCard(req, false)).join('');
      });
    }

    // Mark as Delivered clicks (Runner action)
    page.querySelectorAll('[data-deliver-id]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const id = this.getAttribute('data-deliver-id');
        const req = self.requests.find(r => r.id === id);
        try {
          await db.collection('orders').doc(id).update({
            status: 'waiting_confirmation'
          });

          // Notify Requester
          await db.collection('notifications').add({
            toEmail: req.requesterEmail,
            message: `Action Required: Your runner ${req.acceptedBy} has marked your order "${req.description}" as delivered. Please confirm in the app.`,
            orderId: id,
            type: 'delivery_confirmation',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });

          sounds.success();
          Notifications.success('Notified requester! Waiting for confirmation.');
        } catch (error) {
          Notifications.error('Failed to update status.');
        }
      });
    });

    // Confirm Delivery clicks (Requester action)
    page.querySelectorAll('[data-confirm-id]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const id = this.getAttribute('data-confirm-id');
        try {
          await db.collection('orders').doc(id).update({
            status: 'delivered'
          });
          sounds.success();
          Notifications.success('Order delivered successfully!');
        } catch (error) {
          Notifications.error('Failed to confirm delivery.');
        }
      });
    });

    // Reject Delivery clicks (Requester action)
    page.querySelectorAll('[data-reject-id]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const id = this.getAttribute('data-reject-id');
        try {
          await db.collection('orders').doc(id).update({
            status: 'not_delivered'
          });
          sounds.error();
          Notifications.error('Marked as Not Delivered. Check the Not Delivered tab for details.');
        } catch (error) {
          Notifications.error('Failed to update status.');
        }
      });
    });

    // View Runner Details clicks (Requester action)
    page.querySelectorAll('[data-view-runner="true"]').forEach(function (card) {
      card.addEventListener('click', function (e) {
        // Prevent if clicking other buttons inside card
        if (e.target.closest('button')) return;

        const id = this.getAttribute('data-request-id');
        const req = self.requests.find(r => r.id === id);
        if (req && req.runnerName) {
          self.showRunnerDetailsDialog(req);
        }
      });
    });
  },

  showRunnerDetailsDialog(req) {
    const existing = document.getElementById('runner-details-dialog');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'runner-details-dialog';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-backdrop" id="runner-details-backdrop"></div>
      <div class="modal-content">
        <div class="glass-strong p-6" style="border-radius:var(--radius)">
          <div style="width:3rem;height:3rem;border-radius:50%;background:hsla(var(--primary-h),var(--primary-s),var(--primary-l),0.15);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;color:var(--primary)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h2 style="font-family:var(--font-display);font-size:1.125rem;font-weight:700;color:var(--foreground);margin-bottom:0.25rem;text-align:center">Runner Details</h2>
          <p style="font-size:0.875rem;color:${req.status === 'not_delivered' ? 'var(--destructive)' : 'var(--muted-foreground)'};margin-bottom:1.5rem;text-align:center;font-weight:${req.status === 'not_delivered' ? '600' : '400'}">
            ${req.status === 'not_delivered' ? 'These are the details of the candidate, you find him with these details.' : 'This student is handling your delivery.'}
          </p>
          
          <div class="glass card p-6" style="margin-bottom:1.5rem; display:flex; flex-direction:column; align-items:center; text-align:center; border-radius:var(--radius)">
            <div style="margin-bottom:1.5rem">
              <label class="form-label" style="font-size:0.7rem; color:var(--muted-foreground)">FULL NAME</label>
              <p style="font-weight:700; font-size:1.25rem; color:var(--foreground); margin-top:0.25rem">${req.runnerName}</p>
            </div>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem; width:100%; margin-bottom:1.5rem">
              <div>
                <label class="form-label" style="font-size:0.7rem; color:var(--muted-foreground)">CLASS OF</label>
                <p style="font-weight:600; font-size:1rem; margin-top:0.15rem">${req.runnerYear || 'N/A'}</p>
              </div>
              <div>
                 <label class="form-label" style="font-size:0.7rem; color:var(--muted-foreground)">DEPARTMENT</label>
                 <p style="font-weight:600; font-size:0.9rem; margin-top:0.15rem">${req.runnerDept || 'N/A'}</p>
              </div>
            </div>

            <div style="width:100%; margin-bottom:1.5rem; padding-top:1rem; border-top:1px solid hsla(0,0%,100%,0.05)">
              <label class="form-label" style="font-size:0.7rem; color:var(--muted-foreground)">BRANCH</label>
              <p style="font-size:1rem; margin-top:0.15rem">${req.runnerBranch || 'N/A'}</p>
            </div>

            <div style="width:100%; margin-bottom:1.5rem; padding-top:1rem; border-top:1px solid hsla(0,0%,100%,0.05)">
              <label class="form-label" style="font-size:0.7rem; color:var(--muted-foreground)">EMAIL</label>
              <p style="font-size:0.9rem; margin-top:0.15rem; color:var(--foreground)">${req.acceptedByEmail}</p>
            </div>

            <div style="width:100%; padding-top:1rem; border-top:1px solid hsla(0,0%,100%,0.05)">
              <label class="form-label" style="font-size:0.7rem; color:var(--muted-foreground)">PHONE NUMBER</label>
              <p style="font-weight:800; font-size:1.35rem; color:var(--primary); margin-top:0.25rem">${req.runnerPhone || 'No phone provided'}</p>
            </div>
          </div>
          
          <button class="btn btn-primary w-full" id="details-close">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('runner-details-backdrop').addEventListener('click', () => overlay.remove());
    document.getElementById('details-close').addEventListener('click', () => { sounds.click(); overlay.remove(); });
  }
};
