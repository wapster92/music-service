<template>
  <div id="app" :class="{'overlay': modal}" @keydown.esc="closeModal">
    <header class="header">
      <div class="header__btn-wrap">
        <div class="menu-btn" @click="toggleMenu">
          <div class="menu-btn__icon">
            <ListSVG></ListSVG>
          </div>
          <span class="menu-btn__text">Menu</span>
        </div></div>
      <div class="header__main">
        <nav class="login">
          <ul class="login__list" v-if="!user.auth">
            <li class="login__item">
              <router-link to="/login" class="login__link">Login</router-link>
            </li>
            <li class="login__item">
              <router-link to="/register">Register</router-link>
            </li>
          </ul>
          <router-link :to="{name: 'user', params: {id: user.id}}" class="login__auth" v-else>
            <img :src="avatar" alt="" class="login__avatar">
            <span class="login__name">{{user.login}}</span>
          </router-link>
        </nav>
      </div>
    </header>
    <main class="main" :class="{'main--active': menuActive}">
      <aside class="side-bar" @mouseleave="toggleMenu">
        <div class="menu">
          <nav class="menu-nav">
            <ul class="menu-nav__list">
              <li class="menu-nav__item">

                <router-link to="/" class="menu-nav__link">
                  <HomeSVG></HomeSVG>
                  Home</router-link>
              </li>

            </ul>
          </nav>
          <nav class="menu-nav" v-if="user.playLists.length">
            <h3 class="menu-nav__title">Music Playlists</h3>
            <ul class="menu-nav__list">
              <li class="menu-nav__item" v-for="playList of user.playLists">
                <router-link :to="`/my-play-list/${playList.name}`" class="menu-nav__link">
                  <PlayListSVG></PlayListSVG>
                  {{playList.name}}</router-link>
              </li>
            </ul>
          </nav>
          <nav class="menu-nav menu-nav--last">
            <ul class="menu-nav__list">
              <li class="menu-nav__item">
                <a href="#" class="menu-nav__link">
                  Settings</a>
              </li>
              <li class="menu-nav__item">
                <a href="#" class="menu-nav__link">
                  Help</a>
              </li>
              <li class="menu-nav__item" v-if="user.auth">
                <a href="#" class="menu-nav__link" @click.prevent="exit">
                  Выход</a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <div class="components-view">
        <router-view></router-view>
      </div>
    </main>
    <Modal v-if="modal"></Modal>
    <Player></Player>
  </div>
</template>

<style lang="scss">
  #app {
    min-height: 100vh;
    width: 100%;
    background: var(--main-bg-color);
    position: relative;
  }
  .overlay {
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .4);
      z-index: 100;
    }
  }

</style>
<script>
  import keys from '@/services/keys'
  import Modal from '@/views/Modal';
  import Player from '@/views/Player';
  import ListSVG from '@/assets/img/icons/list.svg'
  import PlayListSVG from '@/assets/img/icons/playlist.svg'
  import HomeSVG from '@/assets/img/icons/home-page.svg'
  import {debounce} from '@/services/utils'
  export default {
    data() {
      return {
        menuActive: false,
      }
    },
    methods: {
      toggleMenu () {
        this.menuActive = !this.menuActive
      },
      async exit() {
        const res = await fetch(`${keys.BASE_URL}/auth/exit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const result = await res.json()
        this.$store.commit('exit', result)
      },
      closeModal() {
        this.$store.dispatch('closeModal')
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      },
      modal() {
        return this.$store.state.modal
      },
      avatar() {
        return `${keys.BASE_URL}/${this.user.avatar}`
      },

    },
    components: {
      Modal,
      ListSVG,
      PlayListSVG,
      HomeSVG,
      Player
    },
    created() {
      this.$store.dispatch('closeModal')
      this.$store.dispatch('getPlayLists')
      window.addEventListener('DOMContentLoaded', e => {
        this.$store.commit('changeWindowWidth', window.innerWidth)
      })
      window.addEventListener('resize', debounce(e => {
        this.$store.commit('changeWindowWidth', window.innerWidth)
      }, 100))
    }
  }
</script>