package co.uniquindio.edu.Agencia_Turistica.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tipos_habitacion")
public class TipoHabitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(precision = 5, scale = 2)
    private BigDecimal factorPrecio;

    @OneToMany(mappedBy = "tipoHabitacion", cascade = CascadeType.ALL)
    private List<CaracteristicaTipoHabitacion> caracteristicas;

    @OneToMany(mappedBy = "tipoHabitacion")
    private List<Habitacion> habitaciones;
}
