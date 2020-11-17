<template>
    <div class="auth auth--center">
        <form action="" class="auth-form" @submit.prevent="checkForm">
            <h3 class="auth-form__title">Регистрация</h3>
            <div class="auth-form__row">
                <div class="auth-form__error" v-if="!$v.registerForm.email.required">Поле обязательно для заполнения</div>
                <div class="auth-form__error" v-if="!$v.registerForm.email.minLength">Минимальная длинна поля 4 символа</div>
                <div class="auth-form__error" v-if="!$v.registerForm.email.email">Это не email</div>
                <div class="auth-form__error" v-if="!registerForm.checkedEmail">Этот Email уже используется</div>
                <input type="text" name="email" class="auth-form__input" placeholder="Email"
                       @focusout="checkEmail"
                       v-model.trim="$v.registerForm.email.$model">
            </div>
            <div class="auth-form__row">
                <div class="auth-form__error" v-if="!$v.registerForm.login.required">Поле обязательно для заполнения</div>
                <div class="auth-form__error" v-if="!$v.registerForm.login.minLength">Минимальная длинна поля 4 символа</div>
                <div class="auth-form__error" v-if="!registerForm.checkedLogin">Этот Login уже используется</div>
                <input type="text" name="login" class="auth-form__input" placeholder="Логин"
                       @focusout="checkLogin"
                       v-model="$v.registerForm.login.$model">
            </div>
            <div class="auth-form__row">
                <div class="auth-form__error" v-if="!$v.registerForm.password.required">Поле обязательно для заполнения</div>
                <div class="auth-form__error" v-if="!$v.registerForm.password.minLength">Минимальная длинна поля 6 символов</div>
                <input type="password" name="password" class="auth-form__input" placeholder="Пароль"
                       v-model="$v.registerForm.password.$model"
                >
            </div>
            <div class="auth-form__row">
                <div class="auth-form__error" v-if="!$v.registerForm.repeatPassword.required">Поле обязательно для заполнения</div>
                <div class="auth-form__error" v-if="!$v.registerForm.repeatPassword.sameAs">Пароли не совпадают</div>
                <input type="password" name="repeatPassword" class="auth-form__input" placeholder="Повторите пароль" v-model="$v.registerForm.repeatPassword.$model">
            </div>
            <div class="auth-form__row auth-form__row--btn-central">
                <button class="auth-form__btn btn" :disabled="$v.registerForm.$invalid">Зарегестрироваться</button>
            </div>
        </form>
    </div>
</template>

<script>
    import keys from '@/services/keys';
    import {required, email, minLength, sameAs, helpers} from 'vuelidate/lib/validators'
    export default {
        name: 'auth',
        data() {
            return {
                registerForm: {
                    email: '',
                    login: '',
                    password: '',
                    repeatPassword: '',
                    checkedEmail: true,
                    checkedLogin: true
                }
            }
        },
        validations: {
            registerForm: {
                email: {
                    required,
                    email,
                    minLength: minLength(4)
                },
                login: {
                    required,
                    minLength: minLength(4),

                },
                password: {
                    required,
                    minLength: minLength(6)
                },
                repeatPassword: {
                    required,
                    sameAs: sameAs('password')
                },

            }
        },
        methods: {
            checkForm () {
                this.$store.dispatch('register', {
                    email: this.registerForm.email,
                    login: this.registerForm.login,
                    password: this.registerForm.password
                })
            },
            async checkEmail () {
                try {
                    const res = await fetch(`${keys.BASE_URL}/auth/check-mail`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: this.registerForm.email
                        })
                    })
                    const result = await res.json()
                    this.registerForm.checkedEmail = result.valid
                } catch (e) {
                    console.log(e)
                }
            },
            async checkLogin () {
                try {
                    const res = await fetch(`${keys.BASE_URL}/auth/check-login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            login: this.registerForm.login
                        })
                    })
                    const result = await res.json()
                    this.registerForm.checkedLogin = result.valid
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }
</script>

<style lang="scss">
    .auth {
        max-width: 600px;
        width: 100%;
        background: var(--alternative-bg-color);
        padding: 15px;
        box-shadow: var(--box-shadow);
        &--center {
            margin: 0 auto;
        }
    }
    .auth-form {
        &__title {
            font-size: 20px;
            margin: 10px 0 25px;
            text-align: center;
        }
        &__row {
            max-width: 450px;
            margin: 0 auto 20px;
            &--btn-central {
                text-align: center;
            }
        }
        &__input {

        }
        &__error {
            color: red;
            margin-bottom: 5px;
        }
        &__btn {

        }
    }
</style>