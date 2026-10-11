// Thin wrapper around the browser Notification API
export const notificationsSupported = () =>
  typeof window !== 'undefined' && 'Notification' in window;

export const getPermission = () =>
  notificationsSupported() ? Notification.permission : 'unsupported';

export const requestPermission = async () => {
  if (!notificationsSupported()) return 'unsupported';
  return Notification.requestPermission();
};

// Returns true if the notification was shown
export const notify = (title, body) => {
  if (getPermission() !== 'granted') return false;
  new Notification(title, { body, icon: '/vite.svg' });
  return true;
};