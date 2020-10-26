<template>
    <div class="modal">
        <div class="modal__head">
            <h3 class="modal__title">Плейлисты</h3>
            <div class="modal__close" @click="closeModal">
                <CloseSVG/>
            </div>
        </div>
        <ul class="modal__list" v-if="user.playLists.length">
            <li class="modal__item" v-for="playList of user.playLists">
                <label class="list">
                    <input type="checkbox" class="list__input" @change="addOrRemoveToPlayList(playList.name, $event, checkAudio(playList.name, nameAudio, audioId).index)" :name="playList.name"
                           :checked="checkAudio(playList.name, nameAudio, audioId).is">
                    <span class="list__check"></span>
                    <span class="list__text">{{playList.name}}</span>
                </label>
            </li>
        </ul>
        <div class="modal__footer">
            <div class="add-play-list">
                <div class="add-play-list__def" :class="{'add-play-list__def--active': !modalInput}" @click.stop="openInput">
                    <div class="add-play-list__icon">
                        <PlusSVG/>
                    </div>
                    <span class="add-play-list__text">Создать плейлист</span>
                </div>
                <div class="add-play-list__form" :class="{'add-play-list__form--active': modalInput}">
                    <input type="text" class="add-play-list__input" placeholder="Введите название" v-model="playListName">
                    <button class="add-play-list__btn" @click="addPlayList">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CloseSVG from '@/assets/img/icons/close.svg'
    import PlusSVG from '@/assets/img/icons/plus.svg'
    import keys from '@/services/keys';
    import user from '@/store/user';

    const checkAudio = (arr, name, id) => {
        let result = -1
        arr.forEach((el, i) => {
            if(el.name === name && el.id === id) {
                result = i
            }
        })
        return result
    }


    export default {
        name: 'Modal',
        data() {
            return {
                playListName: '',
                playListsNames: []
            }
        },
        created() {
            this.$store.dispatch('getPlayLists')

            document.addEventListener('keydown', e => {
                if(e.code === 'Escape') {
                    this.$store.dispatch('closeModal')
                }
            })
            this.checkAudio(this.nameAudio, this.audioId)

        },
        mounted() {

        },
        methods: {
            checkAudio(playList, name, id) {
                let result = {is: false, index: -1}
                this.user.playLists.forEach(n => {
                    if(n.name === playList && n.files) {
                        n.files.forEach((k, i)=> {
                            if(k.name === name && k.id === id) {
                                result.is = true
                                result.index = i
                            }
                        })
                    }
                })
                return result
            },
            closeModal() {
                this.$store.dispatch('closeModal')
            },
            openInput() {
                this.$store.commit('openModalInput')
            },
            closeInput() {
                this.$store.commit('closeModalInput')
            },
            addPlayList() {
                this.$store.dispatch('addPlayList', {
                    namePlayList: this.playListName
                })
                this.playListName = ''
            },
            async addOrRemoveToPlayList (namePlayList, e, index) {
                if(e.target.checked) {
                    await this.$store.dispatch('addToPlayList', {namePlayList, audioId: this.audioId, nameAudio: this.nameAudio})
                } else if(index >= 0) {

                    await this.$store.dispatch('deleteFromPlayList', {namePlayList, index})
                }
            }
        },
        components: {
            CloseSVG,
            PlusSVG
        },
        computed: {
            user() {
                return this.$store.state.user
            },
            modalInput() {
                return this.$store.state.modalInput
            },
            audioId() {
                return this.$store.state.audioId
            },
            nameAudio() {
                return this.$store.state.name
            }
        }
    }
</script>

<style lang="scss">
    .modal {
        position: absolute;
        z-index: 120;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        max-width: 400px;
        width: 100%;
        padding: 15px 20px;
        &__title {
            font-weight: 300;
            margin: 0;
        }
        &__head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 10px;
        }
        &__close {
            cursor: pointer;
            stroke: var(--main-text-color);
            transition: stroke var(--transition-time);
            &:hover, &:focus {
                stroke: var(--hover-color);
            }
        }
        &__list {
            list-style-type: none;
            margin: 0;
            padding: 10px 0;
            border-bottom: 1px solid var(--border-color);
        }
        &__item {
            padding: 2px 0;
        }
    }
    .list {
        display: flex;
        align-items: center;
        &__input {
            display: none;
            &:checked ~ .list__check {
                &:before {
                    opacity: 1;
                }
            }
        }
        &__check {
            width: 16px;
            height: 16px;
            border: 1px solid var(--main-text-color);
            display: inline-block;
            margin-right: 10px;
            border-radius: 4px;
            cursor: pointer;
            position: relative;
            &:before {
                content: '';
                position: absolute;
                background: var(--main-text-color);
                top: 3px;
                left: 3px;
                right: 3px;
                bottom: 3px;
                border-radius: 2px;
                transition: opacity var(--transition-time);

                opacity: 0;
            }
        }
        &__text {
            font-weight: 300;
        }
    }
    .add-play-list {
        padding: 10px 0 0;
        &__icon {
            width: 13px;
            height: 13px;
            margin-right: 8px;
            fill: var(--main-text-color);
        }
        &__text {
            font-size: 16px;
            font-weight: 300;
        }
        &__def {
            display: none;
            cursor: pointer;
            &--active {
                display: flex;
            }
        }
        &__form {
            display: none;
            &--active {
                display: flex;
            }
        }
        &__input {
            border: none !important;
            border-bottom: 1px solid var(--border-color) !important;
            box-shadow: none !important;
            padding: 5px 0 !important;
            &:focus {
                outline: none;
            }
        }
        &__btn {
            border: none;
            font-size: 14px;
            font-weight: 300;
            color: var(--main-text-color);
            background: var(--border-color);
            cursor: pointer;
            transition: background-color var(--transition-time), color var(--transition-time);
            &:hover, &:focus {
                background: var(--hover-color);
                outline: none;
                color: #fff;
            }
        }
    }
</style>