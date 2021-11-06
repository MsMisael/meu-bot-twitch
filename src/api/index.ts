import express from 'express'
import createRouter from './router'
import { database } from './controller'
import { HelixInterface } from '../services/helix'



export default function createServer(database: database, api: HelixInterface) {
    console.log('Initiaizating server')

    const server = express()
    const router = createRouter(database, api)
    api.authenticate()
    //auth middleware
    server.use((req, res, next) => {

        if (req.headers.client_id === process.env.HELIX_CLIENT_ID) {
            next()
        } else {
            res.status(401).json({
                error: 'not authorized'
            })
        }
    })

    server.use(router)

    return server
}
