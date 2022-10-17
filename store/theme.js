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
        setTheme: async ({ commit, rootState }, payload) => {
            commit('setTheme', payload)
            console.log(
                'return',
                await $fetch('/api/users/setSettings', {
                    method: 'POST',
                    body: {
                        theme: payload,
                        auth: { ...rootState.auth.user, strategy: 'facebook' },
                    },
                })
            )
        }
    },
    mutations: {
        setTheme: (state, payload) => {
            console.log(payload, state.currentTheme)
            state.currentTheme = { ...state.currentTheme, ...payload }
            console.log(state.currentTheme)
        }
    },
})
