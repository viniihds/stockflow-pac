package com.stockflow.pac.config;

import java.util.Arrays;

/**
 * Converte a lista de origens CORS (separada por virgula) em um array limpo.
 * Remove espacos e a barra final ("https://app.vercel.app/" vira "https://app.vercel.app"),
 * erro comum que faz o navegador bloquear as requisicoes.
 */
public final class CorsOrigins {

    private CorsOrigins() {
    }

    public static String[] parse(String csv) {
        if (csv == null) {
            return new String[0];
        }
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .map(origin -> origin.replaceAll("/+$", ""))
                .filter(origin -> !origin.isEmpty())
                .toArray(String[]::new);
    }
}
