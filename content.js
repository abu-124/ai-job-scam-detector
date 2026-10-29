const HIGH_RISK_KEYWORDS = ["registration fee", "security deposit", "wire transfer", "pay for training"];
const MODERATE_RISK_KEYWORDS = ["@gmail.com", "@yahoo.com", "telegram interview", "whatsapp interview"];

function scanPageContent() {
  const pageText = document.body.innerText.toLowerCase();
  
  const highFound = HIGH_RISK_KEYWORDS.filter(kw => pageText.includes(kw));
  const moderateFound = MODERATE_RISK_KEYWORDS.filter(kw => pageText.includes(kw));

  if (highFound.length > 0) {
    injectBanner("High Risk Detected!", `Red flags found: ${highFound.join(', ')}`, "#dc2626");
  } else if (moderateFound.length > 0) {
    injectBanner("Moderate Risk Warning", `Suspicious items found: ${moderateFound.join(', ')}`, "#d97706");
  }
}

function injectBanner(title, details, bgColor) {
  if (document.getElementById('scam-detector-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'scam-detector-banner';
  banner.style.cssText = `
    position: fixed;
    top: 0; left: 0; width: 100%;
    background-color: ${bgColor};
    color: white; text-align: center;
    padding: 10px; font-size: 14px;
    font-weight: bold; z-index: 999999;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  `;
  banner.innerHTML = `⚠️ <strong>${title}</strong>: ${details} 
    <button id="closeScamBanner" style="margin-left:15px; background:white; color:${bgColor}; border:none; padding:3px 8px; cursor:pointer; border-radius:4px; font-weight:bold;">Dismiss</button>`;

  document.body.prepend(banner);
  document.getElementById('closeScamBanner').addEventListener('click', () => banner.remove());
}

window.addEventListener('load', scanPageContent);
