const searchInput = qs("[data-poke-input]");
const searchBtn = qs("[data-poke-button]");
const pokeWrapper = qs("[data-poke-wrapper]");
const pokeCardTemplate = qs("[data-poke-card-template]");
const pokeDetailTemplate = qs("[data-detail-template]");
const pokeForm = qs("[data-poke-form]");
const modal = qs("[data-modal]");

const pokeCount = 20;
let currentPage = 1;
let isLoadMoreTriggered = false;

const loadMorePokemon = async () => {
  const start = (currentPage - 1) * pokeCount + 1;
  const end = currentPage * pokeCount;
  console.log(start, end);

  for (let i = start; i <= end; i++) {
    const existingPokemon = qs(`[data-id="${i}"]`);

    if (!existingPokemon || existingPokemon instanceof HTMLSpanElement) {
      getPokemonById(i);
    }
  }

  isLoadMoreTriggered = false;
};

const combineWeaknesses = (weaknesses, types) => {
  const combined = {};

  weaknesses.flat().forEach((type) => {
    if (!combined[type]) {
      combined[type] = 0;
    }
    combined[type]++;
  });

  return Object.keys(combined).filter(
    (key) => combined[key] >= 1 && !types.includes(key)
  );
};

const getPokemonWeaknesses = async (id) => {
  const types = await getPokemonTypes(id);

  const weaknessesPromises = types.map((type) => getTypeWeaknesses(type));
  const weaknesses = await Promise.all(weaknessesPromises);

  const combinedWeaknesses = combineWeaknesses(weaknesses, types);

  return combinedWeaknesses;
};

const createPokemonCard = (pokemon) => {
  const pokeCardTemp = pokeCardTemplate.content.cloneNode(true);
  const type = pokemon.types[0].type.name;
  const pokeId = pokemon.id.toString().padStart(3, "0");

  pokeCardComponent(pokeCardTemp, type, pokemon, pokeId);

  // Pokemon Wrapper Append
  pokeWrapper.appendChild(pokeCardTemp);

  // Pokemon Event Listener
  const handleClick = () => {
    modal.classList.add("show");
    renderPokemonDetail(pokemon);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        modal.classList.remove("show");
      }
    });
  };

  qs(`[data-id="${pokeId}"] img`).addEventListener("click", handleClick);
  qs(`[data-id="${pokeId}"] h4`).addEventListener("click", handleClick);
};

const renderPokemonDetail = async (pokemon) => {
  qs("[data-modal]").innerHTML = "";

  pokemonDetailComponent(pokemon);

  console.log(pokemon);
};

searchInput.addEventListener("input", (e) => {
  const search = searchInput.value.toLowerCase();
  const pokeNames = qsa(".poke-name");
  const pokeIds = qsa(".poke-id");

  for (const pokeName of pokeNames) {
    pokeName.parentElement.classList.remove("fade-out");
    if (!pokeName.textContent.toLowerCase().includes(search)) {
      pokeName.parentElement.classList.add("fade-out");
    }
  }

  if (search.startsWith("#")) {
    for (const pokeId of pokeIds) {
      if (pokeId.textContent.includes(search)) {
        pokeId.parentElement.parentElement.classList.remove("fade-out");
      }

      if (!pokeId.textContent.includes(search)) {
        pokeId.parentElement.parentElement.classList.add("fade-out");
      }
    }
  }

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
  const data = await getPokemonByName(pokeName);

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

const handleScroll = () => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (!isLoadMoreTriggered && scrollTop + clientHeight >= scrollHeight - 5) {
    isLoadMoreTriggered = true;
    currentPage++;
    loadMorePokemon();
  }
};

window.addEventListener("scroll", handleScroll);

const initPokemon = async () => {
  loadMorePokemon();
};

initPokemon();
