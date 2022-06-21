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
}