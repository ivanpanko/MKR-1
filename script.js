"use strict";
let movies = [];
let deleteTargetId = null;
const initialMovies = [
    { id: "1", title: "Інтерстеллар", genre: "Фантастика", year: 2014, duration: 169, status: "watched", rating: 10 },
    { id: "2", title: "Темний лицар", genre: "Екшн", year: 2008, duration: 152, status: "watched", rating: 9 }
];
const grid = document.getElementById("movie-grid");
const formModal = document.getElementById("form-modal");
const detailsModal = document.getElementById("details-modal");
const deleteModal = document.getElementById("delete-modal");
const movieForm = document.getElementById("movie-form");
const searchInput = document.getElementById("search-input");
const filterGenre = document.getElementById("filter-genre");
const filterStatus = document.getElementById("filter-status");
function loadMovies() {
    const data = localStorage.getItem("movies_data");
    if (data) {
        movies = JSON.parse(data);
    }
    else {
        movies = initialMovies;
        saveMovies();
    }
}
function saveMovies() {
    localStorage.setItem("movies_data", JSON.stringify(movies));
}
function render() {
    grid.innerHTML = "";
    const searchText = searchInput.value.toLowerCase();
    const genreVal = filterGenre.value;
    const statusVal = filterStatus.value;
    const filtered = movies.filter((m) => {
        const matchTitle = m.title.toLowerCase().includes(searchText);
        const matchGenre = genreVal === "all" || m.genre === genreVal;
        const matchStatus = statusVal === "all" || m.status === statusVal;
        return matchTitle && matchGenre && matchStatus;
    });
    filtered.forEach((m) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${m.title}</h3>
            <p><b>Рік:</b> ${m.year}</p>
            <p><b>Оцінка:</b> ${m.rating}/10</p>
            <div class="card-actions">
                <button onclick="openDetails('${m.id}')">Деталі</button>
                <button onclick="openEditForm('${m.id}')">Редагувати</button>
                <button class="btn-danger" onclick="openDeleteModal('${m.id}')">Видалити</button>
            </div>
        `;
        grid.appendChild(card);
    });
}
document.getElementById("btn-add").onclick = () => {
    movieForm.reset();
    document.getElementById("movie-id").value = "";
    document.getElementById("modal-title").textContent = "Додати фільм";
    formModal.classList.remove("hidden");
};
document.getElementById("btn-close-form").onclick = () => formModal.classList.add("hidden");
document.getElementById("btn-close-details").onclick = () => detailsModal.classList.add("hidden");
document.getElementById("btn-cancel-delete").onclick = () => deleteModal.classList.add("hidden");
movieForm.onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById("movie-id").value;
    const movieData = {
        id: id || Date.now().toString(),
        title: document.getElementById("form-title").value,
        genre: document.getElementById("form-genre").value,
        year: Number(document.getElementById("form-year").value),
        duration: Number(document.getElementById("form-duration").value),
        status: document.getElementById("form-status").value,
        rating: Number(document.getElementById("form-rating").value)
    };
    if (id) {
        const index = movies.findIndex((m) => m.id === id);
        if (index !== -1) {
            movies[index] = movieData;
        }
    }
    else {
        movies.push(movieData);
    }
    saveMovies();
    render();
    formModal.classList.add("hidden");
};
function openEditForm(id) {
    const m = movies.find((item) => item.id === id);
    if (!m)
        return;
    document.getElementById("movie-id").value = m.id;
    document.getElementById("form-title").value = m.title;
    document.getElementById("form-genre").value = m.genre;
    document.getElementById("form-year").value = m.year.toString();
    document.getElementById("form-duration").value = m.duration.toString();
    document.getElementById("form-status").value = m.status;
    document.getElementById("form-rating").value = m.rating.toString();
    document.getElementById("modal-title").textContent = "Редагувати фільм";
    formModal.classList.remove("hidden");
}
function openDetails(id) {
    const m = movies.find((item) => item.id === id);
    if (!m)
        return;
    document.getElementById("detail-title").textContent = m.title;
    document.getElementById("detail-genre").textContent = m.genre;
    document.getElementById("detail-year").textContent = m.year.toString();
    document.getElementById("detail-duration").textContent = m.duration.toString();
    document.getElementById("detail-status").textContent = m.status;
    document.getElementById("detail-rating").textContent = m.rating.toString();
    detailsModal.classList.remove("hidden");
}
function openDeleteModal(id) {
    deleteTargetId = id;
    const m = movies.find((item) => item.id === id);
    document.getElementById("delete-movie-title").textContent = m ? m.title : "";
    deleteModal.classList.remove("hidden");
}
document.getElementById("btn-confirm-delete").onclick = () => {
    if (deleteTargetId) {
        movies = movies.filter((m) => m.id !== deleteTargetId);
        saveMovies();
        render();
    }
    deleteModal.classList.add("hidden");
};
// Реєстрація функцій у глобальному об'єкті window для опрацювання onclick у HTML
window.openEditForm = openEditForm;
window.openDetails = openDetails;
window.openDeleteModal = openDeleteModal;
searchInput.oninput = render;
filterGenre.onchange = render;
filterStatus.onchange = render;
loadMovies();
render();