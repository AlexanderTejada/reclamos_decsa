<template>
  <input 
    type="text" 
    v-model="query" 
    @input="emitirBusqueda"
    placeholder="Buscar por cliente, DNI o suministro..."
    class="buscador"
  />
</template>

<script>
export default {
  name: "BuscarReclamos",
  data() {
    return {
      query: ""
    };
  },
  methods: {
    emitirBusqueda() {
      this.$emit("buscar", this.query);
    }
  }
};
</script>

<style scoped>
.buscador {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease-in-out;
}

/* Placeholder estilizado */
.buscador::placeholder {
  color: #999;
  font-style: italic;
}

/* Hover */
.buscador:hover {
  border-color: #2563eb;
}

/* Focus (cuando se está escribiendo) */
.buscador:focus {
  border-color: #1d4ed8;
  box-shadow: 0px 0px 5px rgba(59, 130, 246, 0.5);
}
@media (max-width: 1366px) {
  .buscador {
    max-width: 300px; /* Reduce el tamaño del input */
    padding: 8px; /* Reduce padding interno */
    font-size: 14px; /* Reduce el tamaño del texto */
    border-radius: 6px; /* Reduce los bordes redondeados */
  }
}

/* Mejoras en pantallas más pequeñas */
@media (max-width: 600px) {
  .buscador {
    width: 100%;
  }
}
</style>
