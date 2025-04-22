package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.dto.ActividadDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.PaqueteActividadDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.PaqueteHospedajeDTO;
import co.uniquindio.edu.Agencia_Turistica.dto.PaqueteTuristicoDTO;
import co.uniquindio.edu.Agencia_Turistica.exception.ValidacionException;
import co.uniquindio.edu.Agencia_Turistica.model.*;
import co.uniquindio.edu.Agencia_Turistica.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaqueteTuristicoService {

    private final PaqueteTuristicoRepository paqueteTuristicoRepository;
    private final ActividadRepository actividadRepository;
    private final PaqueteActividadRepository paqueteActividadRepository;
    private final HospedajeRepository hospedajeRepository;
    private final PaqueteHospedajeRepository paqueteHospedajeRepository;

    @Autowired
    public PaqueteTuristicoService(PaqueteTuristicoRepository paqueteTuristicoRepository, ActividadRepository actividadRepository, PaqueteActividadRepository paqueteActividadRepository, HospedajeRepository hospedajeRepository, PaqueteHospedajeRepository paqueteHospedajeRepository) {
        this.paqueteTuristicoRepository = paqueteTuristicoRepository;
        this.actividadRepository = actividadRepository;
        this.paqueteActividadRepository = paqueteActividadRepository;
        this.hospedajeRepository = hospedajeRepository;
        this.paqueteHospedajeRepository = paqueteHospedajeRepository;
    }


    /**
     * Método para registrar un paquete turístico en el sistema.
     * @param paqueteTuristicoDTO DTO con los datos del paquete turístico a registrar.
     * @return
     */
    public PaqueteTuristicoDTO registrarPaqueteTuristico(PaqueteTuristicoDTO paqueteTuristicoDTO) {

        validarDatosPaquete(paqueteTuristicoDTO);

        PaqueteTuristico paqueteTuristico = new PaqueteTuristico();
        paqueteTuristico.setNombre(paqueteTuristicoDTO.getNombre());
        paqueteTuristico.setDescripcion(paqueteTuristicoDTO.getDescripcion());
        paqueteTuristico.setPrecioBase(paqueteTuristicoDTO.getPrecioBase());
        paqueteTuristico.setDuracionDias(paqueteTuristicoDTO.getDuracionDias());
        paqueteTuristico.setFechaInicio(paqueteTuristicoDTO.getFechaInicio());
        paqueteTuristico.setFechaFin(paqueteTuristicoDTO.getFechaFin());
        paqueteTuristico.setCupoMaximo(paqueteTuristicoDTO.getCupoMaximo());
        paqueteTuristico.setCuposDisponibles(paqueteTuristicoDTO.getCuposDisponibles());

        paqueteTuristico = paqueteTuristicoRepository.save(paqueteTuristico);
        paqueteTuristicoDTO.setId(paqueteTuristico.getId());
        return paqueteTuristicoDTO;
    }

    /**
     * Método para obtener un paquete turístico por su ID.
     * @param id
     */
    public void eliminarPaqueteTuristico(Integer id) {
        PaqueteTuristico paqueteTuristico = paqueteTuristicoRepository.findById(id)
                .orElseThrow(() -> new ValidacionException("Paquete turístico no encontrado."));
        paqueteTuristicoRepository.delete(paqueteTuristico);
    }

    /**
     * Método para obtener un paquete turístico por su ID.
     * @param id ID del paquete turístico a buscar.
     * @return
     */
    public PaqueteTuristicoDTO obtenerPaqueteTuristico(Integer id) {
        // Buscar el paquete turístico por ID
        PaqueteTuristico paqueteTuristico = paqueteTuristicoRepository.findById(id)
                .orElseThrow(() -> new ValidacionException("Paquete turístico no encontrado."));

        // Mapear las actividades a DTOs
        List<PaqueteActividadDTO> actividadesDTO = paqueteTuristico.getActividades().stream()
                .map(actividad -> new PaqueteActividadDTO(
                        actividad.getId(),
                        actividad.getPaquete().getId(),
                        actividad.getActividad().getId()
                ))
                .toList();

        // Mapear los hospedajes a DTOs
        List<PaqueteHospedajeDTO> hospedajesDTO = paqueteTuristico.getHospedajes().stream()
                .map(hospedaje -> new PaqueteHospedajeDTO(
                        hospedaje.getId(),
                        hospedaje.getPaquete().getId(),
                        hospedaje.getHospedaje().getId()
                ))
                .toList();

        // Crear y devolver el DTO del paquete turístico
        return new PaqueteTuristicoDTO(
                paqueteTuristico.getId(),
                paqueteTuristico.getNombre(),
                paqueteTuristico.getDescripcion(),
                paqueteTuristico.getPrecioBase(),
                paqueteTuristico.getDuracionDias(),
                paqueteTuristico.getFechaInicio(),
                paqueteTuristico.getFechaFin(),
                paqueteTuristico.getCupoMaximo(),
                paqueteTuristico.getCuposDisponibles(),
                actividadesDTO,
                hospedajesDTO
        );
    }

    /**
     * Método para actualizar un paquete turístico.
     * @param id ID del paquete turístico a actualizar.
     * @param paqueteTuristicoDTO DTO con los nuevos datos del paquete turístico.
     * @return
     */
    public PaqueteTuristicoDTO actualizarPaqueteTuristico(Integer id, PaqueteTuristicoDTO paqueteTuristicoDTO) {
        // Verificar si el paquete existe
        PaqueteTuristico paqueteTuristico = paqueteTuristicoRepository.findById(id)
                .orElseThrow(() -> new ValidacionException("Paquete turístico no encontrado."));

        // Validar las fechas
        if (paqueteTuristicoDTO.getFechaInicio() != null && paqueteTuristicoDTO.getFechaInicio().isBefore(LocalDateTime.now())) {
            throw new ValidacionException("La fecha de inicio no puede ser anterior a la fecha actual.");
        }
        if (paqueteTuristicoDTO.getFechaFin() != null && paqueteTuristicoDTO.getFechaFin().isBefore(LocalDateTime.now())) {
            throw new ValidacionException("La fecha de fin no puede ser anterior a la fecha actual.");
        }
        if (paqueteTuristicoDTO.getFechaFin() != null && paqueteTuristicoDTO.getFechaInicio() != null &&
                paqueteTuristicoDTO.getFechaFin().isBefore(paqueteTuristicoDTO.getFechaInicio())) {
            throw new ValidacionException("La fecha de fin no puede ser anterior a la fecha de inicio.");
        }

        // Actualizar los datos del paquete
        paqueteTuristico.setNombre(paqueteTuristicoDTO.getNombre());
        paqueteTuristico.setDescripcion(paqueteTuristicoDTO.getDescripcion());
        paqueteTuristico.setPrecioBase(paqueteTuristicoDTO.getPrecioBase());
        paqueteTuristico.setDuracionDias(paqueteTuristicoDTO.getDuracionDias());
        paqueteTuristico.setFechaInicio(paqueteTuristicoDTO.getFechaInicio());
        paqueteTuristico.setFechaFin(paqueteTuristicoDTO.getFechaFin());
        paqueteTuristico.setCupoMaximo(paqueteTuristicoDTO.getCupoMaximo());
        paqueteTuristico.setCuposDisponibles(paqueteTuristicoDTO.getCuposDisponibles());

        // Guardar los cambios
        paqueteTuristico = paqueteTuristicoRepository.save(paqueteTuristico);

        // Mapear a DTO y devolver
        return new PaqueteTuristicoDTO(
                paqueteTuristico.getId(),
                paqueteTuristico.getNombre(),
                paqueteTuristico.getDescripcion(),
                paqueteTuristico.getPrecioBase(),
                paqueteTuristico.getDuracionDias(),
                paqueteTuristico.getFechaInicio(),
                paqueteTuristico.getFechaFin(),
                paqueteTuristico.getCupoMaximo(),
                paqueteTuristico.getCuposDisponibles(),
                paqueteTuristico.getActividades().stream()
                        .map(actividad -> new PaqueteActividadDTO(
                                actividad.getId(),
                                actividad.getPaquete().getId(),
                                actividad.getActividad().getId()
                        ))
                        .toList(),
                paqueteTuristico.getHospedajes().stream()
                        .map(hospedaje -> new PaqueteHospedajeDTO(
                                hospedaje.getId(),
                                hospedaje.getPaquete().getId(),
                                hospedaje.getHospedaje().getId()
                        ))
                        .toList()
        );
    }

    /**
     * Método para agregar una actividad a un paquete turístico.
     * @param paqueteId
     * @param actividadId
     */
    public void agregarActividad(Integer paqueteId, Integer actividadId) {
        PaqueteTuristico paquete = paqueteTuristicoRepository.findById(paqueteId)
                .orElseThrow(() -> new ValidacionException("Paquete turístico no encontrado."));

        Actividad actividad = actividadRepository.findById(actividadId)
                .orElseThrow(() -> new ValidacionException("Actividad no encontrada."));

        PaqueteActividad nuevoPaqueteActividad = new PaqueteActividad();
        nuevoPaqueteActividad.setPaquete(paquete);
        nuevoPaqueteActividad.setActividad(actividad);

        // Actualizar las relaciones bidireccionales
        paquete.getActividades().add(nuevoPaqueteActividad);
        actividad.getPaquetes().add(nuevoPaqueteActividad);

        // Guardar la nueva relación
        paqueteActividadRepository.save(nuevoPaqueteActividad);
        paqueteTuristicoRepository.save(paquete);
    }

    /**
     * Método para eliminar una actividad de un paquete turístico.
     * @param paqueteId
     * @param actividadId
     */
    public void eliminarActividad(Integer paqueteId, Integer actividadId) {
        PaqueteTuristico paquete = paqueteTuristicoRepository.findById(paqueteId)
                .orElseThrow(() -> new ValidacionException("Paquete turístico no encontrado."));

        paquete.getActividades().removeIf(actividad -> actividad.getId().equals(actividadId));
        paqueteTuristicoRepository.save(paquete);
    }

    /**
     * Método para agregar un hospedaje a un paquete turístico.
     * @param paqueteId ID del paquete turístico.
     * @param hospedajeId ID del hospedaje a agregar.
     */
    public void agregarHospedaje(Integer paqueteId, Integer hospedajeId) {
        PaqueteTuristico paquete = paqueteTuristicoRepository.findById(paqueteId)
                .orElseThrow(() -> new ValidacionException("Paquete turístico no encontrado."));

        Hospedaje hospedaje = hospedajeRepository.findById(hospedajeId)
                .orElseThrow(() -> new ValidacionException("Hospedaje no encontrado."));

        PaqueteHospedaje paqueteHospedaje = new PaqueteHospedaje();
        paqueteHospedaje.setPaquete(paquete);
        paqueteHospedaje.setHospedaje(hospedaje);

        paquete.getHospedajes().add(paqueteHospedaje);
        hospedaje.getPaquetes().add(paqueteHospedaje);

        paqueteHospedajeRepository.save(paqueteHospedaje);
        paqueteTuristicoRepository.save(paquete);
    }

    /**
     * Método para eliminar un hospedaje de un paquete turístico.
     * @param paqueteId ID del paquete turístico.
     * @param hospedajeId ID del hospedaje a eliminar.
     */
    public void eliminarHospedaje(Integer paqueteId, Integer hospedajeId) {
        PaqueteTuristico paquete = paqueteTuristicoRepository.findById(paqueteId)
                .orElseThrow(() -> new ValidacionException("Paquete turístico no encontrado."));

        paquete.getHospedajes().removeIf(hospedaje -> hospedaje.getId().equals(hospedajeId));
        paqueteTuristicoRepository.save(paquete);
    }

    /**
     * Método para listar todos los paquetes turísticos.
     * @return Lista de paquetes turísticos.
     */
    public List<PaqueteTuristicoDTO> listarPaquetesTuristicos() {
        return paqueteTuristicoRepository.findAll().stream()
                .map(paquete -> new PaqueteTuristicoDTO(
                        paquete.getId(),
                        paquete.getNombre(),
                        paquete.getDescripcion(),
                        paquete.getPrecioBase(),
                        paquete.getDuracionDias(),
                        paquete.getFechaInicio(),
                        paquete.getFechaFin(),
                        paquete.getCupoMaximo(),
                        paquete.getCuposDisponibles(),
                        paquete.getActividades().stream()
                                .map(actividad -> new PaqueteActividadDTO(
                                        actividad.getId(),
                                        actividad.getPaquete().getId(),
                                        actividad.getActividad().getId()
                                ))
                                .toList(),
                        paquete.getHospedajes().stream()
                                .map(hospedaje -> new PaqueteHospedajeDTO(
                                        hospedaje.getId(),
                                        hospedaje.getPaquete().getId(),
                                        hospedaje.getHospedaje().getId()
                                ))
                                .toList()
                ))
                .toList();
    }

    /**
     * Método para verificar la disponibilidad de cupos en un paquete turístico.
     * @param paqueteId ID del paquete turístico a verificar.
     * @return true si hay cupos disponibles, false en caso contrario.
     */
    public boolean verificarDisponibilidadCupos(Integer paqueteId) {
        PaqueteTuristico paquete = paqueteTuristicoRepository.findById(paqueteId)
                .orElseThrow(() -> new ValidacionException("Paquete turístico no encontrado."));
        return paquete.getCuposDisponibles() > 0;
    }

    /**
     * Método para actualizar los cupos disponibles de un paquete turístico.
     * @param paqueteId ID del paquete turístico.
     * @param cantidadReservada Cantidad de cupos reservados.
     */
    public void actualizarCuposDisponibles(Integer paqueteId, int cantidadReservada) {
        PaqueteTuristico paquete = paqueteTuristicoRepository.findById(paqueteId)
                .orElseThrow(() -> new ValidacionException("Paquete turístico no encontrado."));

        if (paquete.getCuposDisponibles() < cantidadReservada) {
            throw new ValidacionException("No hay suficientes cupos disponibles.");
        }

        paquete.setCuposDisponibles(paquete.getCuposDisponibles() - cantidadReservada);
        paqueteTuristicoRepository.save(paquete);
    }


    /**
     * Método para validar los datos de un paquete turístico.
     * @param paqueteTuristicoDTO DTO con los datos del paquete turístico a validar.
     */
    private void validarDatosPaquete(PaqueteTuristicoDTO paqueteTuristicoDTO) {

        if (paqueteTuristicoDTO.getNombre() == null || paqueteTuristicoDTO.getNombre().isEmpty()) {
            throw new ValidacionException("El nombre del paquete turístico no puede estar vacío.");
        }
        if (paqueteTuristicoDTO.getDescripcion() == null || paqueteTuristicoDTO.getDescripcion().isEmpty()) {
            throw new ValidacionException("La descripción del paquete turístico no puede estar vacía.");
        }
        if (paqueteTuristicoDTO.getPrecioBase() == null || paqueteTuristicoDTO.getPrecioBase().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidacionException("El precio base del paquete turístico debe ser mayor que cero.");
        }
        if (paqueteTuristicoDTO.getDuracionDias() <= 0) {
            throw new ValidacionException("La duración en días del paquete turístico debe ser mayor que cero.");
        }
        if (paqueteTuristicoDTO.getCupoMaximo() <= 0) {
            throw new ValidacionException("El cupo máximo del paquete turístico debe ser mayor que cero.");
        }
        if (paqueteTuristicoDTO.getCuposDisponibles() < 0 || paqueteTuristicoDTO.getCuposDisponibles() > paqueteTuristicoDTO.getCupoMaximo()) {
            throw new ValidacionException("Los cupos disponibles deben estar entre 0 y el cupo máximo.");
        }
        if (paqueteTuristicoDTO.getFechaInicio() == null) {
            throw new ValidacionException("La fecha de inicio no puede estar vacía.");
        }
        if (paqueteTuristicoDTO.getFechaFin() == null) {
            throw new ValidacionException("La fecha de fin no puede estar vacía.");
        }
        if (paqueteTuristicoDTO.getFechaFin().isBefore(paqueteTuristicoDTO.getFechaInicio())) {
            throw new ValidacionException("La fecha de fin no puede ser anterior a la fecha de inicio.");
        }
    }


}
