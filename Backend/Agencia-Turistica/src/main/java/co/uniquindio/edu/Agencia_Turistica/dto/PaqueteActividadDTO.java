package co.uniquindio.edu.Agencia_Turistica.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PaqueteActividadDTO {

    private Integer id;
    private Integer paqueteTuristicoId; // Referencia al ID del paquete turistico
    private Integer actividadId; // Referencia al ID de la actividad
}