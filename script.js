import { fetchAxios, render, renderError } from "./functions.js";

const api_url = " https://restcountries.com/v3.1/";
const APY_KEY = "";
//const Country = document.querySelectorAll(".Country");
const countryContainer = document.querySelector("#countryContainer");
const countryList = document.querySelector("#countryList");
const AllCountry = document.querySelector("#AllCountry");
const searchInput = document.getElementById("searchInput");
const homePage = document.querySelector("#homePage");
const fiveCountries = ["Israel", "United States of America", "Thailand", "France", "United Kingdom"];
const allCountries = [];

const creatCountryAllData = (obj) => {

    const colEL = document.createElement("div");
    colEL.className = `row justify-content-around text-white p-5`;


    const keys = Object.keys(obj.languages);
    const keyValueStrings = keys.map(key => `${obj.languages[key]}`);
    const resultString = keyValueStrings.join(', ');


    const countrySize = obj.area;
    const constantValue = 14;
    const zoomLevel = Math.max(0, Math.round(constantValue - 0.468 * Math.log2(countrySize)));

    colEL.innerHTML = `
    <div class="col-md-5">
    <iframe width="100%" height="70%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
            src="https://maps.google.com/maps?q=${obj.latlng[0]},${obj.latlng[1]}&hl=es&z=${zoomLevel}&amp;output=embed">
            </iframe>
    </div>
    <div class="col-md-5">
        <img src=${obj.flags.png} alt="${obj.flags.alt}">
        <h4 class="display-6">${obj.name.common}</h4>
        <p><strong>Capital:</strong> ${obj.capital}<br><strong>Population:</strong> ${obj.population}<br><strong>Languages:</strong> ${resultString}</p>
    </div>`

    if (obj.borders) {
        const bordersContainer = document.createElement("div");
        bordersContainer.className = "text-center text-white col-12"
        bordersContainer.innerHTML = `<p class="display-5">Borders:</p>`
        console.log(obj.borders);
        obj.borders.map(el => {
            bordersContainer.innerHTML += `<a href="#" id=${el} class="borders pe-1 fw-bold text-white">${el}</a>`;
        })
        colEL.appendChild(bordersContainer);
    }

    console.log(colEL);
    return colEL;
}

const creatCountry = (obj) => {
    console.log(obj);

    const colEL = document.createElement("div");
    colEL.className = "col-md-4 mt-5 Country";
    const cardEl = document.createElement("div");
    cardEl.className = "card p-3 shadow";
    cardEl.style = "width: 18rem;";
    cardEl.innerHTML = `
    <img style="width: 16rem; height: 10em;"  class="card-img-top" src=${obj.flags.png} alt=${obj.flags.alt} />
    <div class="card-body">
    <p style="font-size: 1.5em;" class="card-text fw-bold">${obj.name.common}</p>
    
  </div>`;
    colEL.append(cardEl);
    console.log(colEL);
    return colEL;

}
const createListItem = (obj) => {
    const listEL = document.createElement("option");
    listEL.value = obj.name.common;
    listEL.className = "Country";
    listEL.innerText += `${obj.name.common}`;
    return listEL;
}



await fetchAxios(api_url + "all", { fields: "name,flags" })
    .then(data => { allCountries.push(data) })
    .catch(err => console.log(err));



allCountries[0].sort((a, b) => a.name.common.localeCompare(b.name.common));
allCountries[0].map((item) => {
    render(item, countryList, createListItem);
});

const renderHomePage = () => {
    countryContainer.innerHTML = '';
    fiveCountries.map(item => {

        fetchAxios(api_url + "name/" + item, { fields: "name,flags" })
            .then(data => {
                render(data[0], countryContainer, creatCountry);
            })
            .catch(err => console.log(err))
    });
}
renderHomePage();


document.body.addEventListener("click", (ev) => {
    const clickedElement = ev.target.closest('.Country');
    console.log(clickedElement);
    if (clickedElement) {
        let name = clickedElement.innerText;
        if (name.toLowerCase() == "united states") name = "United States of America";
        fetchAxios(api_url + "name/" + name, {})
            .then((data) => {
                countryContainer.innerHTML = "";
                console.log(data);
                render(data[0], countryContainer, creatCountryAllData);
            })
            .catch((err) => console.log(err));
    }
});
countryContainer.addEventListener("click", (ev) => {
    const clickedElement = ev.target.closest('.borders');
    console.log(clickedElement);
    if (clickedElement) {
        fetchAxios(api_url + "alpha/" + clickedElement.id, {})
            .then((data) => {
                countryContainer.innerHTML = "";
                console.log(data);
                render(data[0], countryContainer, creatCountryAllData);
            })
            .catch((err) => console.log(err));
    }
});
countryList.addEventListener("change", (ev) => {
    let name = ev.target.selectedOptions[0].innerText;
    if (name.toLowerCase() == "united states") name = "United States of America";
    fetchAxios(api_url + "name/" + name, {})
        .then((data) => {
            countryContainer.innerHTML = "";
            console.log(data);
            render(data[0], countryContainer, creatCountryAllData);
        })
        .catch((err) => console.log(err));

});


AllCountry.addEventListener("click", () => {
    countryContainer.innerHTML = '';
    allCountries[0].map(item => {
        render(item, countryContainer, creatCountry);
    })
})

homePage.addEventListener("click", () => {
    renderHomePage();
})



searchForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    let name = searchInput.value;
    if (name.toLowerCase() == "united states") name = "United States of America";
    fetchAxios(api_url + "name/" + name, {})
        .then((data) => {
            countryContainer.innerHTML = "";
            console.log(data);
            render(data[0], countryContainer, creatCountryAllData);
        })
        .catch((err) => { console.log(err); renderError(countryContainer); alert("This Country Is Not Exist") });

});


