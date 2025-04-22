package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.repository.PaqueteActividadRepository;
import org.springframework.beans.factory.annotation.Autowired;

public class PaqueteActividadService {

    private final PaqueteActividadRepository paqueteActividadRepository;

    @Autowired
    public PaqueteActividadService(PaqueteActividadRepository paqueteActividadRepository) {
        this.paqueteActividadRepository = paqueteActividadRepository;
    }
}
