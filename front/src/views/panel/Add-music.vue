<template>
    <div class="window">
        <form action="" class="add-music-form" @submit="upload" v-if="!success">
            <h3 class="add-music-form__title">Добавление треков</h3>
            <div class="add-music-form__row">
                <label class="add-music-form__label" for="performer">Испольнитель</label>
                <input type="text" name="performer" id="performer" class="add-music-form__input" :class="{'add-music-form__input--error': $v.performer.$error}" v-model.trim.lazy="$v.performer.$model">
                <span class="add-music-form__error" v-if="!$v.performer.required">Поле обязательно для заполнения</span>
            </div>
            <div class="add-music-form__row">
                <label class="add-music-form__label" for="album">Альбом</label>
                <input type="text" name="album" id="album" class="add-music-form__input" v-model.lazy="$v.album.$model" :class="{'add-music-form__input--error': $v.album.$error}">
                <span class="add-music-form__error" v-if="!$v.album.required">Поле обязательно для заполнения</span>
            </div>
            <div class="add-music-form__row">
                <div class="add-music-form__preview" @click="openPreviewFile">
                    <div v-if="!previewB64" class="add-music-form__plus">
                        <AddSVG></AddSVG>
                    </div>
                    <img v-else :src="previewB64" alt="" class="add-music-form__preview-img">
                </div>
                <input type="file" name="preview" id="preview" @change="changePreview" class="add-music-form__input-preview" ref="inputPreview">
                <span class="add-music-form__error" v-if="!$v.preview.validateImg">Только картинки jpg, jpeg и png</span>
            </div>
            <div class="add-music-form__row">
                <button @click="addTracks" type="button" class="add-music-form__add-tracks"><PlusSVG></PlusSVG> Добавить треки</button>
                <input type="file" name="audio" id="audio" multiple @change="changeAudio" class="add-music-form__input-tracks" ref="inputTrack">
                <span class="add-music-form__error" v-if="!$v.audio.validateAudio">Только audio файлы m4a, mp3</span>
                <ul class="file-list" v-if="audio">
                    <li class="file-list__name" v-for="file of audio">{{file.name}}</li>
                </ul>
            </div>
            <div class="add-music-form__row">
                <button class="add-music-form__btn btn" type="submit">Отправить</button>
            </div>
        </form>
        <div v-else class="success-upload">
            <h3 class="success-upload__title">Все файлы успешно загружены</h3>
            <div class="success-upload__link">{{id}}</div>
        </div>
    </div>

</template>

<script>
    import keys from '@/services/keys';
    import {required} from 'vuelidate/lib/validators'
    import AddSVG from '@/assets/img/icons/add.svg'
    import PlusSVG from '@/assets/img/icons/plus.svg'


    const validateImg = (value) => {
        if (!value) return false;
        let fileMimetype = value[0].type
        return (fileMimetype === 'image/jpeg' || fileMimetype === 'image/png')
    };

    const audioTypes = ['audio/mp4', 'audio/m4a', 'audio/x-m4a', 'audio/mpeg']
    const validateAudio = (value) => {
        if (!value) return false;
        for(let file of value) {
            if(!audioTypes.includes(file.type)) {
                return false
            }
        }
        return true
    }
    export default {
        name: 'Add-music',
        data() {
            return {
                performer: '',
                album: '',
                preview: '',
                audio: '',
                previewB64: null,
                success: false,
                id: null
            }
        },
        components: {
            AddSVG,
            PlusSVG
        },
        methods: {
             async upload(e) {
                 e.preventDefault()
                const formData = new FormData()
                formData.append('performer', this.performer)
                formData.append('album', this.album)
                for (let file of this.audio) {
                    formData.append('audio', file)
                }
                formData.append('preview', this.preview[0]);
                try {
                    const res = await fetch(`${keys.BASE_URL}/music/add`,
                        {
                            method: 'POST',
                            body: formData
                        }
                    );
                    const result = await res.json()
                    this.success = result.success
                    this.id = result.id
                } catch (e) {

                }
                
            },
            changePreview(e) {
                 this.preview = e.target.files;
                 this.$v.preview.$touch();
                 if(this.$v.preview.validateImg) {
                     const reader = new FileReader();
                     reader.readAsDataURL(e.target.files[0])
                     reader.addEventListener('load', event => {
                         this.previewB64 = reader.result
                     });
                 }

            },
            changeAudio(e) {
                 this.audio = e.target.files;
                 this.$v.audio.$touch();
            },
            openPreviewFile(e) {
                 this.$refs.inputPreview.click()
            },
            addTracks (e) {
                 this.$refs.inputTrack.click()
            }
        },
        validations: {
            performer: {
                required
            },
            album: {
                required
            },
            preview: {
                validateImg
            },
            audio: {
                validateAudio
            }
        }
    }
</script>

<style lang="scss">
    .add-music-form {
        &__title {
            text-align: center;
            font-size: 22px;
            margin-top: 0.5em;
            font-weight: 300;
        }
        &__row {
            display: flex;
            flex-direction: column;
            margin: 15px 0;
            align-items: flex-start;
        }
        &__label {
            display: inline-block;
            font-size: 16px;
            font-weight: 300;
            margin-bottom: 7px;
        }
        &__input {
            max-width: 450px;
            &--error {
                border: 1px solid var(--danger) !important;
            }
        }
        &__preview {
            width: 200px;
            height: 200px;
            border: 1px solid var(--brown-grey);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0px 2px 15px -1px rgba(0,0,0,0.1);
        }
        &__preview-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        &__plus {

            svg {
                width: 50px;
                height: 50px;
                fill: var(--main-text-color);
                transition: fill var(--transition-time);

                display: flex;
                justify-content: center;
                align-items: center;
            }
            &:hover, &:focus {
                svg {
                    fill: var(--hover-color);
                }
            }
        }
        &__input-preview {
            display: none;
        }
        &__add-tracks {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 300;
            border: 1px solid var(--brown-grey);
            padding: 5px 10px;
            cursor: pointer;
            max-width: 200px;
            width: 100%;
            color: var(--main-text-color);
            svg {
                width: 18px;
                fill: var(--main-text-color);
                margin-right: 8px;
            }
        }
        &__input-tracks {
            display: none;
        }
        &__error {
            color: var(--danger);
            font-size: 12px;
            display: inline-block;
            margin-top: 4px;
        }
    }
    .file-list {
        margin: 15px 0 0;
        padding: 0;
        list-style: none;
        &__name {
            margin: 0;
            font-weight: 300;
        }
    }
    .success-upload {
        &__title {
            text-align: center;
            font-size: 24px;
            font-weight: 300;
        }
    }
</style>