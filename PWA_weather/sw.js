const CACHE_NAME = "V1"

/**
 * Agar dapat berjalan secara offline
 */
this.addEventListener('install', async function() {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
        '/index.html',
        '/style.css',
        '/utama.js',
    ])
})

/**
 
 * Caching
 */
self.addEventListener('fetch', event => {
    const getCustomResponsePromise = async => {
        console.log(`URL ${event.request.url}`, `location origin ${location}`)

        try {
            //Memperoleh hasil cache
            const cachedResponse = await caches.match(event.request)
            if (cachedResponse) {
                //mengembalikan hasil cache yang ditemukan
                console.log(`Cached response ${cachedResponse}`)
                return cachedResponse
            }

            //Menghubungi jaringan apabila tidak ada cache 
            const netResponse = await fetch(event.request)
            console.log(`adding net response to cache`)
            let cache = await caches.open(CACHE_NAME)
            cache.put(event.request, netResponse.clone())

            //mengembalikan hasil jaringan
            return netResponse
        } catch (err) {
            console.error(`Error ${err}`)
            throw err
        }
    }

    event.respondWith(getCustomResponsePromise())
})