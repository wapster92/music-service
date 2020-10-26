<template>
    <div class="volume">
        <div class="volume__wrap">
            <div class="volume__icon">
                <VolumeSVG></VolumeSVG>
            </div>
            <div class="volume__status">
                <div class="v-bar" ref="volumeLine">
                    <div class="v-bar__line"></div>
                    <div class="v-bar__carriage" @mousedown="startDrag" ref="carriage" :style="{transform: matrix}"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import VolumeSVG from '@/assets/img/icons/volume.svg'


    export default {
        name: 'Volume',
        data() {
            return {
                draging: false,
                volumeCarriage: 0,
                volumeVal: 1,
                matrix: `matrix(1, 0, 0, 1, 0, 0)`
            }
        },
        methods: {
            startDrag() {
                this.draging = true
                this.$refs.carriage.style.cursor = 'grabbing'
                document.body.addEventListener('mousemove', this.move)
                document.body.addEventListener('mouseleave', this.stopDrop)
                document.body.addEventListener('mouseup', this.stopDrop)
            },
            move(e) {
                if(this.draging) {
                    this.setVolume(e.movementY)
                }
            },
            stopDrop() {
                this.draging = false
                this.$refs.carriage.style.cursor = 'grab'
            },
            setVolume(val) {
                this.volumeCarriage += val
                if(this.volumeCarriage < 0) {
                    this.volumeCarriage = 0
                }
                if(this.volumeCarriage > this.volumeLine) {
                    this.volumeCarriage = this.volumeLine
                }
                this.setVolumeVal(this.volumeCarriage)
            },
            setVolumeVal(val) {
                this.volumeVal = 100 - val / this.volumeLine * 100
                let volume = this.volumeVal / 100
                this.matrix = `matrix(1, 0, 0, 1, 0, ${this.volumeCarriage})`
                Howler.volume(volume)
                this.$store.commit('setVolume', volume)
            }
        },
        computed: {
            volumeLine() {
                return this.$refs.volumeLine.getBoundingClientRect().height
            },
            volume() {
                return this.$store.state.player.volume
            },
            startVolumeCarriage() {
                return this.volumeLine * (this.volume * 100) / 100
            }
        },
        components: {
            VolumeSVG
        },
        mounted() {
            this.volumeCarriage = this.startVolumeCarriage
            this.setVolumeVal(this.startVolumeCarriage)
        }
    }

</script>

<style lang="scss">
    .volume {
        width: 30px;
        height: 30px;
        @media (max-width: 450px) {
            margin-left: auto;
        }
        &__wrap {
            width: 30px;
            position: relative;
            &:hover, &:focus {
                .volume__status {
                    opacity: 1;
                }
                svg {
                    fill: var(--hover-color);
                }
            }
        }
        &__status {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 25;
            margin: 0 auto;
            background: var(--alternative-bg-color);
            box-shadow: var(--box-shadow);
            border-radius: 35px;
            height: 90px;
            opacity: 0;
            transition: opacity var(--transition-time);

        }
        &__icon {
            height: 30px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            position: relative;
            z-index: 30;
            svg {
                width: 15px;
                height: 15px;
                fill: var(--main-text-color);
                transition: fill var(--transition-time);

            }
        }
    }
    .v-bar {
        background: var(--main-text-color);
        width: 2px;
        margin: 10px auto 0;
        height: 42px;
        &__line {
            position: relative;
        }
        &__carriage {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: var(--main-bg-color);
            box-shadow: 0 3px 15px -2px rgba(0, 0, 0, 0.99);
            cursor: grab;
            position: absolute;
            z-index: 40;
            top: 2px;
            left: 0;
            right: 0;
            margin: 0 auto;

        }
    }
</style>