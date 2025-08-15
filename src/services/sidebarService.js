import apiService from './apiService.js'

// 側邊欄服務
const sidebarService = {
  // 取得所有可用模板
  async getTemplates() {
    try {
      const response = await apiService.http.get('/api/sidebar/templates')
      return response.data
    } catch (error) {
      console.error('取得模板列表失敗:', error)
      throw error
    }
  },

  // 取得特定模板定義
  async getTemplate(templateName) {
    try {
      const response = await apiService.http.get(
        `/api/sidebar/templates/${templateName}`,
      )
      return response.data
    } catch (error) {
      console.error('取得模板定義失敗:', error)
      throw error
    }
  },

  // 取得迷因的側邊欄資料
  async getMemeSidebar(memeId) {
    try {
      const response = await apiService.http.get(`/api/sidebar/memes/${memeId}`)
      return response.data
    } catch (error) {
      console.error('取得迷因側邊欄失敗:', error)
      throw error
    }
  },

  // 更新迷因的側邊欄資料
  async updateMemeSidebar(memeId, { template, data, schema }) {
    try {
      const response = await apiService.httpAuth.put(
        `/api/sidebar/memes/${memeId}`,
        {
          template,
          data,
          schema,
        },
      )
      return response.data
    } catch (error) {
      console.error('更新迷因側邊欄失敗:', error)
      throw error
    }
  },

  // 重置迷因的側邊欄
  async resetMemeSidebar(memeId, template = 'default') {
    try {
      const response = await apiService.httpAuth.post(
        `/api/sidebar/memes/${memeId}/reset?template=${template}`,
      )
      return response.data
    } catch (error) {
      console.error('重置迷因側邊欄失敗:', error)
      throw error
    }
  },

  // 預覽側邊欄
  async previewSidebar({ template, data }) {
    try {
      const response = await apiService.http.post('/api/sidebar/preview', {
        template,
        data,
      })
      return response.data
    } catch (error) {
      console.error('預覽側邊欄失敗:', error)
      throw error
    }
  },

  // 批次更新側邊欄模板（管理員功能）
  async batchUpdateSidebarTemplate({ memeIds, template }) {
    try {
      const response = await apiService.httpAuth.post(
        '/api/sidebar/batch-update',
        {
          memeIds,
          template,
        },
      )
      return response.data
    } catch (error) {
      console.error('批次更新側邊欄模板失敗:', error)
      throw error
    }
  },
}

export default sidebarService
