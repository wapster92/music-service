import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from '@/store/user';
import previewPlaylists from '@/store/previewPlaylists';
import playList from '@/store/playList';
import player from '@/store/player';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    modal: false,
    indexEl: null,
    audioId: '',
    modalInput: false,
    windowWidth: 0
  },
  mutations: {
    modalToggleMut(store) {
      store.modal = !store.modal
    },
    openModalMut(store) {
      store.modal = true
    },
    closeModalMut(store) {
      store.modal = false
    },
    addToModal(state, payload) {
      state.indexEl = payload.index
      state.audioId = payload.id
      state.name = payload.name
    },
    openModalInput(store) {
      store.modalInput = true
    },
    closeModalInput(store) {
      store.modalInput = false
    },
    changeWindowWidth(store, payload) {
      store.windowWidth = payload
    }
  },
  actions: {
    toggleModal({commit}) {
      commit('modalToggleMut')
    },
    openModal({commit}) {
      commit('openModalMut')
    },
    closeModal({commit}) {
      commit('closeModalMut')
    }
  },
  modules: {
    user,
    previewPlaylists,
    playList,
    player
  },
  plugins: [createPersistedState()]
})
