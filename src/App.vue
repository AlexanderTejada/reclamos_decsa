<template>
  <div class="app-container">
    <h1>Reclamos</h1>

    <div class="toolbar-container">
      <div class="toolbar">
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
      ID_RECLAMO: reclamo.ID_RECLAMO, // ✅ agrega esta línea
      fecha: new Date(reclamo.FECHA_RECLAMO).toLocaleDateString("es-ES", { 
        day: "2-digit", 
        month: "2-digit", 
        year: "numeric"
      }),
      estado: reclamo.ESTADO,
      cliente: { 
        nombre: `${reclamo.NOMBRE} ${reclamo.APELLIDO}`, 
        dni: reclamo.DNI 
      },
      numeroSuministro: reclamo.NUMERO_SUMINISTRO,
      medidor: reclamo.NUMERO_MEDIDOR,
      descripcion: reclamo.DESCRIPCION,
      direccion: reclamo.DIRECCION
    }));

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
      const reclamosOrdenados = [...(this.reclamosFiltrados.length ? this.reclamosFiltrados : this.reclamos)].reverse();

      for (let i = 0; i < reclamosOrdenados.length; i += cardsPorGrupo) {
        grupos.push({ reclamos: reclamosOrdenados.slice(i, i + cardsPorGrupo) });
      }
      this.reclamosAgrupados = grupos.reverse();
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
  min-width: auto; /* Ajusta este valor según el tamaño que prefieras */
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
  flex-shrink: 0; /* Evita que los grupos se reduzcan demasiado */
  transition: transform 0.2s ease-in-out;
}

/* 📌 Grid con 4 columnas x 3 filas (máximo 12 cards por grupo) */
.reclamos-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(250px, 1fr)); /* 4 columnas */
  grid-template-rows: repeat(3, auto); /* 3 filas */
  gap: 16px;
  /* Para evitar que el grid crezca más allá de 3 filas, puedes usar un contenedor con altura limitada o manejar el límite en JS */
}
@media (max-width: 1366px) {
  /* 📌 Contenedor principal ajustado */
  .app-container {
    width: 100vw;
    max-width: 100vw;
    padding: 12px;
    margin: 0 auto;
    overflow-x: hidden;
  }

  /* 📌 Ajuste del título principal */
  h1 {
    font-size: 1.4rem;
    text-align: center;
    margin-bottom: 10px;
  }

  /* 📌 Barra de herramientas más compacta */
  .toolbar-container {
    padding: 6px 0;
  }

  .toolbar {
    flex-wrap: wrap;
    gap: 10px;
    padding: 6px;
    font-size: 0.85rem;
    justify-content: center;
  }

  /* 📌 Ajuste del scroll horizontal y contenedor general */
  .scroll-container {
    padding-bottom: 6px;
  }

  .reclamos-container {
    gap: 0 !important; /* 🔥 Elimina totalmente el espacio horizontal entre grupos */
  }

  /* 📌 Ajuste definitivo del grupo de reclamos */
  .grupo-reclamos {
    width: 1250px !important; /* Ancho ideal para 4 columnas cómodas en 1366px */
    min-width: 1000px !important;
    padding: 8px;
    border-radius: 6px;
    flex-shrink: 0;
  }

  /* 📌 Grid ajustado con 4 columnas y 3 filas */
  .reclamos-grid {
    grid-template-columns: repeat(4, minmax(50px, 1fr)); /* Asegura 4 columnas */
    grid-template-rows: repeat(3, auto);
    gap: 6px; /* Espacio más reducido entre tarjetas */
  }
}


/* Ocultar barra de desplazamiento en dispositivos móviles si es necesario */
@media (max-width: 768px) {
  .scroll-container::-webkit-scrollbar {
    display: none; /* Oculta la barra de desplazamiento en móviles, pero el scroll sigue funcionando */
  }

  .grupo-reclamos {
    min-width: 600px; /* Ajusta el tamaño para pantallas más pequeñas */
  }

  .reclamos-grid {
    grid-template-columns: repeat(2, minmax(150px, 1fr)); /* Menos columnas en pantallas pequeñas */
    grid-template-rows: repeat(3, auto); /* Mantiene las 3 filas */
  }
}
/* 🔹 Monitores más pequeños (19" a 24") */
@media (max-width: 1440px) {
  .grupo-reclamos {
    min-width: 750px; /* Reduce el tamaño del grupo */
  }

  .reclamos-grid {
    grid-template-columns: repeat(3, minmax(200px, 1fr)); /* 3 columnas */
    gap: 14px;
  }
}



/* 🔹 Tablets en horizontal (1024px y menos) */
@media (max-width: 1024px) {
  .grupo-reclamos {
    min-width: 600px;
    padding: 10px;
  }

  .reclamos-grid {
    grid-template-columns: repeat(2, minmax(180px, 1fr)); /* 2 columnas */
    gap: 10px;
  }

  .toolbar {
    flex-wrap: wrap; /* Permite que los filtros pasen a la siguiente línea si es necesario */
    justify-content: center;
  }
}

/* 🔹 Tablets en vertical y móviles grandes (768px y menos) */
@media (max-width: 768px) {
  .grupo-reclamos {
    min-width: 500px; /* Más compacto */
  }

  .reclamos-grid {
    grid-template-columns: repeat(2, minmax(150px, 1fr)); /* Mantiene 2 columnas */
    gap: 8px;
  }

  .toolbar {
    flex-wrap: wrap;
    gap: 10px;
    padding: 8px;
  }

  .scroll-container::-webkit-scrollbar {
    display: none; /* Oculta la barra de desplazamiento en móviles */
  }
}

/* 🔹 Móviles pequeños (480px y menos) */
@media (max-width: 480px) {
  .grupo-reclamos {
    min-width: 100%;
    padding: 8px;
  }

  .reclamos-grid {
    grid-template-columns: repeat(1, 1fr); /* Solo 1 columna */
    gap: 6px;
  }

  .toolbar {
    flex-direction: column;
    gap: 8px;
  }

  .scroll-container {
    overflow-x: auto; /* Sigue permitiendo el scroll horizontal */
  }
}

</style>