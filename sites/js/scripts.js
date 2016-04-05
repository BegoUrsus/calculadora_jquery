
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

 function comprueba_numero(valor) {

  if (!$.isNumeric(valor)) {
    $.jAlert({
      'title': '¡Error en datos!',
      'content': '"' + valor + '" no es un número correcto',
      'theme': 'default',
      'showAnimation': 'false',
      'hideAnimation': 'false',
      'btns': { 'text': 'Aceptar' }
    });
    return false;
  } else  {
    return true;
  }
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
      $("#lcd").val("");
      resetea_acumulado();
   });


  /*Si pulsamos la tecla de un operador binario, almacenamos el valor
  del display y el id de la tecla de operación, y mostramos dichos valores
  en la parte superior. También borramos el contenido del lcd*/
  $(".op_binario").on("click", 
    function() {
      var lcd = $("#lcd");
      var operacion = $(this).attr('id');
      if (comprueba_numero(lcd.val())) {
        acc_valor = +lcd.val();
        acc_op = operacion;
        $("#acumulado").html(acc_valor);
        if (acc_op === "b_suma")
          $("#operacion").html("+");
        if (acc_op === "b_resta")
          $("#operacion").html("-");
        if (acc_op === "b_multiplica")
          $("#operacion").html("*");
        if (acc_op === "b_divide")
          $("#operacion").html("/");
        if (acc_op === "b_eleva")
          $("#operacion").html("^");
        lcd.val("");
      }
    });

  /*Si pulsamos una tecla de calcular, realizamos la función que le corresponda
  según el operador y el valor acumulado que habíamos almacenado con las
  teclas de operación binarias. Resteamos lo acumulado*/
  $(".calcular").on("click", 
    function() {
      var lcd = $("#lcd");
      if (comprueba_numero(lcd.val())) {
        if (acc_op === "b_suma") {
          lcd.val(+acc_valor + +lcd.val())
        }

        if (acc_op === "b_resta") {
          lcd.val(+acc_valor - +lcd.val())
        }

        if (acc_op === "b_multiplica") {
          lcd.val(+acc_valor * +lcd.val())
        }

        if (acc_op === "b_divide") {
          lcd.val(+acc_valor / +lcd.val())
        }

        if (acc_op == "b_eleva") {
          lcd.val(Math.pow(+acc_valor, +lcd.val()));
        }
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


