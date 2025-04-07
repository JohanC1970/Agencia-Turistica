package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmpleadoService {

    private final EmpleadoRepository empleadoRepository;

    @Autowired
    public EmpleadoService(EmpleadoRepository empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

}
