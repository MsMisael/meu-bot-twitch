import { Client } from 'tmi.js'
import { database } from '../../api/controller'


export default function initializeChat(database: database, start: (timeOutOnly?:boolean) => void, stop: () => void) {
    console.log('Chat inicialization')
    const onConnectListeners: ((chat: Client) => void)[] = []
    let hostQueue = ''
    let isHosting = false
    let hostedChannel: string | null
    let hostEventId: string | undefined
    const chat = new Client({
        options: {
            clientId: process.env.HELIX_CLIENT_ID,
            debug: false
        },
        identity: {
            username: process.env.CHAT_OAUTH_USER,
            password: process.env.CHAT_OAUTH_TOKEN
        },
        channels: [process.env.CHAT_CHANNEL || '']
    })

    // chat.on('message', (channel, userStage, message, self) => {
    //     if (self) console.log(message)
    // })

    function host(channel: string) {
        console.log(`Chat host call ${channel}`)
        if (channel) {
            hostQueue = channel
            if (!isHosting) {
                stop()
                chat.host(process.env.CHAT_CHANNEL || '', hostQueue).then((data) => {
                    isHosting = true
                    hostedChannel = data[0]

                }).catch((err) => {
                    start()
                    console.log('error on give host', err)
                })

            } else {
                console.log('Channel arealy hosting', hostedChannel)
            }
        }
    }

    chat.on('unhost', (channel, views) => {
        start(true)
        isHosting = false
        hostedChannel = null
        console.log('unhost', channel, views)
    })

    chat.on('hosting', (channel, target, views) => {
        stop()
        isHosting = true
        hostedChannel = target
        console.log('hosting', channel, 'to', target, views)
    })


    chat.on('connected', () => {
        start()
        for (const onConnectListener of onConnectListeners) {
            onConnectListener(chat)
        }
    })

    function onConnect(callback: (chat: Client) => {}) {
        onConnectListeners.push(callback)
    }

    chat.connect()
    return {
        host,
        onConnect
    }
}