// 1. CAPTURA DE ELEMENTOS DEL DOM
const btnGenerar = document.getElementById('btn-generar');
const contenedorPaleta = document.getElementById('paleta');
const selectCantidad = document.getElementById('select-cantidad');
const toast = document.getElementById('toast');
const toggleFormato = document.getElementById('toggle-formato');

// Array global para guardar los colores actuales en memoria
let coloresActuales = [];

/**
 * 2. FUNCIÓN PARA GENERAR UN COLOR HEXADECIMAL ALEATORIO
 */
function generarColorAleatorio() {
    const caracteres = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += caracteres[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * AUXILIAR: Convierte un color HEX (#FFFFFF) a formato HSL (hsl(H, S%, L%))
 */
function hexToHsl(hex) {
    // Convertimos el hex a valores RGB intermedios
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // acromático
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    // Formateamos los números para que queden redondos y limpios
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * 3. FUNCIÓN PRINCIPAL: RENDERIZAR LA PALETA EN PANTALLA
 */
function mostrarPaleta() {
    contenedorPaleta.innerHTML = '';
    
    // Leemos si el switch está activado (true = HEX, false = HSL)
    const mostrarHex = toggleFormato.checked;

    coloresActuales.forEach(nuevoColor => {
        // Determinamos si mostramos HEX o convertimos a HSL según el Toggle
        const textoColor = mostrarHex ? nuevoColor : hexToHsl(nuevoColor);
        
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('color-card');
        
        tarjeta.innerHTML = `
            <div class="color-box" style="background-color: ${nuevoColor}" title="Click para copiar"></div>
            <div class="color-info">
                <span>${textoColor}</span>
                <button class="btn-copy">
                    <i class="fa-regular fa-copy"></i>
                </button>
            </div>
        `;
        
        // Eventos de copiado usando el texto dinámico (HEX o HSL)
        tarjeta.querySelector('.color-box').addEventListener('click', () => {
            copiarAlPortapapeles(textoColor);
        });
        
        tarjeta.querySelector('.btn-copy').addEventListener('click', () => {
            copiarAlPortapapeles(textoColor);
        });

        contenedorPaleta.appendChild(tarjeta);
    });
}

/**
 * FUNCIÓN PARA DISPARAR LA NUEVA GENERACIÓN DE COLORES
 */
function manejarNuevaPaleta() {
    coloresActuales = [];
    const cantidad = parseInt(selectCantidad.value);
    
    for (let i = 0; i < cantidad; i++) {
        coloresActuales.push(generarColorAleatorio());
    }
    mostrarPaleta();
}

/**
 * 4. FUNCIÓN PARA COPIAR AL PORTAPAPELES
 */
function copiarAlPortapapeles(texto) {
    navigator.clipboard.writeText(texto)
        .then(() => {
            toast.textContent = `¡Copiado: ${texto}!`;
            toast.style.display = 'block';
            
            setTimeout(() => {
                toast.style.display = 'none';
            }, 2000);
        })
        .catch(err => {
            console.error('Error al copiar: ', err);
        });
}

// Escucha cuando el usuario cambia el interruptor (Toggle)
toggleFormato.addEventListener('change', () => {
    // 1. Volvemos a dibujar las tarjetas con el formato nuevo
    mostrarPaleta();
    
    // 2. 👁️ SÓLO SI YA HAY COLORES GENERADOS, mostramos el feedback de cambio
    if (coloresActuales.length > 0) {
        const formatoActual = toggleFormato.checked ? 'HEX' : 'HSL';
        
        // Reutilizamos la lógica del toast para darle feedback al usuario
        toast.textContent = `Formato cambiado a: ${formatoActual}`;
        toast.style.display = 'block';
        
        // Lo ocultamos automáticamente a los 2 segundos
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2000);
    }
});

// 5. ESCUCHADORES DE EVENTOS (EVENT LISTENERS)
btnGenerar.addEventListener('click', manejarNuevaPaleta);

// Escucha cuando el usuario cambia el interruptor para transformar los códigos al vuelo
toggleFormato.addEventListener('change', mostrarPaleta);

// Ejecución inicial al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    toggleFormato.checked = true; // Arranca por defecto mostrando HEX
    
    // 👁️ BORRAMOS la línea "manejarNuevaPaleta();" para que empiece vacío.
    contenedorPaleta.innerHTML = ''; 
});

