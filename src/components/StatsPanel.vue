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
  <div class="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-blue-500/5">
    <div class="flex items-center gap-2 mb-5">
      <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      </div>
      <h2 class="text-xl font-bold text-slate-800">統計數據</h2>
    </div>

    <!-- Current Session Stats -->
    <div v-if="store.isTyping" class="mb-6">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        <h3 class="text-sm font-semibold text-slate-600">當前會話</h3>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 text-center border border-blue-100">
          <div class="text-4xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ wpm }}</div>
          <div class="text-slate-500 text-sm mt-2 font-medium">WPM</div>
        </div>
        <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 text-center border border-emerald-100">
          <div class="text-4xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">{{ accuracy }}</div>
          <div class="text-slate-500 text-sm mt-2 font-medium">準確率</div>
        </div>
      </div>
    </div>

    <!-- Session Info -->
    <div v-else class="mb-6">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
        <h3 class="text-sm font-semibold text-slate-600">本次結果</h3>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 text-center border border-blue-100">
          <div class="text-4xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ wpm }}</div>
          <div class="text-slate-500 text-sm mt-2 font-medium">WPM</div>
        </div>
        <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 text-center border border-emerald-100">
          <div class="text-4xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">{{ accuracy }}</div>
          <div class="text-slate-500 text-sm mt-2 font-medium">準確率</div>
        </div>
      </div>
      <div v-if="timeElapsed > 0" class="mt-3 flex justify-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
          <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-slate-600 text-sm">用時: {{ timeElapsed }} 秒</span>
        </div>
      </div>
    </div>

    <!-- WPM History Chart -->
    <div v-if="wpmChart.length > 0" class="mb-6">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
        <h3 class="text-sm font-semibold text-slate-600">WPM 歷史記錄</h3>
      </div>
      <div class="space-y-3">
        <div
          v-for="(entry, index) in wpmChart"
          :key="index"
          class="flex items-center gap-4 bg-slate-50/80 rounded-xl p-3 border border-slate-100"
        >
          <span class="text-slate-500 text-sm font-medium w-20">{{ entry.date }}</span>
          <div class="flex-1 h-8 bg-white rounded-full overflow-hidden shadow-inner border border-slate-200">
            <div
              class="h-full rounded-full transition-all duration-500 ease-out"
              :class="entry.accuracy >= 90 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : entry.accuracy >= 80 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-red-400 to-red-500'"
              :style="{ width: (entry.wpm / 120) * 100 + '%' }"
            ></div>
          </div>
          <span class="text-blue-600 font-mono font-bold w-14 text-right">{{ entry.wpm }}</span>
          <span class="text-emerald-600 font-mono font-bold w-14 text-right">{{ entry.accuracy }}%</span>
        </div>
      </div>
    </div>

    <!-- Clear History -->
    <div class="border-t border-slate-200 pt-5 mt-5">
      <button
        @click="actions.resetStats"
        class="w-full py-3 px-4 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-500 rounded-xl transition-all duration-300 font-medium text-sm border border-red-100 hover:border-red-200 hover:shadow-md"
      >
        清空統計記錄
      </button>
    </div>
  </div>
</template>