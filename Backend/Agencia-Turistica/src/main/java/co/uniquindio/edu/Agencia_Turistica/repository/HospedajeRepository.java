package co.uniquindio.edu.Agencia_Turistica.repository;

import co.uniquindio.edu.Agencia_Turistica.model.Hospedaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HospedajeRepository extends JpaRepository<Hospedaje, Integer> {
    List<Hospedaje> findByCiudad(String ciudad);
    List<Hospedaje> findByPais(String pais);
    List<Hospedaje> findByEstrellas(Integer estrellas);
    List<Hospedaje> findByEstrellasGreaterThanEqual(Integer estrellas);
}