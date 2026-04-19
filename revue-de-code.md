# Revue de code

## MenuView

```js{4}
<ul>
    <li
        class="pokemon-li"
        v-for="pokemon in pokemons"
        :key="pokemon.id"
        :style="{ '--hp': pokemon.hp }"
    >
        {{ pokemon.name }}
        <p>HP: {{ pokemon.hp }}</p>
    </li>
</ul>
```

::: info
Code fonctionnel
:::
::: tip
Ceci pourrait être mis dans un composant, mais pas obligatoire
:::

```js{4}
function gameStart() {
  //j'ai demandé à l'IA, j'ai essayé sans pendant 3 heures et ça n'a rien donné...
  router.push({
    name: "Play",
    query: { pokemons: JSON.stringify(pokemonsSelected.value), trainerName: playerName.value }
  });
}
```

::: info
Code fonctionnel, avec de l'aide de l'IA pour le query
:::
::: tip
Je n'ai pas grand chose à dire pour améliorer, nous n'avons pas trouvé d'autre façon de faire fonctionnelle
:::

```js{4}
function updateList(pokemon: Pokemon) {
  if (pokemonsSelected.value.includes(pokemon)) {
    pokemonsSelected.value = pokemonsSelected.value.filter(
      (currentPokemon) => currentPokemon.id != pokemon.id,
    );
  } else if (pokemonsSelected.value.length < 5) {
    pokemon.currentHp = pokemon.hp
    pokemonsSelected.value.push(pokemon)
  }
}
```

::: info
Code parfaitement fonctionnel, gèrant l'ajout et le retrait de Pokémon
:::
::: tip
Au lieu d'une méthode update générale, on pourrait avoir une méthode d'ajout et une méthode de retrait, mais ça commence à devenir plus complèxe à gérer pour aucune raison
:::

## RankingView

```js{4}
<h1>Tableau des Scores</h1>
    <ul>
        <li>
            <span>Nom</span>
            <span>Pokédollars</span>
        </li>
        <li v-for="rank in rankings" v-bind:key="rank.id">
            <span>{{ rank.name }}</span>
            <span>{{ rank.score }}</span>
        </li>
    </ul>
    <loading :active="isLoading" />
```

::: info
Code fonctionnel
:::
::: tip
Ceci pourrait être mis dans un composant, mais pas obligatoire
:::

## pokemonsService

```js{4}
async function getPokemons() {
  const { data } = await axios.get(`${API_URL}/pokemons`);
  return data;
}

async function getPokemon(id: string) {
  const { data } = await axios.get(`${API_URL}/pokemons/${id}`);
  return data;
}

export const pokemonsService = {
  getPokemons,
  getPokemon,
};

```

::: info
Changement de post pour pokemon, placé dans un fichier à part
:::

## rankingService

```js{4}
async function getRanking() {
  const { data } = await axios.get(`${API_URL}/ranking`);
  return data;
}

export const rankingService = {
  getRanking,
};
```

::: info
Changement de post pour ranking, placé dans un fichier à part
:::

```js{4}
//fait par IA
async function addRanking(data: { name: string; score: number }) {
  const response = await axios.post(`${API_URL}/ranking`, data);
  return response.data;
}

export const rankingService = {
  getRanking,
  addRanking
};
```

::: info
Ajout d'une méthode poour ajouter un nouveau joueur au classement, fait par IA, car on ne voulait pas gosser avec quelque chose qu'on n'a pas fait auparavant
:::

## trainersService

```js{4}
async function getTrainers() {
  const { data } = await axios.get(`${API_URL}/trainers`);
  return data;
}

async function getTrainer(id: string) {
  const { data } = await axios.get(`${API_URL}/trainers/${id}`);
  return data;
}

export const trainersService = {
  getTrainers,
  getTrainer,
};

```

::: info
Changement de post pour trainer, placé dans un fichier à part
:::

## GameView

```js{4}
const props = defineProps<{
  pokemons: string;
  trainerName: string;
}>();

const Experience = {
  1: { accuracy: 20, experience: "Débutant" },
  2: { accuracy: 35, experience: "Confirmé" },
  3: { accuracy: 50, experience: "Expert" },
  4: { accuracy: 70, experience: "Maitre" },
} as const;
type Experience = (typeof Experience)[keyof typeof Experience];

//j'ai demandé à l'IA, j'ai essayé sans pendant 3 heures et ça n'a rien donné...
const pokemons = JSON.parse(props.pokemons)

const pokemonSelected = ref<Pokemon>(pokemons[0])
const trainerName = props.trainerName
const currentTrainer = ref<Trainer | null>(null)
const trainers = ref<Trainer[]>([])

const attackDisabled = computed(
  () => disableTrigger.value >= 1
)

const isCurrentPokemonDead = computed(
  () => pokemonSelected.value.currentHp! <= 0,
)
```

::: info
Valeurs initialisées (pas toutes, juste les intéressantes). La liste de Pokémon a été fait avec l'aide de l'IA, car je n'ai jamais vu ça et j'avais essayé pendant trop longtemps de faire fonctionner ça sans.
:::

```js{4}
watch(
  () => pokemonSelected.value.currentHp,
  () => {
    if (pokemonSelected.value.currentHp! <= 0) {
      nbDeadPokemon.value += 1;
    }
  },
);
```

::: info
Regarde si les points de vie de notre pokémon change, donc s'il en récupère, s'il en perd ou s'il meurt et agit en conséquence
:::
::: tip
Code très simple donc pas de piste pour l'améliorer
:::

```js{4}
function getHPPercentage(pokemon: Pokemon) {
  if (!pokemon) return;
  const newHp = Math.round((pokemon.currentHp! * 100) / pokemon.hp);
  if (newHp <= 0) {
    return 0;
  } else {
    return newHp;
  }
}
```

::: info
Permet d'obtenir les points de vie de notre pokémon en pourcentage
:::
::: tip
Code encore une fois très simple donc pas de piste pour l'améliorer
:::

```js{4}
function changePokemonSelected(pokemon: Pokemon) {
  if (pokemon.currentHp! <= 0) return;

  if (isCurrentPokemonDead.value) {
    pokemonSelected.value = pokemon;
  } else if (changePokemon.value > 0) {
    changePokemon.value--;
    pokemonSelected.value = pokemon;
  }
}
```

::: info
S'occupe de changer le pokémon en cours d'utilisation et le nombre de changement disponible
:::

```js{4}
async function attack(turn: number = 1) {
  if (!pokemonSelected.value || !currentTrainer.value?.pokemon) return

  if (turn == 1) {
    disableTrigger.value += 1

    if (Math.floor(Math.random() * 101) <= Experience[4].accuracy) {
      damagePokemon(pokemonSelected.value, currentTrainer.value.pokemon)

      if (currentTrainer.value.pokemon.currentHp! <= 0)
        nbPokedollars.value += currentTrainer.value?.reward!;
    }
    attack(turn + 1)
  } else {
    await delay(750)
    disableTrigger.value -= 1
    const exp =
      Experience[currentTrainer.value.experience as keyof typeof Experience]

    if (Math.floor(Math.random() * 101) <= exp.accuracy) {
      damagePokemon(currentTrainer.value.pokemon, pokemonSelected.value)
    }
  }
}
```

::: info
Méthode s'occupant de gérer l'attaque et la contre-attaque
:::
::: tip
La récursivité n'est pas nécessaire dans ce cas là, on pourrait tout simplement gérer l'attaque du joueur et la contre-attaque de l'adversaire sans rappeler la méthode.
:::

```js{4}
function damagePokemon(attacker: Pokemon, defender: Pokemon){
  if(!attacker || !defender) return

  const damage = Math.floor(Math.random() * (6 - 3)) + 3
  defender.currentHp! -= (damage * defender.hp) / 100
}
```

::: info
S'occupe d'infliger les dégâts au bon pokémon
:::
::: warning
L'attaquant n'est littérallement pas utilisé... pourquoi il est là le bonhomme???
:::

```js{4}
function changeFight() {
  trainerNumber.value++;
  if (changePokemon.value == 0) changePokemon.value += 1;
  currentTrainer.value = trainers.value[trainerNumber.value];
  playerIsAttacking.value = true;
}
```

::: info
Change le dresseur adverse pour le prochain dans la liste de dresseur
:::

```js{4}
function heal() {
  if (pokemonSelected.value.currentHp != 0) {
    let percentage = getHPPercentage(pokemonSelected.value);
    let toHeal = 100 - percentage!;
    let cost = 5 * toHeal;
    let hp = (toHeal * pokemonSelected.value.hp) / 100;
    if (cost > nbPokedollars.value) {
      cost = nbPokedollars.value;
      hp = ((nbPokedollars.value / 5) * pokemonSelected.value.hp) / 100;
    }
    pokemonSelected.value.currentHp! += hp;
    nbPokedollars.value -= cost;
  }
}
```

::: info
Permet de soigner son pokémon actif après avoir vaincu un dresseur, en dépensant nos P$ gagné
:::
::: tip
La condition devrait peut-être être > 0, parce que si les points de vie sont en dessous de 0, on entre quand même dans la condition. Dans le cas de notre code, c'est correct, car de toute façon on ne peut pas arriver à ce point là, mais si on le modifie un peu, alors ça deviendra un problème
:::

```js{4}
function getTrainerExperience(experience: number) {
  switch (experience) {
    case 1:
      return "Débutant";
    case 2:
      return "Confirmé";
    case 3:
      return "Expert";
    case 4:
      return "Maitre";
  }
}
```

::: info
Transformer un nombre en une expérience
:::
::: tip
Je penses pas que c'est nécessaire, il doit y avoir un moyen de le faire sans
:::

```js{4}
async function endGame() {
  gameOver.value = true
  await rankingService.addRanking({
    name: trainerName,
    score: nbPokedollars.value,
  });
  router.push({ name: "Ranking" });
}
```

::: info
Méthode qui change de page quand la partie est fini (et que le bouton de fin de partie a été appuyé) et qui envoie les informations du joueur pour ajouter son score à la page de classement
:::

```js{4}
function gameLoss() {
  gameOver.value = true
  router.push({ name: "Menu" });
}
```

::: info
Méthode qui change de page quand tous les pokémons du joueur sont vaincu
:::

```js{4}
onBeforeRouteLeave((to, from) => {
  if (!gameOver.value) {
    triggerModal.value++
    nextRoute.value = to
    return false
  }
  return true
})
```

::: info
Gère le changement de page du joueur pour lancer un modal pour lui demander s'il est sur de vouloir quitter s'il est en pleine partie, donc qu'il a encore des pokémons
:::

```js{4}
function confirmLeaveGame() {
  gameOver.value = true
  router.push(nextRoute.value)
}
```

::: info
Méthode qui gère le changement de page quand le joueur a confirmé qu'il veut sortir de la partie en plein milieu de celle-ci
:::

```js{4}
<div class="result-message">
    <p v-if="nbDeadPokemon >= 5">Vos Pokémon sont tous K.O. partie terminé</p>
    <p
      v-else-if="currentTrainer?.pokemon.currentHp! <= 0 && trainerNumber == 4"
    >
      Vous avez vaincu les 5 dresseurs! Vous avez gagné un total de
      {{ nbPokedollars }}P$
    </p>
    <p v-else-if="currentTrainer?.pokemon.currentHp! <= 0">
      Vous avez vaincu {{ currentTrainer?.name }}, vous avez gagner
      {{ currentTrainer?.reward }}P$
    </p>
  </div>
```

::: info
S'occupe de l'affichage des messages dépendant de certaines conditions (quand le jeu est fini, qu'on a vaincu le pokémon adverse ou qu'on a perdu)
:::

```js{4}
<button
        v-if="nbDeadPokemon >= 5"
        class="counter"
        type="button"
        @click="gameLoss"
      >
        Retourner au menu
      </button>
      <p v-else-if="isCurrentPokemonDead">
        Changer de Pokémon avant de continuer le combat
      </p>
      <button
        v-else-if="
          currentTrainer?.pokemon.currentHp! <= 0 && trainerNumber == 4
        "
        class="next"
        type="button"
        @click="endGame"
      >
        Finir la partie
      </button>
      <button
        v-else-if="currentTrainer?.pokemon.currentHp! <= 0"
        class="next"
        type="button"
        @click="changeFight"
      >
        Prochain combat
      </button>

      <button
        v-else
        class="attack"
        type="button"
        :disabled="attackDisabled"
        @click="attack()"
      >
        Attaquer
      </button>

      <button
        v-if="currentTrainer?.pokemon.currentHp! <= 0 && trainerNumber != 4"
        class="attack"
        type="button"
        @click="heal"
      >
        Soigner le Pokémon
      </button>
```

::: info
S'occupe d'afficher seulement le bouton désiré. Il y en a tout le temps qu'un d'affiché, excepté quand on a vaincu un dresseur où il y en a 2: un pour le prochain combat et l'autre pour se soigner
:::

```js{4}
<ul>
      <li
        class="pokemon-li"
        :class="{
          selected: pokemonSelected.id == pokemon.id,
          dead: pokemon.currentHp <= 0,
        }"
        v-for="pokemon in pokemons"
        @click="changePokemonSelected(pokemon)"
        :key="pokemon.id"
      >
        {{ pokemon.name }}
        <p>HP: {{ pokemon.hp }}</p>
      </li>
    </ul>
```
::: info
Affiche la liste des 5 pokémons choisi avec leurs informations
:::

```js{4}
<ConfirmModal
      @onModalConfirmed="confirmLeaveGame"
      :trigger="triggerModal"
      title="Attention"
      body="Votre progression sera perdue. Voulez-vous vraiment quitter la partie ? "
      cancelButton="Continuer à jouer"
      confirmButton="Quitter sans sauvergarder"
    />
```
::: info
Modal de confirmation pour s'assurer que le joueur veut réellement quitter la partie en sachant qu'il va perdre la progresssion
:::