import { HelixInterface } from '../helix'
import { database } from '../../api/controller'
import { Prisma } from '.prisma/client'
import initializeChat from '../chat'

export default function createApplication(database: database, api: HelixInterface) {
    console.log('Application inicialization')
    let channels: string[] = []
    const chat = initializeChat()

    async function verifyChannels() {
        console.log('Querying Channels in DB')

        const adata = await database.channel.findMany({
            where: {
                enabled: true
            },
            orderBy: {
                priority: Prisma.SortOrder.asc
            }
        })
        channels = [...adata.map((channel) => channel.user_login)]

        const { data }: { data: { data: { user_login: string }[] } } = await api.getChannelInfo(undefined, channels)

        if (data.data.length <= 0) return

        const index = Math.min(
            ...data.data.map(
                (channel: { user_login: string }) => channels.indexOf(channel.user_login)
            ))

        if (index >= 0) {
            chat.host(channels[index])
        }
    }


    verifyChannels()
    setInterval(verifyChannels, Number(process.env.APPLICATION_SERVER_TICKRATE || 5) * 60 * 1000)

    return {
    }
}