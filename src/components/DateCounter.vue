<template>
	<div class="header-calendar">
        <div class="counter">
            <button class="arrow-left" @click="latestMounth()">&#9668;</button>
            <div class="title-mounth"> {{this.$store.getters.getMounthName()}} {{this.$store.getters.getCurrentYear}}</div>
            <button class="arrow-left" @click="nextMounth()">&#9658;</button>
            <button :data-date="getCurrentData" class="today" @click="currentDate($event)">Сегодня</button>
        </div>
        <div class="calendar-wrapper">
            <Calendar/>
        </div>
	</div>
    
</template>

<script>
import Calendar from './Calendar'
import {EventBus} from "../main.js"
export default {
    name: 'DateCounter',
    components: {
        Calendar
    },
    computed: {
        getCurrentData() {
            let currentData = new Date();
            return [currentData.getFullYear(), currentData.getMonth(), currentData.getDate()];
        }
    },
    methods: {
        latestMounth() {
            this.$store.dispatch('prevMounth').then((response) => {
                EventBus.$emit('buildCalendar');
            });
        },
        nextMounth() {
            this.$store.dispatch('nextMounth').then((response) => {
                EventBus.$emit('buildCalendar');
            });
        },
        currentDate(e) {
            let arrDate = e.currentTarget.dataset.date.split(',');
            this.$store.dispatch('targetDate', arrDate).then(() => {
                EventBus.$emit('buildCalendar');
            });
        }
    }
}

</script>
<style scoped lang="scss">
    @import '../assets/css/_vars.scss';
 
    .counter {
        display: flex;
        margin: 15px 0;
        padding-left: 20px;
        button {
            margin: 3px 7px;
            user-select: none;
            display: inline-block;
            background: none;
            padding: 0 2px;
            text-align: center;
            color: #666;
            border: none;
            border-radius: 3px;
            box-shadow: inset 0px 0 4px $color2;
            cursor: pointer;
        }
        .title-mounth {
            font-weight: bold;
            user-select: none;
            min-width: 120px;
        }    
        .arrow-left {
            width: 17px;
            height: 17px;
            font-size: 7px;
        }
        .today {
            font-size: 10px;
            margin: 3px 0 0  3px;
            padding: 0px 5px;
            line-height: 1;
            height: 17px;
            font-weight: bold;
        }
    }
</style>
