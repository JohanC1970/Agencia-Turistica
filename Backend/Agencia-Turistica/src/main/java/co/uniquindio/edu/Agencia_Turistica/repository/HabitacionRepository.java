package co.uniquindio.edu.Agencia_Turistica.repository;

import co.uniquindio.edu.Agencia_Turistica.model.Habitacion;
import co.uniquindio.edu.Agencia_Turistica.model.Hospedaje;
import co.uniquindio.edu.Agencia_Turistica.model.TipoHabitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface HabitacionRepository extends JpaRepository<Habitacion, Integer> {
    Optional<Habitacion> findByCodigo(String codigo);
    List<Habitacion> findByHospedaje(Hospedaje hospedaje);
    List<Habitacion> findByHospedajeAndTipoHabitacion(Hospedaje hospedaje, TipoHabitacion tipoHabitacion);
    List<Habitacion> findByDisponible(Boolean disponible);
    List<Habitacion> findByHospedajeAndDisponible(Hospedaje hospedaje, Boolean disponible);
    List<Habitacion> findByCapacidadGreaterThanEqual(Integer capacidad);

    @Query("SELECT h FROM Habitacion h WHERE h.id NOT IN " +
            "(SELECT rh.habitacion.id FROM ReservaHabitacion rh " +
            "WHERE (rh.fechaInicio <= :fechaFin AND rh.fechaFin >= :fechaInicio))")
    List<Habitacion> findDisponiblesByFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin);

    @Query("SELECT h FROM Habitacion h WHERE h.hospedaje.id = :hospedajeId AND h.id NOT IN " +
            "(SELECT rh.habitacion.id FROM ReservaHabitacion rh " +
            "WHERE (rh.fechaInicio <= :fechaFin AND rh.fechaFin >= :fechaInicio))")
    List<Habitacion> findDisponiblesByHospedajeAndFechas(Integer hospedajeId, LocalDateTime fechaInicio, LocalDateTime fechaFin);
}