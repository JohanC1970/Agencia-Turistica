package co.uniquindio.edu.Agencia_Turistica.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "administradores")
public class Administrador extends Empleado{


}
