package co.uniquindio.edu.Agencia_Turistica.repository;

import co.uniquindio.edu.Agencia_Turistica.model.Actividad;
import co.uniquindio.edu.Agencia_Turistica.model.PaqueteActividad;
import co.uniquindio.edu.Agencia_Turistica.model.PaqueteTuristico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaqueteActividadRepository extends JpaRepository<PaqueteActividad, Integer> {
    List<PaqueteActividad> findByPaquete(PaqueteTuristico paquete);
    List<PaqueteActividad> findByActividad(Actividad actividad);
    void deleteByPaqueteAndActividad(PaqueteTuristico paquete, Actividad actividad);
}
