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
            <div style="margin-bottom:1rem">
              <label class="form-label">Your Name</label>
              <input class="input-field" id="runner-name" placeholder="Enter your full name" required value="${Storage.getUser()?.name || ''}" />
            </div>
            <div style="margin-bottom:1.5rem">
              <label class="form-label">Roll Number</label>
              <input class="input-field" id="runner-roll" placeholder="Enter your roll number" required />
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
      const name = document.getElementById('runner-name').value.trim();
      const roll = document.getElementById('runner-roll').value.trim();

      if (!name || !roll) {
        Notifications.error('Please enter both name and roll number.');
        return;
      }

      sounds.click();
      try {
        const user = Storage.getUser();
        await db.collection('orders').doc(request.id).update({
          status: 'accepted',
          acceptedBy: user.name,
          acceptedByEmail: user.email,
          runnerName: name,
          runnerRoll: roll
        });

        // Trigger notification
        await db.collection('notifications').add({
          toEmail: request.requesterEmail,
          message: `Order Accepted: Your order "${request.description}" has been accepted by ${name} (Roll: ${roll}).`,
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
  }
};
