export default {
    state: {
        index: -1,
        playList: [],
        id: '',
        showPlayer: false,
        volume: 1,
        progress: 0,
        progressBarWidth: 0,
        carriageWidth: 0,
        dragCarriage: false,
        moveCarriage: false,
        duration: 0,
        seek: 0
    },
    mutations: {
        setDataToPlayer(state, payload) {
            state.playList = payload
        },
        setIndexPlayer(state, payload) {
            state.index = payload
        },
        removeDataOfPlayer(state) {
            state.index = -1
            state.playList = []
        },
        showPlayer(state, payload) {
            state.showPlayer = payload
        },
        changeID(state, payload){
            state.id = payload
        },
        setVolume(state, payload) {
            state.volume = payload
        },
        setProgress(state, payload) {
            state.progress = payload
        },
        setProgressBarWidth(state, payload) {
            state.progressBarWidth = payload
        },
        setCarriageWidth(state, payload) {
            state.carriageWidth = payload
        },
        setDragCarriage(state, payload) {
            state.dragCarriage = payload
        },
        setMoveCarriage(state, payload) {
            state.dragCarriage = payload
        },
        setDuration(store, payload) {
            store.duration = payload
        },
        setSeek(store, payload) {
            store.seek = payload
        }
    },
    actions: {
        async changeAndStartPlayList({commit, state}, payload) {
            if(payload.id === state.id) {
                commit('setIndexPlayer', payload.index)
                commit('showPlayer', true)
            } else {
                commit('removeDataOfPlayer')
                commit('changeID', payload.id)
                commit('setDataToPlayer', payload.audio)
                commit('setIndexPlayer', payload.index)
                commit('showPlayer', true)
            }
        },
        changeProgressAndSeek({commit, state}, payload) {
            let result = (payload / state.duration) * state.progressBarWidth
            commit('setSeek', payload)
            commit('setProgress', result)
        }
    },
    getters: {}
}