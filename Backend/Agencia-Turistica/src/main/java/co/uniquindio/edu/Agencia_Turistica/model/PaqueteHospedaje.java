package co.uniquindio.edu.Agencia_Turistica.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "paquetes_hospedajes")
public class PaqueteHospedaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "paquete_id", nullable = false)
    private PaqueteTuristico paquete;

    @ManyToOne
    @JoinColumn(name = "hospedaje_id", nullable = false)
    private Hospedaje hospedaje;
}
