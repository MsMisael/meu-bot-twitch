import { Client } from 'tmi.js'


export default function initializeChat() {
    let hostQueue = ''
    let isHosting = false
    let hostedChannel: string | null

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
        if (channel) {
            hostQueue = channel
            if (!isHosting) {
                // chat.host(process.env.CHAT_CHANNEL || '', hostQueue).then((data) => {
                //     hostedChannel = data[0]
                // }).catch((err) => {
                //     console.log(err)
                // })
                chat.say(process.env.CHAT_CHANNEL || '', `hosting ${hostQueue}`).then((data) => {
                    hostedChannel = data[0]
                    hostQueue = ''
                    isHosting = true
                    // setTimeout(()=>{
                    //     isHosting = false
                    // },5000)
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    }

    chat.on('unhost', (channel, views) => {
        isHosting = false
        hostedChannel = null
        console.log('unhost', channel, views)

    })

    chat.on('hosting', (channel, target, views) => {
        isHosting = true
        hostedChannel = channel
        console.log('hosting', channel, target, views)
    })



    chat.connect()
    return {
        host
    }
}