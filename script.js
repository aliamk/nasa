const resultsNav = document.getElementById('resultsNav')
const favoritesNav = document.getElementById('favoritesNav')
const imagesContainer = document.querySelector('.images-container')
const saveConfirmed = document.querySelector('.save-confirmed')
const loader = document.querySelector('.loader')



// NASA API
const count = 10
const apiKey = 'DEMO_KEY'
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`

let resultsArray = []

// Generate the html that will hold the data from the NASA images API
function updateDOM() {
  resultsArray.forEach((result) => {
    // Card Container
    const card = document.createElement('div')
    card.classList.add('card') // Add this class to the div created
    // Link to wrap the image
    const link = document.createElement('a')
    link.href = result.hdurl // NASA API has a hdurl parameter
    link.title = 'View Full Image' // Info when hovering on image
    link.target = '_blank' // Open image in new tab
    // Image
    const image = document.createElement('img')
    image.src = result.url // NASA API has a url parameter
    image.alt = 'NASA Picture of the Day' // If image doesn't load, this message will display
    image.loading = 'lazy'
    image.classList.add('card-img-top') //Add this class to the img element created
    // Card Body
    const cardBody = document.createElement('div')
    card.classList.add('card-body') // Add this class to the div created
    // Card Title
    const cardTitle = document.createElement('h5')
    cardTitle.classList.add('card-title')
    cardTitle.textContent = result.title // NASA API has a title parameter
    // Save Text
    const saveText = document.createElement('p')
    saveText.classList.add('clickable')
    saveText.textContent = 'Add To Favourites'
    // Card Text
    const cardText = document.createElement('p')
    cardText.textContent = result.explanation // NASA API has an explanation parameter
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

// Get 10 images from NASA API
async function getNasaPictures() {
  try {
    const response = await fetch(apiUrl)
    resultsArray = await response.json()
    console.log(resultsArray)
    updateDOM()
  } catch (error) {
    // Catch Error Here
  }
}

// On Load
getNasaPictures()