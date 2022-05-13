<script setup>
import { ref } from 'vue'
import { fetchTweets } from '@/api'
//import TweetForm from '@/components/TweetForm'
import RecordPage from '@/components/RecordPage'
//import TweetList from '@/components/TweetList'

const tweets = ref([])
const loading = ref(true)
fetchTweets()
    .then(fetchedTweets => tweets.value = fetchedTweets)
    .finally(() => loading.value = false)

const addTweet = tweet => tweets.value.push(tweet)
</script>

<template>
    <record-page @added="addTweet"></record-page>
    <!--<tweet-list :tweets="tweets" :loading="loading"></tweet-list>-->
</template>
