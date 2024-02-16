//! DOM Elements
const form = document.querySelector('form');

//! Global Variables
const API_KEY = '2b6b2c75790565a4f251171556ece413';
let cities = {};
// cities = {
//   'Boston, US': {
//     name: 'Boston',
//     description: 'few clouds',
//     icon: '10d',
//     temp: 65,
//     country: 'US',
//     time: 232233223,
//   },
//   'Paris, FR': {
//     name: 'Paris',
//     description: 'few clouds',
//     icon: '10d',
//     temp: 75,
//     country: 'FR',
//     time: 45456456,
//   },
// };

//! Function to Render a Card
function renderCard(data) {
  //? destructring
  const { name, country, description, icon, temp, time } = data;

  //? Date construtctor is going to give me date and time information in JS
  //? the time we received is in unix format. JS is expecting in miliseconds format
  const date = new Date(time * 1000);
  //? I need also current date and time
  const now = new Date(); // if no argument is provided Date will give us current date and time
  //? calculate the difference between now and date in API response
  //? time difference will be in miliseconds. I need to convert it to minutes
  //? that's why divided by 1000 and 60
  const difference = Math.round((now - date) / 1000 / 60);

  const card = `
            <div class="col" data-name="${name}, ${country}">
              <div class="city">
                <h2 class="city_name">
                  <span>${name}</span>
                  <span class="country-code">${country}</span>
                  <i class="bi bi-x-circle-fill close-icon text-danger"></i>
                </h2>
                <div class="city-temp">${temp}<sup>°F</sup></div>
                <figure>
                  <img
                    src="https://openweathermap.org/img/wn/${icon}@2x.png"
                    class="city-icon"
                    alt="icon"
                  />
                  <figcaption>${description}</figcaption>
                </figure>
                <div class="card-footer">
                  <small class="text-body-secondary"
                    >Last updated ${difference} mins ago</small
                  >
                </div>
              </div>
            </div>
  `;

  //? card created and now we will add this card to the container as a last element

  document.querySelector('.cities').insertAdjacentHTML('beforeend', card);
}

//! function for rendering error
function renderError(message) {
  document.querySelector('.error-message').textContent = message;
}

//! Fething Data from API
async function getData(city, update = false) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;
  try {
    const res = await axios.get(url);
    console.log(res.data);
    //? we have the info for that city, it is time to use it
    //? add this city info into cities object
    const key = res.data.name + ', ' + res.data.sys.country;

    if (update || !cities[key]) {
      //? if that city name is not in my cities obbject, then I will add that one
      cities[key] = {};
      cities[key].name = res.data.name;
      cities[key].country = res.data.sys.country;
      cities[key].description = res.data.weather[0].description;
      cities[key].icon = res.data.weather[0].icon;
      cities[key].temp = res.data.main.temp;
      cities[key].time = res.data.dt;
      console.log(cities);
      //? render the card for that city
      renderCard(cities[key]);

      //? save updated cities into local storage
      localStorage.setItem('cities', JSON.stringify(cities));
    } else {
      //? if that city is already in my cities obj, warn user
      console.log('Error: That city is already there');
      throw new Error(`${city} is currently in the card list!`);
    }
  } catch (error) {
    renderError(error.message);
  }
}

//! Event Listener for form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  //? clear previous error message
  renderError('');
  const city = form.querySelector('.header__input').value;
  //   console.log(city);
  form.reset();

  //? fetch data for that city
  getData(city);
});

//! Event Listener for Card Click
document.querySelector('.cities').addEventListener('click', (e) => {
  console.log(e.target);
  //? check if e.target is close icon
  if (e.target.classList.contains('close-icon')) {
    //? find the parent card col
    const card = e.target.closest('.col');
    console.log(card);
    //? need to have the data-name value to reach the key in object
    const key = card.dataset.name;
    //? remove that key from cities object
    delete cities[key];
    //? as we updated the cities, we need to update localstorage, too
    localStorage.setItem('cities', JSON.stringify(cities));
    card.remove();
  }
});

//! Event Listener on DOM load
document.addEventListener('DOMContentLoaded', () => {
  cities = JSON.parse(localStorage.getItem('cities')) || {};
  console.log(cities);

  //? if we have cities stored in localstorage we need to create cards for that cities
  //? cities is an object. I need the values in that object. We can use Object.values
  Object.values(cities).forEach((city) => renderCard(city));
});

//! Refresh Cards every 10 seconds
setInterval(() => {
  document.querySelector('.cities').innerHTML = '';
  Object.values(cities).forEach((city) => renderCard(city));
  //   Object.keys(cities).forEach((city) => getData(city, true));
}, 10000);

const arr = [
  { name: 'John', location: { city: 'Boston' } },
  { name: 'Jane', location: { city: 'Chicago' } },
  { name: 'Tina', location: { city: 'Denver' } },
  {
    name: 'Tim',
    location: { town: 'asdfasdf' },
    skills: ['JS', 'CSS', 'SASS', 'React'],
  },
];

console.log(arr[1].name);

arr[3].skills.forEach((item) => console.log(item));

// gives an error as Tina dont have skills array
// arr[2].skills.forEach((item) => console.log(item));

// to prevent this error
if (arr[2].skills) {
  arr[2].skills.forEach((item) => console.log(item));
}

//! shorthand if
arr[2].skills && arr[2].skills.forEach((item) => console.log(item));

//! optional chaining
arr[2].skills?.forEach((item) => console.log(item));
