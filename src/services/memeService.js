import apiService from './apiService'

// 解析排序參數的輔助函數
const parseSortParam = (sortValue) => {
  // 預設值
  let field = 'createdAt'
  let order = 'desc'

  if (sortValue && sortValue.includes('_')) {
    const parts = sortValue.split('_')
    const fieldPart = parts.slice(0, -1).join('_') // 處理可能包含多個下劃線的欄位名
    const orderPart = parts[parts.length - 1]

    // 欄位名稱轉換：created_at -> createdAt
    if (fieldPart === 'created_at') {
      field = 'createdAt'
    } else if (fieldPart === 'updated_at') {
      field = 'updatedAt'
    } else {
      field = fieldPart
    }

    // 排序方向
    if (orderPart === 'asc' || orderPart === 'desc') {
      order = orderPart
    }
  }

  return { field, order }
}

// 處理參數中的排序設定
const processParams = (params = {}) => {
  const processedParams = { ...params }

  // 如果有 sort 參數且包含下劃線，則進行轉換
  if (
    processedParams.sort &&
    typeof processedParams.sort === 'string' &&
    processedParams.sort.includes('_')
  ) {
    const { field, order } = parseSortParam(processedParams.sort)
    processedParams.sort = field
    processedParams.order = order
  }

  return processedParams
}

export default {
  create(data) {
    return apiService.httpAuth.post('/api/memes', data)
  },
  // 檢查 slug 是否可用
  checkSlugAvailable(slug) {
    return apiService.http.get('/api/memes/slug-available', {
      params: { slug },
    })
  },
  getAll(params = {}) {
    const processedParams = processParams(params)
    // 使用帶權杖的客戶端，讓後端可辨識管理者並放寬狀態限制
    return apiService.httpAuth.get('/api/memes', { params: processedParams })
  },
  // 新增：使用標籤名稱進行基本篩選
  getByTags(tagNames, params = {}) {
    const processedParams = processParams(params)
    const queryParams = {
      ...processedParams,
      tags: Array.isArray(tagNames) ? tagNames.join(',') : tagNames,
    }
    return apiService.http.get('/api/memes', { params: queryParams })
  },
  // 新增：使用標籤ID進行進階篩選
  getByTagIds(tagIds, params = {}) {
    const processedParams = processParams(params)
    const queryParams = {
      ...processedParams,
      tagIds: Array.isArray(tagIds) ? tagIds.join(',') : tagIds,
    }
    return apiService.http.get('/api/memes/by-tags', { params: queryParams })
  },
  // 新增：搜尋功能
  search(searchTerm, params = {}) {
    const processedParams = processParams(params)
    const queryParams = {
      ...processedParams,
      search: searchTerm,
      useFuzzySearch: params.useFuzzySearch ?? true,
    }
    return apiService.http.get('/api/memes', { params: queryParams })
  },
  // 新增：根據標籤搜尋
  searchByTags(searchTerm, tagNames, params = {}) {
    const processedParams = processParams(params)
    const queryParams = {
      ...processedParams,
      search: searchTerm,
      tags: Array.isArray(tagNames) ? tagNames.join(',') : tagNames,
      useFuzzySearch: params.useFuzzySearch ?? true,
    }
    return apiService.http.get('/api/memes', { params: queryParams })
  },
  // 取得搜尋建議
  getSearchSuggestions(query) {
    return apiService.http.get('/api/memes/search-suggestions', {
      params: { q: query },
    })
  },
  get(id) {
    return apiService.http.get(`/api/memes/${id}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/api/memes/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/api/memes/${id}`)
  },

  // 批次更新熱門分數
  batchUpdateHotScores(data = {}) {
    return apiService.httpAuth.post('/api/memes/batch-update-hot-scores', data)
  },

  // 取得熱門迷因列表
  getHotList(params = {}) {
    return apiService.http.get('/api/memes/hot/list', { params })
  },

  // 取得迷因分數分析
  getScoreAnalysis(id) {
    return apiService.http.get(`/api/memes/${id}/score-analysis`)
  },

  // 取得隨機迷因
  getRandom(params = {}) {
    const processedParams = processParams(params)
    return apiService.http.get('/api/memes/random', { params: processedParams })
  },

  // 更新迷因熱門分數
  updateHotScore(id) {
    return apiService.httpAuth.put(`/api/memes/${id}/hot-score`)
  },

  // 新增協作者
  addEditor(id, data) {
    return apiService.httpAuth.post(`/api/memes/${id}/editors`, data)
  },

  // 移除協作者
  removeEditor(id, editorId) {
    return apiService.httpAuth.delete(`/api/memes/${id}/editors`, {
      params: { editorId },
    })
  },

  // 提交修改提案
  proposeEdit(id, data) {
    return apiService.httpAuth.post(`/api/memes/${id}/proposals`, data)
  },

  // 查詢所有提案
  listProposals(id) {
    return apiService.httpAuth.get(`/api/memes/${id}/proposals`)
  },

  // 審核通過提案
  approveProposal(id, proposalId) {
    return apiService.httpAuth.post(
      `/api/memes/${id}/proposals/${proposalId}/approve`,
    )
  },

  // 駁回提案
  rejectProposal(id, proposalId, data = {}) {
    return apiService.httpAuth.post(
      `/api/memes/${id}/proposals/${proposalId}/reject`,
      data,
    )
  },

  // 新增：取得迷因統計
  getStats(params = {}) {
    return apiService.httpAuth.get('/api/memes/stats', { params })
  },

  // 新增：批量操作
  batchUpdate(ids, data) {
    return apiService.httpAuth.put('/api/memes/batch-update', { ids, data })
  },

  // 新增：批量刪除
  batchDelete(ids) {
    return apiService.httpAuth.delete('/api/memes/batch-delete', {
      data: { ids },
    })
  },

  // 新增：內容審核
  approve(memeId) {
    return apiService.httpAuth.put(`/api/memes/${memeId}/approve`)
  },

  // 新增：拒絕內容
  reject(memeId, reason) {
    return apiService.httpAuth.put(`/api/memes/${memeId}/reject`, { reason })
  },

  // 新增：取得待審核內容
  getPendingApproval(params = {}) {
    return apiService.httpAuth.get('/api/memes/pending-approval', { params })
  },

  // 新增：取得內容分析
  getAnalytics(memeId) {
    return apiService.httpAuth.get(`/api/memes/${memeId}/analytics`)
  },

  // 新增：更新標籤
  updateTags(memeId, tags) {
    return apiService.httpAuth.put(`/api/memes/${memeId}/tags`, { tags })
  },

  // 新增：切換狀態
  toggleStatus(memeId, status) {
    return apiService.httpAuth.put(`/api/memes/${memeId}/status`, { status })
  },

  // 新增：切換置頂狀態
  togglePinned(memeId) {
    return apiService.httpAuth.put(`/api/memes/${memeId}/toggle-pinned`)
  },

  // 新增：切換推薦狀態
  toggleFeatured(memeId) {
    return apiService.httpAuth.put(`/api/memes/${memeId}/toggle-featured`)
  },

  // 新增：匯出迷因數據
  exportMemes(params = {}) {
    return apiService.httpAuth.get('/api/memes/export', {
      params,
      responseType: 'blob',
    })
  },
}
