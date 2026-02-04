<script setup>
import TypingBox from './components/TypingBox.vue'
import StatsPanel from './components/StatsPanel.vue'
import DifficultySelector from './components/DifficultySelector.vue'
import Leaderboard from './components/Leaderboard.vue'
</script>

<template>
  <div class="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <header class="text-center mb-10">
        <div class="inline-flex items-center gap-3 mb-3">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            打字練習網
          </h1>
        </div>
        <p class="text-slate-500">提升你的打字速度和準確度</p>
      </header>

      <!-- Difficulty Selector -->
      <DifficultySelector class="mb-6" />

      <!-- Main Content -->
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Typing Box (Takes 2 columns) -->
        <div class="md:col-span-2">
          <TypingBox />
        </div>

        <!-- Stats Panel (Takes 1 column) -->
        <div class="md:col-span-1">
          <StatsPanel />
        </div>
      </div>

      <!-- Leaderboard -->
      <div class="mt-6">
        <Leaderboard />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles if needed */
</style>