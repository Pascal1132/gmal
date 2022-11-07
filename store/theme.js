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
        async fetchTheme(waitForBackground = false) {
            let result;
            try {
                result = await firestoreFetch('theme', false);
                if (result) {
                    this.currentTheme = { ...this.currentTheme, ...(result) };
                    if (waitForBackground) {
                        await this.fetchBackground();
                    }
                }
            } catch (err) {
                console.warn('Cannot fetch theme', err);
            }
            return result;
        },
        async fetchBackground() {
            const styleBgAttribute = this.currentTheme.bg;
            if (styleBgAttribute) {
                try {
                    const url = styleBgAttribute.split('url(')[1].split(')')[0];
                    // fetch the image from the url
                    const image = new Image();
                    image.src = url;
                    // wait for the image to load
                    await new Promise((resolve, reject) => {
                        image.onload = resolve;
                        image.onerror = reject;
                    });
                } catch (err) {
                }
            }
        }
    },
})
