document.addEventListener('DOMContentLoaded', () => {
  const trackingForm = document.getElementById('tracking-form');
  const trackingInput = document.getElementById('tracking-input');
  const trackingResult = document.getElementById('tracking-result');

  // Database Mock Data
  const mockDatabase = {
    "VVX100001": { status: "Delivered", step: 4, date: "2026-03-28", loc: "New York, NY" },
    "VVX100002": { status: "In Transit", step: 3, date: "2026-03-29", loc: "Chicago, IL" },
    "VVX100003": { status: "Out For Delivery", step: 3, date: "2026-03-30", loc: "Austin, TX" },
    "VVX100004": { status: "Picked Up", step: 2, date: "2026-03-29", loc: "San Francisco, CA" },
    "VVX100005": { status: "Processing", step: 1, date: "2026-03-30", loc: "Hub Facility" }
  };

  // Auto-fill query parameter if routed from Home Search
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get('id');
  if (idParam) {
    trackingInput.value = idParam;
    processTracking(idParam);
  }

  if (trackingForm) {
    trackingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = trackingInput.value.trim().toUpperCase();
      processTracking(id);
    });
  }

  function processTracking(id) {
    if (!id) return;

    const data = mockDatabase[id];

    if (!data) {
      trackingResult.innerHTML = `
        <div class="card" style="text-align: center; color: #ef4444;">
          <h3>Tracking ID Not Found</h3>
          <p>Please verify your tracking number and try again.</p>
        </div>
      `;
      return;
    }

    const steps = [
      "Shipment Created",
      "Picked Up",
      "In Transit",
      "Delivered"
    ];

    let timelineHTML = '';
    steps.forEach((stepName, idx) => {
      const isCompleted = (idx + 1) <= data.step;
      timelineHTML += `
        <div class="timeline-item ${isCompleted ? 'active' : ''}">
          <h4>${stepName}</h4>
          <p>${isCompleted ? 'Completed / Verified' : 'Pending'}</p>
        </div>
      `;
    });

    trackingResult.innerHTML = `
      <div class="card">
        <h3>Status for ID: ${id}</h3>
        <p><strong>Current Status:</strong> <span style="color: var(--accent);">${data.status}</span></p>
        <p><strong>Location:</strong> ${data.loc}</p>
        <p><strong>Last Updated:</strong> ${data.date}</p>
        <div class="timeline" style="margin-top: 2rem;">
          ${timelineHTML}
        </div>
      </div>
    `;
  }
});