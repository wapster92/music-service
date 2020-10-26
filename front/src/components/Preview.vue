<template>
    <router-link :to="{name: 'Play-list', params: {id: id}}" class="preview">
        <div class="preview__img-wrap"><img :src="`${url}/${img}`" alt="" class="preview__img"></div>
        <h4 class="preview__artist">{{artist}}</h4>
        <span class="preview__album">{{album}}</span>
    </router-link>
</template>

<script>
    import keys from '@/services/keys';
    export default {
        name: 'Preview',
        props: ['img', 'artist', 'album', 'id'],
        data() {
            return {
                url: keys.BASE_URL
            }
        }
    }
</script>

<style lang="scss">
    .preview {
        //height: 160px;
        display: inline-block;
        &__img-wrap {
            width: 100%;
            height: 160px;
            display: flex;
            @media (max-width: 655px) {
                height: 120px;
            }
            @media (max-width: 335px) {
                height: 110px;
            }
        }
        &__img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        &__artist {
            margin: .4em 0 0;
            font-size: 16px;
            font-weight: 400;
            @media (max-width: 655px) {
                font-size: 14px;
            }
        }
        &__album {
            font-size: 14px;
            font-weight: 300;
            @media (max-width: 655px) {
                font-size: 13px;
            }
        }
    }
</style>