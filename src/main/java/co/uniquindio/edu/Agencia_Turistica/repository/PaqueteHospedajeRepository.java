package co.uniquindio.edu.Agencia_Turistica.repository;

import co.uniquindio.edu.Agencia_Turistica.model.Hospedaje;
import co.uniquindio.edu.Agencia_Turistica.model.PaqueteHospedaje;
import co.uniquindio.edu.Agencia_Turistica.model.PaqueteTuristico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaqueteHospedajeRepository extends JpaRepository<PaqueteHospedaje, Integer> {
    List<PaqueteHospedaje> findByPaquete(PaqueteTuristico paquete);
    List<PaqueteHospedaje> findByHospedaje(Hospedaje hospedaje);
    void deleteByPaqueteAndHospedaje(PaqueteTuristico paquete, Hospedaje hospedaje);
}
