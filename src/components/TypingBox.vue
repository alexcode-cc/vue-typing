<script setup>
import { ref, computed, watch } from 'vue'
import { useTypingStore } from '../stores/typingStore'

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
  <div class="bg-zinc-800/50 backdrop-blur rounded-2xl p-6 border border-zinc-700/50">
    <!-- 提示信息 -->
    <div v-if="!store.isTyping && store.userInput.length === 0" class="mb-4">
      <p class="text-zinc-400 text-sm">點擊輸入框開始，或按 Ctrl+Enter 開始</p>
    </div>

    <!-- 打字顯示區 -->
    <div
      class="bg-zinc-900/50 rounded-xl p-4 min-h-[120px] mb-4 font-mono text-lg leading-relaxed"
      @click="focusInput"
    >
      <span
        v-for="(item, index) in displayText"
        :key="index"
        :class="[
          'inline-block transition-colors duration-100',
          item.status === 'correct' ? 'text-green-400' : '',
          item.status === 'incorrect' ? 'text-red-400' : '',
          item.status === 'pending' ? 'text-zinc-600' : '',
          item.class || ''
        ]"
      >
        {{ item.char }}
      </span>
    </div>

    <!-- 狀態標籤 -->
    <div class="flex justify-between items-center mb-4">
      <span
        class="px-3 py-1 rounded-full text-sm font-medium"
        :class="DIFFICULTY_CONFIG[store.difficulty].color + '/20 text-' + DIFFICULTY_CONFIG[store.difficulty].color.split('-')[1] + '-400'"
      >
        {{ DIFFICULTY_CONFIG[store.difficulty].label }}
      </span>
      <span class="text-zinc-500 text-sm">
        進度: {{ store.userInput.length }} / {{ store.currentText.length }}
      </span>
    </div>

    <!-- 輸入框 -->
    <textarea
      ref="textareaRef"
      v-model="inputValue"
      @keydown="handleKeyDown"
      class="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl p-4 font-mono text-lg text-zinc-100 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
      rows="2"
      placeholder="請開始打字..."
      :disabled="store.isTyping && store.userInput.length > 0"
    ></textarea>

    <!-- 快捷鍵提示 -->
    <div class="mt-4 text-center">
      <p class="text-zinc-600 text-xs">
        <kbd class="px-2 py-0.5 bg-zinc-800 rounded border border-zinc-700">Ctrl</kbd> + <kbd class="px-2 py-0.5 bg-zinc-800 rounded border border-zinc-700">Enter</kbd>
        開始打字
      </p>
    </div>
  </div>
</template>