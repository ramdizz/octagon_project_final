<template>
	<button
		:type="type"
		:disabled="disabled || loading"
		:class="buttonClasses"
		@click="handleClick">
		<div
			v-if="loading"
			class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
		<slot v-else />
	</button>
</template>

<script setup>
const props = defineProps({
	variant: {
		type: String,
		default: "primary",
		validator: value =>
			["primary", "secondary", "danger", "outline"].includes(value),
	},
	size: {
		type: String,
		default: "md",
		validator: value => ["sm", "md", "lg"].includes(value),
	},
	type: {
		type: String,
		default: "button",
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	loading: {
		type: Boolean,
		default: false,
	},
	fullWidth: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(["click"])

const buttonClasses = computed(() => {
	const baseClasses =
		"inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"

	const sizeClasses = {
		sm: "px-3 py-2 text-sm",
		md: "px-4 py-2 text-sm",
		lg: "px-6 py-3 text-base",
	}

	const variantClasses = {
		primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
		secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
		danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
		outline:
			"border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-blue-500",
	}

	const disabledClasses = "opacity-50 cursor-not-allowed"
	const fullWidthClasses = props.fullWidth ? "w-full" : ""

	return [
		baseClasses,
		sizeClasses[props.size],
		variantClasses[props.variant],
		props.disabled || props.loading ? disabledClasses : "",
		fullWidthClasses,
	].join(" ")
})

const handleClick = event => {
	if (!props.disabled && !props.loading) {
		emit("click", event)
	}
}
</script>
