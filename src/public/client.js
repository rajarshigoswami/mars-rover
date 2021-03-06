let store = {
    defaultTab: "Curiosity",
    rovers: Immutable.List(["Curiosity", "Opportunity", "Spirit"]),
};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
    store = Object.assign(store, newState);
    render(root, store);
};

const filterImages = (images) => images.slice(0, 10);

const render = async (root, state) => {
    root.innerHTML = App(state);
    showSlides(1);
};

const roversList = () => {
    const { rovers, defaultTab } = store;
    return rovers
        .map(
            (rover) =>
                `<button class="tablinks ${
                    defaultTab === rover ? "active" : ""
                }" onclick="switchRover(event, '${rover}')">${rover}</button>`
        )
        .join("");
};
const roversTab = () => {
    return `<div class="tab">${roversList()} </div>`;
};

const ImageCarousel = (images, LoadingContainer) => {
    if (!images || images.length <= 0) return LoadingContainer();
    const imageLength = images.length;
    const carousel = images.map((image, idx) => {
        return `<div class="mySlides fade">
                <div class="numbertext">${idx + 1} / ${imageLength}</div>
                <img src="${image.img_src}" style="width:100%">
                <div class="text">
                ${image.rover.name} - ${image.camera.full_name}
                <p> Launch Date: ${image.rover.launch_date}</p>
                <p> Landing Date: ${image.rover.landing_date} </p>
                <p> Status: ${image.rover.status}</p>
                <p> Date: ${image.earth_date}</p>
                </div>
            </div>`;
    });

    return `<div class="slideshow-container"> ${carousel.join("")} <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
    <a class="next" onclick="plusSlides(1)">&#10095;</a> </div>`;
};
// create content
const App = (state) => {
    let { defaultTab } = store;
    const images = state[defaultTab] || [];

    return `
        <header></header>
        <main>
            <section>
                <div class="tab">
                    ${roversTab()}
                </div>
                <div id="${defaultTab}" class="tabcontent active">
                    ${ImageCarousel(images, LoadingContainer)}
                </div>
            </section>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
    render(root, store);
});

const switchRover = (Event, tab) => {
    updateStore(store, {
        defaultTab: tab,
    });
};

const plusSlides = (n) => {
    showSlides((slideIndex += n));
};

let slideIndex = 1;
const showSlides = (n) => {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    if (slides.length === 0) return;
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    if (slides[slideIndex - 1]) slides[slideIndex - 1].style.display = "block";
};

const LoadingContainer = () => {
    const { defaultTab } = store;
    if (!store[defaultTab]) {
        getImageOfTheDay(store);
    }
    return `<div class="loader"></div>`;
};
const getImageOfTheDay = (state) => {
    let { defaultTab } = state;
    const currDate = new Date().toISOString().split("T")[0];
    fetch(`http://localhost:3000/image?curr_date=${currDate}&rover=${defaultTab.toLowerCase()}`)
        .then((res) => res.json())
        .then((apod) => updateStore(store, { [defaultTab]: filterImages(apod.data.photos) }));
};
