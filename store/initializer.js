import { defineStore } from 'pinia'

export const useInitializerStore = defineStore({
    id: 'initializer',
    state: () => ({
        initialized: false,
    }),
    actions: {
        async init(user) {
            const { fetchTheme } = useThemeStore();
            const { connect } = useSocketStore();
            await fetchTheme(true);
            await connect();
            this.initialized = true;
        }
    },
});