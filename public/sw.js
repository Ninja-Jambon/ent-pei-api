self.addEventListener("push", (e) => {
  const data = e.data.json();
  self.registration.showNotification(data.title, data);
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow("https://leizour.fr/homeworks/"));
});