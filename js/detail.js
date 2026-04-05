
const params = new URLSearchParams(window.location.search);



const movieId = params.get('movie_id');



const DETAIL_URL = "https://movies-api.accel.li/api/v2/movie_details.json";

const moveiTitle = document.getElementById('title');

const moveiYear = document.getElementById('year');

const moveiRating = document.querySelector('#rating')

const moveiLanguage = document.getElementById('language')

const moveiquality = document.querySelector('#quality')

const backgroundImg = document.querySelector('#bg-image');

const posterImg = document.querySelector('#poster');

const genre = document.querySelector('#genres');

const runTime = document.querySelector('#runtime');

const moveiDesc = document.querySelector('#description');

const plotSum = document.querySelector('#summary');

const techSpace = document.getElementById('tech-spaces');

const downloadBtn = document.querySelector('#download-btn');

const similarMovei = document.querySelector('#sim-movei');



async function getMovieDetail() {
    const response = await fetch(`${DETAIL_URL}?movie_id=${movieId}`);
    const data = await response.json();
    const movei = data.data.movie;
    displayMovieDetail(movei);
    getSimilarMovies();
}

getMovieDetail();

//
function displayMovieDetail(movei) {
    // Basic Details
    moveiTitle.textContent = movei.title;
    moveiYear.textContent = `(${movei.year})`;
    moveiLanguage.textContent = movei.language;
    moveiquality.textContent = movei.quality;
    runTime.textContent = `${movei.runtime}m`;
    // moveiDesc.textContent = movei.description_intro;
    plotSum.textContent = movei.description_full;
    const techData = movei.torrents
    techData.forEach(movei => {
        let newDiv = document.createElement('div');
        newDiv.innerHTML = `
        <div class="bg-[#1e293b]/40 backdrop-blur-md border border-white/5 p-6 rounded-[30px] space-y-4 flex flex-col justify-between">
            <div>
                <div class="flex justify-between items-center border-b border-white/5 pb-3">
                    <span class="text-xl font-black text-white">${movei.quality}</span>
                    <span class="text-[10px] font-bold bg-slate-800 px-2 py-1 rounded text-slate-400 uppercase tracking-widest">${movei.type}</span>
                </div>
                
                <div class="space-y-3 pt-3">
                    <div class="flex justify-between text-sm font-semibold">
                        <span class="text-slate-500">Size</span> <span class="text-slate-200">${movei.size}</span>
                    </div>
                    <div class="flex justify-between text-sm font-semibold">
                        <span class="text-slate-500">Seeds</span> <span class="text-green-500">${movei.seeds}</span>
                    </div>
                    <div class="flex justify-between text-sm font-semibold">
                        <span class="text-slate-500">Peers</span> <span class="text-blue-400">${movei.peers}</span>
                    </div>
                    <div class="flex justify-between text-sm font-semibold border-b border-white/5 pb-3">
                        <span class="text-slate-500">Codec</span> <span class="text-slate-200">${movei.video_codec}</span>
                    </div>

                    <div class="pt-2">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <span class="text-blue-500 text-xs">📅</span>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Released on Hub</span>
                                <span class="text-xs text-blue-400 font-mono">${movei.date_uploaded}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

               <a href="${movei.url}" target="_blank" 
               class="block mt-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-4 py-3 rounded-xl text-center transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-600/20">
               Download ${movei.quality} (${movei.size})
              </a>
             </div>
         `;

        techSpace.appendChild(newDiv);

    })



    posterImg.src = movei.large_cover_image;
    backgroundImg.style.backgroundImage = `url('${movei.background_image_original || movei.background_image}')`;

    genre.innerHTML = '';


    moveiRating.innerHTML = `${movei.rating} <span class="text-[10px] opacity-70 ml-1">IMDb</span>`;

    movei.genres.forEach(item => {
        const span = document.createElement('span');
        span.className = "bg-slate-800/50 backdrop-blur-md px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border border-white/5 cursor-pointer transition hover:text-blue-400 hover:border-blue-500/50";
        span.textContent = item;
        genre.appendChild(span);
    });

    downloadBtn.addEventListener('click', () => {
        const torrentUrl = movei.torrents[0].url;
        window.open(torrentUrl, '_blank');
    })




}

// similar movei wala section 

async function getSimilarMovies() {
    const response = await fetch(`https://movies-api.accel.li/api/v2/movie_suggestions.json?movie_id=${movieId}`);
    const data = await response.json();
    const movies = data.data.movies;
    displaySimilarMovies(movies);
}

function displaySimilarMovies(movies) {
    movies.forEach(movie => {
        let newDiv = document.createElement('div');
        newDiv.innerHTML = `
            <div class="space-y-3 group cursor-pointer">
                <div class="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 group-hover:border-blue-500 group-hover:shadow-[0_0_25px_rgba(37,99,235,0.3)]">
                    <img src="${movie.medium_cover_image}"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                </div>
                <p class="text-sm font-black text-white truncate px-1 group-hover:text-blue-400 transition-colors">
                    ${movie.title} (${movie.year})
                </p>
                  </div>
                   `;
        similarMovei.appendChild(newDiv);
    });
}
