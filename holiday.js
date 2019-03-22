// Creazione della funzione che mi restituisce il nome del mese nel formato desiderato;
function getMonthName(month){

  var mom = moment();
  mom.month(month);

  var monthName = mom.format("MMMM")

  return monthName;
}


// Creazione della f che mi permette di contare quanti giorni hai mese in questione
function getMonthDayCount(year, month){

  var mom = moment();
  mom.month(month);
  mom.year(year);

  var dayCount = mom.daysInMonth(month);
  return dayCount;
}


// Funzione che mi crea la data completa da scrivere poi nella printDays
function getHumanDate(year, month, day){

  var mom = moment();
  mom.year(year);
  mom.month(month);
  mom.date(day);

  var date = mom.format ("dddd DD");

  return date;
}


// Funzione che associa tramite i dati dell API l'attributo del template
function getMachineDate(year, month, day){

  var mom = moment();
  mom.year(year);
  mom.month(month);
  mom.date(day);

  var date = mom.format("YYYY-MM-DD");

  return date;
}


// Creazione della funzione che mi permette di stampare nel documento il titolo contenente il mese
function printTitle(year, month){

  var titleMonthName = $("#month-name");
  var monthName = getMonthName(month);
  var dayCount = getMonthDayCount(year,month);

  titleMonthName.text(monthName + ": 1-" + dayCount);
}


// Funzione che mi permette di stampare nel documento la mia data presa da getHumanDate
function printDays(year,month){

  var dayCount = getMonthDayCount(year, month);

  var ulDayList = $("#day-list");

  var template = $("#day-template").html();
  var compiled = Handlebars.compile(template);

  for ( var day = 1; day <= dayCount; day++){

    var tempData = {

      machineDate: getMachineDate(year, month, day),
      date : getHumanDate(year, month, day),
    }

  var liDay = compiled(tempData);
  ulDayList.append(liDay);
  }
}



// Funzione che grazie al collegamento all'API restituisce e stampa i gioni di vacanza aggiungendo la classe colorata che li identifica
function printHolidays(year, month){

  var outData ={

    year: year,
    month:month,
  }

  $.ajax({

    url:"https://flynn.boolean.careers/exercises/api/holidays",
    data: outData,
    method: "GET",
    success: function(inData,state){

      if (inData.success == true){

        var holidays = inData.response;
        addHolidaysHighlight(holidays);

      }else{

        console.log("C'è stato un errore: riprovare.")
      }
    },
    error: function(request, state, error){

      console.log("request",request);
      console.log("state",state);
      console.log("error",error);
    },
  });
}


// Funzione che  serve a colorare la classa della festività:
function addHolidaysHighlight(holidays){

  for ( var i = 0; i < holidays.length; i++){

    var holiday = holidays[i];

    var holidayMachineDate = holiday.date;
    var holidayName = holiday.name;

    var selector = "li[data-date='" + holidayMachineDate + "']";
    var liHoliday = $(selector);

    liHoliday.text(liHoliday.text() + "  " + holidayName);
    liHoliday.addClass("holiday");

  }
}


// Funzione che mi permette di aggiornare in base al click il mese che voglio andando a dx o sx
function updateCalendar(){

  var h1Empty = $("#month-name");
  h1Empty.text("");

  var dayEmpty = $("li");
  dayEmpty.remove();




}


// Creo le due funzioni per il cambio mese a dx e a sx: le associo poi nella init con i bottoni
function changeMonthDx(year, month){

  month++;
  updateCalendar();
  printTitle(year,month);
  printDays(year,month);
  printHolidays(year, month);
  return month;
}

function changeMonthSx(year, month){

  month--;
  updateCalendar();
  printTitle(year,month);
  printDays(year,month);
  printHolidays(year, month);
  return month;
}



// Funzione finale di richiamo alle altre funzioni senxa cui non funzionerebbe
function init (){

  var year = 2018;
  var month = 0;

  printTitle(year,month);
  printDays(year,month);
  printHolidays(year, month);

  var btnDx = $("#next");
  btnDx.click(function(){

    if(month < 11){

      month = changeMonthDx(year, month);
    }else{

      alert("Siamo spiacenti. Il calendario è disponibile solo per l'anno 2018.")
    }
  });

  var btnSx = $("#prev");
  btnSx.click(function(){

    if(month > 0){

      month = changeMonthSx(year, month);
    }else{

      alert("Siamo spiacenti. Il calendario è disponibile solo per l'anno 2018.")
    }
  });

}


$(document).ready(init);
