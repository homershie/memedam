import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/meme-tags', data)
  },
  batchCreate(data) {
    console.log('📡 memeTagService.batchCreate 調用:')
    console.log('  接收到的數據:', data)
    console.log('  數據類型:', typeof data)
    console.log('  數據keys:', Object.keys(data))
    console.log('  meme_id值:', data.meme_id)
    console.log('  tag_ids值:', data.tag_ids)
    console.log('  數據JSON:', JSON.stringify(data))
    console.log('  端點: POST /meme-tags/batch')
    return apiService.httpAuth.post('/meme-tags/batch', data)
  },
  batchCreateId(id, data) {
    console.log('📡 memeTagService.batchCreateId 調用:')
    console.log('  迷因ID:', id)
    console.log('  數據:', data)
    console.log('  端點: POST /meme-tags/' + id + '/batch')
    return apiService.httpAuth.post(`/meme-tags/${id}/batch`, data)
  },
  getAll() {
    return apiService.http.get('/meme-tags')
  },
  get(id) {
    return apiService.http.get(`/meme-tags/${id}`)
  },
  getTagsByMemeId(memeId) {
    return apiService.http.get(`/meme-tags/meme/${memeId}/tags`)
  },
  getMemesByTagId(tagId) {
    return apiService.http.get(`/meme-tags/tag/${tagId}/memes`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/meme-tags/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/meme-tags/${id}`)
  },
  removeAllTagsByMeme(memeId) {
    return apiService.httpAuth.delete(`/meme-tags/meme/${memeId}/tags`)
  },
}
