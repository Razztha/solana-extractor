<script setup>
import { computed, ref, toRefs } from 'vue'
import { useAutoresizeTextarea, useCountCharacterLimit, useSlug } from '@/composables'
import { sendTweet } from '@/api'
import { useWallet } from 'solana-wallets-vue'

// Props.
const props = defineProps({
    forcedTopic: String,
})
const { forcedTopic } = toRefs(props)

// Form data.
const content = ref('')
const topic = ref('')
const slugTopic = useSlug(topic)
const effectiveTopic = computed(() => forcedTopic.value ?? slugTopic.value)

// Auto-resize the content's textarea.
const textarea = ref()
useAutoresizeTextarea(textarea)

// Character limit / count-down.
const characterLimit = useCountCharacterLimit(content, 280)
const characterLimitColour = computed(() => {
    if (characterLimit.value < 0) return 'text-red-500'
    if (characterLimit.value <= 10) return 'text-yellow-500'
    return 'text-gray-400'
})

// Permissions.
const { connected } = useWallet()
const canRecord = computed(() => connected)
const canTweet = computed(() => content.value && characterLimit.value > 0)
const canSave = computed(() => parts.length > 0)

// Actions.
const emit = defineEmits(['added'])
const send = async () => {
    if (! canTweet.value) return
    const tweet = await sendTweet(effectiveTopic.value, content.value)
    emit('added', tweet)
    topic.value = ''
    content.value = ''
}

const saveMetadata = async () => {
    if (! canSave.value) return
    const tweet = await sendTweet(effectiveTopic.value, "works")
    emit('added', tweet)
    topic.value = ''
    content.value = ''
}

const parts = [];
let mediaRecorder = null;
const recordbtnClick = async () => {
    navigator.mediaDevices.getUserMedia({audio: true, video: true})
    .then(stream => {
    document.getElementById("video").srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(1000);
        mediaRecorder.ondataavailable = function(e){
            parts.push(e.data);
        }
    });
}

const stopbtnClick = async () => {
    mediaRecorder.stop();
    console.log(parts);
    console.log(parts.length);
    const blob = new Blob(parts, {
        type: "video/mp4"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "diplay:none";
    a.href = url;
    document.getElementById("video").src = '';
    //a.download = "test.mp4";
    //a.click();
}

</script>

<template>
    <div v-if="connected" class="px-8 py-4 border-b">
        <div style="border: 1px solid red; min-height:400px;" class="mb-5">
            <video muted id="video" autoplay></video>
        </div>
        <button id="recordbtn" @click="recordbtnClick" class="text-white px-4 py-2 mr-2 rounded-full font-semibold bg-pink-500" :disabled="! canRecord"
                    :class="canRecord ? 'bg-pink-500' : 'bg-pink-300 cursor-not-allowed'">
            Start recording
        </button>
        <button id="stopbtn" @click="stopbtnClick" class="text-white px-4 py-2 rounded-full font-semibold bg-pink-500 mr-2" :disabled="! canRecord"
                    :class="canRecord ? 'bg-pink-500' : 'bg-pink-300 cursor-not-allowed'">
            Stop recording
        </button>
        <button id="savebtn" class="text-white px-4 py-2 rounded-full font-semibold bg-pink-500 mr-2" :disabled="! canRecord && !canSave"
                    :class="canRecord ? 'bg-pink-500' : 'bg-pink-300 cursor-not-allowed'" @click="saveMetadata">
            Save to Blockchain
        </button>
        <!-- Content field. -->
        <textarea
            ref="textarea"
            rows="1"
            class="text-xl w-full focus:outline-none resize-none mb-3 hidden"
            placeholder="What's happening?"
            v-model="content"
        ></textarea>

        <div class="flex flex-wrap items-center justify-between -m-2 hidden">

            <!-- Topic field. -->
            <div class="relative m-2 mr-4">
                <input
                    type="text"
                    placeholder="topic"
                    class="text-pink-500 rounded-full pl-10 pr-4 py-2 bg-gray-100"
                    :value="effectiveTopic"
                    :disabled="forcedTopic"
                    @input="topic = $event.target.value"
                >
                <div class="absolute left-0 inset-y-0 flex pl-3 pr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 m-auto" :class="effectiveTopic ? 'text-pink-500' : 'text-gray-400'" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
            <div class="flex items-center space-x-6 m-2 ml-auto">

                <!-- Character limit. -->
                <div :class="characterLimitColour">
                    {{ characterLimit }} left
                </div>

                <!-- Tweet button. -->
                <button
                    class="text-white px-4 py-2 rounded-full font-semibold" :disabled="! canTweet"
                    :class="canTweet ? 'bg-pink-500' : 'bg-pink-300 cursor-not-allowed'"
                    @click="send"
                >
                    Tweet
                </button>
            </div>
        </div>
    </div>

    <div v-else class="px-8 py-4 bg-gray-50 text-gray-500 text-center border-b">
        Connect your wallet to start recording...
    </div>
</template>
