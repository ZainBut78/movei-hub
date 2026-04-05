const BASE_URL = "https://movies-api.accel.li/api/v2/list_movies.json";

const movieDiv = document.querySelector('#movei-div');

const btnTwo = document.querySelector('#btn2');

const pageBtn = document.querySelectorAll('.page-btn')

const pagination = document.querySelector('#pagination');

const inputMoveiName = document.querySelector('#movei-name');

const searchBtn = document.getElementById('search-btn')

const qualitySelect = document.querySelector('#quality');

const genreSelect = document.querySelector('#genre');

const ratingSelect = document.querySelector('#rating');

const yearSelect = document.querySelector('#year');

const languageSelect = document.querySelector('#language');

const orderSelect = document.querySelector('#order');

const spinner = document.querySelector('#spinner');


let totalPages = 0;
let currentPage = 1;

///
async function moveiData(page = 1, query = '', quality = '', genre = '', rating = '0', language = '', order = 'latest') {
    const response = await fetch(`${BASE_URL}?page=${page}&query_term=${query}&quality=${quality}&genre=${genre}&minimum_rating=${rating}&language=${language}&sort_by=${order}`);
    const data = await response.json();


    return data.data


}

// movei dispaly k liye function 

async function displayMovei(page = 1, query = '', quality = '', genre = '', rating = '0', language = '', order = 'latest') {

    spinner.style.display = 'flex';
    const data = await moveiData(page, query, quality, genre, rating, language, order);
    // dta any k bad chupa de ge
    spinner.style.display = 'none';
    const movies = data.movies;
   if (!movies || movies.length === 0) {
    movieDiv.innerHTML = `
        <div class="col-span-5 text-center py-20">
            <p class="text-4xl mb-4">🎬</p>
            <h3 class="text-xl font-bold text-white mb-2">No Movies Found!</h3>
            <p class="text-slate-400">Please check your spelling and try again.</p>
        </div>
    `;
    return;
}
    movieDiv.innerHTML = ''
     
    totalPages = Math.ceil(data.movie_count / data.limit);
    currentPage = data.page_number

    renderPagination(currentPage, totalPages);



    movies.forEach(movei => {
        let newDiv = document.createElement('div');
        newDiv.innerHTML = `<div
                class="group relative movie-card bg-slate-900 border-4 border-white/5 rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer">

                <div class="h-[300px] md:h-[330px] w-full overflow-hidden">
                    <img src="${movei.medium_cover_image}" alt="Movie Name"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                </div>

                <div
                    class="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-10">
                    <div class="text-center mb-6">
                        <span class="text-blue-500 text-3xl">★</span>
                        <h4 class="text-3xl font-black text-white">${movei.rating}<span class="text-xs text-slate-400">/ 10</span>
                        </h4>
                    </div>

                    <div class="flex flex-wrap justify-center gap-2 mb-8">
                             ${movei.genres.map(genre => `
                          <span class="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full text-blue-400">
                            ${genre}
                       </span>
                             `).join('')}
                    </div>

                    <button onclick="goToDetail(${movei.id})"
                        class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all active:scale-95">
                        View Details
                    </button>
                </div>

                <div
                    class="p-2 bg-slate-900/90 absolute bottom-0 w-full group-hover:opacity-0 transition-opacity duration-300">

                    <h5 class="text-sm font-bold text-white truncate leading-tight">${movei.title}</h5>

                    <p class="text-[10px] text-blue-400 ">${movei.year}</p>

                </div>
            
            </div> `;
        movieDiv.appendChild(newDiv);

    });

}

function goToDetail(id) {
    window.location.href = `detailpage.html?movie_id=${id}`;
}

function prepage() {
    currentPage -= 1;
    displayMovei(currentPage);
}

function nextPage() {
    currentPage += 1;
    displayMovei(currentPage);
}

/// yaha pagination function

function renderPagination(currentPage, totalPages) {
    pagination.innerHTML = '';

    // First button
    pagination.appendChild(createBtn('« First', 1));

    // Previous button
    if (currentPage > 1) {
        pagination.appendChild(createBtn('« Prev', currentPage - 1));
    }

    // Page 1 aur 2
    pagination.appendChild(createBtn('1', 1, currentPage === 1));
    pagination.appendChild(createBtn('2', 2, currentPage === 2));

    // dots
    let dots1 = document.createElement('span');
    dots1.innerText = '...';
    dots1.className = 'text-slate-400 px-2';
    pagination.appendChild(dots1);

    // current page ke aas paas
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i > 2 && i < totalPages - 1) {
            pagination.appendChild(createBtn(i, i, i === currentPage));
        }
    }

    // dots
    let dots2 = document.createElement('span');
    dots2.innerText = '...';
    dots2.className = 'text-slate-400 px-2';
    pagination.appendChild(dots2);

    // last 2 pages
    pagination.appendChild(createBtn(totalPages - 1, totalPages - 1, currentPage === totalPages - 1));
    pagination.appendChild(createBtn(totalPages, totalPages, currentPage === totalPages));

    // Next button
    if (currentPage < totalPages) {
        pagination.appendChild(createBtn('Next »', currentPage + 1));
    }
}


function createBtn(text, page, isActive = false) {
    let btn = document.createElement('button');
    btn.innerText = text;
    btn.className = `w-auto px-3 h-8 md:h-10 rounded-lg font-bold text-sm ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`;

    btn.addEventListener('click', () => {
        movieDiv.innerHTML = '';
        displayMovei(page);
    });

    return btn;
}



displayMovei();

// search btn waala bna rahe hain 

searchBtn.addEventListener('click', () => {
    const query = inputMoveiName.value;
    const quality = qualitySelect.value;
    const genre = genreSelect.value;
    const rating = ratingSelect.value;
    const language = languageSelect.value;
    const order = orderSelect.value;
    movieDiv.innerHTML = '';
    displayMovei(1, query, quality, genre, rating, language, order);
})