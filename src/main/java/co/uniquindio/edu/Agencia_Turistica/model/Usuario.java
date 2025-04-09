package co.uniquindio.edu.Agencia_Turistica.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {

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

    private Boolean estado = true; //Atributo para indicar si el usuario está activo o bloqueado

    @PrePersist
    protected void onCreate() {
        if(fechaRegistro == null){
            fechaRegistro = LocalDateTime.now();
        }
        if(cuentaVerificada == null){
            cuentaVerificada = false;
        }
        if(estado == null){
            estado = true;
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(rol.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return estado;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return cuentaVerificada;
    }
}
