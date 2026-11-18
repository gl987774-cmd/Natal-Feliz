/**
 * =========================================================================
 * NATAL FEITO À MÃO - SCRIPT PRINCIPAL
 * =========================================================================
 * Aqui você pode configurar o link de checkout e as opções de notificação.
 */

const CONFIG = {
  // -------------------------------------------------------------
  // LINKS DE CHECKOUT (Altere aqui para seus próprios links de venda)
  // -------------------------------------------------------------
  // Link para comprar o Kit Completo direto da página:
  completeCheckoutUrl: 'https://pay.wiapy.com/ZgDp1yvfUWQU',

  // -------------------------------------------------------------
  // NOTIFICAÇÕES DE VENDAS EM TEMPO REAL (Prova Social)
  // -------------------------------------------------------------
  notificationsEnabled: true,       // Ativar ou desativar os popups de compra
  notificationIntervalMs: 8000,    // Tempo entre uma notificação e outra (8 segundos)
  notificationDurationMs: 4500,    // Tempo que cada notificação fica visível (4.5 segundos)

  recentBuyers: [
    { name: 'Patrícia Borghetto', kit: 'Kit Completo' },
    { name: 'Thelma Jussara', kit: 'Kit Completo + 5 Bônus' },
    { name: 'Esdra Souza', kit: 'Kit Completo' },
    { name: 'Sandra Duarte Lopes', kit: 'Kit Completo' },
    { name: 'Maria Regina Pereira dos Santos', kit: 'Kit Completo' },
    { name: 'Eliana Von Ah Souza', kit: 'Kit Completo' },
    { name: 'Nacilia Simões Mariano', kit: 'Kit Completo' },
    { name: 'Alessandra Ferreira de Souza', kit: 'Kit Completo + 5 Bônus' },
    { name: 'Rosane Pizetta da Cruz', kit: 'Kit Completo' },
    { name: 'Nathalia Guerra Ribeiro', kit: 'Kit Completo' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // =============================================================
  // 1. CONFIGURAÇÃO DOS LINKS DE CHECKOUT NOS BOTÕES
  // =============================================================
  // Botão do Kit Completo
  const completeCta = document.querySelector('.package-card--complete .package-cta');
  if (completeCta) {
    if (completeCta.tagName.toLowerCase() === 'a') {
      completeCta.href = CONFIG.completeCheckoutUrl;
    } else {
      completeCta.addEventListener('click', () => {
        window.location.href = CONFIG.completeCheckoutUrl;
      });
    }
  }

  // =============================================================
  // 2. VÍDEO VSL (CONTROLES DE SOM E REPRODUÇÃO)
  // =============================================================
  const video = document.querySelector('.hero-vsl__video');
  const soundBtn = document.querySelector('.hero-vsl__sound');

  if (video) {
    // Tentar autoplay com som mudo inicialmente
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay bloqueado pelo navegador, aguarda clique do usuário
      });
    }

    // Botão para ativar som
    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = false;
        video.currentTime = 0;
        video.play();
        soundBtn.style.opacity = '0';
        soundBtn.style.pointerEvents = 'none';
        setTimeout(() => {
          soundBtn.style.display = 'none';
        }, 300);
      });
    }

    // Clique no vídeo alterna Pausar / Retomar
    let userPaused = false;
    const toggleVideoPlay = () => {
      if (video.paused) {
        userPaused = false;
        video.play();
        video.setAttribute('aria-label', 'Pausar vídeo de apresentação');
      } else {
        userPaused = true;
        video.pause();
        video.setAttribute('aria-label', 'Retomar vídeo de apresentação');
      }
    };

    video.addEventListener('click', toggleVideoPlay);
    video.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleVideoPlay();
      }
    });

    // Desabilitar menu de contexto do botão direito no vídeo
    video.addEventListener('contextmenu', (e) => e.preventDefault());

    // Retomar a reprodução quando o navegador permite (visibilidade, reload, interação)
    const resumeIfNeeded = () => {
      if (video && video.paused && !userPaused) {
        video.play().catch(() => {});
      }
    };

    video.addEventListener('canplay', resumeIfNeeded);
    window.addEventListener('pageshow', resumeIfNeeded);
    document.addEventListener('visibilitychange', resumeIfNeeded);
    document.addEventListener('pointerdown', (e) => {
      if (e.target !== video) resumeIfNeeded();
    }, { passive: true });
  }

  // =============================================================
  // 3. MODAL DE ZOOM DOS RESULTADOS / FEEDBACKS
  // =============================================================
  const feedbackButtons = document.querySelectorAll('.hero-results__print');
  const resultsDialog = document.querySelector('.hero-results__dialog');
  const resultsCloseBtn = document.querySelector('.hero-results__close');

  if (resultsDialog) {
    // Garante que exista um elemento img dentro do dialog para receber a foto
    let dialogImg = resultsDialog.querySelector('img');
    if (!dialogImg) {
      dialogImg = document.createElement('img');
      dialogImg.style.borderRadius = '10px';
      dialogImg.style.width = '100%';
      dialogImg.style.height = 'auto';
      dialogImg.style.display = 'block';
      resultsDialog.appendChild(dialogImg);
    }

    feedbackButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const img = btn.querySelector('img');
        if (img && dialogImg) {
          dialogImg.src = img.src;
          dialogImg.alt = img.alt || 'Feedback ampliado';
        }
        resultsDialog.showModal();
      });
    });

    if (resultsCloseBtn) {
      resultsCloseBtn.addEventListener('click', () => {
        resultsDialog.close();
      });
    }

    // Fechar ao clicar fora (backdrop)
    resultsDialog.addEventListener('click', (e) => {
      if (e.target === resultsDialog) {
        resultsDialog.close();
      }
    });
  }

  // =============================================================
  // 5. ROLAGEM SUAVE PARA A SEÇÃO DE OFERTA
  // =============================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // =============================================================
  // 5.5. ANIMAÇÕES DE ENTRADA (REVEAL) VIA INTERSECTION OBSERVER
  // O CSS comuta o estado "is-visible" conforme o elemento entra na viewport
  // =============================================================
  const revealElements = document.querySelectorAll('.projects-marquees, .carousel-window, .package-cta--complete');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.05 });
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // =============================================================
  // 5.6. DRAG PARA SCRER NO CARROSSEL DE DEPOIMENTOS (TOUCH)
  // =============================================================
  const carousels = document.querySelectorAll('.carousel-window');
  let dragState = null;

  const releaseCarouselDrag = (e) => {
    if (!dragState || dragState.pointerId !== e.pointerId) return;
    const anim = dragState.animation;
    dragState = null;
    if (anim) {
      try { anim.play(); } catch (err) {}
    }
  };

  document.addEventListener('pointermove', (e) => {
    if (!dragState || dragState.pointerId !== e.pointerId) return;
    const st = dragState;
    const delta = e.clientX - st.lastX;
    st.lastX = e.clientX;
    const current = Number(st.animation.currentTime || 0);
    const next = ((current - (delta / st.groupWidth) * st.duration) % st.duration + st.duration) % st.duration;
    try { st.animation.currentTime = next; } catch (err) {}
  }, { passive: true });

  document.addEventListener('pointerup', (e) => releaseCarouselDrag(e), { passive: true });
  document.addEventListener('pointercancel', (e) => releaseCarouselDrag(e), { passive: true });

  carousels.forEach((win) => {
    win.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'touch') return;
      const track = win.querySelector('.carousel-track');
      const groupWidth = track && track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width : 0;
      const animation = track ? track.getAnimations()[0] : null;
      if (!animation || !groupWidth) return;
      if (typeof e.currentTarget.setPointerCapture === 'function') e.currentTarget.setPointerCapture(e.pointerId);
      dragState = {
        pointerId: e.pointerId,
        lastX: e.clientX,
        animation,
        groupWidth,
        duration: Number(animation.effect && animation.effect.getComputedTiming && animation.effect.getComputedTiming().duration) || 4000
      };
      try { animation.pause(); } catch (err) {}
    });
  });

  // =============================================================
  // 6. NOTIFICAÇÕES DE COMPRAS EM TEMPO REAL (PROVA SOCIAL)
  // =============================================================
  if (CONFIG.notificationsEnabled && CONFIG.recentBuyers.length > 0) {
    let buyerIndex = 0;
    let notifElement = null;
    let notifTimeout = null;

    function createNotificationElement() {
      const aside = document.createElement('aside');
      aside.className = 'purchase-notification';
      aside.setAttribute('aria-label', 'Compra de uma cliente');
      aside.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

      aside.innerHTML = `
        <span class="purchase-notification__icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
        <div class="purchase-notification__copy">
          <strong id="purchase-notif-name"></strong>
          <p>acabou de comprar o <b id="purchase-notif-kit"></b></p>
        </div>
        <button type="button" class="purchase-notification__close" aria-label="Ocultar notificações de compras">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;

      aside.querySelector('.purchase-notification__close').addEventListener('click', () => {
        aside.remove();
        if (notifTimeout) clearTimeout(notifTimeout);
      });

      document.body.appendChild(aside);
      return aside;
    }

    let audioCtx = null;

    function playNotifySound() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioCtx) audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
        if (audioCtx.state !== 'running') return;
        const start = audioCtx.currentTime;
        [660, 880].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const t0 = start + idx * 0.09;
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.setValueAtTime(0, t0);
          gain.linearRampToValueAtTime(0.025, t0 + 0.015);
          gain.exponentialRampToValueAtTime(1e-4, t0 + 0.18);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.onended = () => { osc.disconnect(); gain.disconnect(); };
          osc.start(t0);
          osc.stop(t0 + 0.19);
        });
      } catch (e) {}
    }

    function showNextNotification() {
      const buyer = CONFIG.recentBuyers[buyerIndex];
      buyerIndex = (buyerIndex + 1) % CONFIG.recentBuyers.length;

      if (!notifElement) {
        notifElement = createNotificationElement();
      }

      const nameEl = notifElement.querySelector('#purchase-notif-name');
      const kitEl = notifElement.querySelector('#purchase-notif-kit');

      if (nameEl && kitEl) {
        nameEl.textContent = buyer.name;
        nameEl.title = buyer.name;
        kitEl.textContent = buyer.kit;
      }

      notifElement.style.display = 'flex';
      notifElement.style.opacity = '1';
      notifElement.style.transform = 'translateY(0)';

      playNotifySound();

      setTimeout(() => {
        if (notifElement) {
          notifElement.style.opacity = '0';
          notifElement.style.transform = 'translateY(12px)';
          setTimeout(() => {
            if (notifElement) notifElement.style.display = 'none';
          }, 400);
        }
      }, CONFIG.notificationDurationMs);
    }

    // Iniciar após 3 segundos da abertura da página
    setTimeout(() => {
      showNextNotification();
      setInterval(showNextNotification, CONFIG.notificationIntervalMs);
    }, 3000);
  }
});
