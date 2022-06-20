export const state = () => ({
    currentTheme: {
        name: 'blue',
        bg: 'linear-gradient(to bottom right, #00bcd4, #0064a7)',
        txt: '#fff',
        interface: 'dark',
        highlight: 'lightblue',
        btn: '#fff',
    }
})

export const getters = {
    currentTheme: (state) => state.currentTheme,
    currentThemeInterface: (state) => state.currentTheme.interface
}

export const mutations = {
    setTheme: (state, payload) => {
        console.log(payload)
        state.currentTheme = payload;
    }
}

export const actions = {
}