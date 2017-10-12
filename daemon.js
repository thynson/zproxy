console.info('Loaded zproxy');
browser.proxy.register("proxy.js");
function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

fetch('https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt')
    .then((r)=>r.text())
    .then(b64DecodeUnicode)
    .then(rule=> {
        console.info('Loaded GFW List');
        browser.runtime.sendMessage({type:'rule', value: rule},{toProxyScript: true})
        return browser.storage.local.get();
    }).then(config => {
        if (!config.type) {
             browser.runtime.sendMessage({
                type: 'proxy',
                message: 'DIRECT'
            }, {toProxyScript: true});
        } else if (config.type === 'DIRECT') {
            browser.runtime.sendMessage({
                type: 'proxy',
                message: config.type
            }, {toProxyScript: true});
        } else {
            browser.runtime.sendMessage({
                type: 'proxy',
              value: `${config.type} ${config.hostname}:${config.port} ${config.user} ${config.password}`
            }, {
                toProxyScript:true
            });
        }
    });

