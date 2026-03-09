/* ═══════════════════════════════════════════════════════════
   DIANOMY — Offers / Runner Mode Page
   Shows pending requests with accept functionality.
   ═══════════════════════════════════════════════════════════ */

const Offers = {
  requests: [],

  init() {
    this._listenToPendingOrders();
  },

  _listenToPendingOrders() {
    if (this._unsubscribe) this._unsubscribe();
    this._unsubscribe = db.collection('orders')
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        this.requests = snapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));
        if (Router.currentRoute === '#/runner') {
          this.render();
        }
      });
  },

  render() {
    const page = document.getElementById('page-runner');
    if (!page) return;
    page.classList.add('active');
    page.className = 'page active dashboard-page';

    const userEmail = Storage.getUser()?.email;
    const pendingOrders = this.requests.filter(r => r.status === 'pending' && r.requesterEmail !== userEmail);

    page.innerHTML = `
      <div class="page-content animate-fade-in-up">
        <div class="mb-6">
          <h1 class="page-title">Runner Mode</h1>
          <p class="page-subtitle">
            ${pendingOrders.length} pending ${pendingOrders.length === 1 ? 'request' : 'requests'} near you. Accept one to start delivering!
          </p>
        </div>

        <div class="request-list" id="runner-list">
          ${pendingOrders.length === 0
        ? '<p class="empty-state" style="padding:5rem 0">No pending requests right now. Check back soon!</p>'
        : pendingOrders.map(req => this._renderRequestCard(req)).join('')
      }
        </div>
      </div>
    `;

    this._bindEvents(page);
  },

  _bindEvents(page) {
    const self = this;

    page.querySelectorAll('[data-accept-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-accept-id');
        const user = Storage.getUser();
        if (!user) {
          Notifications.error('You must be logged in to accept orders.');
          return;
        }

        const request = self.requests.find(r => r.id === id);
        self.showAcceptanceDialog(request);
      });
    });
  },

  showAcceptanceDialog(request) {
    const existing = document.getElementById('acceptance-dialog');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'acceptance-dialog';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-backdrop" id="acceptance-backdrop"></div>
      <div class="modal-content">
        <div class="glass-strong p-6" style="border-radius:var(--radius)">
          <h2 style="font-family:var(--font-display);font-size:1.25rem;font-weight:700;color:var(--foreground);margin-bottom:0.5rem">Accept Delivery</h2>
          <p style="font-size:0.875rem;color:var(--muted-foreground);margin-bottom:1.5rem">Enter your details for the requester to see.</p>
          
          <div class="auth-form">
            <div class="glass card p-4 mb-6" style="background: hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.05);">
              <p style="font-size:0.875rem; color:var(--foreground); margin-bottom:0.5rem">Sharing your profile with requester:</p>
              <div style="font-size:0.75rem; color:var(--muted-foreground)">
                <p>• <b>Name:</b> ${Storage.getUser()?.name}</p>
                <p>• <b>Department:</b> ${Storage.getUser()?.department}</p>
                <p>• <b>Branch:</b> ${Storage.getUser()?.branch}</p>
                <p>• <b>Phone:</b> ${Storage.getUser()?.phone || 'Not set'}</p>
              </div>
            </div>
            
            <div style="display:flex;gap:0.75rem">
              <button class="btn btn-outline" style="flex:1" id="acceptance-cancel">Cancel</button>
              <button class="btn btn-primary" style="flex:2" id="acceptance-confirm">Accept Order</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('acceptance-backdrop').addEventListener('click', () => overlay.remove());
    document.getElementById('acceptance-cancel').addEventListener('click', () => { sounds.click(); overlay.remove(); });
    document.getElementById('acceptance-confirm').addEventListener('click', async () => {
      sounds.click();
      try {
        const user = Storage.getUser();
        await db.collection('orders').doc(request.id).update({
          status: 'accepted',
          acceptedBy: user.name,
          acceptedByEmail: user.email,
          runnerName: user.name,
          runnerRoll: user.rollNumber || user.email.split('@')[0],
          runnerYear: user.year || 'N/A',
          runnerDept: user.department || 'N/A',
          runnerBranch: user.branch || 'N/A',
          runnerPhone: user.phone || '',
          acceptedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Trigger notification
        await db.collection('notifications').add({
          toEmail: request.requesterEmail,
          message: `Order Accepted: Your order "${request.description}" has been accepted by ${user.name}.`,
          orderId: request.id,
          type: 'acceptance',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        overlay.remove();
        sounds.success();
        Notifications.success('Delivery accepted! Head to the gate.');
      } catch (error) {
        console.error('Error accepting order:', error);
        Notifications.error('Failed to accept order.');
      }
    });
  },

  _renderRequestCard(req) {
    return `
      <div class="glass card card-hover p-6 animate-fade-in-up" style="padding:1.25rem">
        <div class="request-card-header">
          <div>
            <h3 class="request-title">${req.description}</h3>
            <p class="request-subtitle">by ${req.requester}</p>
          </div>
          <span class="badge badge-pending">Pending</span>
        </div>
        <div class="request-meta">
          <span class="request-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary)"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            ${req.hostel}, Room ${req.room}
          </span>
          <span class="request-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${req.arrivalTime || 'TBD'}
          </span>
          <span class="request-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)"><path d="M6 3h12l4 6-10 13L2 9Z"/></svg>
            ₹${req.reward}
          </span>
        </div>
        <button class="btn btn-primary w-full hover-glow-coral" data-accept-id="${req.id}" style="margin-top:0.5rem">
          Accept & Deliver
        </button>
      </div>
    `;
  }
};
