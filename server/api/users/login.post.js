import { defineEventHandler, useBody } from 'h3';

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await useBody(event)
  console.log('login.post.js', body);
  /*await prisma.user.create({
    data: {
      name: body.name,
    },
  })
  return {body};*/
});