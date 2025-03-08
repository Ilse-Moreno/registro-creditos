document.addEventListener("DOMContentLoaded", () => {
    loadCreditos();
    document.getElementById("credito-form").addEventListener("submit", addCredito);
});

// Cargar créditos en la tabla y preparar el gráfico
function loadCreditos() {
    fetch("/api/creditos")
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById("creditos-table");
            table.innerHTML = "";
            let totalCreditos = 0;
            let montoDistribucion = {};

            // Rellenar la tabla con los datos de créditos
            data.forEach(credito => {
                table.innerHTML += `
                    <tr>
                        <td>${credito.id}</td>
                        <td>${credito.cliente}</td>
                        <td>${credito.monto}</td>
                        <td>${credito.tasa_interes}</td>
                        <td>${credito.plazo}</td>
                        <td>${credito.fecha_otorgamiento}</td>
                        <td>
                            <button onclick="editCredito(${credito.id})">✏️ Editar</button>
                            <button onclick="deleteCredito(${credito.id})">🗑️ Eliminar</button>
                        </td>
                    </tr>`;

                // Sumar el total de créditos
                totalCreditos += credito.monto;

                // Distribuir los créditos por cliente
                if (montoDistribucion[credito.cliente]) {
                    montoDistribucion[credito.cliente] += credito.monto;
                } else {
                    montoDistribucion[credito.cliente] = credito.monto;
                }
            });

            // Crear o actualizar el gráfico
            createChart(montoDistribucion);
        })
        .catch(error => console.error("Error cargando los créditos:", error));
}

// Crear o actualizar el gráfico de distribución de créditos por cliente
function createChart(distribucion) {
    const ctx = document.getElementById('creditos-chart').getContext('2d');

    // Si ya existe un gráfico, destrúyelo antes de crear uno nuevo
    if (window.creditosChart) {
        window.creditosChart.destroy();
    }

    const labels = Object.keys(distribucion);
    const data = Object.values(distribucion);

    // Generar un color aleatorio único para cada cliente
    const colors = labels.map(() => {
        return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
    });

    // Crear el gráfico
    window.creditosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Créditos por Cliente',
                data: data,
                backgroundColor: colors,  // Colores aleatorios para cada barra
                borderColor: colors.map(color => color.replace('0.6', '1')),  // Colores más fuertes para los bordes
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Agregar un nuevo crédito
function addCredito(event) {
    event.preventDefault(); // Evitar que el formulario se recargue

    const cliente = document.getElementById("cliente").value;
    const monto = parseFloat(document.getElementById("monto").value);
    const tasa_interes = parseFloat(document.getElementById("tasa_interes").value);
    const plazo = parseInt(document.getElementById("plazo").value);
    const fecha_otorgamiento = document.getElementById("fecha_otorgamiento").value;

    const newCredito = {
        cliente: cliente,
        monto: monto,
        tasa_interes: tasa_interes,
        plazo: plazo,
        fecha_otorgamiento: fecha_otorgamiento
    };

    fetch("/api/creditos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newCredito)
    })
    .then(response => response.json())
    .then(() => {
        // Limpiar el formulario
        document.getElementById("credito-form").reset();
        // Recargar los créditos y la gráfica
        loadCreditos();
    })
    .catch(error => console.error("Error al agregar crédito:", error));
}

// Editar un crédito
function editCredito(id) {
    fetch(`/api/creditos`)
        .then(response => response.json())
        .then(data => {
            const credito = data.find(c => c.id === id);
            if (credito) {
                document.getElementById("edit-id").value = credito.id;
                document.getElementById("edit-cliente").value = credito.cliente;
                document.getElementById("edit-monto").value = credito.monto;
                document.getElementById("edit-tasa").value = credito.tasa_interes;
                document.getElementById("edit-plazo").value = credito.plazo;
                document.getElementById("edit-fecha").value = credito.fecha_otorgamiento;
                document.getElementById("edit-form").style.display = "block";
            }
        });
}

// Guardar cambios en un crédito editado
function updateCredito() {
    const id = document.getElementById("edit-id").value;
    const cliente = document.getElementById("edit-cliente").value;
    const monto = document.getElementById("edit-monto").value;
    const tasa = document.getElementById("edit-tasa").value;
    const plazo = document.getElementById("edit-plazo").value;
    const fecha = document.getElementById("edit-fecha").value;

    fetch(`/api/creditos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente, monto, tasa_interes: tasa, plazo, fecha_otorgamiento: fecha })
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById("edit-form").style.display = "none";
        loadCreditos();  // Recargar la tabla y el gráfico
    })
    .catch(error => console.error("Error al actualizar el crédito:", error));
}

// Eliminar un crédito
function deleteCredito(id) {
    if (confirm("¿Estás seguro de eliminar este crédito?")) {
        fetch(`/api/creditos/${id}`, { method: "DELETE" })
            .then(response => response.json())
            .then(() => loadCreditos());  // Recargar la tabla y el gráfico
    }
}

// Cancelar edición
function cancelEdit() {
    document.getElementById("edit-form").style.display = "none";
}
