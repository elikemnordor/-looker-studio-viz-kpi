/* global dscc */

// Create a root container once
function ensureRoot() {
  let root = document.getElementById('root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
  }
  return root;
}

function formatNumber(value) {
  if (value == null || value === '' || isNaN(Number(value))) return '-';
  // Simple formatter; replace with Intl.NumberFormat as needed
  const num = Number(value);
  if (Math.abs(num) >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
  if (Math.abs(num) >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (Math.abs(num) >= 1_000) return (num / 1_000).toFixed(2) + 'K';
  return num.toLocaleString();
}

function draw(data) {
  const root = ensureRoot();
  root.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'kpi-container';

  // Read style controls (with defaults)
  const style = data.style || {};
  const textColor = style.textColor || '#1f77b4';
  const fontSize = Number(style.fontSize || 36);

  // Extract fields
  const hasRows = data.tables && data.tables.DEFAULT && data.tables.DEFAULT.length > 0;
  const row = hasRows ? data.tables.DEFAULT[0] : null;

  // Identify metric and dimension fields by ID from manifest
  const metricFieldId = 'metric';
  const dimensionFieldId = 'dimension';

  let labelText = '';
  let valueText = '-';

  if (row) {
    // Find dimension cell
    if (row[dimensionFieldId] != null && row[dimensionFieldId] !== '') {
      labelText = String(row[dimensionFieldId]);
    }
    // Find metric cell
    const metricVal = row[metricFieldId];
    valueText = formatNumber(metricVal);
  }

  // Optional label
  if (labelText) {
    const labelEl = document.createElement('div');
    labelEl.className = 'kpi-label';
    labelEl.textContent = labelText;
    container.appendChild(labelEl);
  }

  // Value
  const valueEl = document.createElement('div');
  valueEl.className = 'kpi-value';
  valueEl.textContent = valueText;
  valueEl.style.color = textColor;
  valueEl.style.fontSize = `${fontSize}px`;
  container.appendChild(valueEl);

  root.appendChild(container);
}

// Subscribe to updates using the legacy dscc API
// tableTransform gives rows keyed by component IDs (metric/dimension)
dscc.subscribeToData(draw, { transform: dscc.tableTransform });
