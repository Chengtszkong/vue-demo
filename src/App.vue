<script setup lang="ts">
import { Updater } from '@/util/Updater'
import { ElButton, ElNotification } from 'element-plus'
import { h } from 'vue'

const up = new Updater({ timer: 5000 })

// 未更新通知
up.on('no-update', () => {
  console.log('未更新')
})

// 更新通知
up.on('update', () => {
  console.log('更新了')
  const notification = ElNotification({
    title: '系统有新版本',
    message: h('div', { style: 'display: flex; flex-direction: column; gap: 8px;' }, [
      h('span', '检测到更新，刷新页面即可体验最新功能'),
      h(
        ElButton,
        {
          type: 'primary',
          size: 'small',
          onClick: () => {
            notification.close()
            location.reload()
          },
        },
        () => '立即刷新',
      ),
    ]),
    // message: '检测到更新，刷新页面即可体验最新功能',
    duration: 0,
  })
})
</script>

<template>
  <div></div>
</template>

<style scoped></style>
