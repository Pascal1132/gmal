/*import { IncomingMessage, ServerResponse } from "http";

export default async (req, res) => {
    
  // @ts-ignore
  const user = req.user;

  return user ? user : "User is signed out"
};
*/

export default defineEventHandler((event) => {
  const user = event.context.user;

  return user ? user : "User is signed out"
});