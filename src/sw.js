self.addEventListener('activate', (event) => {
    // Without Clients.claim the service worker is not used until the page is reloaded
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', function (event) {
    let request = event.request;
    if (!request.url.includes('formats')) {
        return;
    }

    if (request.headers.has('Authorization')) {
        return;
    }

    event.respondWith((async function () {
            const token = await getToken();
            const headers = new Headers(request.headers);
            headers.set('Authorization', 'Bearer ' + token);
            // Set the mode otherwise chromium based browsers will not send the Authorization header
            // The default is no-cors and the browser will not allow any custom header
            const newRequestInit = {
                headers: headers,
                mode: 'cors',
                credentials: 'omit',
            };
            const newRequest = new Request(request, newRequestInit);

            try {
                return fetch(newRequest);
            } catch (error) {
                console.error('Error fetching resource: ', error);
                return new Response('Error fetching resource', {status: 500});
            }
        })(),
    );
});

// Worker has no access to the Angular app
// Thus a message system is needed to get the token
function getToken() {
    return new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => {
            resolve(event.data);
        };
        self.clients.matchAll().then((clients) => {
            if (clients && clients.length) {
                clients[0].postMessage('requestToken', [channel.port2]);
            }
        });
    });
}
