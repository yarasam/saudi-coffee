import { useEffect, useMemo, useRef } from 'react';
import { scenes, hero, closing, ui, INTRO, OUTRO, VIDEO } from './scenes';
import { clamp, smooth } from './utils';
import Particles from './Particles';

const N = scenes.length;
const LAST = N - 1;
const SPAN = LAST + INTRO + OUTRO; // total scroll length, in "scene steps"
const SCREENS_PER_STEP = 1.4; // how many screens of scrolling one step takes
const HOLD = 0.22; // share of each step where the scene sits still before/after the crossfade

export default function Journey({ lang }) {
  const other = lang === 'ar' ? 'en' : 'ar';

  const wrap = useRef(null);
  const layers = useRef([]);
  const caps = useRef([]);
  const dots = useRef([]);
  const heroEl = useRef(null);
  const closeEl = useRef(null);
  const shadeEl = useRef(null);
  const barEl = useRef(null);
  const video = useRef(null);
  const energy = useRef(0);
  const videoOk = useRef(true);
  const kick = useRef(() => {});

  const nf = useMemo(
    () => new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en', { minimumIntegerDigits: 2, useGrouping: false }),
    [lang],
  );

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const st = { target: 0, current: 0 };
    let raf = 0;
    let last = 0;
    let activeDot = -1;

    const hasVideo = (i) => videoOk.current && i === VIDEO.from;

    // s = position in scene steps: 0 is scene 1, LAST is scene 8; negative = intro.
    const apply = (s, p) => {
      // 1. Scene images: each one fades in over the previous one and pushes in as it leaves.
      for (let i = 0; i < N; i += 1) {
        const el = layers.current[i];
        if (!el) continue;
        const u = s - i;
        if (u < -1.001 || u > 1.001) {
          el.style.visibility = 'hidden';
          continue;
        }
        el.style.visibility = 'visible';
        let fade = 1;
        if (i > 0) {
          let tf = clamp((s - (i - 1) - HOLD) / (1 - 2 * HOLD));
          if (hasVideo(i - 1)) tf = clamp((tf - 0.96) / 0.04); // the video covers this step
          fade = smooth(tf);
        }
        const zoomIn = i > 0 && hasVideo(i - 1) ? 0 : 0.12;
        const zoomOut = hasVideo(i) ? 0 : 0.16;
        const scale = reduce ? 1 : 1 + (u < 0 ? zoomIn * Math.min(-u, 1) : zoomOut * Math.min(u, 1));
        el.style.opacity = fade;
        el.style.transform = `scale(${scale.toFixed(4)})`;
      }

      // 2. The morph video is scrubbed by scroll.
      const v = video.current;
      if (v) {
        const f = s - VIDEO.from;
        const tf = clamp((f - HOLD) / (1 - 2 * HOLD));
        let op = 0;
        if (videoOk.current && f > 0 && f < 1) {
          op = clamp((tf - 0.96) / 0.04) >= 1 ? 0 : clamp(tf / 0.03);
        }
        v.style.opacity = op;
        if (videoOk.current && f > -0.1 && f < 1.1 && v.readyState >= 1 && v.duration) {
          const t = Math.min(v.duration - 0.05, tf * v.duration);
          if (!v.seeking && Math.abs(v.currentTime - t) > 0.02) v.currentTime = t;
        }
      }

      // 3. Captions.
      for (let i = 0; i < N; i += 1) {
        const el = caps.current[i];
        if (!el) continue;
        const u = s - i;
        const op = i === 0 && s < 0 ? clamp((s + 0.15) / 0.15) : 1 - smooth(clamp((Math.abs(u) - 0.12) / 0.2));
        el.style.opacity = op;
        el.style.visibility = op > 0.01 ? 'visible' : 'hidden';
        el.style.transform = `translate3d(0, ${(clamp(u, -1, 1) * -80).toFixed(1)}px, 0)`;
      }

      // 4. Title screen and closing screen.
      const h = clamp((s + 0.5) / 0.3);
      if (heroEl.current) {
        heroEl.current.style.opacity = 1 - h;
        heroEl.current.style.visibility = h < 1 ? 'visible' : 'hidden';
        heroEl.current.style.transform = `translate3d(0, ${(-h * 40).toFixed(1)}px, 0)`;
      }
      const c = smooth(clamp((s - (LAST + 0.3)) / 0.2));
      if (closeEl.current) {
        closeEl.current.style.opacity = c;
        closeEl.current.style.visibility = c > 0.01 ? 'visible' : 'hidden';
        closeEl.current.style.pointerEvents = c > 0.6 ? 'auto' : 'none';
      }
      if (shadeEl.current) shadeEl.current.style.opacity = c * 0.6;

      // 5. Progress bar and dots.
      if (barEl.current) barEl.current.style.transform = `scaleX(${p.toFixed(4)})`;
      const act = clamp(Math.round(s), 0, LAST);
      if (act !== activeDot) {
        dots.current.forEach((d, i) => {
          if (!d) return;
          d.classList.toggle('on', i === act);
          if (i === act) d.setAttribute('aria-current', 'true');
          else d.removeAttribute('aria-current');
        });
        activeDot = act;
      }
    };

    const read = () => {
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const max = r.height - window.innerHeight;
      st.target = max > 0 ? clamp(-r.top / max) : 0;
    };

    // Eases the displayed position toward the real scroll position for a smoother, filmic feel.
    const tick = (now) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      const k = reduce ? 1 : 1 - Math.exp(-dt * 6.5);
      const before = st.current;
      st.current += (st.target - st.current) * k;
      if (Math.abs(st.target - st.current) < 0.00002) st.current = st.target;
      energy.current = Math.max(energy.current, clamp(Math.abs(st.current - before) * 900));
      apply(st.current * SPAN - INTRO, st.current);
      if (st.current !== st.target) raf = requestAnimationFrame(tick);
      else last = 0;
    };

    const onChange = () => {
      read();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    kick.current = onChange;
    read();
    st.current = st.target;
    apply(st.current * SPAN - INTRO, st.current);
    window.addEventListener('scroll', onChange, { passive: true });
    window.addEventListener('resize', onChange);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onChange);
      window.removeEventListener('resize', onChange);
    };
  }, []);

  const goTo = (i) => {
    const el = wrap.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const max = el.offsetHeight - window.innerHeight;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: top + ((i + INTRO) / SPAN) * max, behavior: reduce ? 'auto' : 'smooth' });
  };

  const total = nf.format(N);

  return (
    <section
      ref={wrap}
      className="journey"
      style={{ height: `${(SPAN * SCREENS_PER_STEP + 1) * 100}vh` }}
      aria-label={ui[lang].brand}
    >
      <div className="stage">
        {scenes.map((sc, i) => (
          <div
            key={sc.id}
            className="layer"
            ref={(el) => {
              layers.current[i] = el;
            }}
            style={{ zIndex: 2 * (i + 1), background: sc.fallback }}
          >
            <img
              src={sc.image}
              alt={sc[lang].alt}
              draggable="false"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ))}

        <video
          ref={video}
          className="morph"
          src={VIDEO.src}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          style={{ zIndex: 2 * (VIDEO.from + 1) + 1 }}
          onLoadedMetadata={() => kick.current()}
          onLoadedData={(e) => {
            // iOS only lets a video seek smoothly after it has been played once.
            const v = e.currentTarget;
            const p = v.play();
            if (p && p.then) p.then(() => v.pause()).catch(() => {});
          }}
          onError={() => {
            videoOk.current = false;
            kick.current();
          }}
        />

        <div ref={shadeEl} className="shade" />
        <div className="vignette" />
        <Particles energyRef={energy} />
        <div className="grain" />

        <div ref={heroEl} className="hero">
          <p className="kicker">{hero[lang].kicker}</p>
          <h1 className="hero-title">{hero[lang].title}</h1>
          <p className="hero-sub" lang={other}>
            {hero[other].title}
          </p>
          <div className="cue">
            <span>{ui[lang].scroll}</span>
            <i />
          </div>
        </div>

        {scenes.map((sc, i) => (
          <div
            key={sc.id}
            className="cap"
            ref={(el) => {
              caps.current[i] = el;
            }}
          >
            <div className="cap-meta">
              <span>{nf.format(i + 1)}</span>
              <i />
              <span>{total}</span>
            </div>
            <h2 className="cap-title">{sc[lang].title}</h2>
            <p className="cap-sub" lang={other}>
              {sc[other].title}
            </p>
            <p className="cap-text">{sc[lang].text}</p>
          </div>
        ))}

        <div ref={closeEl} className="closing">
          <h2>{closing[lang].title}</h2>
          <p lang={other}>{closing[other].title}</p>
          <button type="button" className="again" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {ui[lang].again}
          </button>
        </div>

        <nav className="dots" aria-label={ui[lang].scene}>
          {scenes.map((sc, i) => (
            <button
              key={sc.id}
              type="button"
              ref={(el) => {
                dots.current[i] = el;
              }}
              aria-label={`${ui[lang].scene} ${nf.format(i + 1)}: ${sc[lang].title}`}
              onClick={() => goTo(i)}
            />
          ))}
        </nav>

        <div className="progress" aria-hidden="true">
          <i ref={barEl} />
        </div>
      </div>
    </section>
  );
}
