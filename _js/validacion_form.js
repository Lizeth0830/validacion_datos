// SISTEMA DE VALIDACIÓN AVANZADA

const formulario = document.getElementById('formularioAvanzado');
const campos = formulario.querySelectorAll('input, textarea, select');
const btnEnviar = document.getElementById('btnEnviar');

// Estado de validación de cada campo
let estadoValidacion = {};

// Inicializar estado de todos los campos
campos.forEach((campo) => {
  estadoValidacion[campo.name] = false;
});

// VALIDACIONES ESPECÍFICAS POR CAMPO

// Validación del nombre
document.getElementById('nombre').addEventListener('input', function () {
  const valor = this.value.trim();
  const nombres = valor.split(' ').filter((nombre) => nombre.length > 0);

  if (valor.length < 3) {
    mostrarError('errorNombre', 'El nombre debe tener al menos 3 caracteres');
    marcarCampo(this, false);
  } else if (nombres.length < 1) {
    mostrarError('errorNombre', 'Ingresa al menos 2 nombres');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoNombre', '✓ Nombre válido');
    marcarCampo(this, true);
  }
});

// Validación de apellidos
document.getElementById('apellidos').addEventListener('input', function () {
  const valor = this.value.trim();
  const partes = valor.split(' ').filter(p => p.length > 0);

  if (valor.length < 3) {
    mostrarError('errorApellidos', 'El apellido debe tener al menos 3 caracteres');
    marcarCampo(this, false);
  } else if (partes.length < 1) {
    mostrarError('errorApellidos', 'Ingresa al menos un apellido');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoApellidos', '✓ Apellido válido');
    marcarCampo(this, true);
  }
});

// Validación del email
document.getElementById('correo').addEventListener('input', function () {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(this.value)) {
    mostrarError('errorCorreo', 'Formato de email inválido');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoCorreo', '✓ Email válido');
    marcarCampo(this, true);
  }
});

// Validación de confirmación de correo
const confirmarCorreoInput = document.getElementById('confirmarCorreo');

confirmarCorreoInput.addEventListener('input', function () {
  const correo = document.getElementById('correo').value;

  if (this.value !== correo) {
    mostrarError('errorConfirmarCorreo', 'Los correos no coinciden');
    marcarCampo(this, false);
  } else if (this.value.length > 0) {
    mostrarExito('exitoConfirmarCorreo', '✓ Correos coinciden');
    marcarCampo(this, true);
  }
});

// Bloquear copiar, cortar y pegar en confirmarCorreo
confirmarCorreoInput.addEventListener('paste', function (e) {
  e.preventDefault();
  alert('No puedes pegar el correo aquí. Por favor escríbelo manualmente.');
});

confirmarCorreoInput.addEventListener('copy', function (e) {
  e.preventDefault();
  alert('No puedes copiar este campo.');
});

confirmarCorreoInput.addEventListener('cut', function (e) {
  e.preventDefault();
});

// Validación de contraseña con indicador de fortaleza
document.getElementById('password').addEventListener('input', function () {
  const password = this.value;
  const fortaleza = calcularFortalezaPassword(password);

  actualizarBarraFortaleza(fortaleza);

  if (password.length < 8) {
    mostrarError('errorPassword', 'La contraseña debe tener al menos 8 caracteres');
    marcarCampo(this, false);
  } else if (fortaleza.nivel < 2) {
    mostrarError('errorPassword', 'Contraseña muy débil. Añade números y símbolos');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoPassword', `✓ Contraseña ${fortaleza.texto}`);
    marcarCampo(this, true);
  }

  // Revalidar confirmación si existe
  const confirmar = document.getElementById('confirmarPassword');
  if (confirmar.value) {
    confirmar.dispatchEvent(new Event('input'));
  }
});

// Validación de confirmación de contraseña
document.getElementById('confirmarPassword').addEventListener('input', function () {
  const password = document.getElementById('password').value;

  if (this.value !== password) {
    mostrarError('errorConfirmar', 'Las contraseñas no coinciden');
    marcarCampo(this, false);
  } else if (this.value.length > 0) {
    mostrarExito('exitoConfirmar', '✓ Contraseñas coinciden');
    marcarCampo(this, true);
  }
});

// Contador de caracteres para comentarios
document.getElementById('comentarios').addEventListener('input', function () {
  const contador = document.getElementById('contadorComentarios');
  contador.textContent = this.value.length;

  if (this.value.length > 450) {
    contador.style.color = '#dc3545';
  } else if (this.value.length > 400) {
    contador.style.color = '#ffc107';
  } else {
    contador.style.color = '#666';
  }

  marcarCampo(this, true); // Los comentarios son opcionales
});

// Validación de términos
document.getElementById('terminos').addEventListener('change', function () {
  if (!this.checked) {
    mostrarError('errorTerminos', 'Debes aceptar los términos y condiciones');
    marcarCampo(this, false);
  } else {
    ocultarMensaje('errorTerminos');
    marcarCampo(this, true);
  }
});

// FUNCIONES AUXILIARES

function mostrarError(idElemento, mensaje) {
  const elemento = document.getElementById(idElemento);
  elemento.textContent = mensaje;
  elemento.style.display = 'block';
  ocultarMensaje(idElemento.replace('error', 'exito'));
}

function mostrarExito(idElemento, mensaje) {
  const elemento = document.getElementById(idElemento);
  elemento.textContent = mensaje;
  elemento.style.display = 'block';
  ocultarMensaje(idElemento.replace('exito', 'error'));
}

function ocultarMensaje(idElemento) {
  const elemento = document.getElementById(idElemento);
  if (elemento) elemento.style.display = 'none';
}

function marcarCampo(campo, esValido) {
  estadoValidacion[campo.name] = esValido;

  if (esValido) {
    campo.classList.remove('invalido');
    campo.classList.add('valido');
  } else {
    campo.classList.remove('valido');
    campo.classList.add('invalido');
  }

  actualizarProgreso();
  actualizarBotonEnvio();
}

function calcularFortalezaPassword(password) {
  let puntos = 0;

  if (password.length >= 8) puntos++;
  if (password.length >= 12) puntos++;
  if (/[a-z]/.test(password)) puntos++;
  if (/[A-Z]/.test(password)) puntos++;
  if (/[0-9]/.test(password)) puntos++;
  if (/[^A-Za-z0-9]/.test(password)) puntos++;

  const niveles = ['muy débil', 'débil', 'media', 'fuerte', 'muy fuerte'];
  const nivel = Math.min(Math.floor(puntos / 1.2), 4);

  return { nivel, texto: niveles[nivel], puntos };
}

function actualizarBarraFortaleza(fortaleza) {
  const barra = document.getElementById('strengthBar');
  const clases = ['strength-weak', 'strength-weak', 'strength-medium', 'strength-strong', 'strength-very-strong'];
  barra.className = 'password-strength ' + clases[fortaleza.nivel];
}

function actualizarProgreso() {
  const totalCampos = Object.keys(estadoValidacion).length;
  const camposValidos = Object.values(estadoValidacion).filter(valido => valido).length;
  const porcentaje = Math.round((camposValidos / totalCampos) * 100);

  document.getElementById('barraProgreso').style.width = porcentaje + '%';
  document.getElementById('porcentajeProgreso').textContent = porcentaje + '%';
}

function actualizarBotonEnvio() {
  const todosValidos = Object.values(estadoValidacion).every(valido => valido);
  btnEnviar.disabled = !todosValidos;
}

// MANEJO DEL ENVÍO DEL FORMULARIO
formulario.addEventListener('submit', function (e) {
  e.preventDefault();

  const datosFormulario = new FormData(this);
  let resumenHTML = '';

  for (let [campo, valor] of datosFormulario.entries()) {
    if (valor && valor.trim() !== '') {
      const nombreCampo = obtenerNombreCampo(campo);
      resumenHTML += `
        <div class="dato-resumen">
          <span class="etiqueta-resumen">${nombreCampo}:</span> ${valor}
        </div>`;
    }
  }

  document.getElementById('contenidoResumen').innerHTML = resumenHTML;
  document.getElementById('resumenDatos').style.display = 'block';

  document.getElementById('resumenDatos').scrollIntoView({ behavior: 'smooth' });

  console.log(' Formulario enviado con validación completa:', Object.fromEntries(datosFormulario));
});

function obtenerNombreCampo(campo) {
  const nombres = {
    nombre: 'Nombre',
    apellido: 'Apellido',
    correo: 'Correo electrónico',
    confirmarCorreo: 'Confirmación de correo',
    password: 'Contraseña',
    confirmarPassword: 'Confirmación de contraseña',
    comentarios: 'Comentarios',
    terminos: 'Términos aceptados',
  };
  return nombres[campo] || campo;
}

function reiniciarFormulario() {
  formulario.reset();
  document.getElementById('resumenDatos').style.display = 'none';

  Object.keys(estadoValidacion).forEach((campo) => {
    estadoValidacion[campo] = false;
  });

  campos.forEach((campo) => {
    campo.classList.remove('valido', 'invalido');
  });

  document.querySelectorAll('.mensaje-error, .mensaje-exito').forEach((mensaje) => {
    mensaje.style.display = 'none';
  });

  actualizarProgreso();
  actualizarBotonEnvio();

  document.getElementById('strengthBar').className = 'password-strength';
  

}