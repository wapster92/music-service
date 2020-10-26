<template>
    <div class="window window--playlist">
        <PlayItem v-for="(file, index) of audio.files"
                  :name="file.name"
                  :artist="audio.artist"
                  :year="file.year"
                  :id="id"
                  :index="index"

        >
        </PlayItem>
    </div>
</template>

<script>
    import PlayItem from '@/components/PlayItem'
    export default {
        name: 'playList',
        props: ['id'],
        computed: {
            audio() {
                return this.$store.state.playList.audio
            }
        },
        async created() {
            await this.$store.dispatch('getPlayList', {id: this.id})
            //await this.$store.commit('removeDataOfPlayer')
        },
        components:{
            PlayItem
        }
    }
</script>

<style lang="scss">

</style>