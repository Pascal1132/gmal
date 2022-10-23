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
    // add a meta description
    head: {
        title: 'G-mal',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'Avez vous mal ? Si oui, vous devez aller sur G-mal.ca. Par contre, si vous n\'avez pas mal, allez y pareil ça me ferait super plaisir :).' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
})
