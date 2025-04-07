package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;

    @Autowired
    public ReservaService(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }
}
