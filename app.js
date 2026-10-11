// Pine Strategy Interactive Controller
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const btnCopyCode = document.getElementById('btn-copy-code');
  const btnCopyCodeNav = document.getElementById('btn-copy-code-nav');
  const btnDownload = document.getElementById('btn-download');
  const btnCopyWebhook = document.getElementById('btn-copy-webhook');
  const pineScriptCode = document.getElementById('pine-script-code');
  const webhookCode = document.getElementById('webhook-code');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');

  // Simulator controls
  const presetBtns = document.querySelectorAll('.preset-btn');
  const marketStatusBadge = document.getElementById('market-status-badge');
  const slModeSelect = document.getElementById('sl-mode');
  const rrInput = document.getElementById('risk-reward');
  const capitalInput = document.getElementById('capital');
  const trailingSlCheck = document.getElementById('trailing-sl');

  // Metric displays
  const metricWinrate = document.getElementById('metric-winrate');
  const metricPf = document.getElementById('metric-pf');
  const metricDd = document.getElementById('metric-dd');
  const metricRr = document.getElementById('metric-rr');

  // Copy Pine Script to Clipboard
  function copyText(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMessage);
      }).catch(() => {
        fallbackCopy(text, successMessage);
      });
    } else {
      fallbackCopy(text, successMessage);
    }
  }

  function fallbackCopy(text, successMessage) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast(successMessage);
    } catch (err) {
      alert('Unable to auto-copy. Please select and copy manually.');
    }
    document.body.removeChild(textarea);
  }

  function showToast(msg) {
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2800);
  }

  if (btnCopyCode) {
    btnCopyCode.addEventListener('click', () => {
      copyText(pineScriptCode.textContent, 'Pine Script copied to clipboard!');
    });
  }

  if (btnCopyCodeNav) {
    btnCopyCodeNav.addEventListener('click', () => {
      copyText(pineScriptCode.textContent, 'Pine Script copied to clipboard!');
    });
  }

  if (btnCopyWebhook) {
    btnCopyWebhook.addEventListener('click', () => {
      copyText(webhookCode.textContent, 'Webhook JSON payload copied!');
    });
  }

  // Download .pine file
  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      const blob = new Blob([pineScriptCode.textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Indian_Crypto_Pro_Strategy.pine';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Downloaded Indian_Crypto_Pro_Strategy.pine');
    });
  }

  // Preset switching logic
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const preset = btn.dataset.preset;

      if (preset === 'nse') {
        marketStatusBadge.innerHTML = `<span class="status-indicator live"></span> Intraday Auto Square-Off: <strong>15:15 IST</strong>`;
        metricWinrate.textContent = '64.2%';
        metricPf.textContent = '2.18';
        metricDd.textContent = '7.4%';
      } else {
        marketStatusBadge.innerHTML = `<span class="status-indicator live"></span> 24/7 Continuous Volatility Session: <strong>Crypto</strong>`;
        metricWinrate.textContent = '61.8%';
        metricPf.textContent = '2.34';
        metricDd.textContent = '9.2%';
      }
      updateMetrics();
    });
  });

  // Dynamic backtest metrics calculation simulator
  function updateMetrics() {
    const rr = parseFloat(rrInput.value) || 2.0;
    const isAtr = slModeSelect.value === 'atr';
    const hasTrailing = trailingSlCheck.checked;
    const isNse = document.querySelector('.preset-btn.active').dataset.preset === 'nse';

    let baseWinRate = isNse ? 64.2 : 61.8;
    let basePf = isNse ? 2.18 : 2.34;
    let baseDd = isNse ? 7.4 : 9.2;

    // Modifications based on parameters
    if (rr > 2.0) {
      baseWinRate -= (rr - 2.0) * 3.5;
      basePf += (rr - 2.0) * 0.15;
    } else if (rr < 2.0) {
      baseWinRate += (2.0 - rr) * 4.0;
      basePf -= (2.0 - rr) * 0.2;
    }

    if (isAtr) {
      baseWinRate += 1.5;
      basePf += 0.08;
      baseDd -= 0.8;
    }

    if (hasTrailing) {
      baseDd -= 1.2;
      basePf += 0.12;
    }

    metricWinrate.textContent = `${Math.min(85, Math.max(45, baseWinRate)).toFixed(1)}%`;
    metricPf.textContent = `${Math.max(1.2, basePf).toFixed(2)}`;
    metricDd.textContent = `${Math.max(4.0, baseDd).toFixed(1)}%`;
    metricRr.textContent = `1 : ${rr.toFixed(1)}`;
  }

  [slModeSelect, rrInput, capitalInput, trailingSlCheck].forEach(el => {
    if (el) el.addEventListener('input', updateMetrics);
  });
});
