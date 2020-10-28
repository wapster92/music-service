<template>
    <div class="player" v-if="showPlayer" :class="{'player--show' : showPlayer}">
        <Progressbar v-if="windowWidth < 450" class="bar--mobile"></Progressbar>
        <div class="cover">
            <img :src="preview" alt="" class="cover__img">
        </div>
        <div class="status-bar">
            <div class="info">
                <div class="info__name">{{playList[index].name}}</div>
                <div class="info__artist">{{playList[index].artist}}</div>
            </div>

            <div class="controls">
                <div class="buttons">
                    <div class="buttons__prev" @click="prev" v-if="index > 0">
                        <PrevSVG></PrevSVG>
                    </div>
                    <div class="buttons__play" @click="changePlaying">
                        <PlaySVG v-if="!isPlaying"></PlaySVG>
                        <PauseSVG v-else></PauseSVG>
                    </div>
                    <div class="buttons__next" @click="next" v-if="index < sounds.length - 1">
                        <NextSVG></NextSVG>
                    </div>
                </div>
                <div class="status" v-if="windowWidth >= 450">
                    <div class="status__remaining-time">{{currentTime}}</div>
                    <Progressbar></Progressbar>
                    <div class="status__total-time">{{duration}}</div>
                </div>
                <Volume></Volume>
            </div>
        </div>
    </div>
</template>

<script>
    import PrevSVG from '@/assets/img/icons/prev.svg'
    import PlaySVG from '@/assets/img/icons/play.svg'
    import NextSVG from '@/assets/img/icons/next.svg'
    import PauseSVG from '@/assets/img/icons/pause.svg'
    import Volume from '@/components/Volume';
    import Progressbar from '@/components/Progressbar';
    import {Howl, Howler} from 'howler'
    import keys from '@/services/keys'
    import {bus} from '@/services/bus'
    import {throttle, debounce} from '@/services/utils'


    export default {
        name: 'Player',
        data() {
            return {
                sounds: [],
                currentTime: '00:00',
                duration: '00:00'
            }
        },
        mounted() {
            this.$store.commit('showPlayer', false)
            this.addPlayTracks()
            this.setProgress = throttle(function (seek) {
                this.$store.dispatch('changeProgressAndSeek', seek)
            }, 60)
            bus.$on('changeProgress', debounce(val => {
                this.sounds[this.index].seek(val)
                this.sounds[this.index].play()
            }, 300))
        },
        methods: {
            addPlayTracks() {
                Howler.unload()
                let _this = this
                this.playList.forEach((el, i) => {
                    let howl = new Howl({
                        src: [`${keys.BASE_URL}/${el.path}`],
                        html5: true,
                        ctx: true,
                        volume: _this.volume,
                        preload: false,
                        onend() {
                            if (i < _this.sounds.length - 1) {
                                //_this.sounds[i + 1].play()
                                _this.$store.commit('setIndexPlayer', _this.index + 1)
                            } else {
                                Howler.unload()
                                _this.$store.commit('showPlayer', false)
                            }
                        },
                        onplay() {
                            _this.setDuration()
                            const getProgress = () =>{
                                if(howl.playing() && !_this.dragCarriage) {
                                    let seek = howl.seek()
                                    _this.setProgress(seek)
                                    _this.getCurrentTime(seek)
                                    requestAnimationFrame(getProgress)
                                }
                            }
                            getProgress()
                        },
                        onseek() {
                            _this.setDuration()
                            const getProgress = () =>{
                                if(howl.playing()) {
                                    let seek = howl.seek()
                                    _this.setProgress(seek)
                                    _this.getCurrentTime(seek)
                                    requestAnimationFrame(getProgress)
                                }
                            }
                            getProgress()
                        }
                    })
                    _this.sounds.push(howl)
                })
            },
            startPlay(index) {
                try {
                    this.sounds[index].play()
                } catch (e) {

                }
            },
            setProgress(seek) {
                if(this.index >= 0) {
                    this.$store.dispatch('changeProgressAndSeek', seek)
                }
            },
            getCurrentTime(seek) {
                this.currentTime = `${Math.floor(seek / 60)}:${Math.floor(seek % 60)}`
            },
            changePlaying() {
                this.sounds[this.index].playing() ? this.sounds[this.index].pause() : this.sounds[this.index].play()
            },
            next() {
                this.$store.commit('setIndexPlayer', this.index + 1)
            },
            prev() {
                this.$store.commit('setIndexPlayer', this.index - 1)
            },
            setDuration() {
                if(this.sounds[this.index].duration()) {
                    this.$store.commit('setDuration', this.sounds[this.index].duration())
                    this.duration = `${Math.floor(this.sounds[this.index].duration() / 60)}:${Math.floor(this.sounds[this.index].duration() % 60)}`
                }
            }

        },
        computed: {
            showPlayer() {
                return this.$store.state.player.showPlayer
            },
            playList() {
                return this.$store.state.player.playList
            },
            index() {
                return this.$store.state.player.index
            },
            preview() {
                if(this.index >= 0) {
                    return `${keys.BASE_URL}/${this.playList[this.index].preview}`
                }
            },
            isPlaying() {
                    return this.sounds[this.index].playing()
            },
            volume() {
                return this.$store.state.player.volume
            },
            progressBarWidth() {
                return this.$store.state.player.progressBarWidth
            },
            carriageWidth() {
                return this.$store.state.player.carriageWidth
            },
            dragCarriage() {
                return this.$store.state.player.dragCarriage
            },
            windowWidth() {
                return this.$store.state.windowWidth
            }
        },
        components: {
            PrevSVG,
            PlaySVG,
            NextSVG,
            PauseSVG,
            Volume,
            Progressbar
        },
        watch: {
            index(val) {
                Howler.stop()
                this.startPlay(val)
            },
            playList() {
                Howler.stop()
                this.sounds = []
                this.addPlayTracks()
                this.startPlay(this.index)
            },
        }
    }
</script>

<style lang="scss">
    .player {
        width: 100%;
        height: 80px;
        background: var(--alternative-bg-color);
        box-shadow: var(--light-box-shadow);
        position: sticky;
        bottom: 0;
        display: grid;
        grid-template-columns: auto 1fr;
        grid-column-gap: 10px;
        &--show {
            animation: opacity 1s;
        }
    }

    @keyframes opacity {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
     }

    .cover {
        height: 80px;
        width: 80px;

        &__img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .info {
        padding: 5px 10px;
        font-weight: 300;
        height: 50%;
        width: 100%;
        &__artist {
            font-size: 12px;
        }

        &__name {
            font-size: 14px;
            max-height: 16px;
            overflow: hidden;
        }
    }

    .status-bar {

    }

    .status {
        width: 100%;
        height: 30px;
        padding: 0 10px 0 10px;
        position: relative;
        &__remaining-time {
            position: absolute;
            top: -5px;
            font-size: 10px;
            font-weight: 300;
        }

        &__total-time {
            position: absolute;
            top: -5px;
            right: 10px;
            font-size: 10px;
            font-weight: 300;
        }
    }

    .controls {
        padding: 5px 10px;
        height: 50%;
        display: flex;
        align-items: center;
    }

    .buttons {
        display: flex;
        height: 100%;
        align-items: center;
        fill: var(--main-text-color);

        &__prev {
            width: 20px;
            height: 20px;
            cursor: pointer;

            &:hover, &:focus {
                fill: var(--hover-color);
            }
        }

        &__play {
            width: 30px;
            height: 30px;
            margin: 0 8px;
            cursor: pointer;

            &:hover, &:focus {
                fill: var(--hover-color);
            }
        }

        &__next {
            width: 20px;
            height: 20px;
            cursor: pointer;

            &:hover, &:focus {
                fill: var(--hover-color);
            }
        }
    }




</style>