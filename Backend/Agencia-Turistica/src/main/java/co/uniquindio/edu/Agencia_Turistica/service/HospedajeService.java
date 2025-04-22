package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.repository.HospedajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HospedajeService {

    private final HospedajeRepository hospedajeRepository;

    @Autowired
    public HospedajeService(HospedajeRepository hospedajeRepository) {
        this.hospedajeRepository = hospedajeRepository;
    }

}
