import { defineStore } from 'pinia'

export const useUsersStore = defineStore({
    id: 'users',
    state: () => ({
        users: [],
    }),
    actions: {
        async searchUsersByDisplayName(displayName) {
            const users = await firestoreFetch('users?findBy=displayName&value=' + displayName + '&limit=' + 10, {});

            return users;
        }
    },
});