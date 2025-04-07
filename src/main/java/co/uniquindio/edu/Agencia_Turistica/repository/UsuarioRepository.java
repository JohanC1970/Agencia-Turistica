package co.uniquindio.edu.Agencia_Turistica.repository;

import co.uniquindio.edu.Agencia_Turistica.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Usuario> findByCodigoVerificacion(String codigoVerificacion);

}
