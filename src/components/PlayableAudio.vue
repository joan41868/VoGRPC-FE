<template>
	<span >
		<b-button variant="outline-primary" size="md" class="audio-msg-container" @click="playAudio"><b-icon icon="play"></b-icon></b-button>
	</span>
</template>

<script>
export default {
	name: "PlayableAudio",
	props: {
		audioUrl : "",
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
.audio-msg-container {
	margin-top: 3px;
	margin-bottom: 3px;
	margin-left: 3px;
	margin-right: 3px;
	padding: 3px 3px 3px 3px;
}
</style>
