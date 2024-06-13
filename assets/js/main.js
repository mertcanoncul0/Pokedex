const searchInput = qs("[data-poke-input]");
const searchBtn = qs("[data-poke-button]");
const pokeWrapper = qs("[data-poke-wrapper]");
const pokeCardTemplate = qs("[data-poke-card-template]");
const pokeForm = qs("[data-poke-form]");

const pokeCount = 20;
let currentPage = 1;
let isLoadMoreTriggered = false;

const loadMorePokemon = async () => {
  const start = (currentPage - 1) * pokeCount + 1;
  const end = currentPage * pokeCount;

  for (let i = start; i <= end; i++) {
    const existingPokemon = qs(`[data-id="${i}"]`);
    if (!existingPokemon || existingPokemon instanceof HTMLSpanElement) {
      getPokemonById(i);
    }
  }

  isLoadMoreTriggered = false;
};

const handleScroll = () => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (!isLoadMoreTriggered && scrollTop + clientHeight >= scrollHeight - 200) {
    isLoadMoreTriggered = true;
    currentPage++;
    loadMorePokemon();
  }
};

const initPokemon = async () => {
  loadMorePokemon();
};

const getPokemonById = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);

  const pokemon = await res.json();
  createPokemonCard(pokemon);
};

const createPokemonCard = (pokemon) => {
  const pokeCardTemp = pokeCardTemplate.content.cloneNode(true);
  const img = qs("img", pokeCardTemp);

  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  const id = pokemon.id.toString().padStart(3, "0");
  const weight = pokemon.weight;
  const type = pokemon.types[0].type.name;
  if (pokemon.types.length > 1) {
    const button2 = document.createElement("button");
    button2.classList.add("poke-button");
    button2.textContent = pokemon.types[1].type.name;
    button2.classList.add(`${pokemon.types[1].type.name}`);

    qs(".poke-button", pokeCardTemp).after(button2);
  }
  const color = colors[type];

  qs(".poke-card", pokeCardTemp).style.backgroundColor = color;
  qs(".poke-card", pokeCardTemp).dataset.id = pokemon.id;
  qs(".poke-name", pokeCardTemp).classList.add(type);
  qs(".poke-name", pokeCardTemp).textContent = name;
  qs(".poke-id", pokeCardTemp).textContent = `#${id}`;
  qs(".poke-weight", pokeCardTemp).textContent = formatWeight(weight);
  qs(".poke-button", pokeCardTemp).textContent = type;
  qs(".poke-button", pokeCardTemp).classList.add(type);
  img.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`;
  img.alt = name;
  img.title = name;

  pokeWrapper.appendChild(pokeCardTemp);
  console.log(pokemon);
};

searchInput.addEventListener("input", (e) => {
  const search = searchInput.value.toLowerCase();
  const pokeNames = qsa(".poke-name");

  pokeNames.forEach((pokeName) => {
    pokeName.parentElement.classList.remove("fade-out");
    if (!pokeName.textContent.toLowerCase().includes(search)) {
      pokeName.parentElement.classList.add("fade-out");
    }
  });

  const pokemons = [...qs("[data-poke-wrapper]").children].filter(
    (child) => child instanceof HTMLDivElement
  );

  const isEmptyWrapper = pokemons.every(
    (pokemon) => pokemon.classList[1] === "fade-out"
  );

  if (isEmptyWrapper) {
    setTimeout(() => {
      showError("Pokemon not found!");
    }, 400);
  } else {
    qs(".error-page-head").remove();
  }
});

pokeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const pokeName = searchInput.value.toLowerCase();
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);

  if (res.status === 404) {
    showSnackbar("Pokemon not found!");
    return;
  }

  const data = await res.json();

  const pokeFound = [...pokeWrapper.children].find(
    (child) => Number(child.dataset.id) === Number(data.id)
  );

  if (pokeFound) {
    showSnackbar("Pokemon Already Found!");
    return;
  }

  createPokemonCard(data);

  if (pokeWrapper.querySelector(".error-page-head")) {
    pokeWrapper.querySelector(".error-page-head").remove();
  }
});

window.addEventListener("scroll", handleScroll);

initPokemon();
