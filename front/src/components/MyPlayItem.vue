<template>
    <div class="play-list play-list--my-list" @click="addToPlayerTracks(name, index)">
        <div class="play-list__name play-list__item">{{trackName}}</div>
        <div class="play-list__artist play-list__item">{{artist}}</div>
        <div class="play-list__likes play-list__item">
            <div class="icon-svg" @click.stop="deleteAudio(index)">
                <DeleteSVG></DeleteSVG>
            </div>
        </div>
    </div>
</template>

<script>
    import DeleteSVG from '@/assets/img/icons/delete.svg'
    import {getIndexArr} from '@/services/utils'
    export default {
        name: 'MyPlayItem',
        props: ['name', 'artist', 'index', 'trackName'],
        computed: {
            user() {
                return this.$store.state.user
            },
            audio() {
                return this.user.playLists[getIndexArr(this.user.playLists, this.name)].files
            }
        },
        methods: {
            addToPlayerTracks(id, index) {
                let playList = []
                let audio = this.audio
                audio.forEach(el => {
                    playList.push({
                        album: el.album,
                        artist: el.artist,
                        name: el.name,
                        path: el.path,
                        preview: el.preview
                    })
                })
                this.$store.dispatch('changeAndStartPlayList', {id, index, audio: playList})
            },
            async deleteAudio(index) {
                await this.$store.dispatch('deleteFromPlayList', {namePlayList:this.name, index})
                await this.$store.dispatch('getPlayLists')
            }
        },
        components: {
            DeleteSVG
        }
    }
</script>

<style scoped>

</style>