(function () {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === 'disabled.html' || path === 'site-config.json') {
        return;
    }

    fetch('site-config.json?t=' + Date.now())
        .then(function (response) { return response.ok ? response.json() : { enabled: true }; })
        .then(function (config) {
            if (config && config.enabled === false) {
                window.location.replace('disabled.html');
            }
        })
        .catch(function () { });
})();
