let form = document.getElementById('form');
let hostInput = document.getElementById('host');
let portInput = document.getElementById('port');
let usernameInput = document.getElementById('username');
let passwordInput = document.getElementById('password');
let typeInput = document.getElementById('type');
browser.storage.local.get().then(config=>{
	if (config) {
		hostInput.value = config.host || '';
		portInput.value = config.port || '';
		usernameInput.value = config.username || '';
		passwordInput.value = config.password || '';
		for (let i = 0, opt; opt = typeInput.options[i]; i++) {
			if (opt.value === config.type) {
				typeInput.selectedIndex = i;
			}
		}
	}
})
document.getElementById('form').onsubmit = function(e) {
	e.preventDefault();
	let type = typeInput.value;
	let host = hostInput.value;
	let port = portInput.value;
	let username = usernameInput.value;
	let password = passwordInput.value;
	let config = { type, host, port, username, password }
	browser.storage.local.set(config)
	if (config.type === 'DIRECT') {
		browser.runtime.sendMessage({
			type: 'proxy',
			message: config.type
		}, {toProxyScript: true});
	} else {
	    let value = `${config.type} ${config.host}:${config.port} ${config.username} ${config.password}`;
		console.log(value);
		browser.runtime.sendMessage({
			type: 'proxy',
			value
		}, {
			toProxyScript:true
		});
	}
}
