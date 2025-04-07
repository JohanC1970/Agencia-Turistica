package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.model.PaqueteHospedaje;
import co.uniquindio.edu.Agencia_Turistica.repository.PaqueteHospedajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaqueteHospedajeService {

    private final PaqueteHospedajeRepository paqueteHospedajeRepository;

    @Autowired
    public PaqueteHospedajeService(PaqueteHospedajeRepository paqueteHospedajeRepository) {
        this.paqueteHospedajeRepository = paqueteHospedajeRepository;
    }

}
