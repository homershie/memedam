/**
 * 分享選項配置
 */
export function getShareOptions() {
  const options = [
    { label: '複製連結', value: 'copylink', icon: 'pi pi-copy' },
    { label: 'Facebook', value: 'facebook', icon: 'pi pi-facebook' },
    { label: 'Instagram', value: 'instagram', icon: 'pi pi-instagram' },
    { label: 'Threads', value: 'threads', icon: 'pi pi-at' },
    { label: 'Line', value: 'line', icon: 'pi pi-comment' },
    { label: 'Twitter', value: 'twitter', icon: 'pi pi-twitter' },
    { label: 'WhatsApp', value: 'whatsapp', icon: 'pi pi-whatsapp' },
    { label: 'Telegram', value: 'telegram', icon: 'pi pi-send' },
  ]

  // 如果支援原生分享API，加入系統分享選項
  if ('share' in navigator) {
    options.unshift({
      label: '系統分享',
      value: 'native',
      icon: 'pi pi-mobile',
    })
  }

  return options
}

/**
 * 檢測是否為行動裝置
 */
export function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

/**
 * 複製連結到剪貼簿
 */
export async function copyToClipboard(url) {
  await navigator.clipboard.writeText(url)
}

/**
 * 開啟應用程式深層連結
 */
export function openAppDeepLink(url) {
  const link = document.createElement('a')
  link.href = url
  link.click()
}

/**
 * 處理 Facebook 分享
 */
export function shareToFacebook(shareUrl) {
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    '_blank',
  )
}

/**
 * 處理 Instagram 分享
 */
export async function shareToInstagram(shareUrl) {
  if (isMobileDevice()) {
    // 行動裝置：嘗試打開 Instagram 應用程式
    const instagramUrl = `instagram://camera`

    // 先複製連結
    await copyToClipboard(shareUrl)

    // 嘗試打開 Instagram 應用
    openAppDeepLink(instagramUrl)

    return {
      success: true,
      message: '連結已複製，請在 Instagram 限時動態或訊息中貼上分享',
      type: 'info',
    }
  } else {
    // 桌面版：引導到 Instagram 網頁版
    await copyToClipboard(shareUrl)
    window.open('https://www.instagram.com/', '_blank')

    return {
      success: true,
      message: '連結已複製，請在 Instagram 限時動態或訊息中貼上分享',
      type: 'info',
    }
  }
}

/**
 * 處理 Threads 分享
 */
export function shareToThreads(shareTitle, shareUrl) {
  window.open(
    `https://www.threads.net/intent/post?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
    '_blank',
  )
}

/**
 * 處理 Line 分享
 */
export function shareToLine(shareTitle, shareUrl) {
  window.open(
    `https://line.me/R/msg/text/?${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
    '_blank',
  )
}

/**
 * 處理 Twitter 分享
 */
export function shareToTwitter(shareTitle, shareUrl) {
  window.open(
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    '_blank',
  )
}

/**
 * 處理 WhatsApp 分享
 */
export function shareToWhatsApp(shareTitle, shareUrl) {
  window.open(
    `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
    '_blank',
  )
}

/**
 * 處理 Telegram 分享
 */
export function shareToTelegram(shareTitle, shareUrl) {
  window.open(
    `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    '_blank',
  )
}

/**
 * 處理系統原生分享
 */
export async function shareToNative(shareTitle, shareText, shareUrl) {
  if (navigator.share) {
    await navigator.share({
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    })
  } else {
    throw new Error('瀏覽器不支援原生分享功能')
  }
}

/**
 * 處理複製連結分享
 */
export async function shareToCopyLink(shareUrl) {
  await copyToClipboard(shareUrl)
  return {
    success: true,
    message: '連結已複製到剪貼簿',
    type: 'success',
  }
}

/**
 * 統一的分享處理器
 */
export async function handlePlatformShare(platform, shareData) {
  const { shareUrl, shareTitle, shareText } = shareData

  switch (platform) {
    case 'native':
      await shareToNative(shareTitle, shareText, shareUrl)
      break
    case 'copylink':
      return await shareToCopyLink(shareUrl)
    case 'facebook':
      shareToFacebook(shareUrl)
      break
    case 'instagram':
      return await shareToInstagram(shareUrl)
    case 'threads':
      shareToThreads(shareTitle, shareUrl)
      break
    case 'line':
      shareToLine(shareTitle, shareUrl)
      break
    case 'twitter':
      shareToTwitter(shareTitle, shareUrl)
      break
    case 'whatsapp':
      shareToWhatsApp(shareTitle, shareUrl)
      break
    case 'telegram':
      shareToTelegram(shareTitle, shareUrl)
      break
    default:
      throw new Error(`不支援的分享平台: ${platform}`)
  }

  return {
    success: true,
    message: '分享成功',
    type: 'success',
  }
}
