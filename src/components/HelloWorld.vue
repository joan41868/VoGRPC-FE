<template>
	<div class="hello">
		<b-modal id="usernameSelectModal"
				 @ok="subscribe"
				 ok-variant="outline-success"
				 :title='"Chat configuration"'
				 cancel-disabled
				 body-text-variant="success"
				 body-bg-variant="dark"
				 header-bg-variant="dark"
				 footer-bg-variant="dark"
		>
			<b-input placeholder="Username" class="modal-input" v-model="username"></b-input>
			<b-input placeholder="Room ID" class="modal-input" v-model="room"></b-input>
		</b-modal>

		<div style="display: flex; flex-direction: row; justify-content: space-between; max-width: 50%; margin: auto;">
			<h4>Connected as "{{ username }}"</h4>
			<b-button variant="warning" size="sm" @click="editUsername">
				<b-icon icon="pencil"></b-icon>
			</b-button>
		</div>

		<div style="display: flex; flex-direction: column; justify-content: space-evenly; margin-top: 10px;">
			<span v-if="audioMessages.length > 0" v-for="audio of audioMessages">
				<playable-audio :audio-url="audio.audioUrl" :sender="audio.sender"></playable-audio>
			</span>
		</div>
		<div style="display: flex; flex-direction: row; justify-content: center;">
			<div class="controller">
				<b-button :variant="buttonVariant" @click="rec">
					<b-icon :icon="iconText"></b-icon>
				</b-button>
				<b-button variant="outline-danger" @click="() => audioMessages = []">
					<b-icon icon="trash"></b-icon>
				</b-button>
			</div>
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
			buttonVariant: "outline-success",
			iconText: "play",
			username: "",
			room: ""
		}
	},
	mounted() {
		this.audioMessages = [];
		if (this.username.length === 0) {
			this.$bvModal.show('usernameSelectModal');
		}
	},

	methods: {
		subscribe() {
			const username = this.username;
			const room = this.room;
			console.log(`joining with`, username);
			this.$socket.emit("subscribe", {
				roomID: room,
				sender: username
			});
		},
		editUsername() {
			this.$bvModal.show('usernameSelectModal');

		},
		async rec() {
			if (this.isRecording) {
				await this.stopRecording();
				this.buttonVariant = 'outline-success';
				this.iconText = "play";
				this.isRecording = false;
			} else {
				await this.startRecording();
				this.isRecording = true;
				this.iconText = "stop";
				this.buttonVariant = 'outline-danger';
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
				sender: this.username,
				roomID: this.room
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
			this.audioMessages.push({
				audioUrl,
				sender: vm.sender
			});
			// await new Audio(audioUrl).play();
		}
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.hello {
	margin-top: 10px;
}

.controller {
	position: fixed;
	bottom: 10px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 50%;
	margin: auto;
	/*margin: auto;*/
}
.modal-input{
	margin-top: 3px;
	margin-bottom: 3px;
}

</style>
