<script setup>
import { ref, computed, onMounted } from 'vue'
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
  <div class="bg-zinc-800/50 backdrop-blur rounded-2xl p-6 border border-zinc-700/50">
    <h2 class="text-xl font-semibold mb-4 text-white">難度選擇</h2>

    <div class="space-y-3">
      <button
        v-for="option in difficultyOptions"
        :key="option.value"
        @click="actions.selectDifficulty(option.value)"
        class="w-full p-4 rounded-xl transition-all duration-200 group relative overflow-hidden"
        :class="selectedDifficulty === option.value
          ? 'bg-blue-500/20 border-2 border-blue-500'
          : 'bg-zinc-900/30 border-2 border-transparent hover:bg-zinc-900/50'
        "
      >
        <div class="flex items-center justify-between relative z-10">
          <div>
            <div class="font-medium text-white">{{ option.label }}</div>
            <div class="text-sm text-zinc-500 mt-1">
              {{ DIFFICULTY_CONFIG[option.value].label }}
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div
              class="w-3 h-3 rounded-full transition-transform duration-300"
              :class="[selectedDifficulty === option.value ? 'scale-125' : 'scale-100', DIFFICULTY_CONFIG[option.value].color]"
            ></div>
          </div>
        </div>
      </button>
    </div>

    <div class="mt-6 p-4 bg-zinc-900/30 rounded-xl">
      <h3 class="text-sm font-medium text-zinc-400 mb-2">題目說明</h3>
      <p class="text-sm text-zinc-500">
        選擇難度後會自動生成對應的題目，點擊輸入框或按 <kbd class="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-xs">Enter</kbd> 開始打字。
      </p>
    </div>
  </div>
</template>