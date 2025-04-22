package co.uniquindio.edu.Agencia_Turistica.repository;

import co.uniquindio.edu.Agencia_Turistica.model.CaracteristicaTipoHabitacion;
import co.uniquindio.edu.Agencia_Turistica.model.TipoHabitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CaracteristicaTipoHabitacionRepository extends JpaRepository<CaracteristicaTipoHabitacion, Integer> {
    List<CaracteristicaTipoHabitacion> findByTipoHabitacion(TipoHabitacion tipoHabitacion);
}