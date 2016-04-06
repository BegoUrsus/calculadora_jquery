
var acc_valor = 0, acc_op = "", mem_valor = 0;

function resetea_acumulado() {
    $("#acumulado").html("");
    $("#operacion").html("");
    acc_valor = 0;
    acc_op = "";
}

function muestra_memoria() {
  if (mem_valor == 0) {
    $("#memoria_simbolo").html("");
    $("#memoria_valor").html("");
  } else {
    $("#memoria_simbolo").html("M");
    $("#memoria_valor").html(mem_valor);
  }
}

function muestra_buenos() {
  var fecha = new Date();
  var msj;

  if      (fecha.getHours() < 7)  { msj = "Buenas noches";}
  else if (fecha.getHours() < 12) { msj = "Buenos días";}
  else if (fecha.getHours() < 21) { msj = "Buenas tardes";}
  else                            { msj = "Buenas noches";}

  $("#buenos").html(msj);
 }

 function error(titulo, mensaje) {
    // Esta función es de la librería jAlert que muestra
    // mensajes de alerta con más estilo que los que genera
    // Más información en: http://flwebsites.biz/jAlert/
    $.jAlert({
      'title': titulo,
      'content': mensaje,
      'theme': 'default',
      'showAnimation': 'false',
      'hideAnimation': 'false',
      'btns': { 'text': 'Aceptar' }
    });
 }

 /*Comprueba que el valor pasado como parámetro, sea un valor
 numérico, un campo vacío o el valor infinito tanto positivo como
 negativo*/
 function comprueba_numero(valor) {
  if (valor ==="" || valor === "Infinity" || valor === "-Infinity") {
    // Si está vacío no lo damos como error, ya que 
    // se convertirá a cero
    // Si es infinito tampoco lo damos como error, ya que
    // se puede operar con números infinitos
    return true;
  } else if (!$.isNumeric(valor)) {
    // Si es un valor NO numérico, SI que es un error
    error(
      '¡Error en datos!',
      '"' + valor + '" no es un número correcto');
    return false;
  } 
  return true;
 }

/** Calcula el factorial de n.*/
var f = [];
function factorial (n) {
  if (n == 0 || n == 1)
    return 1;
  if (f[n] > 0)
    return f[n];
  return f[n] = factorial(n-1) * n;
}

$(function() {

  muestra_buenos();
  muestra_memoria();
  

  /*Si se pulsa una tecla numérica, añadimos al LCD 
  el valor correspondiente a dicha tecla*/
  $(".numero").on("click", 
    function(){
      var lcd = $("#lcd");
      var valor_tecla = $(this).text();
      lcd.val(lcd.val() + valor_tecla);
    });

  /*Si pulsamos la tecla de borrar(C), vaciamos el
  contenido del input LCD y los acumuladores.
  Pero mantenemos el contenido de la memoria*/
   $(".borrar").on("click", 
    function(){ 
      var operacion = $(this).attr('id');
      if (operacion === "borrar") {
        $("#lcd").val("");
        resetea_acumulado();
        mem_valor = 0;
        muestra_memoria();
      } else if (operacion === "borrar_parcial") {
        $("#lcd").val("");
      }
   });

   /* Muestra los datos del acumulador */
   function muestra_acumulado(valor, operador) {
        $("#acumulado").html(valor);
        if (operador === "b_suma")
          $("#operacion").html("+");
        else if (operador === "b_resta")
          $("#operacion").html("-");
        else if (operador === "b_multiplica")
          $("#operacion").html("*");
        else if (operador === "b_divide")
          $("#operacion").html("&divide;");
        else if (operador === "b_eleva")
          $("#operacion").html("^");
   }


  /*Si pulsamos la tecla de un operador binario, 
  primero miramos si había alguna operación pendiente en el
  acumulador y la realizamos. 
  A continuación, actualizamos los acumuladores
  con el nuevo valor del display y el id de la tecla de operación, 
  y mostramos dichos valores en la parte superior. 
  Por último borramos el contenido del lcd*/
  $(".op_binario").on("click", 
    function() {
      var lcd = $("#lcd");
      // almacenamos temporalmente los acumuladores existentes
      var temp_acc_valor = acc_valor;
      var temp_acc_op = acc_op;

      // cogemos los nuevos datos
      var new_valor = lcd.val();
      var new_op = $(this).attr('id');

      // Primero comprobamos que el valor del LCD sea un número correcto.
      // De lo contrario abandonamos la operación

      if (!comprueba_numero(new_valor)) 
        return;
      
      // Si había alguna operación almacenada en el acumulador,
      // procesamos dicha operación, actualizamos el acumulador
      // con dicho resultado y el operador actual, y reseteamos el
      // lcd;

      if (temp_acc_op !== "") {
        // Si había alguna operación almacenada en el acumulador,
        // procesamos dicha operación, actualizamos el acumulador
        // con dicho resultado y el operador actual, y reseteamos el
        // lcd;

        var resultado = calculo_binario(+new_valor, temp_acc_valor, temp_acc_op);
        acc_valor = resultado;
        acc_op = new_op;
      } else {
        // Si no había ninguna operación pendiente, realizamos
        // actualizamos el acumulador con el valor del lcd y la operacion
        // actual

        acc_valor = +new_valor;
        acc_op = new_op;

      }
      // Mostramos el nuevo acumulador y reseteamos el display
      muestra_acumulado(acc_valor, acc_op);
      lcd.val("");

      
    });

  /* Devuelve el resultador de la operación binaria realizada
  con los 2 valores y el operador pasados como parámetros */
  function calculo_binario(dato_nuevo, dato_antiguo, operador) {
        if (operador === "b_suma") {
          return (+dato_antiguo + dato_nuevo)
        } else if (operador === "b_resta") {
          return (+dato_antiguo - dato_nuevo)
        } else if (operador === "b_multiplica") {
          return (+dato_antiguo * dato_nuevo)
        } else if (operador === "b_divide") {
          return (+dato_antiguo / dato_nuevo)
        } else if (operador == "b_eleva") {
          return (Math.pow(+dato_antiguo, dato_nuevo));
        } else {
          // Si no es ninguno de los operadores
          // simplemente devolvemos el dato_nuevo, para que no cambie
          // el valor del LCD
          return dato_nuevo;
        }
  }

  /*Si pulsamos una tecla de calcular, realizamos la función de cálculo binario,
  pasándole como parámetros el valor del lcd y el valor y operador almacenados en 
  el acumulador.
  A continuación, reseteamos los acumuladores*/
  $(".calcular").on("click", 
    function() {
      var lcd = $("#lcd");
      if (comprueba_numero(lcd.val())) {
        var resultado = calculo_binario(+lcd.val(), +acc_valor, acc_op);
        lcd.val(resultado);
        resetea_acumulado();
      }
    });

  /*Si pulsamos la tecla de un operador unitario, realizamos la función que 
  le corresponda y borramos el acumulado*/

  $(".op_unitario").on("click", 
    function() {
      var lcd = $("#lcd");
      var operacion = $(this).attr('id');
      
      if (comprueba_numero(lcd.val())) {
        // Elevar el número al cuadrado      
        if (operacion === "b_cuadrado") {
          lcd.val(+lcd.val() * +lcd.val());
        }

        // Invertir el número
        if (operacion === "b_invertido") {
          lcd.val(1 / +lcd.val());
        }

        // Raíz cuadrada del número
        if (operacion === "b_raiz") {
          lcd.val(Math.sqrt(+lcd.val()));
        }

        // Entero del número
        if (operacion === "b_entero") {
          if (lcd.val() > 0)
            lcd.val(Math.floor(+lcd.val()));
          else
            lcd.val(Math.ceil(+lcd.val()));
        }

        // Cambiar signo
        if (operacion === "b_signo") {
          lcd.val(-lcd.val());
        }

        // Potencia de 2
        if (operacion === "b_potencia2") {
          lcd.val(Math.pow(2, +lcd.val()));
        }

        // Factorial
        if (operacion === "b_factorial") {
          // Para calcular el factorial debemos comprobar que es un número entero positivo
          if (+lcd.val()<0) {
            error(
              "¡Error!",
              "El número ha de ser mayor o igual que cero para calcular el factorial");
          } else if (+lcd.val() % 1 !== 0) { 
            error(
              "¡Error!",
              "El número ha de ser entero para calcular el factorial");
          } else if (+lcd.val() > 170) { 
            error(
              "¡Error!",
              "Número fuera de límites para calcular el factorial. Máximo valor admitido: 170");
          } else {
            lcd.val(factorial(+lcd.val()));
          }
        }
      }
    });

  /** Procesamos que se ha pulsado una de las teclas de
  operación con la memoria */
  $(".op_memoria").on("click", 
    function() {
      var lcd = $("#lcd");
      var operacion = $(this).attr('id');

      if (operacion === "b_mc") {
        // borramos la memoria
        mem_valor = 0;
      }

      if (operacion === "b_mr") {
        // recuperamos el contenido de la memoria y 
        // se lo asignamos a lcd
        lcd.val(+mem_valor);
      }

      if (operacion === "b_ms") {
        // almacena el contenido de lcd en memoria
        if (comprueba_numero(lcd.val()))
          mem_valor = +lcd.val();
      }

      if (operacion === "b_mmas") {
        // suma el contenido del lcd a la memoria
        if (comprueba_numero(lcd.val()))
          mem_valor = mem_valor + +lcd.val();
      }

      if (operacion === "b_mmenos") {
        // resta el contenido del lcd de la memoria
        if (comprueba_numero(lcd.val()))
          mem_valor = mem_valor - +lcd.val();
      }

      // mostramos el contenido de la memoria
      muestra_memoria();


    });

  /** Si pulsa el boton de sumar o multiplicar cadenas,
  primero dividimos el contenido del lcd en un array
  y luego lo procesamos según el botón seleccionado */
  $(".op_varios").on("click", 
    function() {
      var texto = $("#lcd").val();
      var operacion = $(this).attr('id');

      var array = texto.split(",");
      var total = 0;

      // comprobamos que todos los elementos del array
      // sean númericos
      var error = false;

      $.each(array, function() {
        if (!comprueba_numero(this)) {
          error = true;
          return false;
        }
      });

      if (error) return false;

      // calculamos el total según la operación a procesar
      if (operacion === "b_sumatorio") {
        $.each(array, function(){
          total+=parseFloat(this) || 0;
        });
      }
      if (operacion === "b_producto") {
        total = 1;
        $.each(array, function(){
          total*=parseFloat(this) || 0;
        });
      }

      // mostramos el resultado en el lcd y reseteamos
      // los acumulados en caso de que hubieran
      $("#lcd").val(total);
      resetea_acumulado();

    });

});


