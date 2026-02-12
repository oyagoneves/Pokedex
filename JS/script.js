const pokemonname = document.querySelector('.pokemon_name');
const pokemonnumber = document.querySelector('.pokemon_number');
const pokemonimagem = document.querySelector('.pokemon_imagem');
const form = document.querySelector('.form');
const input = document.querySelector('.input_search');
const buttonprev = document.querySelector('.btn_prev');
const buttonnext = document.querySelector('.btn_next');

let searchpokemon = 1;

// 🔹 itens fora da API
const localItems = {
    "lula": {
        id: 666,
        name: "Lula",
        sprite: "imagem/lula.gif"
    }
};

// 🔹 busca API → se falhar, busca local
const fetchpokemon = async (pokemon) => {

    // tenta API
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon}`
    );

    if (response.status === 200) {
        return await response.json();
    }

    // fallback local
    if (localItems[pokemon.toLowerCase()]) {
        return localItems[pokemon.toLowerCase()];
    }

    return null;
};

// 🔹 renderização
const renderpokemon = async (pokemon) => {
    pokemonname.innerHTML = 'Loading...';
    pokemonnumber.innerHTML = '';
    pokemonimagem.style.display = 'block';

    const data = await fetchpokemon(pokemon);

    if (!data) {
        pokemonimagem.style.display = 'none';
        pokemonname.innerHTML = 'Não encontrado';
        pokemonnumber.innerHTML = '';
        return;
    }

    pokemonname.innerHTML = data.name;
    pokemonnumber.innerHTML = data.id;
    input.value = '';

    // veio da API
    if (data.sprites) {
        const animated =
            data.sprites.versions['generation-v']['black-white']
                .animated.front_default;

        pokemonimagem.src =
            animated || data.sprites.front_default;

        searchpokemon = data.id;
    }
    // veio do local
    else {
        pokemonimagem.src = data.sprite;
    }
};

// 🔹 eventos
form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderpokemon(input.value.toLowerCase());
});

buttonprev.addEventListener('click', () => {
    if (searchpokemon > 1) {
        searchpokemon -= 1;
        renderpokemon(searchpokemon);
    }
});

buttonnext.addEventListener('click', () => {
    searchpokemon += 1;
    renderpokemon(searchpokemon);
});

// 🔹 inicial
renderpokemon(searchpokemon);
