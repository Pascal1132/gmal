import { defineEventHandler, useQuery } from 'h3';

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const query = useQuery(event)
    console.log('auth', query);
    // Check if a LoginReference with provider = query.auth.strategy exists and with the same query.auth.id = externalId
    const loginReference = await prisma.LoginReference.findFirst({
        where: {
            provider: query.auth.strategy,
            externalId: query.auth.id
        }
    });
    let settings = {};
    if (loginReference) {
        // If yes, get the user by the loginReference and add the settings
        const user = await prisma.User.findUnique({
            where: {
                id: loginReference.userId
            }
        });
        console.log('found settings', user.settings);
        // set settings for user
        settings = JSON.parse(user.settings);
    }
    return {
        status: 'success',
        settings: settings
    };
});