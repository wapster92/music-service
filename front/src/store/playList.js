import keys from '@/services/keys';



export default {
    state: {
        audio: {}
    },
    mutations: {
        setAudio(state, payload) {
            state.audio = payload
        },
        setMyAudio(state, payload) {
            state.audio = payload
        }
    },
    getters: {},
    actions: {
        async getPlayList ({commit}, params) {
            try {
                const response = await fetch(`${keys.BASE_URL}/api/play-list/${params.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const result = await response.json()
                commit('setAudio', result)
            } catch (e) {
                console.log(e)
            }
        }
    }
}