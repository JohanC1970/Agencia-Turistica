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
@Table(name = "habitaciones")
public class Habitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "hospedaje_id", nullable = false)
    private Hospedaje hospedaje;

    @ManyToOne
    @JoinColumn(name = "tipo_habitacion_id", nullable = false)
    private TipoHabitacion tipoHabitacion;

    @Column(unique = true, nullable = false)
    private String codigo;

    @Column(nullable = false)
    private Integer capacidad;

    @Column(precision = 10, scale = 2)
    private BigDecimal precioPorNoche;

    private Boolean disponible;

    @OneToMany(mappedBy = "habitacion")
    private List<ReservaHabitacion> reservas;

    @PrePersist
    protected void onCreate() {
        disponible = true;
    }
}