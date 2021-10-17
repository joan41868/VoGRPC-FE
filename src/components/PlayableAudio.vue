<template>
	<span class="audio-container">
		<h5>{{sender}}:</h5>
		<b-button variant="outline-success" size="md" class="audio-msg-button" @click="playAudio"><b-icon icon="play"></b-icon></b-button>
	</span>
</template>

<script>
export default {
	name: "PlayableAudio",
	props: {
		audioUrl : "",
		sender: ""
	},
	methods: {
		async playAudio() {
			const audio = new Audio(this.audioUrl);
			await audio.play();
		}
	}
}
</script>

<style scoped>
.audio-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	max-width: 25%;
	margin: auto;
	border: 1px solid whitesmoke;
	margin-top: 3px;
	margin-bottom: 3px;
	padding: 5px 5px 5px 5px;
	border-radius: 9px;
}
.audio-msg-button {
	padding: 3px 3px 3px 3px;
}
</style>
