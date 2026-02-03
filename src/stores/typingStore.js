import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { WORD_LIBRARIES, DIFFICULTY_CONFIG } from '../data/wordLibraries'

export const useTypingStore = defineStore('typing', () => {
  // State
  const difficulty = ref('easy')
  const currentText = ref('')
  const userInput = ref('')
  const isTyping = ref(false)
  const startTime = ref(null)
  const endTime = ref(null)
  const currentStats = ref({
    wpm: 0,
    accuracy: 0,
    correctChars: 0,
    totalChars: 0,
    startTime: null
  })
  const statsHistory = ref([])
  const customText = ref('')
  const showCustomInput = ref(false)

  // Computed
  const timeElapsed = computed(() => {
    if (!isTyping.value || !startTime.value) return 0
    return Math.floor((new Date() - new Date(startTime.value)) / 1000)
  })

  const wpm = computed(() => {
    if (!isTyping.value || !startTime.value || timeElapsed.value === 0) return 0
    const words = userInput.value.split(' ').filter(word => word.length > 0).length
    const minutes = timeElapsed.value / 60
    return Math.round(words / minutes) || 0
  })

  const accuracy = computed(() => {
    if (userInput.value.length === 0) return 100
    const correct = userInput.value.split('').filter((char, index) => {
      return char === currentText.value[index]
    }).length
    return Math.round((correct / userInput.value.length) * 100) || 100
  })

  // Actions
  const generateText = (difficultyLevel = 'easy') => {
    const words = WORD_LIBRARIES[difficultyLevel] || WORD_LIBRARIES.easy
    const count = DIFFICULTY_CONFIG[difficultyLevel]?.count || 50
    const selectedWords = words
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .join(' ')
    currentText.value = selectedWords
    userInput.value = ''
    isTyping.value = false
    startTime.value = null
    endTime.value = null
    currentStats.value = { wpm: 0, accuracy: 100, correctChars: 0, totalChars: 0, startTime: null }
  }

  const startTyping = () => {
    if (userInput.value.length === currentText.value.length) {
      generateText(difficulty.value)
    }
    if (!isTyping.value) {
      isTyping.value = true
      startTime.value = new Date().toISOString()
      currentStats.value.startTime = new Date().toISOString()
    }
  }

  const endTyping = () => {
    if (isTyping.value) {
      isTyping.value = false
      endTime.value = new Date().toISOString()

      // Save to history
      const historyEntry = {
        date: new Date().toISOString(),
        difficulty: difficulty.value,
        wpm: wpm.value,
        accuracy: accuracy.value,
        time: timeElapsed.value
      }
      statsHistory.value.unshift(historyEntry)

      // Save to leaderboard
      saveToLeaderboard(historyEntry)

      // Save to localStorage
      localStorage.setItem('typingStatsHistory', JSON.stringify(statsHistory.value))
    }
  }

  const updateInput = (value) => {
    userInput.value = value
    if (isTyping.value) {
      currentStats.value = {
        wpm: wpm.value,
        accuracy: accuracy.value,
        correctChars: userInput.value.split('').filter((char, index) => char === currentText.value[index]).length,
        totalChars: userInput.value.length,
        startTime: startTime.value
      }
    }
  }

  const selectDifficulty = (level) => {
    difficulty.value = level
    generateText(level)
  }

  const resetStats = () => {
    statsHistory.value = []
    localStorage.removeItem('typingStatsHistory')
  }

  const loadHistory = () => {
    const saved = localStorage.getItem('typingStatsHistory')
    if (saved) {
      statsHistory.value = JSON.parse(saved)
    }
  }

  const clearCurrent = () => {
    userInput.value = ''
    isTyping.value = false
    startTime.value = null
    currentStats.value = { wpm: 0, accuracy: 100, correctChars: 0, totalChars: 0, startTime: null }
  }

  // Leaderboard functions
  const saveToLeaderboard = (entry) => {
    const leaderboard = JSON.parse(localStorage.getItem('typingLeaderboard') || '{}')
    if (!leaderboard[difficulty.value]) {
      leaderboard[difficulty.value] = []
    }
    leaderboard[difficulty.value].push(entry)
    leaderboard[difficulty.value].sort((a, b) => b.wpm - a.wpm)
    leaderboard[difficulty.value] = leaderboard[difficulty.value].slice(0, 10)
    localStorage.setItem('typingLeaderboard', JSON.stringify(leaderboard))
  }

  const getLeaderboard = () => {
    return JSON.parse(localStorage.getItem('typingLeaderboard') || '{}')
  }

  const clearLeaderboard = () => {
    localStorage.removeItem('typingLeaderboard')
  }

  // Initialize
  loadHistory()

  return {
    // State
    difficulty,
    currentText,
    userInput,
    isTyping,
    startTime,
    endTime,
    currentStats,
    statsHistory,
    customText,
    showCustomInput,

    // Computed
    timeElapsed,
    wpm,
    accuracy,

    // Actions
    generateText,
    startTyping,
    endTyping,
    updateInput,
    selectDifficulty,
    resetStats,
    loadHistory,
    clearCurrent,
    getLeaderboard,
    clearLeaderboard
  }
})