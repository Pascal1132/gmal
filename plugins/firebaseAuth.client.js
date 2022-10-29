import { initializeApp } from "firebase/app";
import {
  getAuth,
} from "firebase/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const config = runtimeConfig.public.firebase;
  // Initialize Firebase
  const app = initializeApp(config);

  await initUser();

  const auth = getAuth();

  nuxtApp.vueApp.provide('auth', auth);
  nuxtApp.provide('auth', auth);
});