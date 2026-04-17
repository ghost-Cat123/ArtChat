<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { 
  Send, 
  Sparkles, 
  Info, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  ImageIcon,
  Circle,
  FileCode,
  FileText,
  Wrench,
  Cpu,
  Zap,
  Box
} from 'lucide-vue-next'
import { getAIResponse } from '../services/gemini'
import { useAppStore } from '../stores/app'

const store = useAppStore()

const props = defineProps<{
  chatId: string
}>()

const messages = ref([
  { id: 1, role: 'model', text: 'Hello! I am Muse, your personal AI assistant. How can I help you today?', time: '10:00' }
])

const inputText = ref('')
const isTyping = ref(false)
const isFocused = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)

// Dropdown states
const showAttachMenu = ref(false)
const showToolsMenu = ref(false)
const showModelMenu = ref(false)

const isAI = computed(() => store.activeTab === 'ai' || props.chatId.startsWith('ai'))

const activeChat = computed(() => {
  if (isAI.value) {
    const aiItem = store.aiHistory.find((item: any) => item.id === props.chatId)
    return { 
      name: aiItem?.name || 'Muse AI', 
      status: aiItem?.status || 'AI Assistant', 
      isAI: true, 
      avatar: '✨' 
    }
  }
  
  const chat = store.chats.find((c: any) => c.id === props.chatId)
  return chat || { name: 'Chat', status: 'Active now', isAI: false, avatar: '👤' }
})

const friendRequests = ref([
  { id: 'req-1', name: 'David Smith', avatar: '👨', msg: 'Hi, I am from the Design Meetup!', time: '10 Mins ago' },
  { id: 'req-2', name: 'Sarah Connor', avatar: '👩‍🦰', msg: 'Friend request via mutual group.', time: '2 Hours ago' },
])

const groupNotices = ref([
  { id: 'not-1', name: 'Project Alpha', avatar: '🚀', msg: 'Admin modified the group description.', time: 'Yesterday' },
  { id: 'not-2', name: 'Weekend Soccer', avatar: '⚽', msg: 'Group was dissolved by owner.', time: 'Monday' },
])

const contactsByCat: Record<string, any[]> = {
  'cat-friends': [
    { id: 'u1', name: 'Alice', status: 'Online', avatar: '👱‍♀️', lastSeen: 'now' },
    { id: 'u2', name: 'Bob', status: 'Away', avatar: '🧔', lastSeen: '5m' }
  ],
  'cat-family': [
    { id: 'u3', name: 'Mom', status: 'Offline', avatar: '👩', lastSeen: '2h' }
  ],
  'cat-designers': [
    { id: 'u4', name: 'Eve (UX)', status: 'Online', avatar: '👩‍🎨', lastSeen: 'now' },
    { id: 'u5', name: 'Frank (UI)', status: 'In Meeting', avatar: '👨‍🎨', lastSeen: '1h' }
  ]
}

// AI Context
const selectedModel = ref('Gemini 1.5 Pro')
const selectedTool = ref('Default Vision')

const scrollToBottom = async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

const sendMessage = async () => {
  if (!inputText.value.trim() || isTyping.value) return

  const userMsg = inputText.value
  messages.value.push({
    id: Date.now(),
    role: 'user',
    text: userMsg,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  inputText.value = ''
  scrollToBottom()

  if (isAI.value) {
    isTyping.value = true
    const history = messages.value.slice(0, -1).map(m => ({
      role: m.role as 'user' | 'model',
      parts: [{ text: m.text }]
    }))

    const response = await getAIResponse(userMsg, history)
    messages.value.push({
      id: Date.now() + 1,
      role: 'model',
      text: response || "I'm sorry, I couldn't process that request.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    isTyping.value = false
    scrollToBottom()
  }
}

watch(() => props.chatId, () => {
  if (isAI.value) {
     messages.value = [
      { id: 1, role: 'model', text: `Hello! I am ${activeChat.value.name}. I'm using ${selectedModel.value} today. How can I help?`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]
  }
})

onMounted(() => scrollToBottom())
</script>

<template>
  <div class="flex flex-col h-full relative overflow-hidden transition-colors duration-500" :class="store.isDark ? 'bg-slate-950' : 'bg-slate-50'">
    <!-- View Switcher for Contacts -->
    <div v-if="store.activeTab === 'contacts'" class="flex-1 overflow-y-auto p-12 bg-inherit custom-scrollbar animate-in fade-in">
      <div class="max-w-4xl mx-auto">
        <!-- Friend Requests -->
        <template v-if="store.activeId === 'friend-requests'">
          <h2 class="text-4xl font-black mb-10 tracking-tight" :class="store.isDark ? 'text-white' : 'text-slate-900'">Friend Requests</h2>
          <div class="flex flex-col gap-4">
            <div 
              v-for="req in friendRequests" 
              :key="req.id"
              class="p-6 rounded-[2rem] border flex items-center justify-between transition-all hover:scale-[1.02]"
              :class="store.isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'"
            >
              <div class="flex items-center gap-5">
                <div class="w-16 h-16 rounded-[1.5rem] bg-orange-100 text-orange-500 flex items-center justify-center text-3xl">{{ req.avatar }}</div>
                <div>
                  <h3 class="font-bold text-lg" :class="store.isDark ? 'text-white' : 'text-slate-900'">{{ req.name }}</h3>
                  <p class="text-sm font-medium opacity-60">{{ req.msg }}</p>
                  <p class="text-[10px] font-bold uppercase tracking-widest opacity-30 mt-1">{{ req.time }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button class="px-6 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Decline</button>
                <button class="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all">Accept</button>
              </div>
            </div>
          </div>
        </template>

        <!-- Group Notices -->
        <template v-else-if="store.activeId === 'group-notices'">
          <h2 class="text-4xl font-black mb-10 tracking-tight" :class="store.isDark ? 'text-white' : 'text-slate-900'">Group Notices</h2>
          <div class="flex flex-col gap-4">
            <div 
              v-for="notice in groupNotices" 
              :key="notice.id"
              class="p-6 rounded-[2rem] border flex items-center justify-between transition-all hover:scale-[1.02]"
              :class="store.isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'"
            >
              <div class="flex items-center gap-5">
                <div class="w-16 h-16 rounded-[1.5rem] bg-purple-100 text-purple-500 flex items-center justify-center text-3xl">{{ notice.avatar }}</div>
                <div>
                  <h3 class="font-bold text-lg" :class="store.isDark ? 'text-white' : 'text-slate-900'">{{ notice.name }}</h3>
                  <p class="text-sm font-medium opacity-60">{{ notice.msg }}</p>
                  <p class="text-[10px] font-bold uppercase tracking-widest opacity-30 mt-1">{{ notice.time }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button class="px-6 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Dismiss</button>
              </div>
            </div>
          </div>
        </template>

        <!-- Category Detail List -->
        <template v-else-if="store.activeId.startsWith('cat-')">
          <h2 class="text-4xl font-black mb-10 tracking-tight uppercase" :class="store.isDark ? 'text-white' : 'text-slate-900'">
            {{ store.activeId.replace('cat-', '') }}
          </h2>
          <div class="flex flex-col gap-4">
            <div 
              v-for="contact in (contactsByCat[store.activeId] || [])" 
              :key="contact.id"
              class="p-6 rounded-[2rem] border flex items-center justify-between transition-all hover:scale-[1.01]"
              :class="store.isDark ? 'bg-slate-900/40 border-slate-800/50 hover:bg-slate-900' : 'bg-white border-slate-100 hover:shadow-lg hover:shadow-slate-200/50'"
            >
              <div class="flex items-center gap-5">
                <div class="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center text-3xl">{{ contact.avatar }}</div>
                <div>
                  <h3 class="font-bold text-lg" :class="store.isDark ? 'text-white' : 'text-slate-900'">{{ contact.name }}</h3>
                  <div class="flex items-center gap-2 mt-1">
                    <div class="w-2 h-2 rounded-full" :class="contact.status === 'Online' ? 'bg-green-500' : 'bg-slate-400'"></div>
                    <p class="text-[10px] font-bold uppercase tracking-widest opacity-40">{{ contact.status }}</p>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <button class="px-6 py-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:text-white text-sm font-bold transition-colors">
                  Message
                </button>
                <button class="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div v-if="!contactsByCat[store.activeId]?.length" class="text-center py-20 opacity-50">
              <h3 class="text-2xl font-black mb-2">No contacts found</h3>
              <p class="text-sm">Try adding someone to this category.</p>
            </div>
          </div>
        </template>

        <!-- Fallback if not category, request or notice -->
        <template v-else>
           <h2 class="text-4xl font-black mb-10 tracking-tight" :class="store.isDark ? 'text-white' : 'text-slate-900'">{{ activeChat.name }}</h2>
           <!-- Basic placeholder to satisfy arbitrary selections -->
        </template>
      </div>
    </div>

    <!-- Chat View -->
    <template v-else>
      <div 
        class="h-24 px-10 flex items-center justify-between transition-colors duration-500 z-20 border-b"
        :class="store.isDark ? 'bg-slate-950/80 border-slate-900' : 'bg-white/80 border-slate-100'"
      >
      <div class="flex items-center gap-5">
        <div 
          class="w-14 h-14 rounded-3xl flex items-center justify-center text-2xl shadow-sm transition-all duration-300"
          :class="[
            isAI 
              ? (store.isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white shadow-blue-200') 
              : (store.isDark ? 'bg-slate-800' : 'bg-slate-100')
          ]"
        >
          {{ (activeChat as any).avatar }}
        </div>
        <div>
          <h2 class="text-xl font-bold" :class="store.isDark ? 'text-white' : 'text-slate-900'">
            {{ activeChat.name }}
            <span v-if="isAI" class="ml-2 px-2 py-0.5 bg-blue-500 text-white text-[9px] font-black rounded-full uppercase tracking-tighter">AI</span>
          </h2>
          <div class="flex items-center gap-2 mt-1">
            <Circle class="w-1.5 h-1.5 fill-green-500 text-green-500" />
            <p class="text-[9px] font-bold uppercase tracking-[0.2em] opacity-30">{{ (activeChat as any).status }}</p>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-3 pr-16 border-r" :class="store.isDark ? 'border-slate-800' : 'border-slate-200'">
        <button class="p-3 rounded-full transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
          <Info class="w-6 h-6 text-slate-400" />
        </button>
        <button class="p-3 rounded-full transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
          <MoreVertical class="w-6 h-6 text-slate-400" />
        </button>
      </div>
    </div>

    <!-- Messages Area -->
    <div 
      ref="scrollContainer" 
      class="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar relative"
    >
      <div 
        v-for="msg in messages" 
        :key="msg.id"
        class="flex flex-col"
        :class="msg.role === 'user' ? 'items-end' : 'items-start'"
      >
        <div class="flex items-end gap-4 max-w-[70%]">
          <div 
            class="px-8 py-5 rounded-[2.5rem] relative shadow-lg text-sm leading-relaxed transition-all duration-500"
            :class="[
              msg.role === 'user' 
                ? (isAI ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-br-none' : 'bg-slate-900 text-white rounded-br-none') 
                : (store.isDark ? 'bg-slate-900 text-slate-200 rounded-bl-none border border-slate-800' : 'bg-white text-slate-900 rounded-bl-none border border-slate-50')
            ]"
          >
            <div v-if="msg.role === 'model' && isAI" class="mb-4 text-blue-500">
              <Sparkles class="w-5 h-5" />
            </div>
            <p class="whitespace-pre-wrap font-medium">{{ msg.text }}</p>
          </div>
        </div>
        <span class="mt-4 text-[9px] font-bold opacity-20 px-6 uppercase tracking-[0.3em]">
          {{ msg.time }}
        </span>
      </div>

      <div v-if="isTyping" class="flex items-start gap-4">
        <div 
          class="px-8 py-5 rounded-[2.5rem] rounded-bl-none border flex items-center gap-2"
          :class="store.isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50 shadow-sm'"
        >
          <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
          <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-8 sticky bottom-0 z-20">
      <div 
        class="max-w-4xl mx-auto flex items-end gap-3 px-6 py-4 rounded-[2.5rem] border shadow-2xl transition-all duration-500 relative group"
        :class="[
          isFocused 
            ? (store.isDark ? 'border-blue-500/50 bg-slate-900 ring-8 ring-blue-500/5' : 'border-blue-200 bg-white ring-8 ring-blue-50/30 shadow-blue-900/5') 
            : (store.isDark ? 'border-slate-800 bg-slate-950' : 'bg-white border-slate-100')
        ]"
      >
        <!-- Dropdowns Container -->
        <div class="flex items-center gap-2 mb-0.5 relative z-10">
          <!-- Attachments -->
          <div class="relative">
            <button 
              @click="showAttachMenu = !showAttachMenu; showToolsMenu = false; showModelMenu = false"
              class="p-3 text-slate-400 hover:text-blue-500 transition-all active:scale-90"
              title="Attachments"
            >
              <Paperclip class="w-6 h-6" />
            </button>
            <div v-if="showAttachMenu" class="absolute bottom-full left-0 mb-4 w-40 rounded-2xl border shadow-xl p-2 z-50 animate-in fade-in slide-in-from-bottom-4" :class="store.isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900'">
              <button class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-500/10 hover:text-blue-500 transition-colors">
                <FileText class="w-4 h-4" />
                <span class="text-xs font-bold uppercase tracking-widest">Document</span>
              </button>
              <button class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-500/10 hover:text-blue-500 transition-colors">
                <ImageIcon class="w-4 h-4" />
                <span class="text-xs font-bold uppercase tracking-widest">Image</span>
              </button>
            </div>
          </div>

          <!-- Tools (AI specific) -->
          <div v-if="isAI" class="relative">
            <button 
              @click="showToolsMenu = !showToolsMenu; showAttachMenu = false; showModelMenu = false"
              class="p-3 rounded-xl transition-all active:scale-90"
              :class="store.isDark ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'"
              title="AI Tools"
            >
              <Wrench class="w-6 h-6" />
            </button>
            <div v-if="showToolsMenu" class="absolute bottom-full left-0 mb-4 w-48 rounded-2xl border shadow-xl p-2 z-40 animate-in fade-in scale-in-95" :class="store.isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900'">
              <div class="px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] opacity-30 border-b border-slate-100 dark:border-slate-800 mb-1">Select Tool</div>
              <button 
                v-for="tool in ['Default Vision', 'Code Analyzer', 'Data Plotter']" 
                :key="tool"
                @click="selectedTool = tool; showToolsMenu = false"
                class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
                :class="selectedTool === tool ? 'text-blue-500 border border-blue-500/20' : ''"
              >
                <span class="text-xs font-bold uppercase tracking-widest">{{ tool }}</span>
                <Check v-if="selectedTool === tool" class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
        
        <textarea 
          v-model="inputText"
          @focus="isFocused = true"
          @blur="isFocused = false"
          @keydown.enter.prevent="sendMessage"
          :placeholder="isAI ? `Chat with Muse (${selectedModel})...` : 'Type a message...'"
          class="flex-1 bg-transparent border-none outline-none ring-0 py-3 px-2 text-md placeholder-slate-500 resize-none min-h-[48px] max-h-48 transition-all relative z-10 focus:outline-none focus:border-none focus:ring-0"
          :class="store.isDark ? 'text-white' : 'text-slate-900'"
          rows="1"
        ></textarea>

        <!-- Right Side: Model/Send -->
        <div class="flex items-center gap-3 relative z-10">
          <div v-if="isAI" class="relative">
            <button 
               @click="showModelMenu = !showModelMenu; showAttachMenu = false; showToolsMenu = false"
               class="px-4 py-2.5 rounded-2xl border border-dashed transition-all flex items-center gap-2"
               :class="store.isDark ? 'border-slate-700 bg-slate-800 text-blue-400 hover:border-blue-500/50' : 'border-gray-200 bg-white text-blue-600 hover:border-blue-400'"
            >
              <Cpu class="w-4 h-4" />
              <span class="text-[10px] font-black uppercase tracking-widest">{{ selectedModel }}</span>
            </button>
            <div v-if="showModelMenu" class="absolute bottom-full right-0 mb-4 w-56 rounded-2xl border shadow-xl p-2 z-50 animate-in fade-in slide-in-from-right-4" :class="store.isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900'">
               <div class="px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] opacity-30 border-b border-slate-100 dark:border-slate-800 mb-1">AI Engine</div>
               <button 
                  v-for="model in ['Gemini 1.5 Pro', 'Gemini 1.5 Flash', 'Gemini 2.0 Ultra']" 
                  :key="model"
                  @click="selectedModel = model; showModelMenu = false"
                  class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-500/10 hover:text-blue-500 transition-colors text-left"
                  :class="selectedModel === model ? 'text-blue-500 bg-blue-500/5' : ''"
               >
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest">{{ model }}</p>
                    <p class="text-[8px] opacity-40 uppercase tracking-tighter">{{ model.includes('Pro') ? 'High Reasoning' : 'Fast Response' }}</p>
                  </div>
                  <Zap v-if="selectedModel === model" class="w-3 h-3 fill-current" />
               </button>
            </div>
          </div>

          <button 
            @click="sendMessage"
            :disabled="!inputText.trim() || isTyping"
            class="w-12 h-12 flex items-center justify-center rounded-[1.25rem] transition-all duration-500 shadow-xl"
            :class="[
              !inputText.trim() || isTyping 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 scale-95 opacity-50' 
                : (isAI ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-110 active:scale-95 shadow-blue-500/40' : 'bg-slate-900 text-white hover:bg-black hover:scale-110 active:scale-95 shadow-slate-900/20')
            ]"
          >
            <Send class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </template>
</div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
}

textarea:focus {
  outline: none !important;
  box-shadow: none !important;
}

.animate-in {
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}

@keyframes slide-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
