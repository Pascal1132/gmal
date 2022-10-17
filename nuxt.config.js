// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            // Public runtime config
        },
    },
    css: [
        // CSS file in the project
        '@/assets/css/main.css',
        '@fortawesome/fontawesome-svg-core/styles.css'

    ],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/assets/scss/variables.scss";',
                },
            },
        },
    },
    modules: [
        [
            '@pinia/nuxt',
            {
                autoImports: ['defineStore', 'acceptHMRUpdate'],
            },
        ],
    ],
    imports: {
        dirs: ['store'],
    },
    build: {
        transpile: [
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-brands-svg-icons',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/free-regular-svg-icons',
            '@fortawesome/vue-fontawesome',

        ]
    },
    components: {
        global: true,
        dirs: [
            '~/components',
        ],
    },
    server: {
        port: 3000, // default: 3000
        host: '0.0.0.0', // default: localhost,
        timing: false
    },
})
