const API_KEY = "1d3a0eefa97b499d8fbc4ee93eeb40b7"; // Replace with your NewsAPI key
const url = "https://newsapi.org/v2/everything?q=";

// Event listener for page load
window.addEventListener("load", () => fetchNews("India"));

function reload() {
  window.location.reload();
}

// Fetch news data from the API
async function fetchNews(query) {
  try {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();

    // Log the response to check for issues
    console.log("API Response:", data);

    if (data.status !== "ok") {
      console.error(`Error fetching news: ${data.message}`);
      return;
    }

    // Bind data only if articles exist
    if (data.articles) {
      bindData(data.articles);
    } else {
      console.error("No articles found in the response.");
    }
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

// Populate news articles into the DOM
function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  // Clear out previous news cards
  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;

    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

// Fill in data for each news card
function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source.name} · ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

// Handle navigation item click
let curSelectedNav = null;
function onNavItemClick(id) {
  fetchNews(id);

  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

// Handle search button click
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;

  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});
