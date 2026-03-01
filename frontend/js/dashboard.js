/* ═══════════════════════════════════════════════════════════
   DIANOMY — Dashboard Page
   Delivery requests list with tabs.
   ═══════════════════════════════════════════════════════════ */

const Dashboard = {
  requests: [],
  activeTab: 'All',
  tabs: ['All', 'Pending', 'Accepted', 'Delivered'],

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

    // Filter by tab
    const filtered = this.activeTab === 'All'
      ? this.requests
      : this.requests.filter(r => r.status === this.activeTab.toLowerCase());

    const counts = {
      All: this.requests.length,
      Pending: this.requests.filter(r => r.status === 'pending').length,
      Accepted: this.requests.filter(r => r.status === 'accepted').length,
      Delivered: this.requests.filter(r => r.status === 'delivered').length
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
    return `
      <div class="glass card card-hover p-6 animate-fade-in-up" data-request-id="${req.id}" style="padding:1.25rem">
        <div class="request-card-header">
          <div>
            <h3 class="request-title">${req.description}</h3>
            <p class="request-subtitle">by ${req.requester}</p>
          </div>
          <span class="badge ${statusClass}">${req.status}</span>
        </div>
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

    // Mark as Delivered clicks
    page.querySelectorAll('[data-deliver-id]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const id = this.getAttribute('data-deliver-id');
        try {
          await db.collection('orders').doc(id).update({
            status: 'delivered'
          });
          sounds.success();
          Notifications.success('Delivery marked as completed!');
        } catch (error) {
          Notifications.error('Failed to update status.');
        }
      });
    });
  }
};
