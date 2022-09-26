import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
// import ImagesApiService from './js/images-service';


const searchForm = document.querySelector('.search-form')
const btnSearch = document.querySelector('button')
const seachContainer = document.querySelector('.gallery')
const btnLoadMore = document.querySelector('.load-more')


searchForm.addEventListener('submit', onSearch)
btnLoadMore.addEventListener('click', loadMoreImg)


let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

async function onSearch(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const searchQuery = form.elements.searchQuery.value
    console.log(searchQuery)

    currentPage = 1

    if (searchQuery === '') {
        return;
    }

    const response = await fetchImages(searchQuery, currentPage)
    currentHits = response.hits.length

    if (response.total.hits > 40) {
        btnLoadMore.classList.remove('.is-hidden')
    }
    else {
        btnLoadMore.classList.add('.is-hidden')
    }
    try {
        if (response.totalHits > 0) {
            Notify.success(`Hooray! We found ${response.totalHits} images.`)
            seachContainer.innerHTML = ''
            renderCardImage(response.hits)
            lightbox.refresh()
            end - collection - text.classList.add('.is-hidden')

            const { height: cardHeight } = document.querySelector('.gallery')
                .firstElementChild
                .getBoundingClientRect();

            window.scrollBy({
                top: cardHeight * -100,
                behavior: 'smooth'
            })
        }
        if (response.totalHits === 0) {
            seachContainer.innerHTML = ''
            function eroorName() {
                Notify.failure("Oops, there is no country with that name")
                btnLoadMore.classList.add('.is-hidden')
            }
        }
    }
    catch (error) {
        console.log(error)
    }
}

async function loadMoreImg() {
    currentPage += 1
    const response = await fetchImages(searchQuery, currentPage)
    renderCardImage(response.hits)
    lightbox.refresh();
    currentHits += response.hits.length
    if (currentHits === response.totalHits) {
        // btnLoadMore.classList.add('is-hidden')
        endCollectionText.classList.remove('is-hidden');
    }
}


async function fetchImages(value, page) {
    const url = 'https://pixabay.com/api/'
    const key = '30141749-fb2f341407d461fabdd51ea4f'
    const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

    return await axios.get(`${url}${filter}`).then(res => res.data)
}

fetchImages()

function renderCardImage(arr) {
    const markup = arr.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
     <a href='${largeImageURL}'>${tags}</a>
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width='250' />
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
    console.log(markup)
    seachContainer.insertAdjacentHTML('beforeend', markup)
}



const lightbox = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
});








