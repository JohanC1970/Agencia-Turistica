package co.uniquindio.edu.Agencia_Turistica.repository;

import co.uniquindio.edu.Agencia_Turistica.model.PaqueteTuristico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaqueteTuristicoRepository extends JpaRepository<PaqueteTuristico, Integer> {
    List<PaqueteTuristico> findByFechaInicioAfter(LocalDateTime fecha);
    List<PaqueteTuristico> findByFechaInicioBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);
    List<PaqueteTuristico> findByPrecioBaseLessThanEqual(Double precio);
    List<PaqueteTuristico> findByDuracionDiasLessThanEqual(Integer dias);
    List<PaqueteTuristico> findByCuposDisponiblesGreaterThan(Integer cupos);

    @Query("SELECT p FROM PaqueteTuristico p JOIN p.hospedajes ph WHERE ph.hospedaje.ciudad = :ciudad")
    List<PaqueteTuristico> findByHospedajeCiudad(String ciudad);
}
