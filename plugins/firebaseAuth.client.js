import { initializeApp } from "firebase/app";
import {
  getAuth,
} from "firebase/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const config = runtimeConfig.public.firebase;

  // Initialize Firebase
  const app = initializeApp(config);

  initUser();

  const auth = getAuth();

  nuxtApp.vueApp.provide('auth', auth);
  nuxtApp.provide('auth', auth);

});