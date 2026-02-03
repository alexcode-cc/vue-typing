<script setup>
import { ref, computed } from 'vue'
import { useTypingStore } from '../stores/typingStore'

const store = useTypingStore()

// Stats data
const stats = computed(() => store.currentStats)
const wpm = computed(() => store.wpm)
const accuracy = computed(() => store.accuracy)
const timeElapsed = computed(() => store.timeElapsed)

// WPM history chart (simple visualization)
const wpmChart = computed(() => {
  const recentHistory = store.statsHistory.slice(0, 10)
  if (recentHistory.length < 2) return []

  const maxWpm = Math.max(...recentHistory.map(h => h.wpm), 100)

  return recentHistory.map(h => ({
    date: new Date(h.date).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
    wpm: h.wpm,
    accuracy: h.accuracy
  }))
})

// Leaderboard summary
const leaderboard = computed(() => store.getLeaderboard())
const currentDifficulty = computed(() => DIFFICULTY_CONFIG[store.difficulty])

const actions = {
  selectDifficulty: (level) => store.selectDifficulty(level),
  resetStats: () => {
    if (confirm('確定要清空所有統計記錄嗎？')) {
      store.resetStats()
    }
  },
  clearLeaderboard: () => {
    if (confirm('確定要清空排行榜嗎？')) {
      store.clearLeaderboard()
    }
  }
}
</script>

<template>
  <div class="bg-zinc-800/50 backdrop-blur rounded-2xl p-6 border border-zinc-700/50">
    <h2 class="text-xl font-semibold mb-4 text-white">統計數據</h2>

    <!-- Current Session Stats -->
    <div v-if="store.isTyping" class="mb-6">
      <h3 class="text-sm font-medium text-zinc-400 mb-3">當前會話</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-zinc-900/50 rounded-xl p-4 text-center">
          <div class="text-3xl font-bold text-blue-400">{{ wpm }}</div>
          <div class="text-zinc-500 text-sm mt-1">WPM</div>
        </div>
        <div class="bg-zinc-900/50 rounded-xl p-4 text-center">
          <div class="text-3xl font-bold text-green-400">{{ accuracy }}</div>
          <div class="text-zinc-500 text-sm mt-1">準確率</div>
        </div>
      </div>
    </div>

    <!-- Session Info -->
    <div v-else class="mb-6">
      <h3 class="text-sm font-medium text-zinc-400 mb-3">本次結果</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-zinc-900/50 rounded-xl p-4 text-center">
          <div class="text-3xl font-bold text-blue-400">{{ wpm }}</div>
          <div class="text-zinc-500 text-sm mt-1">WPM</div>
        </div>
        <div class="bg-zinc-900/50 rounded-xl p-4 text-center">
          <div class="text-3xl font-bold text-green-400">{{ accuracy }}</div>
          <div class="text-zinc-500 text-sm mt-1">準確率</div>
        </div>
      </div>
      <div v-if="timeElapsed > 0" class="mt-3 text-center text-zinc-400 text-sm">
        用時: {{ timeElapsed }} 秒
      </div>
    </div>

    <!-- WPM History Chart -->
    <div v-if="wpmChart.length > 0" class="mb-6">
      <h3 class="text-sm font-medium text-zinc-400 mb-3">WPM 歷史記錄</h3>
      <div class="space-y-2">
        <div
          v-for="(entry, index) in wpmChart"
          :key="index"
          class="flex items-center gap-4 bg-zinc-900/30 rounded-lg p-2"
        >
          <span class="text-zinc-500 text-sm w-16">{{ entry.date }}</span>
          <div class="flex-1 bg-zinc-800 rounded-full h-6 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="entry.accuracy >= 90 ? 'bg-green-500' : entry.accuracy >= 80 ? 'bg-yellow-500' : 'bg-red-500'"
              :style="{ width: (entry.wpm / 100) * 100 + '%' }"
            ></div>
          </div>
          <span class="text-blue-400 font-mono w-12 text-right">{{ entry.wpm }}</span>
          <span class="text-green-400 font-mono w-12 text-right">{{ entry.accuracy }}%</span>
        </div>
      </div>
    </div>

    <!-- Clear History -->
    <div class="border-t border-zinc-700 pt-4 mt-4">
      <button
        @click="actions.resetStats"
        class="w-full py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm"
      >
        清空統計記錄
      </button>
    </div>
  </div>
</template>