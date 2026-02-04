<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { useTypingStore } from '../stores/typingStore'

const store = useTypingStore()

const selectedDifficulty = ref('easy')

const DIFFICULTY_CONFIG = {
  easy: { label: '簡單', count: 50, color: 'bg-green-500' },
  medium: { label: '普通', color: 'bg-yellow-500' },
  hard: { label: '困難', color: 'bg-red-500' }
}

const difficultyOptions = [
  { value: 'easy', label: '簡單' },
  { value: 'medium', label: '普通' },
  { value: 'hard', label: '困難' }
]

const actions = {
  selectDifficulty: (level) => store.selectDifficulty(level)
}

// Initialize
onMounted(() => {
  selectedDifficulty.value = store.difficulty
})

// Watch for store changes
watchEffect(() => {
  selectedDifficulty.value = store.difficulty
})
</script>

<template>
  <div class="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-blue-500/5">
    <div class="flex items-center gap-2 mb-6">
      <div class="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      </div>
      <h2 class="text-xl font-bold text-slate-800">難度選擇</h2>
    </div>

    <div class="space-y-3">
      <button
        v-for="option in difficultyOptions"
        :key="option.value"
        @click="actions.selectDifficulty(option.value)"
        class="w-full p-5 rounded-xl transition-all duration-200 group relative overflow-hidden"
        :class="selectedDifficulty === option.value
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 shadow-lg shadow-blue-500/10'
          : 'bg-white/80 border-2 border-transparent hover:border-blue-200 hover:bg-slate-50'
        "
      >
        <div class="flex items-center justify-between relative z-10">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-transform duration-300"
              :class="selectedDifficulty === option.value
                ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white scale-110'
                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500'
              "
            >
              {{ option.label[0] }}
            </div>
            <div>
              <div class="font-bold text-slate-800">{{ option.label }}</div>
              <div class="text-sm text-slate-500 mt-1">
                {{ DIFFICULTY_CONFIG[option.value].label }}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div
              class="w-5 h-5 rounded-full transition-transform duration-300 shadow-md"
              :class="[selectedDifficulty === option.value ? 'scale-125' : 'scale-100', DIFFICULTY_CONFIG[option.value].color]"
            ></div>
            <div v-if="selectedDifficulty === option.value" class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </button>
    </div>

    <div class="mt-6 p-5 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-100">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-slate-700 mb-1">題目說明</h3>
          <p class="text-sm text-slate-500 leading-relaxed">
            選擇難度後會自動生成對應的題目，點擊輸入框或按 <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded shadow-sm text-xs font-semibold text-slate-600">Enter</kbd> 開始打字。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>