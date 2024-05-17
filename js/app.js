//1. Constructores

function Seguro(marca, year, tipo) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}

//Prototype para cotizar el seguro con los datos que selecciono el usuario
Seguro.prototype.cotizarSeguro = function () {
  let cantidad;
  const base = 2000;

  switch (this.marca) {
    case "1":
      cantidad = base * 1.15;
      break;
    case "2":
      cantidad = base * 1.05;
      break;
    case "3":
      cantidad = base * 1.35;
      break;

    default:
      break;
  }

  //leer el year
  const diferencia = new Date().getFullYear() - this.year;

  //cada year mas viejo se reduce un 3% el valor del seguro
  cantidad = cantidad - (diferencia * 3 * cantidad) / 100;

  /*
        Si el seguro es Basico se multiplica por 30% mas
        Si el seguro es Completo se multiplica por un 50% mas
    */

  if (this.tipo === "basico") {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }

  return cantidad;
};

function UI() {}

//Prototipe para llenar los year
UI.prototype.llenarOpciones = () => {
  const max = new Date().getFullYear(),
    min = max - 20;

  const selectYear = document.querySelector("#year");

  for (let i = max; i > min; i--) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    selectYear.appendChild(option);
  }
};

//Prototype para mostrar alertas en pantalla
UI.prototype.mostrarAlertas = (mensaje, tipo) => {
  const div = document.createElement("div");
  if (tipo === "error") {
    div.classList.add("mensaje", "error");
  } else {
    div.classList.add("mensaje", "correcto");
  }

  div.classList.add("mensaje", "mt-10");
  div.textContent = mensaje;

  const formulario = document.querySelector("#cotizar-seguro");
  formulario.insertBefore(div, document.querySelector("#resultado"));

  setTimeout(() => {
    div.remove();
  }, 3000);
};

UI.prototype.mostrarTotal = (seguro, total) => {
  const { marca, year, tipo } = seguro;

  let textoMarca;

  // Asignamos la marca por el numero
  switch (marca) {
    case "1":
      textoMarca = "Americano";
      break;
    case "2":
      textoMarca = "Asiatico";
      break;
    case "3":
      textoMarca = "Europeo";
      break;
    default:
      break;
  }

  //crear el resultado
  const div = document.createElement("div");
  div.classList.add("mt-10");

  div.innerHTML = `
    <p class="header">Tu resumen</p>
    <p class="font-bold">Marca: <span class="font-normal"> ${textoMarca}</span></p>
    <p class="font-bold">Año: <span class="font-normal"> ${year}</span></p>
    <p class="font-bold">Tipo de seguro: <span class="font-normal capitalize"> ${tipo}</span></p>
    <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p> 
    `;

  const resultadoDiv = document.querySelector("#resultado");

  //mostrar spinner
  const spinner = document.querySelector("#cargando");
  spinner.style.display = "block";

  setTimeout(() => {
    spinner.style.display = "none"; // se borra el spinner y luego se agrega el resultado
    resultadoDiv.appendChild(div);
  }, 3000);
};

//Instanciamos el UI
const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
  ui.llenarOpciones(); // aca llena el select con los year
});

eventListener();
function eventListener() {
  const formulario = document.querySelector("#cotizar-seguro");
  formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
  e.preventDefault();

  //leer la marca seleccionada
  const marca = document.querySelector("#marca").value;

  //leer el year seleccionado
  const year = document.querySelector("#year").value;

  //leer el tipo de seguro
  const tipo = document.querySelector("input[name=tipo]:checked").value; //forma para leer el valor de un elemento tipo radio

  if (marca === "" || year === "" || tipo === "") {
    ui.mostrarAlertas("Todos los campos son obligatorios", "error");
    return;
  }

  ui.mostrarAlertas("Cotizando...", "exito");

  //Ocultar los resultados Anteriores
  const resultados = document.querySelector("#resultado div");

  if (resultados != null) {
    resultados.remove();
  }

  //Instanciar el seguro
  const seguro = new Seguro(marca, year, tipo);
  const total = seguro.cotizarSeguro();

  //Utilizar el prototype que va a cotizar el seguro
  ui.mostrarTotal(seguro, total);
}
