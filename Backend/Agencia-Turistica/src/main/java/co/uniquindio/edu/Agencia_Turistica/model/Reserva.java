package co.uniquindio.edu.Agencia_Turistica.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String codigo;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    @ManyToOne
    @JoinColumn(name = "paquete_id", nullable = false)
    private PaqueteTuristico paquete;

    @Column(nullable = false)
    private LocalDateTime fechaReserva;

    @Column(nullable = false)
    private LocalDateTime fechaInicio;

    @Column(nullable = false)
    private LocalDateTime fechaFin;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal precioTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoReserva estado;

    @Enumerated(EnumType.STRING)
    private FormaPago formaPago;

    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL)
    private List<ReservaHabitacion> habitaciones;

    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL)
    private List<Pago> pagos;

    @PrePersist
    protected void onCreate() {
        fechaReserva = LocalDateTime.now();
        if (estado == null) {
            estado = EstadoReserva.PENDIENTE;
        }
    }
}

