<script setup>
import { computed } from 'vue'
import { useTypingStore } from '../stores/typingStore'

const store = useTypingStore()

const DIFFICULTY_CONFIG = {
  easy: { label: '簡單', color: 'from-green-500 to-green-600' },
  medium: { label: '普通', color: 'from-yellow-500 to-yellow-600' },
  hard: { label: '困難', color: 'from-red-500 to-red-600' }
}

const leaderboard = computed(() => store.getLeaderboard())

const difficultySections = computed(() => {
  return ['easy', 'medium', 'hard'].map(diff => ({
    ...DIFFICULTY_CONFIG[diff],
    entries: leaderboard.value[diff] || []
  }))
})

const actions = {
  clearLeaderboard: () => store.clearLeaderboard()
}
</script>

<template>
  <div class="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-blue-500/5">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-slate-800">排行榜</h2>
      </div>
      <button
        @click="actions.clearLeaderboard"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-all duration-200 text-sm font-medium border border-red-100"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
        清空
      </button>
    </div>

    <div class="space-y-6">
      <!-- Leaderboard for each difficulty -->
      <div
        v-for="section in difficultySections"
        :key="section.label"
        class="bg-white/80 rounded-xl overflow-hidden border border-slate-200 shadow-sm"
      >
        <div class="px-5 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <div
              class="w-2 h-6 rounded-full bg-gradient-to-b shadow-sm"
              :class="section.color"
            ></div>
            <h3 class="font-bold text-slate-700">{{ section.label }}難度</h3>
            <span class="text-slate-400 text-sm ml-auto font-medium">
              {{ section.entries.length }} 筆記錄
            </span>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="section.entries.length === 0" class="p-8 text-center">
          <div class="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-slate-500 text-sm">暫無記錄，快來挑戰吧！</p>
        </div>

        <!-- Records list -->
        <div v-else class="divide-y divide-slate-100">
          <div
            v-for="(entry, index) in section.entries"
            :key="entry.date"
            class="px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-sm"
                :class="index < 3
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white scale-105'
                  : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                "
              >
                <span v-if="index === 0" class="text-lg">🥇</span>
                <span v-else-if="index === 1" class="text-lg">🥈</span>
                <span v-else-if="index === 2" class="text-lg">🥉</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div>
                <div class="font-bold text-slate-800 font-mono text-lg">{{ entry.wpm }} <span class="text-sm font-normal text-slate-500">WPM</span></div>
                <div class="text-slate-400 text-xs mt-0.5">
                  {{ new Date(entry.date).toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300"
                :class="entry.accuracy >= 90
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-md'
                  : entry.accuracy >= 80
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md'
                  : 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-md'
                "
              >
                {{ entry.accuracy }}%
              </span>
              <span class="text-slate-400 text-sm font-mono">{{ entry.time }}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div class="mt-6 pt-6 border-t border-slate-200">
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center border border-blue-100">
          <div class="text-2xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {{ Object.values(leaderboard).reduce((sum, arr) => sum + arr.length, 0) }}
          </div>
          <div class="text-slate-500 text-xs mt-2 font-medium">總記錄數</div>
        </div>
        <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 text-center border border-emerald-100">
          <div class="text-2xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">100%</div>
          <div class="text-slate-500 text-xs mt-2 font-medium">最高準確率</div>
        </div>
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center border border-purple-100">
          <div class="text-2xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">100+</div>
          <div class="text-slate-500 text-xs mt-2 font-medium">詞彙量</div>
        </div>
      </div>
    </div>
  </div>
</template>