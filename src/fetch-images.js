import axios from 'axios'

export default async function fetchImages(value, page) {
  const url = 'https://pixabay.com/api/'
  const key = '30141749-fb2f341407d461fabdd51ea4f'
  const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`

  return await axios.get(`${url}${filter}`).then(response => response.data)
}

