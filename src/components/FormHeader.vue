<template>
    <div class="form-header" v-if="dataToForm.visible" :style="{top:(dataToForm.clientY)+'px', left:(dataToForm.clientX)+'px' }">
        <button @click="hideForm" class="btn-close">x</button>
        <form v-on:submit.prevent="setEvent">
            <div class="form-group">
                <input required type="text" class="form-control" v-model="title" placeholder="Событие">
            </div>
            <div class="form-group">
                <input required type="date" class="form-control" v-model="date">
            </div>
            <div class="group-btn">
               <button class="btn-form">Создать</button>
            </div>
        </form>
    </div>
</template>

<script>
import {EventBus} from "../main.js"
export default {
    name: 'FormHeader',
    props: ['dataToForm'],
	data() {
		return {
            title: '',
            date: ''
		}
    },
    created() {
        EventBus.$on('closeHeaderForm', (data) => {
			this.hideForm();
		});
    },
	methods: {
        setEvent(e) {
            let date = this.date.split('-').map((i) => {
                return (i * 1);
            });
            
            date[1] = date[1]-1;
            let obj = {
                title: this.title,
                date
            };
            this.$store.dispatch('setEvent', obj).then((e) => {
               EventBus.$emit('buildCalendar');
               this.hideForm();
            });
        },
        hideForm() {
            this.dataToForm.visible = false;
            this.title = this.date =  '';
            EventBus.$emit('closeSearch');
            this.$emit('clear');
        }
	}
}
</script>
<style scoped lang="scss">
    @import '../assets/css/_vars.scss';
   
    .form-header {
        position: absolute;
        z-index: 1000;
        background: $color1;
        box-shadow: 0 0 18px $color2;
        top: 20%;
        left: 30%;
        width: 300px;
        padding: 20px;
        border-radius: 2px;
        &::after {
            content: '';
            width: 0;
            height: 0;
            margin: 0 auto;
            border: 12px solid; 
            border-color: transparent transparent $color1  transparent;
            position: absolute;
            top: -22px;
            left: 15px;
        }
        .btn-close {
            background: none;
            border: none;
            cursor: pointer;
            position: absolute;
            top: 3px;
            right: 5px;
            font-size: 12px;
            user-select: none;
            outline: none;
        }
        .form-group {
            margin: 0 0 6px;
        }
         .group-btn {
            display: flex;
            margin-top: 15px;
            .btn-form {
                @extend %btn-form;
            }
        } 
        input[type=text], input[type=date]  {
            font-size: 12px;
            height: 25px;
            line-height: 1;
            border-radius: 2px;
            box-shadow: inset 0px 1px 2px $color3;
            margin: 0;
        }
    }   
</style>