import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

export type NavTab = 'messages' | 'contacts' | 'ai'

export const useAppStore = defineStore('app', () => {
  const isAuthenticated = ref(false)
  const isSidebarExpanded = ref(false)
  const activeTab = ref<NavTab>('messages')
  const activeId = ref('ai-assistant')
  const isDark = ref(false)

  const aiHistory = ref([
    { id: 'ai-assistant', name: 'New Muse Chat', avatar: '✨', status: 'Multimodal Assistant', pinned: true, selected: false },
    { id: 'ai-1', name: 'Design Ideas', avatar: '✨', status: 'Historical Chat', pinned: false, selected: false },
    { id: 'ai-2', name: 'Code Review', avatar: '✨', status: 'Historical Chat', pinned: false, selected: false },
  ])

  const chats = ref([
    { id: 'chat-1', name: 'Design Team', lastMsg: 'The new minimalist UI looks great!', time: '10:24', avatar: '🎨', online: true, pinned: false },
    { id: 'chat-2', name: 'Emily Davis', lastMsg: 'Are we still meeting at 2 PM?', time: 'Yesterday', avatar: '👩‍💻', online: true, pinned: false },
    { id: 'chat-3', name: 'John Doe', lastMsg: 'Attached the project documentation.', time: 'Monday', avatar: '👨‍💼', online: false, pinned: false },
    { id: 'chat-4', name: 'Art & Tech Hub', lastMsg: 'Check out the latest AI tools.', time: 'Oct 24', avatar: '🚀', online: false, pinned: false },
  ])

  const contactCategories = ref([
    { id: 'cat-friends', name: 'Friends', icon: '🫂', count: 12 },
    { id: 'cat-work', name: 'Work', icon: '💼', count: 45 },
    { id: 'cat-family', name: 'Family', icon: '🏠', count: 6 },
  ])

  const friendSubTab = ref<'friends' | 'groups'>('friends')

  // AI Methods
  const createNewAIChat = () => {
    const newId = `ai-${Date.now()}`
    aiHistory.value.push({
      id: newId,
      name: 'New Chat',
      avatar: '✨',
      status: 'Ready to assist',
      pinned: false,
      selected: false
    })
    activeId.value = newId
  }

  const deleteAIHistory = (id: string) => {
    aiHistory.value = aiHistory.value.filter(item => item.id !== id)
    if (activeId.value === id) {
      activeId.value = aiHistory.value[0]?.id || ''
    }
  }

  const batchDeleteAI = () => {
    aiHistory.value = aiHistory.value.filter(item => !item.selected)
    if (!aiHistory.value.find(i => i.id === activeId.value)) {
      activeId.value = aiHistory.value[0]?.id || ''
    }
  }

  const toggleAISelection = (id: string) => {
    const item = aiHistory.value.find(i => i.id === id)
    if (item) item.selected = !item.selected
  }

  const isAnyAISelected = computed(() => aiHistory.value.some(i => i.selected))

  // Message Methods
  const togglePinChat = (id: string) => {
    const chat = chats.value.find(c => c.id === id)
    if (chat) chat.pinned = !chat.pinned
  }

  const deleteChat = (id: string) => {
    chats.value = chats.value.filter(c => c.id !== id)
    if (activeId.value === id) {
      activeId.value = chats.value[0]?.id || ''
    }
  }

  // Contact Methods
  const createCategory = (name: string) => {
    contactCategories.value.push({
      id: `cat-${Date.now()}`,
      name,
      icon: '📁',
      count: 0,
      isCustom: true
    } as any)
  }

  const deleteCategory = (id: string) => {
    contactCategories.value = contactCategories.value.filter(c => c.id !== id)
    if (activeId.value === id) {
      activeId.value = 'cat-friends' // Back to default
    }
  }

  const editCategory = (id: string, newName: string) => {
    const cat = contactCategories.value.find(c => c.id === id)
    if (cat) cat.name = newName
  }

  const editAIName = (id: string, newName: string) => {
    const item = aiHistory.value.find(i => i.id === id)
    if (item) item.name = newName
  }

  const togglePinAI = (id: string) => {
    const item = aiHistory.value.find(i => i.id === id)
    if (item) item.pinned = !item.pinned
  }

  const sortedAIHistory = () => {
    return [...aiHistory.value].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
  }

  const sortedChats = () => {
    return [...chats.value].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
  }

  const toggleSidebar = () => {
    isSidebarExpanded.value = !isSidebarExpanded.value
  }

  const setTab = (tab: NavTab) => {
    activeTab.value = tab
    if (tab === 'ai') {
      activeId.value = aiHistory.value[0]?.id || 'ai-assistant'
    } else if (tab === 'messages') {
      activeId.value = chats.value[0]?.id || ''
    } else {
      activeId.value = contactCategories.value[0]?.id || ''
    }
  }

  const setActiveId = (id: string) => {
    activeId.value = id
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    isAuthenticated,
    isSidebarExpanded,
    activeTab,
    activeId,
    isDark,
    aiHistory,
    chats,
    contactCategories,
    friendSubTab,
    isAnyAISelected,
    createNewAIChat,
    deleteAIHistory,
    batchDeleteAI,
    toggleAISelection,
    togglePinChat,
    deleteChat,
    createCategory,
    deleteCategory,
    editCategory,
    editAIName,
    togglePinAI,
    sortedAIHistory,
    sortedChats,
    toggleSidebar,
    login: () => isAuthenticated.value = true,
    logout: () => isAuthenticated.value = false,
    setTab,
    setActiveId,
    toggleTheme
  }
})
