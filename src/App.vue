<template>
	<div id="app">
		<Header />
		<DateCounter/>
	</div>
</template>

<script>
	import Header from './components/Header.vue'
	import DateCounter from './components/DateCounter.vue'
	import css from './assets/css/global.scss';
	export default {
		name: 'app',
		components: {
			Header,
			DateCounter
		}
	}
</script>

<style lang="scss">
#app {
	font-family: Helvetica, Arial, sans-serif;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
	max-width:1000px;
	margin: auto;
}
</style>