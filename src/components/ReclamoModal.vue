<template>
    <div v-if="mostrar" class="modal" @click.self="$emit('cerrar')">
      <div class="modal-content">
        <!-- Botón para cerrar -->
        <span class="cerrar" @click="cancelar">&times;</span>
        
        <h2>Detalles del Reclamo</h2>
  
        <!-- 📌 Selector para cambiar el estado -->
        <div class="info-item">
          <strong>Estado:</strong>
          <select v-model="estadoSeleccionado">
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Resuelto">Resuelto</option>
          </select>
        </div>
  
        <!-- Sección estructurada -->
        <div class="grid-container">
          <div class="columna">
            <div class="info-item"><strong> Fecha:</strong> {{ reclamo.fecha }}</div>
            <div class="info-item"><strong> Cliente:</strong> {{ reclamo.cliente.nombre }}</div>
            <div class="info-item"><strong>DNI:</strong> {{ reclamo.cliente.dni }}</div>
          </div>  
          <div class="columna">
            <div class="info-item"><strong> Nro. Suministro:</strong> {{ reclamo.numeroSuministro }}</div>
            <div class="info-item"><strong> Medidor:</strong> {{ reclamo.medidor }}</div>
            <div class="info-item"><strong> Dirección:</strong> {{ reclamo.direccion }}</div>
          </div>
        </div>
  
        <!-- Descripción -->
        <div class="descripcion-container">
          <strong>Descripción:</strong>
          <p>{{ reclamo.descripcion }}</p>
        </div>
  
        <!-- 📌 Botones de acción -->
        <div class="botones">
          <button class="btn btn-cancelar" @click="cancelar">Cancelar</button>
          <button class="btn btn-guardar" @click="guardarEstado">Guardar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from "../api.js";  // ✅ Importamos la API centralizada
  
  export default {
    props: {
      mostrar: Boolean,
      reclamo: {
        type: Object,
        default: () => ({
            ID_RECLAMO: null,
          fecha: "Desconocida",
          estado: "Pendiente",
          cliente: { nombre: "Desconocido" },
          dni: "00000000",
          numeroSuministro: "N/A",
          medidor: "N/A",
          descripcion: "No hay descripción disponible.",
          direccion: "Sin dirección."
        })
      }
    },
    data() {
      return {
        estadoSeleccionado: "Pendiente", // 🔹 Valor inicial seguro
        estadoOriginal: "Pendiente",
        actualizando: false  // Para evitar múltiples clics
      };
    },
    watch: {
      reclamo: {
        handler(nuevoReclamo) {
          if (nuevoReclamo) {
            this.estadoSeleccionado = nuevoReclamo.estado || "Pendiente";
            this.estadoOriginal = nuevoReclamo.estado || "Pendiente";
          }
        },
        immediate: true
      }
    },
    methods: {
    async guardarEstado() {
        if (this.actualizando) return;
        this.actualizando = true;

        if (!this.reclamo.ID_RECLAMO) {
            console.error("Error: ID_RECLAMO es undefined o null.");
            this.actualizando = false;
            return;
        }

        try {
            const respuesta = await api.actualizarEstadoReclamo(this.reclamo.ID_RECLAMO, this.estadoSeleccionado);
            if (respuesta) {
                this.$emit("estadoActualizado");
                this.cancelar();
            }
        } catch (error) {
            console.error("Error al actualizar estado:", error);
        } finally {
            this.actualizando = false;
        }
    },
    cancelar() {
        this.estadoSeleccionado = this.estadoOriginal; 
        this.$emit("cerrar"); 
    }
}

  };
  </script>
  
  
  <style scoped>
  /* 📌 Estilos del Modal */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  /* Contenedor del contenido del modal */
  .modal-content {
    background: linear-gradient(145deg, #ffffff, #f9f9f9);
    padding: 30px;
    border-radius: 16px;
    width: 85%;
    max-width: 1000px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  /* Animación de entrada */
  @keyframes aparecer {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* Estilo del botón de cerrar */
  .cerrar {
    font-size: 30px;
    font-weight: bold;
    color: #666;
    float: right;
    cursor: pointer;
  }
  
  /* Título del modal */
  h2 {
    font-size: 28px;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
  }
  
  /* Contenedor del grid para los datos */
  .grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Dos columnas */
    gap: 20px;
    margin-bottom: 20px;
  }
  
  /* Estilo de cada columna dentro del grid */
  .columna {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  /* Estilo de los ítems de información */
  .info-item {
    font-size: 16px;
    color: #444;
    padding: 10px;
    border-radius: 8px;
  }
  
  .info-item strong {
    color: #000000;
    margin-right: 8px;
  }
  
  /* Estilo del selector de estado */
  .info-item select {
    padding: 8px 12px;
    font-size: 16px;
    color: #333;
    border: 1px solid #007bff;
    border-radius: 6px;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23007bff' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 30px;
  }
  
  /* Estilo del selector dependiendo del estado seleccionado */
  .info-item select[data-estado="Pendiente"] {
    border-color: #ff9800; /* Naranja para Pendiente */
    background-color: #fff3e0;
  }
  
  .info-item select[data-estado="En proceso"] {
    border-color: #2196f3; /* Azul para En proceso */
    background-color: #e3f2fd;
  }
  
  .info-item select[data-estado="Resuelto"] {
    border-color: #4caf50; /* Verde para Resuelto */
    background-color: #e8f5e9;
  }
  
  .info-item select[data-estado="Cancelado"] {
    border-color: #f44336; /* Rojo para Cancelado */
    background-color: #ffebee;
  }
  
  .info-item select:focus {
    outline: none;
    border-color: #0056b3;
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
  }
  
  /* Contenedor de la descripción */
  .descripcion-container {
    margin-bottom: 25px;
    padding: 15px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    border: solid 1px black;
  }
  
  .descripcion-container strong {
    display: block;
    font-size: 18px;
    color: #000000;
    margin-bottom: 10px;
  }
  
  .descripcion-container p {
    font-size: 16px;
    color: #555;
    line-height: 1.6;
    margin: 0;
  }
  
  /* Contenedor de los botones */
  .botones {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 25px;
  }
  
  /* Estilo general de los botones */
  .btn {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 500;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.3s ease; /* Transición suave para hover */
  }
  
  /* Botón Cancelar */
  .btn-cancelar {
    background: #e0e0e0;
    color: #333;
  }
  
  .btn-cancelar:hover {
    background: #d1d1d1; /* Color más oscuro al pasar el mouse */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* Sombra suave */
  }
  
  /* Botón Guardar */
  .btn-guardar {
    background: #007bff;
    color: white;
  }
  
  .btn-guardar:hover {
    background: #0056b3; /* Color más oscuro al pasar el mouse */
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3); /* Sombra azul suave */
  }
  
  /* Responsividad para pantallas pequeñas */
  @media (max-width: 768px) {
    .modal-content {
      width: 90%;
      max-width: 90%;
      padding: 20px;
    }
  
    .grid-container {
      grid-template-columns: 1fr; /* Una sola columna en pantallas pequeñas */
    }
  
    .info-item select {
      width: 100%;
    }
  
    .botones {
      flex-direction: column;
      gap: 10px;
    }
  
    .btn {
      width: 100%;
      padding: 12px;
    }
  }
  </style>