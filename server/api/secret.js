/*import { IncomingMessage, ServerResponse } from 'http'

export default async (req, res) => {
  
  // @ts-ignore
  const user = req.user;

  if(user) {
    res.statusCode = 200
    res.end('This is a top secret message from the API')
  }
  res.statusCode = 400
  res.end('Must be signed in to read secret message')
}*/

export default defineEventHandler((event) => {
  const user = event.context.user;

  if(user) {
    return 'This is a top secret message from the API'
  }
  return 'Must be signed in to read secret message'
});