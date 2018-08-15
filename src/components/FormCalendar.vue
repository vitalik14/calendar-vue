<template>
    <div class="form-calendar" v-if="dataToForm.visible" :style="{top:(dataToForm.clientY)+'px', left:(dataToForm.clientX)+'px' }">
        <button @click="hideForm" class="btn-close">x</button>
        <form v-on:submit.prevent="setEvent">
            <div v-if="!dataToForm.edit">
                <div class="form-group">
                    <input required type="text" class="form-control" v-model="title" placeholder="Событие">
                </div>
                <div class="form-group"> 
                    <input  type="date" class="form-control input-date" v-model="date" placeholder="Событие">
                </div>
                <div class="form-group">
                    <input type="text"  class="form-control" v-model="nameUsers"  placeholder="Имена участников">
                </div> 
                <div class="form-group indent">
                    <textarea class="form-control" v-model="text" rows="3" placeholder="Описание"></textarea>
                </div>
            </div>
            <div v-else>
                <div class="form-group">
                    <div class="info title">{{dataToForm.events.title}}</div>
                </div>
                <div class="form-group">
                    <div class="info date">{{dataToForm.events.date[2]}} {{$store.getters.getMounthNamePostfix(dataToForm.events.date[1])}}</div>
                </div>
                <div class="form-group">
                    <div class="label">Участники:</div>
                    <div class="info users">{{dataToForm.events.nameUsers}}</div>
                </div>
                <div class="form-group indent">
                    <textarea class="form-control" v-model="dataToForm.events.text" rows="3" placeholder="Описание"></textarea>
                </div>
            </div>
            <div class="group-btn">
               <button class="btn-form">Готово</button>
               <button @click.prevent="deleteEvent" class="btn-form">Удалить</button>
            </div>
        </form>
    </div>
</template>
<script>
import {EventBus} from "../main.js"
export default {
    name: 'FormCalendar',
    props: ['dataToForm'],
	data() {
		return {
            title: '',
            date: '',
            nameUsers: '',
            text: ''
		}
    },
    created() {
        EventBus.$on('closeCalendarForm', (data) => {
			this.hideForm();
		});
    },
	methods: {
        setEvent(e) {
            let date;

            if (this.date) {
                date = this.date.split('-').map((i) => {
                    return (i * 1);
                });
                date[1] = date[1]-1;
            } else {
                date = this.dataToForm.date;
            }
            
            let obj = {
                title: this.title || this.dataToForm.events.title,
                nameUsers: this.nameUsers || this.dataToForm.events.nameUsers,
                text: this.text || this.dataToForm.events.text,
                date
            };
            this.$store.dispatch('setEvent', obj).then((e) => {
               EventBus.$emit('buildCalendar');
               this.hideForm();
            });
        },
        deleteEvent() {
             this.$store.dispatch('deleteEvent', this.dataToForm.date).then((e) => {
                EventBus.$emit('buildCalendar');
                this.hideForm();
            });
        },
        hideForm() {
            this.dataToForm.visible = false;
            this.title = this.nameUsers = this.text = this.date = '';
            EventBus.$emit('closeSearch');
            this.$emit('clear');
        }
	}
}
</script>
<style scoped lang="scss">
    @import '../assets/css/_vars.scss';
   
    .form-calendar {
        position: absolute;
        z-index: 1000;
        background: $color1;
        box-shadow: 0 0 18px $color2;
        top: 20%;
        left: 30%;
        width: 300px;
        padding: 22px;
        border-radius: 2px;
        &::after {
            content: '';
            width: 0;
            height: 0;
            margin: 50px auto;
            border: 12px solid; 
            border-color: transparent $color1 transparent transparent;
            position: absolute;
            top: 0;
            left: -24px;
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
            .info {
                font-size: 12px;
                text-align: left;
                overflow: hidden;
            }
            .title {
                font-size: 16px;
                font-weight: bold;
                margin-bottom:12px;
                overflow: hidden;
            }
            .date {
                font-weight: bold;
            }
            .users {
                font-weight: bold;
                 overflow: hidden;
            }
            .label {
                font-size: 10px;
                text-align: left;
            }
        }
        .indent {
            margin-top: 35px;
        }
        textarea {
            min-height: 100px;
        }
        .group-btn {
            display: flex;
            margin-top: 25px;
            .btn-form {
                @extend %btn-form;
            }
        } 
        input[type=text], textarea, .input-date {
            font-size: 12px;
            height: 28px;
            line-height: 1;
            border-radius: 2px;
            box-shadow: inset 0px 0 3px $color2;
            margin: 0;
        }
    }   
</style>