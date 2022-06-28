
export default defineNuxtRouteMiddleware(async ( ctx) => {
    const { store } = ctx;
    console.log('test', ctx);
    console.log('running global middleware', store.state.auth);
    if (store.state.auth.user) {
        //store.dispatch('settings/fetchSettings');
        const res = await $fetch('/api/users/getSettings', {method:'GET', params: { auth: JSON.stringify({id: store.state.auth.user.id, strategy: 'facebook'})} })
        store.commit('settings/setTheme', res.settings.theme);
      }
  })
  