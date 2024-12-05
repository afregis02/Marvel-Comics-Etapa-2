const app = Vue.createApp({
    data() {
      return {
        producto: {},
        cantidad: 1 // Manejamos la cantidad para el control
      };
    },
    created() {
      const productoSeleccionado = localStorage.getItem('productoSeleccionado');
      if (productoSeleccionado) {
        this.producto = JSON.parse(productoSeleccionado);
      } else {
        alert("No se encontró el producto seleccionado.");
        window.location.href = 'index.html'; // Redirige si no hay datos
      }
    },
    methods: {
      volver() {
        window.history.back(); // Regresa a la página anterior
      },
      modificarCantidad(incremento) {
        if (this.cantidad + incremento >= 1 && this.cantidad + incremento <= 6) {
          this.cantidad += incremento;
        }
      }
    }
  });
  
  app.mount('#detalleApp');
  