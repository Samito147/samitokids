/* ========================================================================== 
   presell.js — Criança Modo Turbo (Pre-sell)
   - UTMs: captura + persistência + reaplicação em links
   - Meta Pixel: PageView / ViewContent / Engaged / Scroll / Outbound
   - Scroll depth + engaged timer
   - CTA outbound redirection
   - Modais (Privacidade / Termos) + copiar link com UTMs

   HOT Upgrade (versão agressiva / sensacionalista visualmente, sem quebrar compliance):
   - Countdown real (#js-countdown)
   - Sticky CTA inteligente (mostrar/ocultar + pulse)
   - Quiz / micro-engajamento ([data-quiz] + #js-quiz-result)
   - Barra de progresso de leitura (injetada via JS)
   - “CTA pulse” em momentos estratégicos (sem spam)

   Ajustes cirúrgicos (2026):
   - ENGAGED: timer inicia no 1º sinal de interação (não perde evento)
   - Sticky pulse: interval otimizado (menos CPU)
   - Dest allowlist opcional (evita open redirect acidental/malicioso)
   - Lock de outbound (evita duplo clique / duplo redirect)

   ✅ NOVO (2026-03-04):
   - Scroll Reveal: conteúdo aparece com fade conforme o scroll (IntersectionObserver)
   - CSS do reveal é injetado pelo JS (não precisa alterar presell.css agora)

   ✅ FIX (2026-03-04):
   - Hero Video Controller: suporta <video class="hero-video"> (sem depender de id)

   ✅ NOVO (2026-03-04):
   - Video Gallery Controller:
     setas prev/next, 1 slide ativo por vez,
     pausa automática ao trocar, ARIA correto.

   ✅ FIX (2026-03-05):
   - Video Debug Guard: detecta erro de carregamento (404/codec) e mostra aviso visível
   - Gallery Visibility Fallback: garante que o slide ativo aparece mesmo se o CSS estiver escondendo

   ✅ FIX (2026-03-05) — ATUALIZAÇÃO SOLICITADA:
   - Autoplay mutado do Hero + destravar som na 1ª interação (política de browsers)
   - Aplicar “destravar som” nos vídeos de opiniões também
   - Anti-conflito: ao scrollar para a área de opiniões, pausa o Hero se estiver tocando
   - Regra global: se um vídeo tocar, pausa todos os outros

   ✅ NOVO (2026-03-05) — ATUALIZAÇÃO SOLICITADA:
   - Ocultar duração/controls nativos dos vídeos (sem tempo/duração)
   - Adicionar PLAY central (overlay) nos vídeos
   - Efeito galeria com “peek” (vizinhos levemente visíveis à esquerda/direita)

   ✅ FIX CRÍTICO (2026-03-05) — AGORA:
   - Carrossel estabilizado (CSS manda no layout; JS só navega via scrollIntoView)
   - Remove conflito de CSS injetado (JS NÃO injeta mais layout da galeria)
   - Overlay PLAY só aparece quando o vídeo estiver pausado (autoplay = sem overlay)

   ✅ FIX CRÍTICO (2026-03-05) — NOVO:
   - NÃO rola a página para a galeria no carregamento
   - Só centraliza o slide quando a galeria entrar em viewport (IntersectionObserver)

   ✅ NOVO (2026-03-05) — AGORA (SOLICITAÇÃO):
   - CONTENT GATE: só exibe botão principal + resto do conteúdo após 60s assistidos do vídeo HERO
   - Até lá: exibe apenas vídeo HERO + cabeçalho + background

   ✅ FIX CRÍTICO (2026-03-05) — APLICADO AGORA:
   - Content Gate não deixa o <main> “vazar” conteúdo (esconde todos os filhos do main,
     mantendo apenas .video-hero visível)
   - ✅ Autoplay do HERO LIGADO (deve tocar sozinho ao carregar, mutado)

   ✅ FIX (2026-03-05) — AGORA (SOLICITAÇÃO DO SAMITO):
   - Se existir destino antigo salvo (sessionStorage), e o OFFICIAL_DEST_DEFAULT mudou,
     o sistema MIGRA automaticamente pro novo link (sem precisar limpar storage na mão).

   ✅ NOVO (2026-03-05) — PIXEL UPGRADE (AGORA):
   - Pixel Loader + fbq init automático (ID: 915514014708896)
   - InitiateCheckout no clique do CTA (padrão Meta)
   - Hero Video tracking leve (VideoStart + VideoProgress 25/50/75)

   ✅ FIX FINAL (2026-03-06) — AUTOPLAY HERO:
   - Reforço agressivo e seguro do autoplay do vídeo principal
   - Tentativas em múltiplos estágios do carregamento
   - preload="auto" + defaultMuted + pageshow/load/visibility fallback

   ✅ FIX CRÍTICO (2026-03-06) — AUTOPLAY REAL:
   - Removido falso “sinal de interação” no carregamento inicial
   - Scroll init e gallery init NÃO destravam áudio nem simulam usuário

   ✅ AJUSTE (2026-03-06) — SOM NO HERO:
   - Tenta iniciar com som primeiro
   - Se o navegador bloquear, cai automaticamente para autoplay mutado

   ✅ AJUSTE FINAL (2026-03-06) — UNLOCK REAL GLOBAL:
   - NÃO tenta clique fake no vídeo (browser bloqueia por não ser trusted)
   - Na PRIMEIRA interação real em qualquer parte da página, desmuta o HERO diretamente
   - Usa pointerdown global para funcionar melhor em mobile/desktop
   ========================================================================== */

(() => {
  "use strict";

  /* ===========================
     CONFIGURAÇÃO PRINCIPAL
     =========================== */

  const CONFIG = {
    META_PIXEL_ID: "915514014708896",
    OFFICIAL_DEST_DEFAULT: "https://chk.eduzz.com/6W48G22A0Z?a=44762966",
    ALLOW_DEST_FROM_QUERY: true,
    DEST_ALLOWLIST_HOSTS: ["chk.eduzz.com", "eduzz.com", "chk.eduzz.com.br", "eduzz.com.br"],
    DEST_MIGRATE_SAVED_TO_DEFAULT: true,
    UTM_KEYS: ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"],
    STORAGE_KEY: "presell_utms_v1",
    STORAGE_DEST_KEY: "presell_dest_v1",
    ENGAGED_SECONDS: 12,
    ENGAGED_REQUIRE_INTERACTION: true,
    ENGAGED_EVENT_NAME: "Engaged",
    SCROLL_THRESHOLDS: [25, 50, 75, 90],
    PIXEL_EVENTS: {
      PAGEVIEW: "PageView",
      VIEWCONTENT: "ViewContent",
      SCROLL: "Scroll",
      OUTBOUND: "Outbound",
      ENGAGED: "Engaged",
      INITIATE_CHECKOUT: "InitiateCheckout"
    },
    HOT_COUNTDOWN_SECONDS: 5 * 60,
    HOT_STICKY_SHOW_AFTER_SCROLL_PCT: 6,
    HOT_STICKY_HIDE_NEAR_BOTTOM_PCT: 96,
    HOT_STICKY_PULSE_EVERY_MS: 13000,
    HOT_STICKY_PULSE_DURATION_MS: 900,
    HOT_CTA_PULSE_SELECTOR: "[data-outbound='1']",
    HOT_CTA_PULSE_AFTER_SCROLL_PCT: 22,
    HOT_CTA_PULSE_COOLDOWN_MS: 18000,
    HOT_QUIZ_EVENT_NAME: "Lead",
    HOT_QUIZ_FIRE_PIXEL: true,
    HOT_QUIZ_COOLDOWN_MS: 30000,
    SCROLL_REVEAL_ENABLED: true,
    SCROLL_REVEAL_THRESHOLD: 0.12,
    SCROLL_REVEAL_ROOT_MARGIN: "0px 0px -10% 0px",
    SCROLL_REVEAL_SELECTOR: [
      ".article-header",
      ".article-section",
      ".card",
      ".mini-card",
      ".testimonial",
      ".info-box",
      "figure.card",
      ".footer"
    ].join(", "),
    SCROLL_REVEAL_EXCLUDE_SELECTOR: [
      ".topbar",
      ".alert-strip",
      ".sticky-cta",
      ".modal",
      ".modal *"
    ].join(", "),
    VIDEO_GALLERY_ENABLED: true,
    VIDEO_GALLERY_SELECTOR: "[data-video-gallery]",
    VIDEO_GALLERY_TRACK_SELECTOR: "[data-video-track]",
    VIDEO_GALLERY_SLIDE_SELECTOR: "[data-video-slide]",
    VIDEO_GALLERY_PREV_SELECTOR: "[data-video-prev]",
    VIDEO_GALLERY_NEXT_SELECTOR: "[data-video-next]",
    VIDEO_GALLERY_ACTIVE_CLASS: "is-active",
    VIDEO_GALLERY_KEYBOARD: true,
    VIDEO_DEBUG_ENABLED: true,

    // ✅ áudio / autoplay
    VIDEO_AUTOPLAY_ENABLED: true,
    VIDEO_TRY_AUTOPLAY_WITH_SOUND_FIRST: true,
    VIDEO_UNLOCK_AUDIO_ON_FIRST_INTERACTION: true,
    VIDEO_ENABLE_AUDIO_ON_FIRST_POINTER_ANYWHERE: true,
    VIDEO_PAUSE_HERO_WHEN_TESTIMONIALS_IN_VIEW: true,
    VIDEO_PAUSE_TESTIMONIALS_WHEN_HERO_IN_VIEW: true,
    VIDEO_VIEW_THRESHOLD: 0.45,

    VIDEO_HIDE_NATIVE_CONTROLS: true,
    VIDEO_PLAY_OVERLAY_ENABLED: true,
    VIDEO_PLAY_OVERLAY_SELECTOR: ".video-container",
    VIDEO_GALLERY_SCROLL_ON_INIT: false,
    VIDEO_GALLERY_SCROLL_WHEN_IN_VIEW: true,
    VIDEO_GALLERY_INVIEW_THRESHOLD: 0.22,
    CONTENT_GATE_ENABLED: true,
    CONTENT_GATE_WATCH_SECONDS: 60,
    CONTENT_GATE_SESSION_KEY: "presell_gate_unlocked_v1",
    HERO_VIDEO_PIXEL_TRACKING: true,
    HERO_VIDEO_PROGRESS_POINTS: [25, 50, 75],
    DEBUG: false
  };

  /* ===========================
     HELPERS BÁSICOS
     =========================== */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const log = (...args) => {
    if (CONFIG.DEBUG) console.log("[presell]", ...args);
  };

  const safeJSONParse = (str, fallback = null) => {
    try { return JSON.parse(str); } catch (e) { return fallback; }
  };

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const nowTs = () => Date.now();

  const formatMMSS = (totalSeconds) => {
    const s = Math.max(0, Math.floor(totalSeconds));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const isAllowedDestHost = (urlString) => {
    if (CONFIG.DEST_ALLOWLIST_HOSTS === null) return true;
    try {
      const u = new URL(urlString);
      const host = (u.host || "").toLowerCase();
      return CONFIG.DEST_ALLOWLIST_HOSTS.map((h) => h.toLowerCase()).includes(host);
    } catch (e) {
      return false;
    }
  };

  /* ===========================
     ✅ CONTENT GATE (60s do HERO)
     =========================== */

  const CONTENT_GATE = {
    injected: false,
    enabled: !!CONFIG.CONTENT_GATE_ENABLED,
    unlocked: false,
    heroSection: null,
    heroVideo: null,
    watchedSeconds: 0,
    lastVideoTime: 0,

    injectCSS() {
      if (CONTENT_GATE.injected) return;
      CONTENT_GATE.injected = true;

      const css = `
body.gate-on{
  overflow: hidden;
}
.gate-hide{
  display: none !important;
}
      `.trim();

      const style = document.createElement("style");
      style.setAttribute("data-presell", "content-gate");
      style.textContent = css;
      document.head.appendChild(style);
    },

    isSessionUnlocked() {
      try {
        return sessionStorage.getItem(CONFIG.CONTENT_GATE_SESSION_KEY) === "1";
      } catch (_) {
        return false;
      }
    },

    setSessionUnlocked() {
      try {
        sessionStorage.setItem(CONFIG.CONTENT_GATE_SESSION_KEY, "1");
      } catch (_) {}
    },

    isAllowedBodyChild(el) {
      if (!el || el.nodeType !== 1) return false;

      if (el.tagName && el.tagName.toLowerCase() === "svg") {
        const ariaHidden = (el.getAttribute("aria-hidden") || "").toLowerCase() === "true";
        const style = (el.getAttribute("style") || "").toLowerCase();
        if (ariaHidden || style.includes("position:fixed") || style.includes("inset:0")) return true;
      }

      if (el.matches("header, .topbar, .alert-strip")) return true;
      if (CONTENT_GATE.heroSection && el === CONTENT_GATE.heroSection) return true;
      if (CONTENT_GATE.heroSection && el.contains(CONTENT_GATE.heroSection)) return true;

      return false;
    },

    applyGate() {
      CONTENT_GATE.injectCSS();
      document.body.classList.add("gate-on");

      const children = Array.from(document.body.children || []);
      children.forEach((child) => {
        if (!child || child.nodeType !== 1) return;
        if (CONTENT_GATE.isAllowedBodyChild(child)) child.classList.remove("gate-hide");
        else child.classList.add("gate-hide");
      });

      const main = $("main.container") || $("main");
      if (main) {
        const mainKids = Array.from(main.children || []);
        mainKids.forEach((el) => {
          if (!el || el.nodeType !== 1) return;
          if (CONTENT_GATE.heroSection && el === CONTENT_GATE.heroSection) el.classList.remove("gate-hide");
          else el.classList.add("gate-hide");
        });

        if (CONTENT_GATE.heroSection) CONTENT_GATE.heroSection.classList.remove("gate-hide");
      }

      $$(".sticky-cta, .modal").forEach((el) => el.classList.add("gate-hide"));
      $$("[data-outbound='1']").forEach((el) => el.classList.add("gate-hide"));

      log("Content gate applied.");
    },

    removeGate() {
      document.body.classList.remove("gate-on");
      $$(".gate-hide").forEach((el) => el.classList.remove("gate-hide"));
      log("Content gate removed.");
    },

    unlock(reason = "watched") {
      if (CONTENT_GATE.unlocked) return;
      CONTENT_GATE.unlocked = true;
      CONTENT_GATE.setSessionUnlocked();
      CONTENT_GATE.removeGate();
      log("Content unlocked:", reason);
    },

    accumulateWatchedSeconds() {
      const v = CONTENT_GATE.heroVideo;
      if (!v) return;

      const isPlaying = (() => {
        try { return !v.paused && !v.ended; } catch (_) { return false; }
      })();

      if (!isPlaying) return;

      const t = Number(v.currentTime || 0);
      const delta = t - CONTENT_GATE.lastVideoTime;

      if (delta > 0 && delta <= 1.6) {
        CONTENT_GATE.watchedSeconds += delta;
      }

      CONTENT_GATE.lastVideoTime = t;

      if (CONTENT_GATE.watchedSeconds >= CONFIG.CONTENT_GATE_WATCH_SECONDS) {
        CONTENT_GATE.unlock("60s_watched");
      }
    },

    bindHeroVideo() {
      CONTENT_GATE.heroSection = $(".video-hero") || null;
      CONTENT_GATE.heroVideo = $(".video-hero video.hero-video") || null;

      if (!CONTENT_GATE.heroVideo) {
        const any = $("video.hero-video");
        if (any) CONTENT_GATE.heroVideo = any;
      }

      if (!CONTENT_GATE.heroVideo) {
        CONTENT_GATE.unlocked = true;
        return;
      }

      const v = CONTENT_GATE.heroVideo;

      v.addEventListener("loadedmetadata", () => {
        try { CONTENT_GATE.lastVideoTime = Number(v.currentTime || 0); } catch (_) {}
      });

      v.addEventListener("play", () => {
        try { CONTENT_GATE.lastVideoTime = Number(v.currentTime || 0); } catch (_) {}
      });

      v.addEventListener("timeupdate", () => CONTENT_GATE.accumulateWatchedSeconds());

      v.addEventListener("playing", () => {
        try { CONTENT_GATE.lastVideoTime = Number(v.currentTime || 0); } catch (_) {}
      });
    },

    bind() {
      if (!CONTENT_GATE.enabled) return;

      if (CONTENT_GATE.isSessionUnlocked()) {
        CONTENT_GATE.unlocked = true;
        log("Content gate: session already unlocked.");
        return;
      }

      CONTENT_GATE.bindHeroVideo();
      CONTENT_GATE.applyGate();
    }
  };

  /* ===========================
     UTM MANAGER
     =========================== */

  const UTM = {
    readQueryParams() {
      const params = new URLSearchParams(window.location.search);
      const data = {};

      CONFIG.UTM_KEYS.forEach((k) => {
        const v = params.get(k);
        if (v && String(v).trim().length > 0) data[k] = String(v).trim();
      });

      const extras = ["fbclid", "gclid", "ttclid", "wbraid", "gbraid"];
      extras.forEach((k) => {
        const v = params.get(k);
        if (v && String(v).trim().length > 0) data[k] = String(v).trim();
      });

      return data;
    },

    loadSaved() {
      const raw = sessionStorage.getItem(CONFIG.STORAGE_KEY);
      const parsed = safeJSONParse(raw, {});
      return parsed && typeof parsed === "object" ? parsed : {};
    },

    save(obj) {
      sessionStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(obj || {}));
    },

    mergePriority(primary, secondary) {
      const out = { ...(secondary || {}) };
      Object.keys(primary || {}).forEach((k) => { out[k] = primary[k]; });
      return out;
    },

    getCurrentUTMs() {
      const fromQuery = UTM.readQueryParams();
      const saved = UTM.loadSaved();
      const merged = UTM.mergePriority(fromQuery, saved);
      UTM.save(merged);
      return merged;
    },

    toQueryString(obj) {
      const params = new URLSearchParams();
      Object.entries(obj || {}).forEach(([k, v]) => {
        if (v === null || v === undefined) return;
        const s = String(v).trim();
        if (!s) return;
        params.set(k, s);
      });
      const str = params.toString();
      return str ? `?${str}` : "";
    },

    appendToUrl(baseUrl, paramsObj) {
      try {
        const url = new URL(baseUrl);
        Object.entries(paramsObj || {}).forEach(([k, v]) => {
          if (v === null || v === undefined) return;
          const s = String(v).trim();
          if (!s) return;
          url.searchParams.set(k, s);
        });
        return url.toString();
      } catch (e) {
        const glue = baseUrl.includes("?") ? "&" : "?";
        return baseUrl + glue + new URLSearchParams(paramsObj || {}).toString();
      }
    }
  };

  /* ===========================
     DESTINO (LINK OFICIAL)
     =========================== */

  const DEST = {
    readDestFromQuery() {
      const params = new URLSearchParams(window.location.search);
      const dest = params.get("dest");
      if (!dest) return null;

      const trimmed = String(dest).trim();
      if (!/^https?:\/\//i.test(trimmed)) return null;

      if (!isAllowedDestHost(trimmed)) {
        log("Blocked dest by allowlist:", trimmed);
        return null;
      }

      return trimmed;
    },

    loadSavedDest() {
      const raw = sessionStorage.getItem(CONFIG.STORAGE_DEST_KEY);
      if (!raw) return null;
      const v = String(raw).trim();
      if (!v) return null;
      if (!isAllowedDestHost(v)) return null;
      return v;
    },

    saveDest(destUrl) {
      if (!destUrl) return;
      sessionStorage.setItem(CONFIG.STORAGE_DEST_KEY, destUrl);
    },

    getDest() {
      let dest = null;

      if (CONFIG.ALLOW_DEST_FROM_QUERY) {
        dest = DEST.readDestFromQuery();
        if (dest) {
          DEST.saveDest(dest);
          return dest;
        }
      }

      const saved = DEST.loadSavedDest();

      if (CONFIG.DEST_MIGRATE_SAVED_TO_DEFAULT) {
        const def = String(CONFIG.OFFICIAL_DEST_DEFAULT || "").trim();

        if (def && (!saved || saved !== def)) {
          DEST.saveDest(def);
          return def;
        }
      }

      if (saved) return saved;

      DEST.saveDest(CONFIG.OFFICIAL_DEST_DEFAULT);
      return CONFIG.OFFICIAL_DEST_DEFAULT;
    }
  };

  /* ===========================
     ✅ PIXEL LOADER + WRAPPER (SAFE)
     =========================== */

  const PIXEL = {
    inited: false,

    hasFbq() { return typeof window.fbq === "function"; },

    ensureBaseLoaded() {
      if (PIXEL.hasFbq()) return;
      if (window.fbq && window.fbq.callMethod) return;

      const fbq = function () {
        fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
      };

      if (!window._fbq) window._fbq = fbq;
      window.fbq = fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.queue = fbq.queue || [];

      const s = document.createElement("script");
      s.async = true;
      s.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(s);
    },

    init() {
      if (PIXEL.inited) return;
      PIXEL.inited = true;

      const id = String(CONFIG.META_PIXEL_ID || "").trim();
      if (!id) return;

      PIXEL.ensureBaseLoaded();

      try {
        window.fbq("init", id);
        log("Pixel init:", id);
      } catch (e) {
        log("Pixel init error:", e);
      }
    },

    track(eventName, payload = {}) {
      if (!eventName) return;
      if (PIXEL.hasFbq()) {
        try {
          window.fbq("track", eventName, payload);
          log("fbq track:", eventName, payload);
        } catch (e) {
          log("fbq track error:", e);
        }
      } else {
        log("(no fbq) track:", eventName, payload);
      }
    },

    trackCustom(eventName, payload = {}) {
      if (!eventName) return;
      if (PIXEL.hasFbq()) {
        try {
          window.fbq("trackCustom", eventName, payload);
          log("fbq trackCustom:", eventName, payload);
        } catch (e) {
          log("fbq trackCustom error:", e);
        }
      } else {
        log("(no fbq) trackCustom:", eventName, payload);
      }
    }
  };

  /* ===========================
     CONTEXTO E METADADOS
     =========================== */

  const CONTEXT = {
    getPageMeta() {
      const h1 = $(".headline");
      const title = (h1 && h1.textContent ? h1.textContent.trim() : document.title).slice(0, 200);

      return {
        content_name: "Criança Modo Turbo",
        content_category: "Infoproduto - Desenvolvimento Infantil",
        page_title: title,
        page_path: window.location.pathname,
        page_url: window.location.href
      };
    },

    getUTMMeta() {
      const utms = UTM.getCurrentUTMs();
      const payload = {};
      Object.keys(utms).forEach((k) => { payload[k] = utms[k]; });
      return payload;
    }
  };

  /* ===========================
     OUTBOUND / CTA MANAGER
     =========================== */

  const OUTBOUND = {
    locked: false,

    buildFinalUrl() {
      const utms = UTM.getCurrentUTMs();
      const dest = DEST.getDest();

      const extras = {
        presell: "1",
        presell_ts: Date.now().toString()
      };

      const merged = { ...utms, ...extras };
      const finalUrl = UTM.appendToUrl(dest, merged);

      log("Final URL:", finalUrl);
      return finalUrl;
    },

    handleClick(e) {
      e.preventDefault();

      if (OUTBOUND.locked) return;
      OUTBOUND.locked = true;

      const btn = e.currentTarget;
      const ctaId = btn.getAttribute("data-cta") || "cta";
      const finalUrl = OUTBOUND.buildFinalUrl();

      const basePayload = {
        ...CONTEXT.getPageMeta(),
        ...CONTEXT.getUTMMeta(),
        cta_id: ctaId,
        outbound_url: finalUrl
      };

      PIXEL.trackCustom(CONFIG.PIXEL_EVENTS.OUTBOUND, basePayload);

      PIXEL.track(CONFIG.PIXEL_EVENTS.INITIATE_CHECKOUT, {
        ...CONTEXT.getPageMeta(),
        ...CONTEXT.getUTMMeta(),
        cta_id: ctaId
      });

      try {
        btn.classList.add("is-clicked");
        setTimeout(() => btn.classList.remove("is-clicked"), 600);
      } catch (_) {}

      setTimeout(() => { window.location.href = finalUrl; }, 500);
    },

    bind() {
      const buttons = $$("[data-outbound='1']");
      buttons.forEach((btn) => { btn.addEventListener("click", OUTBOUND.handleClick); });
      log("Outbound buttons:", buttons.length);
    }
  };

  /* ===========================
     SCROLL TRACKER
     =========================== */

  const SCROLL = {
    fired: new Set(),

    getScrollPercent() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const scrollHeight = doc.scrollHeight || 1;
      const clientHeight = doc.clientHeight || 1;
      const maxScroll = Math.max(1, scrollHeight - clientHeight);
      const pct = (scrollTop / maxScroll) * 100;
      return clamp(pct, 0, 100);
    },

    onScroll(userInitiated = true) {
      const pct = SCROLL.getScrollPercent();

      CONFIG.SCROLL_THRESHOLDS.forEach((t) => {
        if (pct >= t && !SCROLL.fired.has(t)) {
          SCROLL.fired.add(t);

          PIXEL.trackCustom(CONFIG.PIXEL_EVENTS.SCROLL, {
            ...CONTEXT.getPageMeta(),
            ...CONTEXT.getUTMMeta(),
            scroll_percent: t
          });

          log("Scroll fired:", t);
        }
      });

      HOT_STICKY.updateVisibility(pct);
      HOT_PROGRESS.update(pct);

      if (userInitiated) {
        HOT_CTA_PULSE.maybePulse(pct);
        ENGAGED.markInteraction();
        VIDEO_MANAGER.markInteractionFromUser("scroll");
      }
    },

    bind() {
      window.addEventListener("scroll", () => SCROLL.onScroll(true), { passive: true });
      SCROLL.onScroll(false);
    }
  };

  /* ===========================
     ENGAGED TRACKER
     =========================== */

  const ENGAGED = {
    timerId: null,
    interacted: false,
    fired: false,
    started: false,

    startTimerIfNeeded() {
      if (ENGAGED.started) return;
      ENGAGED.started = true;
      ENGAGED.timerId = window.setTimeout(() => { ENGAGED.fire(); }, CONFIG.ENGAGED_SECONDS * 1000);
      log("Engaged timer started.");
    },

    markInteraction() {
      ENGAGED.interacted = true;
      if (CONFIG.ENGAGED_REQUIRE_INTERACTION) ENGAGED.startTimerIfNeeded();
    },

    fire() {
      if (ENGAGED.fired) return;

      if (CONFIG.ENGAGED_REQUIRE_INTERACTION && !ENGAGED.interacted) {
        log("Engaged not fired (no interaction).");
        return;
      }

      ENGAGED.fired = true;

      PIXEL.trackCustom(CONFIG.PIXEL_EVENTS.ENGAGED, {
        ...CONTEXT.getPageMeta(),
        ...CONTEXT.getUTMMeta(),
        engaged_seconds: CONFIG.ENGAGED_SECONDS
      });

      log("Engaged fired.");
    },

    bind() {
      const mark = () => ENGAGED.markInteraction();
      window.addEventListener("click", mark, { passive: true });
      window.addEventListener("touchstart", mark, { passive: true });
      window.addEventListener("keydown", mark, { passive: true });

      if (!CONFIG.ENGAGED_REQUIRE_INTERACTION) ENGAGED.startTimerIfNeeded();
    }
  };

  /* ===========================
     ✅ HERO VIDEO PIXEL TRACKING
     =========================== */

  const HERO_VIDEO_PIXEL = {
    bound: false,
    started: false,
    firedPoints: new Set(),
    heroVideo: null,

    getHeroVideo() {
      return $(".video-hero video.hero-video") || $("video.hero-video");
    },

    getPct() {
      const v = HERO_VIDEO_PIXEL.heroVideo;
      if (!v) return 0;
      const d = Number(v.duration || 0);
      const t = Number(v.currentTime || 0);
      if (!d || Number.isNaN(d) || d <= 0) return 0;
      return clamp((t / d) * 100, 0, 100);
    },

    fireStart() {
      if (HERO_VIDEO_PIXEL.started) return;
      HERO_VIDEO_PIXEL.started = true;

      PIXEL.trackCustom("VideoStart", {
        ...CONTEXT.getPageMeta(),
        ...CONTEXT.getUTMMeta(),
        video_role: "hero"
      });
    },

    fireProgress(pctPoint) {
      if (HERO_VIDEO_PIXEL.firedPoints.has(pctPoint)) return;
      HERO_VIDEO_PIXEL.firedPoints.add(pctPoint);

      PIXEL.trackCustom("VideoProgress", {
        ...CONTEXT.getPageMeta(),
        ...CONTEXT.getUTMMeta(),
        video_role: "hero",
        video_percent: pctPoint
      });
    },

    onTimeUpdate() {
      if (!CONFIG.HERO_VIDEO_PIXEL_TRACKING) return;
      const pct = HERO_VIDEO_PIXEL.getPct();

      if (pct > 0.5) HERO_VIDEO_PIXEL.fireStart();

      (CONFIG.HERO_VIDEO_PROGRESS_POINTS || []).forEach((p) => {
        if (pct >= p) HERO_VIDEO_PIXEL.fireProgress(p);
      });
    },

    bind() {
      if (HERO_VIDEO_PIXEL.bound) return;
      if (!CONFIG.HERO_VIDEO_PIXEL_TRACKING) return;

      HERO_VIDEO_PIXEL.heroVideo = HERO_VIDEO_PIXEL.getHeroVideo();
      if (!HERO_VIDEO_PIXEL.heroVideo) return;

      const v = HERO_VIDEO_PIXEL.heroVideo;

      v.addEventListener("play", () => {
        ENGAGED.markInteraction();
      });

      v.addEventListener("timeupdate", () => HERO_VIDEO_PIXEL.onTimeUpdate());

      HERO_VIDEO_PIXEL.bound = true;
    }
  };

  /* ===========================
     UI: DATA / ANO / COPIAR LINK
     =========================== */

  const UI = {
    setDates() {
      const todayEl = $("#js-today");
      const yearEl = $("#js-year");

      const now = new Date();
      if (todayEl) {
        const dd = String(now.getDate()).padStart(2, "0");
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const yyyy = String(now.getFullYear());
        todayEl.textContent = `Atualizado em ${dd}/${mm}/${yyyy}`;
      }

      if (yearEl) yearEl.textContent = String(now.getFullYear());
    },

    buildShareableUrl() {
      const utms = UTM.getCurrentUTMs();
      const base = `${window.location.origin}${window.location.pathname}`;
      const qs = UTM.toQueryString(utms);
      return base + qs;
    },

    bindCopyLink() {
      const btn = $("#btn-copy");
      if (!btn) return;

      btn.addEventListener("click", async () => {
        const url = UI.buildShareableUrl();

        try {
          await navigator.clipboard.writeText(url);
          btn.textContent = "✅ Link copiado!";
          setTimeout(() => (btn.textContent = "🔗 Copiar link"), 1600);

          PIXEL.trackCustom("CopyLink", {
            ...CONTEXT.getPageMeta(),
            ...CONTEXT.getUTMMeta()
          });
        } catch (e) {
          window.prompt("Copie o link abaixo:", url);
        }
      });
    }
  };

  /* ===========================
     MODAIS (PRIVACIDADE / TERMOS)
     =========================== */

  const MODAL = {
    open(modalEl) {
      if (!modalEl) return;
      modalEl.setAttribute("aria-hidden", "false");
      modalEl.classList.add("is-open");
      document.body.classList.add("modal-open");

      PIXEL.trackCustom("OpenModal", {
        ...CONTEXT.getPageMeta(),
        ...CONTEXT.getUTMMeta(),
        modal_id: modalEl.id || "modal"
      });
    },

    close(modalEl) {
      if (!modalEl) return;
      modalEl.setAttribute("aria-hidden", "true");
      modalEl.classList.remove("is-open");
      document.body.classList.remove("modal-open");
    },

    bind() {
      const btnPrivacy = $("#btn-privacy");
      const btnTerms = $("#btn-terms");
      const modalPrivacy = $("#modal-privacy");
      const modalTerms = $("#modal-terms");

      if (btnPrivacy && modalPrivacy) btnPrivacy.addEventListener("click", () => MODAL.open(modalPrivacy));
      if (btnTerms && modalTerms) btnTerms.addEventListener("click", () => MODAL.open(modalTerms));

      $$("[data-close='1']").forEach((el) => {
        el.addEventListener("click", () => {
          MODAL.close(modalPrivacy);
          MODAL.close(modalTerms);
        });
      });

      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          MODAL.close(modalPrivacy);
          MODAL.close(modalTerms);
        }
      });
    }
  };

  /* ===========================
     HOT: COUNTDOWN
     =========================== */

  const HOT_COUNTDOWN = {
    el: null,
    remaining: CONFIG.HOT_COUNTDOWN_SECONDS,
    timer: null,

    tick() {
      if (!HOT_COUNTDOWN.el) return;

      HOT_COUNTDOWN.el.textContent = formatMMSS(HOT_COUNTDOWN.remaining);

      if (HOT_COUNTDOWN.remaining <= 0) {
        HOT_COUNTDOWN.remaining = 0;
        HOT_COUNTDOWN.el.textContent = "00:00";
        if (HOT_COUNTDOWN.timer) clearInterval(HOT_COUNTDOWN.timer);
        return;
      }

      HOT_COUNTDOWN.remaining -= 1;
    },

    bind() {
      HOT_COUNTDOWN.el = $("#js-countdown");
      if (!HOT_COUNTDOWN.el) return;

      HOT_COUNTDOWN.el.textContent = formatMMSS(HOT_COUNTDOWN.remaining);
      HOT_COUNTDOWN.timer = setInterval(() => HOT_COUNTDOWN.tick(), 1000);
    }
  };

  /* ===========================
     HOT: STICKY CTA INTELIGENTE
     =========================== */

  const HOT_STICKY = {
    el: null,
    visible: false,
    pulseTimer: null,

    setVisible(isVisible) {
      if (!HOT_STICKY.el) return;
      HOT_STICKY.visible = isVisible;
      if (isVisible) HOT_STICKY.el.classList.add("is-visible");
      else HOT_STICKY.el.classList.remove("is-visible");
    },

    updateVisibility(scrollPct) {
      if (!HOT_STICKY.el) return;

      const showAfter = CONFIG.HOT_STICKY_SHOW_AFTER_SCROLL_PCT;
      const hideNearBottom = CONFIG.HOT_STICKY_HIDE_NEAR_BOTTOM_PCT;
      const shouldShow = scrollPct >= showAfter && scrollPct <= hideNearBottom;

      if (shouldShow && !HOT_STICKY.visible) HOT_STICKY.setVisible(true);
      if (!shouldShow && HOT_STICKY.visible) HOT_STICKY.setVisible(false);
    },

    pulse() {
      if (!HOT_STICKY.el || !HOT_STICKY.visible) return;

      HOT_STICKY.el.classList.add("is-pulse");
      setTimeout(() => {
        try { HOT_STICKY.el.classList.remove("is-pulse"); } catch (_) {}
      }, CONFIG.HOT_STICKY_PULSE_DURATION_MS);
    },

    bind() {
      HOT_STICKY.el = $(".sticky-cta");
      if (!HOT_STICKY.el) return;

      HOT_STICKY.setVisible(false);
      HOT_STICKY.pulseTimer = setInterval(() => HOT_STICKY.pulse(), CONFIG.HOT_STICKY_PULSE_EVERY_MS);
    }
  };

  /* ===========================
     HOT: PROGRESS BAR
     =========================== */

  const HOT_PROGRESS = {
    bar: null,

    inject() {
      const bar = document.createElement("div");
      bar.className = "read-progress";
      bar.setAttribute("aria-hidden", "true");

      const fill = document.createElement("div");
      fill.className = "read-progress__fill";
      bar.appendChild(fill);

      document.body.appendChild(bar);
      HOT_PROGRESS.bar = fill;
    },

    update(scrollPct) {
      if (!HOT_PROGRESS.bar) return;
      HOT_PROGRESS.bar.style.width = `${clamp(scrollPct, 0, 100)}%`;
    },

    bind() {
      HOT_PROGRESS.inject();
      HOT_PROGRESS.update(SCROLL.getScrollPercent());
    }
  };

  /* ===========================
     HOT: CTA PULSE
     =========================== */

  const HOT_CTA_PULSE = {
    lastPulseTs: 0,
    firedAtLeastOnce: false,

    pulseAll() {
      const now = nowTs();
      if (now - HOT_CTA_PULSE.lastPulseTs < CONFIG.HOT_CTA_PULSE_COOLDOWN_MS) return;

      HOT_CTA_PULSE.lastPulseTs = now;

      const btns = $$(CONFIG.HOT_CTA_PULSE_SELECTOR);
      btns.forEach((b) => {
        try {
          b.classList.add("is-pulse");
          setTimeout(() => b.classList.remove("is-pulse"), 900);
        } catch (_) {}
      });
    },

    maybePulse(scrollPct) {
      if (scrollPct >= CONFIG.HOT_CTA_PULSE_AFTER_SCROLL_PCT) {
        if (!HOT_CTA_PULSE.firedAtLeastOnce) {
          HOT_CTA_PULSE.firedAtLeastOnce = true;
          HOT_CTA_PULSE.pulseAll();
        } else {
          HOT_CTA_PULSE.pulseAll();
        }
      }
    }
  };

  /* ===========================
     HOT: QUIZ / MICRO-ENGAJAMENTO
     =========================== */

  const HOT_QUIZ = {
    lastFireTs: 0,

    setResult(msg, type = "info") {
      const el = $("#js-quiz-result");
      if (!el) return;

      el.textContent = msg;
      el.setAttribute("data-type", type);
      el.classList.add("is-visible");

      setTimeout(() => {
        try {
          el.classList.add("is-highlight");
          setTimeout(() => el.classList.remove("is-highlight"), 700);
        } catch (_) {}
      }, 60);
    },

    firePixel(choice) {
      if (!CONFIG.HOT_QUIZ_FIRE_PIXEL) return;

      const now = nowTs();
      if (now - HOT_QUIZ.lastFireTs < CONFIG.HOT_QUIZ_COOLDOWN_MS) return;
      HOT_QUIZ.lastFireTs = now;

      PIXEL.track(CONFIG.HOT_QUIZ_EVENT_NAME, {
        ...CONTEXT.getPageMeta(),
        ...CONTEXT.getUTMMeta(),
        quiz_choice: choice
      });

      log("Quiz pixel fired:", choice);
    },

    bind() {
      const btns = $$("[data-quiz]");
      if (!btns.length) return;

      btns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const choice = btn.getAttribute("data-quiz") || "unknown";

          if (choice === "repete") {
            HOT_QUIZ.setResult(
              "⚠️ Se a alimentação repete muito, é comum faltar nutrientes importantes. Um método estruturado pode te mostrar o que observar e como organizar a rotina.",
              "warn"
            );
          } else if (choice === "varia") {
            HOT_QUIZ.setResult(
              "✅ Ótimo sinal! Mesmo assim, muitos pais se beneficiam de um passo a passo para organizar rotina, escolhas e consistência.",
              "ok"
            );
          } else {
            HOT_QUIZ.setResult(
              "✅ Boa! Se fizer sentido, veja a apresentação oficial para entender como o método é estruturado.",
              "ok"
            );
          }

          ENGAGED.markInteraction();
          HOT_QUIZ.firePixel(choice);
          HOT_CTA_PULSE.pulseAll();
        });
      });
    }
  };

  /* ===========================
     ✅ SCROLL REVEAL
     =========================== */

  const HOT_SCROLL_REVEAL = {
    styleEl: null,
    observer: null,

    injectCSS() {
      const css = `
.sr-item{
  opacity: 0;
  transform: translateY(14px);
  filter: blur(0.25px);
  transition: opacity 960ms ease, transform 960ms ease, filter 960ms ease;
  will-change: opacity, transform, filter;
}
.sr-item.is-inview{
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}
@media (prefers-reduced-motion: reduce){
  .sr-item{
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    transition: none !important;
  }
}
      `.trim();

      const style = document.createElement("style");
      style.setAttribute("data-presell", "scroll-reveal");
      style.textContent = css;
      document.head.appendChild(style);
      HOT_SCROLL_REVEAL.styleEl = style;
    },

    isExcluded(el) {
      if (!el) return true;
      if (!CONFIG.SCROLL_REVEAL_EXCLUDE_SELECTOR) return false;
      try { return !!el.closest(CONFIG.SCROLL_REVEAL_EXCLUDE_SELECTOR); }
      catch (_) { return false; }
    },

    prepareTargets() {
      const candidates = $$(CONFIG.SCROLL_REVEAL_SELECTOR);
      const targets = [];

      candidates.forEach((el) => {
        if (!el || HOT_SCROLL_REVEAL.isExcluded(el)) return;

        const parentSr = el.closest(".sr-item");
        if (parentSr && parentSr !== el) return;

        el.classList.add("sr-item");
        targets.push(el);
      });

      return targets;
    },

    bindObserver(targets) {
      if (!("IntersectionObserver" in window)) {
        targets.forEach((el) => el.classList.add("is-inview"));
        return;
      }

      HOT_SCROLL_REVEAL.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target;
            if (entry.isIntersecting) {
              el.classList.add("is-inview");
              try { HOT_SCROLL_REVEAL.observer.unobserve(el); } catch (_) {}
            }
          });
        },
        {
          root: null,
          threshold: CONFIG.SCROLL_REVEAL_THRESHOLD,
          rootMargin: CONFIG.SCROLL_REVEAL_ROOT_MARGIN
        }
      );

      targets.forEach((el) => HOT_SCROLL_REVEAL.observer.observe(el));
    },

    bind() {
      if (!CONFIG.SCROLL_REVEAL_ENABLED) return;
      HOT_SCROLL_REVEAL.injectCSS();

      const targets = HOT_SCROLL_REVEAL.prepareTargets();
      if (!targets.length) return;

      HOT_SCROLL_REVEAL.bindObserver(targets);
      log("Scroll reveal targets:", targets.length);
    }
  };

  /* ===========================
     ✅ VIDEO DEBUG GUARD
     =========================== */

  const VIDEO_DEBUG = {
    injected: false,

    injectCSS() {
      if (VIDEO_DEBUG.injected) return;
      VIDEO_DEBUG.injected = true;

      const css = `
.video-debug-warning{
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,77,139,.26);
  background: rgba(255,77,139,.10);
  color: rgba(23,33,43,.88);
  font-size: 12.5px;
  line-height: 1.35;
  box-shadow: 0 14px 36px rgba(15,23,42,.08);
}
.video-debug-warning strong{
  font-weight: 1000;
}
      `.trim();

      const style = document.createElement("style");
      style.setAttribute("data-presell", "video-debug-guard");
      style.textContent = css;
      document.head.appendChild(style);
    },

    getSourceUrl(videoEl) {
      if (!videoEl) return "";
      const srcTag = videoEl.querySelector("source");
      const src = srcTag && srcTag.getAttribute("src") ? srcTag.getAttribute("src") : (videoEl.getAttribute("src") || "");
      return String(src || "").trim();
    },

    showWarning(videoEl, message) {
      if (!videoEl) return;
      VIDEO_DEBUG.injectCSS();

      const container = videoEl.closest(".video-container") || videoEl.parentElement;
      if (!container) return;

      if (container.querySelector(".video-debug-warning")) return;

      const src = VIDEO_DEBUG.getSourceUrl(videoEl);

      const div = document.createElement("div");
      div.className = "video-debug-warning";
      div.innerHTML = `
<strong>⚠️ Vídeo não carregou</strong><br>
Motivo provável: arquivo inexistente (404), nome com letras diferentes (case) ou codec não suportado.<br>
<strong>Arquivo:</strong> ${src || "(sem src)"}<br>
<strong>Dica:</strong> confira se o caminho é exatamente <code>assets/img/ADOENTADA.mp4</code> (maiúsculas contam em deploy).
      `.trim();

      container.appendChild(div);

      if (CONFIG.DEBUG) {
        console.warn("[presell] Video load error:", { src, message });
      }
    },

    bind() {
      if (!CONFIG.VIDEO_DEBUG_ENABLED) return;

      const videos = $$("video.hero-video");
      if (!videos.length) return;

      videos.forEach((v) => {
        v.addEventListener("error", () => VIDEO_DEBUG.showWarning(v, "error"));
        v.addEventListener("stalled", () => VIDEO_DEBUG.showWarning(v, "stalled"));
        v.addEventListener("abort", () => VIDEO_DEBUG.showWarning(v, "abort"));
      });
    }
  };

  /* ===========================
     ✅ VIDEO MANAGER
     =========================== */

  const VIDEO_MANAGER = {
    bound: false,
    audioUnlocked: false,
    audioUnlockHandled: false,
    heroSection: null,
    testimonialsSection: null,
    heroVideo: null,
    allVideos: [],
    testimonialVideos: [],

    getAllVideos() {
      return $$("video.hero-video");
    },

    safePause(v) {
      if (!v) return;
      try { v.pause(); } catch (_) {}
    },

    safePlay(v) {
      if (!v) return Promise.resolve(false);

      try {
        const playResult = v.play();

        if (playResult && typeof playResult.then === "function") {
          return playResult
            .then(() => true)
            .catch(() => false);
        }

        return Promise.resolve(true);
      } catch (_) {
        return Promise.resolve(false);
      }
    },

    isPlaying(v) {
      if (!v) return false;
      try {
        return !v.paused && !v.ended;
      } catch (_) {
        return false;
      }
    },

    pauseAllExcept(exceptVideo = null) {
      VIDEO_MANAGER.allVideos.forEach((v) => {
        if (!v) return;
        if (exceptVideo && v === exceptVideo) return;
        VIDEO_MANAGER.safePause(v);
      });
    },

    unmuteVideo(videoEl) {
      if (!videoEl) return;

      try {
        videoEl.muted = false;
        videoEl.defaultMuted = false;
        videoEl.removeAttribute("muted");
      } catch (_) {}

      try {
        videoEl.volume = 1;
      } catch (_) {}
    },

    tryUnmuteIfUnlocked(videoEl) {
      if (!videoEl) return;
      if (!VIDEO_MANAGER.audioUnlocked) return;

      VIDEO_MANAGER.unmuteVideo(videoEl);
      VIDEO_MANAGER.safePlay(videoEl);
    },

    unlockAudioForPlayingVideos() {
      VIDEO_MANAGER.allVideos.forEach((videoEl) => {
        if (!videoEl) return;
        if (!VIDEO_MANAGER.isPlaying(videoEl)) return;

        VIDEO_MANAGER.unmuteVideo(videoEl);
        VIDEO_MANAGER.safePlay(videoEl);
      });
    },

    unlockHeroAudioNow() {
      if (!VIDEO_MANAGER.heroVideo) return;

      VIDEO_MANAGER.unmuteVideo(VIDEO_MANAGER.heroVideo);

      if (VIDEO_MANAGER.isPlaying(VIDEO_MANAGER.heroVideo)) {
        VIDEO_MANAGER.safePlay(VIDEO_MANAGER.heroVideo);
      }
    },

    markInteractionFromUser(source = "interaction", nativeEvent = null) {
      if (!CONFIG.VIDEO_UNLOCK_AUDIO_ON_FIRST_INTERACTION) return;
      if (VIDEO_MANAGER.audioUnlocked) return;

      if (nativeEvent && nativeEvent.isTrusted === false) return;

      VIDEO_MANAGER.audioUnlocked = true;
      VIDEO_MANAGER.audioUnlockHandled = true;
      log("Audio unlocked by:", source);

      VIDEO_MANAGER.unlockHeroAudioNow();
      VIDEO_MANAGER.unlockAudioForPlayingVideos();
    },

    bindGlobalUnlock() {
      if (!CONFIG.VIDEO_UNLOCK_AUDIO_ON_FIRST_INTERACTION) return;

      const handler = (source) => (event) => {
        if (VIDEO_MANAGER.audioUnlocked) return;
        if (event && event.isTrusted === false) return;

        VIDEO_MANAGER.markInteractionFromUser(source, event);
      };

      const onPointerDown = handler("pointerdown");
      const onTouch = handler("touchstart");
      const onClick = handler("click");
      const onKey = handler("keydown");

      const cleanup = () => {
        window.removeEventListener("pointerdown", wrappedPointerDown, true);
        window.removeEventListener("touchstart", wrappedTouch, true);
        window.removeEventListener("click", wrappedClick, true);
        window.removeEventListener("keydown", wrappedKey, true);
      };

      const wrap = (fn) => (event) => {
        fn(event);
        if (VIDEO_MANAGER.audioUnlocked) cleanup();
      };

      const wrappedPointerDown = wrap(onPointerDown);
      const wrappedTouch = wrap(onTouch);
      const wrappedClick = wrap(onClick);
      const wrappedKey = wrap(onKey);

      if (CONFIG.VIDEO_ENABLE_AUDIO_ON_FIRST_POINTER_ANYWHERE) {
        window.addEventListener("pointerdown", wrappedPointerDown, true);
      }

      window.addEventListener("touchstart", wrappedTouch, true);
      window.addEventListener("click", wrappedClick, true);
      window.addEventListener("keydown", wrappedKey, true);
    },

    bindPauseOthersOnPlay() {
      VIDEO_MANAGER.allVideos.forEach((v) => {
        if (!v) return;

        v.addEventListener("play", () => {
          VIDEO_MANAGER.pauseAllExcept(v);
          VIDEO_MANAGER.tryUnmuteIfUnlocked(v);
          ENGAGED.markInteraction();
        });

        v.addEventListener("playing", () => {
          ENGAGED.markInteraction();
        });
      });
    },

    forceHeroMutedForAutoplay() {
      if (!VIDEO_MANAGER.heroVideo) return;

      try {
        VIDEO_MANAGER.heroVideo.muted = true;
        VIDEO_MANAGER.heroVideo.defaultMuted = true;
        VIDEO_MANAGER.heroVideo.setAttribute("muted", "");
      } catch (_) {}

      try {
        VIDEO_MANAGER.heroVideo.volume = 1;
      } catch (_) {}

      try {
        VIDEO_MANAGER.heroVideo.setAttribute("playsinline", "");
        VIDEO_MANAGER.heroVideo.setAttribute("webkit-playsinline", "");
      } catch (_) {}

      try {
        VIDEO_MANAGER.heroVideo.setAttribute("autoplay", "");
      } catch (_) {}

      try {
        VIDEO_MANAGER.heroVideo.autoplay = true;
      } catch (_) {}

      try {
        VIDEO_MANAGER.heroVideo.preload = "auto";
        VIDEO_MANAGER.heroVideo.setAttribute("preload", "auto");
      } catch (_) {}
    },

    forceHeroUnmutedForAutoplayAttempt() {
      if (!VIDEO_MANAGER.heroVideo) return;

      try {
        VIDEO_MANAGER.heroVideo.muted = false;
        VIDEO_MANAGER.heroVideo.defaultMuted = false;
        VIDEO_MANAGER.heroVideo.removeAttribute("muted");
      } catch (_) {}

      try {
        VIDEO_MANAGER.heroVideo.volume = 1;
      } catch (_) {}

      try {
        VIDEO_MANAGER.heroVideo.setAttribute("playsinline", "");
        VIDEO_MANAGER.heroVideo.setAttribute("webkit-playsinline", "");
      } catch (_) {}

      try {
        VIDEO_MANAGER.heroVideo.setAttribute("autoplay", "");
      } catch (_) {}

      try {
        VIDEO_MANAGER.heroVideo.autoplay = true;
      } catch (_) {}

      try {
        VIDEO_MANAGER.heroVideo.preload = "auto";
        VIDEO_MANAGER.heroVideo.setAttribute("preload", "auto");
      } catch (_) {}
    },

    tryHeroAutoplayWithSoundFirst() {
      const v = VIDEO_MANAGER.heroVideo;
      if (!v) return Promise.resolve(false);

      VIDEO_MANAGER.forceHeroUnmutedForAutoplayAttempt();

      return VIDEO_MANAGER.safePlay(v).then((ok) => {
        if (ok) {
          VIDEO_MANAGER.audioUnlocked = true;
          log("Hero autoplay with sound ok.");
          return true;
        }
        return false;
      });
    },

    tryHeroMutedAutoplayFallback() {
      const v = VIDEO_MANAGER.heroVideo;
      if (!v) return Promise.resolve(false);

      VIDEO_MANAGER.forceHeroMutedForAutoplay();

      return VIDEO_MANAGER.safePlay(v).then((ok) => {
        if (ok) log("Hero muted autoplay fallback ok.");
        return ok;
      });
    },

    scheduleHeroAutoplayAttempts() {
      if (!CONFIG.VIDEO_AUTOPLAY_ENABLED) return;
      if (!VIDEO_MANAGER.heroVideo) return;

      const v = VIDEO_MANAGER.heroVideo;

      const tryStartHero = () => {
        if (!v || VIDEO_MANAGER.isPlaying(v)) return;

        const tryWithSound = CONFIG.VIDEO_TRY_AUTOPLAY_WITH_SOUND_FIRST
          ? VIDEO_MANAGER.tryHeroAutoplayWithSoundFirst()
          : Promise.resolve(false);

        tryWithSound.then((withSoundOk) => {
          if (withSoundOk || VIDEO_MANAGER.isPlaying(v)) return;
          VIDEO_MANAGER.tryHeroMutedAutoplayFallback();
        });
      };

      tryStartHero();

      try {
        requestAnimationFrame(() => tryStartHero());
      } catch (_) {}

      window.setTimeout(() => tryStartHero(), 0);
      window.setTimeout(() => tryStartHero(), 120);
      window.setTimeout(() => tryStartHero(), 350);
      window.setTimeout(() => tryStartHero(), 900);

      const onMediaReady = () => tryStartHero();
      const onWindowLoad = () => tryStartHero();
      const onPageShow = () => tryStartHero();
      const onVisibility = () => {
        if (document.visibilityState === "visible") tryStartHero();
      };

      try { v.addEventListener("loadedmetadata", onMediaReady, { once: false }); } catch (_) {}
      try { v.addEventListener("loadeddata", onMediaReady, { once: false }); } catch (_) {}
      try { v.addEventListener("canplay", onMediaReady, { once: false }); } catch (_) {}
      try { v.addEventListener("canplaythrough", onMediaReady, { once: false }); } catch (_) {}

      try { window.addEventListener("load", onWindowLoad, { once: true }); } catch (_) {}
      try { window.addEventListener("pageshow", onPageShow, { once: false }); } catch (_) {}
      try { document.addEventListener("visibilitychange", onVisibility, { passive: true }); } catch (_) {}
    },

    tryHeroAutoplay() {
      if (!CONFIG.VIDEO_AUTOPLAY_ENABLED) return;
      if (!VIDEO_MANAGER.heroVideo) return;
      VIDEO_MANAGER.scheduleHeroAutoplayAttempts();
    },

    pauseHeroIfPlaying() {
      if (!VIDEO_MANAGER.heroVideo) return;
      if (!VIDEO_MANAGER.isPlaying(VIDEO_MANAGER.heroVideo)) return;
      VIDEO_MANAGER.safePause(VIDEO_MANAGER.heroVideo);
    },

    pauseTestimonialsIfAnyPlaying() {
      VIDEO_MANAGER.testimonialVideos.forEach((v) => {
        if (VIDEO_MANAGER.isPlaying(v)) VIDEO_MANAGER.safePause(v);
      });
    },

    bindSectionFocusAutoPause() {
      if (!("IntersectionObserver" in window)) return;

      VIDEO_MANAGER.heroSection = $(".video-hero");
      VIDEO_MANAGER.testimonialsSection = $(".video-gallery");

      if (!VIDEO_MANAGER.heroSection || !VIDEO_MANAGER.testimonialsSection) return;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target;
            const ratio = entry.intersectionRatio || 0;
            const inView = ratio >= CONFIG.VIDEO_VIEW_THRESHOLD;

            if (CONFIG.VIDEO_PAUSE_HERO_WHEN_TESTIMONIALS_IN_VIEW && el === VIDEO_MANAGER.testimonialsSection && inView) {
              VIDEO_MANAGER.pauseHeroIfPlaying();
            }

            if (CONFIG.VIDEO_PAUSE_TESTIMONIALS_WHEN_HERO_IN_VIEW && el === VIDEO_MANAGER.heroSection && inView) {
              VIDEO_MANAGER.pauseTestimonialsIfAnyPlaying();
            }
          });
        },
        { root: null, threshold: [0, CONFIG.VIDEO_VIEW_THRESHOLD, 0.65, 0.85] }
      );

      obs.observe(VIDEO_MANAGER.heroSection);
      obs.observe(VIDEO_MANAGER.testimonialsSection);
    },

    bind() {
      if (VIDEO_MANAGER.bound) return;

      VIDEO_MANAGER.allVideos = VIDEO_MANAGER.getAllVideos();
      VIDEO_MANAGER.heroVideo = $(".video-hero video.hero-video") || null;
      VIDEO_MANAGER.testimonialVideos = $$(".video-gallery video.hero-video");

      if (!VIDEO_MANAGER.allVideos.length) return;

      VIDEO_MANAGER.bindGlobalUnlock();
      VIDEO_MANAGER.bindPauseOthersOnPlay();
      VIDEO_MANAGER.bindSectionFocusAutoPause();
      VIDEO_MANAGER.tryHeroAutoplay();

      VIDEO_MANAGER.bound = true;
      log("Video manager bound:", VIDEO_MANAGER.allVideos.length);
    }
  };

  /* ===========================
     ✅ VIDEO UI
     =========================== */

  const VIDEO_UI = {
    injected: false,

    injectCSS() {
      if (VIDEO_UI.injected) return;
      VIDEO_UI.injected = true;

      const css = `
.video-container{ position: relative; }

.vui-play{
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
  z-index: 5;
}

.vui-play__btn{
  pointer-events: auto;
  width: 74px;
  height: 74px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.22);
  background: rgba(10,16,24,.45);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 18px 48px rgba(0,0,0,.35);
  display: grid;
  place-items: center;
  cursor: pointer;
  transform: translateZ(0);
  transition: transform 160ms ease, opacity 220ms ease;
}

.vui-play__btn:active{ transform: scale(.97); }

.vui-play__icon{
  width: 26px;
  height: 26px;
  transform: translateX(2px);
  opacity: .95;
}

.vui-play.is-hidden{
  opacity: 0;
  pointer-events: none;
}
      `.trim();

      const style = document.createElement("style");
      style.setAttribute("data-presell", "video-ui");
      style.textContent = css;
      document.head.appendChild(style);
    },

    ensureControlsHidden(videoEl) {
      if (!videoEl) return;
      if (!CONFIG.VIDEO_HIDE_NATIVE_CONTROLS) return;

      try {
        videoEl.controls = false;
        videoEl.removeAttribute("controls");
      } catch (_) {}

      try { videoEl.setAttribute("playsinline", ""); } catch (_) {}
    },

    buildPlayOverlay(videoEl) {
      if (!videoEl) return;
      if (!CONFIG.VIDEO_PLAY_OVERLAY_ENABLED) return;

      const host = videoEl.closest(CONFIG.VIDEO_PLAY_OVERLAY_SELECTOR) || videoEl.parentElement;
      if (!host) return;

      if (host.querySelector(".vui-play")) return;

      const wrap = document.createElement("div");
      wrap.className = "vui-play";
      wrap.setAttribute("aria-hidden", "false");

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "vui-play__btn";
      btn.setAttribute("aria-label", "Reproduzir vídeo");
      btn.innerHTML = `
<svg class="vui-play__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path fill="currentColor" d="M8 5.2v13.6c0 .7.8 1.1 1.4.7l10.2-6.8c.6-.4.6-1.2 0-1.6L9.4 4.5c-.6-.4-1.4 0-1.4.7z"/>
</svg>
      `.trim();

      wrap.appendChild(btn);
      host.appendChild(wrap);

      const setVisible = (show) => {
        if (show) wrap.classList.remove("is-hidden");
        else wrap.classList.add("is-hidden");
      };

      const sync = () => {
        const playing = VIDEO_MANAGER.isPlaying(videoEl);
        setVisible(!playing);
        btn.setAttribute("aria-label", playing ? "Pausar vídeo" : "Reproduzir vídeo");
      };

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (VIDEO_MANAGER.isPlaying(videoEl)) {
          VIDEO_MANAGER.safePause(videoEl);
        } else {
          VIDEO_MANAGER.markInteractionFromUser("overlay", e);
          VIDEO_MANAGER.pauseAllExcept(videoEl);
          VIDEO_MANAGER.safePlay(videoEl);
        }

        sync();
      });

      videoEl.addEventListener("play", sync);
      videoEl.addEventListener("playing", sync);
      videoEl.addEventListener("pause", sync);
      videoEl.addEventListener("ended", sync);
      videoEl.addEventListener("loadedmetadata", sync);

      sync();
    },

    bind() {
      VIDEO_UI.injectCSS();

      const videos = $$("video.hero-video");
      if (!videos.length) return;

      videos.forEach((v) => {
        VIDEO_UI.ensureControlsHidden(v);
        VIDEO_UI.buildPlayOverlay(v);
      });
    }
  };

  /* ===========================
     ✅ VIDEO GALLERY CONTROLLER
     =========================== */

  const VIDEO_GALLERY = {
    root: null,
    track: null,
    slides: [],
    prevBtn: null,
    nextBtn: null,
    index: 0,
    bound: false,
    hasCenteredOnceInView: false,
    inViewObserver: null,

    getActiveSlide() {
      return VIDEO_GALLERY.slides[VIDEO_GALLERY.index] || null;
    },

    setAria() {
      VIDEO_GALLERY.slides.forEach((slide, i) => {
        if (!slide) return;
        const isActive = i === VIDEO_GALLERY.index;
        slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      });
    },

    setActiveClass() {
      VIDEO_GALLERY.slides.forEach((slide, i) => {
        if (!slide) return;
        slide.classList.toggle(CONFIG.VIDEO_GALLERY_ACTIVE_CLASS, i === VIDEO_GALLERY.index);
      });
    },

    pauseOutgoing(prevIndex) {
      const prevSlide = VIDEO_GALLERY.slides[prevIndex];
      if (!prevSlide) return;

      const v = $("video.hero-video", prevSlide);
      if (v) {
        try {
          v.pause();
          if (!isNaN(v.duration)) v.currentTime = 0;
        } catch (_) {}
      }
    },

    scrollToActive() {
      const active = VIDEO_GALLERY.getActiveSlide();
      if (!active) return;

      try {
        active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      } catch (_) {
        try { active.scrollIntoView(); } catch (_) {}
      }
    },

    render(prevIndex = null, options = {}) {
      const {
        doScroll = true,
        userInitiated = true
      } = options;

      if (typeof prevIndex === "number" && prevIndex !== VIDEO_GALLERY.index) {
        VIDEO_GALLERY.pauseOutgoing(prevIndex);
      }

      VIDEO_GALLERY.setActiveClass();
      VIDEO_GALLERY.setAria();

      if (doScroll) VIDEO_GALLERY.scrollToActive();

      if (userInitiated) {
        ENGAGED.markInteraction();
        VIDEO_MANAGER.markInteractionFromUser("gallery");
      }
    },

    goTo(nextIndex, options = {}) {
      const total = VIDEO_GALLERY.slides.length;
      if (!total) return;

      const prev = VIDEO_GALLERY.index;
      let idx = Number(nextIndex);
      if (Number.isNaN(idx)) idx = 0;

      if (idx < 0) idx = total - 1;
      if (idx >= total) idx = 0;

      VIDEO_GALLERY.index = idx;
      VIDEO_GALLERY.render(prev, {
        doScroll: options.doScroll !== undefined ? options.doScroll : true,
        userInitiated: options.userInitiated !== undefined ? options.userInitiated : true
      });
    },

    next() {
      VIDEO_GALLERY.goTo(VIDEO_GALLERY.index + 1, {
        doScroll: true,
        userInitiated: true
      });
    },

    prev() {
      VIDEO_GALLERY.goTo(VIDEO_GALLERY.index - 1, {
        doScroll: true,
        userInitiated: true
      });
    },

    bindKeyboard() {
      if (!CONFIG.VIDEO_GALLERY_KEYBOARD) return;

      window.addEventListener("keydown", (e) => {
        const tag = (e.target && e.target.tagName) ? String(e.target.tagName).toLowerCase() : "";
        if (tag === "input" || tag === "textarea" || tag === "select") return;

        if (e.key === "ArrowLeft") VIDEO_GALLERY.prev();
        if (e.key === "ArrowRight") VIDEO_GALLERY.next();
      });
    },

    bindCenterWhenInView() {
      if (!CONFIG.VIDEO_GALLERY_SCROLL_WHEN_IN_VIEW) return;
      if (!("IntersectionObserver" in window)) return;
      if (!VIDEO_GALLERY.root) return;

      VIDEO_GALLERY.inViewObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target !== VIDEO_GALLERY.root) return;
            if (!entry.isIntersecting) return;
            if (VIDEO_GALLERY.hasCenteredOnceInView) return;

            VIDEO_GALLERY.hasCenteredOnceInView = true;
            VIDEO_GALLERY.scrollToActive();

            try { VIDEO_GALLERY.inViewObserver.disconnect(); } catch (_) {}
          });
        },
        { root: null, threshold: CONFIG.VIDEO_GALLERY_INVIEW_THRESHOLD }
      );

      VIDEO_GALLERY.inViewObserver.observe(VIDEO_GALLERY.root);
    },

    bind() {
      if (!CONFIG.VIDEO_GALLERY_ENABLED) return;
      if (VIDEO_GALLERY.bound) return;

      VIDEO_GALLERY.root = $(CONFIG.VIDEO_GALLERY_SELECTOR);
      if (!VIDEO_GALLERY.root) return;

      VIDEO_GALLERY.track = $(CONFIG.VIDEO_GALLERY_TRACK_SELECTOR, VIDEO_GALLERY.root);
      VIDEO_GALLERY.slides = $$(CONFIG.VIDEO_GALLERY_SLIDE_SELECTOR, VIDEO_GALLERY.root);

      if (!VIDEO_GALLERY.track || !VIDEO_GALLERY.slides.length) return;

      VIDEO_GALLERY.prevBtn = $(CONFIG.VIDEO_GALLERY_PREV_SELECTOR, VIDEO_GALLERY.root);
      VIDEO_GALLERY.nextBtn = $(CONFIG.VIDEO_GALLERY_NEXT_SELECTOR, VIDEO_GALLERY.root);

      const initial = VIDEO_GALLERY.slides.findIndex((s) => s.classList.contains(CONFIG.VIDEO_GALLERY_ACTIVE_CLASS));
      VIDEO_GALLERY.index = initial >= 0 ? initial : 0;

      if (VIDEO_GALLERY.prevBtn) VIDEO_GALLERY.prevBtn.addEventListener("click", () => VIDEO_GALLERY.prev());
      if (VIDEO_GALLERY.nextBtn) VIDEO_GALLERY.nextBtn.addEventListener("click", () => VIDEO_GALLERY.next());

      VIDEO_GALLERY.bindKeyboard();

      VIDEO_GALLERY.render(null, {
        doScroll: !!CONFIG.VIDEO_GALLERY_SCROLL_ON_INIT,
        userInitiated: false
      });

      VIDEO_GALLERY.bindCenterWhenInView();

      VIDEO_GALLERY.bound = true;
      log("Video gallery bound:", VIDEO_GALLERY.slides.length);
    }
  };

  /* ===========================
     INIT: EVENTOS INICIAIS
     =========================== */

  const INIT = {
    fireInitialPixels() {
      PIXEL.init();
      PIXEL.track(CONFIG.PIXEL_EVENTS.PAGEVIEW, { ...CONTEXT.getPageMeta(), ...CONTEXT.getUTMMeta() });
      PIXEL.track(CONFIG.PIXEL_EVENTS.VIEWCONTENT, { ...CONTEXT.getPageMeta(), ...CONTEXT.getUTMMeta() });
    },

    initAll() {
      UTM.getCurrentUTMs();
      DEST.getDest();

      PIXEL.init();
      CONTENT_GATE.bind();

      UI.setDates();
      UI.bindCopyLink();

      MODAL.bind();

      HOT_PROGRESS.bind();
      HOT_COUNTDOWN.bind();
      HOT_STICKY.bind();
      HOT_QUIZ.bind();

      HOT_SCROLL_REVEAL.bind();
      VIDEO_DEBUG.bind();
      VIDEO_MANAGER.bind();
      VIDEO_UI.bind();
      VIDEO_GALLERY.bind();
      HERO_VIDEO_PIXEL.bind();

      INIT.fireInitialPixels();
      OUTBOUND.bind();
      SCROLL.bind();
      ENGAGED.bind();

      log("Init ok.");
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", INIT.initAll);
  } else {
    INIT.initAll();
  }
})();

/* ==========================================================
   HERO VIDEO CONTROLLER (REVISADO)
   - Compatível com <video class="hero-video">
   - ✅ Não força pause em loadedmetadata/loadeddata
========================================================== */

(() => {
  "use strict";

  const videos = Array.from(document.querySelectorAll("video.hero-video"));
  if (!videos.length) return;

  const safePause = (v) => {
    if (!v) return;
    try { v.pause(); } catch (_) {}
  };

  videos.forEach((v) => {
    const isHero = !!(v.closest(".video-hero"));
    const hasAutoplay = v.hasAttribute("autoplay");

    if (!isHero && !hasAutoplay) safePause(v);

    v.addEventListener("play", () => {
      // O VIDEO_MANAGER já garante “um por vez”.
    });
  });
})();
