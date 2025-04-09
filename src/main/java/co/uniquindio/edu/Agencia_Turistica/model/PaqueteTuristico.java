package co.uniquindio.edu.Agencia_Turistica.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "paquetes_turisticos")
public class PaqueteTuristico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioBase;

    @Column(nullable = false)
    private Integer duracionDias;

    private LocalDateTime fechaInicio;

    private LocalDateTime fechaFin;

    @Column(nullable = false)
    private Integer cupoMaximo;

    @Column(nullable = false)
    private Integer cuposDisponibles;

    @OneToMany(mappedBy = "paquete", cascade= CascadeType.REMOVE, orphanRemoval = true)
    private List<PaqueteActividad> actividades = new ArrayList<>();

    @OneToMany(mappedBy = "paquete", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<PaqueteHospedaje> hospedajes = new ArrayList<>();
}
