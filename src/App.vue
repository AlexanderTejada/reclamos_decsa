<template>
  <div class="app-container">

    <div class="toolbar-container">
      <div class="toolbar">
        <h1 class="title">Reclamos</h1>

        <BuscarReclamos @buscar="filtrarReclamos" />
        <FiltrarReclamos @filtrar="filtrarReclamosPorEstado" />
      </div>
    </div>

    <div class="scroll-container">
      <div class="reclamos-container">
        <div v-for="(grupo, index) in reclamosAgrupados" :key="index" class="grupo-reclamos">
          <div class="reclamos-grid">
            <ReclamoCard 
              v-for="(reclamo, idx) in grupo.reclamos" 
              :key="idx"
              v-bind="reclamo"
              @verDetalles="abrirModal"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 📌 Modal para ver detalles y cambiar estado -->
    <ReclamoModal 
  :mostrar="modalAbierto" 
  :reclamo="reclamoSeleccionado" 
  @cerrar="cerrarModal"
  @guardarEstado="guardarEstado"
  @estadoActualizado="obtenerReclamos"
/>

  </div>
</template>

<script>
import api from "./api.js";  
import ReclamoCard from "./components/ReclamoCard.vue";
import BuscarReclamos from "./components/BuscarReclamos.vue";
import FiltrarReclamos from "./components/FiltrarReclamos.vue";
import ReclamoModal from "./components/ReclamoModal.vue";

export default {
  components: {
    ReclamoCard,
    BuscarReclamos,
    FiltrarReclamos,
    ReclamoModal
  },
  data() {
    return {
      reclamos: [],
      reclamosAgrupados: [],
      modalAbierto: false,
      reclamoSeleccionado: null,
      reclamosFiltrados: [],
      terminoBusqueda: "",
      estadoFiltro: "Todos"
    };
  },
  methods: {
    async obtenerReclamos() {
  try {
    const reclamos = await api.obtenerReclamos();
    if (!Array.isArray(reclamos)) {
      console.error("La API no devolvió un array:", reclamos);
      return;
    }

    this.reclamos = reclamos.map(reclamo => ({
  ID_RECLAMO: reclamo.ID_RECLAMO,
  fechaOriginal: new Date(reclamo.FECHA_RECLAMO),
  fecha: new Date(reclamo.FECHA_RECLAMO).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }),
  estado: reclamo.ESTADO,

  // 👇 Usa el objeto 'cliente' tal cual, o si quieres formatearlo, accede a sus propiedades
  cliente: {
    nombre: reclamo.cliente?.nombre || "",
    dni: reclamo.cliente?.dni || ""
  },

  numeroSuministro: reclamo.numeroSuministro,
  medidor: reclamo.medidor,
  descripcion: reclamo.DESCRIPCION,
  direccion: reclamo.direccion
}));

    // Ordenar los reclamos por fecha descendente (los más nuevos primero)
    this.reclamos.sort((a, b) => b.fechaOriginal - a.fechaOriginal);

    this.organizarReclamos();
  } catch (error) {
    console.error("Error al obtener reclamos:", error);
  }
},
    abrirModal(reclamo) {
      this.reclamoSeleccionado = reclamo || {
        fecha: "",
        estado: "",
        cliente: { nombre: "", dni: "" },
        numeroSuministro: "",
        medidor: "",
        descripcion: "",
        direccion: ""
      };
      this.modalAbierto = true;
    },
    cerrarModal() {
      this.modalAbierto = false;
    },
    async guardarEstado(reclamoActualizado) {
      const respuesta = await api.actualizarEstadoReclamo(reclamoActualizado.ID_RECLAMO, reclamoActualizado.estado);
      if (respuesta) {
        await this.obtenerReclamos(); // 🔄 Recargar reclamos después de actualizar
        this.cerrarModal();
      }
    },
    organizarReclamos() {
  const cardsPorGrupo = 12;
  const grupos = [];
  const reclamosOrdenados = [...(this.reclamosFiltrados.length ? this.reclamosFiltrados : this.reclamos)];

  // Ordenar los reclamos filtrados por fecha descendente
  reclamosOrdenados.sort((a, b) => b.fechaOriginal - a.fechaOriginal);

  for (let i = 0; i < reclamosOrdenados.length; i += cardsPorGrupo) {
    grupos.push({ reclamos: reclamosOrdenados.slice(i, i + cardsPorGrupo) });
  }

  // No invertimos los grupos, ya que queremos que el grupo con los reclamos más recientes esté primero
  this.reclamosAgrupados = grupos;
},
aplicarFiltros() {
  let filtrados = [...this.reclamos];
  if (this.terminoBusqueda) {
    const termino = this.terminoBusqueda.toLowerCase();
    filtrados = filtrados.filter(reclamo =>
      reclamo.descripcion.toLowerCase().includes(termino) ||
      reclamo.cliente.nombre.toLowerCase().includes(termino) ||
      reclamo.numeroSuministro.toLowerCase().includes(termino) ||
      reclamo.direccion.toLowerCase().includes(termino)
    );
  }
  if (this.estadoFiltro !== "Todos") {
    filtrados = filtrados.filter(reclamo => reclamo.estado === this.estadoFiltro);
  }

  // Ordenar los reclamos filtrados por fecha descendente
  filtrados.sort((a, b) => b.fechaOriginal - a.fechaOriginal);

  this.reclamosFiltrados = filtrados;
},
    filtrarReclamos(termino) {
      this.terminoBusqueda = termino;
      this.aplicarFiltros();
      this.organizarReclamos();
    },
    filtrarReclamosPorEstado(estado) {
      this.estadoFiltro = estado;
      this.aplicarFiltros();
      this.organizarReclamos();
    }
  },
  async mounted() {
    await this.obtenerReclamos();
  }
};
</script>


<style scoped>
.app-container {
  max-width: 100vw;
  padding: 20px;
  overflow: hidden;
}
.title{
    color: #0b60ff81;
margin-right: 10px; 
 }
/* 📌 Barra de herramientas fija */
.toolbar-container {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.7); /* Ligera transparencia */
  padding: 10px 0;
  backdrop-filter: blur(10px); /* Suaviza el fondo */
}

.toolbar {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

/* 📌 Contenedor con scroll horizontal */
.scroll-container {
  overflow-x: auto; /* Habilita el scroll horizontal */
  white-space: nowrap; /* Evita que los elementos se envuelvan a la siguiente línea */
  padding-bottom: 10px;
  scroll-behavior: smooth; /* Desplazamiento suave */
}

/* Personalización de la barra de desplazamiento */
.scroll-container::-webkit-scrollbar {
  height: 18px; /* Altura de la barra de desplazamiento */
}

.scroll-container::-webkit-scrollbar-track {
  background: #f0f0f0; /* Color del fondo del track */
  border-radius: 10px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #5490ff; /* Color del thumb (la parte que arrastras) */
  border-radius: 10px;
  transition: background 0.3s;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: #0b61ff; /* Oscurece al pasar el mouse */
}

/* 📌 Contenedor con los grupos alineados en una fila */
.reclamos-container {
  display: inline-flex; /* Usa inline-flex para mantener los grupos en una fila */
  flex-wrap: nowrap; /* Evita que los grupos se vayan a la siguiente línea */
  gap: 20px;
}

/* 📌 Cada grupo de reclamos tiene un tamaño fijo */
.grupo-reclamos {
  width: 1600px; /* Ancho fijo para 4 columnas (ajustado para 4 columnas de ~250px + gaps + padding) */
  min-width: 1100px; /* Aseguramos que no se reduzca */
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
  flex-shrink: 0; /* Evita que los grupos se reduzcan */
  transition: transform 0.2s ease-in-out;
}

/* 📌 Grid con 4 columnas x 3 filas (máximo 12 cards por grupo) */
.reclamos-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(250px, 1fr)); /* 4 columnas */
  grid-template-rows: repeat(3, auto); /* 3 filas */
  gap: 16px;
  width: 100%; /* Ocupa todo el ancho del contenedor padre */
}

/* 🔹 Ajustes para pantallas más pequeñas */
@media (max-width: 1366px) {
  .grupo-reclamos {
    width: 1200px; /* Reducimos ligeramente el ancho para pantallas más pequeñas */
    min-width: 1000px;
    padding: 10px;
  }

  .reclamos-grid {
    grid-template-columns: repeat(4, minmax(220px, 1fr)); /* Columnas más estrechas */
    gap: 12px;
  }
  .title{
    color: #0b60ff81;
margin-right: 10px;  }
  /* Ajustes para el toolbar-container */
  .toolbar-container {
    padding: 6px 0; /* Reducimos el padding vertical */
  }

  /* Ajustes para el toolbar */
  .toolbar {
    gap: 2px; /* Reducimos el espacio entre elementos */
    padding: 6px; /* Reducimos el padding interno */
    
  }

  /* Ajustes para los elementos dentro del toolbar (como el input de búsqueda y el filtro) */
  .toolbar > * {
    transform: scale(0.9); /* Reducimos ligeramente el tamaño de los elementos */
    
  }
  .scroll-container::-webkit-scrollbar {
  height: 10px; /* Altura de la barra de desplazamiento */
}
}

@media (max-width: 1024px) {
  .grupo-reclamos {
    width: 800px;
    min-width: 800px;
    padding: 8px;
  }

  .reclamos-grid {
    grid-template-columns: repeat(4, minmax(180px, 1fr));
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .grupo-reclamos {
    width: 600px;
    min-width: 600px;
    padding: 6px;
  }

  .reclamos-grid {
    grid-template-columns: repeat(2, minmax(150px, 1fr)); /* Reducimos a 2 columnas */
    gap: 8px;
  }

  .scroll-container::-webkit-scrollbar {
    display: none; /* Oculta la barra de desplazamiento en móviles */
  }
}

@media (max-width: 480px) {
  .grupo-reclamos {
    width: 100%;
    min-width: 100%;
    padding: 4px;
  }

  .reclamos-grid {
    grid-template-columns: repeat(1, 1fr); /* Solo 1 columna */
    gap: 6px;
  }
}
</style>