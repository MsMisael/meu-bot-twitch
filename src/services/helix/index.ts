import axios from "axios";

export interface HelixInterface {
    onReady: (callback: () => void) => Promise<void>
    authenticate: () => Promise<void>
    searchLiveChannels: (query: string, liveOnly?: boolean) => Promise<any>
    getChannelInfo: (user_id?: string | string[] | undefined, user_login?: string | string[] | undefined) => Promise<any>;
}

export default function initializeHelix(): HelixInterface {
    const callbacks: Function[] = []

    async function onReady(callback: () => void) {
        callbacks.push(callback)
    }

    async function renew() {

        console.count('Helix renew')
        const { data } = await axios.post('https://id.twitch.tv/oauth2/token', {
            client_id: process.env.HELIX_CLIENT_ID,
            client_secret: process.env.HELIX_CLIENT_SECRET,
            grant_type: 'client_credentials'
        })
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`

    }

    async function authenticate() {
        console.count('Helix authenticate')
        const { data } = await axios.post('https://id.twitch.tv/oauth2/token', {
            client_id: process.env.HELIX_CLIENT_ID,
            client_secret: process.env.HELIX_CLIENT_SECRET,
            grant_type: 'client_credentials'
        })
        console.count('Helix Requesting')
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
        setInterval(renew, 59 * 60 * 1000)
        notifyAll()
    }

    function notifyAll() {
        for (const callback of callbacks) {
            callback()
        }
    }

    const api = axios.create({
        baseURL: 'https://api.twitch.tv/helix',
        headers: {
            'client-id': process.env.HELIX_CLIENT_ID || ''
        },

    })

    async function searchLiveChannels(query: string, liveOnly = false) {
        console.count('Helix searchLiveChannels')
        return api.get('/search/channels', {
            params: {
                query, 'live_only': liveOnly
            }
        })
    }

    async function getChannelInfo(user_id?: string | string[], user_login?: string | string[]) {
        console.count('Helix getChannelInfo')
        return api.get('/streams', {
            params: {
                user_id,
                user_login
            }
        })
    }

    return {
        onReady,
        authenticate,
        searchLiveChannels,
        getChannelInfo
    }
}



