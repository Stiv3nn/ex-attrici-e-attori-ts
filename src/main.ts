// 📌 Milestone 1
// Crea un type alias Person per rappresentare una persona generica. Il tipo deve includere le seguenti proprietà:

// id: numero identificativo, non modificabile
// name: nome completo, stringa non modificabile
// birth_year: anno di nascita, numero
// death_year: anno di morte, numero opzionale
// biography: breve biografia, stringa
// image: URL dell'immagine, stringa

type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string
}


// 📌 Milestone 2
// Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:

// most_famous_movies: una tuple di 3 stringhe
// awards: una stringa
// nationality: una stringa tra un insieme definito di valori.
// Le nazionalità accettate sono: American, British, Australian, Israeli-American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese.


type ActressNationality =
  | "American"
  | "British"
  | "Australian"
  | "Israeli-American"
  | "South African"
  | "French"
  | "Indian"
  | "Israeli"
  | "Spanish"
  | "South Korean"
  | "Chinese"

type Actress = Person & {
  most_famous_movies: [string, string, string],
  awards: string,
  nationality: ActressNationality
}

// Crea una funzione getActress che, dato un id, effettua una chiamata a: GET /actresses/:id
// La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato. Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.

function isActress(dati: unknown): dati is Actress { // dati is Actrees RITORNA UN BOOLEANO
  return (

    // DATI DEV'ESSERE UN TRUTHY
    // dati &&
    // ABBIAMO CHE FARE CON UN OGGETTO OPPURE NO
    typeof dati === 'object' &&
    // E' SEMPRE VERO? NO, PERCHE' POTREBBE ESSERE ANCHE UN NULL
    dati !== null &&


    // DOBBIAMO PER OGNUNA PROPRIETA' CHE VOGLIAMO ALL'INTERNO DI QUESTO ACTRESS, ANARE A CONTROLLARE 1) CHE ESISTA ALL'INTERNO DELL'OGGETTTO E 2) CHE RISPETTI IL TIPO CHE M'INTERESSA --> QUINDI CI DEV'ESSERE UN ID
    "id" in dati && typeof dati.id === 'number' &&
    "name" in dati && typeof dati.name === 'string' &&
    "birth_year" in dati && typeof dati.birth_year === 'number' &&
    "death_year" in dati && typeof dati.death_year === 'number' &&
    "biography" in dati && typeof dati.biography === 'string' &&
    "image" in dati && typeof dati.image === 'string' &&
    "most_famous_movies" in dati &&
    //E' UNA TUPLA???
    dati.most_famous_movies instanceof Array &&
    dati.most_famous_movies.length === 3 &&
    dati.most_famous_movies.every(m => typeof m === 'string') &&
    "awards" in dati && typeof dati.awards === 'string' &&
    "nationality" in dati && typeof dati.nationality === 'string'
  )
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`https://freetestapi.com/api/v1/actresses/${id}`);
    // SE ABBIAMO UN UNKNOWN DOBBIAMO FARE UN TYPE NARROWING
    const dati: unknown = await response.json();
    if (!isActress(dati)) {
      throw new Error('Formato dei dati non valido');
    }
    return dati;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Errore durante il recupero dell\'attrice,', err)
    } else {
      console.error('Errore sconosciuto:', err)
    }
    return null;
  }
}

// 📌 Milestone 4
// Crea una funzione getAllActresses che chiama:

// GET /actresses
// La funzione deve restituire un array di oggetti Actress.
// Può essere anche un array vuoto.

async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch(`https://freetestapi.com/api/v1/actresses`);
    if(!response.ok){
      throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
    }
    // SE ABBIAMO UN UNKNOWN DOBBIAMO FARE UN TYPE NARROWING
    const dati: unknown = await response.json();
    if (!(dati instanceof Array)) {
      throw new Error('Formato dei dati non valido: non è un array!');
    }
    // METODO DEGLI ARRAY PER CONTROLLARE SE ALL'INTERNO DELL'ARRAY SONO TUTTI ACTRESS
    const attriciValide: Actress[] = dati.filter(a => isActress(a));
    return attriciValide;

  } catch (err) {
     if (err instanceof Error) {
      console.error('Errore durante il recupero delle attrici,', err)
    } else {
      console.error('Errore sconosciuto:', err)
    }
    return [];
  }
}