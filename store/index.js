export const state = () => ({
    windows: [],
})

export const getters = {
    getWindows: (state) => state.windows,
    getMinimizedWindows: (state) => state.windows.filter(window => window.isMinimized),
}

export const mutations = {
    // mutation that add object to active window with the name of the window and the icon
    openWindow: (state, payload) => {
        state.windows.push(payload);
        state.windows.forEach(window => {
            if (window.isFocused && window.id !== payload) {
                window.isFocused = false;
            }
            if (window.id === payload.id) {
                window.isMinimized = false;
                window.isFocused = true;
            }
        })
    },
    closeWindow: (state, payload) => {
        state.windows = state.windows.filter(window => window.id !== payload)
    },
    setWindows: (state, payload) => {
        state.windows = payload
    },
    toggleMinimizeWindow: (state, payload) => {
        state.windows.forEach(window => {
            if (window.id === payload) {
                window.isMinimized = true;
                window.isFocused = false;
            }
        })
    },
    setActiveWindow: (state, payload) => {
        state.windows.forEach(window => {
            if (window.isFocused && window.id !== payload) {
                window.isFocused = false;
            }
            if (window.id === payload) {
                window.isMinimized = false;
                window.isFocused = true;
            }
        })
    }
}

export const actions = {
    async fetchCounter(state) {
        // make request
        const res = { data: 10 };
        state.counter = res.data;
        return res.data;
    }
}