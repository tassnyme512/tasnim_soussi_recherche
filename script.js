const UNSPLASH_ACCESS_KEY = "ND1op4H2pWsat5LNMc1F2CRNDWh5G532N0mKvwERhxA";
const PER_PAGE = 12;
// DOM
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const orientationSelect = document.getElementById("orientation");
const gallery = document.getElementById("gallery");
const status = document.getElementById("status");
const loadMoreBtn = document.getElementById("loadMore");
const loadMoreWrap = document.getElementById("loadMoreWrap");

document.getElementById("year").textContent = new Date().getFullYear();
