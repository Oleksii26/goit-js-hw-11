import fetchImages from './fetch-images'
import { Notify } from 'notiflix/build/notiflix-notify-aio'
import SimpleLightbox from 'simplelightbox'
import 'simplelightbox/dist/simple-lightbox.min.css'



const searchForm = document.querySelector('.search-form')
const gallery = document.querySelector('.gallery')
const loadMoreBtn = document.querySelector('.load-more')
const endCollectionText = document.querySelector('.end-collection-text')

let currentPage = 1
let currentHits = 0
let searchQuery = ''

searchForm.addEventListener('submit', onSubmitSearchForm)

async function onSubmitSearchForm(e) {
  e.preventDefault()
  searchQuery = e.currentTarget.searchQuery.value
  currentPage = 1

  if (searchQuery === '') {
    return
  }

  const response = await fetchImages(searchQuery, currentPage)
  currentHits = response.hits.length

  if (response.totalHits > 40) {
    loadMoreBtn.classList.remove('is-hidden')
  } else {
    loadMoreBtn.classList.add('is-hidden')
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`We found ${response.totalHits} images.`)
      gallery.innerHTML = ''
      renderCardImage(response.hits)
      lightbox.refresh()
      endCollectionText.classList.add('is-hidden')
    }

    if (response.totalHits === 0) {
      gallery.innerHTML = ''
      Notify.failure('Sorry, search returned no results')
      loadMoreBtn.classList.add('is-hidden')
      endCollectionText.classList.add('is-hidden')
    }
  } catch (error) {
    console.log(error)
  }
}

loadMoreBtn.addEventListener('click', onClickLoadMoreBtn)

async function onClickLoadMoreBtn() {
  currentPage += 1
  const response = await fetchImages(searchQuery, currentPage)
  renderCardImage(response.hits)
  lightbox.refresh()
  currentHits += response.hits.length

  if (currentHits === response.totalHits) {
    loadMoreBtn.classList.add('is-hidden')
    endCollectionText.classList.remove('is-hidden')
  }
}

function renderCardImage(arr) {
  const markup = arr.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) =>
    `<div class="photo-card">
     <a href='${largeImageURL}'>
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width='250' /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </div>`).join('')
  gallery.insertAdjacentHTML('beforeend', markup)
}

const lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
})