import { $fetch } from 'ohmyfetch'
import themes from '~/assets/config/themes.js'
export const state = () => ({
    currentTheme: themes[0],
})

export const getters = {
    currentTheme: (state) => state.currentTheme,
    currentThemeInterface: (state) => state.currentTheme.interface
}

export const mutations = {
    setTheme: (state, payload) => {
        console.log(payload, state.currentTheme)
        state.currentTheme = {...state.currentTheme, ...payload};
        console.log(state.currentTheme)
    }
}

export const actions = {
    // set theme with update to api
    setTheme: async ({commit, rootState}, payload) => {
        commit('setTheme', payload)
        console.log('return', await $fetch('/api/users/setSettings', { method: 'POST', body: { theme: payload, auth:  {...rootState.auth.user, strategy: 'facebook'}} }));
    },
    fetchSettings: async ({commit, rootState}) => {
        console.log('fetching settings', rootState.auth.user)
        const res = await $fetch('http://localhost:3000/api/users/getSettings', {params: { auth: {...rootState.auth.user, strategy: 'facebook'}} })
        console.log('settings', res.settings)
        commit('setTheme', res.settings.theme);
    }
}