package co.uniquindio.edu.Agencia_Turistica.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActividadDTO {

    private Integer id;
    private String nombre;
    private String descripcion;
    private String ubicacion;
    private BigDecimal precio;
    private Integer duracionHoras;
    private Integer cupoMaximo;
    private Integer cuposDisponibles;
    private LocalDateTime fechaInicio;
    private List<PaqueteActividadDTO> paquetes;

}
