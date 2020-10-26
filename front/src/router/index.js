import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from '@/views/auth/Register';
import Login from '@/views/auth/Login';
import User from '@/views/auth/User';
import AddMusic from '@/views/panel/Add-music'
import previewPlaylists from '@/views/templates/previewPlaylists';
import playList from '@/views/templates/playList';
import myPlayList from '@/views/templates/my-play-list'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Главная',
        component: previewPlaylists
    },
    {
        path: '/register',
        name: 'Регистрация',
        component: Register
    },
    {
        path: '/login',
        component: Login
    },
    {
        name: 'user',
        path: '/user/:id',
        component: User
    },
    {
        name: 'Add-music',
        path: '/panel/add',
        component: AddMusic
    },
    {
        name: 'Play-list',
        path: '/play-list/:id',
        component: playList,
        props: true
    },
    {
        name: 'My-play-list',
        path: '/my-play-list/:name',
        component: myPlayList,
        props: true
    }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
