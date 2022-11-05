import { defineStore } from 'pinia'

export const useProfileStore = defineStore({
    id: 'profile',
    state: () => ({
        profile: null,
    }),
    getters: {
        getProfile() {
            return this.profile;
        }
    },
    actions: {
        async fetchProfile() {
            const profile = await firestoreFetch('profile');
            this.profile = profile;
            return profile;
        },
        async updateProfile(payload) {
            const profile = await firestoreUpdate('profile', payload);
            this.profile = profile;
            return profile;
        }
    },
});