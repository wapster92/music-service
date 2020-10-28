import keys from '@/services/keys';
import router from '@/router';

export default {
    state: {
        id: '',
        auth: false,
        login: '',
        avatar: '',
        playLists: []
    },
    mutations: {
        authentication(state, payload) {
            state.id = payload.id
            state.auth = payload.auth
            state.login = payload.login
            state.avatar = payload.avatar
        },
        addPlayLists(state, payload) {
            state.playLists = payload
        },
        exit(state, payload) {
            if (!payload.auth) {
                state.id = ''
                state.auth = false
                state.login = ''
                state.avatar = ''
                state.playLists = []
            }
        },
        changeAvatar(state, payload) {
            state.avatar = payload
        }
    },
    getters: {},
    actions: {
        async auth({commit}, payload) {
            try {
                const res = await fetch(`${keys.BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        login: payload.login,
                        password: payload.password
                    })
                })
                const result = await res.json()
                if(result.auth) {
                    commit('authentication', {
                        id: result.id,
                        auth: result.auth,
                        login: result.login,
                        avatar: result.avatar
                    })
                    router.push('/')
                }
            } catch (e) {
                console.log(e)
            }
        },
        async register({commit}, payload) {
            try {
                const res = await fetch(`${keys.BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: payload.email,
                        login: payload.login,
                        password: payload.password
                    })
                })
                const result = await res.json()
                commit('authentication', result)
                router.push('/')
            } catch (e) {

            }
        },
        async getPlayLists ({commit, state}) {
            if(state.auth) {
                try {
                    const response = await fetch(`${keys.BASE_URL}/api/my-play-list/${state.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    const res = await response.json()
                    commit('addPlayLists', res.playList)
                } catch (e) {

                }
            }
        },
        async addPlayList({commit, state}, payload) {
            try {
                const response = await fetch(`${keys.BASE_URL}/api/add-play-list`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: state.id,
                        namePlayList: payload.namePlayList
                    })
                })
                const result = await response.json()
                commit('addPlayLists', result.playLists)
                commit('closeModalInput')
            } catch (e) {

            }
        },
        async addToPlayList({commit, state}, payload) {
            try {
                const response = await fetch(`${keys.BASE_URL}/api/add-file-to-play-list`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: state.id,
                        namePlayList: payload.namePlayList,
                        audioId: payload.audioId,
                        nameAudio: payload.nameAudio
                    })
                })
                const result = await response.json()
            } catch (e) {

            }
        },
        async deleteFromPlayList({commit, state}, payload) {
            const response = await fetch(`${keys.BASE_URL}/api/delete-from-play-list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: state.id,
                    namePlayList: payload.namePlayList,
                    index: payload.index
                })
            })
            const result = await response.json()
        }
    }
}