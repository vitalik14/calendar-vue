<template>
	<header class="header">
		<div class="grid left">
			<button @click="showFormHeader">Добавить</button>
			<a class="update" href="/" target="self">Обновить</a>
			<FormHeader :dataToForm="dataToForm" />
		</div>
		<div class="grid"></div>
		<div class="grid right">
			<Search />
		</div>
	</header>
</template>

<script>
import Search from './Search.vue';
import FormHeader from './FormHeader.vue';
import {EventBus} from "../main.js";
export default {
	name: 'Header',
	data() {
		return {
			dataToForm: {}
		}
	},
	components: {
		Search,
		FormHeader
	},
	methods: {
		showFormHeader(e, day) {
			let target = e.currentTarget;

			EventBus.$emit('closeSearch');
			EventBus.$emit('closeCalendarForm');

			this.dataToForm = {
				clientY: target.offsetTop + 35,
				clientX: target.offsetLeft,
				visible: true
			};
		}
	}
}
</script>
<style scoped lang="scss">
	@import '../assets/css/_vars.scss';

	.header {
		background: #f4f4f4;
		width: 100%;
		display: inline-grid;
		grid-template-columns: auto auto auto;
		height: 91px;
		box-shadow: 0px 2px 2px #ccc;
		text-align: center;
		.grid {
			display: flex;
			align-items: flex-end;
		}
		.grid.left {
			justify-content: flex-start;
			margin: 0 0 5% 10%;
			position: relative;
			z-index: 100;
			button, .update {
				background: #006FCA;
				width: 71px;
				height: 22px;
				border: none;
				border-radius: 2px;
				font-size: 12px;
				color: $color1;
				cursor: pointer;
				margin:0 5px;
				box-shadow: 0 0 1px solid #006FCA;
				text-shadow: 1px 2px 2px #444;
				user-select: none;
				text-decoration: none;
				line-height: 1.9;
                padding: 0;
			}
		}
		.grid.right {
			justify-content: flex-end;
			margin: 0 10% 5% 0;
		}
	}
</style>
