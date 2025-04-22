package co.uniquindio.edu.Agencia_Turistica.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PaqueteHospedajeDTO {

    private Integer id;
    private Integer paqueteTuristicoId; // Referencia al ID del paquete turístico
    private Integer hospedajeId; // Referencia al ID del hospedaje
}