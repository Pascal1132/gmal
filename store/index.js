export const state = () => ({
    windows: [],
    activeWindow: null
})

export const getters = {
    getWindows: (state) => state.windows,
    getMinimizedWindows: (state) => state.windows.filter(window => window.isMinimized),
    activeWindow: (state) => state.activeWindow,
}

export const mutations = {
    // mutation that add object to active window with the name of the window and the icon
    openWindow: (state, payload) => {
        state.windows.push(payload);
        state.activeWindow = payload.id;
    },
    closeWindow: (state, payload) => {
        state.windows = state.windows.filter(window => window.id !== payload)
        // set the active window to the last window
        state.activeWindow = state.windows[0]?.id;
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
            if (window.id === payload) {
                window.isMinimized = false;
            }
        });
        state.activeWindow = payload.id;
    }
}

export const actions = {
    async fetchCounter(state) {
        // make request
        const res = { data: 10 };
        state.counter = res.data;
        return res.data;
    },
}