const app = Vue.createApp({
  data() {
    return {
      comics: [],
      personajes: [],
      personajeSeleccionado: '',
      apiKey: 'aac416b06fdae13bc9c9ea089e068462',
      privateKey: '43efe6b37bb09cf3d2dbb1d7e9b5b8a2f0449012',
      busqueda: '',
      porcentaje: 0,
      color: 'bg-success',
    };
  },
  methods: {
    cargarComics() {
      const ts = new Date().getTime();
      const hash = CryptoJS.MD5(ts + this.privateKey + this.apiKey).toString();
      axios
        .get('https://gateway.marvel.com/v1/public/comics', {
          params: { ts, apikey: this.apiKey, hash, limit: 50 },
        })
        .then((response) => {
          this.comics = response.data.data.results.map((comic) => ({
            id: comic.id,
            title: comic.title,
            description: comic.description || 'Sin descripción disponible',
            thumbnail: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
            price: comic.prices[0].price || 'Precio no disponible',
            characters: comic.characters.items.map((character) => character.name),
          }));
          this.cargarPersonajes();
          this.actualizarBarraProgreso();
        })
        .catch((error) => console.error('Error al cargar los cómics:', error));
    },
    cargarPersonajes() {
      const personajesSet = new Set();
      this.comics.forEach((comic) => comic.characters.forEach((char) => personajesSet.add(char)));
      this.personajes = [...personajesSet];
    },
    filtrarPorPersonaje(personaje) {
      this.personajeSeleccionado = personaje;
      this.actualizarBarraProgreso();
    },
    actualizarBarraProgreso() {
      const totalComics = this.comics.length;
      const comicsFiltrados = this.buscarComic.length;
      this.porcentaje = totalComics > 0 ? (comicsFiltrados / totalComics) * 100 : 0;
      this.color = this.porcentaje < 30 ? 'bg-danger' : this.porcentaje < 70 ? 'bg-warning' : 'bg-success';
    },
    verDetalle(comic) {
      localStorage.setItem('productoSeleccionado', JSON.stringify(comic));
      window.location.href = 'detalle.html';
    },
  },
  computed: {
    buscarComic() {
      return this.comics.filter((comic) =>
        (!this.personajeSeleccionado || comic.characters.includes(this.personajeSeleccionado)) &&
        (!this.busqueda || comic.title.toLowerCase().includes(this.busqueda.toLowerCase()))
      );
    },
    comicsEncontrados() {
      return this.buscarComic.length;
    },
  },
  created() {
    this.cargarComics();
  },
});

app.mount('#app');
