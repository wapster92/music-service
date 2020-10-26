<template>
    <div class="window">
        <div class="preview-grid">
            <div class="preview-grid__item" v-for="(audio, i) of audios" :key="i">
                <preview :img="audio.preview" :artist="audio.performer" :album="audio.album" :id="audio._id"></preview>
            </div>
        </div>
    </div>
</template>

<script>
    import Preview from '@/components/Preview';
    export default {
        name: 'previewPlaylists',
        components: {
            Preview
        },
        computed: {
            audios() {
                
                return this.$store.state.previewPlaylists.audios
            }
        },
        created() {
            this.$store.dispatch('getPreviewPlaylist')
        }
    }
</script>

<style lang="scss">
    .preview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, 160px);
        //grid-template-rows: repeat(auto-fit, 160px);
        justify-content: center;
        gap: 30px;
        @media (max-width: 550px) {
            gap: 20px;
        }
        @media (max-width: 415px) {
            grid-template-columns: repeat(auto-fit, 200px);
        }
        &__item {

        }
    }
</style>