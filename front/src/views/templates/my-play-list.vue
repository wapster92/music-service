<template>
    <div class="window window--playlist">
        <div class="playlist-full" v-if="audio.length > 0">
            <MyPlayItem v-for="(file, index) of audio" :key="file.name"
                        :trackName="file.name"
                        :artist="file.artist"
                        :index="index"
                        :name="name"></MyPlayItem>
        </div>
        <h3 class="empty-playlist" v-else>Здесь пока нет треков</h3>
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
        }
    }
</script>

<style lang="scss">
    .empty-playlist {
        font-size: 18px;
        font-weight: 300;
        text-align: center;
    }
</style>