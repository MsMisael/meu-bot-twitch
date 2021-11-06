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
        channels: ['misasouzabot']
    })

    // chat.on('message', (channel, userStage, message, self) => {
    //     if (self) console.log(message)
    // })

    function host(channel: string) {
        hostQueue = channel
        if (!isHosting) {
            // chat.host('misasouzabot', hostQueue).then((data) => {
            //     hostedChannel = data[0]
            // }).catch((err) => {
            //     console.log(err)
            // })
            chat.say('misasouzabot', `hosting ${hostQueue}`).then((data) => {
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