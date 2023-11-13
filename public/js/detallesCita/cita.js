const estadoCitaElemento = document.getElementById('estado-cita');
const cancelarCitaForm = document.getElementById('cancelar-cita-form');
const formularioCambiarEstado = document.getElementById('cambiar-estado-form');
const seleccionadorEstado = document.getElementById('seleccionador-estado');

formularioCambiarEstado.addEventListener('submit', async (e) => {
  e.preventDefault();
  const idNuevoEstado = Number(seleccionadorEstado.value);
  console.log(idNuevoEstado);
  const url = formularioCambiarEstado.getAttribute('action');

  const { error, mensaje } = await cambiarEstadoCita(url, idNuevoEstado);
  if (error) {
    alert(error);
  } else {
    alert(mensaje);
    estadoCitaElemento.textContent =
      seleccionadorEstado.options[seleccionadorEstado.selectedIndex].text;
    // quitar el formulario de cambio de estado y cancelar cita cuando se haya cambiado el estado a terminada
    if (idNuevoEstado === 3) {
      formularioCambiarEstado.remove();
      cancelarCitaForm.remove();
    }
  }
});

async function cambiarEstadoCita(url, idNuevoEstado) {
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nuevo_estado_cita: idNuevoEstado }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log('error:', error);
  }
}

cancelarCitaForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const confirmacion = confirm('¿Cancelar cita?');
  if (!confirmacion) return;
  const url = cancelarCitaForm.getAttribute('action');
  const { error, mensaje } = await cancelarCita(url);

  if (error) {
    alert(error);
  } else {
    alert(mensaje);
    estadoCitaElemento.textContent = 'Cancelada';
    cancelarCitaForm.remove();
  }
});

async function cancelarCita(url) {
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      mode: 'cors',
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log('error:', error);
  }
}
