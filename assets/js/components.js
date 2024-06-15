const pokeCardComponent = (pokeCardTemp, type, pokemon, pokeId) => {
  // Pokemon Card
  qs(".poke-card", pokeCardTemp).style.backgroundColor = colors[type];
  qs(".poke-card", pokeCardTemp).dataset.id = pokeId;

  // Pokemon Name
  qs(".poke-name", pokeCardTemp).classList.add(type);
  qs(".poke-name", pokeCardTemp).textContent =
    pokemon.name[0].toUpperCase() + pokemon.name.slice(1);

  // Pokemon id
  qs(".poke-id", pokeCardTemp).textContent = `#${pokeId}`;

  // Pokemon Weight
  qs(".poke-weight", pokeCardTemp).textContent = formatWeight(pokemon.weight);

  // Pokemon Buttons
  qs(".poke-button", pokeCardTemp).textContent = type;
  qs(".poke-button", pokeCardTemp).classList.add(type);

  if (pokemon.types.length > 1) {
    const icon2 = document.createElement("div");
    const typeImage2 = document.createElement("img");

    typeImage2.src = `assets/icons/${pokemon.types[1].type.name}.svg`;
    typeImage2.alt = pokemon.types[1].type.name;
    typeImage2.title = pokemon.types[1].type.name;
    typeImage2.className = `icon ${pokemon.types[1].type.name}`;

    icon2.className = "tooltip icon " + pokemon.types[1].type.name;
    const spanEl = document.createElement("span");
    spanEl.className = `tooltiptext poke-button ${pokemon.types[1].type.name}`;
    spanEl.textContent = pokemon.types[1].type.name;

    icon2.appendChild(typeImage2);
    icon2.appendChild(spanEl);

    qs(".icon", pokeCardTemp).after(icon2);
  }

  // Pokemon Image
  const pokemonImage = qs(".poke-image", pokeCardTemp);
  pokemonImage.src = getPokemonImage(pokeId);
  pokemonImage.alt = pokemon.types[0].type.name;
  pokemonImage.title = pokemon.types[0].type.name;

  // Pokemon Icon
  qs(".icon", pokeCardTemp).className = `tooltip icon ${type}`;
  const iconImage = qs(".icon-img", pokeCardTemp);
  iconImage.src = `assets/icons/${type}.svg`;
  iconImage.alt = type;
  iconImage.title = type;

  const spanEl = document.createElement("span");
  spanEl.className = `tooltiptext-left poke-button ${type}`;

  spanEl.textContent = type;

  qs(".icon", pokeCardTemp).appendChild(spanEl);
};

const pokemonDetailComponent = async (pokemon) => {
  const pokeDetailTemp = pokeDetailTemplate.content.cloneNode(true);

  const img = qs(".modal-img", pokeDetailTemp);
  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  const id = pokemon.id.toString().padStart(3, "0");
  const weight = pokemon.weight;
  const height = pokemon.height;
  const type = pokemon.types[0].type.name;

  const typeImage = qs(".modal-type-button-img", pokeDetailTemp);

  if (pokemon.types.length > 1) {
    const icon2 = document.createElement("div");
    icon2.className =
      "tooltipmodal-type-button icon " + pokemon.types[1].type.name;

    const typeImage2 = document.createElement("img");
    typeImage2.src = `assets/icons/${pokemon.types[1].type.name}.svg`;
    typeImage2.alt = pokemon.types[1].type.name;
    typeImage2.title = pokemon.types[1].type.name;
    typeImage2.className = `icon ${pokemon.types[1].type.name}`;

    icon2.appendChild(typeImage2);

    const spanEl = document.createElement("span");
    spanEl.className = `tooltiptext-left poke-button ${type}`;

    spanEl.textContent = type;

    qs(".icon", pokeDetailTemp).appendChild(spanEl);
    qs(".modal-type-button", pokeDetailTemp).after(icon2);
  }

  qs(".modal-pokedex-entry-desc", pokeDetailTemp).textContent =
    await getPokemonEntry(pokemon.species.url);

  qs(".modal-id", pokeDetailTemp).textContent = "#" + id;
  qs(".modal-name", pokeDetailTemp).textContent = name;

  pokemon.abilities.forEach((ability) => {
    const button = document.createElement("button");
    button.className = "modal-ability-button";
    button.textContent = ability.ability.name;
    qs("div.modal-abilities", pokeDetailTemp).appendChild(button);
  });

  qs("[data-weight]", pokeDetailTemp).textContent = formatWeight(weight);
  qs("[data-height]", pokeDetailTemp).textContent = height;
  qs(".modal-type-button", pokeDetailTemp).classList.add(type);
  qs("[data-base-exp]", pokeDetailTemp).textContent = pokemon.base_experience;

  img.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`;
  img.alt = name;
  img.title = name;

  typeImage.src = `assets/icons/${pokemon.types[0].type.name}.svg`;
  typeImage.alt = name;
  typeImage.title = name;

  const weaknesses = await getPokemonWeaknesses(pokemon.id);
  weaknesses.forEach((weakness) => {
    const divEl = document.createElement("div");
    divEl.className = " icon " + weakness;

    const imgEl = document.createElement("img");
    imgEl.src = `assets/icons/${weakness}.svg`;
    imgEl.alt = weakness;
    imgEl.title = weakness;

    divEl.appendChild(imgEl);

    qs(".weakness-wrapper", pokeDetailTemp).appendChild(divEl);
  });

  pokemon.stats.forEach((stat) => {
    qs(`[data-${stat.stat.name}]`, pokeDetailTemp).innerHTML += stat.base_stat;
  });

  pokemon.stats.forEach((stat) => {
    qs(`[data-${stat.stat.name}]`, pokeDetailTemp).innerHTML += stat.base_stat;
  });

  qs("[data-modal]").appendChild(pokeDetailTemp);

  qs("[data-modal-close]").addEventListener("click", () => {
    modal.classList.remove("show");
  });
};
