import { useEffect, useRef } from 'react';

// Warm dust / ember specks that drift up. They speed up while you scroll fast
// (energyRef.current goes 0..1 and decays here), which hides the cut between scenes.
export default function Particles({ energyRef }) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let raf = 0;
    let parts = [];

    const make = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      vy: Math.random() * 0.25 + 0.05,
      vx: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.5 + 0.15,
      ph: Math.random() * 6.28,
    });

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = Array.from({ length: Math.round(Math.min(90, Math.max(24, w / 16))) }, make);
    };

    const draw = (t) => {
      const e = energyRef.current;
      energyRef.current = e * 0.94;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.vy + e * 2.4;
        p.x += p.vx + Math.sin(t / 1500 + p.ph) * 0.15;
        if (p.y < -4) {
          p.y = h + 4;
          p.x = Math.random() * w;
        }
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,214,150,${Math.min(1, p.a * (0.6 + e))})`;
        ctx.arc(p.x, p.y, p.r * (1 + e), 0, 6.283);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [energyRef]);

  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}
