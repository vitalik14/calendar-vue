<template>
	<div>
		<ul class="calendar">
			<li class="row" v-for="(week, i) in days" :key="i">
				<div 
					@click="clicked($event, day)"
					v-for="(day, index) of week" 
					:data-item="[day.year, day.mounth, day.data]" 
					:key="index" 
					:class="{active: day.events.title, current: getCurrentDay(day.year, day.mounth, day.data)}" 
					class="col">
					<div class="date">{{day.nameDay}} {{day.data}}</div>
					<div class="title">{{day.events.title}}</div>
					<div class="users">{{day.events.nameUsers}}</div>
				</div>
			</li>
			<FormCalendar @clear="clearClicked" :dataToForm="dataToForm"  />
		</ul>
	</div>
</template>

<script>
import FormCalendar from './FormCalendar.vue';
import {EventBus} from "../main.js";
export default {
	name: 'Calendar',
	data() {
		return {
			showForm: false,
			days: '',
			dataToForm: {}
		}
	},
	created() {
		this.buildCalendar();
		EventBus.$on('buildCalendar', (data)=> {
			this.buildCalendar();
		});
    },
	components: {
		FormCalendar
	},
	methods: {
		clicked(e, day) {
			let target = e.currentTarget;

			this.clearClicked();
			target.classList.add('clicked');
			EventBus.$emit('closeSearch');
			EventBus.$emit('closeHeaderForm');

			this.dataToForm = {
				clientY: target.offsetTop - target.clientHeight/4,
				clientX: target.offsetLeft + target.clientWidth,
				events: day.events,
				date: target.dataset.item.split(','),
				visible: true,
				edit: !!day.events.title || false
			};
		},
		clearClicked() {
			document.querySelectorAll('.calendar .col').forEach(function(e, i) {
				e.classList.remove('clicked');
			});
		},
		createCalendar() {
			let lastMounthDays, currenMounthDays, nextMounthDays, offset;
			let arrDays = [];
			let s = this.$store.getters.getState;
			
			lastMounthDays = s.dinamic.currentMounth == 0?s.static.daysInMounth.leapYear(s)[11]:s.static.daysInMounth.leapYear(s)[s.dinamic.currentMounth-1];
			currenMounthDays = s.static.daysInMounth.leapYear(s)[s.dinamic.currentMounth];
			nextMounthDays = s.dinamic.currentMounth == 11?s.static.daysInMounth.leapYear(s)[0]:s.static.daysInMounth.leapYear(s)[1 + s.dinamic.currentMounth]

			switch(new Date(s.dinamic.currentYear, s.dinamic.currentMounth, '1').getDay()) {
				case 0: offset = 6;	break;
				case 1: offset = 7;	break;
				case 2: offset = 1;	break;
				case 3: offset = 2;	break;
				case 4: offset = 3;	break;
				case 5: offset = 4;	break;
				case 6: offset = 5;	break;
				default: offset = 0; console.log('error offset');
			}

			let lastYear = s.dinamic.currentMounth === 0?s.dinamic.currentYear-1:s.dinamic.currentYear;
			let lastMounth = s.dinamic.currentMounth === 0?11:s.dinamic.currentMounth-1;

			for (let i = 0; i < offset; i++) {
				let d = ++lastMounthDays-offset;
				let ob = {
					year: lastYear,
					mounth: lastMounth,
					data: d,
					events: this._getEvent(s, lastYear, lastMounth, d)
				}
				arrDays.push(ob);
			}

			for (let i = 1; i <= currenMounthDays; i++) {
				let ob = {
					year: s.dinamic.currentYear,
					mounth: s.dinamic.currentMounth,
					data: i,
					events: this._getEvent(s, s.dinamic.currentYear, s.dinamic.currentMounth, i)
				};
				arrDays.push(ob);
			}

			let nextYear = s.dinamic.currentMounth === 11?s.dinamic.currentYear+1:s.dinamic.currentYear;
			let nextMounth = s.dinamic.currentMounth === 11?0:s.dinamic.currentMounth+1;

			for (let i = 1; arrDays.length < 42; i++) {
				let ob = {
					year: nextYear,
					mounth: nextMounth,
					data: i,
					events: this._getEvent(s, nextYear, nextMounth, i)
				}
				arrDays.push(ob);
			}

			return arrDays;
		},
		_getEvent(state, y, m, d) {
			if (!!state.dinamic.events[y] && !!state.dinamic.events[y][m] && state.dinamic.events[y][m][d]) {
				return state.dinamic.events[y][m][d];
			} else {
				let ob = {
					...state.static._defaultEvents,
					date: [y, m, d]
				};
				return state.static._defaultEvents;
			}
		},
		getCurrentDay(y, m, d) {
			let currentData = new Date();
			let date = [currentData.getFullYear(), currentData.getMonth(), currentData.getDate()];

			return (y == date[0] && m == date[1] && d == date[2])?true:false;
		},
		buildCalendar() {
			let weeks = [];
			let counter = 0;
			this.dataToForm.visible = false;
			let calendar = this.createCalendar();

			this.clearClicked();
			
            for (let i = 0; i < 6; i++) {
                let buf = [];
                for (let n = 0; n < 7; n++) {
					let day = calendar[counter];
					day.nameDay = (!i)?this.$store.getters.getNameDay[n]:'';
					buf.push(day);

                    ++counter;
                }
                weeks.push(buf);
            }
            this.days = weeks;
		}
	}
}
</script>
<style scoped lang="scss">
	@import '../assets/css/_vars.scss';

	.calendar {
		margin-top: 10px;
		position: relative;
		.row {
			height: 12vw;
			width: 100%;
			.col {
				flex: 2 0 12%;
				font-size: 12px;
				padding-top: 5px;
				padding-left: 5px;
				display: flex;
				flex-wrap: wrap;
				text-align: left;
				align-content: flex-start;
				align-items: flex-start;
				border-left: 1px solid $color4;
				border-bottom: 1px solid $color4;
				cursor: pointer;
				overflow: hidden;
				div {
					width: 100%;
					font-size: 11px;
				}
				.date {
					padding-bottom: 4px;
				}
				.title {
					font-size: 11px;
					font-weight: bold;
					margin-bottom: 4px;
					max-height: 45px;
    				overflow: hidden;
				}
				.users {
					font-weight: normal;
					font-size: 11px;
					max-height: 30px;
					overflow: hidden;
				}
			}
			.col:last-child {
				border-right: 1px solid $color4;
			}
			.current {
				background: #F4F4F4;
				.date {
					font-weight: bold;
				}
			}			
			.clicked {
				background: #E5F1F9;
				outline: 2px solid #83C6FC;
				position: relative;
				z-index: 1;
			}
			.active {
				background: #C1E4FF;
			}
			@media all and (min-width: 1000px) {
				height: 100%;
				min-height: 130px;
				background: $color1;
			}
		}
		.row:first-child {
			border-top: 1px solid $color4;
		}
	}
</style>
