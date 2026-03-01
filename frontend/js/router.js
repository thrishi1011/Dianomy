/* ═══════════════════════════════════════════════════════════
   DIANOMY — Hash-based SPA Router
   Replaces React Router with vanilla JS hash routing.
   ═══════════════════════════════════════════════════════════ */

const Router = {
    routes: {},
    currentRoute: null,
    afterNavigateCallbacks: [],

    register(hash, renderFn) {
        this.routes[hash] = renderFn;
    },

    navigate(hash) {
        window.location.hash = hash;
    },

    onAfterNavigate(cb) {
        this.afterNavigateCallbacks.push(cb);
    },

    handleRoute() {
        const hash = window.location.hash || '#/';
        const route = this.routes[hash];

        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

        if (route) {
            this.currentRoute = hash;
            route();
        } else {
            // 404
            this.currentRoute = '#/404';
            if (this.routes['#/404']) {
                this.routes['#/404']();
            }
        }

        // Update navbar active states
        this._updateNavbar(hash);

        // Scroll to top
        window.scrollTo(0, 0);

        // Fire callbacks
        this.afterNavigateCallbacks.forEach(cb => cb(hash));
    },

    _updateNavbar(hash) {
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkHash = link.getAttribute('data-route');
            if (linkHash === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update logo link behavior
        const logo = document.getElementById('navbar-logo');
        if (logo) {
            const isLoggedIn = Storage.isLoggedIn();
            logo.setAttribute('data-route', isLoggedIn ? '#/dashboard' : '#/');
        }

        // Show/hide logout button
        const logoutBtn = document.getElementById('nav-logout-btn');
        if (logoutBtn) {
            logoutBtn.style.display = Storage.isLoggedIn() ? 'flex' : 'none';
        }
    },

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        // Initial route
        this.handleRoute();
    }
};
