import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ServicioUsuario } from "../types/iServicioUsuario";
import { deleteService, fetchServiceById, fetchServices, fetchUserServices } from "../api/servicios";

export function useServiceById(id: string) {
  return useQuery<ServicioUsuario, Error>({
    queryKey: ["service", id],
    queryFn: () => fetchServiceById(id),
    enabled: !!id,
  });
}

export function useServices() {
  return useQuery<ServicioUsuario[], Error>({
    queryKey: ["services"],
    queryFn: fetchServices,
  });
}

export function useUserServices(token: string) {
  return useQuery<ServicioUsuario[], Error>({
    queryKey: ["userServices", token],
    queryFn: () => fetchUserServices(token),
    enabled: !!token,
  });
}

export function useServicesByCategory(categoryId: string) {
  return useQuery<ServicioUsuario[], Error>({
    queryKey: ["servicesByCategory", categoryId],
    queryFn: async () => {
      const allServices = await fetchServices();
      return allServices.filter((service) => service.categoria.id === categoryId);
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) => deleteService(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["userServices"] });
    },
    onError: (err) => {
      console.error("Error al eliminar el servicio:", err);
    },
  });
}