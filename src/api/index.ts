import express from 'express'
import cors from 'cors'
import path from 'path'

import createRouter from './router'
import { database } from './controller'
import { HelixInterface } from '../services/helix'



export default function createServer(database: database, api: HelixInterface) {
    console.log('Initiaizating server')

    const server = express()
    const router = createRouter(database, api)
    //server.use(cors())

    api.authenticate()
    //auth middleware
    server.use('/api', (req, res, next) => {

        if (req.headers.client_id === process.env.HELIX_CLIENT_ID) {
            next()
        } else {
            res.status(401).json({
                error: 'not authorized'
            })
        }
    })

    server.use('/api', router)
    server.use(express.static('./src/public'))
    server.get('*', (req, res) => {
        res.sendFile(path.resolve('src', 'public', 'index.html'))
    })

    return server
}

