import { defineEventHandler, useBody } from 'h3';

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await useBody(event)
  // Check if a LoginReference with provider = body.auth.strategy exists and with the same body.auth.id = externalId
  const loginReference = await prisma.LoginReference.findFirst({
    where: {
      provider: body.auth.strategy,
      externalId: body.auth.id
    }
  })
  if (loginReference) {
    // If yes, get the user by the loginReference and add the settings
    const user = await prisma.User.findUnique({
      where: {
        id: loginReference.userId
      }
    })
    console.log('found user', user)
    // set settings for user
    await prisma.User.update({
      where: {
        id: user.id
      },
      data: {
        settings: JSON.stringify({
          ...JSON.parse(user.settings),
          ...{
            theme: body.theme
          }
        })
      }
    })
  } else {
    // If no, create a new user
    const user = await prisma.User.create({
      data: {
        name: body.auth.name,
        //picture: body.auth.picture.data.url,
        loginRefs: {
          create: {
            provider: body.auth.strategy,
            externalId: body.auth.id
          }
        },
        settings: JSON.stringify({
          theme: body.theme
        }),
      }
    })
    console.log('user', user)
  }
  return {
    status: 'success',
  };
});