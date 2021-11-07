import { response, Router } from 'express'
import createController, { database } from './controller'
import { HelixInterface } from '../services/helix'


export default function createRouter(database: database, api: HelixInterface) {
    console.log('Initializing app router')

    const router = Router()


    const controller = createController(database, api)

    router.get('/', (req, res) => {
        res.status(201).json({})
    })
    
    router.get('/channel', controller.index)
    router.post('/channel/:channel', controller.store)
    router.get('/channel/:channel', controller.get)

    router.get('/channel/:channel/enable', controller.enable)
    router.get('/channel/:channel/disable', controller.disable)
    router.get('/channel/:channel/priority/:priority', controller.updatePriority)

    router.delete('/channel/:channel', controller.delChannel)

    return router
}

