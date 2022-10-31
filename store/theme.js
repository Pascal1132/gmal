import { defineStore } from 'pinia'
import themes from '~/assets/config/themes.js'

export const useThemeStore = defineStore({
    id: 'theme',
    state: () => ({
        currentTheme: themes[0],
    }),
    getters: {
        getCurrentTheme: (state) => state.currentTheme,
        getCurrentThemeInterface: (state) => state.currentTheme.interface,
    },
    actions: {
        // set theme with update to api
        async setTheme(payload) {
            const tmp = { ...this.currentTheme, ...payload };
            const result = await firestoreUpdate('theme', tmp);
            this.currentTheme = tmp;
            return result;
        },
        async fetchTheme() {
            let result;
            try {
                result = await firestoreFetch('theme', false);
                if (result) {
                    this.currentTheme = { ...this.currentTheme, ...(result) };
                }
            } catch (err) {
                console.warn('Cannot fetch theme', err);
            }
            return result;
        }
    },
})
