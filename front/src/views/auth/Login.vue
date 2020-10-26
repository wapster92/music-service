<template>
    <div class="auth auth--center">
        <form action="" class="auth-form" @submit.prevent="checkForm">
            <h3 class="auth-form__title">Авторизация</h3>
            <div class="auth-form__row">
                <input type="text" name="login" class="auth-form__input" placeholder="Логин" v-model="enterForm.login">
            </div>
            <div class="auth-form__row">
                <input type="password" name="password" class="auth-form__input" placeholder="Пароль"
                       v-model="enterForm.password"
                >
            </div>
            <div class="auth-form__row auth-form__row--btn-central">
                <button class="auth-form__btn btn">Войти</button>
            </div>
        </form>
    </div>
</template>

<script>
    import keys from '@/services/keys';
    export default {
        name: 'auth',
        data() {
            return {
                enterForm: {
                    login: '',
                    password: '',
                }
            }
        },
        methods: {
            checkForm () {
                this.$store.dispatch('auth', {
                    login: this.enterForm.login,
                    password: this.enterForm.password
                })
            },

        }
    }
</script>

<style scoped>

</style>