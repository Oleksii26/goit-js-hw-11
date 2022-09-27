// import axios from 'axios';
import fetchImages from './fetch-images'
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
    currentPage = 1

    if (searchQuery === '') {
        return;
    }

    const response = await fetchImages(searchQuery, currentPage)
    currentHits = response.hits.length
    console.log(response.totalHits)
    if (response.totalHits > 40) {
        btnLoadMore.classList.remove('is-hidden')
    }
    else {
        btnLoadMore.classList.add('is-hidden')
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
    currentPage += 1

    const res = await fetchImages(searchQuery, currentPage)
    renderCardImage(res.hits)
    lightbox.refresh();
    currentHits += res.hits.length
    if (currentHits === res.totalHits) {
        btnLoadMore.classList.add('is-hidden')
        endCollectionText.classList.remove('is-hidden');
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
    seachContainer.insertAdjacentHTML('beforeend', markup)
}

const lightbox = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
});








