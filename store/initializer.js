import { defineStore } from 'pinia'

export const useInitializerStore = defineStore({
    id: 'initializer',
    state: () => ({
        initialized: false,
    }),
    actions: {
        async init() {
            const { fetchTheme } = useThemeStore();
            const { connect } = useSocketStore();
            await fetchTheme();
            await connect();
            this.initialized = true;
        }
    },
});