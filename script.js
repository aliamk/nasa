const resultsNav = document.getElementById('resultsNav')
const favoritesNav = document.getElementById('favoritesNav')
const imagesContainer = document.querySelector('.images-container')
const saveConfirmed = document.querySelector('.save-confirmed')
const loader = document.querySelector('.loader')

// Global Varaibles
const count = 10
const apiKey = 'tABCa5YlTV6EgKN7L2qljbUyFfak5t7vDk0g1ndA'
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`

let resultsArray = []
let favorites = {} // Empty object because it's more efficient to delete by keys than by looping through an array

function showContent(page) {
  window.scrollTo({ top: 0, behavior: 'instant' }) // always start page from top, even when clicking 'Load More'
  loader.classList.add('hidden')
  if (page === 'results') {
    resultsNav.classList.remove('hidden')
    favoritesNav.classList.add('hidden')
  } else {
    resultsNav.classList.add('hidden')
    favoritesNav.classList.remove('hidden')
  }
}

// Separated code in order to switch between displaying API data or data saved in Favorites
function createDOMNodes(page) {
  const currentArray = page === 'results' ? resultsArray : Object.values(favorites)
  // console.log('Current Array', page, currentArray)
  // loader.classList.add('hidden')

  currentArray.forEach((result) => { // Referring to each API parameter as result
    // Card Container
    const card = document.createElement('div')
    card.classList.add('card') // Add this class to the div created
    // HD Image - Link to wrap the image - clicking the main lower-res image will open a new tab showing the HD image
    const link = document.createElement('a')
    link.href = result.hdurl // NASA API has a 'hdurl' parameter
    link.title = 'View Full Image' // Info when hovering on image
    link.target = '_blank' // Open image in new tab
    // Image
    const image = document.createElement('img')
    image.src = result.url // NASA API has a 'url' parameter
    image.alt = 'NASA Picture of the Day' // If image doesn't load, this message will display
    image.loading = 'lazy'
    image.classList.add('card-img-top') //Add this class to the img element created
    // Card Body
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body') // Add this class to the div created
    // Card Title
    const cardTitle = document.createElement('h5')
    cardTitle.classList.add('card-title')
    cardTitle.textContent = result.title // NASA API has a 'title' parameter
    // Save Text - Add to Favorites
    const saveText = document.createElement('p')
    saveText.classList.add('clickable')
    if (page === 'results') {
      saveText.textContent = 'Add To Favourites'
      saveText.setAttribute('onclick', `saveFavorite('${result.url}')`) // Passing dynamic data into function saveFavorites
    } else {
      saveText.textContent = 'Remove Favourite'
      saveText.setAttribute('onclick', `removeFavorite('${result.url}')`) // Passing dynamic data into function removeFavorite
    }
    // Card Text
    const cardText = document.createElement('p')
    cardText.textContent = result.explanation // NASA API has an 'explanation' parameter
    // Footer Container
    const footer = document.createElement('small')
    footer.classList.add('text-muted')
    // Date
    const date = document.createElement('strong')
    date.textContent = result.date
    // Copyright
    const copyrightResult = result.copyright === undefined ? '' : result.copyright
    const copyright = document.createElement('span')
    copyright.textContent = ` ${copyrightResult}` // Only using template string here because we want a space between the date and the copyright
    // Append Everything
    footer.append(date, copyright) // add the data and copyright INSIDE the footer
    cardBody.append(cardTitle, saveText, cardText, footer) // add these 4 INSIDE the cardBody
    link.appendChild(image) // add the images INSIDE the link
    card.append(link, cardBody) // add everything we've built INSIDE card
    // console.log(card)
    imagesContainer.appendChild(card) // add everything we've built INSIDE imagesContainer
  })
}

// Viewing all of the saved favorites 
// Generate the html for displaying saved items
function updateDOM(page) {
  // Get Favorites from localStorage if any are saved
  if (localStorage.getItem('nasaFavorites')) {
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'))
    // console.log('favorites in localStorage', favorites)
  }
  imagesContainer.textContent = ''
  createDOMNodes(page)
  showContent(page)
}

// Fetch 10 images from the NASA API
async function getNasaPictures() {
  loader.classList.remove('hidden')    // Show the loader
  try {
    const response = await fetch(apiUrl)
    resultsArray = await response.json()
    // console.log(resultsArray)
    updateDOM('results')
  } catch (error) {
    // Catch Error Here
  }
}

// Add Item to Favorites (loadlstorage)
function saveFavorite(itemUrl) {
  // console.log(itemUrl)
  // Loop through Results Array to select Favorite
  resultsArray.forEach((item) => { // for every item in the array
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) { // if the url that the user clicks (Add To Fav) matches the url of the item that we're looping through
      favorites[itemUrl] = item // add the whole of the itemUrl to the favorites object
      // console.log(JSON.stringify(favorites))
      // Show Save Confirmation Message
      saveConfirmed.hidden = false
      setTimeout(() => {
        saveConfirmed.hidden = true
      }, 2000)
      // Set Favorites in localStorage
      localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
    }
  })
}

// Remove Item from Favourites
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl]
    // Set Favorites in localStorage
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
    updateDOM('favorites')
  }
}

// On Load
getNasaPictures()