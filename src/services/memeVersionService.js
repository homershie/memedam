import apiService from './apiService'

export default {
  create(data) {
    return apiService.httpAuth.post('/api/meme-versions', data)
  },
  getAll() {
    return apiService.httpAuth.get('/api/meme-versions')
  },
  get(id) {
    return apiService.httpAuth.get(`/api/meme-versions/${id}`)
  },
  getByMemeId(memeId) {
    return apiService.httpAuth.get(`/api/meme-versions?meme_id=${memeId}`)
  },
  update(id, data) {
    return apiService.httpAuth.put(`/api/meme-versions/${id}`, data)
  },
  remove(id) {
    return apiService.httpAuth.delete(`/api/meme-versions/${id}`)
  },
}
