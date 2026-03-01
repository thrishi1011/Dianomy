import React, { useEffect, useRef } from "react";

export const AnimatedBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w: number, h: number;
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        const mobile = () => window.innerWidth < 768;

        // Project Colors (Using commas for broader browser/canvas compatibility)
        const COLORS = {
            coral: "16, 90%, 58%", // var(--coral)
            teal: "190, 80%, 50%",  // var(--teal)
            background: "225, 30%, 8%", // Slightly lighter than body for debugging
        };

        class Node {
            x!: number;
            y!: number;
            vx!: number;
            vy!: number;
            r!: number;
            isCoral!: boolean;
            ph!: number;
            ps!: number;
            a!: number;

            constructor(randomY: boolean) {
                this.init(randomY);
            }

            init(ry: boolean) {
                this.x = Math.random() * w;
                this.y = ry ? Math.random() * h : h + 30;
                this.vx = (Math.random() - 0.5) * 0.22;
                this.vy = -(Math.random() * 0.16 + 0.06);
                this.r = Math.random() * 1.8 + 0.8;
                this.isCoral = Math.random() < 0.25;
                this.ph = Math.random() * Math.PI * 2;
                this.ps = 0.015 + Math.random() * 0.02;
                this.a = ry ? Math.random() * 0.8 + 0.2 : 0;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.ph += this.ps;
                if (this.a < 1) this.a = Math.min(1, this.a + 0.02);
                if (this.x < -60) this.x = w + 60;
                if (this.x > w + 60) this.x = -60;
                return this.y > -60;
            }

            draw() {
                const pulse = Math.sin(this.ph) * 0.5 + 0.5;
                const r = this.r + pulse * 1.5;
                const aa = this.a * (0.35 + pulse * 0.45); // Higher opacity

                if (this.isCoral) {
                    const g = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 7);
                    g.addColorStop(0, `hsla(${COLORS.coral}, ${aa * 0.3})`);
                    g.addColorStop(1, `hsla(${COLORS.coral}, 0)`);
                    ctx!.beginPath();
                    ctx!.arc(this.x, this.y, r * 7, 0, Math.PI * 2);
                    ctx!.fillStyle = g;
                    ctx!.fill();
                }

                ctx!.beginPath();
                ctx!.arc(this.x, this.y, r, 0, Math.PI * 2);
                ctx!.fillStyle = this.isCoral
                    ? `hsla(${COLORS.coral}, ${Math.min(1, aa * 1.5)})`
                    : `hsla(${COLORS.teal}, ${Math.min(1, aa * 1.3)})`;
                ctx!.fill();
            }
        }

        class Packet {
            a: Node;
            b: Node;
            t: number;
            spd: number;
            isCoral: boolean;
            trail: { x: number; y: number }[];

            constructor(from: Node, to: Node) {
                this.a = from;
                this.b = to;
                this.t = 0;
                this.spd = 0.007 + Math.random() * 0.006;
                this.isCoral = Math.random() < 0.45;
                this.trail = [];
            }

            get x() { return this.a.x + (this.b.x - this.a.x) * this.t }
            get y() { return this.a.y + (this.b.y - this.a.y) * this.t }

            update() {
                this.t += this.spd;
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > 16) this.trail.shift();
                return this.t < 1;
            }

            draw() {
                for (let i = 0; i < this.trail.length; i++) {
                    const p = i / this.trail.length;
                    ctx!.beginPath();
                    ctx!.arc(this.trail[i].x, this.trail[i].y, 2 * p, 0, Math.PI * 2);
                    ctx!.fillStyle = this.isCoral
                        ? `hsla(${COLORS.coral}, ${p * 0.55})`
                        : `hsla(${COLORS.teal}, ${p * 0.45})`;
                    ctx!.fill();
                }

                const g = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, 12);
                g.addColorStop(0, this.isCoral ? `hsla(${COLORS.coral}, 0.5)` : `hsla(${COLORS.teal}, 0.4)`);
                g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, 12, 0, Math.PI * 2);
                ctx!.fillStyle = g;
                ctx!.fill();

                ctx!.beginPath();
                ctx!.arc(this.x, this.y, 2.8, 0, Math.PI * 2);
                ctx!.fillStyle = `hsla(${this.isCoral ? COLORS.coral : COLORS.teal}, 1.0)`;
                ctx!.fill();
            }
        }

        let hexes: any[] = [], stars: any[] = [], nodes: Node[] = [], pkts: Packet[] = [];
        let pktTimer = 0, auroraT = 0;

        const DIST = () => mobile() ? 115 : 160;

        function initHex() {
            hexes = [];
            const n = mobile() ? 5 : 10;
            for (let i = 0; i < n; i++) hexes.push({
                x: Math.random() * w,
                y: Math.random() * h,
                sz: 55 + Math.random() * 170,
                rot: Math.random() * Math.PI * 2,
                rs: (Math.random() - 0.5) * 0.0008,
                a: 0.02 + Math.random() * 0.05,
                isCoral: Math.random() < 0.3
            });
        }

        function initStars() {
            stars = [];
            const n = mobile() ? 60 : 140;
            for (let i = 0; i < n; i++) stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 0.9 + 0.15,
                ph: Math.random() * Math.PI * 2,
                spd: 0.25 + Math.random() * 1.1,
                ba: 0.06 + Math.random() * 0.18
            });
        }

        function initElements() {
            initHex();
            initStars();
            const n = mobile() ? 28 : 62;
            nodes = Array.from({ length: n }, () => new Node(true));
            pkts = [];
        }

        function resize() {
            w = canvas!.width = window.innerWidth;
            h = canvas!.height = window.innerHeight;
            initElements();
        }

        let rafId: number;
        function frame(ts: number) {
            rafId = requestAnimationFrame(frame);
            ctx!.clearRect(0, 0, w, h);

            // Background
            ctx!.fillStyle = `hsl(${COLORS.background})`;
            ctx!.fillRect(0, 0, w, h);

            // Aurora glow
            auroraT += 0.007;
            const breath = Math.sin(auroraT) * 0.5 + 0.5;
            const acx = w * 0.5 + (mx - w * 0.5) * 0.05;
            const acy = h * 0.5 + (my - h * 0.5) * 0.05;
            const ar = Math.min(w, h) * 0.42 * (0.8 + breath * 0.2);

            // Coral Glow
            const ag1 = ctx!.createRadialGradient(acx, acy, 0, acx, acy, ar);
            ag1.addColorStop(0, `hsla(${COLORS.coral}, ${0.06 + breath * 0.03})`);
            ag1.addColorStop(1, 'rgba(0,0,0,0)');
            ctx!.fillStyle = ag1;
            ctx!.fillRect(0, 0, w, h);

            // Teal Glow
            const ag2 = ctx!.createRadialGradient(acx + 120, acy - 90, 0, acx, acy, ar * 1.5);
            ag2.addColorStop(0, `hsla(${COLORS.teal}, ${0.03 + breath * 0.02})`);
            ag2.addColorStop(1, 'rgba(0,0,0,0)');
            ctx!.fillStyle = ag2;
            ctx!.fillRect(0, 0, w, h);

            // Stars
            stars.forEach(s => {
                const a = s.ba * (0.45 + 0.55 * Math.sin(s.ph + ts * 0.001 * s.spd));
                ctx!.beginPath();
                ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx!.fillStyle = `hsla(210, 40%, 96%, ${a})`;
                ctx!.fill();
            });

            // Hexagons
            hexes.forEach(h => {
                h.rot += h.rs;
                ctx!.save();
                ctx!.translate(h.x, h.y);
                ctx!.rotate(h.rot);
                ctx!.beginPath();
                for (let i = 0; i < 6; i++) {
                    const a = (Math.PI / 3) * i;
                    if (i === 0) ctx!.moveTo(h.sz * Math.cos(a), h.sz * Math.sin(a));
                    else ctx!.lineTo(h.sz * Math.cos(a), h.sz * Math.sin(a));
                }
                ctx!.closePath();
                ctx!.strokeStyle = h.isCoral
                    ? `hsla(${COLORS.coral}, ${h.a * 0.9})`
                    : `hsla(220, 15%, 55%, ${h.a * 0.7})`;
                ctx!.lineWidth = 1;
                ctx!.stroke();
                ctx!.restore();
            });

            // Parallax
            const px = (mx / (w || 1) - 0.5) * 12;
            const py = (my / (h || 1) - 0.5) * 8;

            // Connections
            const D = DIST();
            ctx!.save();
            ctx!.translate(px, py);
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i], b = nodes[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < D) {
                        const op = (1 - d / D) * 0.2 * Math.min(a.a, b.a); // Higher opacity
                        const lg = ctx!.createLinearGradient(a.x, a.y, b.x, b.y);
                        lg.addColorStop(0, a.isCoral ? `hsla(${COLORS.coral}, ${op})` : `hsla(220, 15%, 55%, ${op})`);
                        lg.addColorStop(1, b.isCoral ? `hsla(${COLORS.coral}, ${op})` : `hsla(220, 15%, 55%, ${op})`);
                        ctx!.beginPath();
                        ctx!.moveTo(a.x, a.y);
                        ctx!.lineTo(b.x, b.y);
                        ctx!.strokeStyle = lg;
                        ctx!.lineWidth = 0.8;
                        ctx!.stroke();
                    }
                }
            }

            // Nodes
            nodes = nodes.filter(n => n.update());
            nodes.forEach(n => n.draw());
            ctx!.restore();
            while (nodes.length < (mobile() ? 28 : 62)) nodes.push(new Node(false));

            // Packets
            pktTimer++;
            const interval = mobile() ? 55 : 30;
            if (pktTimer > interval && nodes.length > 8) {
                pktTimer = 0;
                const from = nodes[Math.floor(Math.random() * nodes.length)];
                const near = nodes.filter(n => {
                    if (n === from) return false;
                    const dx = n.x - from.x, dy = n.y - from.y;
                    return Math.sqrt(dx * dx + dy * dy) < DIST();
                });
                if (near.length) {
                    pkts.push(new Packet(from, near[Math.floor(Math.random() * near.length)]));
                    if (pkts.length > (mobile() ? 10 : 20)) pkts.splice(0, 1);
                }
            }
            pkts = pkts.filter(p => p.update());
            ctx!.save();
            ctx!.translate(px, py);
            pkts.forEach(p => p.draw());
            ctx!.restore();
        }

        const handleMouseMove = (e: MouseEvent) => {
            mx = e.clientX;
            my = e.clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches[0]) {
                mx = e.touches[0].clientX;
                my = e.touches[0].clientY;
            }
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        resize();
        rafId = requestAnimationFrame(frame);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{
                zIndex: -1,
                width: '100%',
                height: '100%',
                display: 'block',
                background: '#030A18' // Fallback solid color
            }}
        />
    );
};
