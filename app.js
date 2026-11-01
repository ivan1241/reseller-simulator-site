const toast = document.querySelector('#toast');
const year = document.querySelector('#year');
const PUBLIC_URL = 'https://is.gd/resellersim';
const ONLINE_TOPIC = 'reseller-sim-online-23742d83bb00a1ac9b4c74e5bc5f619a';
const ONLINE_ENDPOINT = `https://ntfy.sh/${ONLINE_TOPIC}/json?poll=1&since=2m`;
const ONLINE_WINDOW_SECONDS = 90;
const ONLINE_POLL_MS = 20000;
const onlineWidget = document.querySelector('#online-widget');
const onlineCount = document.querySelector('#online-count');
const onlineNote = document.querySelector('#online-note');
const onlineSessions = new Map();

let toastTimer;
let onlineBusy = false;

function showToast(message) {
  if (!toast) return;

  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2600);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy copy path.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }

  textarea.remove();
  return copied;
}

if (year) {
  year.textContent = String(new Date().getFullYear());
}

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = document.querySelector(button.dataset.copy);
    if (!target) return;

    const copied = await copyText(target.textContent.trim());
    showToast(copied ? 'Контрольная сумма скопирована.' : 'Не удалось скопировать.');
  });
});

const shareButton = document.querySelector('[data-share]');

shareButton?.addEventListener('click', async () => {
  const shareData = {
    title: 'Reseller Simulator',
    text: 'Прямая загрузка APK для Android — без Telegram и регистрации.',
    url: PUBLIC_URL,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
  }

  const copied = await copyText(PUBLIC_URL);
  showToast(copied ? 'Короткая ссылка скопирована.' : 'Не удалось скопировать ссылку.');
});

function renderOnline(count, note) {
  if (onlineCount) onlineCount.textContent = count === null ? '—' : String(count);
  if (onlineNote) onlineNote.textContent = note;
  onlineWidget?.classList.toggle('is-offline', count === null);
}

async function updateOnlineCount() {
  if (!onlineCount || onlineBusy || document.visibilityState === 'hidden') return;

  if (navigator.onLine === false) {
    renderOnline(null, 'нет сети');
    return;
  }

  onlineBusy = true;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(ONLINE_ENDPOINT, {
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    const now = Math.floor(Date.now() / 1000);

    for (const line of text.split('\n')) {
      if (!line.trim()) continue;

      let event;
      try {
        event = JSON.parse(line);
      } catch {
        continue;
      }

      if (event.event !== 'message' || typeof event.message !== 'string') continue;

      let payload;
      try {
        payload = JSON.parse(event.message);
      } catch {
        continue;
      }

      if (typeof payload.session !== 'string' || !payload.session) continue;

      if (payload.leave === true) {
        onlineSessions.delete(payload.session);
      } else {
        onlineSessions.set(payload.session, Number(event.time) || now);
      }
    }

    for (const [session, time] of onlineSessions) {
      if (now - time > ONLINE_WINDOW_SECONDS) onlineSessions.delete(session);
    }

    const count = onlineSessions.size;
    renderOnline(count, count === 0 ? 'пока никого' : 'в реальном времени');
  } catch {
    renderOnline(null, 'нет связи со счётчиком');
  } finally {
    window.clearTimeout(timeout);
    onlineBusy = false;
  }
}

if (onlineCount) {
  updateOnlineCount();
  window.setInterval(updateOnlineCount, ONLINE_POLL_MS);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') updateOnlineCount();
  });
}

document.querySelectorAll('[download]').forEach((link) => {
  link.addEventListener('click', () => {
    showToast('Загрузка APK началась. Проверь папку «Загрузки».');
  });
});
