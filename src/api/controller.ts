import { Request, Response } from 'express'
import { HelixInterface } from '../services/helix'
import { Prisma, PrismaClient } from '@prisma/client'

export interface database extends PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined> { }

type channelData = {
    user_id: string
    user_login: string
    user_name: string
}

export default function createController(database: database, api: HelixInterface) {

    console.log('Initializing Controller')


    async function store(req: Request, res: Response) {
        console.log('Controller.store request')
        const { channel } = req.params


        try {
            const { data }: { data: { data: channelData[] } } = await api.getChannelInfo(undefined, channel)

            console.log(data)
            const filter = data.data.find((data) => {
                if (data.user_login == channel) {
                    return data
                }

            })

            if (filter) {
                const { user_id, user_login, user_name } = filter
                const channel = await database.channel.create({
                    data: {
                        user_id, user_login, user_name
                    }
                })

                res.status(201).json({
                    ...channel
                })
            } else {
                res.status(400).json({
                    msg: 'channel not founded'
                })

            }

        } catch (error) {
            res.status(400).json({
                msg: 'fail'
            })
        }
    }
    async function index(req: Request, res: Response) {
        console.log('Controller.index request')


        const data = await database.channel.findMany({
            orderBy: {
                priority: 'asc'
            }
        })
        res.status(200).json([
            ...data
        ])

    }
    async function get(req: Request, res: Response) {
        console.log('Controller.get request')
        const { channel } = req.params

        const data = await database.channel.findUnique({
            where: {
                user_login: channel
            },
            select: {
                enabled: true,
                priority: true,
                user_login: true,
                user_name: true
            }
        })
        res.status(200).json({
            data
        })

    }
    async function updatePriority(req: Request, res: Response) {
        console.log('Controller.updatePriority request')
        const { channel, priority } = req.params
        const data = await database.channel.update({
            data: {
                priority: Number(priority)
            },
            where: {
                user_login: channel
            },
            select: {
                priority: true
            }
        })

        res.status(201).json({
            data
        })
    }
    async function enable(req: Request, res: Response) {
        console.log('Controller.enable request')
        const { channel } = req.params
        const data = await database.channel.update({
            data: {
                enabled: true
            },
            where: {
                user_login: channel
            },
            select: {
                enabled: true
            }
        })

        res.status(201).json({
            data
        })
    }
    async function disable(req: Request, res: Response) {
        console.log('Controller.disable request')
        const { channel } = req.params
        const data = await database.channel.update({
            data: {
                enabled: false
            },
            where: {
                user_login: channel
            },
            select: {
                enabled: true
            }
        })

        res.status(201).json({
            data
        })

    }

    async function delChannel(req: Request, res: Response) {
        console.log('Controller.delChannel request')
        const { channel } = req.params
        const data = await database.channel.delete({
            where: {
                user_login: channel
            },
        })

        res.status(201).json({
            ...data
        })

    }

    return {
        index,
        get,
        store,
        updatePriority,
        enable,
        disable,
        delChannel
    }
}