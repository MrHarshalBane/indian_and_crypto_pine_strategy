// Pine Strategy Documentation & Trader Tools Controller
document.addEventListener('DOMContentLoaded', () => {
  // --- Toast Notification Helper ---
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  let toastTimer = null;

  function showToast(msg) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2500);
  }

  // --- Clipboard Copy Helper ---
  function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (err) {
      alert('Unable to copy automatically. Please select the text and copy manually.');
    }
    document.body.removeChild(textarea);
  }

  // --- Copy Script Buttons ---
  const pineScriptCode = document.getElementById('pine-script-code');
  const btnCopyNav = document.getElementById('btn-copy-nav');
  const btnCopyCode = document.getElementById('btn-copy-code');
  const btnDownload = document.getElementById('btn-download');

  if (btnCopyNav && pineScriptCode) {
    btnCopyNav.addEventListener('click', () => {
      copyTextToClipboard(pineScriptCode.textContent, 'Pine Script copied to clipboard!');
    });
  }

  if (btnCopyCode && pineScriptCode) {
    btnCopyCode.addEventListener('click', () => {
      copyTextToClipboard(pineScriptCode.textContent, 'Pine Script copied to clipboard!');
    });
  }

  // --- Download .pine File ---
  if (btnDownload && pineScriptCode) {
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

  // --- Webhook Tabs Switching ---
  const tabBtns = document.querySelectorAll('.wh-tab-btn');
  const tabPanes = document.querySelectorAll('.wh-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.dataset.target;
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // Copy Payload Buttons in Webhook Panes
  const copyPayloadBtns = document.querySelectorAll('.btn-copy-payload');
  copyPayloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const codeId = btn.dataset.code;
      const codeEl = document.getElementById(codeId);
      if (codeEl) {
        copyTextToClipboard(codeEl.textContent, 'Webhook JSON payload copied!');
      }
    });
  });

  // --- Position Sizing & Risk Calculator ---
  const calcCurrency = document.getElementById('calc-currency');
  const calcCapital = document.getElementById('calc-capital');
  const calcRiskPct = document.getElementById('calc-risk-pct');
  const calcRr = document.getElementById('calc-rr');
  const calcEntry = document.getElementById('calc-entry');
  const calcSl = document.getElementById('calc-sl');

  const resQty = document.getElementById('res-qty');
  const resExposure = document.getElementById('res-exposure');
  const resRisk = document.getElementById('res-risk');
  const resRiskSub = document.getElementById('res-risk-sub');
  const resTarget = document.getElementById('res-target');
  const resTargetPts = document.getElementById('res-target-pts');
  const resReward = document.getElementById('res-reward');
  const resRewardRr = document.getElementById('res-reward-rr');
  const calcStatusBox = document.getElementById('calc-status-box');

  function calculatePosition() {
    if (!calcCapital || !calcRiskPct || !calcEntry || !calcSl) return;

    const currencySymbol = calcCurrency && calcCurrency.value === 'USD' ? '$' : '₹';
    const capital = parseFloat(calcCapital.value) || 0;
    const riskPct = parseFloat(calcRiskPct.value) || 0;
    const rr = parseFloat(calcRr.value) || 2.0;
    const entry = parseFloat(calcEntry.value) || 0;
    const sl = parseFloat(calcSl.value) || 0;

    const riskAmount = (capital * riskPct) / 100;
    const slDistance = Math.abs(entry - sl);

    if (entry <= 0 || sl <= 0 || slDistance === 0) {
      resQty.textContent = '0 shares';
      resExposure.textContent = 'Invalid entry/SL inputs';
      resRisk.textContent = `${currencySymbol}0.00`;
      resTarget.textContent = `${currencySymbol}0.00`;
      resReward.textContent = `${currencySymbol}0.00`;
      calcStatusBox.innerHTML = `<i class="fa-solid fa-circle-exclamation text-danger"></i> <span>Please enter a valid entry and stop loss price with non-zero distance.</span>`;
      return;
    }

    const isLong = entry > sl;
    const qty = Math.floor(riskAmount / slDistance);
    const exposure = qty * entry;
    const targetDistance = slDistance * rr;
    const targetPrice = isLong ? entry + targetDistance : entry - targetDistance;
    const totalPotentialReward = qty * targetDistance;

    const formattedExposure = exposure.toLocaleString(undefined, { maximumFractionDigits: 0 });
    const formattedRisk = riskAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedTarget = targetPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedReward = totalPotentialReward.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    resQty.textContent = `${qty.toLocaleString()} ${calcCurrency.value === 'USD' ? 'units' : 'shares'}`;
    resExposure.textContent = `Total capital allocated: ${currencySymbol}${formattedExposure}`;
    resRisk.textContent = `${currencySymbol}${formattedRisk}`;
    resRiskSub.textContent = `${riskPct.toFixed(1)}% of total capital`;

    const sign = isLong ? '+' : '-';
    const pctMove = ((targetDistance / entry) * 100).toFixed(2);
    resTarget.textContent = `${currencySymbol}${formattedTarget}`;
    resTargetPts.textContent = `${sign}${targetDistance.toFixed(2)} pts (${sign}${pctMove}%)`;

    resReward.textContent = `${currencySymbol}${formattedReward}`;
    resRewardRr.textContent = `Based on 1:${rr.toFixed(1)} Risk:Reward ratio`;

    // Health check on capital exposure
    if (exposure > capital) {
      const leverageRatio = (exposure / capital).toFixed(1);
      calcStatusBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> <span>Note: Capital allocation (${currencySymbol}${formattedExposure}) exceeds base account capital by ${leverageRatio}x. Use margin or reduce risk percentage.</span>`;
    } else {
      calcStatusBox.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> <span>Parameters valid: Trade risk is strictly limited to ${riskPct.toFixed(1)}% (${currencySymbol}${formattedRisk}).</span>`;
    }
  }

  // Currency change handler to update default values nicely
  if (calcCurrency) {
    calcCurrency.addEventListener('change', () => {
      if (calcCurrency.value === 'USD') {
        calcCapital.value = '10000';
        calcEntry.value = '65000.00';
        calcSl.value = '64200.00';
      } else {
        calcCapital.value = '100000';
        calcEntry.value = '2500.00';
        calcSl.value = '2465.00';
      }
      calculatePosition();
    });
  }

  const calcElements = [calcCapital, calcRiskPct, calcRr, calcEntry, calcSl];
  calcElements.forEach(el => {
    if (el) el.addEventListener('input', calculatePosition);
  });

  // Initial calculation
  calculatePosition();
});
