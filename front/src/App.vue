<template>
    <div id="app" :class="{'overlay': modal}"
         @keydown.esc="closeModal"
         @click="closeMenu"
    >
        <header class="header">
            <div class="header__btn-wrap">
                <div class="menu-btn" @click="toggleMenu">
                    <div class="menu-btn__icon">
                        <ListSVG></ListSVG>
                    </div>
                    <span class="menu-btn__text">Меню</span>
                </div>
            </div>
            <div class="header__main">
                <nav class="login">
                    <ul class="login__list" v-if="!user.auth">
                        <li class="login__item">
                            <router-link to="/login" class="login__link">Войти</router-link>
                        </li>
                        <li class="login__item">
                            <router-link to="/register">Регистрация</router-link>
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
            <aside class="side-bar">
                <div class="menu">
                    <nav class="menu-nav">
                        <ul class="menu-nav__list">
                            <li class="menu-nav__item">

                                <router-link to="/" class="menu-nav__link">
                                    <HomeSVG></HomeSVG>
                                    Главная
                                </router-link>
                            </li>

                        </ul>
                    </nav>
                    <nav class="menu-nav" v-if="user.playLists.length">
                        <h3 class="menu-nav__title">Music Playlists</h3>
                        <ul class="menu-nav__list">
                            <li class="menu-nav__item" v-for="playList of user.playLists">
                                <router-link :to="`/my-play-list/${playList.name}`" class="menu-nav__link">
                                    <PlayListSVG></PlayListSVG>
                                    {{playList.name}}
                                </router-link>
                            </li>
                        </ul>
                    </nav>
                    <nav class="menu-nav menu-nav--last">
                        <ul class="menu-nav__list">
                            <li class="menu-nav__item">
                                <router-link :to="{name: 'user', params: {id: user.id}}" v-if="user.auth" class="menu-nav__link">
                                    Настройки
                                </router-link>
                            </li>
                            <li class="menu-nav__item" v-if="user.auth">
                                <a href="#" class="menu-nav__link" @click.prevent="exit">
                                    Выход
                                </a>
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
        position: fixed;
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
            toggleMenu() {
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
            },
            swipeMenu(e) {
                let touch = e.touches[0]
                let touchMove = evt => {
                    let touchMove = evt.touches[0]
                    let moveSize = touch.screenX - touchMove.screenX

                    if(moveSize < 200 && touch.screenX < touchMove.screenX) {
                        this.menuActive = true
                    }

                    if(moveSize > 200 && touch.screenX > touchMove.screenX) {
                        this.menuActive = false
                    }

                    console.log(moveSize)
                }
                let touchEnd = evt => {
                    document.removeEventListener('touchmove', touchMove)
                    document.removeEventListener('touchend', touchEnd)
                }
                document.addEventListener('touchmove', touchMove)
                document.addEventListener('touchend', touchEnd)
            },
            closeMenu(e) {
                if(e.target.tagName === 'A') {
                    this.menuActive = false
                }
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
            widowWidth() {
                return this.$store.state.windowWidth
            }
        },
        components: {
            Modal,
            ListSVG,
            PlayListSVG,
            HomeSVG,
            Player
        },
        mounted() {
            this.$store.dispatch('closeModal')
            this.$store.dispatch('getPlayLists')
            this.$store.commit('changeWindowWidth', window.innerWidth)
            if (window.innerWidth <= 1024) {
                this.$store.commit('setVolume', 1)
            }
            window.addEventListener('resize', debounce(e => {
                this.$store.commit('changeWindowWidth', window.innerWidth)
            }, 100))
        }
    }
</script>