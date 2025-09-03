<template>
	<div class="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10">
		<h1 class="text-3xl font-bold mb-6">
			Профориентационный тест по методике Голланда
		</h1>

		<div
			v-if="loading"
			class="text-center py-10">
			Загрузка теста...
		</div>

		<div
			v-else-if="error"
			class="text-red-600 text-center py-10">
			Ошибка загрузки теста: {{ error }}
		</div>

		<div
			v-else-if="!currentTest"
			class="text-center py-10">
			Тест не найден.
		</div>

		<div v-else>
			<div
				v-if="!showResult"
				class="mb-6">
				<h2 class="text-xl font-semibold mb-2">
					{{ currentQuestion.question }}
				</h2>

				<div class="space-y-3">
					<label
						v-for="(option, index) in currentQuestion.options"
						:key="index"
						class="flex items-center space-x-3 cursor-pointer">
						<input
							type="radio"
							:name="'question-' + currentQuestionIndex"
							:value="index"
							v-model="answers[currentQuestionIndex]"
							class="form-radio" />
						<span>{{ option.text }}</span>
					</label>
				</div>

				<div class="flex justify-between mt-6">
					<button
						class="btn-outline"
						:disabled="currentQuestionIndex === 0"
						@click="prevQuestion">
						Назад
					</button>

					<button
						class="btn-primary"
						:disabled="answers[currentQuestionIndex] === undefined"
						@click="nextOrSubmit">
						{{ isLastQuestion ? "Завершить" : "Далее" }}
					</button>
				</div>
			</div>

			<div
				v-else
				class="mt-10 p-6 bg-green-100 rounded">
				<h2 class="text-2xl font-bold mb-4">Результаты теста</h2>
				<p><strong>Ваш тип:</strong> {{ testResult.dominantCategory }}</p>
				<p><strong>Описание:</strong> {{ testResult.description }}</p>
				<p><strong>Рекомендуемые профессии:</strong></p>
				<ul class="list-disc ml-6">
					<li
						v-for="(prof, idx) in testResult.recommendations"
						:key="idx">
						{{ prof }}
					</li>
				</ul>
				<button
					class="btn-primary mt-6"
					@click="restartTest">
					Пройти тест заново
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"

// Реальный тест по методике Голланда (упрощённый)
const hollandTest = {
	_id: "holland-test-001",
	name: "Профориентационный тест по методике Голланда",
	description:
		"Выберите из каждой пары ту деятельность, которая вам больше нравится.",
	questions: [
		{
			question: "Что вам больше нравится?",
			options: [
				{ text: "Работать с людьми", value: 1, category: "Social" },
				{
					text: "Работать с инструментами и машинами",
					value: 1,
					category: "Realistic",
				},
			],
		},
		{
			question: "Что вам ближе?",
			options: [
				{
					text: "Решать логические задачи",
					value: 1,
					category: "Investigative",
				},
				{ text: "Творчески выражать себя", value: 1, category: "Artistic" },
			],
		},
		{
			question: "Что предпочитаете?",
			options: [
				{
					text: "Организовывать и управлять",
					value: 1,
					category: "Enterprising",
				},
				{
					text: "Следовать установленным правилам",
					value: 1,
					category: "Conventional",
				},
			],
		},
		{
			question: "Что для вас важнее?",
			options: [
				{ text: "Помогать другим", value: 1, category: "Social" },
				{
					text: "Работать на открытом воздухе",
					value: 1,
					category: "Realistic",
				},
			],
		},
		{
			question: "Что вам больше по душе?",
			options: [
				{
					text: "Изучать природу и науку",
					value: 1,
					category: "Investigative",
				},
				{
					text: "Создавать произведения искусства",
					value: 1,
					category: "Artistic",
				},
			],
		},
	],
	scoring: {
		categories: [
			{
				name: "Realistic",
				description: "Практичный, любит работать с инструментами и техникой",
			},
			{
				name: "Investigative",
				description: "Любит анализировать, решать научные задачи",
			},
			{
				name: "Artistic",
				description: "Творческий, любит выражать себя через искусство",
			},
			{
				name: "Social",
				description: "Общительный, любит помогать и работать с людьми",
			},
			{
				name: "Enterprising",
				description: "Лидер, любит управлять и убеждать",
			},
			{
				name: "Conventional",
				description: "Организованный, любит порядок и работу с данными",
			},
		],
	},
	resultsMapping: {
		Realistic: ["Инженер", "Техник", "Механик", "Строитель"],
		Investigative: ["Учёный", "Программист", "Аналитик", "Врач"],
		Artistic: ["Дизайнер", "Артист", "Писатель", "Фотограф"],
		Social: ["Педагог", "Психолог", "Социальный работник", "Медсестра"],
		Enterprising: ["Менеджер", "Предприниматель", "Юрист", "Политик"],
		Conventional: [
			"Бухгалтер",
			"Офис-менеджер",
			"Администратор",
			"Библиотекарь",
		],
	},
}

const loading = ref(false)
const error = ref(null)
const currentQuestionIndex = ref(0)
const answers = ref([])
const showResult = ref(false)
const testResult = ref(null)

const currentTest = ref(null)

const currentQuestion = computed(() => {
	return currentTest.value?.questions?.[currentQuestionIndex.value] || null
})

const isLastQuestion = computed(() => {
	return (
		currentQuestionIndex.value ===
		(currentTest.value?.questions?.length || 0) - 1
	)
})

function calculateResult(answers, test) {
	const scores = {}
	test.scoring.categories.forEach(cat => {
		scores[cat.name] = 0
	})

	answers.forEach((answerIndex, questionIndex) => {
		const option = test.questions[questionIndex].options[answerIndex]
		if (option && option.category) {
			scores[option.category] += option.value
		}
	})

	const maxCategory = Object.entries(scores).reduce(
		(max, curr) => {
			return curr[1] > max[1] ? curr : max
		},
		["", 0]
	)[0]

	return {
		dominantCategory: maxCategory,
		description:
			test.scoring.categories.find(c => c.name === maxCategory)?.description ||
			"",
		recommendations: test.resultsMapping[maxCategory] || [],
	}
}

const loadTest = () => {
	loading.value = true
	error.value = null
	try {
		// В данном примере тест статический
		currentTest.value = hollandTest
	} catch (e) {
		error.value = e.message || "Ошибка загрузки теста"
	} finally {
		loading.value = false
	}
}

const nextOrSubmit = () => {
	if (answers.value[currentQuestionIndex.value] === undefined) return
	if (isLastQuestion.value) {
		submitTest()
	} else {
		currentQuestionIndex.value++
	}
}

const prevQuestion = () => {
	if (currentQuestionIndex.value > 0) {
		currentQuestionIndex.value--
	}
}

const submitTest = () => {
	loading.value = true
	try {
		testResult.value = calculateResult(answers.value, currentTest.value)
		showResult.value = true
	} catch (e) {
		error.value = e.message || "Ошибка подсчёта результатов"
	} finally {
		loading.value = false
	}
}

const restartTest = () => {
	currentQuestionIndex.value = 0
	answers.value = []
	showResult.value = false
	testResult.value = null
}

onMounted(() => {
	loadTest()
})
</script>

<style scoped>
.btn-primary {
	background-color: #3b82f6;
	color: white;
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	font-weight: 600;
	cursor: pointer;
}
.btn-primary:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}
.btn-outline {
	background-color: transparent;
	border: 2px solid #3b82f6;
	color: #3b82f6;
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	font-weight: 600;
	cursor: pointer;
}
.btn-outline:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}
.form-radio {
	accent-color: #3b82f6;
	cursor: pointer;
	width: 1.25rem;
	height: 1.25rem;
}
</style>
