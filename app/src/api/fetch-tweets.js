import { useWorkspace } from '@/composables'
import { Tweet } from '@/models'
export const fetchTweets = async () => {
    // return [
    //     {
    //         topic: 'solana',
    //         content: 'gm',
    //         author_display: 'B1Af..wtRN',
    //         created_at: 'Nov 26, 2021 1:03PM',
    //         created_ago: 'just now',
    //         timestamp: 1637932864,
    //     },
    //     {
    //         topic: 'no-code',
    //         content: 'Octohook.com is awesome!',
    //         author_display: 'BnE7..NRGF',
    //         created_at: 'Nov 26, 2021 1:03PM',
    //         created_ago: '2 hours ago',
    //         timestamp: 1637932864,
    //     },
    //     {
    //         topic: '',
    //         content: 'Just setting up my Solana twttr',
    //         author_display: 'B1Af..wtRN',
    //         created_at: 'Nov 26, 2021 1:03PM',
    //         created_ago: '2 days ago',
    //         timestamp: 1637932864,
    //     },
    // ]

    const { program } = useWorkspace()
    const tweets = await program.value.account.metadata.all();
    var data = tweets.map(tweet => new Tweet(tweet.publicKey, tweet.account))
    return data;
}
