<template>
    <div class="bar">
        <div class="bar__line" ref="bar">
            <div class="bar__carriage" :style="{transform: `translateX(${progress}px)`}" ref="carriage"
                 @mousedown="startDrag"
                 @touchstart="touchStartDrag"
                 >
                </div>
            <div class="bar__end-line"></div>
        </div>
    </div>
</template>

<script>
    import {Howler} from 'howler'
    import {bus} from '@/services/bus'
    import {debounce} from '@/services/utils';
    export default {
        name: 'Progressbar',
        data() {
            return {
                previousTouch: null
            }
        },
        computed: {
            progress: {
                get() {
                    return this.$store.state.player.progress
                },
                set(val) {
                    this.$store.commit('setProgress', val)
                }
            },
            dragCarriage() {
                return this.$store.state.player.dragCarriage
            },
            progressBarWidth() {
                return this.$store.state.player.progressBarWidth
            },
            duration() {
                return this.$store.state.player.duration
            },
            seek() {
                return this.$store.state.player.seek
            }
        },
        methods: {
            startDrag() {
                this.$store.commit('setDragCarriage', true)
                this.$refs.carriage.style.cursor = 'grabbing'
                document.body.addEventListener('mousemove', this.move)
                document.body.addEventListener('mouseleave', this.stopDrop)
                document.body.addEventListener('mouseup', this.stopDrop)
            },
            touchStartDrag(e) {
                this.$store.commit('setDragCarriage', true)
                let touchMove = evt => {
                    let touch = evt.touches[0]
                    if(this.previousTouch) {
                        let result = touch.clientX - this.previousTouch.clientX
                        this.setProgress(result)
                    }
                    this.previousTouch = touch

                }
                let touchend = evt => {
                    document.removeEventListener('touchmove', touchMove)
                    document.removeEventListener('touchend', touchend)
                    this.$store.commit('setDragCarriage', false)
                }
                document.addEventListener('touchmove', touchMove)
                document.addEventListener('touchend', touchend)
            },
            move(e) {
                if(this.dragCarriage) {
                    this.setProgress(e.movementX)
                }
            },
            stopDrop() {
                this.$store.commit('setDragCarriage', false)
                this.$refs.carriage.style.cursor = 'grab'
            },
            setProgress(val) {
                this.progress += val
                if(this.progress < 0) {
                    this.progress = 0
                }
                if(this.progress > this.progressBarWidth) {
                    this.progress = this.progressBarWidth
                }
                this.setProgressVal(this.progress)
            },
            setProgressVal(val) {
                Howler.stop()
                this.progress = val
                let result = this.duration * this.progress / this.progressBarWidth
                bus.$emit('changeProgress', result)
            }
        },
        mounted() {
            this.$store.commit('setProgressBarWidth', this.$refs.bar.offsetWidth)
            this.$store.commit('setCarriageWidth', this.$refs.carriage.offsetWidth)
            window.addEventListener('resize', debounce(e => {
                if(this.$refs.bar) {
                    this.$store.commit('setProgressBarWidth', this.$refs.bar.offsetWidth)
                }
            }, 100))
        }
    }
</script>

<style lang="scss">
    .bar {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        &__line {
            width: 100%;
            height: 3px;
            border-radius: 5px;
            background: var(--main-text-color);
            position: relative;
        }

        &__carriage {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: var(--main-bg-color);
            box-shadow: 0 3px 15px -2px rgba(0, 0, 0, .99);
            cursor: grab;
            position: absolute;
            top: 0;
            bottom: 0;
            left: calc(-15px/2);
            margin: auto 0;

        }
        &--mobile {
            position: absolute;
            top: 0;
            left: 0;
            height: auto;
        }
    }
</style>