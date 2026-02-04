<script setup>
import { ref, computed, watch } from 'vue'
import { useTypingStore } from '../stores/typingStore'
import { DIFFICULTY_CONFIG } from '../data/wordLibraries.js'

const store = useTypingStore()

const textareaRef = ref(null)

// Computed
const displayText = computed(() => {
  const userText = store.userInput
  const fullText = store.currentText
  const result = []

  for (let i = 0; i < fullText.length; i++) {
    if (i < userText.length) {
      // 已輸入的字符
      if (userText[i] === fullText[i]) {
        result.push({ char: fullText[i], status: 'correct' })
      } else {
        result.push({ char: userText[i], status: 'incorrect' })
      }
    } else {
      // 還未輸入的字符
      result.push({ char: fullText[i], status: 'pending' })
    }

    // 在每個單字之後添加額外空格 (以空格分隔的單字)
    if (fullText[i] === ' ') {
      result.push({ char: ' ', status: 'space', class: 'whitespace-pre' })
    }
  }

  // 如果還沒輸入完，顯示光標
  if (userText.length < fullText.length) {
    result.push({ char: '|', status: 'cursor', class: 'animate-pulse' })
  }

  return result
})

const inputValue = computed({
  get: () => store.userInput,
  set: (val) => store.updateInput(val)
})

// Watchers
watch(displayText, (newVal) => {
  // 檢查是否完成
  if (store.userInput.length === store.currentText.length && store.userInput.length > 0) {
    store.endTyping()
    // 重置輸入框
    setTimeout(() => {
      textareaRef.value?.focus()
    }, 100)
  }
})

// Actions
const focusInput = () => {
  textareaRef.value?.focus()
}

const handleKeyDown = (e) => {
  // 阻止預設的按鍵行為
  if (e.key === 'Tab') {
    e.preventDefault()
  }

  // Ctrl+Enter 開始打字
  if (e.ctrlKey && e.key === 'Enter') {
    startTyping()
    return
  }

  // Enter 開始打字
  if (e.key === 'Enter' && !store.isTyping && store.userInput.length === 0) {
    startTyping()
  }

  // 開始打字模式
  if (store.isTyping && e.key === 'Backspace' && store.userInput.length === 0) {
    // 不允許刪除所有字符
    return
  }
}

const startTyping = () => {
  if (!store.isTyping) {
    store.startTyping()
  }
}

// 初始化
store.generateText(store.difficulty)
</script>

<template>
  <div class="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-blue-500/5">
    <!-- 提示信息 -->
    <div v-if="!store.isTyping && store.userInput.length === 0" class="mb-4">
      <div class="flex items-center justify-center gap-2 text-slate-500">
        <svg class="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
        </svg>
        <p class="text-sm">點擊輸入框開始，或按 Ctrl+Enter 開始</p>
      </div>
    </div>

    <!-- 打字顯示區 -->
    <div
      class="bg-white/80 rounded-xl p-5 mb-4 font-mono text-lg leading-relaxed border border-slate-200 shadow-sm"
      @click="focusInput"
    >
      <span
        v-for="(item, index) in displayText"
        :key="index"
        :class="[
          'inline-block transition-colors duration-100 px-0.5',
          item.status === 'correct'
            ? 'text-emerald-600 bg-emerald-50 rounded'
            : '',
          item.status === 'incorrect'
            ? 'text-red-500 bg-red-50 rounded'
            : '',
          item.status === 'pending'
            ? 'text-slate-300'
            : '',
          item.class || ''
        ]"
      >
        {{ item.char }}
      </span>
    </div>

    <!-- 狀態標籤 -->
    <div class="flex justify-between items-center mb-4">
      <span
        class="px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
        :class="DIFFICULTY_CONFIG[store.difficulty].color + ' text-white'"
      >
        {{ DIFFICULTY_CONFIG[store.difficulty].label }}
      </span>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
          <span class="text-sm font-medium text-slate-600">{{ store.userInput.length }}</span>
        </div>
        <span class="text-slate-500 text-sm">/ {{ store.currentText.length }}</span>
      </div>
    </div>

    <!-- 輸入框 -->
    <textarea
      ref="textareaRef"
      v-model="inputValue"
      @keydown="handleKeyDown"
      class="w-full bg-white/80 border-2 border-slate-200 rounded-xl p-4 font-mono text-lg text-slate-800 resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
      rows="2"
      placeholder="請開始打字..."
      :disabled="store.isTyping && store.userInput.length > 0"
    ></textarea>

    <!-- 快捷鍵提示 -->
    <div class="mt-4 flex justify-center">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
        <kbd class="px-2 py-1 bg-white border border-slate-300 rounded shadow-sm text-xs font-semibold text-slate-600">Ctrl</kbd>
        <span class="text-slate-400">+</span>
        <kbd class="px-2 py-1 bg-white border border-slate-300 rounded shadow-sm text-xs font-semibold text-slate-600">Enter</kbd>
        <span class="text-slate-500 text-sm ml-2">開始打字</span>
      </div>
    </div>
  </div>
</template>