// Your Service Worker. You can use its instance with the keyword `self`
// Example: self.addEventListener(...)

const appShellCacheName = 'app-shell-v1';
const appShellFilesToCache = [
    '/assets/css/desktop.css',
    '/assets/css/fonts.css',
    '/assets/css/mobile.css',
    '/assets/css/normalize.css',
    '/assets/css/shell.css',
    '/dist/player.css',
    '/player.html',

    '/assets/fonts/balsamiq-sans-v1-latin-700.woff',
    '/assets/fonts/balsamiq-sans-v1-latin-700.woff2',
    '/assets/fonts/balsamiq-sans-v1-latin-700italic.woff',
    '/assets/fonts/balsamiq-sans-v1-latin-700italic.woff2',
    '/assets/fonts/balsamiq-sans-v1-latin-italic.woff',
    '/assets/fonts/balsamiq-sans-v1-latin-italic.woff2',
    '/assets/fonts/balsamiq-sans-v1-latin-regular.woff',
    '/assets/fonts/balsamiq-sans-v1-latin-regular.woff2',
    '/assets/js/dexie.min.js',
    '/assets/js/fontawesome-pro-5.13.0.min.js',
    '/assets/js/lazysizes.min.js',
    '/assets/js/saved.js',
    '/assets/js/search.js',
    '/assets/js/trending.js',
    '/dist/amplitude.js',

    '/search',
    '/saved',
    '/',
];

const appCaches = [
    appShellCacheName,
];

self.addEventListener('install', event => {
    console.log('[SW] Install event');

    event.waitUntil(
        caches.open(appShellCacheName)
            .then(cache => {
                console.log('[SW] Caching the App Shell');
                return cache.addAll(appShellFilesToCache);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.map(key => {
                    if (!appCaches.includes(key)) {
                        return caches.delete(key);
                    }
                })
            ))
            .then(() => {
                console.log('[SW] Cleaned old caches');
            })
    );
});

this.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(e => {
                console.error(e);
            })
    );
});
