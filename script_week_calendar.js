//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------

function Calendar(input, options) {
    this.now = new Date();
    //this.now = new Date(2015, 1, 1); //do zasymulowanie jakiegos dnia
    this.day = this.now.getDate();
    this.week = null;
    this.month = this.now.getMonth();
    this.year = this.now.getFullYear();
    this.input = input;
    this.divCnt = null;
    this.divTable = null;
    this.divDateText = null;
    this.divButtons = null;
    this.input.value = "Kiedy złapana?"

    const defaultOptions = {
        closeOnSelect : false,
        onDateSelect : function(day, month, year) {
            const monthText = ((month + 1) < 10) ? "0" + (month + 1) : month + 1;
            const dayText =  (day < 10) ? "0" + day : day;
            this.input.value = "blabla" + dayText + '-' + monthText + '-' + this.year;
        }.bind(this)
    }
    this.options = Object.assign({}, defaultOptions, options);

    //console.dir(this.now);

   //metoda do oblicznia, który mamy tydzień
    //function week_no(dt) 
    function week_no(dt) 
    {
        var tdt = new Date(dt.valueOf());
        var dayn = (dt.getDay() + 6) % 7;
        tdt.setDate(tdt.getDate() - dayn + 3);
        var firstThursday = tdt.valueOf();
        tdt.setMonth(0, 1);
        if (tdt.getDay() !== 4) 
        {
            tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - tdt) / 604800000);
    }

    //metoda tworząca przyciski prev-next
    this.createButtons = function () {
        const buttonPrev = document.createElement('button');
        buttonPrev.innerText = '<';
        buttonPrev.type = "button";
        buttonPrev.classList.add('input-prev');
        buttonPrev.addEventListener('click', function () {
            this.month--;
            if (this.month < 0) {
                this.month = 11;
                this.year--;
            }
            this.createCalendarTable();
            this.createDateText();
        }.bind(this));
        this.divButtons.appendChild(buttonPrev);

        const buttonNext = document.createElement('button');
        buttonNext.classList.add('input-next');
        buttonNext.innerText = '>';
        buttonNext.type = "button";
        buttonNext.addEventListener('click', function () {
            this.month++;
            if (this.month > 11) {
                this.month = 0;
                this.year++;
            }
            this.createCalendarTable();
            this.createDateText();
        }.bind(this));
        this.divButtons.appendChild(buttonNext);
    };

    //metoda wypisująca nazwę miesiąca i roku
    this.createDateText = function () {
        const monthNames = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];
        this.divDateText.innerHTML = monthNames[this.month] + ' ' + this.year;
    };

    //metoda tworząca tabele z kalendarzem
    this.createCalendarTable = function () {
        this.divTable.innerHTML = '';

        //tworzymy nazwy dni
        const tab = document.createElement('table');
        tab.classList.add('calendar-table');

        //tworzymy nagłówki dni
        let tr = document.createElement('tr');
        tr.classList.add('calendar-table-days-names')
        const days = ['Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob', 'Nie'];
        for (let i=0; i<days.length; i++) {
            const th = document.createElement('th');
            th.innerHTML = days[i];
            tr.appendChild(th);
        }
        tab.appendChild(tr);

        //pobieramy wszystkie dni danego miesiąca
        const daysInMonth = new Date(this.year, this.month+1, 0).getDate();

        //pobieramy pierwszy dzień miesiąca
        const tempDate = new Date(this.year, this.month, 1);
        let firstMonthDay = tempDate.getDay();
        if (firstMonthDay === 0) {
            firstMonthDay = 7;
        }

        //wszystkie komórki w tabeli
        const j = daysInMonth + firstMonthDay - 1;

        if (firstMonthDay - 1 !== 0) {
            tr = document.createElement('tr');
            tab.appendChild(tr);
        }

        //tworzymy puste komórki przed dniami miesiąca
        for (let i=0; i < firstMonthDay - 1; i++) {
            const td = document.createElement('td');
            td.innerHTML = '';
            tr.appendChild(td);
        }

        //tworzymy komórki dni
        for (let i = firstMonthDay-1; i<j; i++) {
            if(i % 7 === 0){
                tr = document.createElement('tr');
                tab.appendChild(tr);
            }

            const td = document.createElement('td');
            td.innerText = i - firstMonthDay + 2;
            td.dayNr = i - firstMonthDay + 2;
            td.classList.add('day');
//debugger;
            if (this.year === this.now.getFullYear() && this.month === this.now.getMonth() && this.day === i - firstMonthDay + 2) {
                td.classList.add('current-day')
                //td.classList.add('actual-day')
                
            }

            tr.appendChild(td);
        }

        tab.appendChild(tr);

        this.divTable.appendChild(tab);
    };

    //podpinamy klik pod dni w tabeli kalendarza
    this.bindTableDaysEvent = function() {
        this.divTable.addEventListener('click', function(e) {
            if (e.target.tagName.toLowerCase() === 'td' && e.target.classList.contains('day')) {
                const month2 = ((this.month + 1) < 10) ? "0" + (this.month + 1) : this.month + 1;
                
                //debugger;
                //e.target.classList.add('current-day');
                //console.log(this.week);
                //console.dir(this.divTable);
                //console.dir(this.divTable.innerHTML);


                let nowaData = new Date(this.year, this.month, e.target.dayNr); //do zasymulowanie jakeigos dnia    
                //this.now = Date(this.year, this.month, e.target.dayNr);
                this.week = week_no(nowaData);

                //let tydzien = new Date(year, month-1, day);
                //let week = week_no(tydzien);
                //console.log(this.week);


                //this.week = week_no(this.now);
                //console.dir(this.week);


                if (this.options.closeOnSelect) {
                    this.hide();
                }
                this.options.onDateSelect(e.target.dayNr, this.month + 1, this.year);
            }
        }.bind(this));
    }

    //metoda ukrywa/pokazuje kalendarz
    this.toggleShow = function() {
        this.divCnt.classList.toggle('calendar-show');
    }

    //metoda pokazuje kalendarz
    this.show = function() {
        this.divCnt.classList.add('calendar-show');
    }

    //metoda ukrywa kalendarz
    this.hide = function() {
        this.divCnt.classList.remove('calendar-show');
    }

    //metoda inicjująca obiekt
    this.init = function () {
        //tworzymy div z całą zawartością
        this.divCnt = document.createElement('div');
        this.divCnt.classList.add('calendar');

        //tworzymy div z guzikami
        this.divButtons = document.createElement('div');
        this.divButtons.className = "calendar-prev-next";
        this.createButtons();

        //tworzymy div z nazwą miesiąca
        this.divDateText = document.createElement('div');
        this.divDateText.className = 'date-name';
        this.createDateText();

        //tworzymy nagłówek kalendarza
        this.divHeader = document.createElement('div');
        this.divHeader.classList.add('calendar-header');

        this.divHeader.appendChild(this.divButtons);
        this.divHeader.appendChild(this.divDateText);
        this.divCnt.appendChild(this.divHeader);

        //tworzymy div z tabelą kalendarza
        this.divTable = document.createElement('div');
        this.divTable.className = 'calendar-table-cnt';
        this.divCnt.appendChild(this.divTable);
        this.createCalendarTable();
        this.bindTableDaysEvent();

        //tworzymy wrapper dla input
        this.calendarWrapper = document.createElement('div');
        this.calendarWrapper.classList.add('input-calendar-cnt');
        this.input.parentElement.insertBefore(this.calendarWrapper, this.input);
        this.calendarWrapper.appendChild(this.input);
        this.calendarWrapper.appendChild(this.divCnt);

        this.input.classList.add('input-calendar');

        //podpinamy zdarzenia do pokazywania/ukrywania kalendarza
        this.input.addEventListener('click', function() {
            this.toggleShow();
        }.bind(this));

        this.divCnt.addEventListener('click', function(e) {
            e.stopImmediatePropagation();
            //tutaj przydalo by sie przekazac: Przelicz 
        });
        this.input.addEventListener('click', function(e) {
            e.stopImmediatePropagation();
        });
        document.addEventListener('click', function() {
            this.hide();
        }.bind(this));
    };
};



//metoda do obliczania, który mamy tydzień
function week_no(dt)  {
    var tdt = new Date(dt.valueOf());
    var dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    var firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) 
    {
        tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}


const input = document.querySelector('.input-demo');
const terminRojki = new Calendar(input, {
    closeOnSelect : false,
    onDateSelect : function(day, month, year) {
        
        //console.log(day);
        //console.log(month);
        //console.log(year);

        let tydzien = new Date(year, month-1, day);
        let week = week_no(tydzien);
        //console.log(week);
        let tydzienMiesiaca = 1;
        if(day>8 && day<=15) tydzienMiesiaca = 2;
        if(day>15 && day<=22) tydzienMiesiaca = 3;
        if(day>22 ) tydzienMiesiaca = 4;

        function przyrostek(cyfra) {
            let koncowka = cyfra%10;
            switch (koncowka)
            {
                case 1 : return '-wszy';  break;
                case 2 : return '-gi';    break;
                case 3 : return '-ci';    break;
                case 7 : return '-my';    break;
                case 8 : return '-my';    break;
                default: return '-ty';    break;
            }
        }

        //const monthsNames = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];
        //input.value = `Złapana: ${week}${przyrostek(week)} tydzień ${year} (${monthsNames[month-1]})  `;
        
        const monthsNames = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwica', 'lipica', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
        input.value = `Złapana: ${tydzienMiesiaca}${przyrostek(tydzienMiesiaca)} tydzień  ${monthsNames[month-1]} ${year} (${week})`;

        //const dayText = ((day + 1) < 10) ? "0" + (day + 1) : day + 1;
        //const monthsNames = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];
        //input.value = dayText + ' ' + monthsNames[month] + ' ' + year;
    }
});

terminRojki.init();





//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------

const kontrolkiWiekosci = function() {

    const form = document.getElementById('dateForm');

    const inputRozmiarQ = form.querySelector('[name="inputRozmiarQ"]');
    const inputKolorQ = form.querySelector('[name="inputKolorQ"]');

    const inputRozmiarR = form.querySelector('[name="inputRozmiarR"]');
    const inputKolorR = form.querySelector('[name="inputKolorR"]');

    let minRozmQ = 7;
    inputRozmiarQ.options[0] = new Option("--")
    for(let i=minRozmQ; i<19; i++) {
        inputRozmiarQ.options[i-minRozmQ+1] = new Option(i);
    } 

    const kolorMrowkiQ = ["--", "Czarny", "Czarno-brązowy", "Brązowy", "Bursztynowy", "Rudy", "Czerwony", "Pomarańczowy", "Żółty"]
    for(let i=0; i<kolorMrowkiQ.length; i++)
        inputKolorQ.options[i] = new Option(kolorMrowkiQ[i]);

    let minRozmR = 2;
    inputRozmiarR.options[0] = new Option("--")
    for(let i=minRozmR; i<15; i++) {
        inputRozmiarR.options[i-minRozmR+1] = new Option(i);
    } 

    const kolorMrowkiR = ["--", "Czarny", "Czerwony", "Bursztynowy", "Rudy", "Pomarańczowy", "Żółty"]
    for(let i=0; i<kolorMrowkiR.length; i++)
        inputKolorR.options[i] = new Option(kolorMrowkiR[i]);
}

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------

const tabMrowek = [];   //tablica ze wszystkimi mrowkami
function Mrowka(daneWejsciowe) {
    this.id = daneWejsciowe.id;
    this.analizowac = true;
    this.punkty = 0;
    //this.obiekt = obiekt;
    this.name = daneWejsciowe.name;
    this.namePL = daneWejsciowe.namePL;
    this.rojkaPoczatek = daneWejsciowe.rojPocz;
    this.rojkaKoniec = daneWejsciowe.rojKoni;
    this.rozmQmin = daneWejsciowe.rozmQmin;
    this.rozmQmax = daneWejsciowe.rozmQmax;
    this.rozmRmin = daneWejsciowe.rozmRmin;
    this.rozmRmax = daneWejsciowe.rozmRmax;
    this.kolorQ = daneWejsciowe.kolorQ;
    this.kolorR = daneWejsciowe.kolorR;
    this.opisWygladKrolowej = daneWejsciowe.opis;
    this.opisDodatkowy = daneWejsciowe.opisDod;
    
    this.divContener = null;    // główny kontener na cała mrówkę (zdjęcie i opisy)
    this.divNazwaMrowki = null; // div z nazwa mrówki
    this.divOpis = null;        // div ze skruconym opisem
    this.divOpisDod = null;     // div z opisem dodatkowym
    this.obrazNaglowka = null;  // pierwszy obrazek, widoczny przy kazdej mrowce

    //tworze obrazek nagłówkowy
    this.obrazNaglowka = new Image(150);
    this.obrazNaglowka.src = (this.id<10) ? `mrowka0${this.id}/zdjecie1.jpg` : `mrowka${this.id}/zdjecie1.jpg`;
    this.obrazNaglowka.classList.add("obraz-naglowka");

    //tworze polez nazwa mrówki (nazwa łacińska i polska)
    this.divNazwaMrowki = document.createElement("div");
    this.divNazwaMrowki.classList.add("nazwa-glowna");
    this.divNazwaMrowki.innerHTML = 
        `<h1><i>${this.name}</i></h1>
         <h3>${this.namePL}</h3>
        `

    //tworze pole z opisem wygladu
    this.divOpis = document.createElement("div");
    this.divOpis.classList.add("opis-glowny")
    this.divOpis.innerHTML = 
        `   <p>Rozmiar królowej: ${this.rozmQmin}-${this.rozmQmax}mm.</p>
            <p><b>Wygląd królowej:</b> ${this.opisWygladKrolowej} (id:${this.id})</p>
        `

    //tworze przycisk 
    this.btn = document.createElement("button");
    this.btn.classList.add(`button-mrowka${this.id}`);
    this.btn.innerText = "Pokaż więcej"; 

    //tworze div z opisem dodatkowym
    this.divOpisDod = document.createElement('div');
    this.divOpisDod.classList.add(`opis-rozwijany${this.id}`);
    this.divOpisDod.classList.add(`opisy-rozwijany`);
    this.divOpisDod.classList.add(`opisy-rozwijany-hide`);
    this.divOpisDod.innerHTML = 
        ` ${this.opisDodatkowy}
        `

    //tworze głowny kontener, do któego będe wkładał powyższe (wszystkie) elementy
    this.divContener = document.createElement("div");
    this.divContener.id = `cntMrowkaId${this.id}`;
    this.divContener.classList.add("mrowkaContener");
    this.divContener.style.backgroundColor = "#BBFFBB";
    //tutaj wkładam elementy
    this.divContener.appendChild(this.obrazNaglowka);
    this.divContener.appendChild(this.divNazwaMrowki);
    this.divContener.appendChild(this.divOpis);
    this.divContener.appendChild(this.btn);
    this.divContener.appendChild(this.divOpisDod);

    

    

    // const obslugaPrzycisku = $(`button-mrowka${this.id}`).click(function() {
    //     console.log(`Wykonal sie ten przycisk ${this.id}`);
    //     $( `this.opisDodatkowy` ).slideToggle( "slow" );
    //     });


    tabMrowek.push(this);   //dodaje cały element do tablicy ze wszystkimi mrowkami
}





/*
const mrowka0 = new Mrowka({
    id       : 0,
    name     : "no name",
    namePL   : "no name",
    rojPocz  : 0, // 21-IVmaja, 16 polowa kwietnia , 18 maj, 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni  : 0, // 34-IIIsierpnia
    rozmQmin : 0,
    rozmQmax : 0,
    rozmRmin : 0,
    rozmRmax : 0,
    kolorQ   : ["Czarny"], //["Czarny", "Czarno-brązowy", "Brązowy", "Bursztynowy", "Rudy", "Czerwony", "Pomarańczowy", "Żółty"] 
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `Opis.
              `,
    opisDod  : `<b>Rójka:</b> ...
                <br><b>Zakładanie gniazda:</b> Klasztorny.
                <br><b>Miejsce gniazdowania:</b> Najczęściej zakłada kolonie w...
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> ...

                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b> ...
                <br><b>Metody obrony:</b> ...
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> ...
                <br><b>Trudność hodowli</b> ...
                <br><b>Liczebność:</b> ...
                <br><b>Ciekawostki:</b> ...
                `, 
});
*/



const mrowka1 = new Mrowka({
    id      : 1,
    name    : "Lasius brunneus",
    namePL  : "Hurtnica wstydliwa / Hurtnica nadrzewna",
    rojPocz : 21, // 21-IVmaja, 16 polowa kwietnia , 18 maj, 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni : 34, // 34-IIIsierpnia
    rozmQmin : 7,
    rozmQmax : 8,
    rozmRmin : 3,
    rozmRmax : 5,
    kolorQ   : ["Brązowy", "Czarno-brązowy"],
    KolorR   : null,
    opis    : `Brązowa, aksamitny połysk. Wcięty tył głowy. Brunatne odnóża. Czekoladowy tułów i odwłok.
              `,
    opisDod : `<b>Rójka</b> koniec maja - sierpień.
                <br><b>Zakładanie gniazda:</b> klasztorny
                <br><b>Miejsce gniazdowania:</b> Najczęściej zakłada kolonie w spróchniałym drzewie (są dendrofilami). 
                Czasami kolonie tego gatunku możemy znaleźć w szczelinach budynków, 
                lub nawet we wnętrzu domu (chętnie gnieżdżą się w drewnianej podłodze, 
                często wykorzystują różne szczeliny).
                <br><b>Zachowanie</b> Bardzo płochliwa i ostrożna mrówka, unikająca otwartych przestrzeni. 
                Do dużych źródeł pokarmu tworzy bardzo wyraźne i zwarte szlaki zapachowe 
                (charakterystyczne zachowanie tego gatunku). 
                Lasius brunneus unika konfrontacji z innymi gatunkami mrówek, 
                lecz czasami atakuje inne kolonie tego samego gatunku.
                <br><b>Polimorfizm:</b> Brak polimorfizmu, gatunek monomorficzny.
                <br><b>Metody obrony: </b> Gatunek ten potrafi pryskać kwasem mrówkowym, 
                zazwyczaj unika walki ratując się ucieczką.
                `, 
});

const mrowka2 = new Mrowka({
    id      : 2,
    name    : "Lasius emarginatus",
    namePL  : "Hurtnica skalna",
    rojPocz : 25, // 25-IIIczerwiec, 
    rojKoni : 33, // 33-IIsierpnia
    rozmQmin : 7,
    rozmQmax : 9,
    rozmRmin : 3,
    rozmRmax : 5,
    kolorQ   : ["Brązowy"],
    KolorR   : null,
    opis    : `<b>Kolor: </b> brązowy, aksamitny.
                <br>- tułów bardziej brązowy i jaśniejszy od odwłoka i głowy, czasami z delikatnym rysunkiem,
                <br>- aksamitny połysk,
                <br>- wcięty tył głowy,
                <br>- brunatne odnóża.
              `,
    opisDod : `<b>Rójka</b> koniec czerwca - początek sierpnia.
                <br><b>Zakładanie gniazda:</b> klasztorny
                <br><b>Miejsce gniazdowania:</b> Gniazduje w drewnie.

                <br><b>Zachowanie</b> Są szybsze i agresywniejsze od Lasius niger

                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b> W przypadku osierocenia - Lasius emarginatus.
                <br><b>Metody obrony: </b> ...
                
                `, 
});

const mrowka3 = new Mrowka({
    id      : 3,
    name    : "Lasius flavus",
    namePL  : "Podziemnica zwyczajna",
    rojPocz : 25, // 25-III czerwca, 
    rojKoni : 36, // 36- I września
    rozmQmin : 7,
    rozmQmax : 9,
    rozmRmin : 2,
    rozmRmax : 4,
    kolorQ   : ["Brązowy"],
    KolorR   : ["Żółty", "Pomarańczowy"],
    opis    : `Brązowa, żółte odnóża i spód odwłoka, aksamitny połysk, brązowy tułów i odwłok `,
    opisDod : `<b>Rójka</b> koniec czerwca - początek września.
                <br><b>Zakładanie gniazda:</b> klasztorny.
                <br><b>Miejsce gniazdowania:</b> buduje kopce z ziemi lub piasku. Wilgociolubna.
                <br><b>Adopcja:</b> W przypadku osierocenia - Lasius flavus.

                `, 

});


const mrowka4 = new Mrowka({
    id      : 4,
    name    : "Lasius fuliginosus",
    namePL  : "Kartonówka zwyczajna / Kartoniarka czarna",
    rojPocz : 23, // 23-Iczerwiec, 
    rojKoni : 37, // 37-IIwrzesnia
    rozmQmin : 6,
    rozmQmax : 7,
    rozmRmin : 4,
    rozmRmax : 6,
    kolorQ   : ["Czarny"], //["Czarny", "Czarno-brązowy", "Brązowy", "Czerwony", "Pomarańczowy", "Żółty"]
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis    : `Smoliście czarna, błyszcząca, mocno wcięty tył głowy, mały odwłok.
              `,
    opisDod : `<b>Rójka</b> początek czerwca – początek września.
                <br><b>Zakładanie gniazda:</b> Pasożyniczy.
                <br><b>Miejsce gniazdowania:</b> Poszukiwać gniazda podziemnych mrówek z gatunku
                Lasius (Chthonolasius) umbratus.
                <br><b>Żywienie:</b> Kolonia odżywia się spadzią, jednak ze względu na duże 
                zapotrzebowanie larw na białko, również aktywnie poluje na wszelkie bezkręgowce
                <br><b>Zachowanie</b>...
                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b> Lasius umbratus, najlepiej kokony z kilkoma robotnicami (nie umie otwierać kokonów).
                <br><b>Metody obrony:</b> ...
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> Nie
                <br><b>Trudność hodowli</b> Sprawia spore trudności w chowie sztucznym.
                `, 
});

const mrowka5 = new Mrowka({
    id      : 5,
    name    : "Lasius niger",
    namePL  : "Hurtnica czarna / Hurtnica pospolita",
    rojPocz : 25, // 25-IIIczerwca, 
    rojKoni : 36, // 36- Iwrzesień
    rozmQmin : 8,
    rozmQmax : 9,
    rozmRmin : 3,
    rozmRmax : 4,
    kolorQ   : ["Czarny", "Czarno-brązowy"],
    KolorR   : null,
    opis    : `Czarna z matowym, czasami brązowawym połyskiem. Wcięty tył głowy.
              Brunatne odnóża, czekoladowy tułów i odwłok.
              <br>Szeroki tułów z potężnymi mięśniami skrzydeł, wyraźnie szerszy niż głowa, mocno wypukły `,
    opisDod : `<b>Rójka</b> koniec czerwca – początek września.
                <br><b>Zakładanie gniazda:</b> klasztorny
                <br><b>Adopcja:</b> W przypadku osierocenia - Lasius niger.
                <br><b>Metody obrony:</b> Mrówki te pryskają kwasem mrówkowym.
                <br><b>Trudność hodowli</b> Idealna mrówka dla początkującego, bardzo odporna na błędy i dość szybko się mnoży.
                <br><b>Liczebność:</b> Liczba robotnic w koloni może dochodzić do 10 000.
                `, 
});

const mrowka6 = new Mrowka({
    id      : 6,
    name    : "Lasius umbratus",
    namePL  : "Podziemnica cieniolubna",
    rojPocz : 0, // 21-IVmaja, 16 polowa kwietnia , 18 maj, 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni : 0, // 34-IIIsierpnia
    rozmQmin : 7,
    rozmQmax : 9,
    rozmRmin : 3,
    rozmRmax : 5,
    kolorQ   : ["Brązowy", "Pomarańczowy"], //["Czarny", "Czarno-brązowy", "Brązowy", "Czerwony", "Pomarańczowy", "Żółty"]
    KolorR   : ["Żółty"], //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis    : `Kolor: brązowy do żółtego. Mocno wcięty tył głowy. Jasne, żółtawe odnóża.
                Mały odwłok. Głowa szersza od tułowia. Duże żuwaczki.
              `,
    opisDod : `<b>Rójka:</b> koniec czerwca - do ostatnich, ciepłych dni września.
                <br><b>Zakładanie gniazda:</b> Pasożyniczy.
                <br><b>Miejsce gniazdowania:</b> Wymaga dużej wilgotności gniazda.
                <br><b>Żywienie:</b> Spadź mszyc korzeniowych.
                <br><b>Zachowanie</b> ...

                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b>  Lasius fuliginosus lub Lasius niger, najlepiej kokony z kilkoma robotnicami (nie umie otwierać kokonów)
                <br>Adopcję podziemnicy najlepiej przeprowadzać na 2 - 3 młodych robotnicach Lasius niger 
                    i kilkudziesięciu kokonach tegoż gatunku. Z naturalnego gniazda Lasius niger podbiera się 
                    kilkadziesiąt kokonów oraz kilka, najlepiej młodych, robotnic. Kokony umieszcza się w probówce
                    z królową podziemnicy na kilka godzin, żeby przesiąkła ich zapachem, 
                    a następnie dodaje robotnice, które, wyczuwając zapach własnych poczwarek, nie atakują królowej.
                <br><b>Metody obrony:</b> ...
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> nie.
                <br><b>Trudność hodowli</b> Gatunek polecany dla osób z pewnym doświadczeniem. 
                 Trudno dostać rójkową królową, która wymaga adopcji na poczwarkach i młodych 
                 robotnicach Lasius niger.
                <br><b>Liczebność:</b> ...

                `, 
});


const mrowka11 = new Mrowka({
    id      : 11,
    name    : "Formica cinerea",
    namePL  : "Pierwomrówka żwirowa",
    rojPocz : 22, // 22-Iczerwiec, 16 polowa kwietnia , 18 maj, 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni : 35, // 35-IVsierpnia
    rozmQmin : 9,
    rozmQmax : 11,
    rozmRmin : 4,
    rozmRmax : 7,
    kolorQ   : ["Czarny"], //["Czarny", "Czarno-brązowy", "Brązowy", "Czerwony", "Pomarańczowy", "Żółty"]
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis    : `Matowo czarna. Duża. Paskowany odwłok, mieniący się w świetle. Lekko brązowe odnóża.
               Połyskującym odwłok. 
               <br>Charakterystyczny sposób poruszania się a mianowicie, robotnica biegnie, zatrzymuje się, zmienia kierunek i znów biegnie
              `,
    opisDod : `<b>Rójka:</b> czerwiec - koniec sierpnia.
                <br><b>Zakładanie gniazda:</b> Klasztorny.
                <br><b>Miejsce gniazdowania:</b> preferuje formikarium ziemne, z betonu komórkowego, korkowe lub gipsowe w orientacji pionowej
                <br><b>Żywienie:</b> Spadź i drobne owady. Robotnice są znane z pieczołowitej hodowli mszyc.
                <br><b>Zachowanie</b> ...

                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b> W przypadku osierocenia - Formica cinerea.
                <br><b>Zachowanie:</b> Mrówki agresywne i terytorialne. 
                  Posiadające bardzo dobry wzrok. 
                  Drobne zdobycze zazwyczaj transportują samotnie do gniazda. 
                  W przypadku dużego źródła pokarmu szybko i sprawnie rekrutują inne robotnice.
                <br><b>Metody obrony:</b> Gatunek ten potrafi pryskać kwasem mrówkowym.
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> nie.
                <br><b>Trudność hodowli</b> ...
                <br><b>Liczebność:</b> ...

                `, 
});


const mrowka12 = new Mrowka({
    id      : 12,
    name    : "Formica cunicularia",
    namePL  : "Pierwomrówka ziemna",
    rojPocz : 22, // 21-IVmaja, 16 polowa kwietnia , 18 maj, 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni : 30, // 30-IVlipca
    rozmQmin : 8,
    rozmQmax : 9,
    rozmRmin : 6,
    rozmRmax : 7,
    kolorQ   : ["Czarno-brązowy"], //["Czarny", "Czarno-brązowy", "Brązowy", "Czerwony", "Pomarańczowy", "Żółty"]
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis    : `Kolor czarno - brązowy. Średni odwłok. Głowa, tarcza i odwłok ciemne.
                Spód tułowia i nogi jaśniejsze. Brązowe boki tułowia.
              `,
    opisDod : `<b>Rójka:</b> czerwiec – koniec lipca.
                <br><b>Zakładanie gniazda:</b> Klasztorny.
                <br><b>Miejsce gniazdowania:</b> Najczęściej zakłada kolonie w...
                <br><b>Żywienie:</b> Spadź i owady. Pieczołowicie hoduje mszyce.
                <br><b>Zachowanie</b> Jest to bardzo agresywna mrówka, która aktywnie poluje na owady. 
                 Zażarcie broni gniazda, a spora kolonia może dotkliwie rozdrażnić napastnika.
                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b> W przypadku osierocenia - Formica cunicularia.
                <br><b>Metody obrony:</b> ...
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> nie
                <br><b>Trudność hodowli</b> ...
                <br><b>Liczebność:</b> ...

                `, 
});


const mrowka13 = new Mrowka({
    id       : 13,
    name     : "Formica fusca",
    namePL   : "Pierwomrówka łagodna",
    rojPocz  : 22, // 21-IVmaja, 16 polowa kwietnia , 18 maj, 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni  : 35, // 35-IVsierpnia
    rozmQmin : 8,
    rozmQmax : 10,
    rozmRmin : 4,
    rozmRmax : 8,
    kolorQ   : ["Czarny"], //["Czarny", "Czarno-brązowy", "Brązowy", "Czerwony", "Pomarańczowy", "Żółty"]
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `Błyszcząco czarna.
              `,
    opisDod  : `<b>Rójka:</b> czerwiec - koniec sierpnia.
                <br><b>Zakładanie gniazda:</b> Klasztorny.
                <br><b>Miejsce gniazdowania:</b> Najczęściej zakłada kolonie w...
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> ...

                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b> W przypadku osierocenia - Formica fusca.
                <br><b>Metody obrony:</b> ...
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> ...
                <br><b>Trudność hodowli</b> ...
                <br><b>Liczebność:</b> ...
                <br><b>Ciekawostki:</b> Mrówka łatwo zakłada kolonię, poczwarki i robotnice
                 są cennym źródłem w przypadku adopcji królowych pasożytniczych. 
                 Dobra dla początkujących. Poliginiczna.
                `, 
});


const mrowka14 = new Mrowka({
    id       : 14,
    name     : "Formica rufa",
    namePL   : "mrówka rudnica",
    rojPocz  : 14, // 14-Ikwiecień, 16 polowa kwietnia , 18 maj, 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni  : 34, // 34-IIIsierpnia
    rozmQmin : 9,
    rozmQmax : 11,
    rozmRmin : 4,
    rozmRmax : 9,
    kolorQ   : ["Czarny"], //["Czarny", "Czarno-brązowy", "Brązowy", "Czerwony", "Pomarańczowy", "Żółty"]
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `Błyszcząca, czarno-ruda. Duża. Odwłok mały, czarny, z czerwoną plamą u nasady.
                Tułów rudy z czarną tarczą. Głowa czarna z rudymi bokami.
              `,
    opisDod  : `<b>Rójka:</b> kwiecień - koniec czerwca.
                <br><b>Zakładanie gniazda:</b> Pasożytniczy.
                <br><b>Miejsce gniazdowania:</b> Najczęściej zakłada kolonie w...
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> ...

                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b> ...
                <br><b>Metody obrony:</b> Reagują bardzo agresywnie na ruch, tryskając kwasem mrówkowym.
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> TAK
                <br><b>Trudność hodowli</b> ...
                <br><b>Liczebność:</b> ...

                `, 
});



const mrowka15 = new Mrowka({
    id       : 15,
    name     : "Formica rufibarbis",
    namePL   : "pierwomrówka krasnolica",
    rojPocz  : 25, // 26-IIIczerwca, 16 polowa kwietnia , 18 maj, 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni  : 35, // 35-IVsierpnia
    rozmQmin : 9,
    rozmQmax : 10,
    rozmRmin : 5,
    rozmRmax : 8,
    kolorQ   : ["Czarno-brązowy", "Brązowy"], //["Czarny", "Czarno-brązowy", "Brązowy", "Czerwony", "Pomarańczowy", "Żółty"]
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `Duży odwłok. Charakterystyczny rysunek na tułowiu w kształcie litery "M".
                Różnica w kolorze tułowia i odwłoka.
              `,
    opisDod  : `<b>Rójka:</b> koniec czerwca - koniec sierpnia.
                <br><b>Zakładanie gniazda:</b> Klasztorny.
                <br><b>Miejsce gniazdowania:</b> Najczęściej zakłada kolonie w...
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> ...

                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b> ...
                <br><b>Metody obrony:</b> ...
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> ...
                <br><b>Trudność hodowli</b> ...
                <br><b>Liczebność:</b> Kolonia może liczyć kilkaset robotnic.
                <br><b>Ciekawostki:</b> Pierwsze robotnice są z reguły czarne, a kolorowe mrówki
                 pojawiają się stosunkowo późno.
                `, 
});


const mrowka16 = new Mrowka({
    id      : 16,
    name    : "Formica sanguinea",
    namePL  : "Zbójnica krwista",
    rojPocz : 27, // 21-IVmaja, 16 polowa kwietnia , 18 maj, 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni : 35, // 35-IVsierpnia
    rozmQmin : 9,
    rozmQmax : 11,
    rozmRmin : 6,
    rozmRmax : 9,
    kolorQ   : ["Czarny", "Pomarańczowy"], //["Czarny", "Czarno-brązowy", "Brązowy", "Czerwony", "Pomarańczowy", "Żółty"]
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis    : `Mały, czarny odwłok, czasami z czerwoną plamą u nasady. 
               Tułów rudy z delikatnym, czarnym rysunkiem i ciemniejszą kropką na przodzie.
               Duża, czarna głowa. Królowe są bardzo agresywne i szybkie.
               Jednoznacznie można ją zidentyfikowć po wcięciu w nadustku.
              `,
    opisDod : `<b>Rójka:</b> lipiec - sierpień; upalne dni - kopulacja zachodzi często na kopcu, lub w jego pobliżu.
                <br><b>Zakładanie gniazda:</b> Pasożytnictwo czasowe (po rójce) lub podział kolonii 
                (pleometrozja wtórna, pączkowanie) czasami połączony z wprowadzeniem królowej do gniazda 
                podczas rajdu bądź odłączeniem od kolumny rajdowej grupy robotnic wraz z królową.
                <br><b>Miejsce gniazdowania:</b> Wilgotność średnia, lub niska; lubi wygrzewać poczwarki
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie:</b> Są bardzo agresywne i terytorialne, posiadają bardzo dobry wzrok. 
                Eliminują każdy inny agresywny gatunek mrówek, który znajdzie się na ich terytorium.
                <br><b>Polimorfizm:</b> słaby polimorfizm - robotnice major mają dużą, ciemnoczerwoną głową; 
                zbieraczki pojawiają się w koloniach liczących ponad 200 robotnic, majory pojawiają się w 
                dużych koloniach, ponad 500 robotnic (szybciej w koloniach monoginicznych)
                <br><b>Adopcja:</b> Głównie Formica fusca. Z racji na sposób zakładania gniazda, 
                adopcja na robotnicach jest prawie niemożliwa, nawet po długotrwałym schłodzeniu.
                Dużym plusem jest to, że królowa potrafi otwierać poczwarki – z tego powodu 
                najlepiej podrzucić jej kilka poczwarek, które na pewno zaakceptuje. 
                Dojrzałej kolonii można podawać poczwarki innych Formica (Serviformica) spp. 
                Nie podawać poczwarek rudnic!
                <br><b>Metody obrony:</b> Bardzo sprawnie pryska kwasem, a także dotkliwie gryzie; dzięki dobremu wzrokowi, skutecznie broni gniazda a także źródeł pokarmu.
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> ...
                <br><b>Trudność hodowli</b> ...
                <br><b>Liczebność:</b> do kilkunastu tysięcy robotnic do 12000 osobników
                <br><b>Ciekawostki:</b> Podczas rajdów, robotnice idą szeroko rozstawioną falangą 
                i po napotkaniu gniazda pierwomrówek "wlewają się" do środka. Nie atakują robotnic
                 - w czasie ataku najprawdopodobniej rozsiewają substancje propagandowe z gruczołu 
                 ufore'a, które doprowadzają do wybuchu paniki w napadniętym gnieździe, dlatego 
                 pierwomrówki uciekają, aby przeczekać rajd. Zbójnice porywają głównie larwy, które
                 służą jako pokarm dla własnego potomstwa - z porwanych poczwarek, czasami 
                 wylęgają się niewolnice. Jest to efekt niezamierzony, a robotnice zbójnicy są w
                 pełni sprawne i mogą wykonywać wszelkie prace w gnieździe. Rajdy są przeprowadzane
                 po rójce w najeżdżanej kolonii, ponieważ wtedy w gnieździe znajdują się larwy 
                 robotnic. Łatwo rozpoznać gatunek, jeśli w gnieździe zbójnic zauważy się niewolnice.
                 Niewolnice stanowią z reguły jedynie kilka procent całej populacji gniazda i w 
                 zależności od gatunku, wykonują różnego rodzaju prace w gnieździe. Zdarza się nawet,
                 że robotnice agresywniejszych gatunków wyruszają wraz ze zbójnicami na rajdy. 
                 W zależności od zagęszczenia występowania, kolonie mogą produkować duże, lub małe
                 samice, różniące się wielkością oraz zasięgiem (duże - mały zasięg, małe - duży zasięg)
                `, 
});

const mrowka17 = new Mrowka({
    id       : 17,
    name     : "Formica truncorum",
    namePL   : "mrówka pniakowa",
    rojPocz  : 25, // 25-IIczerwca, 16 polowa kwietnia , 18 maj, 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni  : 35, // 35-IVsierpnia
    rozmQmin : 9,
    rozmQmax : 11,
    rozmRmin : 6,
    rozmRmax : 10,
    kolorQ   : ["Czarno-brązowy", "Brązowy", "Pomarańczowy"], //["Czarny", "Czarno-brązowy", "Brązowy", "Czerwony", "Pomarańczowy", "Żółty"]
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `Mały, charakterystycznie ubarwiony odwłok (odcienie rudego włącznie z czarnym!).
                Tułów rudy z rysunkiem na tarczy. Głowa ruda z czarnym lub brązowym rysunkiem.
                Budową ciała przypomina rudnice, charakterystyczny jest kolor głowy i rysunek na tarczy.
              `,
    opisDod  : `<b>Rójka:</b> koniec czerwca – koniec sierpnia.
                <br><b>Zakładanie gniazda:</b> Pasożytniczy.
                <br><b>Miejsce gniazdowania:</b> Najczęściej zakłada kolonie w...
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> ...

                <br><b>Polimorfizm:</b> występuje słaby polimorfizm
                <br><b>Adopcja:</b> Formica cinerea, Formica fusca, Formica rufibarbis, Formica cunicularia
                <br><b>Metody obrony:</b> ...
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> TAK
                <br><b>Trudność hodowli</b> ...
                <br><b>Liczebność:</b> ...

                `, 
});


const mrowka21 = new Mrowka({
    id       : 21,
    name     : "Camponotus fallax",
    namePL   : "Gmachówka pniowa, gmachówka zwodnicza",
    rojPocz  : 18, // 18-Imaja, 16 polowa kwietnia , 18 maj, 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni  : 26, // 26-IVczerwiec
    rozmQmin : 10,
    rozmQmax : 11,
    rozmRmin : 7,
    rozmRmax : 10,
    kolorQ   : ["Czarny"], //["Czarny", "Czarno-brązowy", "Brązowy", "Czerwony", "Pomarańczowy", "Żółty"]
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `Czarna, błyszcząca. Smukła. Czułki i odnóża jaśniejsze.
              `,
    opisDod  : `<b>Rójka:</b> początek maja – koniec czerwca.
                <br><b>Zakładanie gniazda:</b> Klasztorny.
                <br><b>Miejsce gniazdowania:</b>  Zakłada gniazda w drzewach. Drzewo z gniazdem 
                można poznać po charakterystycznych wiórkach pod pniem. Warto obserwować gniazda podczas rójki.
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> ...

                <br><b>Polimorfizm:</b> Występują wyraźne kasty.
                <br><b>Adopcja:</b> W przypadku osierocenia - Camponotus fallax.
                <br><b>Metody obrony:</b> zazwyczaj unika walki ratując się ucieczką. 
                Mrówki tego gatunku potrafią pryskać kwasem.
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> ...
                <br><b>Trudność hodowli</b> Kolonia rozwija się bardzo powoli, konieczne zimowanie. 
                <br><b>Liczebność:</b> ...

                `, 
});

const mrowka22 = new Mrowka({
    id       : 22,
    name     : "Camponotus herculeanus",
    namePL   : "gmachówka koniczek / gmachówka cieśla",
    rojPocz  : 18, // 21-Imaja, 16 polowa kwietnia , 18 maj, 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni  : 26, // 34-IVczerwca
    rozmQmin : 16,
    rozmQmax : 16,
    rozmRmin : 6,
    rozmRmax : 12,
    kolorQ   : ["Czarny", "Czarno-brązowy"], //["Czarny", "Czarno-brązowy", "Brązowy", "Czerwony", "Pomarańczowy", "Żółty"]
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `Błyszcząca, czarno-brązowa. Duża, potężna. 
                Czarna z wyraźnymi brązowo-czerwonymi akcentami na tułowiu i odnóżach.
              `,
    opisDod  : `<b>Rójka:</b> początek maja - koniec czerwca.
                <br><b>Zakładanie gniazda:</b> Klasztorny.
                <br><b>Miejsce gniazdowania:</b> Zakłada gniazda w drzewach. Drzewo z gniazdem można 
                poznać po charakterystycznych wiórkach pod pniem. Warto obserwować gniazda podczas rójki.
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> ...

                <br><b>Polimorfizm:</b> Występują wyraźne kasty
                <br><b>Adopcja:</b> W przypadku osierocenia - Camponotus ligniperdus lub Camponotus herculeanus.
                <br><b>Metody obrony:</b> ...
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> ...
                <br><b>Trudność hodowli</b> Gatunek ma tendencję do popadania w długie stagnacje. Młoda kolonia rozwija się bardzo powoli. 
                Hibernacja zimowa jest niezbędna do prawidłowego rozwoju koloni.
                <br><b>Liczebność:</b> ...

                `, 
});

const mrowka23 = new Mrowka({
    id       : 23,
    name     : "Camponotus ligniperda",
    namePL   : "Gmachówka drzewotoczna",
    rojPocz  : 18, // 18-Imaja
    rojKoni  : 26, // 26-IVczerwca
    rozmQmin : 17,
    rozmQmax : 18,
    rozmRmin : 6,
    rozmRmax : 14,
    kolorQ   : ["Czarny", "Czarno-brązowy"],
    KolorR   : null,
    opis     : `Bardzo duża, potężna, czarna z wyraźnymi brązowo-czerwonymi 
                akcentami na tułowiu, odnóżach i odwłoku. `,
    opisDod  : `<b>Rójka</b> początek maja - koniec czerwca
                <br><b>Zakładanie gniazda:</b> Klasztorny.
                <br><b>Miejsce gniazdowania:</b> Zakłada gniazda w drzewach. 
                Drzewo z gniazdem można poznać po charakterystycznych wiórkach pod pniem. 
                Warto obserwować gniazda podczas rójki.
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> ...

                <br><b>Polimorfizm:</b> Występują wyraźne kasty.
                <br><br><b>Adopcja</b> W przypadku osierocenia - Camponotus ligniperdus lub Camponotus herculeanus.
                <br><br><b>Ciekawostki</b> Camponotus ligniperda jest największym gatunkiem mrówki w Europie.
                <br><b>Trudność hodowli</b> Gatunek ma tendencję do popadania w długie stagnacje. 
                Młoda kolonia rozwija się bardzo powoli. 
                Hibernacja zimowa jest niezbędna do prawidłowego rozwoju koloni.
                <br><b>Liczebność:</b> ...
                `, 

});


const mrowka51 = new Mrowka({
    id       : 51,
    name     : "Dolichoderus quadripunctatus",
    namePL   : "Nadrzewnica czteroplamka / czterokropek",
    rojPocz  : 27, // 27 Ilipiec, 31 sierpień
    rojKoni  : 39, // 34-IVwrzesień
    rozmQmin : 4,
    rozmQmax : 5,
    rozmRmin : 3,
    rozmRmax : 5,
    kolorQ   : ["Czarny", "Czarno-brązowy"], //["Czarny", "["Czarno-brązowy", "Brązowy", "Pomarańczowy"]-brązowy", "Brązowy", "Czerwony", "Pomarańczowy", "Żółty"]
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `kolor czarny z akcentami czerwonego i żółtego, błyszczący.
                Charakterystyczne ubarwienie, w tym cztery jasne plamki na odwłoku.
                Charakterystyczny profil tułowia oraz łuski pomostka. (Wszystkie cechy kluczowe)
              `,
    opisDod  : `<b>Rójka:</b> lipiec – koniec września.
                <br><b>Zakładanie gniazda:</b> Półklasztorny - królowa aktywnie poluje podczas wychowywania pierwszego pokolenia robotnic.
                <br><b>Miejsce gniazdowania:</b> W drewnie (dendrofil) - w martwych konarach i pniach drzew liściastych,
                rzadziej iglastych, czasem również w drewnianych konstrukcjach oraz w korze (mniejsze kolonie).
                Nasłonecznione obszary leśne oraz parki.
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> Robotnice z reguły nie są agresywne, często zasiedlają drzewa sąsiadując z 
                innymi gatunkami, np. Camponotus fallax.
                <br><b>Polimorfizm:</b> Brak polimorfizmu, robotnice różnią się za to wielkością i zachowaniem.
                <br><b>Adopcja:</b> W przypadku rójkowej królowej zaleca się adopcję poczwarek bądź młodych 
                robotnic (piastunek). Duże, furażerujące robotnice nie będą zajmować się zaadoptowaną królową.
                Jeżeli nie ma możliwości adopcji, królową należy umieścić w zaciemnionej probówce z dostępem do
                areny zaopatrzonej w świeży pokarm. Niekiedy można wywabić jedną z królowych np. za pomocą
                kropli miodu - taką królową można odłowić z niewielkim orszakiem robotnic, aby rozpocząć kolonię.
                <br><b>Metody obrony:</b> Mrówki potrafią pryskać kwasem, aczkolwiek rzadko korzystają z tej 
                metody obrony - w razie zagrożenia zamierają w bezruchu, a gdy sytuacja je do tego zmusi,
                uciekają szybkim krokiem, szukając zakamarków, w których mogą się ukryć. 
                Wykazują wyśmienitą przyczepność do podłoża.
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> TAK
                <br><b>Trudność hodowli</b> Gatunek trudny w hodowli, bardzo trudny w przypadku 
                rozpoczęcia hodowli od rójkowej królowej - zalecana jest adopcja.
                Królowa jest wrażliwa na stres, zaniepokojona może zjadać potomstwo, 
                co utrudnia wychowanie pierwszych robotnic.
                Mrówki są wrażliwe na wiele czynników i łatwo padają.
                Królowa zaopatrywana w białko chętnie czerwi.
                <br><b>Liczebność:</b> Kilkaset (150-500) osobników, rzadko spotyka się większe kolonie.
                <br><b>Ciekawostki:</b> Niższe szczeblem królowe w poliginicznych koloniach 
                zachowują się jak robotnice i niekiedy furażerują w poszukiwaniu pokarmu.
                `, 
});


const mrowka52 = new Mrowka({
    id       : 52,
    name     : "Leptothorax acervorum",
    namePL   : "Smuklica zwyczajna",
    rojPocz  : 25, // 25-IIIczerwiec, 27 lipiec, 31 sierpień
    rojKoni  : 39, // 34-IVwrześnia
    rozmQmin : 5,
    rozmQmax : 5,
    rozmRmin : 3,
    rozmRmax : 5,
    kolorQ   : ["Czarno-brązowy", "Brązowy", "Pomarańczowy"], //["Czarny", "Czarno-brązowy", "Brązowy", "Czerwony", "Pomarańczowy", "Żółty"]
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `Mała, ruda, podwójny stylik, smukła, w miarę jednolity kolor, brak wyraźnego owłosienia..
              `,
    opisDod  : `<b>Rójka:</b> koniec czerwca – koniec września.
                <br><b>Zakładanie gniazda:</b> Klasztorny.
                <br><b>Miejsce gniazdowania:</b> Najczęściej zakłada kolonie w...
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> ...

                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b> W przypadku osierocenia - Leptothorax acervorum.
                <br><b>Metody obrony:</b> ...
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> ...
                <br><b>Trudność hodowli</b> ...
                <br><b>Liczebność:</b> do 200 robotnic.
                <br><b>Ciekawostki:</b> Królową wraz z potomstwem łatwo dobyć przeszukując
                spróchniałe drewno lub kępki mchu. Mrówka bardzo ciekawa z uwagi na 
                „niewidzialność” - z powodzeniem można ją trzymać z innymi mrówkami, 
                najlepiej pierwomrówkami lub gmachówkami. Leptothorax acervorum posiada 
                kilka bardzo podobnych do siebie gatunków bliźniaczych.
                `, 
});


const mrowka53 = new Mrowka({
    id       : 53,
    name     : "Manica rubida",
    namePL   : "Wścieklica dorodna",
    rojPocz  : 16, // 21-IVmaja, 16 polowa kwietnia , 18 maj, 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni  : 39, // 34-IIIsierpnia
    rozmQmin : 10,
    rozmQmax : 11,
    rozmRmin : 9,
    rozmRmax : 10,
    kolorQ   : ["Czerwony", "Bursztynowy"], //["Czarny", "Czarno-brązowy", "Brązowy", "Czerwony", "Pomarańczowy", "Żółty"]
    KolorR   : ["Czerwony", "Bursztynowy"],
    opis     : `Duża (cecha kluczowa). Bursztynowa. Podwójny stylik, 
                Duże żuwaczki z wieloma ząbkami (cecha kluczowa). Smukła, ale potężna.
              `,
    opisDod  : `<b>Rójka:</b> Najczęściej dwie rójki rocznie: kwiecień oraz sierpień / wrzesień.
                <br><b>Zakładanie gniazda:</b> Półklasztorny.
                <br><b>Miejsce gniazdowania:</b> Kamieniste, nasłonecznione miejsca, głównie łąki i pastwiska.
                Często również w miasteczkach, np. pod chodnikami; gniazda są przeważnie budowane pod kamieniami.
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> Agresywne, aczkolwiek nieprowokujące walk.
                Robotnice poruszają się powoli, zaniepokojone biegną z uniesioną głową 
                i rozpostartymi żuwaczkami, a w kontakcie dotkliwie żądlą.
                <br><b>Polimorfizm:</b> Słaby, ale widoczny polimorfizm w dojrzałych koloniach.
                <br><b>Adopcja:</b> Zalecana adopcja poczwarek, robotnice są agresywne nawet po 
                długotrwałym schłodzeniu (robotnice chodzą w temperaturze lodówkowej).
                <br><b>Metody obrony:</b> W kontakcie dotkliwie żądlą
                <br><b>Posiada żądło:</b> tak.
                <br><b>Ochrona gatunkowa</b> nie.
                <br><b>Trudność hodowli</b> Gatunek stosunkowo trudny w hodowli.
                <br><b>Liczebność:</b> ...
                <br><b>Ciekawostki:</b> Manica rubida jest jedynym przedstawicielem swojego
                rodzaju w Europie. Mrówki tej z całą pewnością nie znajdziemy na nizinach.
                Użądlone miejsca mogą być zaczerwienione przez kilka dni - świeże użądlenie 
                charakteryzuje się obrzękiem i pulsującym bólem.
                Kolonie często konkurują o pożywienie z Formica cinerea, 
                jednak przeważnie nie wdają się w walki.
                `, 
});


const mrowka54 = new Mrowka({
    id       : 54,
    name     : "Myrmica rubra",
    namePL   : "Wścieklica zwyczajna",
    rojPocz  : 31, // 31-Isierpień
    rojKoni  : 39, // 39-IVwrzesień
    rozmQmin : 5,
    rozmQmax : 7,
    rozmRmin : 3,
    rozmRmax : 5,
    kolorQ   : ["Czerwony", "Rudy", "Bursztynowy"], //["--", "Czarny", "Czarno-brązowy", "Brązowy", "Czerwony", "Bursztynowy", "Pomarańczowy", "Żółty"]
    KolorR   : ["Czerwony", "Rudy", "Bursztynowy"], //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `Średniego rozmiaru. Ruda. Podwójny stylik. Smukła. Odwłok jaśniejszy od reszty ciała.
                W rodzaju Myrmica jeden z większych gatunków. 
                Krótkie kolce epinotum (cecha kluczowa).
                Łagodnie wygięta nasada czułka, bez załamań, ani zgrubień (cecha kluczowa).
              `,
    opisDod  : `<b>Rójka:</b> sierpień – wrzesień
                <br><b>Zakładanie gniazda:</b> Klasztorna, jednak wychów w pełni klasztorny trwa 
                bardzo długo. Możliwość wychowu półklasztornego.
                <br><b>Miejsce gniazdowania:</b> Często zakładają zawierające po kilka królowych gniazda pod kamieniami, 
                w starym bucie, puszcze.
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> Robotnice poruszają się powoli, natomiast zagrożone potrafią biegać i dotkliwie żądlić. 
                Często furażerują nawet pomimo nieprzychylnej pogody - w chłodne i deszczowe dni.

                <br><b>Polimorfizm:</b> brak
                <br><b>Adopcja:</b> W przypadku osierocenia, bądź do przyspieszenia rozwoju 
                (zalecane w przypadku złapania samotnej królowej) - robotnice, bądź poczwarki tego samego gatunku.
                <br><b>Metody obrony:</b> Mrówki te posiadają żądło, którym potrafią dotkliwie żądlić (również człowieka).
                <br><b>Posiada żądło:</b> tak
                <br><b>Ochrona gatunkowa</b> nie
                <br><b>Trudność hodowli</b> Problemem może być założenie kolonii przez samotną królową, 
                dlatego zaleca się adopcję (najlepiej poczwarek) tego samego gatunku. 
                Odłowione kolonie nie są wymagające i dobrze rozwijają się w szerokim zakresie 
                dostępnych warunków.
                <br><b>Liczebność:</b> ...

                `, 
});

const mrowka55 = new Mrowka({
    id       : 55,
    name     : "Polyergus rufescens",
    namePL   : "Mrówka amazonka",
    rojPocz  : 27, // 21-IVmaja, 16 polowa kwietnia , 18 maj, 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni  : 39, // 34-IVwrzesień
    rozmQmin : 8,
    rozmQmax : 10,
    rozmRmin : 6,
    rozmRmax : 8,
    kolorQ   : ["Rudy", "Bursztynowy", "Pomarańczowy"], //["Czarny", "Czarno-brązowy", "Brązowy", "Bursztynowy", "Rudy", "Czerwony", "Pomarańczowy", "Żółty"] 
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `Sierpowate żuwaczki, kształt ciała nie do pomylenia, krótkie czułki, potężna łuska pomostka.
              `,
    opisDod  : `<b>Rójka:</b> lipiec - wrzesień
                <br><b>Zakładanie gniazda:</b> Pasożyt.
                <br><b>Miejsce gniazdowania:</b> Najczęściej zakłada kolonie w...
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> ...

                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b> Formica cinerea, Formica fusca, 
                    mniej polecane: Formica rufibarbis, Formica cunicularia.
                <br><b>Metody obrony:</b> ...
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> ...
                <br><b>Trudność hodowli</b> Praktykuje pasożytnictwo – robotnice amazonki nie potrafią 
                same wykonywać prac w gnieździe, więc potrzebują stałego dopływu siły roboczej w postaci 
                pierwomrówek. Kolonii trzeba systematycznie dostarczać poczwarek.
                <br><b>Liczebność:</b> do 2000.

                `, 
});


const mrowka56 = new Mrowka({
    id       : 56,
    name     : "Ponera coarctata",
    namePL   : "Złośnica zwyczajna",
    rojPocz  : 31, // 31-Isierpień
    rojKoni  : 39, // 34-IVsierpnia
    rozmQmin : 4,
    rozmQmax : 4,
    rozmRmin : 3,
    rozmRmax : 4,
    kolorQ   : ["Brązowy"], //["Czarny", "Czarno-brązowy", "Brązowy", "Bursztynowy", "Rudy", "Czerwony", "Pomarańczowy", "Żółty"] 
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `Niewielki rozmiar. Smukła budowa. Charakterystyczny kształt odwłoka - mocno wydłużony z "wcięciem" (cecha kluczowa) po pierwszym tergicie.
                Królowa od robotnicy różni się nieco większym tułowiem, śladami po skrzydłach, nieznacznie większym rozmiarem oraz przyoczkami,
                Widoczne żądło (cecha kluczowa)..
              `,
    opisDod  : `<b>Rójka:</b> Początek sierpnia – koniec września
                <br><b>Zakładanie gniazda:</b> Półklasztorna - rójkowa królowa aktywnie poluje 
                podczas początkowego etapu życia kolonii (typowo prymitywna cecha). 
                Zdarza się, że królowe wracają do gniazda macierzystego.
                <br><b>Miejsce gniazdowania:</b> Wejście słabo widoczne, ukryte w ściółce.Tworzą płytkie, mało rozbudowane gniazda. Zdarza się, że większe kolonie utworzą mocniej rozbudowane gniazdo (o promieniu około 10 cm). 
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> Robotnice chodzą ostrożnie i bardzo powolnie, nie rzucają się w oczy. Pomimo tego gatunek jest drapieżny
                i nie praktykuje hodowli mszyc. Robotnice furażerują parami, jedna za drugą.

                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b> Rójkową królową zaleca się zaadoptować robotnicami 
                (ostrożnie, może być konieczne schłodzenie) bądź poczwarkami własnego gatunku.
                <br><b>Metody obrony:</b> ...
                <br><b>Posiada żądło:</b> tak
                <br><b>Ochrona gatunkowa</b> ...
                <br><b>Trudność hodowli</b> Gatunek trudny w hodowli, ponieważ jest słabo poznany i ciężko zapewnić im optymalne warunki. 
                Patrz: Rozwój i zimowanie. Wymagają ostrożnego dogrzewania.
                Gatunek wykazuje powolny rozwój, mrówki często zjadają jaja i larwy. Prawdopodobnie wymagają zimowania.
                <br><b>Liczebność:</b> Kolonie są niewielkie - od kilkunastu do kilkudziesięciu robotnic.

                `, 
});



const mrowka57 = new Mrowka({
    id       : 57,
    name     : "Solenopsis fugax",
    namePL   : "Mrówka złodziejka",
    rojPocz  : 34, // 21-IVmaja, 16 polowa kwietnia , 18 maj, 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni  : 39, // 39-IVwrześnia
    rozmQmin : 5,
    rozmQmax : 7,
    rozmRmin : 2,
    rozmRmax : 2,
    kolorQ   : ["Czarny"], //["Czarny", "Czarno-brązowy", "Brązowy", "Bursztynowy", "Rudy", "Czerwony", "Pomarańczowy", "Żółty"] 
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `Czarny, błyszczący; żółtawy spód odwłoka. Tułów i głowa dużo węższe od odwłoka. Jasne odnóża.
              `,
    opisDod  : `<b>Rójka:</b> połowa sierpnia – koniec września
                <br><b>Zakładanie gniazda:</b> Klasztorny.
                <br><b>Miejsce gniazdowania:</b> Najczęściej zakłada kolonie w...
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> ...

                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b> W przypadku osierocenia - Solenopsis fugax.
                <br><b>Metody obrony:</b> ...
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> ...
                <br><b>Trudność hodowli</b> ...
                <br><b>Liczebność:</b> ...
                <br><b>Ciekawostki:</b> Należy obserwować, czy królowa w ciągu kilku dni od 
                złapania zaczęła czerwić - jeśli nie, może wymagać przezimowania 
                (jest to spowodowane późną rójką tego gatunku).
                Gatunek praktykuje lestobiozę w gniazdach hurtnic – specjalnie ukształtowane
                formikarium pozwala na obserwacje podjadania potomstwa. 
                Gniazdo musi posiadać dwie części połączone bardzo cienkimi korytarzami oraz
                oddzielne areny dla złodziejek i hurtnic. W hodowli są wybitnie mięsożerne.
                `, 
});

const mrowka58 = new Mrowka({
    id       : 58,
    name     : "Strongylognathus testaceus",
    namePL   : "Sierpnica płowa",
    rojPocz  : 27, // 27 I lipiec
    rojKoni  : 35, // 35-IVsierpnia
    rozmQmin : 3,
    rozmQmax : 4,
    rozmRmin : 2,
    rozmRmax : 2,
    kolorQ   : ["Brązowy"], //["Czarny", "Czarno-brązowy", "Brązowy", "Bursztynowy", "Rudy", "Czerwony", "Pomarańczowy", "Żółty"] 
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `Sierpowate żuwaczki. Głowa z „rogami”. Kształt ciała nie do pomylenia.
                Przypomina dużą robotnicę murawki.
              `,
    opisDod  : `<b>Rójka:</b> lipiec - sierpień
                <br><b>Zakładanie gniazda:</b> Pasożyt (inkwilin).
                <br><b>Miejsce gniazdowania:</b> Najczęściej zakłada kolonie w...
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> ...

                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b> Tetramorium caespitum – pełna kolonia wraz z królową.
                Adopcję przeprowadza się w dwóch etapach:
                    <br>- lodówkowa adopcja rójkowej królowej sierpnicy, rójkowej królowej Tetramorium caespitum (murawki) i kilku młodych robotnic murawki,
                    <br>- dorzucenie kilkuset poczwarek murawki.
                    <br>Obydwie królowe tolerują się nawzajem i równocześnie produkują potomstwo. Robotnice sierpnicy nie są zdolne do prac w gnieździe.
                <br><b>Metody obrony:</b> ...
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> ...
                <br><b>Trudność hodowli</b> ...
                <br><b>Liczebność:</b> ...
                <br><b>Ciekawostki:</b> Bardzo rzadka mrówka, praktykuje inkwilinizm. 

                `, 
});


const mrowka59 = new Mrowka({
    id       : 59,
    name     : "Tapinoma erraticum",
    namePL   : "Koczowniczka czarna",
    rojPocz  : 22, // 22 Iczerwiec, 27 lipiec, 31 sierpień
    rojKoni  : 30, // 34-IVlipca
    rozmQmin : 5,
    rozmQmax : 6,
    rozmRmin : 3,
    rozmRmax : 4,
    kolorQ   : ["Czarny", "Czarno-brązowy"], //["Czarny", "Czarno-brązowy", "Brązowy", "Bursztynowy", "Rudy", "Czerwony", "Pomarańczowy", "Żółty"] 
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `Ciemnoszara. Budową ciała przypomina Lasius brunneus, ma jednak inny kształt głowy,
                jest ciemniejsza, dużo mniejsza i nie posiada łuski pomostkowej.
              `,
    opisDod  : `<b>Rójka:</b> czerwiec - lipiec
                <br><b>Zakładanie gniazda:</b> Klasztorny.
                <br><b>Miejsce gniazdowania:</b> Gniazda są zbudowane z systemu korytarzy pod ziemią,
                 często pod kamieniami; czasem występuje niewielki kopiec.
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> ...

                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b> Zalecana adopcja poczwarek lub robotnic do samotnej królowej.
                <br><b>Metody obrony:</b> Mrówki nie posiadają żądła - w razie potrzeby spryskują
                przeciwnika kwasem, jednak robią to niechętnie.
                <br><b>Posiada żądło:</b> nie
                <br><b>Ochrona gatunkowa</b> ...
                <br><b>Trudność hodowli</b> Gatunek umiarkowanie trudny w hodowli - mrówki 
                są wrażliwe na wahania wilgotności, szczególnie jej nadmiar.
                Jeżeli warunki nie są odpowiednie, zjadają potomstwo.
                Należy pamiętać o podawaniu drobnych owadów (podstawa diety), np. muszek owocowych.
                <br><b>Strategia hodowli:</b> Najprościej rozpocząć hodowlę przez odłowienie królowej
                i orszaku robotnic z poliginicznego gniazda, np. umieszczonego pod kamieniem.
                W przypadku rójkowych królowych: wychów klasztorny, preferowane połączenie wielu
                królowych lub adopcja.
                <br><b>Liczebność:</b> Kilkaset do kilku tysięcy robotnic.
                <br><b>Ciekawostki:</b> Bardzo rzadka mrówka, poliginiczna. Poczwarki nigdy nie
                wytwarzają oprzędu, dzięki czemu gniazdo można odróżnić od gniazda stosunkowo 
                podobnych, aczkolwiek nieco większych Lasius niger.
                Gatunek poliginiczny, w gnieździe może być nawet kilkanaście czerwiących królowych.
                `, 
});

const mrowka60 = new Mrowka({
    id       : 60,
    name     : "Temnothorax crassispinus",
    namePL   : "wysmuklica",
    rojPocz  : 22, // 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni  : 35, // 35-IVsierpnia
    rozmQmin : 4,
    rozmQmax : 5,
    rozmRmin : 2,
    rozmRmax : 3,
    kolorQ   : ["Brązowy", "Bursztynowy", "Pomarańczowy", "Żółty" ], //["Czarny", "Czarno-brązowy", "Brązowy", "Bursztynowy", "Rudy", "Czerwony", "Pomarańczowy", "Żółty"] 
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `Mała. Jasnobrązowa. Podwójny stylik. Smukła.
                Odwłok jaśniejszy od reszty ciała, z jasną plamą na przodzie i ciemnym pasem.
              `,
    opisDod  : `<b>Rójka:</b> czerwiec – koniec sierpnia
                <br><b>Zakładanie gniazda:</b> Klasztorny.
                <br><b>Miejsce gniazdowania:</b> Najczęściej zakłada kolonie w...
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> ...

                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b> W przypadku osierocenia - Temnothorax crassispinus.
                <br><b>Metody obrony:</b> ...
                <br><b>Posiada żądło:</b> ...
                <br><b>Ochrona gatunkowa</b> ...
                <br><b>Trudność hodowli</b> ...
                <br><b>Liczebność:</b> małe kolonie do 200 robotnic.
                <br><b>Ciekawostki:</b> Królową wraz z potomstwem łatwo dobyć przeszukując
                spróchniałe drewno, kępki mchu lub żołędzie. Mrówka bardzo ciekawa z uwagi
                na „niewidzialność” - z powodzeniem można ją trzymać z innymi mrówkami, 
                najlepiej pierwomrówkami lub gmachówkami. Temnothorax crassispinus posiada
                kilka bardzo podobnych do siebie gatunków bliźniaczych.

                `, 
});


const mrowka61 = new Mrowka({
    id       : 61,
    name     : "Tetramorium caespitum",
    namePL   : "Murawka darniowiec",
    rojPocz  : 22, // 22 czerwiec, 27 lipiec, 31 sierpień
    rojKoni  : 35, // 35-IVsierpnia
    rozmQmin : 0,
    rozmQmax : 0,
    rozmRmin : 0,
    rozmRmax : 0,
    kolorQ   : ["Czarny"], //["Czarny", "Czarno-brązowy", "Brązowy", "Bursztynowy", "Rudy", "Czerwony", "Pomarańczowy", "Żółty"] 
    KolorR   : null, //["Czarny", "Czerwony", "Pomarańczowy", "Żółty"]
    opis     : `Podwójny stylik. Smukła, Błyszcząco czarna. Dość nieduża..
              `,
    opisDod  : `<b>Rójka:</b> początek czerwca – koniec sierpnia (jedne z pierwszych po gmachówkach)
                <br><b>Zakładanie gniazda:</b> Klasztorny.
                <br><b>Miejsce gniazdowania:</b> Najczęściej zakłada kolonie w...
                <br><b>Żywienie:</b> ...
                <br><b>Zachowanie</b> Mrówka odważna i wojownicza. Nie należy jej łączyć na arenie
                z żadnym innym gatunkiem ponieważ Tetramorium caespitum szybko zajmie się eliminowaniem 
                konkurencji.
                <br><b>Polimorfizm:</b> ...
                <br><b>Adopcja:</b> W przypadku osierocenia - Tetramorium caespitum.
                <br><b>Metody obrony:</b> ...
                <br><b>Posiada żądło:</b> tak
                <br><b>Ochrona gatunkowa</b> ...
                <br><b>Trudność hodowli</b> Gatunek banalnie prosty w hodowli, polecany dla 
                początkujących. Bardzo szybko się rozmnaża.
                <br><b>Liczebność:</b> W dorosłej koloni może być maksymalnie 50 000 osobników.
                <br><b>Ciekawostki:</b> Częsta i prosta w hodowli mrówka. Niewielkie rozmiary 
                i ciekawy wygląd robotnic mogą być urozmaiceniem domowej hodowli. 
                Chętnie żywi się nasionami, szczególnie zbóż, ryżu i np. dmuchawca. 
                Poczwarki nie wytwarzają kokonów.
                Mrówki Tetramorium caespitum posiadają żądło, które jest zbyt słabe by przebić 
                skórę człowieka.
                `, 
});




//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------


//Arkusz do danych wejściowych
const wzorzecWyszukiwania = {
    rojka       : null,    // termin rójki
    rozmiarQ    : null,    // rozmiar królowej
    kolorQ      : null,    // kolor królowej
    rozmiarR    : null,    // rozmiar robotnicy
    kolorR      : null,    // kolor robotnicy
}

//-----------------------------------------------------------------------------

//po wywołaniu, przeszukam wszytkie kontrolki i uzupełnie podane dane.
function pobierajDaneDoWzorca() {
    //wzorzecWyszukiwania.rojka = terminRojki.options.week;
    wzorzecWyszukiwania.rojka = terminRojki.week;
//debugger;
    const form = document.getElementById('dateForm');

    const formRozmQ = form.querySelector('[name="inputRozmiarQ"]');
    const rozmQ = formRozmQ.options[formRozmQ.selectedIndex].value;
    wzorzecWyszukiwania.rozmiarQ = (rozmQ == "--") ? null : rozmQ;

    const formKolorQ = form.querySelector('[name="inputKolorQ"]');
    const kolorQ = formKolorQ.options[formKolorQ.selectedIndex].value;
    wzorzecWyszukiwania.kolorQ = (kolorQ == "--") ? null : kolorQ;

    const formRozmR = form.querySelector('[name="inputRozmiarR"]');
    const rozmR = formRozmR.options[formRozmR.selectedIndex].value;
    wzorzecWyszukiwania.rozmiarR = (rozmR == "--") ? null : rozmR;

    const formKolorR = form.querySelector('[name="inputKolorR"]');
    const kolorR = formKolorR.options[formKolorR.selectedIndex].value;
    wzorzecWyszukiwania.kolorR = (kolorR == "--") ? null : kolorR;

//console.log(wzorzecWyszukiwania);
}

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------



//const kopiaTabMrowek = tabMrowek.slice(); //kopiowanie tablicy
//console.log(tabMrowek);
//console.log(kopiaTabMrowek);


const przyznaniePunktow = function() {
    pobierajDaneDoWzorca();
    const wz = wzorzecWyszukiwania;

    tabMrowek.forEach( el => el.punkty = 0);    //zerowanie licznika przed dodaniem nowych punktow
    tabMrowek.forEach( el => el.analizowac = true);
    // for(let i=0; i<tabMrowek.length; i++) {
    //      tabMrowek[i].punkty =0;
    // }
//debugger;
    if(wz.rojka != null ) {
        tabMrowek.forEach( el => {
            if(el.rojkaPoczatek   <= wz.rojka && wz.rojka <= el.rojkaKoniec)   el.punkty+=10;
            if(el.rojkaPoczatek-1 == wz.rojka || wz.rojka == el.rojkaKoniec+1) el.punkty+=4;
            if(el.rojkaPoczatek-2 == wz.rojka || wz.rojka == el.rojkaKoniec+2) el.punkty+=1;
        });
    }
    
    if(wz.rozmiarQ != null ) {
        tabMrowek.forEach( el => {
            if(     el.rozmQmin   <= wz.rozmiarQ && wz.rozmiarQ <= el.rozmQmax)   el.punkty+=10;
            else if(el.rozmQmin-1 == wz.rozmiarQ || wz.rozmiarQ == el.rozmQmax+1) el.punkty+=1;
            else el.analizowac = false;
        });
    }

    if(wz.kolorQ != null ) {
        tabMrowek.forEach( el => {
            if(el.kolorQ[0] == wz.kolorQ || el.kolorQ[1] == wz.kolorQ  || el.kolorQ[2] == wz.kolorQ  || el.kolorQ[3] == wz.kolorQ)
               el.punkty+=10;
            else el.analizowac = false;
        });
    }

    if(wz.rozmiarR != null ) {
        tabMrowek.forEach( el => {
            if(     el.rozmRmin   <= wz.rozmiarR && wz.rozmiarR <= el.rozmRmax)   el.punkty+=10;
            else if(el.rozmRmin-1 == wz.rozmiarR || wz.rozmiarR == el.rozmRmax+1) el.punkty+=1;
            else el.analizowac = false;
        });
    }

    if(wz.kolorR != null ) {
        tabMrowek.forEach( el => {
            //if(el.kolorR[0] == wz.kolorR || el.kolorR[1] == wz.kolorR )   el.punkty+=10;
            if(el.kolorR == wz.kolorR )   el.punkty+=10;
            else el.analizowac = false;
        });
    }

//console.log(wz);
//console.log(tabMrowek);

};


const selekcjaMrowek = function() {
//debugger;
    const tabWybraneMrowki = [];

    for(let i=0; i<tabMrowek.length; i++) {
        if(tabMrowek[i].analizowac && tabMrowek[i].punkty >0 )
        {
            tabWybraneMrowki.push(tabMrowek[i]);
        }
    }

//console.log(tabWybraneMrowki);

    if(tabWybraneMrowki.length > 1)
    {
        for(let j=0; j<tabWybraneMrowki.length-1; j++) {    //sortowanie  bombelkowe
            for(let i=0; i<tabWybraneMrowki.length-1; i++) {
                let kopiaElementu = tabWybraneMrowki[i];
                if(tabWybraneMrowki[i+1].punkty > tabWybraneMrowki[i].punkty) {
                    tabWybraneMrowki[i] = tabWybraneMrowki[i+1];
                    tabWybraneMrowki[i+1] = kopiaElementu;
                }
            }
        }

    }

    return tabWybraneMrowki;
};




//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------


const operacjePorownaniaISzukania = function() {

    przyznaniePunktow();
    const tabM = selekcjaMrowek();
//console.log("operacjePorownaniaISzukania");
//console.log(tabM);

    const $mrowkaContener = $('.mrowkaContener');
    $mrowkaContener.remove();   //usuwam (czyszcze) listę

    const $mrowkiList = $('.mrowki-list');
    $mrowkiList.text ( `Ilość mrówek pasujących do klucza: ${tabM.length}`); 

    tabM.forEach(function(tabM, i) {
        const $cnt = $(tabM.divContener).hide(); //przypisuje i ukrywam
        $mrowkiList.append($cnt);
        $cnt.delay(500*i).slideDown(1000); 

        $( tabM.divOpisDod ).slideUp( "fast" );

        $(`.button-mrowka${tabM.id}`).on('click', function(){
            
            $( tabM.divOpisDod ).slideToggle( "slow", function() {
                if ( $( tabM.divOpisDod ).is( ":hidden" ) ) {
                    tabM.btn.innerText = "Pokaż więcej"; 
                  } else {
                    tabM.btn.innerText = "Ukryj szczegóły"; 
                  }
            });
            //albo to poniżej, ale bez animacji:
            // if (document.querySelector(".opisy-rozwijany").classList.contains("opisy-rozwijany-hide")) {
            //     tabM.divOpisDod.classList.remove('opisy-rozwijany-hide');
            //     tabM.btn.innerText = "Ukryj szczegóły"; 
            // } else {
            //     tabM.divOpisDod.classList.add('opisy-rozwijany-hide');
            //     tabM.btn.innerText = "Pokaż więcej"; 
            // }
        });
    })
}


    // this.divContener.appendChild(this.btn);
    // this.divOpisDod = document.createElement('div');
    // this.divOpisDod.classList.add(`opis-rozwijany${this.id}`);

    
    // const obslugaPrzycisku = $(`button-mrowka${this.id}`).click(function() {
    //     console.log(`Wykonal sie ten przycisk ${this.id}`);
    //     $( `this.opisDodatkowy` ).slideToggle( "slow" );
    //     });


//aktualizacja danych po kliknięciu w pole-wejsc
const akcjaWejsc = document.querySelector('.pole-wejsc');
//akcjaWejsc.onclick = operacjePorownaniaISzukania; //ustawienie funkcji



$('.bSzukaj').on('click', function(){
    operacjePorownaniaISzukania();
});




const listaMrowek = document.querySelector(".mrowki-list"); //miejsce w HTML

// const przycisk2 = document.querySelector('.bButton2');
// przycisk2.onclick = function() {
//     console.log("Klik2");
//     listaMrowek.appendChild(mrowka2.divContener);
// };

const infoIloscMrowekWBazie = document.querySelector(".informacje-wielkosc-bazy");
infoIloscMrowekWBazie.innerText = `Ilość mrówek w bazie: ${tabMrowek.length}`;  



const ladujElementy = function() {
    kontrolkiWiekosci();
};

document.addEventListener("DOMContentLoaded", ladujElementy)

