<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '../stores/app'
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-vue-next'
import { login, register } from '../services/backend'

const store = useAppStore()

const isLogin = ref(true)
const isLoading = ref(false)

const userName = ref('')
const password = ref('')
const name = ref('')
const avatar = ref('')
const errorText = ref('')

const handleSubmit = async () => {
  errorText.value = ''
  if (!userName.value || !password.value || (!isLogin.value && !name.value)) return
  isLoading.value = true

  try {
    if (isLogin.value) {
      const data = await login({
        user_name: userName.value.trim(),
        password: password.value
      })
      store.login({ token: data.token, userId: data.user_id, userName: userName.value.trim() })
    } else {
      await register({
        user_name: userName.value.trim(),
        password: password.value,
        nickname: name.value.trim(),
        avatar: avatar.value.trim(),
      })
      isLogin.value = true
      errorText.value = '注册成功，请登录'
    }
  } catch (error) {
    errorText.value = error instanceof Error ? error.message : '请求失败，请稍后再试'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="h-full w-full flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Abstract Background Elements -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div 
        class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse transition-colors duration-1000"
        :class="store.isDark ? 'bg-blue-600 mix-blend-screen' : 'bg-blue-300'"
      ></div>
      <div 
        class="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse transition-colors duration-1000 delay-700"
        :class="store.isDark ? 'bg-purple-600 mix-blend-screen' : 'bg-purple-300'"
      ></div>
    </div>

    <!-- Main Auth Card -->
    <div 
      class="w-full max-w-[1000px] h-[600px] flex rounded-[3rem] border shadow-2xl relative z-10 overflow-hidden transition-all duration-700 hover:shadow-3xl"
      :class="store.isDark ? 'bg-slate-900/60 border-slate-800 shadow-blue-900/20 backdrop-blur-2xl' : 'bg-white/60 border-white/80 shadow-blue-900/10 backdrop-blur-2xl'"
    >
      <!-- Left Side: Branding / Graphic -->
      <div 
        class="hidden md:flex flex-1 flex-col justify-between p-12 relative overflow-hidden"
        :class="store.isDark ? 'bg-slate-950/50' : 'bg-slate-50/50'"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 z-0"></div>
        
        <div class="relative z-10 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <Sparkles class="w-5 h-5" />
          </div>
          <span class="text-xl font-black tracking-tight" :class="store.isDark ? 'text-white' : 'text-slate-900'">
            ArtChat.
          </span>
        </div>

        <div class="relative z-10">
          <h1 class="text-4xl lg:text-5xl font-black tracking-tight mb-6 leading-tight" :class="store.isDark ? 'text-white' : 'text-slate-900'">
            Where Conversations <br />
            Meet <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Creativity</span>.
          </h1>
          <p class="text-lg font-medium opacity-60 max-w-sm">
            Experience the next generation of messaging powered by intelligent design and AI.
          </p>
        </div>

        <!-- Avatars Mockup display -->
        <div class="relative z-10 flex -space-x-4">
          <div v-for="i in 4" :key="i" class="w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-lg shadow-lg" :class="store.isDark ? 'bg-slate-800 border-slate-900' : 'bg-slate-100 border-white'">
            {{ ['🎨', '👨‍💻', '🚀', '✨'][i-1] }}
          </div>
        </div>
      </div>

      <!-- Right Side: Form -->
      <div class="flex-1 p-12 flex flex-col justify-center relative bg-white/40 dark:bg-slate-900/40">
        <div class="max-w-sm w-full mx-auto">
          
          <div class="text-center mb-10">
            <h2 class="text-3xl font-black tracking-tight mb-2" :class="store.isDark ? 'text-white' : 'text-slate-900'">
              {{ isLogin ? 'Welcome Back' : 'Create Account' }}
            </h2>
            <p class="text-sm font-medium opacity-60">
              {{ isLogin ? 'Enter your details to access your chats.' : 'Sign up to get started with ArtChat.' }}
            </p>
          </div>

          <!-- Form Fields -->
          <form @submit.prevent="handleSubmit" class="space-y-5">
            
            <div v-if="!isLogin" class="relative group animate-in slide-in-from-top-4 fade-in duration-500">
              <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500" :class="store.isDark ? 'text-slate-500' : 'text-slate-400'">
                <User class="w-5 h-5" />
              </div>
              <input 
                v-model="name"
                type="text" 
                placeholder="Full Name" 
                required
                class="w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none font-semibold transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-400"
                :class="store.isDark ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900 hover:border-slate-200'"
              />
            </div>

            <div class="relative group">
              <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500" :class="store.isDark ? 'text-slate-500' : 'text-slate-400'">
                <Mail class="w-5 h-5" />
              </div>
              <input
                v-model="userName"
                type="text"
                placeholder="Username"
                required
                class="w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none font-semibold transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-400"
                :class="store.isDark ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900 hover:border-slate-200'"
              />
            </div>

            <div v-if="!isLogin" class="relative group animate-in slide-in-from-top-4 fade-in duration-500">
              <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500" :class="store.isDark ? 'text-slate-500' : 'text-slate-400'">
                <User class="w-5 h-5" />
              </div>
              <input
                v-model="avatar"
                type="text"
                placeholder="Avatar URL (optional)"
                class="w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none font-semibold transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-400"
                :class="store.isDark ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900 hover:border-slate-200'"
              />
            </div>

            <div class="relative group">
              <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500" :class="store.isDark ? 'text-slate-500' : 'text-slate-400'">
                <Lock class="w-5 h-5" />
              </div>
              <input 
                v-model="password"
                type="password" 
                placeholder="Password" 
                required
                class="w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none font-semibold transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-400"
                :class="store.isDark ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900 hover:border-slate-200'"
              />
            </div>

            <div v-if="isLogin" class="flex justify-end">
              <button type="button" class="text-[11px] font-bold uppercase tracking-wide text-blue-500 hover:text-blue-600 transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-4 mt-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none overflow-hidden relative group"
            >
              <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span class="relative z-10">{{ isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account') }}</span>
              <ArrowRight v-if="!isLoading" class="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <p v-if="errorText" class="text-xs font-semibold text-red-500 mt-3">
              {{ errorText }}
            </p>
          </form>

          <div class="mt-8 text-center">
            <p class="text-sm font-medium opacity-60">
              {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
              <button 
                @click="isLogin = !isLogin" 
                class="font-bold text-blue-500 hover:text-blue-600 ml-1 transition-colors"
              >
                {{ isLogin ? 'Sign up' : 'Log in' }}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
