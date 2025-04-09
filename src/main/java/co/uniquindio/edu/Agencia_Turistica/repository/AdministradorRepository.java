package co.uniquindio.edu.Agencia_Turistica.repository;

import co.uniquindio.edu.Agencia_Turistica.model.Administrador;
import co.uniquindio.edu.Agencia_Turistica.model.Empleado;
import co.uniquindio.edu.Agencia_Turistica.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdministradorRepository extends JpaRepository<Administrador, String> {
    Optional<Empleado> findByUsuario(Usuario usuario);
}
