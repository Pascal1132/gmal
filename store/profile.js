import { defineStore } from 'pinia'

export const useProfileStore = defineStore({
    id: 'profile',
    state: () => ({
        profile: null,
    }),
    getters: {
        getProfile() {
            return this.profile;
        }
    },
    actions: {
        // set theme with update to api
        setProfile: async ({ commit, rootState }, payload) => {
            commit('setProfile', payload)
            console.log(
                'return',
                firestoreUpdate('profile', {
                    ...payload,
                    uid: rootState.auth.user.uid,
                })
            )
        },
    },
    mutations: {
        setProfile: (state, payload) => {
            state.profile = payload
        }
    },
});