<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	background-color: #212121;
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}

html {
	background-color: #212121;
	color: whitesmoke;
}
p {
	color: whitesmoke;
}

h4 {
	color: whitesmoke;
}

h5 {
	color: whitesmoke;
}

</style>
