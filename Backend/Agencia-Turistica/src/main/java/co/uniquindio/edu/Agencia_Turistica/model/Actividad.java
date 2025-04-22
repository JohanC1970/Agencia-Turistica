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
@Table(name = "actividades")
public class Actividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private String ubicacion;

    @Column(precision = 10, scale = 2)
    private BigDecimal precio;

    private Integer duracionHoras;

    private Integer cupoMaximo;

    private Integer cuposDisponibles;

    private LocalDateTime fechaInicio;

    @OneToMany(mappedBy = "actividad")
    private List<PaqueteActividad> paquetes = new ArrayList<>();
}
