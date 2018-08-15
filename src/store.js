import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const loadAndSave = store => {
	let data;
	if (localStorage['_calendar']) {
		data = JSON.parse(localStorage['_calendar']);
		store.dispatch('loadData', data);
	}
	store.subscribe((mutation, state) => {
		localStorage['_calendar'] = JSON.stringify(state.dinamic);
	})
}

export default new Vuex.Store({
	plugins: [loadAndSave],
	state: {
		static: {
			staticDate: {
				mounthsPostfix: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря' ],
				mounths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ],
				daysOfWeek: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
			},
			daysInMounth : {
				leapYear(state) {
					return [31, state.dinamic.currentYear%4?28:29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
				}
			},
			_defaultEvents: {
				title: '',
				date: '',
				nameUsers: '',
				text: ''
			}
		},
		dinamic: {
			currentMounth: 8,
			currentYear: 2018,
			events: { // sample events
				2017: {
					2: {
						24: {
							title: 'Митинг на болотной',
							date: [2017, 2, 14],
							nameUsers: 'Вася, Евгений, Виталий',
							text: 'митинг митинг'
						}
					}
				},
				2018: {
					2: {
						24: {
							title: 'Митинг на мосту',
							date: [2018, 2, 24],
							nameUsers: 'Вася, Евгений, Виталий',
							text: 'митинг митинг'
						}
					},
					0: {
						14: {
							title: 'Событие',
							date: [2018, 0, 14],
							nameUsers: 'Виталий',
							text: 'тестовый текстлвоамтваломт вамлмлщаьк'
						}
					}
				}
			}
		}
	},
	mutations: {
		LOAD_DATA(obs, data) {
			this.state.dinamic = data;
		},
		TARGET_DATE(obs, data) {
			this.state.dinamic.currentYear = data[0];
			this.state.dinamic.currentMounth = data[1];
		},
		PREV_MOUNTH(obs, data) {
			this.state.dinamic.currentMounth = data.mounth;
			this.state.dinamic.currentYear = data.year;
        },
		NEXT_MOUNTH(obs, data) {
			this.state.dinamic.currentMounth = data.mounth;
			this.state.dinamic.currentYear = data.year;
		},
		SET_EVENT(obs, data) {
			let date = data.date;

			if (this.state.dinamic.events[date[0]]) {
				if (this.state.dinamic.events[date[0]][date[1]]) {
					this.state.dinamic.events[date[0]][date[1]][date[2]] = data;
				} else {
					let d = date[2];
					this.state.dinamic.events[date[0]][date[1]] = {
						[d]: data
					}
				}
			} else {
				let [m, d] = [date[1], date[2]];
				let mounth = {
					[m]: {
						[d]: data
					}
				};
				this.state.dinamic.events[date[0]] = mounth;
			}
		},
		DELETE_EVENT(obs, data) {
			delete(this.state.dinamic.events[data[0]][data[1]][data[2]]);
		}
	},
	actions: {
		loadData({commit}, commands) {
			commit('LOAD_DATA', commands);
		},
		targetDate({ commit }, commands) {
			commit('TARGET_DATE', commands);
		},
		prevMounth ({ commit }, commands) {
			let data = {
			 	mounth: this.state.dinamic.currentMounth,
			 	year: this.state.dinamic.currentYear
			};
			if (this.state.dinamic.currentMounth === 0) {
				data.mounth = 11;
				--data.year;
			} else {
				--data.mounth;
			}
			commit('PREV_MOUNTH', data);
		},
		nextMounth({ commit }, commands) {
			let data = {
				mounth: this.state.dinamic.currentMounth,
				year: this.state.dinamic.currentYear
			};
			if (this.state.dinamic.currentMounth === 11) {
				data.mounth = 0;
				++data.year;
			} else {
				++data.mounth;
			}
			commit('NEXT_MOUNTH', data);
		},
		setEvent({commit}, commands) {
			commit('SET_EVENT', commands);
		},
		deleteEvent({commit}, commands) {
			try {
				let event = this.state.dinamic.events;
				if (event[commands[0]] && event[commands[0]][commands[1]] && event[commands[0]][commands[1]][commands[2]]) {
					commit('DELETE_EVENT', commands);
				}
			} catch(e) {
				console.log(e);
			}
		}
	},
	getters: {
		searchEvent: (state) => word => {
			let find = [];

			if (word === '' || word.length < 2) {
				return [];
			}

			for (let year in state.dinamic.events) {
				for (let mounth in state.dinamic.events[year]) {
					for (let day in state.dinamic.events[year][mounth]) {
						let item = state.dinamic.events[year][mounth][day];
						if (item.title.toLowerCase().indexOf(word) != -1) {
							find.push(item);
						}
					}
				}
			}

			return find;
		},
		getCurrentYear: state => {
			return state.dinamic.currentYear;
		},
		getMounthName: state => (mounth = state.dinamic.currentMounth) => {
			return state.static.staticDate.mounths[mounth];
		},
		getMounthNamePostfix: state => (mounth = state.dinamic.currentMounth) => {
			return state.static.staticDate.mounthsPostfix[mounth];
		},
		getNameDay: state => {
			return state.static.staticDate.daysOfWeek;
		},
		getState: state => {
			return state;
		}
	}
})
