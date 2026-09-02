const http = require('http');

const PORT = 3000;

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>und-wms Warehouse Management System (Mock Simulator)</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 900px; margin: 0 auto; background: #1e293b; padding: 30px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h1 { color: #38bdf8; font-size: 24px; border-bottom: 2px solid #334155; padding-bottom: 10px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: 600; color: #94a3b8; }
    input, select { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #fff; box-sizing: border-box; }
    button { background: #0284c7; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; }
    button:hover { background: #0369a1; }
    .hidden { display: none !important; }
    .error { color: #f87171; background: #450a0a; padding: 10px; border-radius: 6px; margin-top: 10px; }
    .success { color: #4ade80; background: #052e16; padding: 10px; border-radius: 6px; margin-top: 10px; }
    .badge { display: inline-block; background: #38bdf8; color: #0f172a; font-weight: bold; padding: 4px 10px; border-radius: 20px; font-size: 12px; }
    .nav { display: flex; gap: 15px; background: #334155; padding: 10px; border-radius: 8px; margin-bottom: 20px; }
    .nav button { background: transparent; color: #cbd5e1; font-weight: 600; border: none; padding: 8px 16px; }
    .nav button.active { background: #0284c7; color: white; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📦 und-wms Warehouse Management Portal</h1>

    <!-- LOGIN CONTAINER -->
    <div id="login-container">
      <h2>System Authentication</h2>
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" placeholder="Enter username">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" placeholder="Enter password">
      </div>
      <div class="form-group">
        <label for="warehouse">Warehouse Facility</label>
        <select id="warehouse">
          <option value="">-- Select Warehouse --</option>
          <option value="WH-MAIN-01">WH-MAIN-01 (Main Distribution Center)</option>
          <option value="WH-EAST-02">WH-EAST-02 (East Coast Fulfillment Hub)</option>
        </select>
      </div>
      <button id="login-btn" onclick="handleLogin()">Login to WMS</button>
      <div id="error-message" class="error hidden"></div>
    </div>

    <!-- DASHBOARD CONTAINER -->
    <div id="dashboard-container" class="hidden">
      <div class="nav">
        <button id="nav-dashboard" class="active">Dashboard</button>
        <button id="nav-inbound" onclick="showInbound()">Inbound Receiving</button>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div>User: <span id="user-badge" class="badge"></span></div>
        <div>Warehouse: <span id="active-warehouse" class="badge"></span></div>
      </div>

      <!-- INBOUND MODULE CONTAINER -->
      <div id="inbound-module-container" class="hidden">
        <h2>📥 Inbound Operations & Receiving</h2>
        <div style="background: #0f172a; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h3>1. Search Purchase Order (PO) / ASN</h3>
          <div style="display: flex; gap: 10px;">
            <input type="text" id="po-search-input" placeholder="e.g. PO-2026-9901">
            <button id="btn-search-po" onclick="searchPO()">Search PO</button>
          </div>
          <div style="margin-top: 10px;">
            PO Status: <span id="po-status-badge" class="badge">OPEN</span>
          </div>
        </div>

        <div style="background: #0f172a; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h3>2. Assign Dock & Goods Receipt</h3>
          <div class="form-group">
            <label for="dock-door-select">Dock Door</label>
            <select id="dock-door-select">
              <option value="">-- Select Dock --</option>
              <option value="DOCK-04">DOCK-04</option>
              <option value="DOCK-02">DOCK-02</option>
            </select>
          </div>
          <div class="form-group">
            <label for="sku-input">Item SKU</label>
            <input type="text" id="sku-input" placeholder="e.g. SKU-BARCODE-1001">
          </div>
          <div style="display: flex; gap: 15px;">
            <div class="form-group" style="flex: 1;">
              <label for="received-qty-input">Good Qty Received</label>
              <input type="number" id="received-qty-input" value="0">
            </div>
            <div class="form-group" style="flex: 1;">
              <label for="damaged-qty-input">Damaged Qty</label>
              <input type="number" id="damaged-qty-input" value="0">
            </div>
          </div>
          <button id="btn-confirm-receipt" onclick="confirmReceipt()">Confirm Receipt & Generate LPN</button>
          <div style="margin-top: 10px;">
            LPN Tag: <span id="generated-lpn-badge" class="badge">NOT GENERATED</span>
          </div>
        </div>

        <div style="background: #0f172a; padding: 15px; border-radius: 8px;">
          <h3>3. Bin Putaway Assignment</h3>
          <div class="form-group">
            <label for="target-bin-input">Target Bin Location</label>
            <input type="text" id="target-bin-input" placeholder="e.g. BIN-A1-04">
          </div>
          <button id="btn-execute-putaway" onclick="executePutaway()">Execute Putaway</button>
          <div id="putaway-status-msg" class="success hidden"></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    function handleLogin() {
      const u = document.getElementById('username').value;
      const p = document.getElementById('password').value;
      const w = document.getElementById('warehouse').value;
      const err = document.getElementById('error-message');

      if (p === 'Password123!') {
        err.classList.add('hidden');
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('dashboard-container').classList.remove('hidden');
        document.getElementById('user-badge').innerText = u;
        document.getElementById('active-warehouse').innerText = w;
      } else {
        err.innerText = 'Invalid credentials provided. Access denied.';
        err.classList.remove('hidden');
      }
    }

    function showInbound() {
      document.getElementById('inbound-module-container').classList.remove('hidden');
    }

    function searchPO() {
      const po = document.getElementById('po-search-input').value;
      const badge = document.getElementById('po-status-badge');
      badge.innerText = 'OPEN (' + po + ')';
    }

    let generatedLpnSeq = 8801;

    function confirmReceipt() {
      const po = document.getElementById('po-search-input').value;
      const sku = document.getElementById('sku-input').value;
      const dmg = parseInt(document.getElementById('damaged-qty-input').value || '0');
      generatedLpnSeq++;
      const lpn = 'LPN-' + generatedLpnSeq;
      
      document.getElementById('generated-lpn-badge').innerText = lpn;
      document.getElementById('po-status-badge').innerText = 'RECEIVED';
      
      if (dmg > 0) {
        document.getElementById('putaway-status-msg').innerText = 'QUARANTINE HOLD APPLIED FOR ' + dmg + ' DAMAGED UNITS';
        document.getElementById('putaway-status-msg').classList.remove('hidden');
      }
    }

    function executePutaway() {
      const bin = document.getElementById('target-bin-input').value;
      const lpn = document.getElementById('generated-lpn-badge').innerText;
      const msg = document.getElementById('putaway-status-msg');
      msg.innerText = 'Putaway Successful: ' + lpn + ' assigned to ' + bin;
      msg.classList.remove('hidden');
    }
  </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(htmlContent);
});

server.listen(PORT, () => {
  console.log(`🚀 Mock WMS Application Server running at http://localhost:${PORT}`);
});
