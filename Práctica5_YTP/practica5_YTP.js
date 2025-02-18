// Componente Web para las cartas del juego
class CartaMemoria extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Crea un shadow DOM para encapsular el componente
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
        this.carta = this.shadowRoot.querySelector('.carta'); // Referencia al elemento de la carta
        this.carta.addEventListener('click', () => this.voltear()); // Agrega evento de clic para voltear
    }

    // Setter para asignar el valor de la carta
    set valor(val) {
        this._valor = val;
    }

    // Función para voltear la carta
    voltear() {
        if (JuegoMemoria.parejasSeleccionadas.length < 2 && !this.carta.classList.contains('revelada')) {
            this.carta.textContent = this._valor; // Muestra el valor real de la carta
            this.carta.classList.add('revelada'); // Marca la carta como revelada
            JuegoMemoria.parejasSeleccionadas.push(this); // Agrega la carta al array de selección

            if (JuegoMemoria.parejasSeleccionadas.length === 2) {
                JuegoMemoria.verificarPareja();
            }
        }
    }

    // Función para ocultar la carta si no es pareja
    ocultar() {
        this.carta.textContent = '?'; // Vuelve a mostrar el signo de interrogación
        this.carta.classList.remove('revelada'); // Quita la clase revelada
    }
}

// Define el nuevo elemento personalizado en el navegador
customElements.define('carta-memoria', CartaMemoria);

// Objeto que maneja la lógica del juego
const JuegoMemoria = {
    parejasSeleccionadas: [], // Almacena las cartas seleccionadas temporalmente
    parejasEncontradas: 0, // Contador de parejas encontradas
    totalParejas: 6, // Total de parejas en el juego

    // Función que devuelve una promesa para esperar antes de verificar la pareja
    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Verifica si las cartas seleccionadas son pareja
    async verificarPareja() {
        await this.esperar(1000); // Espera 1 segundo antes de verificar
        const [carta1, carta2] = this.parejasSeleccionadas;
        if (carta1._valor === carta2._valor) { // Si son pareja, incrementa el contador
            this.parejasEncontradas++;
            if (this.parejasEncontradas === this.totalParejas) {
                this.mostrarPantallaExito(); // Si se encuentran todas, mostrar éxito
            }
        } else { // Si no son pareja, las oculta
            carta1.ocultar();
            carta2.ocultar();
        }
        this.parejasSeleccionadas = []; // Reinicia el array de selección
    },

    // Muestra la pantalla de éxito
    mostrarPantallaExito() {
        document.getElementById('juego').style.display = 'none'; // Oculta el tablero
        document.getElementById('exito').style.display = 'block'; // Muestra la pantalla de éxito
    }
};

// Función para iniciar el juego
const iniciarJuego = async () => {
    const valores = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍍', '🍎', '🍌', '🍇', '🍉', '🍓', '🍍'];
    valores.sort(() => Math.random() - 0.5); // Mezcla las cartas aleatoriamente
    const tablero = document.getElementById('tablero');
    tablero.innerHTML = ''; // Limpia el tablero antes de empezar
    JuegoMemoria.parejasEncontradas = 0; // Reinicia el contador de parejas encontradas

    for (let valor of valores) {
        const carta = document.createElement('carta-memoria'); // Crea una nueva carta personalizada
        carta.valor = valor; // Asigna el valor de la carta
        tablero.appendChild(carta); // Agrega la carta al tablero
    }
};

// Evento para iniciar el juego al hacer clic en el botón

document.getElementById('iniciar').addEventListener('click', () => {
    document.getElementById('inicio').style.display = 'none'; // Oculta la pantalla de inicio
    document.getElementById('juego').style.display = 'block'; // Muestra el tablero del juego
    iniciarJuego(); // Llama a la función para iniciar el juego
});
