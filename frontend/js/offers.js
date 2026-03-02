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

    const pending = this.requests.filter(r => r.status === 'pending');

    page.innerHTML = `
      <div class="page-content animate-fade-in-up">
        <div class="mb-6">
          <h1 class="page-title">Runner Mode</h1>
          <p class="page-subtitle">
            ${pending.length} pending ${pending.length === 1 ? 'request' : 'requests'} near you. Accept one to start delivering!
          </p>
        </div>

        <div class="request-list" id="runner-list">
          ${pending.length === 0
        ? '<p class="empty-state" style="padding:5rem 0">No pending requests right now. Check back soon!</p>'
        : pending.map(req => Dashboard._renderRequestCard(req, true)).join('')
      }
        </div>
      </div>
    `;

    this._bindEvents(page);
  },

  _bindEvents(page) {
    const self = this;

    page.querySelectorAll('[data-accept-id]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const id = this.getAttribute('data-accept-id');
        const user = Storage.getUser();
        if (!user) {
          Notifications.error('You must be logged in to accept orders.');
          return;
        }

        const request = self.requests.find(r => r.id === id);

        try {
          await db.collection('orders').doc(id).update({
            status: 'accepted',
            acceptedBy: user.name,
            acceptedByEmail: user.email
          });

          // Trigger "Email" notification for User 2 (Requester)
          await db.collection('notifications').add({
            toEmail: request.requesterEmail,
            message: `Order Accepted: Your order "${request.description}" (Hostel: ${request.hostel}, Room: ${request.room}) has been accepted by ${user.name}. 
             Runner Details: ${user.name} (${user.email}). 
             Order Details: ${request.description} to ${request.hostel}, Room ${request.room}.`,
            orderId: id,
            type: 'acceptance',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });

          sounds.success();
          Notifications.success('Delivery accepted! Head to the gate.');
        } catch (error) {
          console.error('Error accepting order:', error);
          Notifications.error('Failed to accept order.');
        }
      });
    });
  }
};
