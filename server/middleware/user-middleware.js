/*import { IncomingMessage, ServerResponse } from "http";
import { useCookie } from 'h3'

export default async (req, res) => {
  const userCookie = useCookie(req, "userCookie");
  // @ts-ignore
  req.user = userCookie;
};*/

export default defineEventHandler((event) => {
  const userCookie = useCookie(event, "userCookie");
  // @ts-ignore
  event.context.user = userCookie ? JSON.parse(userCookie) : null;
});
