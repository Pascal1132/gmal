
export default defineEventHandler((event) => {
  const userCookie = useCookie(event, "userCookie");
  // @ts-ignore
  event.context.user = userCookie ? JSON.parse(userCookie) : null;
});
