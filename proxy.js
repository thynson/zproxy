let blacklist = null;
let whitelist = null;
function buildRule(rules) {
    "use strict";
    let blacklist = [];
    let whitelist = [];
    let escapeRegexp = function(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    };

    let regexpcount = 0;
    function addRule(rule, list) {
        var match;
        if (match = rule.match(/^\|\|(.+)$/)) {
            // console.log('domain:', match[1])
            list.push(new RegExp(`^https?:\/\/${match[1]}`));
        } else if (match = rule.match(/^\|(.+)$/)) {
            // console.log('|match:', match[1])
            list.push(new RegExp('^'+escapeRegexp(match[1])));
        } else if (match = rule.match(/(.+)\|$/)) {
            // console.log('match|:', match[1])
            // list.push(new RegExp(escapeRegexp(match[1]) + '$'));
        } else if (match = rule.match(/^\/(.+)\/$/)) {
            // console.log('regex:', match[1])
            list.push(new RegExp(match[1]));
        } else {
            // console.log(rule)
            list.push(new RegExp(`${escapeRegexp(rule)}`))
            regexpcount++;
        }
        // console.log(list[list.length-1].toString());
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


    // blacklist.forEach(console.log);
    // whitelist.forEach(console.log);


    blacklist = new RegExp(blacklist.map((r)=>`(?:${r.toString().slice(1,-1)})`).join('|'));
    whitelist = new RegExp(whitelist.map((r)=>`(?:${r.toString().slice(1,-1)})`).join('|'));

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
    }
});

function FindProxyForURL(url, host) {

    if (whitelist != null) {
        if (whitelist.test(url))
            return "DIRECT";
    }
    if (blacklist != null) {
        if (blacklist.test(url))
            return "SOCKS localhost:10080"; // Hard coded
    }

    return "DIRECT";

}