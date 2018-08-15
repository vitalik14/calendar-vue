<template>
	<div class="search">
        <label for="search"></label>
        <div class="search-select">
           <input id="search" @input="searchEvent" @focus="closeForms" v-model="search" value="" type=text placeholder="События, дата или участник" />
           <div v-show="btnClearText" @click="clearText" class="clear-text">x</div>
           <div class="select" v-show="visible">
                <ul class="list">
                    <li @click="goToEvent($event)" v-for="(item,index) in items" :key="index" :data-date="[item.date[0],item.date[1],item.date[2]]">
                        <div class="title">{{item.title}}</div>
                        <div class="date">{{item.date[2]}} {{$store.getters.getMounthName(item.date[1])}}</div>
                    </li>
                </ul>
            </div>
        </div>
	</div>
</template>

<script>
import {EventBus} from "../main.js"
export default {
    name: 'Search',
    data() {
        return {
            search: '',
            items: [],
            visible: false,
            btnClearText: false
        }
    },
    created() {
        EventBus.$on('closeSearch', (data) => {
			this.clearText();
		});
    },
    methods: {
        searchEvent(e) {
            let items = this.$store.getters.searchEvent(this.search);

            this.btnClearText = this.search?1:0;
            
            if (!items.length) {
                this.visible = false;
            } else {
                this.visible = true;
                this.items = items;
            }
        },
        goToEvent(e) {
            let arrDate = e.currentTarget.dataset.date.split(',');

            this.$store.dispatch('targetDate', arrDate).then(() => {
                EventBus.$emit('buildCalendar');
            });
            this.clearText();
        },
        clearText() {
            this.search = '';
            this.items = [];
            this.visible = this.btnClearText = false;
        },
        closeForms() {
            EventBus.$emit('closeHeaderForm');
            EventBus.$emit('closeCalendarForm');
        }

    }
}
</script>
<style scoped lang="scss">
    @import '../assets/css/_vars.scss';
    .search {
        width:100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        label {
            display: inline-block;
            background: url('../assets/img/search.png') no-repeat center center;
            background-size: contain;
            width: 13px;
            height: 12px;
            margin: 0px 7px 0 0;
        }
        .search-select {
            position: relative;
            z-index: 1001;
            input {
                height: 22px;
                border: none;
                max-width: 180px;
                width: 100%;
                box-shadow: inset 0 0 2px $color2; 
                border-radius: 3px;
                padding: 5px 15px 5px 5px;
                font-size: 12px;
            }
            .clear-text {
                position:absolute;
                z-index: 10;
                line-height: 1.4;
                top: 4px;
                right: 2px;
                font-size: 12px;
                width: 14px;
                height: 18px;
                cursor: pointer;
            }
             .select {
                box-shadow: 0 0 18px $color2;
                position: absolute;
                top: 40px;
                left: 0;
                padding: 5px 6px 5px;
                background: $color1;
                border-radius: 2px;
                min-width: 190px;
                .list {
                    margin: 0;
                    padding: 5px 6px 5px;
                    width:100%;
                    list-style-type: none;
                    text-align: left;
                    background-color: $color1;
                    max-height: 332px;
                    overflow-y: auto;
                    &:after {
                        content: '';
                        width: 0;
                        height: 0;
                        margin: 0;
                        border: 12px solid; 
                        border-color: transparent transparent $color1 transparent;
                        position: absolute;
                        top: -24px;
                        left: 16px;
                    }
                    &::-webkit-scrollbar {
                        width: 7px !important;
                    }
                    &::-webkit-scrollbar-track {
                        background: $color1; 
                    }
                    &::-webkit-scrollbar-thumb {
                        background: #7A7A7A;
                        border-radius:5px
                    }
                    &::-webkit-scrollbar-thumb:hover {
                        background: #555; 
                    }
                    li {
                        width: 100%;
                        font-size: 12px;
                        border-top: 1px solid #ddd;
                        padding: 5px 5px;
                        cursor: pointer;
                        overflow: hidden;
                        &:first-child {
                            border: none;
                        }
                        &:hover { 
                            background: #199FFF;
                            .title {
                                color: $color1;
                                &:after {
                                    background: linear-gradient(to right, transparent ,transparent, #199FFF); 
                                }
                            }
                            .date { 
                                color: $color1;
                            }
                        }
                        .title {
                            font-weight: bold;
                            font-size: 11px;
                            line-height: 1.6;
                            white-space: nowrap;
                            overflow: hidden;
                            position: relative;
                            color: #666;
                            &:after {
                                content:'';
                                width: 100%;
                                height: 100%;
                                position: absolute;
                                left: 0;
                                right: 0;
                                background:  linear-gradient(to right, transparent ,transparent, $color1);
                            }
                        }
                        .date {
                            font-size: 9px;
                            color: $color3
                        }
                    }
                }
            }
        }
    }
</style>