<template>
    <div class="play-list" @click="addToPlayerTracks(id, index)">
        <div class="play-list__name play-list__item">{{name}}</div>
        <div class="play-list__artist play-list__item">{{artist}}</div>
        <div class="play-list__year play-list__item">{{year}}</div>
        <div class="play-list__likes play-list__item">
            <div class="icon-svg">
                <HeartSVG />
            </div>
            <div class="icon-svg" @click.stop="userPlayList(index, name)" v-if="user.auth">
                <PlusSVG />
            </div>
        </div>
    </div>
</template>

<script>
    import HeartSVG from '@/assets/img/icons/heart.svg'
    import PlusSVG from '@/assets/img/icons/plus.svg';
    export default {
        name: 'PlayItem',
        props: ['id', 'name', 'year', 'artist', 'index'],
        computed: {
            user() {
                return this.$store.state.user
            },
            audio() {
                return this.$store.state.playList.audio
            }
        },
        methods: {
            userPlayList (index, name) {
                this.$store.dispatch('openModal')
                this.$store.commit('addToModal', {index, id: this.id, name})
            },
            addToPlayerTracks(id, index) {
                let playList = []
                let audio = this.audio.files
                audio.forEach(el => {
                    playList.push({
                        album: this.audio.album,
                        artist: this.audio.artist,
                        name: el.name,
                        path: el.path,
                        preview: this.audio.preview
                    })
                })
                this.$store.dispatch('changeAndStartPlayList', {id, index, audio: playList})
            },
        },
        components: {
            HeartSVG,
            PlusSVG,
        }
    }
</script>

<style lang="scss">
    .play-list {
        display: grid;
        grid-template-columns: 1.5fr 1.5fr 100px auto;
        border: 2px solid var(--border-color);
        border-bottom: none;
        transition: box-shadow .5s;
        cursor: pointer;
        @media (max-width: 550px) {
            grid-template-columns: 1.5fr 1.5fr auto auto;
        }
        @media (max-width: 490px) {
            grid-template-columns: 1.5fr auto;
            margin-bottom: 10px;
            border: 2px solid var(--border-color);
            .play-list__name {
                grid-column: span 1;
                padding-bottom: 0;
                font-weight: 400;
            }
            .play-list__artist {
                grid-column: span 1;
                grid-row: 2 / 3;
                padding-top: 0;
            }
            .play-list__year {
                display: none;
            }
            .play-list__likes {
                grid-row: 1 / 3;
                justify-content: center;
            }
            .play-list__item {
                border: none;
                min-height: auto;
            }
        }
        &--my-list {
            grid-template-columns: 1.5fr 1.5fr auto;
            @media (max-width: 490px) {
                grid-template-columns: 1.5fr auto;
                border-bottom: 2px solid var(--border-color);
            }
        }
        &:last-child {
            border-bottom: 2px solid var(--border-color);
        }
        &:hover, &:focus {
            box-shadow: var(--box-shadow);
        }
        &__item {
            padding: 5px 10px;
            min-height: 35px;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 300;
        }
        &__name {
            border-right: 2px solid var(--border-color);
        }
        &__artist {
            border-right: 2px solid var(--border-color);
        }
        &__year {
            border-right: 2px solid var(--border-color);
        }
        &__likes {

        }
    }
    .icon-svg {
        display: flex;
        align-items: center;
        fill: var(--main-text-color);
        margin-right: 10px;
        transition: fill var(--transition-time);

        &:last-child {
            margin: 0;
        }
        svg {
            width: 16px;
            height: 16px;
        }
        &:hover, &:focus {
            fill: var(--hover-color);
        }
    }
</style>