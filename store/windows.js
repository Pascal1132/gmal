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
    createBaseWindow: ({ commit }, params) => {
        // if params is an array then get the first element for the component
        let windowParams = {};
        let component = params;
        if (Array.isArray(params)) {
            component = params.length > 0 ? params[0] : params;
            windowParams = params.length > 1 ? params[1] : {};
        }
        const id = Math.floor(Math.random() * 100000000)
        commit('openWindow', {
            id: id,
            component: component,
            size: {
                width: 800,
                height: 600,
            },
            pos: {
                x: window.innerWidth / 2 - 400,
                y: window.innerHeight / 2 - 300,
            },
            params: windowParams,
        })
        commit('setActiveWindow', id)
    },
}