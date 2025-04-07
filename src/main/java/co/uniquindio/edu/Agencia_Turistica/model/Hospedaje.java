package co.uniquindio.edu.Agencia_Turistica.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hospedajes")
public class Hospedaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String direccion;

    @Column(nullable = false)
    private String ciudad;

    @Column(nullable = false)
    private String pais;

    private Integer estrellas;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @OneToMany(mappedBy = "hospedaje")
    private List<Habitacion> habitaciones;

    @OneToMany(mappedBy = "hospedaje")
    private List<PaqueteHospedaje> paquetes;
}
