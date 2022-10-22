import { IncomingMessage, ServerResponse } from "http";
import { useCookie } from 'h3'

export default async (req, res) => {
  const userCookie = useCookie(req, "userCookie");

  // @ts-ignore
  req.user = userCookie;
};