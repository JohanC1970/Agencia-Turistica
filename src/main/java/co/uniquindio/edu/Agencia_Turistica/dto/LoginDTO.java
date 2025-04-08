package co.uniquindio.edu.Agencia_Turistica.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoginDTO {

    @Email
    @NotNull
    private String email;
    private String password;

}
