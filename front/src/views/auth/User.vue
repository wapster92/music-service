<template>
    <div class="window">
        <div class="user">
            <h3 class="user__title">WapSter</h3>
            <div class="user__image">
                <img src="http://localhost:3000/storage/avatars/avatar.png" alt="" class="user__img">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'User'
    }
</script>

<style lang="scss">
    .window {
        background: var(--alternative-bg-color);
        height: 100%;
        box-shadow: var(--light-box-shadow);
        padding: 20px;
        &--playlist {
            height: auto;
            @media (max-width: 370px) {
                padding: 10px;
            }
        }
    }

    .user {
        &__title {
            text-align: center;
            margin: 0.5em 0 0.6em;
            font-size: 32px;
            font-weight: 300;
        }
        &__image {
            text-align: center;
        }
        &__img {
            width: 200px;
            height: 200px;
            object-fit: cover;
        }
    }
</style>