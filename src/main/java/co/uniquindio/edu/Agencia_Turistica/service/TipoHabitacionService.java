package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.repository.TipoHabitacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TipoHabitacionService {

    private final TipoHabitacionRepository tipoHabitacionRepository;

    @Autowired
    public TipoHabitacionService(TipoHabitacionRepository tipoHabitacionRepository) {
        this.tipoHabitacionRepository = tipoHabitacionRepository;
    }

}
