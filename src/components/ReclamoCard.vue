<template>
  <div 
    class="reclamo-card" 
    @click="$emit('verDetalles', { ID_RECLAMO, fecha, estado, cliente, numeroSuministro, medidor, descripcion, direccion })"
  >
    <div class="header">
      <div class="header-info">
        <h2>Reclamo</h2>
        <span class="fecha">{{ fecha }}</span>
      </div>
      <div class="estado" :class="estadoClass">
        <span class="dot"></span>
        {{ estado }}
      </div>
    </div>

    <div class="info">
      <div class="info-item"><strong>Cliente</strong> <span class="dato">{{ cliente.nombre }}</span></div>
      <div class="info-item"><strong>DNI</strong> <span class="dato">{{ cliente.dni }}</span></div>
      <div class="info-item"><strong>Nro. suministro</strong> <span class="dato">{{ numeroSuministro }}</span></div>
      <div class="info-item"><strong>Medidor</strong> <span class="dato">{{ medidor }}</span></div>
    </div>

    <p class="descripcion"><strong>Descripción:</strong> {{ descripcion }}</p>
    <p class="direccion">📍 {{ direccion }}</p>
  </div>
</template>

<script>
export default {
  props: {
    ID_RECLAMO: Number,
    fecha: String,
    estado: String,
    cliente: Object,
    numeroSuministro: String,
    medidor: String,
    descripcion: String,
    direccion: String,
  },
  computed: {
    estadoClass() {
      return {
        'estado-resuelto': this.estado === 'Resuelto',
        'estado-pendiente': this.estado === 'Pendiente',
        'estado-enproceso': this.estado === 'En proceso'
      };
    }
  }
};
</script>

<style scoped>
.reclamo-card {
  border: 1px solid #e0e0e0;
  border-radius: 0.6rem;
  padding: 0.9rem;
  background: white;
  font-family: Arial, sans-serif;
  transition: transform 0.2s, box-shadow 0.2s;
  max-width: 100%;
  min-width: 230px;
  width: 100%;
  box-sizing: border-box;
}

/* Efecto de hover */
.reclamo-card:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  border: 1px solid rgba(0, 0, 255, 0.3);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
  flex-wrap: wrap;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

h2 {
  margin: 0;
  font-size: 1.1rem;
  color: #000000;
}

.fecha {
  color: #4a9be7;
  font-size: 0.85rem;
  font-weight: 500;
}

.estado {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  white-space: nowrap;
}

.estado .dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  margin-right: 0.3rem;
}

.estado-resuelto { background: #d4edda; color: #155724; }
.estado-resuelto .dot { background: green; }
.estado-pendiente { background: #fff3cd; color: #856404; }
.estado-pendiente .dot { background: orange; }
.estado-enproceso { background: #cce5ff; color: #004085; }
.estado-enproceso .dot { background: blue; }

/* Nueva estructura con grid */
.info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  color: #333;
}

.dato {
  display: inline-block;
  padding: 0.35rem 0.5rem;
  border: 1px solid #3b82f6;
  border-radius: 0.7rem;
  color: #3b82f6;
  background: #f0f7ff;
  text-align: center;
  font-size: 0.8rem;
}

.descripcion, .direccion {
  font-size: 0.85rem;
  color: #555;
  margin: 0.25rem 0;
}

/* 📌 Ajustes para 1366x768 */
@media (max-width: 1366px) {
  .reclamo-card {
    width: 100% !important; /* 🔥 Ocupa todo el ancho disponible */
    min-width: unset !important; /* 🔥 Elimina ancho mínimo conflictivo */
    margin: 0 !important; /* Asegura no tener márgenes externos */
    box-sizing: border-box; /* Mantiene el tamaño controlado */
  }

  .reclamos-grid {
    gap: 0 !important; /* 🔥 Remueve el gap adicional entre tarjetas */
  }

  h2 {
    font-size: 0.85rem; /* Más pequeño */
  }

  .fecha {
    font-size: 0.7rem; /* Reduce tamaño */
  }

  .estado {
    font-size: 0.6rem; /* Compacto */
    padding: 0.1rem 0.3rem;
  }

  .info {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); /* Reduce columnas */
    gap: 0.3rem; /* Menos espacio */
  }

  .info-item {
    font-size: 0.65rem; /* Reduce texto de info */
  }

  .dato {
    font-size: 0.60rem; /* Más pequeño */
    padding: 0.2rem 0.35rem; /* Menos espacio */
    max-width: 75%;
  }

  /* 📌 Ajuste para que la descripción sea aún más compacta */
  .descripcion {
    font-size: 0.7rem;
    color: #555;
    margin: 0.15rem 0;
    max-height: 2.5rem; /* Más compacta */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-wrap: break-word;
  }

  .direccion {
    font-size: 0.7rem;
  }
}


/* 📌 Ajustes para tablets */
@media (max-width: 1024px) {
  .reclamo-card {
    padding: 0.7rem;
    font-size: 0.8rem;
  }

  h2 {
    font-size: 0.95rem;
  }

  .info {
    grid-template-columns: 1fr 1fr;
  }

  .estado {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }
}

/* 📌 Ajustes para móviles */
@media (max-width: 768px) {
  .reclamo-card {
    padding: 0.65rem;
    font-size: 0.75rem;
  }

  h2 {
    font-size: 0.9rem;
  }

  .info {
    grid-template-columns: 1fr;
  }

  .estado {
    font-size: 0.65rem;
    padding: 0.15rem 0.4rem;
  }

  .dato {
    font-size: 0.7rem;
    padding: 0.3rem 0.4rem;
  }
}

/* 📌 Ajustes para móviles pequeños */
@media (max-width: 480px) {
  .reclamo-card {
    padding: 0.6rem;
    font-size: 0.7rem;
  }

  h2 {
    font-size: 0.85rem;
  }

  .info {
    grid-template-columns: 1fr;
  }

  .estado {
    font-size: 0.65rem;
    padding: 0.15rem 0.35rem;
  }

  .dato {
    font-size: 0.7rem;
    padding: 0.3rem 0.4rem;
  }
}
</style>
