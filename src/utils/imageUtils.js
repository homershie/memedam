// 橫式圖片尺寸轉換設定
export const IMAGE_SIZES = {
  s: {
    width: 320,
    height: 240,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
    dpr: 'auto',
    name: '小',
    description: '適合插圖或內嵌小圖',
  },
  m: {
    width: 640,
    height: 480,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
    dpr: 'auto',
    name: '中',
    description: '一般內容圖，清楚又不撐版',
  },
  l: {
    width: 960,
    height: 720,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
    dpr: 'auto',
    name: '大',
    description: '接近滿欄寬，適合重點圖',
  },
  full: {
    width: '100%',
    height: 'auto',
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
    dpr: 'auto',
    name: '滿版',
    description: '自適應容器寬度',
  },
}

// 直式圖片尺寸設定
export const IMAGE_SIZES_PORTRAIT = {
  s: {
    width: 240,
    height: 320,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
    dpr: 'auto',
    name: '小',
    description: '240×320，適合手機',
  },
  m: {
    width: 480,
    height: 640,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
    dpr: 'auto',
    name: '中',
    description: '480×640，一般內容',
  },
  l: {
    width: 720,
    height: 960,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
    dpr: 'auto',
    name: '大',
    description: '720×960，重點圖片',
  },
}

// 從 Cloudinary URL 提取 public_id
export function extractPublicIdFromUrl(url) {
  if (!url) return null

  // 例如：https://res.cloudinary.com/xxx/image/upload/v1234567890/folder/image.jpg
  // 或者：https://res.cloudinary.com/xxx/image/upload/folder/image.jpg
  const parts = url.split('/')
  const uploadIndex = parts.indexOf('upload')
  if (uploadIndex !== -1 && uploadIndex + 1 < parts.length) {
    // 檢查下一個部分是否為版本號（以 v 開頭）
    const nextPart = parts[uploadIndex + 1]
    const startIndex =
      nextPart && nextPart.startsWith('v') ? uploadIndex + 2 : uploadIndex + 1

    if (startIndex < parts.length) {
      return parts
        .slice(startIndex)
        .join('/')
        .replace(/\.[^/.]+$/, '')
    }
  }
  return null
}

// 檢查是否為 Cloudinary URL
export function isCloudinaryUrl(url) {
  return url && url.includes('res.cloudinary.com')
}

// 根據尺寸和方向取得 Cloudinary 圖片 URL
export function getCloudinaryImageUrl(
  publicId,
  size = 'm',
  orientation = 'landscape',
) {
  if (!publicId) return null

  const sizeConfig =
    orientation === 'portrait'
      ? IMAGE_SIZES_PORTRAIT[size] || IMAGE_SIZES_PORTRAIT.m
      : IMAGE_SIZES[size] || IMAGE_SIZES.m

  // 如果是滿版且是橫式，直接返回原始 URL
  if (size === 'full' && orientation === 'landscape') {
    return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/q_auto,f_auto,dpr_auto/${publicId}`
  }

  const transformations = [
    `c_${sizeConfig.crop}`,
    `w_${sizeConfig.width}`,
    `h_${sizeConfig.height}`,
    `q_${sizeConfig.quality}`,
    `f_${sizeConfig.format}`,
    `dpr_${sizeConfig.dpr}`,
  ].join(',')

  return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`
}

// 取得圖片 srcset（支援響應式）
export function getImageSrcset(publicId, orientation = 'landscape') {
  if (!publicId) return null

  const sizes = ['s', 'm', 'l']
  const sizeConfig =
    orientation === 'portrait' ? IMAGE_SIZES_PORTRAIT : IMAGE_SIZES

  const srcset = sizes
    .map((size) => {
      const url = getCloudinaryImageUrl(publicId, size, orientation)
      const width = sizeConfig[size].width
      return `${url} ${width}w`
    })
    .join(', ')

  return srcset
}

// 處理圖片 URL，支援尺寸和方向轉換
export function processImageUrl(url, size = 'm', orientation = 'landscape') {
  if (!url) return url

  // 如果是 Cloudinary URL，進行尺寸轉換
  if (isCloudinaryUrl(url)) {
    const publicId = extractPublicIdFromUrl(url)
    if (publicId) {
      return getCloudinaryImageUrl(publicId, size, orientation)
    }
  }

  // 如果不是 Cloudinary URL，直接返回原始 URL
  return url
}
