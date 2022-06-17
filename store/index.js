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
    setWindow: (state, payload) => {
        state.windows = state.windows.map(window => {
            if (window.id === payload.id) {
                // keep all properties not overridden by the payload
                return { ...window, ...payload }
            }
            return window
        });
    },
    minimizeWindow: (state, payload) => {
        state.windows.forEach(window => {
            if (window.id == payload) {
                window.isMinimized = true;
                if (window.id == state.activeWindow) {
                    state.activeWindow = null;
                }
            }
        })
    },
    setActiveWindow: (state, payload) => {
        state.windows.forEach(window => {
            if (window.id === payload) {
                window.isMinimized = false;
            }
        });
        state.activeWindow = payload;
    }
}

export const actions = {
}