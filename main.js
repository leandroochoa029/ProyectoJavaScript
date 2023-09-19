// Tipos de cambio para seleccionar
const tiposDeCambio = [
    { nombre: "Dólar Tarjeta", impuesto: 0.75 },
    { nombre: "Dólar Qatar", impuesto: 0.80 }
];

// Función para calcular el nuevo precio y mostrar detalles adicionales
function calcularNuevoPrecio(tipoCambioSeleccionado, dolarOficial, dolarBlue) {
    const precioProductoInput = document.getElementById("valorProducto");
    const resultadoImpuesto = document.getElementById("impuestoResultado");
    const resultadoTotal = document.getElementById("totalConImpuestos");
    const impuestosDetalle = document.getElementById('impuestosDetalle');

    const precioProducto = parseFloat(precioProductoInput.value);

    if (!isNaN(precioProducto) && tipoCambioSeleccionado) {
        const impuesto = precioProducto * tipoCambioSeleccionado.impuesto;
        const totalConImpuestos = precioProducto + impuesto;

        resultadoImpuesto.textContent = `: $${impuesto.toFixed(2)}`;
        resultadoTotal.textContent = ` $${totalConImpuestos.toFixed(2)}`;

        // Eliminar y volver a agregar la clase para reiniciar las animaciones
        impuestosDetalle.classList.remove('mostrar-detalle');
        setTimeout(() => {
            impuestosDetalle.classList.add('mostrar-detalle');
        }, 10);

        // Actualizar el contenido del detalle de impuestos
        impuestosDetalle.textContent = `Impuesto PAIS 30%\nImpuesto Ganancias 45%`;

        // Si el usuario selecciona "Dólar Qatar", mostrar un detalle adicional
        if (tipoCambioSeleccionado.nombre === "Dólar Qatar") {
            impuestosDetalle.textContent += "\nImpuesto Dólar Qatar 5%";
        }

        // Almacenar el tipo de cambio seleccionado en localStorage como JSON
        localStorage.setItem("tipoCambioSeleccionado", JSON.stringify(tipoCambioSeleccionado));

        // Mostrar el Toastify después de calcular impuestos
        Toastify({
            text: "Impuestos calculados con éxito",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "left",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            onClick: function() {
                // Callback después de hacer clic en el Toastify
            }
        }).showToast();
    } else {
        resultadoImpuesto.textContent = "";
        resultadoTotal.textContent = "Por favor, ingrese el precio de su producto y seleccione un tipo de cambio.";
        impuestosDetalle.textContent = "";
    }
}

// Obtener el tipo de cambio seleccionado y calcular el precio al cargar la página
function obtenerTipoCambioYCalcular(dolarOficial, dolarBlue) {
    const tipoCambioGuardado = localStorage.getItem("tipoCambioSeleccionado");

    if (tipoCambioGuardado) {
        const tipoCambioSeleccionado = JSON.parse(tipoCambioGuardado);
        calcularNuevoPrecio(tipoCambioSeleccionado, dolarOficial, dolarBlue);
    }
}

// Obtener la cotización del dólar desde la API de Bluelytics
function obtenerCotizacionDolar() {
    fetch("https://api.bluelytics.com.ar/v2/latest")
        .then(response => response.json())
        .then(data => {
            const dolarOficial = data.oficial.value; // Cotización del dólar oficial
            const dolarBlue = data.blue.value; // Cotización del dólar blue

            // Actualiza los elementos HTML con la cotización
            document.getElementById('dolarOficial').textContent = dolarOficial.toFixed(2);
            document.getElementById('dolarBlue').textContent = dolarBlue.toFixed(2);
        })
        .catch(error => {
            console.error('Error al obtener cotización del dólar:', error);
        });
}

// Llama a la función para obtener la cotización del dólar cuando la página se carga
window.addEventListener('load', obtenerCotizacionDolar);

const calcularBtn = document.getElementById("calcularBtn");
calcularBtn.addEventListener("click", function() {
    const tipoCambioSelect = document.getElementById("tipoCambioSelect");
    const selectedIndex = tipoCambioSelect.selectedIndex;

    if (selectedIndex >= 0) {
        const tipoCambioSeleccionado = tiposDeCambio[selectedIndex];
        calcularNuevoPrecio(tipoCambioSeleccionado, dolarOficial, dolarBlue);
    } else {
        alert("Por favor, seleccione un tipo de cambio.");
    }
});
