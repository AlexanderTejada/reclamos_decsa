import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

export default {
  async obtenerReclamos() {
    try {
      const response = await api.get("/reclamos");
      return response.data;
    } catch (error) {
      console.error("Error al obtener reclamos:", error);
      return [];
    }
  },

  async actualizarEstadoReclamo(idReclamo, nuevoEstado) {
    try {
      const response = await api.put(`/reclamos/${idReclamo}`, { estado: nuevoEstado });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar estado del reclamo:", error);
      return null;
    }
  }
};
