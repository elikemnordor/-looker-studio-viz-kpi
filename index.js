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

  // Style (object format: style.{id}.value.{...})
  const style = data.style || {};
  const textColor = (style.textColor && style.textColor.value && style.textColor.value.color) || '#1f77b4';
  const fontSize = (style.fontSize && style.fontSize.value) || 36;

  // Data (object format)
  // Expect data.tables.DEFAULT to be an array of row objects keyed by IDs from config.json
  const rows = (data.tables && data.tables.DEFAULT) || [];
  const row = rows[0] || null;
  const dimId = 'dimension';
  const metId = 'metric';

  let labelText = '';
  let valueText = '-';

  if (row) {
    if (row[dimId] != null && row[dimId] !== '') {
      labelText = String(row[dimId]);
    }
    const metricVal = row[metId];
    valueText = formatNumber(metricVal);
  }

  if (labelText) {
    const labelEl = document.createElement('div');
    labelEl.className = 'kpi-label';
    labelEl.textContent = labelText;
    container.appendChild(labelEl);
  }

  const valueEl = document.createElement('div');
  valueEl.className = 'kpi-value';
  valueEl.textContent = valueText;
  valueEl.style.color = textColor;
  valueEl.style.fontSize = `${fontSize}px`;
  container.appendChild(valueEl);

  root.appendChild(container);
}

// IMPORTANT: use objectTransform, not tableTransform
function init() {
  dscc.subscribeToData(draw, { transform: dscc.objectTransform });
}
init();
