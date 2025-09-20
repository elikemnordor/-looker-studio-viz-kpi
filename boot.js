(function loadDSCCAndApp() {
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = resolve;
      s.onerror = function (e) {
        console.error('Failed to load', src, e);
        reject(e);
      };
      document.head.appendChild(s);
    });
  }

  var DSCC_JSDELIVR = 'https://cdn.jsdelivr.net/npm/@google/dscc@0.3.22/_bundles/dscc.min.js';
  var DSCC_UNPKG = 'https://unpkg.com/@google/dscc@0.3.22/_bundles/dscc.min.js';
  var APP = 'https://looker-studio-viz-kpi.pages.dev/index.js?v=2';

  loadScript(DSCC_JSDELIVR)
    .catch(function () { return loadScript(DSCC_UNPKG); })
    .then(function () { return loadScript(APP); })
    .catch(function (e) { console.error('Boot failed', e); });
})();
