<template>
	<div class="hello">
		<b-button :variant="buttonVariant" @click="rec">{{ buttonText }}</b-button>
		<div style="display: flex; flex-direction: column; justify-content: space-evenly; margin-top: 10px;">
			<span v-if="audioMessages.length > 0" v-for="audio of audioMessages">
				<playable-audio :audio-url="audio"></playable-audio>
			</span>
		</div>
	</div>
</template>

<script>
import * as utils from '@/utils';
import PlayableAudio from "@/components/PlayableAudio";

export default {
	name: 'HelloWorld',
	components: {PlayableAudio},
	props: {
		msg: String,
	},
	data() {
		return {
			recorder: {},
			mediaStream: {},
			audioMessages: [],
			isRecording: false,
			buttonVariant: "success",
			buttonText: "Start"
		}
	},
	mounted() {
		this.audioMessages = [];
		this.$socket.emit("subscribe", {
			roomID: "test",
			sender: "test"
		});
	},

	methods: {
		async rec() {
			if (this.isRecording) {
				this.buttonVariant = 'success';
				this.buttonText = "Start";
				this.isRecording = false;
				await this.stopRecording();
			} else {
				this.isRecording = true;
				this.buttonText = "Stop";
				this.buttonVariant = 'danger';
				await this.startRecording();
			}
		},
		async startRecording() {
			if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
				this.mediaStream = await navigator.mediaDevices.getUserMedia(
					// constraints - only audio needed for this app
					{
						audio: true
					});
				this.recorder = new MediaRecorder(this.mediaStream);
				this.recorder.start();
				this.recorder.ondataavailable = this.onDataAvailable;
			} else {
				console.log('getUserMedia not supported on your browser!');
				this.isRecording = false;
			}
		},

		async stopRecording() {
			this.recorder.stop();
			this.mediaStream.getTracks().forEach(t => {
				t.stop();
			});
		},

		async onDataAvailable(blobEvt) {
			const text = await utils.blobToBase64(blobEvt.data);
			const vm = {
				type: 'audio/webm;codecs=opus',
				data: text,
				sender: "test",
				roomID: "test"
			};
			console.log("Send: ", vm);
			this.$socket.emit("sendVoiceMessage", vm);
		}
	},
	sockets: {
		async receiveVoiceMessage(vm) {
			console.log("Recv", vm);
			const raw = vm.data.split("base64,")[1];
			const blob = await utils.b64toBlob(raw, vm.type);
			const audioUrl = URL.createObjectURL(blob);
			this.audioMessages.push(audioUrl);
		}
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
	margin: 40px 0 0;
}

ul {
	list-style-type: none;
	padding: 0;
}

li {
	display: inline-block;
	margin: 0 10px;
}

a {
	color: #42b983;
}
</style>
