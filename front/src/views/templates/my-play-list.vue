<template>
    <div class="window window--playlist">
        <div class="play-list play-list--my-list" v-for="(file, index) of audio" @click="startPlay(index)">
            <div class="play-list__name play-list__item">{{file.name}}</div>
            <div class="play-list__artist play-list__item">{{file.artist}}</div>
            <div class="play-list__likes play-list__item">
                <div class="icon-svg" @click.stop="deleteAudio(index)">
                    <DeleteSVG></DeleteSVG>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import DeleteSVG from '@/assets/img/icons/delete.svg'
    const getIndexArr = (arr, name) => {
        let index = 0
        arr.forEach((el, i) => {
            if(el.name == name) {
                index = i
            }
        })
        return index
    }
    export default {
        name: 'my-play-list',
        props: ['name'],
        computed: {
            user() {
                return this.$store.state.user
            },
            audio() {
                return this.user.playLists[getIndexArr(this.user.playLists, this.name)].files
            }
        },
        methods: {
            async deleteAudio(index) {
                await this.$store.dispatch('deleteFromPlayList', {namePlayList:this.name, index})
                await this.$store.dispatch('getPlayLists')
            },
            startPlay(index) {
                this.$store.commit('setIndexPlayer', index)
            }
        },
        components: {
            DeleteSVG
        },
        created() {
            this.$store.dispatch('getPlayLists')
            this.$store.commit('removeDataOfPlayer')
            this.$store.commit('setDataToPlayer', this.audio)
            // this.$store.dispatch('addDataToPlayer')
        }
    }
</script>

<style lang="scss">

</style>