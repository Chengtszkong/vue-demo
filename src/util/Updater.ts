/**
 * 前端重新部署通知用户刷新网页
 */

interface Options {
  timer?: number
}
type Listener = (...args: unknown[]) => void

export class Updater {
  oldScript: string[] // 存储第一次 hash 值
  newScript: string[] // 获取新的 hash 值
  dispatch: Record<string, Listener[]> // 小型发布订阅通知用户更新了
  constructor(options: Options) {
    this.oldScript = []
    this.newScript = []
    this.dispatch = {}
    this.init()
    this.timing(options?.timer) // 轮询
  }

  async init() {
    const html: string = await this.getHtml()
    this.oldScript = this.parseScript(html)
  }

  async getHtml() {
    const html = await fetch('/').then((res) => res.text()) // 读取 index html
    return html
  }

  parseScript(html: string) {
    const reg = new RegExp(/<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/gi)
    return html.match(reg) as string[]
  }

  // 发布订阅通知
  on(key: 'no-update' | 'update', fn: Listener) {
    ;(this.dispatch[key] || (this.dispatch[key] = [])).push(fn)
    return this
  }

  compare(oldArr: string[], newArr: string[]) {
    const base = oldArr.length
    const arr = Array.from(new Set(oldArr.concat(newArr)))
    // 如果新旧length 一样无更新
    if (arr.length === base) {
      this.dispatch['no-update'].forEach((fn) => {
        fn()
      })
    } else {
      // 否则通知更新
      this.dispatch['update'].forEach((fn) => {
        fn()
      })
    }
  }

  timing(time = 10000) {
    // 轮询
    setInterval(async () => {
      const newHtml = await this.getHtml()
      this.newScript = this.parseScript(newHtml)
      this.compare(this.oldScript, this.newScript)
    }, time)
  }
}
