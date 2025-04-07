package co.uniquindio.edu.Agencia_Turistica.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pagos")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "reserva_id", nullable = false)
    private Reserva reserva;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal monto;

    @Column(nullable = false)
    private LocalDateTime fechaPago;

    private String referenciaPago;

    private Boolean confirmado;

    @PrePersist
    protected void onCreate() {
        fechaPago = LocalDateTime.now();
        if (confirmado == null) {
            confirmado = false;
        }
    }
}
