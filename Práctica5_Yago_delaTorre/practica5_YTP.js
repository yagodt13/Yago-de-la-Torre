class CartaMemoria extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .carta {
                    width: 100px;
                    height: 100px;
                    background:rgb(60, 145, 236);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    cursor: pointer;
                    border-radius: 10px;
                }
            </style>
            <div class="carta">?</div>
        `;
        this.carta = this.shadowRoot.querySelector('.carta'); // Elemento de la carta
        this.carta.addEventListener('click', () => this.voltear()); // Agrega clic para voltear
    }

    // Asignar el valor de la carta
    set valor(val) {
        this._valor = val;
    }

    // Función para voltear la carta
    voltear() {
        if (JuegoMemoria.parejasSeleccionadas.length < 2 && !this.carta.classList.contains('revelada')) {
            this.carta.textContent = this._valor; // Muestra el valor de la carta
            this.carta.classList.add('revelada'); // Marca la carta como revelada
            JuegoMemoria.parejasSeleccionadas.push(this); // Agrega la carta al array de selección

            if (JuegoMemoria.parejasSeleccionadas.length === 2) {
                JuegoMemoria.verificarPareja();
            }
        }
    }

    // Función para ocultar la carta si no es la misma
    ocultar() {
        this.carta.textContent = '?'; // Vuelve a voltearla con el signo de interrogacion
        this.carta.classList.remove('revelada'); // Quita la clase revelada
    }
}

// Define el nuevo elemento en el navegador
customElements.define('carta-memoria', CartaMemoria);

const JuegoMemoria = {
    parejasSeleccionadas: [], // Almacena las cartas seleccionadas temporalmente
    parejasEncontradas: 0, // Contador de parejas encontradas
    totalParejas: 6, // Total de parejas en el juego

    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Verifica si las cartas seleccionadas son pareja
    async verificarPareja() {
        await this.esperar(1000); // Espera 1 segundo antes de verificarla
        const [carta1, carta2] = this.parejasSeleccionadas;
        if (carta1._valor === carta2._valor) { // Si son pareja, incrementa el contador
            this.parejasEncontradas++;
            if (this.parejasEncontradas === this.totalParejas) {
                this.mostrarPantallaExito(); // Una vez encontradas todas, se muestra el mensaje de exito
            }
        } else { // Si no son pareja, las oculta
            carta1.ocultar();
            carta2.ocultar();
        }
        this.parejasSeleccionadas = []; // Reinicia las selecciones
    },

    // Muestra la pantalla de éxito
    mostrarPantallaExito() {
        document.getElementById('juego').style.display = 'none'; // Oculta el tablero
        document.getElementById('exito').style.display = 'block'; // Muestra la pantalla de éxito
    }
};

// Función para iniciar el juego con una promesa de carga
const iniciarJuego = async () => {
    document.getElementById('mensaje').textContent = 'Cargando cartas...'; // Muestra mensaje de carga
    await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2s segundo antes de iniciarse
    document.getElementById('mensaje').textContent = ''; // Se va el mensaje de carga
    
    const valores = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍍', '🍎', '🍌', '🍇', '🍉', '🍓', '🍍'];
    valores.sort(() => Math.random() - 0.5); // Mezcla las cartas aleatoriamente para que no tengan el mismo orden
    const tablero = document.getElementById('tablero');
    tablero.innerHTML = ''; // Limpia el tablero antes de empezar
    JuegoMemoria.parejasEncontradas = 0; // Reinicia las parejas encontradas

    for (let valor of valores) {
        const carta = document.createElement('carta-memoria'); // Crea una nueva carta 
        carta.valor = valor; // Asigna el tipo de carta
        tablero.appendChild(carta); // Agrega la carta al tablero
    }
};

// Para iniciar el juego pulsando el botón

document.getElementById('iniciar').addEventListener('click', () => {
    document.getElementById('inicio').style.display = 'none'; // Oculta la pantalla de inicio
    document.getElementById('juego').style.display = 'block'; // Muestra el tablero del juego
    iniciarJuego(); // Llama a la función para iniciar el juego
});
