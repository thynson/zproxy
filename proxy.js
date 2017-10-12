let blacklist = null;
let whitelist = null;
let proxy = null;
function buildRule(rules) {
    "use strict";
    let blacklist = [];
    let whitelist = [];
    let escapeRegexp = function(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    };

    function addRule(rule, list) {
        var match;
        if (match = rule.match(/^\|\|(.+)$/)) {
            // Domain matching
            list.push(`^https?:\/\/${match[1]}`);
        } else if (match = rule.match(/^\|(.+)$/)) {
            // Forward matching
            list.push('^'+escapeRegexp(match[1]));
        } else if (match = rule.match(/(.+)\|$/)) {
            // Backward matching, since browser don't tell us the path of url
            // per PAC spec, ignore it at the first time
            // list.push(new RegExp(escapeRegexp(match[1]) + '$'));
        } else if (match = rule.match(/^\/(.+)\/$/)) {
            // RegExp, convert named group to unnamed group
            list.push(match[1].replace(/(?!\\)\(/g, '(?:'));
        } else {
            // URL keyword, match domain and path of an HTTP url, only match
            // domain of an HTTPS URL
            list.push(`http:\/\/.*${escapeRegexp(rule)}`)
            list.push(`https:\/\/[^/]*${escapeRegexp(rule)}[^/]*/`)
        }
    }

    rules.split('\n')
        .forEach((rule)=> {
            var match;
            // console.log('!');
            if (/(?:^\w*$)|^!(?:.*)$|(^\[.+])/.test(rule)) return;
            if (match = rule.match(/^@@(.+)$/)) {
                // console.log('whitelist:', match[1])
                addRule(match[1], whitelist);
            } else {
                addRule(rule, blacklist);
            }
        });


    // Join all rule and build Regexp
    blacklist = new RegExp(blacklist.map((r)=>`(?:${r})`).join('|'));
    whitelist = new RegExp(whitelist.map((r)=>`(?:${r})`).join('|'));

    return {
        blacklist,
        whitelist
    }
}

browser.runtime.onMessage.addListener(message=> {
    "use strict";
    if (message.type === 'rule') {
        let x = buildRule(message.value);
        blacklist = x.blacklist;
        whitelist = x.whitelist;
    } else if (message.type === 'proxy') {
        proxy = message.value;

    }
});

function FindProxyForURL(url, host) {

    if (whitelist != null) {
        if (whitelist.test(url))
            return "DIRECT";
    }
    if (blacklist != null) {
        if (blacklist.test(url))
            return proxy || "DIRECT";// "SOCKS localhost:10080"; // Hard coded
    }

    return "DIRECT";

}
