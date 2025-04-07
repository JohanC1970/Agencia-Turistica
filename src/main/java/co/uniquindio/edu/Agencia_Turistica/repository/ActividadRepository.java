package co.uniquindio.edu.Agencia_Turistica.repository;

import co.uniquindio.edu.Agencia_Turistica.model.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Integer> {
    List<Actividad> findByUbicacionContaining(String ubicacion);
    List<Actividad> findByFechaHoraAfter(LocalDateTime fecha);
    List<Actividad> findByFechaHoraBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);
    List<Actividad> findByCuposDisponiblesGreaterThan(Integer cupos);
}
