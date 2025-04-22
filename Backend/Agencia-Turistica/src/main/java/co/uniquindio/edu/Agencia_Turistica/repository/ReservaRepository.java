package co.uniquindio.edu.Agencia_Turistica.repository;

import co.uniquindio.edu.Agencia_Turistica.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
    Optional<Reserva> findByCodigo(String codigo);
    List<Reserva> findByCliente(Cliente cliente);
    List<Reserva> findByEmpleado(Empleado empleado);
    List<Reserva> findByPaquete(PaqueteTuristico paquete);
    List<Reserva> findByEstado(EstadoReserva estado);
    List<Reserva> findByFechaInicioBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);
    List<Reserva> findByFechaReservaBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);

    @Query("SELECT COUNT(r) FROM Reserva r WHERE r.estado = :estado AND r.fechaInicio BETWEEN :inicio AND :fin")
    Long countByEstadoAndFechaInicioBetween(EstadoReserva estado, LocalDateTime inicio, LocalDateTime fin);
}
