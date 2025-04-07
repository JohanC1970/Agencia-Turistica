package co.uniquindio.edu.Agencia_Turistica.service;

import co.uniquindio.edu.Agencia_Turistica.repository.CaracteristicaTipoHabitacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CaracteristicaTipoHabitacionService {

    private final CaracteristicaTipoHabitacionRepository caracteristicaTipoHabitacionRepository;

    @Autowired
    public CaracteristicaTipoHabitacionService(CaracteristicaTipoHabitacionRepository caracteristicaTipoHabitacionRepository) {
        this.caracteristicaTipoHabitacionRepository = caracteristicaTipoHabitacionRepository;
    }
}
