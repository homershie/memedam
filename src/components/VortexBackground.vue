<template>
  <div :class="cn('relative h-full w-full', props.containerClass)">
    <div
      ref="containerRef"
      class="absolute inset-0 z-0 flex size-full items-center justify-center"
    >
      <canvas ref="canvasRef"></canvas>
    </div>

    <div :class="cn('relative z-10', props.contentClass)">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { createNoise3D } from 'simplex-noise'
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'

const TAU = 2 * Math.PI
const BASE_TTL = 50
const RANGE_TTL = 150
const PARTICLE_PROP_COUNT = 9
const RANGE_HUE = 100
const NOISE_STEPS = 3
const X_OFF = 0.00125
const Y_OFF = 0.00125
const Z_OFF = 0.0005

const props = defineProps({
  contentClass: {
    type: String,
    default: '',
  },
  containerClass: {
    type: String,
    default: '',
  },
  particleCount: {
    type: Number,
    default: 700,
  },
  rangeY: {
    type: Number,
    default: 100,
  },
  baseHue: {
    type: Number,
    default: 220,
  },
  baseSpeed: {
    type: Number,
    default: 0.0,
  },
  rangeSpeed: {
    type: Number,
    default: 1.5,
  },
  baseRadius: {
    type: Number,
    default: 1,
  },
  rangeRadius: {
    type: Number,
    default: 2,
  },
})

// 直接檢測 DOM 中的主題類別，與 ThemeToggle 保持一致
const isDarkTheme = ref(document.documentElement.classList.contains('dark'))

// 監聽 DOM 類別變化
onMounted(() => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        isDarkTheme.value = document.documentElement.classList.contains('dark')
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  // 清理 observer
  onUnmounted(() => {
    observer.disconnect()
  })
})

// 根據主題調整亮度
const brightnessAdjustment = computed(() => {
  return isDarkTheme.value ? '100%' : '120%'
})

const tick = ref(0)
const animationFrame = ref(null)
const particleProps = ref(null)
const center = ref([0, 0])
const ctx = ref(null)

const canvasRef = ref(null)
const containerRef = ref(null)

const particleCache = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  life: 0,
  ttl: 0,
  speed: 0,
  radius: 0,
  hue: 0,
}

const noise3D = createNoise3D()

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function rand(n) {
  return n * Math.random()
}

function randRange(n) {
  return n - rand(2 * n)
}

function fadeInOut(t, m) {
  const hm = 0.5 * m
  return Math.abs(((t + hm) % m) - hm) / hm
}

function lerp(n1, n2, speed) {
  return (1 - speed) * n1 + speed * n2
}

function initParticle(i) {
  if (!particleProps.value || !canvasRef.value) return

  const canvas = canvasRef.value
  particleCache.x = rand(canvas.width)
  particleCache.y = center.value[1] + randRange(props.rangeY)
  particleCache.vx = 0
  particleCache.vy = 0
  particleCache.life = 0
  particleCache.ttl = BASE_TTL + rand(RANGE_TTL)
  particleCache.speed = props.baseSpeed + rand(props.rangeSpeed)
  particleCache.radius = props.baseRadius + rand(props.rangeRadius)
  particleCache.hue = props.baseHue + rand(RANGE_HUE)

  particleProps.value.set(
    [
      particleCache.x,
      particleCache.y,
      particleCache.vx,
      particleCache.vy,
      particleCache.life,
      particleCache.ttl,
      particleCache.speed,
      particleCache.radius,
      particleCache.hue,
    ],
    i,
  )
}

function updateParticle(i) {
  if (!particleProps.value || !canvasRef.value || !ctx.value) return

  const canvas = canvasRef.value
  const props = particleProps.value
  const context = ctx.value

  particleCache.x = props[i]
  particleCache.y = props[i + 1]
  particleCache.vx = props[i + 2]
  particleCache.vy = props[i + 3]
  particleCache.life = props[i + 4]
  particleCache.ttl = props[i + 5]
  particleCache.speed = props[i + 6]
  particleCache.radius = props[i + 7]
  particleCache.hue = props[i + 8]

  const n =
    noise3D(
      particleCache.x * X_OFF,
      particleCache.y * Y_OFF,
      tick.value * Z_OFF,
    ) *
    NOISE_STEPS *
    TAU

  const nextVx = lerp(particleCache.vx, Math.cos(n), 0.5)
  const nextVy = lerp(particleCache.vy, Math.sin(n), 0.5)
  const nextX = particleCache.x + nextVx * particleCache.speed
  const nextY = particleCache.y + nextVy * particleCache.speed

  context.save()
  context.lineCap = 'round'
  context.lineWidth = particleCache.radius

  // 根據主題調整粒子顏色
  const saturation = isDarkTheme.value ? 100 : 100
  const lightness = isDarkTheme.value ? 60 : 80
  const alpha = fadeInOut(particleCache.life, particleCache.ttl)

  context.strokeStyle = `hsla(${particleCache.hue},${saturation}%,${lightness}%,${alpha})`
  context.beginPath()
  context.moveTo(particleCache.x, particleCache.y)
  context.lineTo(nextX, nextY)
  context.stroke()
  context.restore()

  props[i] = nextX
  props[i + 1] = nextY
  props[i + 2] = nextVx
  props[i + 3] = nextVy
  props[i + 4] = particleCache.life + 1

  if (
    nextX > canvas.width ||
    nextX < 0 ||
    nextY > canvas.height ||
    nextY < 0 ||
    particleCache.life > particleCache.ttl
  ) {
    initParticle(i)
  }
}

function draw() {
  if (!canvasRef.value || !ctx.value || !particleProps.value) return

  const canvas = canvasRef.value
  const context = ctx.value

  tick.value++

  // 清除畫布，但不填充背景色（保持透明）
  context.clearRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < particleProps.value.length; i += PARTICLE_PROP_COUNT) {
    updateParticle(i)
  }

  context.save()
  context.filter = `blur(8px) brightness(${brightnessAdjustment.value})`
  context.globalCompositeOperation = 'lighter'
  context.drawImage(canvas, 0, 0)
  context.restore()

  context.save()
  context.filter = `blur(4px) brightness(${brightnessAdjustment.value})`
  context.globalCompositeOperation = 'lighter'
  context.drawImage(canvas, 0, 0)
  context.restore()

  animationFrame.value = requestAnimationFrame(draw)
}

// 防抖的 resize 處理函數
function useDebounceFn(fn, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

const handleResize = useDebounceFn(() => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const { innerWidth, innerHeight } = window
  canvas.width = innerWidth
  canvas.height = innerHeight
  center.value = [0.5 * canvas.width, 0.5 * canvas.height]
}, 150)

// 監聽主題變化
watch(isDarkTheme, (newTheme) => {
  console.log('Theme changed to:', newTheme ? 'dark' : 'light')
  // 主題變化時重新初始化粒子
  if (particleProps.value && canvasRef.value) {
    const particlePropsLength = props.particleCount * PARTICLE_PROP_COUNT
    particleProps.value = new Float32Array(particlePropsLength)

    for (let i = 0; i < particlePropsLength; i += PARTICLE_PROP_COUNT) {
      initParticle(i)
    }
  }
})

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  ctx.value = canvas.getContext('2d')
  if (!ctx.value) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  center.value = [0.5 * canvas.width, 0.5 * canvas.height]

  const particlePropsLength = props.particleCount * PARTICLE_PROP_COUNT
  particleProps.value = new Float32Array(particlePropsLength)

  for (let i = 0; i < particlePropsLength; i += PARTICLE_PROP_COUNT) {
    initParticle(i)
  }

  draw()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
  window.removeEventListener('resize', handleResize)

  ctx.value = null
  particleProps.value = null
})
</script>
