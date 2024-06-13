const searchInput = qs("[data-poke-input]");
const searchBtn = qs("[data-poke-button]");
const pokeWrapper = qs("[data-poke-wrapper]");
const pokeCardTemplate = qs("[data-poke-card-template]");
const pokeForm = qs("[data-poke-form]");
const modal = qs("[data-modal]");
const modalClose = qs("[data-modal-close]");
modal.style.display = "block";

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

const getPokemonWeaknesses = async (id) => {
  try {
    // Pokémon türlerini alın
    const types = await getPokemonTypes(id);

    // Her tür için zayıflık bilgilerini alın
    const weaknessesPromises = types.map((type) => getTypeWeaknesses(type));
    const weaknesses = await Promise.all(weaknessesPromises);

    // Zayıflıkların birleşimini alın ve Pokémon'un kendi türlerini hariç tutun
    const combinedWeaknesses = combineWeaknesses(weaknesses, types);

    return combinedWeaknesses;
  } catch (error) {
    console.error(error);
  }
};

const getPokemonTypes = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error("Pokemon could not be found");
  }
  const pokemon = await res.json();
  return pokemon.types.map((typeInfo) => typeInfo.type.name);
};

const getTypeWeaknesses = async (typeName) => {
  const url = `https://pokeapi.co/api/v2/type/${typeName}`;
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error("Type could not be found");
  }
  const typeData = await res.json();
  return typeData.damage_relations.double_damage_from.map(
    (typeInfo) => typeInfo.name
  );
};

const combineWeaknesses = (weaknesses, types) => {
  const combined = {};
  weaknesses.flat().forEach((type) => {
    if (!combined[type]) {
      combined[type] = 0;
    }
    combined[type]++;
  });

  // Her türün zayıflığı tek sefer sayılır, 2 ve üzeri kez sayılmaz.
  // Pokémon'un kendi türlerini hariç tutun
  return Object.keys(combined).filter(
    (key) => combined[key] >= 1 && !types.includes(key)
  );
};

// Örnek kullanım
getPokemonWeaknesses(4).then((weaknesses) => {
  console.log("Bulbasaur'un zayıf olduğu türler:", weaknesses);
});

const getPokemonById = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);

  const pokemon = await res.json();
  createPokemonCard(pokemon);
};

const createPokemonCard = (pokemon) => {
  const pokeCardTemp = pokeCardTemplate.content.cloneNode(true);
  const img = qs(".poke-image", pokeCardTemp);
  const typeImage = qs(".icon-img", pokeCardTemp);
  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  const id = pokemon.id.toString().padStart(3, "0");
  const weight = pokemon.weight;
  const type = pokemon.types[0].type.name;

  if (pokemon.types.length > 1) {
    const icon2 = document.createElement("div");
    icon2.className = "icon " + pokemon.types[1].type.name;

    const typeImage2 = document.createElement("img");
    typeImage2.src = `assets/icons/${pokemon.types[1].type.name}.svg`;
    typeImage2.alt = pokemon.types[1].type.name;
    typeImage2.title = pokemon.types[1].type.name;
    typeImage2.className = `icon ${pokemon.types[1].type.name}`;

    icon2.appendChild(typeImage2);

    qs(".icon", pokeCardTemp).after(icon2);
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
  qs(".icon", pokeCardTemp).className = `icon ${type}`;

  img.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`;
  img.alt = name;
  img.title = name;

  typeImage.src = `assets/icons/${type}.svg`;
  typeImage.alt = type;
  typeImage.title = type;

  pokeWrapper.appendChild(pokeCardTemp);

  qs(`[data-id="${pokemon.id}"]`).addEventListener("click", () => {
    modal.style.display = "block";
    getPokemonDetail(pokemon);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        modal.style.display = "none";
      }
    });
  });
};

const getPokemonDetail = async (pokemon) => {
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

// modalClose.addEventListener("click", () => {
//   modal.style.display = "none";
// });

window.addEventListener("scroll", handleScroll);

initPokemon();
