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
@Table(name = "usuarios")
public class Usuario {

    @Id
    private String id; //Identificación de la persona

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Rol rol;

    private String codigoVerificacion;

    private LocalDateTime fechaExpiracionCodigoVerificacion;

    private String codigoRecuperacion;

    private LocalDateTime fechaExpiracionCodigoRecuperacion;

    private Boolean cuentaVerificada = false;

    private LocalDateTime fechaRegistro;

    @PrePersist
    protected void onCreate() {
        if(fechaRegistro == null){
            fechaRegistro = LocalDateTime.now();
        }
        if(cuentaVerificada == null){
            cuentaVerificada = false;
        }
    }

}
