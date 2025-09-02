import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-tw'

dayjs.extend(relativeTime)
dayjs.locale('zh-tw')

/**
 * 處理 MongoDB ObjectId 格式
 * 支援各種格式: string, {$oid: ...}, {_id: ...}, {id: ...}
 */
export function getId(val) {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'object' && val.$oid) return val.$oid
  return val._id || val.id || ''
}

/**
 * 格式化發布時間
 * 支援 created_at 或 createdAt，並處理 {$date: ...} 格式
 */
export function formatPublishedTime(timeData) {
  let time = timeData?.created_at || timeData?.createdAt
  if (typeof time === 'object' && time.$date) {
    time = time.$date
  }
  if (!time) return ''
  return dayjs(time).fromNow()
}

/**
 * 計算 memeId（統一處理）
 */
export function getMemeId(meme) {
  let id = meme.id || meme._id
  if (typeof id === 'object' && id.$oid) {
    id = id.$oid
  }
  return id
}

/**
 * 計算 memeSlug（統一處理，優先返回slug，fallback到id）
 */
export function getMemeSlug(meme) {
  // 優先使用slug（如果存在且有效）
  if (meme.slug && typeof meme.slug === 'string' && meme.slug.trim()) {
    return meme.slug.trim()
  }

  // fallback到id
  return getMemeId(meme)
}
