<template>
	<div class="min-h-screen bg-gray-50">
		<Header />
		<main>
			<slot />
		</main>
		<Footer />
	</div>
</template>

<script setup>
import Header from "../components/Layout/Header.vue"
import Footer from "~/components/Layout/Footer.vue"
import { useAuthStore } from "~/stores/auth"
import { onMounted } from "vue"

const authStore = useAuthStore()

onMounted(() => {
	authStore.initializeAuth()
})
</script>
