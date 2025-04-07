package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.repository.PaqueteTuristicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaqueteTuristicoService {

    private final PaqueteTuristicoRepository paqueteTuristicoRepository;

    @Autowired
    public PaqueteTuristicoService(PaqueteTuristicoRepository paqueteTuristicoRepository) {
        this.paqueteTuristicoRepository = paqueteTuristicoRepository;
    }
}
