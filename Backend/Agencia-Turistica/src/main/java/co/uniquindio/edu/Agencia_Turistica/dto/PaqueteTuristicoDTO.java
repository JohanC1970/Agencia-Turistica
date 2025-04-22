package co.uniquindio.edu.Agencia_Turistica.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaqueteTuristicoDTO {

    private Integer id;
    private String nombre;
    private String descripcion;
    private BigDecimal precioBase;
    private Integer duracionDias;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private Integer cupoMaximo;
    private Integer cuposDisponibles;
    private List<PaqueteActividadDTO> actividades;
    private List<PaqueteHospedajeDTO> hospedajes;
}