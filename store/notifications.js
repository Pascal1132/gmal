import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore({
    id: 'notifications',
    state: () => ({
        notifications: [
        ],
    }),
    actions: {
        async addNotification(notification = {html: ''}, timeout = 5000) {
            notification.id = Math.random().toString(36);
            this.notifications.push(notification);
            setTimeout(() => {
                this.removeNotification(notification.id);
            }, timeout);
        },
        async removeNotification(id) {
            this.notifications = this.notifications.filter((n) => n.id !== id);
        }
    }
});