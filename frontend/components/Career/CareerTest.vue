<template>
	<div class="max-w-4xl mx-auto p-6">
		<div
			v-if="currentTest && !showResult"
			class="bg-white rounded-lg shadow-lg p-6">
			<div class="mb-6">
				<h1 class="text-2xl font-bold text-gray-900 mb-2">
					{{ currentTest.name }}
				</h1>
				<p class="text-gray-600">{{ currentTest.description }}</p>

				<div class="mt-4 bg-gray-200 rounded-full h-2">
					<div
						class="bg-blue-600 h-2 rounded-full transition-all duration-300"
						:style="{ width: `${progress}%` }"></div>
				</div>
				<p class="text-sm text-gray-500 mt-1">
					Вопрос {{ currentQuestionIndex + 1 }} из
					{{ currentTest.questions.length }}
				</p>
			</div>

			<div class="mb-8">
				<h2 class="text-xl font-semibold mb-4">
					{{ currentQuestion.question }}
				</h2>

				<div class="space-y-3">
					<div
						v-for="(option, index) in currentQuestion.options"
						:key="index"
						class="flex items-center">
						<input
							:id="`option-${index}`"
							v-model="currentAnswer"
							:value="index"
							type="radio"
							:name="`question-${currentQuestionIndex}`"
							class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
						<label
							:for="`option-${index}`"
							class="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
							{{ option.text }}
						</label>
					</div>
				</div>
			</div>

			<div class="flex justify-between">
				<BaseButton
					v-if="currentQuestionIndex > 0"
					variant="outline"
					@click="previousQuestion">
					Назад
				</BaseButton>
				<div v-else></div>

				<BaseButton
					:disabled="currentAnswer === null"
					@click="nextQuestion">
					{{ isLastQuestion ? "Завершить тест" : "Далее" }}
				</BaseButton>
			</div>
		</div>

		<TestResult
			v-else-if="showResult"
			:result="testResult"
			@restart="restartTest" />
	</div>
</template>

<script setup>
const props = defineProps({
	testId: {
		type: String,
		required: true,
	},
})

const careerStore = useCareerStore()
const authStore = useAuthStore()

const currentTest = ref(null)
const currentQuestionIndex = ref(0)
const currentAnswer = ref(null)
const answers = ref([])
const showResult = ref(false)
const testResult = ref(null)

const currentQuestion = computed(() => {
	return currentTest.value?.questions[currentQuestionIndex.value]
})

const isLastQuestion = computed(() => {
	return currentQuestionIndex.value === currentTest.value?.questions.length - 1
})

const progress = computed(() => {
	if (!currentTest.value) return 0
	return (
		((currentQuestionIndex.value + 1) / currentTest.value.questions.length) *
		100
	)
})

const nextQuestion = async () => {
	if (currentAnswer.value === null) return

	answers.value[currentQuestionIndex.value] = currentAnswer.value

	if (isLastQuestion.value) {
		await submitTest()
	} else {
		currentQuestionIndex.value++
		currentAnswer.value = answers.value[currentQuestionIndex.value] || null
	}
}

const previousQuestion = () => {
	if (currentQuestionIndex.value > 0) {
		currentQuestionIndex.value--
		currentAnswer.value = answers.value[currentQuestionIndex.value] || null
	}
}

const submitTest = async () => {
	const result = await careerStore.submitTestResult(props.testId, answers.value)

	if (result.success) {
		testResult.value = result.data
		showResult.value = true
	}
}

const restartTest = () => {
	currentQuestionIndex.value = 0
	currentAnswer.value = null
	answers.value = []
	showResult.value = false
	testResult.value = null
}

onMounted(async () => {
	const result = await careerStore.fetchTestById(props.testId)
	if (result.success) {
		currentTest.value = careerStore.currentTest
	}
})
</script>
