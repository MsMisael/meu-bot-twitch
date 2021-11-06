import * as dotenv from 'dotenv'
dotenv.config()


import { PrismaClient } from '.prisma/client'

import createServer from './api'
import createApplication from './services/application'

import initializeHelix from './services/helix'

//Database Service
const database = new PrismaClient()

// Twitch helix Api Service 
const helix = initializeHelix()

// Express http Service
const server = createServer(database, helix)


// On Authenticated helix
helix.onReady(() => {

    // Application Service
    createApplication(database, helix)

})

server.listen(process.env.PORT, () => {
    console.log(`online port:${process.env.PORT}`)
})


