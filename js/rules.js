// Estado del juego
let jugador1Posicion = 0;
let jugador2Posicion = 0;
const casillasTotales = 20;
let turnoJugador = 1; // 1 para Jugador 1, 2 para Jugador 2
let movimientosRestantes = 0; // Cantidad de movimientos que el jugador puede realizar

// Casillas especiales: avanzan o retroceden
const casillasEspeciales = {
    3: 2,  // La casilla 3 avanza 2 posiciones extra
    7: -3, // La casilla 7 retrocede 3 posiciones
    12: 1, // La casilla 12 avanza 1 posición extra
    15: -2 // La casilla 15 retrocede 2 posiciones
};

// Función para narrar los mensajes
function narrar(texto) {
    const narrador = new SpeechSynthesisUtterance(texto);
    narrador.lang = 'es-ES';
    window.speechSynthesis.speak(narrador);
}

// Crear el tablero
const tableroDiv = document.getElementById("tablero");
for (let i = 1; i <= casillasTotales; i++) {
    const casilla = document.createElement("div");
    casilla.id = `casilla-${i}`;
    casilla.classList.add("casilla");

    // Marcar casillas especiales en el tablero
    if (casillasEspeciales[i]) {
        if (casillasEspeciales[i] > 0) {
            casilla.classList.add('casilla-avanzar');
        } else if (casillasEspeciales[i] < 0) {
            casilla.classList.add('casilla-retroceder');
        }
    }
    tableroDiv.appendChild(casilla);
}

// Función para actualizar la vista del tablero
function actualizarTablero() {
    // Limpiar todas las casillas
    for (let i = 1; i <= casillasTotales; i++) {
        document.getElementById(`casilla-${i}`).classList.remove('jugador1', 'jugador2');
    }

    // Actualizar posiciones de los jugadores
    if (jugador1Posicion > 0) {
        document.getElementById(`casilla-${jugador1Posicion}`).classList.add('jugador1');
    }
    if (jugador2Posicion > 0) {
        document.getElementById(`casilla-${jugador2Posicion}`).classList.add('jugador2');
    }  
}

// Verificar si un jugador ha ganado
function verificarGanador() {
    if (jugador1Posicion >= casillasTotales) {
        narrar("El jugador 1 ha ganado.");
        document.getElementById("estadoJuego").textContent = "Jugador 1 ha ganado.";
        return true;
    } else if (jugador2Posicion >= casillasTotales) {
        narrar("El jugador 2 ha ganado.");
        document.getElementById("estadoJuego").textContent = "Jugador 2 ha ganado.";
        return true;
    }
    return false;
}

// Aplicar efectos de las casillas especiales
function aplicarCasillaEspecial(posicion, jugador) {
    if (casillasEspeciales[posicion]) {
        let movimientoExtra = casillasEspeciales[posicion];
        if (jugador === 1) {
            jugador1Posicion += movimientoExtra;
        } else if (jugador === 2) {
            jugador2Posicion += movimientoExtra;
        }
        narrar(`Has caído en una casilla especial. ${movimientoExtra > 0 ? 'Avanzas' : 'Retrocedes'} 
            ${Math.abs(movimientoExtra)} casillas.
            Ahora estás en la casilla ${movimientoExtra + posicion}`);
    }
}

// Función para mover una casilla por vez cuando se presiona la barra espaciadora
function moverUnaCasilla(jugador) {

    const sonidoMovimiento = new Audio('../sounds/beep.mp3'); // Ruta al archivo de sonido

    if (movimientosRestantes > 0) {
        if (jugador === 1 && jugador1Posicion < casillasTotales) {
            jugador1Posicion++;
            sonidoMovimiento.play(); // Reproducir el sonido
        } else if (jugador === 2 && jugador2Posicion < casillasTotales) {
            jugador2Posicion++;
            sonidoMovimiento.play(); // Reproducir el sonido
        }

        movimientosRestantes--;
        actualizarTablero();

        if (movimientosRestantes === 0) { // Verificar si el jugador ha caído en una casilla especial
            if (jugador === 1 && jugador1Posicion <= casillasTotales) {
                aplicarCasillaEspecial(jugador1Posicion, 1);
            } else if (jugador === 2 && jugador2Posicion <= casillasTotales) {
                aplicarCasillaEspecial(jugador2Posicion, 2);
            }
            actualizarTablero();
            if (!verificarGanador()) {
                turnoJugador = turnoJugador === 1 ? 2 : 1; // Cambia turno al otro jugador
                narrar(`Es el turno del Jugador ${turnoJugador}.`);
                document.getElementById("estadoJuego").textContent = `Es el turno del Jugador ${turnoJugador}`;
            }
        }
    }
}

// Función para que el jugador elija cuántas casillas desea avanzar
function moverJugador(jugador) {
    let posiciones = parseInt(prompt(`Jugador ${jugador}, ¿cuántas casillas quieres avanzar?`, "1"));

    if (isNaN(posiciones) || posiciones <= 0) {
        narrar("Por favor ingresa un número válido de casillas.");
        return;
    }

    if (jugador === 1 && jugador1Posicion + posiciones <= casillasTotales) {
        movimientosRestantes = posiciones;
        narrar(`Jugador 1 debe avanzar ${posiciones} casillas. Pulsa la barra espaciadora para avanzar.`);
    } else if (jugador === 2 && jugador2Posicion + posiciones <= casillasTotales) {
        movimientosRestantes = posiciones;
        narrar(`Jugador 2 debe avanzar ${posiciones} casillas. Pulsa la barra espaciadora para avanzar.`);
    } else {
        narrar("El movimiento te llevaría más allá del tablero. Elige un número menor.");
    }
}

// Manejo de las teclas para mover a los jugadores
document.addEventListener("keydown", function(event) {
    if (turnoJugador === 1 && event.code === "ArrowRight") {
        moverJugador(1); // Jugador 1 usa la flecha derecha para indicar cuántas casillas quiere avanzar
    } else if (turnoJugador === 2 && event.code === "ArrowLeft") {
        moverJugador(2); // Jugador 2 usa la flecha izquierda para indicar cuántas casillas quiere avanzar
    } else if (event.code === "Space") {
        moverUnaCasilla(turnoJugador); // El jugador mueve una casilla con la barra espaciadora
    }
});

// Inicio del juego
narrar("Bienvenidos al juego de tablero accesible. Jugador 1 comienza. Pulsa la flecha derecha para moverte.");
actualizarTablero();
