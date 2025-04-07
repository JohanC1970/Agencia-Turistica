package co.uniquindio.edu.Agencia_Turistica.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "empleados")
public class Empleado {

    @Id
    private String id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private Usuario usuario;

    @Column(nullable = false)
    private String departamento;

    @Column(nullable = false)
    private String cargo;

    @Column(nullable = false)
    private LocalDateTime fechaContratacion;

    @PrePersist
    protected void onCreate() {
        fechaContratacion = LocalDateTime.now();
    }
}
