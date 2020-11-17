import { SkynetClient, genKeyPairFromSeed } from 'skynet-js';

const client = new SkynetClient()

// detect if app is opened on localhost for development
if (window.location.hostname == 'idtest.local' || window.location.hostname == 'localhost' || window.location.protocol == 'file:') {
	var devMode = true
} else {
	var devMode = false
}

var opts = { 'devMode': devMode  }
var skyid = new SkyID('SkyLogger', skyidEventCallback, opts)

function skyidEventCallback(message) {
	switch (message) {
		case 'login_fail':
			console.log('Login failed');
			break;
		case 'login_success':
			console.log('Login succeed!');
            loadPosts();
			break;
		case 'destroy':
			console.log('Logout succeed!');
			break;
		default:
			console.log(message)
			break;
	}
}

// check for current blog params
let params = new URL(location).searchParams;
const currentBlog = params.get("b");
if (!!currentBlog)
{
    console.log("Loading blog for: " + currentBlog);
    loadBlog(currentBlog);
}

function loadBlog(publicKey) {
    getJSON(publicKey, "blogName");
}

async function getJSON(publicKey, dataKey) {
    try {
        const { data, revision } = await client.db.getJSON(publicKey, dataKey);
        console.log(data, revision);
    } catch (error) {
        console.log(error);
    }
}

document.getElementById("SkyIDLogin").addEventListener("click", function() {
    skyid.sessionStart();
});

document.getElementById("SkyIDLogout").addEventListener("click", function() {
    skyid.sessionDestroy();
});
