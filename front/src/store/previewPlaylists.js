import keys from '@/services/keys';
const checkArray = (name, arr) => arr.some(el => el._id === name)


export default {
    state: {
        audios: []
    },
    mutations: {
        setAudioPreview(state, payload) {
            payload.forEach(el => {
                if(!checkArray(el._id, state.audios)) {
                    state.audios.push(el)
                }
            })
        }
    },
    getters: {},
    actions: {
        async getPreviewPlaylist ({commit}) {
            try {
                const response = await fetch(`${keys.BASE_URL}/api/previews`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const res = await response.json()
                // console.log(res)
                commit('setAudioPreview', res)
            } catch (e) {
                console.log(e)
            }
        }
    }
}