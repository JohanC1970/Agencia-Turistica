package co.uniquindio.edu.Agencia_Turistica.repository;

import co.uniquindio.edu.Agencia_Turistica.model.TipoHabitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoHabitacionRepository extends JpaRepository<TipoHabitacion, Integer> {
    TipoHabitacion findByNombre(String nombre);
}
