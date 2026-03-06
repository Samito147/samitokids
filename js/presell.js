/* ==========================================================================
   presell.css — Criança Modo Turbo (Pre-sell)
   TEMA CLARO 2026 — INFANTIL (PARA PAIS), EMOCIONAL, PREMIUM, CONVERSÃO
   ✅ Mantém seletores originais (compatível com HTML/JS)
   ========================================================================== */

/* ===========================
   RESET / BASE
   =========================== */
*,
*::before,
*::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; scroll-behavior: smooth; }

body{
  margin: 0;
  font-family: ui-rounded, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans",
    "Apple Color Emoji", "Segoe UI Emoji";
  line-height: 1.55;
  color: var(--text);
  min-height: 100vh;
  padding-bottom: 76px; /* espaço para sticky CTA */
  background:
    radial-gradient(980px 680px at 10% 8%, rgba(0,214,190,.20), transparent 62%),
    radial-gradient(920px 640px at 92% 14%, rgba(255,77,139,.22), transparent 64%),
    radial-gradient(860px 620px at 70% 92%, rgba(255,209,102,.22), transparent 64%),
    linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%);
  position: relative;
}

/* ✅ FIX IMPORTANTE (2026-03-04)
   Camada “doodle” foi movida de body::before para html::before
   porque body::before/body::after são usados pelos personagens (menina/menino).
   Assim não há sobrescrita. */
html::before{
  content:"";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  opacity: .75;
  background-image:
    radial-gradient(rgba(255,77,139,.16) 1px, transparent 1px),
    radial-gradient(rgba(0,214,190,.14) 1px, transparent 1px),
    radial-gradient(rgba(255,209,102,.18) 1px, transparent 1px);
  background-size: 26px 26px, 34px 34px, 42px 42px;
  background-position: 0 0, 12px 16px, 22px 10px;
  filter: blur(.2px);
}

img, svg, video{ max-width: 100%; height: auto; display: block; }
button{ font-family: inherit; }
a{ color: inherit; text-decoration: none; }
:focus-visible{ outline: 2px solid var(--accent); outline-offset: 2px; }

/* ===========================
   THEME VARIABLES (usa a mesma class do HTML: theme-dark)
   =========================== */
.theme-dark{
  --bg:#f7fbff; --bg2:#fff6fb;
  --card:rgba(255,255,255,.86); --card2:rgba(255,255,255,.72);
  --border:rgba(23,33,43,.10); --border2:rgba(23,33,43,.14);
  --text:rgba(23,33,43,.92); --muted:rgba(23,33,43,.74); --muted2:rgba(23,33,43,.58);
  --accent:#00b9a7; --accent2:#ff4d8b; --warn:#ffcc5c; --ok:#22c55e;
  --danger:#ff3b6a; --danger2:#ff7a18;
  --hotGlow:0 0 0 rgba(255,59,106,0);
  --shadow:0 18px 54px rgba(15,23,42,.14);
  --shadow2:0 12px 30px rgba(15,23,42,.10);
  --radius:20px; --radius2:16px;
  --pad:18px; --pad2:14px;
}

/* ===========================
   NOSCRIPT
   =========================== */
.noscript-warning{
  padding: 14px 16px;
  text-align: center;
  background: rgba(255,209,102,.26);
  border-bottom: 1px solid rgba(255,209,102,.40);
  color: rgba(23,33,43,.88);
}

/* ===========================
   READ PROGRESS (JS injeta)
   =========================== */
.read-progress{
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 4px;
  z-index: 999;
  background: rgba(23,33,43,.08);
  backdrop-filter: blur(6px);
}
.read-progress__fill{
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, rgba(0,185,167,.95), rgba(255,77,139,.92), rgba(255,204,92,.92), rgba(255,59,106,.90));
  box-shadow: 0 10px 24px rgba(255,77,139,.16);
  transition: width 140ms ease;
}

/* ===========================
   ALERT STRIP (HOT) — CENTRALIZADO + RESPONSIVO
   =========================== */

.alert-strip{
  position: sticky;
  top: 0;
  z-index: 120;
  background: linear-gradient(
    90deg,
    rgba(255,77,139,.22),
    rgba(255,209,102,.16),
    rgba(0,185,167,.16)
  );
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(23,33,43,.12);
  box-shadow: 0 16px 60px rgba(15,23,42,.12);
  overflow: hidden;
}

.alert-strip::before{
  content:"";
  position:absolute;
  inset:-2px;
  pointer-events:none;
  background:
    radial-gradient(900px 140px at 12% 0%, rgba(255,255,255,.62), transparent 62%),
    radial-gradient(760px 140px at 88% 0%, rgba(255,255,255,.52), transparent 62%);
  opacity:.60;
}

.alert-strip::after{
  content:"";
  position:absolute;
  left:-40%;
  top:0;
  width:40%;
  height:100%;
  pointer-events:none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.58), transparent);
  opacity:.35;
  transform: skewX(-18deg);
  animation: alertShine 5.6s ease-in-out infinite;
}

@keyframes alertShine{
  0%{ transform: translateX(0) skewX(-18deg); opacity:.0; }
  10%{ opacity:.35; }
  45%{ opacity:.0; }
  100%{ transform: translateX(220%) skewX(-18deg); opacity:.0; }
}

.alert-strip__inner{
  position: relative;
  max-width: 980px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
  text-align: center;
}

.alert-strip__left{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  min-width: 0;
}

.alert-pill{
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 9px 13px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 1000;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: rgba(255,255,255,.98);
  background: linear-gradient(90deg, rgba(255,59,106,.98), rgba(255,122,24,.94));
  box-shadow:
    0 20px 54px rgba(255,59,106,.22),
    0 0 0 1px rgba(255,255,255,.24) inset;
  animation: alertPulse 2.1s ease-in-out infinite;
}

@keyframes alertPulse{
  0%{ transform: translateY(0) scale(1); filter: brightness(1); }
  50%{ transform: translateY(-.5px) scale(1.03); filter: brightness(1.06); }
  100%{ transform: translateY(0) scale(1); filter: brightness(1); }
}

.alert-text{
  font-size: clamp(14px, 1.35vw, 16.5px);
  font-weight: 950;
  color: rgba(23,33,43,.96);
  line-height: 1.28;
  max-width: 74ch;
  text-wrap: balance;
}

.alert-text strong{
  font-weight: 1000;
  color: rgba(23,33,43,1);
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
  text-decoration-color: rgba(255,59,106,.55);
}

.alert-strip__right{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: clamp(12.5px, 1.1vw, 14px);
  white-space: nowrap;
  padding: 8px 11px;
  border-radius: 999px;
  color: rgba(23,33,43,.78);
  background: rgba(255,255,255,.62);
  border: 1px solid rgba(23,33,43,.12);
  box-shadow: 0 12px 34px rgba(15,23,42,.10);
}

.alert-mini{ opacity: .95; filter: saturate(1.1); }
.alert-date{ font-weight: 1000; color: rgba(23,33,43,.86); }

@media (max-width: 520px){
  .alert-strip__inner{
    padding: 12px 14px;
    gap: 10px;
  }
  .alert-strip__right{
    width: 100%;
  }
}

/* ===========================
   TOPBAR
   =========================== */
.topbar{
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(10px);
  background: rgba(255,255,255,.72);
  border-bottom: 1px solid var(--border);
}
.topbar__inner{
  max-width: 980px;
  margin: 0 auto;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.topbar__badge{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 900;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(0,185,167,.22);
  background: rgba(0,185,167,.10);
}
.topbar__meta{ display: inline-flex; align-items: center; gap: 8px; color: var(--muted2); font-size: 13px; }
.topbar__dot{ opacity: .7; }

/* ===========================
   STICKY CTA (HOT)
   =========================== */
.sticky-cta{
  position: fixed;
  left: 0; right: 0;
  bottom: 12px;
  z-index: 120;
  pointer-events: none;
  transform: translateY(14px);
  opacity: 0;
  transition: opacity 220ms ease, transform 220ms ease;
}
.sticky-cta.is-visible{ pointer-events: auto; opacity: 1; transform: translateY(0); }

.sticky-cta__inner{
  max-width: 980px;
  margin: 0 auto;
  width: calc(100% - 24px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(255,77,139,.16);
  background: linear-gradient(90deg, rgba(255,255,255,.92), rgba(255,255,255,.74));
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 56px rgba(15,23,42,.16);
}
.sticky-cta__copy{ display: grid; gap: 2px; }
.sticky-cta__copy strong{ font-size: 14px; letter-spacing: -.01em; color: var(--text); }
.sticky-cta__sub{ font-size: 12.5px; color: rgba(23,33,43,.62); }

.primary-btn--sticky{
  padding: 12px 14px;
  border-radius: 14px;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.sticky-cta.is-pulse .primary-btn--sticky{ animation: hotPulse 900ms ease; }

/* ===========================
   CONTAINER / LAYOUT
   =========================== */
.container{ max-width: 980px; margin: 0 auto; padding: 22px 16px 44px; }

.article-header{
  padding: 18px 0 14px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 18px;
}
.article-header--hot{ position: relative; }
.article-header--hot::after{
  content:"";
  position: absolute;
  left: 0; right: 0;
  bottom: -1px;
  height: 2px;
  opacity: .85;
  background: linear-gradient(90deg, transparent, rgba(0,185,167,.26), rgba(255,77,139,.24), rgba(255,204,92,.22), transparent);
}

.kicker{
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--muted2);
}
.headline{
  margin: 0 0 10px;
  font-size: clamp(26px, 3.2vw, 40px);
  line-height: 1.15;
  letter-spacing: -.02em;
  text-shadow: 0 14px 40px rgba(15,23,42,.10);
}
.subheadline{
  margin: 0 0 16px;
  font-size: 16px;
  color: var(--muted);
  max-width: 72ch;
}

.author-row{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 0 0;
}
.author-row__left{ display: flex; align-items: center; gap: 10px; }
.avatar{
  width: 40px; height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,.70);
  border: 1px solid rgba(0,185,167,.22);
  box-shadow: var(--shadow2);
}
.author-row__info p{ margin: 0; }
.author-row__byline{ font-size: 14px; color: var(--text); font-weight: 900; }
.author-row__readtime{ font-size: 13px; color: var(--muted2); }

/* ===========================
   HOT: HERO CTA / URGENCY ROW / COUNTDOWN
   =========================== */
.urgency-row{
  display: grid;
  grid-template-columns: 1.5fr .6fr;
  gap: 12px;
  margin: 12px 0 10px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(255,77,139,.18);
  background: linear-gradient(180deg, rgba(255,77,139,.10), rgba(255,255,255,.60));
  box-shadow: 0 16px 46px rgba(255,77,139,.10);
}
.urgency-row__left{ display: grid; gap: 6px; }

.urgency-badge{
  display: inline-flex;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: rgba(23,33,43,.90);
  border: 1px solid rgba(255,77,139,.22);
  background: rgba(255,77,139,.12);
}
.urgency-text{ color: rgba(23,33,43,.80); font-size: 13.5px; }

.countdown{
  height: 100%;
  display: grid;
  align-content: center;
  justify-items: end;
  gap: 4px;
}
.countdown__label{ font-size: 12px; color: rgba(23,33,43,.62); }
.countdown__time{
  font-size: 20px;
  font-weight: 900;
  letter-spacing: .10em;
  font-variant-numeric: tabular-nums;
  padding: 8px 10px;
  border-radius: 14px;
  border: 1px solid rgba(0,185,167,.22);
  background: rgba(255,255,255,.86);
  box-shadow: 0 14px 34px rgba(0,185,167,.12);
}

.hero-cta{ margin-top: 14px; display: grid; gap: 10px; }
.hero-cta__hint{ margin: 0; font-size: 13px; color: rgba(23,33,43,.62); }

/* ===========================
   TYPOGRAPHY
   =========================== */
.section-title{
  margin: 0 0 8px;
  font-size: 20px;
  letter-spacing: -.01em;
  font-weight: 1000;
  position: relative;
  padding-left: 12px;
}
.section-title::before{
  content:"";
  position: absolute;
  left: 0;
  top: .28em;
  width: 6px;
  height: 1.2em;
  border-radius: 99px;
  background: linear-gradient(180deg, rgba(0,185,167,.85), rgba(255,77,139,.70));
  box-shadow: 0 12px 28px rgba(255,77,139,.10);
}
.section-subtitle{ margin: 0 0 14px; color: var(--muted); max-width: 78ch; }
.paragraph{ margin: 0 0 12px; color: var(--muted); max-width: 80ch; }
.micro-note{ margin: 10px 0 0; font-size: 12.5px; color: var(--muted2); line-height: 1.45; }
.text-warn{ color: rgba(255,140,0,.92); }

/* ===========================
   SECTIONS / CARDS
   =========================== */
.article-section{ margin: 28px 0 18px; padding: 10px 0 6px; }
.article-section--hot{ position: relative; margin: 20px 0 12px; padding: 10px 0 4px; }
.article-section--hot .section-title{ letter-spacing: -.02em; }
.article-section--hot::before,
.article-section--hot::after{
  content:"";
  position: absolute;
  left: 0; right: 0;
  height: 1px;
  opacity: .85;
  background: linear-gradient(90deg, transparent, rgba(255,77,139,.20), rgba(0,185,167,.16), rgba(255,204,92,.14), transparent);
}
.article-section--hot::before{ top: -6px; opacity: .95; }
.article-section--hot::after{ bottom: -8px; }

.card{
  background: linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,255,255,.72));
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: clamp(16px, 2.2vw, 22px);
  box-shadow: var(--shadow2);
  margin: 16px 0;
  position: relative;
  overflow: hidden;
}

/* gloss discreto */
.card::before,
.card::after{
  content:"";
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}
.card::before{
  inset: -30% -10% auto -10%;
  height: 70%;
  opacity: .40;
  background: radial-gradient(closest-side, rgba(255,255,255,.75), transparent);
}
.card::after{
  inset: -2px;
  opacity: .40;
  background: radial-gradient(900px 220px at 20% 0%, rgba(255,255,255,.65), transparent 55%);
}

.card--soft{
  background: linear-gradient(180deg, rgba(0,185,167,.10), rgba(255,255,255,.70));
  border: 1px solid rgba(0,185,167,.18);
}
.card--border{
  background: linear-gradient(180deg, rgba(255,204,92,.14), rgba(255,255,255,.70));
  border: 1px solid rgba(255,204,92,.22);
}
.card--alert,
.card--hot{ border: 1px solid rgba(255,77,139,.22); }
.card--alert{
  background: linear-gradient(180deg, rgba(255,77,139,.12), rgba(255,255,255,.72));
  box-shadow: 0 20px 56px rgba(255,77,139,.12);
}

/* ===========================
   FIGURE / IMAGEM (presell)
   =========================== */
figure{ margin: 0; }
figure.card img{
  border-radius: 16px;
  border: 1px solid rgba(23,33,43,.10);
  box-shadow: 0 18px 52px rgba(15,23,42,.18);
  background: rgba(255,255,255,.60);
}
figure.card .micro-note{ margin-top: 10px; }

/* ===========================
   CHECKLIST / BULLETS
   =========================== */
.checklist{
  list-style: none;
  padding: 0;
  margin: 0 0 14px;
  display: grid;
  gap: 10px;
}
.checklist__item{
  padding: 12px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255,255,255,.86), rgba(255,255,255,.70));
  border: 1px solid rgba(23,33,43,.10);
  color: rgba(23,33,43,.86);
  box-shadow: 0 12px 28px rgba(15,23,42,.10);
}
.checklist--hot .checklist__item{
  background: rgba(255,255,255,.78);
  border: 1px solid rgba(255,77,139,.16);
}
.bullets{ margin: 10px 0 0; padding-left: 18px; color: var(--muted); }
.bullets li{ margin: 8px 0; }

/* ===========================
   CTA PRINCIPAL
   =========================== */

.primary-btn{
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 22px;
  min-height: 56px;
  border-radius: 18px;
  font-size: 15.5px;
  font-weight: 1000;
  letter-spacing: .10em;
  text-transform: uppercase;
  color: rgba(255,255,255,.98);
  background: linear-gradient(
    90deg,
    rgba(0,185,167,.98),
    rgba(59,130,246,.96),
    rgba(255,77,139,.96)
  );
  box-shadow:
    0 26px 90px rgba(59,130,246,.22),
    0 18px 60px rgba(255,77,139,.18),
    0 10px 24px rgba(0,185,167,.18);
  border: 1px solid rgba(255,255,255,.22);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease, filter 160ms ease;
  isolation: isolate;
}

.primary-btn::before{
  content:"";
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,.35),
    transparent 40%,
    transparent 60%,
    rgba(255,255,255,.26)
  );
  opacity: .45;
  filter: blur(10px);
  z-index: -1;
}

.primary-btn::after{
  content:"";
  position: absolute;
  top: -40%;
  left: -60%;
  width: 60%;
  height: 180%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);
  transform: skewX(-18deg);
  opacity: .35;
  animation: ctaShine 3.8s ease-in-out infinite;
  z-index: 0;
  pointer-events: none;
}

@keyframes ctaShine{
  0%{ transform: translateX(0) skewX(-18deg); opacity: 0; }
  12%{ opacity: .35; }
  45%{ opacity: 0; }
  100%{ transform: translateX(260%) skewX(-18deg); opacity: 0; }
}

.primary-btn:hover{
  transform: translateY(-2px) scale(1.01);
  filter: brightness(1.05) saturate(1.03);
  box-shadow:
    0 32px 110px rgba(59,130,246,.26),
    0 22px 72px rgba(255,77,139,.22),
    0 14px 34px rgba(0,185,167,.20);
}

.primary-btn:active{
  transform: translateY(0) scale(.99);
  filter: brightness(1.02);
}

.primary-btn--xl{
  padding: 18px 24px;
  min-height: 60px;
  font-size: 16px;
  border-radius: 20px;
}

/* ===========================
   CALLOUT / CHIPS
   =========================== */
.callout{
  margin: 14px 0;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid rgba(0,185,167,.22);
  background: rgba(0,185,167,.10);
  box-shadow: 0 14px 44px rgba(0,185,167,.10);
}
.callout--hot{
  border: 1px solid rgba(255,77,139,.20);
  background: linear-gradient(180deg, rgba(255,77,139,.10), rgba(255,255,255,.68));
  box-shadow: 0 16px 46px rgba(255,77,139,.10);
}
.callout__title{ margin: 0 0 6px; font-weight: 1000; }
.callout__text{ margin: 0; color: rgba(23,33,43,.82); }

.chips{ display: flex; flex-wrap: wrap; gap: 10px; margin: 10px 0 2px; }
.chip{
  display: inline-flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,.74);
  border: 1px solid rgba(23,33,43,.10);
  color: rgba(23,33,43,.80);
  font-size: 13px;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(15,23,42,.08);
}
.chips--hot .chip{
  border: 1px solid rgba(255,77,139,.16);
  background: rgba(255,255,255,.72);
}

/* ===========================
   GRID / INFO BOXES / MINI CARDS / TESTIMONIAL (base)
   =========================== */
.grid-2{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 12px; }

:is(.info-box, .mini-card, .testimonial){
  padding: 14px;
  border-radius: 22px;
  background: rgba(255,255,255,.78);
  border: 1px solid rgba(23,33,43,.10);
  box-shadow: 0 14px 40px rgba(15,23,42,.12);
}

.info-box__title,
.mini-card__title{
  margin: 0 0 8px;
  font-size: 15px;
  letter-spacing: -.01em;
  font-weight: 1000;
}

/* Divider editorial */
.divider{
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(23,33,43,.10), rgba(0,185,167,.10), rgba(255,77,139,.10), transparent);
  margin: 18px 0;
  opacity: .95;
}

/* Timeline/Steps HORIZONTAL */
.cards-row{
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(260px, 1fr);
  gap: 14px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding: 12px;
  padding: 10px 8px 14px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255,255,255,.60), rgba(255,255,255,.22));
  border: 1px solid rgba(23,33,43,.08);
  box-shadow: 0 12px 30px rgba(15,23,42,.10);
}
.cards-row > .mini-card{
  scroll-snap-align: start;
  position: relative;
  overflow: hidden;
}
.cards-row > .mini-card::before{
  content:"";
  position: absolute;
  left: 14px; top: 14px;
  width: 12px; height: 12px;
  border-radius: 99px;
  background: linear-gradient(180deg, rgba(255,77,139,.92), rgba(0,185,167,.88));
  box-shadow: 0 14px 30px rgba(255,77,139,.16);
  opacity: .95;
}
.cards-row > .mini-card::after{
  content:"";
  position: absolute;
  left: 19px; top: 28px;
  bottom: 18px;
  width: 2px;
  border-radius: 99px;
  background: linear-gradient(180deg, rgba(255,77,139,.26), rgba(0,185,167,.16), transparent);
  opacity: .75;
}
.mini-card__title{ padding-left: 18px; }

.cards-row::-webkit-scrollbar{ height: 10px; }
.cards-row::-webkit-scrollbar-track{ background: rgba(23,33,43,.06); border-radius: 999px; }
.cards-row::-webkit-scrollbar-thumb{
  background: linear-gradient(90deg, rgba(255,77,139,.45), rgba(0,185,167,.40));
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,.70);
}

/* ===========================
   MINI TEST (QUIZ)
   =========================== */
.mini-test{
  margin: 14px 0 6px;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid rgba(255,77,139,.18);
  background: rgba(255,255,255,.72);
  box-shadow: 0 14px 40px rgba(15,23,42,.12);
}
.mini-test__title{ margin: 0 0 6px; font-size: 15px; letter-spacing: -.01em; font-weight: 1000; }
.mini-test__desc{ margin: 0 0 12px; color: rgba(23,33,43,.72); font-size: 13.5px; }
.mini-test__actions{ display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.mini-test__result{
  margin: 10px 0 0;
  font-size: 13px;
  color: rgba(23,33,43,.74);
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 180ms ease, transform 180ms ease;
}
.mini-test__result.is-visible{ opacity: 1; transform: translateY(0); }
.mini-test__result[data-type="warn"]{ color: rgba(255,140,0,.92); }
.mini-test__result[data-type="ok"]{ color: rgba(34,197,94,.92); }
.mini-test__result.is-highlight{ animation: hotGlow 700ms ease; }

/* ===========================
   TRUST PILLS
   =========================== */
.trust-row{ display: flex; flex-wrap: wrap; gap: 10px; margin: 12px 0 10px; }
.trust-pill{
  padding: 8px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 1000;
  color: rgba(23,33,43,.80);
  background: rgba(0,185,167,.10);
  border: 1px solid rgba(0,185,167,.18);
}

/* ===========================
   TESTIMONIALS (PROVA SOCIAL)
   =========================== */
.testimonials{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-top: 12px; }

.testimonial{ position: relative; overflow: hidden; }
.testimonial::before{
  content:"";
  position: absolute;
  inset: -40% -20% auto -20%;
  height: 70%;
  background: radial-gradient(closest-side, rgba(255,255,255,.75), transparent);
  opacity: .45;
  pointer-events: none;
}
.testimonial__top{ display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
.testimonial__stars{ font-weight: 1000; letter-spacing: .08em; color: rgba(255,140,0,.90); }
.testimonial__tag{
  font-size: 12px;
  padding: 6px 9px;
  border-radius: 999px;
  border: 1px solid rgba(255,77,139,.18);
  background: rgba(255,77,139,.10);
  color: rgba(23,33,43,.74);
  font-weight: 1000;
}
.testimonial__text{ margin: 0 0 8px; color: rgba(23,33,43,.78); }
.testimonial__meta{ margin: 0; font-size: 12.5px; color: rgba(23,33,43,.56); }

/* ===========================
   RISK BOX (RISCO REVERSO)
   =========================== */
.risk-box{
  margin-top: 14px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(34,197,94,.18);
  background: linear-gradient(180deg, rgba(34,197,94,.10), rgba(255,255,255,.70));
  box-shadow: 0 14px 44px rgba(34,197,94,.10);
}
.risk-box__title{ margin: 0 0 6px; font-weight: 1000; }
.risk-box__text{ margin: 0; color: rgba(23,33,43,.76); }

/* ===========================
   FAQ (details/summary)
   =========================== */
.faq-item{
  border: 1px solid var(--border);
  border-radius: 16px;
  background: rgba(255,255,255,.72);
  margin: 10px 0;
  overflow: hidden;
  box-shadow: 0 12px 28px rgba(15,23,42,.10);
}
.faq-item summary{
  list-style: none;
  cursor: pointer;
  padding: 14px;
  font-weight: 1000;
  color: rgba(23,33,43,.86);
  background: rgba(255,255,255,.78);
}
.faq-item summary::-webkit-details-marker{ display: none; }
.faq-item summary::after{
  content:"▾";
  float: right;
  opacity: .8;
  transition: transform 180ms ease;
}
.faq-item[open] summary::after{ transform: rotate(180deg); }
.faq-item[open] summary{
  background: rgba(0,185,167,.10);
  border-bottom: 1px solid rgba(0,185,167,.14);
}
.faq-item__a{ padding: 0 14px 14px; color: var(--muted); }

/* ===========================
   FOOTER
   =========================== */
.footer{ margin-top: 18px; padding-top: 8px; }

.footer__box{
  border: 1px solid rgba(255,204,92,.26);
  background: rgba(255,204,92,.18);
  border-radius: var(--radius);
  padding: 16px;
  box-shadow: var(--shadow2);
}
.footer__title{ margin: 0 0 8px; font-weight: 1000; }
.footer__text{ margin: 0; color: rgba(23,33,43,.78); }

.footer__meta{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}
.footer__small{ margin: 0; font-size: 12.5px; color: var(--muted2); }
.footer__actions{ display: inline-flex; gap: 10px; }

/* ===========================
   MODAL
   =========================== */
.modal{ position: fixed; inset: 0; display: none; z-index: 140; }
.modal.is-open{ display: block; }

.modal__backdrop{
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.52);
  backdrop-filter: blur(6px);
}
.modal__panel{
  position: relative;
  max-width: 720px;
  margin: 6vh auto;
  width: calc(100% - 28px);
  background: rgba(255,255,255,.92);
  border: 1px solid var(--border2);
  border-radius: 20px;
  box-shadow: var(--shadow);
  overflow: hidden;
}
.modal__header{
  padding: 14px 14px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--border);
  background: rgba(23,33,43,.04);
}
.modal__title{ margin: 0; font-size: 16px; letter-spacing: -.01em; font-weight: 1000; }

.modal__close{
  width: 40px;
  height: 40px;
  border-radius: 14px;
  border: 1px solid rgba(0,185,167,.18);
  background: rgba(0,185,167,.12);
  color: rgba(23,33,43,.86);
  cursor: pointer;
  transition: transform 140ms ease, background 140ms ease, border-color 140ms ease;
}
.modal__close:hover{
  transform: translateY(-1px);
  background: rgba(0,185,167,.16);
  border-color: rgba(0,185,167,.22);
}
.modal__body{ padding: 14px; }
body.modal-open{ overflow: hidden; }

/* ===========================
   ANIMAÇÕES HOT
   =========================== */
@keyframes hotPulse{
  0%{ transform: translateY(0) scale(1); box-shadow: var(--hotGlow); }
  35%{ transform: translateY(-1px) scale(1.02); box-shadow: 0 20px 58px rgba(255,77,139,.20); }
  70%{ transform: translateY(0) scale(1); box-shadow: 0 12px 36px rgba(255,77,139,.14); }
  100%{ transform: translateY(0) scale(1); box-shadow: var(--hotGlow); }
}
@keyframes hotClick{
  0%{ transform: scale(1); }
  40%{ transform: scale(.98); }
  100%{ transform: scale(1); }
}
@keyframes hotGlow{
  0%{ filter: brightness(1); }
  35%{ filter: brightness(1.10); }
  100%{ filter: brightness(1); }
}

/* ===========================
   RESPONSIVO
   =========================== */
@media (max-width: 860px){
  .author-row{ flex-direction: column; align-items: flex-start; }
  .grid-2{ grid-template-columns: 1fr; }
  .testimonials{ grid-template-columns: 1fr; }
  .footer__meta{ flex-direction: column; align-items: flex-start; }
  .primary-btn--xl{ width: 100%; }
  .urgency-row{ grid-template-columns: 1fr; }
  .countdown{ justify-items: start; }
  .cards-row{ grid-auto-columns: minmax(84%, 1fr); }
}
@media (max-width: 520px){
  .alert-strip__inner{ flex-direction: column; align-items: flex-start; }
  .sticky-cta__inner{ flex-direction: column; align-items: stretch; }
  .primary-btn--sticky{ width: 100%; }
  .mini-test__actions{ grid-template-columns: 1fr; }
}
@media (max-width: 420px){
  .topbar__inner{ flex-direction: column; align-items: flex-start; }
  .headline{ font-size: 26px; }
  .card, .footer__box{ padding: 16px; }
  .ghost-btn{ width: 100%; }
}

/* ================================
   VIDEO HERO — STORY RESPONSIVO (9:16) ✅
================================ */

.video-container{
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  aspect-ratio: 9 / 16;
  max-height: 72vh;
  height: auto;
  overflow: hidden;
  border-radius: 16px;
  background: transparent;
}

.hero-video{
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  background: transparent;
}

@media (max-width: 520px){
  .video-container{
    max-width: 100%;
    max-height: 64vh;
    border-radius: 14px;
  }
}

@media (max-width: 380px){
  .video-container{
    max-height: 58vh;
  }
}

/* ==========================================================
   ✅ VIDEO GALLERY (CORRIGIDO E ESTÁVEL)
   - CSS manda no layout (scroll horizontal + snap)
   - JS só muda .is-active e usa scrollIntoView
   ✅ FIX (2026-03-05): centralização REAL do slide ativo com spacers
========================================================== */

[data-video-gallery]{
  position: relative;
  width: 100%;
  max-width: 980px;
  margin: 0 auto;

  /* ✅ referência única pra cálculos */
  --video-slide-w: clamp(220px, 34vw, 420px);
}

/* ✅ trilho horizontal REAL (scroll-snap) */
[data-video-track]{
  display: flex;
  align-items: center;
  gap: 14px;

  overflow-x: auto;
  overflow-y: hidden;

  scroll-snap-type: x mandatory;

  /* ✅ suavidade */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  /* espaço pro glow */
  padding: 10px 6px 12px;

  /* ✅ swipe horizontal sem matar scroll vertical */
  touch-action: pan-y;

  /* estética */
  scrollbar-width: none; /* Firefox */

  /* ✅ FIX CENTRALIZAÇÃO:
     scroll-padding-inline combina com os spacers abaixo
     pra permitir que o primeiro/último item alinhem no centro. */
  scroll-padding-left: calc((100% - var(--video-slide-w)) / 2);
  scroll-padding-right: calc((100% - var(--video-slide-w)) / 2);
}
[data-video-track]::-webkit-scrollbar{ display: none; } /* Chrome/Safari */

/* ✅ SPACERS laterais (o pulo do gato 🐱‍👤) */
[data-video-track]::before,
[data-video-track]::after{
  content: "";
  flex: 0 0 calc((100% - var(--video-slide-w)) / 2);
}

/* ✅ slides sempre no DOM e com snap central */
[data-video-slide]{
  flex: 0 0 auto;
  width: var(--video-slide-w);

  scroll-snap-align: center;

  opacity: .42;
  transform: scale(.90);
  filter: saturate(1.02);
  transition: transform 260ms ease, opacity 260ms ease, filter 260ms ease;

  pointer-events: auto;
}

/* slide ativo */
[data-video-slide].is-active{
  opacity: 1;
  transform: scale(1);
  filter: saturate(1.04);
}

/* glow no ativo */
[data-video-slide].is-active .video-container{
  box-shadow:
    0 22px 70px rgba(15,23,42,.16),
    0 10px 30px rgba(255,77,139,.10),
    0 10px 30px rgba(0,185,167,.10);
}

/* setas */
[data-video-prev],
[data-video-next]{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;

  width: 44px;
  height: 44px;
  border-radius: 16px;

  display: grid;
  place-items: center;

  border: 1px solid rgba(23,33,43,.12);
  background: rgba(255,255,255,.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  box-shadow: 0 16px 46px rgba(15,23,42,.14);

  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  transition: transform 160ms ease, filter 160ms ease, background 160ms ease;
}

[data-video-prev]{ left: 10px; }
[data-video-next]{ right: 10px; }

[data-video-prev]:hover,
[data-video-next]:hover{
  transform: translateY(-50%) scale(1.04);
  filter: brightness(1.04);
  background: rgba(255,255,255,.82);
}

[data-video-prev]:active,
[data-video-next]:active{
  transform: translateY(-50%) scale(.98);
}

[data-video-prev]:focus-visible,
[data-video-next]:focus-visible{
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Mobile */
@media (max-width: 520px){
  [data-video-gallery]{
    --video-slide-w: clamp(200px, 76vw, 420px);
  }

  [data-video-track]{
    gap: 10px;
    padding: 8px 4px 10px;

    scroll-padding-left: calc((100% - var(--video-slide-w)) / 2);
    scroll-padding-right: calc((100% - var(--video-slide-w)) / 2);
  }

  [data-video-slide]{ opacity: .26; transform: scale(.92); }
  [data-video-slide].is-active{ opacity: 1; transform: scale(1); }

  [data-video-prev],
  [data-video-next]{
    width: 42px;
    height: 42px;
    border-radius: 14px;
  }
  [data-video-prev]{ left: 6px; }
  [data-video-next]{ right: 6px; }
}

@media (min-width: 1100px){
  [data-video-slide]{ opacity: .50; transform: scale(.92); }
  [data-video-slide].is-active{ opacity: 1; transform: scale(1); }
}

@media (prefers-reduced-motion: reduce){
  [data-video-slide]{ transition: none; }
  [data-video-prev],
  [data-video-next]{ transition: none; }
}

/* ==========================================================
   BACKGROUND PERSONAGENS — MENINA / MENINO
========================================================== */

body{ position: relative; }

body::before,
body::after{
  content: "";
  position: fixed;
  bottom: -40px;
  width: clamp(180px, 22vw, 320px);
  height: auto;
  aspect-ratio: 1 / 1.4;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: bottom;
  pointer-events: none;
  z-index: -1;
  opacity: .18;
  filter: blur(0.4px) saturate(1.05);
  transition: opacity .4s ease, transform .4s ease;
}

body::before{
  left: -30px;
  background-image: url("../assets/img/menina.png");
}

body::after{
  right: -30px;
  background-image: url("../assets/img/menino.png");
}

@media (max-width: 768px){
  body::before,
  body::after{
    width: clamp(120px, 32vw, 200px);
    opacity: .14;
    bottom: -20px;
  }
  body::before{ left: -40px; }
  body::after{ right: -40px; }
}

@media (min-width: 1400px){
  body::before,
  body::after{
    width: clamp(260px, 20vw, 420px);
    opacity: .22;
  }
}

/* ===========================
   CENTRALIZA CTA + PULSO ELEGANTE (RESPONSIVO)
   =========================== */

.center-cta{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 18px;
}

.center-cta .primary-btn,
.center-cta .primary-btn--xl{
  width: min(560px, 100%);
}

.center-cta .primary-btn{
  animation: ctaElegantPulse 2.8s ease-in-out infinite;
  transform-origin: center;
}

@keyframes ctaElegantPulse{
  0%{
    transform: translateY(0) scale(1);
    filter: brightness(1) saturate(1);
    box-shadow:
      0 26px 90px rgba(59,130,246,.22),
      0 18px 60px rgba(255,77,139,.18),
      0 10px 24px rgba(0,185,167,.18);
  }
  50%{
    transform: translateY(-1px) scale(1.03);
    filter: brightness(1.06) saturate(1.06);
    box-shadow:
      0 34px 120px rgba(59,130,246,.28),
      0 24px 82px rgba(255,77,139,.24),
      0 14px 34px rgba(0,185,167,.22);
  }
  100%{
    transform: translateY(0) scale(1);
    filter: brightness(1) saturate(1);
    box-shadow:
      0 26px 90px rgba(59,130,246,.22),
      0 18px 60px rgba(255,77,139,.18),
      0 10px 24px rgba(0,185,167,.18);
  }
}

@media (prefers-reduced-motion: reduce){
  .center-cta .primary-btn{ animation: none; }
}
/* ==========================================================
   GARANTIA — 7 DIAS (BLOCO DE SEGURANÇA / CONFIANÇA)
   Adicionar ao FINAL do presell.css
   ========================================================== */

.guarantee{
  margin-top: 34px;
}

.guarantee .card{
  padding: 28px 22px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* selo superior */

.guarantee__seal{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg,#00c2a8,#00a08c);
  color: #fff;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: .3px;
  margin-bottom: 16px;
  box-shadow: 0 6px 16px rgba(0,0,0,.12);
}

.guarantee__seal-icon{
  font-size: 15px;
}

.guarantee__seal-text{
  line-height: 1;
}

/* título principal */

.guarantee__title{
  font-size: clamp(20px,3.2vw,28px);
  font-weight: 800;
  margin-bottom: 12px;
  color: var(--text);
}

/* texto principal */

.guarantee__lead{
  font-size: 15px;
  color: var(--text-muted);
  max-width: 620px;
  margin: 0 auto 20px auto;
}

/* lista */

.guarantee__list{
  list-style: none;
  padding: 0;
  margin: 0 auto 22px auto;
  max-width: 560px;
}

.guarantee__item{
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  justify-content: flex-start;
}

.guarantee__bullet{
  font-size: 16px;
  flex-shrink: 0;
}

.guarantee__text{
  font-size: 14px;
  color: var(--text);
}

/* caixa "como funciona" */

.guarantee__how{
  background: rgba(0,0,0,.03);
  border-radius: 12px;
  padding: 16px;
  margin-top: 8px;
}

.guarantee__how-title{
  font-weight: 700;
  margin-bottom: 12px;
  font-size: 14px;
}

.guarantee__how-steps{
  display: flex;
  gap: 12px;
  justify-content: space-between;
  flex-wrap: wrap;
}

.guarantee__step{
  flex: 1;
  min-width: 140px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.guarantee__step-n{
  background: #00b9a7;
  color: #fff;
  font-weight: 700;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

.guarantee__step-t{
  font-size: 13px;
  color: var(--text-muted);
}

/* responsividade */

@media (max-width:640px){

  .guarantee__item{
    align-items: flex-start;
  }

  .guarantee__how-steps{
    flex-direction: column;
    gap: 10px;
  }

}

/* ===========================
   FOLLOW SOCIAL — "Me siga nas redes sociais"
   (Adicionar no FINAL do seu presell.css)
   =========================== */

.follow-social{
  margin-top: 18px;
  margin-bottom: 18px;
}

.follow-social .card{
  text-align: center;
  padding: 20px 16px;
}

/* Título */
.follow-social__title{
  margin: 0 0 14px;
  font-size: 1.15rem;
  line-height: 1.25;
  letter-spacing: .2px;
}

/* Link clicável do Instagram (vira “badge”) */
.follow-social__instagram{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 84px;
  height: 84px;
  border-radius: 999px;
  text-decoration: none;

  /* Visual premium sem depender de variáveis do seu CSS */
  background: radial-gradient(circle at 30% 30%, rgba(255,204,92,0.38), rgba(255,77,139,0.26) 45%, rgba(90,174,255,0.22) 80%);
  border: 1px solid rgba(255,255,255,0.22);
  box-shadow:
    0 12px 26px rgba(0,0,0,0.22),
    inset 0 0 0 1px rgba(255,255,255,0.10);

  transition: transform .18s ease, filter .18s ease, box-shadow .18s ease;
  -webkit-tap-highlight-color: transparent;
}

.follow-social__instagram:hover{
  transform: translateY(-1px) scale(1.02);
  filter: saturate(1.08);
  box-shadow:
    0 16px 34px rgba(0,0,0,0.26),
    inset 0 0 0 1px rgba(255,255,255,0.14);
}

.follow-social__instagram:active{
  transform: translateY(0) scale(0.99);
}

/* Foco acessível */
.follow-social__instagram:focus-visible{
  outline: 3px solid rgba(255,204,92,0.55);
  outline-offset: 4px;
}

/* Ícone SVG do Instagram */
.follow-social__icon{
  width: 52px;
  height: 52px;
  fill: rgba(255,255,255,0.92);
  filter: drop-shadow(0 10px 18px rgba(0,0,0,0.30));
}

/* Ajustes finos no mobile */
@media (max-width: 420px){
  .follow-social .card{
    padding: 18px 14px;
  }

  .follow-social__instagram{
    width: 78px;
    height: 78px;
  }

  .follow-social__icon{
    width: 48px;
    height: 48px;
  }
}
/* ===========================
   VIDEO GALLERY HEAD — CENTRALIZADO + RESPONSIVO
   (Substituir este bloco no seu CSS)
   =========================== */

.video-gallery__head{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

  text-align: center;

  /* mantém respiro visual sem “estourar” */
  padding: 6px 10px 12px;
  margin-bottom: 8px;
}

.video-gallery__head .alert-pill{
  margin: 0;
}

.video-gallery__head .alert-text{
  margin: 0;
  max-width: min(72ch, 100%);
  text-wrap: balance;
}

/* Mobile: segura quebra bonita */
@media (max-width: 520px){
  .video-gallery__head{
    padding: 6px 6px 10px;
    gap: 8px;
  }

  .video-gallery__head .alert-text{
    max-width: 100%;
  }
}
