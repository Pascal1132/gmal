import { defineStore } from "pinia";

export const useWindowsStore = defineStore({
    id: "windows",
    state: () => ({
        windows: [],
        activeWindowId: null,
    }),
    getters: {
        getWindows: (state) => state.windows,
        getMinimizedWindows: (state) => state.windows.filter((window) => window.isMinimized),
        getActiveWindowId: (state) => state.activeWindowId,
    },
    actions: {
        createBaseWindow(params, props) {
            // if params is an array then get the first element for the component
            let windowParams = {};
            let component = params;
            if (Array.isArray(params)) {
                component = params.length > 0 ? params[0] : params;
                windowParams = params.length > 1 ? params[1] : {};
            }
            if (typeof props === "object") {
                windowParams = { ...windowParams, ...props };
            }
            const id = Math.floor(Math.random() * 100000000);
            const data = {
                id: id,
                isLoaded: false,
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
            };
            this.windows.push(data);
            this.activeWindowId = id;
        },
        openWindow(payload) {
            this.windows.push(payload);
            this.activeWindowId = payload.id;
        },
        /**
         * 
         * @param {Number} id 
         * @param {Boolean} isMinimized 
         */
        setMinimized(id, isMinimized) {
            const window = this.windows.find((window) => window.id === id);
            if (window) {
                window.isMinimized = isMinimized;
            }
            this.activeWindowId = (window.isMinimized) ? null : window.id;
        },
        /**
         * Set active window
         * @param {Number} id
         */
        setActiveWindow(id) {
            this.activeWindowId = id;
        },
        /**
         * Close window
         * @param {Number} id
         */
        closeWindow(id) {
            this.windows = this.windows.filter((window) => window.id !== id);
            // Set active window to the last window
            this.activeWindowId = this.windows.length > 0 ? this.windows[this.windows.length - 1].id : null;
        },
        /**
         * Set window
         */
        setWindow(id, payload) {
            const window = this.windows.find((window) => window.id === id);
            if (window) {
                Object.assign(window, payload);
            }
        }
        
    },
});
