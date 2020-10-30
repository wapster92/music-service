<template>
    <div class="window user-page">
        <div class="user">
            <h3 class="user__title">{{user.login}}</h3>
            <div class="user__image">
                <img :src="avatar" alt="" class="user__img">
                <div class="user__image-change" @click="changeAvatar">
                    <ChangeAvatarSVG></ChangeAvatarSVG>
                    <input type="file" ref="avatar" name="avatar" class="user__image-input" @change="addNewAvatar">
                </div>
            </div>
        </div>
        <div class="playlists" v-if="user.playLists.length > 0">
            <h3 class="playlists__title">Плейлисты</h3>
            <ul class="playlists__list">
                <li class="playlists__item" v-for="playlist of user.playLists">
                    <div class="playlists__name">{{playlist.name}}</div>
                    <div class="playlists__del" @click="deletePlayList(playlist.name)"><DeleteSVG></DeleteSVG></div>
                </li>
            </ul>
        </div>
        <div class="user-controls">
            <button class="user-controls__btn btn" @click="deleteAccount">Удалить</button>
        </div>
    </div>
</template>

<script>
    import keys from '@/services/keys';
    import DeleteSVG from '@/assets/img/icons/delete.svg'
    import ChangeAvatarSVG from '@/assets/img/icons/change-avatar.svg'
    export default {
        name: 'User',
        data() {
            return {
                avatarChange: false
            }
        },
        computed: {
            user() {
                return this.$store.state.user
            },
            avatar: {
                get() {
                    return  `${keys.BASE_URL}/${this.user.avatar}`
                },
                set(val) {
                    this.$store.commit('changeAvatar', val)
                }
            }
        },
        methods: {
            changeAvatar() {
                this.$refs.avatar.click()
            },
            async addNewAvatar(e) {
                const formData = new FormData();
                formData.append('avatar', e.target.files[0])
                formData.append('id', this.user.id)
                const res = await fetch(`${keys.BASE_URL}/api/avatar-add`, {
                    method: 'POST',
                    body: formData
                })
                const result = await res.json()
                this.avatar = result.path
            },
            async deletePlayList(name) {
                try {
                    const res = await fetch(`${keys.BASE_URL}/api/remove-playlist`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userId: this.user.id,
                            name
                        })
                    })
                    const result = await res.json()
                    this.$store.commit('addPlayLists', result.playLists)
                } catch (e) {

                }
            },
            deleteAccount() {
                this.$store.dispatch('deleteAccount', {id: this.user.id})
            }
        },
        components: {
            DeleteSVG,
            ChangeAvatarSVG
        }
    }
</script>

<style lang="scss">
    .window {
        background: var(--alternative-bg-color);
        height: 100%;
        box-shadow: var(--light-box-shadow);
        padding: 20px;
        &--playlist {
            height: auto;
            @media (max-width: 370px) {
                padding: 10px;
            }
        }
    }
    .user-page {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .user {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        &__title {
            text-align: center;
            margin: 0.5em 0 0.6em;
            font-size: 32px;
            font-weight: 300;
        }
        &__image {
            display: inline-flex;
            margin: 0 auto;
            position: relative;
            &:hover, &:focus {
                .user__image-change {
                    opacity: 1;
                }
            }
        }
        &__img {
            width: 200px;
            height: 200px;
            object-fit: cover;
        }
        &__image-change {
            width: 30px;
            height: 30px;
            position: absolute;
            right: 5px;
            bottom: 5px;
            background: var(--alternative-bg-color);
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            transition: opacity var(--transition-time);
            svg {
                width: 20px;
                height: 20px;
                fill: var(--main-text-color);
                transition: fill var(--transition-time);
            }
            &:hover, &:focus {
                svg {
                    fill: var(--hover-color);
                }
            }
        }
        &__image-input {
            display: none;
        }
    }
    .playlists {
        width: 100%;
        &__title {
            font-size: 18px;
            font-weight: 400;
        }
        &__list {
            margin: 0;
            padding: 0;
            list-style-type: none;
        }
        &__del {
            display: flex;
            align-items: center;
            cursor: pointer;
            svg {
                width: 16px;
                height: 16px;
                transition: fill var(--transition-time);
            }
            &:hover, &:focus {
                fill: var(--danger);
            }
        }
        &__item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px;
            margin-bottom: 10px;
            border: 2px solid var(--border-color);
        }
        &__name {
            font-size: 16px;
            font-weight: 300;
        }
    }
    .user-controls {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        margin-top: auto;
        margin-left: auto;
    }
</style>