<template>
    <div class="window window--playlist">
        <MyPlayItem v-for="(file, index) of audio"
                    :trackName="file.name"
                    :artist="file.artist"
                    :index="index"
                    :name="name"
        >
        </MyPlayItem>
    </div>
</template>

<script>
    import MyPlayItem from '@/components/MyPlayItem';
    import {getIndexArr} from '@/services/utils'
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
        components: {
            MyPlayItem
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