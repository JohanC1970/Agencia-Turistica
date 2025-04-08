package co.uniquindio.edu.Agencia_Turistica.repository;

import co.uniquindio.edu.Agencia_Turistica.model.Cliente;
import co.uniquindio.edu.Agencia_Turistica.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, String> {
    Optional<Cliente> findByUsuario(Usuario usuario);
    Optional<Cliente> findByDocumento(String documento);
    boolean existsByDocumento(String documento);
}
