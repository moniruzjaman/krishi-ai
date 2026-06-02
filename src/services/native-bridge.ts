'use client'

export interface KrishiNative {
  getLocation: () => Promise<{ lat: number; lng: number }>
  requestCamera: () => Promise<boolean>
  secureStore: (key: string, value: string) => Promise<void>
  secureGet: (key: string) => Promise<string | null>
  share: (text: string) => Promise<void>
  isAvailable: () => boolean
}

declare global {
  interface Window {
    KrishiNative?: {
      getLocation?: () => void
      requestCamera?: () => void
      secureStore?: (key: string, value: string) => void
      secureGet?: (key: string) => void
      share?: (text: string) => void
    }
    KrishiNativeReady?: boolean
    KrishiLocation?: { lat: number; lng: number }
    KrishiCameraPermission?: boolean
    KrishiSecureData?: string
  }
}

const BRIDGE_READY_KEY = 'KrishiNativeReady'

class NativeBridgeService implements KrishiNative {
  private bridgeReady = false
  private pendingRequests: Map<string, { resolve: (v: unknown) => void; reject: (e: Error) => void }> = new Map()
  private requestCounter = 0

  constructor() {
    if (typeof window === 'undefined') return
    if (window[BRIDGE_READY_KEY as keyof Window]) {
      this.bridgeReady = true
    }
    window.addEventListener('message', this.handlePostMessage)
    this.injectBridgeDetection()
  }

  private injectBridgeDetection() {
    const check = () => {
      if (window.KrishiNativeReady || window.KrishiNative) {
        this.bridgeReady = true
      }
    }
    check()
    setTimeout(check, 500)
    setTimeout(check, 1500)
  }

  private handlePostMessage = (event: MessageEvent) => {
    const { type, data, requestId } = event.data || {}
    if (!type) return

    switch (type) {
      case 'KrishiLocation':
        window.KrishiLocation = data
        this.resolvePending('getLocation', data)
        break
      case 'KrishiCameraPermission':
        window.KrishiCameraPermission = data
        this.resolvePending('requestCamera', data)
        break
      case 'KrishiSecureData':
        window.KrishiSecureData = data
        this.resolvePending('secureGet', data)
        break
    }
  }

  private resolvePending(type: string, data: unknown) {
    const reqId = `${type}_${this.requestCounter}`
    const pending = this.pendingRequests.get(reqId)
    if (pending) {
      pending.resolve(data)
      this.pendingRequests.delete(reqId)
    }
  }

  private callBridge(method: string, ...args: unknown[]): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (!this.bridgeReady || !window.KrishiNative?.[method as keyof typeof window.KrishiNative]) {
        reject(new Error(`Native bridge not available: ${method}`))
        return
      }
      this.requestCounter++
      const reqId = `${method}_${this.requestCounter}`
      this.pendingRequests.set(reqId, { resolve, reject } as never)
      const fn = window.KrishiNative[method as keyof typeof window.KrishiNative]
      if (typeof fn === 'function') {
        ;(fn as (...a: unknown[]) => void)(...args)
      }
      setTimeout(() => {
        if (this.pendingRequests.has(reqId)) {
          this.pendingRequests.delete(reqId)
          reject(new Error(`Bridge call timeout: ${method}`))
        }
      }, 10000)
    })
  }

  isAvailable(): boolean {
    return this.bridgeReady && !!window.KrishiNative
  }

  async getLocation(): Promise<{ lat: number; lng: number }> {
    if (!this.isAvailable()) {
      return this.fallbackLocation()
    }
    try {
      const result = await this.callBridge('getLocation')
      return result as { lat: number; lng: number }
    } catch {
      return this.fallbackLocation()
    }
  }

  private fallbackLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: 23.8103, lng: 90.4125 })
        return
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: 23.8103, lng: 90.4125 }),
        { timeout: 5000, enableHighAccuracy: true }
      )
    })
  }

  async requestCamera(): Promise<boolean> {
    if (!this.isAvailable()) {
      return this.fallbackCamera()
    }
    try {
      const result = await this.callBridge('requestCamera')
      return result as boolean
    } catch {
      return this.fallbackCamera()
    }
  }

  private async fallbackCamera(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((t) => t.stop())
      return true
    } catch {
      return false
    }
  }

  async secureStore(key: string, value: string): Promise<void> {
    if (!this.isAvailable()) {
      localStorage.setItem(`krishi-secure-${key}`, value)
      return
    }
    try {
      await this.callBridge('secureStore', key, value)
    } catch {
      localStorage.setItem(`krishi-secure-${key}`, value)
    }
  }

  async secureGet(key: string): Promise<string | null> {
    if (!this.isAvailable()) {
      return localStorage.getItem(`krishi-secure-${key}`)
    }
    try {
      const result = await this.callBridge('secureGet', key)
      return (result as string) ?? localStorage.getItem(`krishi-secure-${key}`)
    } catch {
      return localStorage.getItem(`krishi-secure-${key}`)
    }
  }

  async share(text: string): Promise<void> {
    if (!this.isAvailable()) {
      if (navigator.share) {
        await navigator.share({ text })
      }
      return
    }
    try {
      await this.callBridge('share', text)
    } catch {
      if (navigator.share) {
        await navigator.share({ text })
      }
    }
  }
}

export const nativeBridge = new NativeBridgeService()

export function useNativeBridge(): KrishiNative {
  return nativeBridge
}
