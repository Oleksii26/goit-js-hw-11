import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";



const searchForm = document.querySelector('.search-form')
const seachContainer = document.querySelector('.gallery')
const btnLoadMore = document.querySelector('.load-more')
const endCollectionText = document.querySelector('.search-results')


searchForm.addEventListener('submit', onSearch)
btnLoadMore.addEventListener('click', loadMoreImg)


let currentPage = 1
let currentHits = 0
let searchQuery = ''

async function onSearch(e) {
    e.preventDefault();
    const searchQuery = e.currentTarget.searchQuery.value
   
    if (searchQuery === '') {
        return;
    }

    const response = await fetchImages(searchQuery, currentPage)
    currentHits = response.hits.length

    if (response.total.hits > 40) {
        btnLoadMore.classList.add('is-hidden')
    }
    else {
        btnLoadMore.classList.remove('is-hidden')
    }
    try {
        if (response.totalHits > 0) {
            Notify.success(`We found ${response.totalHits} images.`)
            seachContainer.innerHTML = ''
            renderCardImage(response.hits)
            lightbox.refresh()
            endCollectionText.classList.add('is-hidden')
        }

        if (response.totalHits === 0) {
            seachContainer.innerHTML = ''
            Notify.failure("Oops, search returned no results")
            btnLoadMore.classList.add('is-hidden')
            endCollectionText.classList.remove('is-hidden');
        }
    }
    catch (error) {
        console.log(error)
    }
}

async function loadMoreImg() {
   
    const response = await fetchImages(searchQuery, currentPage)
    renderCardImage(response.hits)
    lightbox.refresh();
    currentHits += response.hits.length
    if (currentHits === response.totalHits) {
        btnLoadMore.classList.add('is-hidden')
        endCollectionText.classList.remove('is-hidden');
    }

}


async function fetchImages(value, page) {
    const url = 'https://pixabay.com/api/'
    const key = '30141749-fb2f341407d461fabdd51ea4f'
    const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    return await axios.get(`${url}${filter}`).then(response => response.data)
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
    seachContainer.insertAdjacentHTML('beforeend', markup)
}



const lightbox = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
});








