/**
 * 檢查是否為外部影片 URL
 */
export function isExternalVideoUrl(url) {
  if (!url) return false
  return (
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('vimeo.com') ||
    url.includes('tiktok.com') ||
    url.includes('twitch.tv') ||
    url.includes('dailymotion.com') ||
    url.includes('bilibili.com')
  )
}

/**
 * 獲取影片嵌入 URL
 */
export function getEmbedUrl(url) {
  if (!url) return ''

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = ''
    if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0]
    } else if (url.includes('youtube.com')) {
      videoId =
        url.match(/[?&]v=([^&]+)/)?.[1] || url.match(/embed\/([^?]+)/)?.[1]
    }
    return `https://www.youtube.com/embed/${videoId}`
  }

  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1]
    return `https://player.vimeo.com/video/${videoId}`
  }

  // TikTok
  if (url.includes('tiktok.com')) {
    const videoId = url.match(/video\/(\d+)/)?.[1]
    if (videoId) {
      return `https://www.tiktok.com/embed/${videoId}`
    }
  }

  // Twitch
  if (url.includes('twitch.tv')) {
    if (url.includes('/videos/')) {
      // 影片
      const videoId = url.match(/\/videos\/(\d+)/)?.[1]
      return `https://player.twitch.tv/?video=v${videoId}&parent=${window.location.hostname}`
    } else if (url.includes('/clip/')) {
      // 剪輯
      const clipId = url.match(/\/clip\/([^?]+)/)?.[1]
      return `https://clips.twitch.tv/embed?clip=${clipId}&parent=${window.location.hostname}`
    } else {
      // 直播
      const channel = url.match(/twitch\.tv\/([^/?]+)/)?.[1]
      return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`
    }
  }

  // Dailymotion
  if (url.includes('dailymotion.com')) {
    const videoId = url.match(/video\/([^?]+)/)?.[1]
    return `https://www.dailymotion.com/embed/video/${videoId}`
  }

  // Bilibili
  if (url.includes('bilibili.com')) {
    const videoId = url.match(/BV([a-zA-Z0-9]+)/)?.[0]
    if (videoId) {
      return `https://player.bilibili.com/player.html?bvid=${videoId}`
    }
  }

  return url
}

/**
 * 檢查是否為外部音訊 URL
 */
export function isExternalAudioUrl(url) {
  if (!url) return false
  return (
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('soundcloud.com') ||
    url.includes('spotify.com') ||
    url.includes('open.spotify.com') ||
    url.includes('anchor.fm') ||
    url.includes('podbean.com') ||
    url.includes('buzzsprout.com') ||
    url.includes('libsyn.com') ||
    url.includes('transistor.fm')
  )
}

/**
 * 獲取音訊嵌入 URL
 */
export function getAudioEmbedUrl(url) {
  if (!url) return ''

  // YouTube (音訊)
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = ''
    if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0]
    } else if (url.includes('youtube.com')) {
      videoId =
        url.match(/[?&]v=([^&]+)/)?.[1] || url.match(/embed\/([^?]+)/)?.[1]
    }
    return `https://www.youtube.com/embed/${videoId}`
  }

  // SoundCloud
  if (url.includes('soundcloud.com')) {
    const trackId = url.match(/tracks\/(\d+)/)?.[1]
    if (trackId) {
      return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`
    }
  }

  // Spotify
  if (url.includes('spotify.com') || url.includes('open.spotify.com')) {
    if (url.includes('/track/')) {
      const trackId = url.match(/track\/([a-zA-Z0-9]+)/)?.[1]
      if (trackId) {
        return `https://open.spotify.com/embed/track/${trackId}`
      }
    } else if (url.includes('/album/')) {
      const albumId = url.match(/album\/([a-zA-Z0-9]+)/)?.[1]
      if (albumId) {
        return `https://open.spotify.com/embed/album/${albumId}`
      }
    } else if (url.includes('/playlist/')) {
      const playlistId = url.match(/playlist\/([a-zA-Z0-9]+)/)?.[1]
      if (playlistId) {
        return `https://open.spotify.com/embed/playlist/${playlistId}`
      }
    } else if (url.includes('/episode/')) {
      const episodeId = url.match(/episode\/([a-zA-Z0-9]+)/)?.[1]
      if (episodeId) {
        return `https://open.spotify.com/embed/episode/${episodeId}`
      }
    } else if (url.includes('/show/')) {
      const showId = url.match(/show\/([a-zA-Z0-9]+)/)?.[1]
      if (showId) {
        return `https://open.spotify.com/embed/show/${showId}`
      }
    }
  }

  // Anchor.fm (Spotify for Podcasters)
  if (url.includes('anchor.fm')) {
    const episodeId = url.match(/episodes\/([^/?]+)/)?.[1]
    if (episodeId) {
      return `https://anchor.fm/embed/episodes/${episodeId}`
    }
  }

  // Podbean
  if (url.includes('podbean.com')) {
    const episodeId = url.match(/e\/([^/?]+)/)?.[1]
    if (episodeId) {
      return `https://www.podbean.com/player-v2/?i=${episodeId}`
    }
  }

  // Buzzsprout
  if (url.includes('buzzsprout.com')) {
    const episodeId = url.match(/episodes\/(\d+)/)?.[1]
    if (episodeId) {
      return `https://www.buzzsprout.com/embed/${episodeId}`
    }
  }

  // Libsyn
  if (url.includes('libsyn.com')) {
    const episodeId = url.match(/episode\/([^/?]+)/)?.[1]
    if (episodeId) {
      return `https://html5-player.libsyn.com/embed/episode/id/${episodeId}`
    }
  }

  // Transistor.fm
  if (url.includes('transistor.fm')) {
    const episodeId = url.match(/episodes\/([^/?]+)/)?.[1]
    if (episodeId) {
      return `https://share.transistor.fm/e/${episodeId}`
    }
  }

  return url
}
