<script setup>
import { useRoute } from 'vue-router'
//import TheSidebar from './components/TheSidebar'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { initWallet  } from 'solana-wallets-vue'
import { initWorkspace } from '@/composables'

const route = useRoute()

const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
]

initWallet({ wallets, autoConnect: true })
initWorkspace()
</script>

<template>
    <div class="w-full max-w-3xl lg:max-w-4xl mx-auto">

        <!-- Sidebar. -->
        <!--<the-sidebar class="py-4 md:py-8 md:pl-4 md:pr-8 fixed w-20 md:w-64"></the-sidebar>-->

        <!-- Main -->
        <!--<main class="flex-1 border-r border-l ml-20 md:ml-64 min-h-screen">-->
        <main class="flex-1 border-r border-l">
            <header class="flex space-x-6 items-center justify-between px-6 py-1 border-b">
                <div class="text-xl font-bold" v-text="route.name"></div>
                <div class="">
                    <!-- <wallet-multi-button></wallet-multi-button> -->
                        <router-link v-if="true" :to="{ name: 'Profile' }" class="rounded-full hover:bg-gray-100 p-3 inline-flex items-center space-x-4" active-class="font-bold" v-slot="{ isActive }">
                            <svg v-if="isActive" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                                <path fill-rule="evenodd" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" clip-rule="evenodd" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </router-link>
                        <router-link :to="{ name: 'Home' }" class="rounded-full hover:bg-gray-100 p-3 inline-flex items-center space-x-4" active-class="font-bold" v-slot="{ isActive }">
                            <svg v-if="isActive" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </router-link>
                </div>
            </header>
            <router-view></router-view>
        </main>
    </div>
</template>
