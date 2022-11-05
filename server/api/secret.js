
export default defineEventHandler((event) => {
  const user = event.context.user;

  if(user) {
    return 'This is a top secret message from the API'
  }
  return 'Must be signed in to read secret message'
});