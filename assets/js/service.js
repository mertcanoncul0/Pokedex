const getPokemonById = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);

  const pokemon = await res.json();
  createPokemonCard(pokemon);
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

const getPokemonByName = async (name) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

  if (res.status === 404) {
    showSnackbar("Pokemon not found!");
    return;
  }

  return await res.json();
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

const getPokemonEntry = async (url) => {
  const res = await fetch(url);
  const data = await res.json();

  const pokedexEntry = data.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );

  return pokedexEntry ? pokedexEntry.flavor_text : "No entry found";
};
