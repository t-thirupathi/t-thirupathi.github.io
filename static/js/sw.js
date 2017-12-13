//
const staticCacheName = 'static-9be0112aa25f';
const expectedCaches = [
  staticCacheName
];

self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => cache.addAll(["/shell-start.ac4a434172d6.inc", "/shell-end.ac4a434172d6.inc", "/offline.d989ddb2d13b.inc", "/error.ba6821d4f751.inc", "https://themes.googleusercontent.com/static/fonts/inconsolata/v6/BjAYBlHtW3CJxDcjzrnZCCwlidHJgAgmTjOEEzwu1L8.ttf", "https://themes.googleusercontent.com/static/fonts/ptserif/v5/EgBlzoNBIHxNPCMwXaAhYHYhjbSpvc47ee6xR_80Hnw.ttf", "/static/js/main.6e994df71e3d.js", "/static/css/all.aa2a0cc8a18d.css"]))
  );
});

// remove caches that aren't in expectedCaches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!expectedCaches.includes(key)) return caches.delete(key);
      })
    ))
  );
});

function mergeResponses(responsePromises, headers) {
  const readers = responsePromises.map(p => Promise.resolve(p).then(r => r.body.getReader()));
  let fullStreamedResolve;
  let fullyStreamedReject;
  const fullyStreamed = new Promise((r, rr) => {
    fullStreamedResolve = r;
    fullyStreamedReject = rr;
  });
  
  const readable = new ReadableStream({
    pull(controller) {
      return readers[0].then(r => r.read()).then(result => {
        if (result.done) {
          readers.shift();
          
          if (!readers[0]) {
            controller.close();
            fullStreamedResolve();
            return;
          }
          return this.pull(controller);
        }

        controller.enqueue(result.value);
      }).catch(err => {
        fullyStreamedReject(err);
        throw err;
      });
    },
    cancel() {
      fullStreamedResolve();
    }
  });

  return responsePromises[0].then(response => ({
    fullyStreamed,
    response: new Response(readable, {
      headers: headers || response.headers
    })
  }));
}

{
  const waitUntil = ExtendableEvent.prototype.waitUntil;
  const respondWith = FetchEvent.prototype.respondWith;
  const promisesMap = new WeakMap();

  ExtendableEvent.prototype.waitUntil = function(promise) {
    const extendableEvent = this;
    let promises = promisesMap.get(extendableEvent);

    if (promises) {
      promises.push(Promise.resolve(promise));
      return;
    }

    promises = [Promise.resolve(promise)];
    promisesMap.set(extendableEvent, promises);

    // call original method
    return waitUntil.call(extendableEvent, Promise.resolve().then(function processPromises() {
      const len = promises.length;

      // wait for all to settle
      return Promise.all(promises.map(p => p.catch(()=>{}))).then(() => {
        // have new items been added? If so, wait again
        if (promises.length != len) return processPromises();
        // we're done!
        promisesMap.delete(extendableEvent);
        // reject if one of the promises rejected
        return Promise.all(promises);
      });
    }));
  };

  FetchEvent.prototype.respondWith = function(promise) {
    this.waitUntil(promise);
    return respondWith.call(this, promise);
  };
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.origin === location.origin) {
    // home or article pages
    if (url.pathname === '/' || /^\/20\d\d\/[a-z0-9-]+\/$/.test(url.pathname)) {
      const includeUrl = new URL(url);
      includeUrl.pathname += 'include';

      const parts = [
        caches.match('/shell-start.ac4a434172d6.inc'),
        fetch(includeUrl).then(response => {
          if (!response.ok && response.status != 404) {
            return caches.match('/error.ba6821d4f751.inc');
          }
          return response;
        }).catch(err => caches.match('/offline.d989ddb2d13b.inc')),
        caches.match('/shell-end.ac4a434172d6.inc')
      ];

      event.respondWith(
        mergeResponses(parts, {'Content-Type': 'text/html; charset=utf-8'}).then(({fullyStreamed, response}) => {
          event.waitUntil(fullyStreamed);
          return response;
        })
      );
      return;
    }
  }

  // cache-first for the rest
  event.respondWith(
    caches.match(event.request).then(r => r || fetch(event.request))
  );
});

