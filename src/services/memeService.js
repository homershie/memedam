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
  getAll(params = {}) {
    const processedParams = processParams(params)
    return apiService.http.get('/api/memes', { params: processedParams })
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
  // 新增：取得搜尋建議/推薦關鍵字
  getSearchSuggestions() {
    return apiService.http.get('/api/memes/search-suggestions')
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
  addEditor(id, data) {
    return apiService.httpAuth.post(`/api/memes/${id}/editors`, data)
  },
  removeEditor(id) {
    return apiService.httpAuth.delete(`/api/memes/${id}/editors`)
  },
  proposeEdit(id, data) {
    return apiService.httpAuth.post(`/api/memes/${id}/proposals`, data)
  },
  listProposals(id) {
    return apiService.httpAuth.get(`/api/memes/${id}/proposals`)
  },
  approveProposal(id, proposalId) {
    return apiService.httpAuth.post(
      `/api/memes/${id}/proposals/${proposalId}/approve`,
    )
  },
  rejectProposal(id, proposalId) {
    return apiService.httpAuth.post(
      `/api/memes/${id}/proposals/${proposalId}/reject`,
    )
  },

  // 新增：批次更新熱門分數
  batchUpdateHotScores(data = {}) {
    return apiService.httpAuth.post('/api/memes/batch-update-hot-scores', data)
  },

  // 新增：取得熱門迷因列表
  getHotList(params = {}) {
    return apiService.http.get('/api/memes/hot/list', { params })
  },

  // 新增：取得趨勢迷因列表
  getTrendingList(params = {}) {
    return apiService.http.get('/api/memes/trending/list', { params })
  },

  // 新增：取得迷因分數分析
  getScoreAnalysis(id) {
    return apiService.http.get(`/api/memes/${id}/score-analysis`)
  },

  // 新增：取得迷因熱門分數
  getHotScore(id) {
    return apiService.http.get(`/api/memes/${id}/hot-score`)
  },
}
