importScripts('https://js.pusher.com/beams/service-worker.js');

// Handle notification click events
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const data = event.notification.data;
  let url = '/';

  // Navigate based on notification type
  if (data && data.type === 'rfq_published' && data.rfq_id) {
    url = `/rfqs/${data.rfq_id}`;
  }

  // If there's a deep_link from the push payload, use that
  if (data && data.deep_link) {
    url = data.deep_link;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus existing tab if found
      for (const client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
