<script setup>
import { ref, watchEffect } from 'vue'
import { fetchTweets } from '@/api'
//import TweetForm from '@/components/TweetForm'
import TweetList from '@/components/TweetList'
import { useWorkspace } from '@/composables'

const tweets = ref([])
const loading = ref(true)
const { wallet } = useWorkspace()

watchEffect(() => {
    fetchTweets()
        .then(fetchedTweets => tweets.value = fetchedTweets)
        .finally(() => loading.value = false)
})

//const addTweet = tweet => tweets.value.push(tweet)
</script>

<template>
    <!-- TODO: Check connected wallet -->
    <div v-if="wallet" class="border-b px-8 py-4 bg-gray-50 break-all">
        {{ wallet.publicKey.toBase58() }}
    </div>
    <tweet-list :tweets="tweets" :loading="loading"></tweet-list>
</template>
