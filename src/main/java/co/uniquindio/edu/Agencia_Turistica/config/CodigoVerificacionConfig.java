package co.uniquindio.edu.Agencia_Turistica.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;


@Component
@ConfigurationProperties(prefix = "codigo.verificacion")
public class CodigoVerificacionConfig {

    private int expiracionMinutos;

    public int getExpiracionMinutos() {
        return expiracionMinutos;
    }

    public void setExpiracionMinutos(int expiracionMinutos) {
        this.expiracionMinutos = expiracionMinutos;
    }
}
