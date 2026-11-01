const toast = document.querySelector('#toast');
const year = document.querySelector('#year');

let toastTimer;

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
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
  }

  const copied = await copyText(window.location.href);
  showToast(copied ? 'Ссылка на сайт скопирована.' : 'Не удалось скопировать ссылку.');
});

document.querySelectorAll('[download]').forEach((link) => {
  link.addEventListener('click', () => {
    showToast('Загрузка APK началась. Проверь папку «Загрузки».');
  });
});
