import { defineStore } from 'pinia'

export const useInitializerStore = defineStore({
    id: 'initializer',
    state: () => ({
        initialized: false,
    }),
    actions: {
        async init() {
            const { fetchTheme } = useThemeStore();
            await fetchTheme();
            this.initialized = true;
        }
    },
});