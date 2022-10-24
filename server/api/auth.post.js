
export default defineEventHandler(async (event) => {

    const { user } = await readBody(event) // only for POST request
    
    // @ts-ignore
    event.context.user = user;

    return { updated: true }
});