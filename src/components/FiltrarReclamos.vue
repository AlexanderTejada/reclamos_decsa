<template>
  <select v-model="estadoSeleccionado" @change="emitirFiltro" class="filtro">
    <option value="">Todos</option>
    <option value="Pendiente">Pendiente</option>
    <option value="En proceso">En proceso</option>
    <option value="Resuelto">Resuelto</option>
    <option value="Cancelado">Cancelado</option>
  </select>
</template>

<script>
export default {
  name: "FiltrarReclamos",
  data() {
    return {
      estadoSeleccionado: ""
    };
  },
  methods: {
    emitirFiltro() {
      this.$emit("filtrar", this.estadoSeleccionado);
    }
  }
};
</script>

<style scoped>
.filtro {
  width: 200px;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  background: #0471ff9d;
  color: #ffffff;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

/* Hover y Focus */
.filtro:hover {
  border-color: #2563eb;
}

.filtro:focus {
  border-color: #1d4ed8;
  box-shadow: 0px 0px 5px rgba(59, 130, 246, 0.5);
}

/* Personalización de las opciones */
.filtro option {
  background: rgb(255, 255, 255);
  color: #333;
  font-size: 14px;
  padding: 5px;
}

/* Cambia el color de la opción seleccionada */
.filtro option:checked {
  background: #3b82f6;
  color: white;
}
@media (max-width: 1366px) {
  .filtro {
    width: 160px; /* Reduce el ancho del select */
    padding: 8px; /* Reduce el espacio interno */
    font-size: 14px; /* Reduce el tamaño del texto */
    border-radius: 6px; /* Reduce los bordes redondeados */
  }

  .filtro option {
    font-size: 13px; /* Reduce el tamaño de las opciones */
    padding: 4px;
  }
}

</style>
