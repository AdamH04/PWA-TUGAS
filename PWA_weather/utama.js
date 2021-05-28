//membuat sebuah array kosong
let animeHistory = []
const API_BASE = "https://api.jikan.me/"
const API_ANIME = API_BASE + "anime/"
const HISTORY_STORAGE_KEY = 'HISTORY_KEY'
    /**
     * membuat sebuah tag dalam objek javascript, yang akan memuat konten
     */
function buildAnimeMarkup(anime) {
    return `<div class="anime_item"><img class='anime_image' src=${anime.image_url} />
        <h2 class='anime_name'>${anime.title}</h2>
        <p class='anime_description'>${anime.premiered}</p></div>`
}



/**
 * menambah dan update saat tampil
 */
function updateHistory(anime) {
    animeHistory.push(anime)
        //simpan secara local
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(animeHistory))

    addAnimeToHistoryTag(anime)
}

function addAnimeToHistoryTag(anime) {
    document.querySelector('#riwayat').innerHTML = buildAnimeMarkup(anime) + document.querySelector('#riwayat').innerHTML
}

/**
 * AMbil info dari internet dan dikembalikan
 */
async function onOkButtonClickAsync() {
    let targetElementId = '#main_anime'
    let animeId = document.querySelector("#anime_id_input").value
    try {
        const response = await fetch(API_ANIME + animeId)
        if (!response.ok) {
            return
        }
        let anime = await response.json()
        console.log("anime", anime)
        document.querySelector(targetElementId).innerHTML = buildAnimeMarkup(anime)

        updateHistory(anime)
    } catch (err) {
        console.error(`error ${err}`)
    }
}

/**
 * Menginstall sebuah service workers
 */
async function installServiceWorkerAsync() {
    if ('serviceWorker' in navigator) {
        try {
            let serviceWorker = await navigator.serviceWorker.register('/sw.js')
            console.log(`Service worker registered ${serviceWorker}`)
        } catch (err) {
            console.error(`Failed to register service worker: ${err}`)
        }
    }
}

function getLocalHistory() {
    return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY))
}

async function onLoadAsync() {
    //load the history from cache
    let history = getLocalHistory()
    if (history !== null) {
        //set the animeHistory array and update the display
        animeHistory = history
        animeHistory.forEach(anime => addAnimeToHistoryTag(anime))
    }

    //Install service worker
    if ('serviceWorker' in navigator) {
        try {
            let serviceWorker = await navigator.serviceWorker.register('/sw.js')
            console.log(`Service worker registered ${serviceWorker}`)
        } catch (err) {
            console.error(`Failed to register service worker: ${err}`)
        }
    }
}