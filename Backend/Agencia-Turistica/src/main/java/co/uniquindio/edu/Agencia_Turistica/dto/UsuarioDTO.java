package co.uniquindio.edu.Agencia_Turistica.dto;

import co.uniquindio.edu.Agencia_Turistica.model.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NonNull;

import javax.swing.text.StyledEditorKit;
import java.time.LocalDate;

@Data
public class UsuarioDTO {

    @NotNull
    @NotBlank
    private String id;

    private String nombre;
    private String apellidos;

    @Email
    @NotBlank
    private String email;

    private String password;

    private Rol rol;

    private Boolean estado;
}
