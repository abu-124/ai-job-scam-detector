const BACKEND_URL = "https://ai-scam-backend-8x42.onrender.com/analyze";

document.getElementById('scanBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const statusContainer = document.getElementById('statusContainer');
  const statusBadge = document.getElementById('statusBadge');
  const statusDetails = document.getElementById('statusDetails');

  statusContainer.classList.remove('hidden');
  statusBadge.textContent = "AI Scanning...";
  statusBadge.className = "badge warning";
  statusDetails.textContent = "Connecting to hosted AI model for evaluation...";

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      return {
        text: document.body.innerText,
        url: window.location.href
      };
    }
  }, async (results) => {
    if (!results || !results[0] || !results[0].result) {
      statusBadge.textContent = "Error";
      statusBadge.className = "badge danger";
      statusDetails.textContent = "Unable to read content from this tab.";
      return;
    }

    const { text, url } = results[0].result;

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text, url: url })
      });

      const data = await response.json();

      if (data.level === "danger") {
        statusBadge.textContent = "High Risk";
        statusBadge.className = "badge danger";
        statusDetails.textContent = `🚨 ${data.reason}`;
      } else if (data.level === "warning") {
        statusBadge.textContent = "Moderate Risk";
        statusBadge.className = "badge warning";
        statusDetails.textContent = `⚠️ ${data.reason}`;
      } else {
        statusBadge.textContent = "Safe";
        statusBadge.className = "badge safe";
        statusDetails.textContent = `✅ ${data.reason}`;
      }

    } catch (err) {
      statusBadge.textContent = "Offline Error";
      statusBadge.className = "badge danger";
      statusDetails.textContent = "Could not reach hosted AI server. Check backend connection.";
    }
  });
});