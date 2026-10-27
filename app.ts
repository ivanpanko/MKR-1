type MovieStatus = 'planned' | 'watching' | 'watched';

interface Movie {
    id: string;
    title: string;
    genre: string;
    year: number;
    duration: number;
    status: MovieStatus;
    rating: number;
}

let movies: Movie[] = [];
let deleteTargetId: string | null = null;

const initialMovies: Movie[] = [
    { id: "1", title: "Інтерстеллар", genre: "Фантастика", year: 2014, duration: 169, status: "watched", rating: 10 },
    { id: "2", title: "Темний лицар", genre: "Екшн", year: 2008, duration: 152, status: "watched", rating: 9 }
];

const grid = document.getElementById("movie-grid") as HTMLDivElement;
const formModal = document.getElementById("form-modal") as HTMLDivElement;
const detailsModal = document.getElementById("details-modal") as HTMLDivElement;
const deleteModal = document.getElementById("delete-modal") as HTMLDivElement;
const movieForm = document.getElementById("movie-form") as HTMLFormElement;

const searchInput = document.getElementById("search-input") as HTMLInputElement;
const filterGenre = document.getElementById("filter-genre") as HTMLSelectElement;
const filterStatus = document.getElementById("filter-status") as HTMLSelectElement;

function loadMovies(): void {
    const data: string | null = localStorage.getItem("movies_data");
    if (data) {
        movies = JSON.parse(data) as Movie[];
    } else {
        movies = initialMovies;
        saveMovies();
    }
}

function saveMovies(): void {
    localStorage.setItem("movies_data", JSON.stringify(movies));
}

function render(): void {
    grid.innerHTML = "";
    
    const searchText: string = searchInput.value.toLowerCase();
    const genreVal: string = filterGenre.value;
    const statusVal: string = filterStatus.value;

    const filtered: Movie[] = movies.filter((m: Movie) => {
        const matchTitle: boolean = m.title.toLowerCase().includes(searchText);
        const matchGenre: boolean = genreVal === "all" || m.genre === genreVal;
        const matchStatus: boolean = statusVal === "all" || m.status === statusVal;
        return matchTitle && matchGenre && matchStatus;
    });

    filtered.forEach((m: Movie) => {
        const card: HTMLDivElement = document.createElement("div");
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

(document.getElementById("btn-add") as HTMLButtonElement).onclick = () => {
    movieForm.reset();
    (document.getElementById("movie-id") as HTMLInputElement).value = "";
    (document.getElementById("modal-title") as HTMLElement).textContent = "Додати фільм";
    formModal.classList.remove("hidden");
};

(document.getElementById("btn-close-form") as HTMLButtonElement).onclick = () => formModal.classList.add("hidden");
(document.getElementById("btn-close-details") as HTMLButtonElement).onclick = () => detailsModal.classList.add("hidden");
(document.getElementById("btn-cancel-delete") as HTMLButtonElement).onclick = () => deleteModal.classList.add("hidden");

movieForm.onsubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const id: string = (document.getElementById("movie-id") as HTMLInputElement).value;
    
    const movieData: Movie = {
        id: id || Date.now().toString(),
        title: (document.getElementById("form-title") as HTMLInputElement).value,
        genre: (document.getElementById("form-genre") as HTMLSelectElement).value,
        year: Number((document.getElementById("form-year") as HTMLInputElement).value),
        duration: Number((document.getElementById("form-duration") as HTMLInputElement).value),
        status: (document.getElementById("form-status") as HTMLSelectElement).value as MovieStatus,
        rating: Number((document.getElementById("form-rating") as HTMLInputElement).value)
    };

    if (id) {
        const index: number = movies.findIndex((m: Movie) => m.id === id);
        if (index !== -1) {
            movies[index] = movieData;
        }
    } else {
        movies.push(movieData);
    }

    saveMovies();
    render();
    formModal.classList.add("hidden");
};

function openEditForm(id: string): void {
    const m: Movie | undefined = movies.find((item: Movie) => item.id === id);
    if (!m) return;

    (document.getElementById("movie-id") as HTMLInputElement).value = m.id;
    (document.getElementById("form-title") as HTMLInputElement).value = m.title;
    (document.getElementById("form-genre") as HTMLSelectElement).value = m.genre;
    (document.getElementById("form-year") as HTMLInputElement).value = m.year.toString();
    (document.getElementById("form-duration") as HTMLInputElement).value = m.duration.toString();
    (document.getElementById("form-status") as HTMLSelectElement).value = m.status;
    (document.getElementById("form-rating") as HTMLInputElement).value = m.rating.toString();

    (document.getElementById("modal-title") as HTMLElement).textContent = "Редагувати фільм";
    formModal.classList.remove("hidden");
}

function openDetails(id: string): void {
    const m: Movie | undefined = movies.find((item: Movie) => item.id === id);
    if (!m) return;

    (document.getElementById("detail-title") as HTMLElement).textContent = m.title;
    (document.getElementById("detail-genre") as HTMLElement).textContent = m.genre;
    (document.getElementById("detail-year") as HTMLElement).textContent = m.year.toString();
    (document.getElementById("detail-duration") as HTMLElement).textContent = m.duration.toString();
    (document.getElementById("detail-status") as HTMLElement).textContent = m.status;
    (document.getElementById("detail-rating") as HTMLElement).textContent = m.rating.toString();

    detailsModal.classList.remove("hidden");
}

function openDeleteModal(id: string): void {
    deleteTargetId = id;
    const m: Movie | undefined = movies.find((item: Movie) => item.id === id);
    (document.getElementById("delete-movie-title") as HTMLElement).textContent = m ? m.title : "";
    deleteModal.classList.remove("hidden");
}

(document.getElementById("btn-confirm-delete") as HTMLButtonElement).onclick = () => {
    if (deleteTargetId) {
        movies = movies.filter((m: Movie) => m.id !== deleteTargetId);
        saveMovies();
        render();
    }
    deleteModal.classList.add("hidden");
};

(window as unknown as Record<string, unknown>).openEditForm = openEditForm;
(window as unknown as Record<string, unknown>).openDetails = openDetails;
(window as unknown as Record<string, unknown>).openDeleteModal = openDeleteModal;

searchInput.oninput = render;
filterGenre.onchange = render;
filterStatus.onchange = render;

loadMovies();
render();