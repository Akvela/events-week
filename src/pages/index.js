import './index.scss';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'] 
const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// парсим начальный массив событий 
const arr = JSON.parse(document.querySelector('.table').dataset.arr); 

const date = new Date();
const currentDay = date.getDate(); // сегодняшнее число
const indexDay = date.getDay(); // индекс сегодняшнего дня недели
const indexMonth = date.getMonth(); // индекс текущего месяца
const year = date.getFullYear(); // текущий год
const startWeek = new Date(); // начало недели
const endWeek = new Date(); // конец недели
const dayPrevMaximum = new Date(); // переменная для дня месяц назад
const dayNextMaximum = new Date(); // переменная для дня месяц вперед

const title = document.getElementById('title')
const buttonPrev = document.getElementById('prev');
const buttonNext = document.getElementById('next');
const trs = document.getElementsByTagName('tr');
const loader = document.querySelector('.loader');
const titlesColumns = document.querySelectorAll('.title-col');


// получить время для нужного подсчета разницы дней
function dateoffset(days, flag) { 
  if (flag === 'true') {
    return (24*60*60*1000) * (6 - days);
  } else {
    return (24*60*60*1000) * days;
  }
}

date.setHours(0, 0, 0, 0);
startWeek.setHours(0, 0, 0, 0);
endWeek.setHours(23, 59, 59, 999);
startWeek.setTime(startWeek.getTime() - dateoffset(indexDay)); // устанавить дату начала недели
endWeek.setTime(endWeek.getTime() + dateoffset(indexDay, 'true')); // устанавить дату конца недели
dayPrevMaximum.setTime(dayPrevMaximum.getTime() - dateoffset(30)); // начало недель
dayNextMaximum.setTime(dayNextMaximum.getTime() + dateoffset(30)); // конец недель

// узнать количество дней в месяце
function daysInMonth(month, year) { 
  return new Date(year, month, 0).getDate();
}

// окрашивает столбец с текущим днем
function getCurrentColumn() { 
  if (((startWeek <= date) && (endWeek >= date))) {
      for (let i = 1; i < trs.length; i++) {
        const str = trs[i].getElementsByTagName('td')
        str[indexDay].style.backgroundColor = 'rgba(174, 217, 203, .8)';
      }
  } 
}

// обновление дат недели
function updateTitle() { 
  title.textContent = ` ${startWeek.getDate()} ${months[startWeek.getMonth()]} - ${endWeek.getDate()} ${months[endWeek.getMonth()]}, ${year}`;
}

// обновление статуса кнопки предыдущей недели 
function changeStateButtonPrev(startWeek) { 
  if (dayPrevMaximum > startWeek) {
    buttonPrev.classList.add('disabled');
  } else {
    buttonPrev.classList.remove('disabled');
  }
}

// обновление статуса кнопки следующей недели 
function changeStateButtonNext(endWeek) { 
  if (dayNextMaximum < endWeek) {
    buttonNext.classList.add('disabled');
  } else {
    buttonNext.classList.remove('disabled');
  }
}
 
// показ/скрытие лоадерс
function toggleStateButton() { 
  loader.classList.toggle('loader_active')
}

// показ предыдущей недели
const clickOnButtonPrev = () => { 
  toggleStateButton();

  // установить границы недели
  startWeek.setTime(startWeek.getTime() - dateoffset(7)); 
  startWeek.setHours(0, 0, 0, 0);
  endWeek.setTime(startWeek.getTime() + dateoffset(6));
  endWeek.setHours(23, 59, 59, 999);
  
  changeStateButtonPrev(startWeek);
  changeStateButtonNext(endWeek);

  updateTitle(); 
  initTable();
  getCurrentColumn();
  addEventsWeek();

  const indexMonth = startWeek.getMonth() + 1;
  const quantityDays = daysInMonth(indexMonth, year);
  let point = 0;

  // обновление заголовков дней недели 
  titlesColumns.forEach((title, index) => { 
    if ((quantityDays - (startWeek.getDate() + index)) < 0) {
      point = point + 1;
      title.textContent = `${week[index]} ${indexMonth + 1}/${point}`;
    } else {
      title.textContent = `${week[index]} ${indexMonth}/${startWeek.getDate() + index}`
    }
  })
  point = 0;

  toggleStateButton();
}

// показ следующей недели
const clickOnButtonNext = () => {
  toggleStateButton();

  // установить границы недели
  startWeek.setTime(startWeek.getTime() + dateoffset(7)); 
  startWeek.setHours(0, 0, 0, 0);
  endWeek.setTime(startWeek.getTime() + dateoffset(6));
  endWeek.setHours(23, 59, 59, 999);

  changeStateButtonPrev(startWeek);
  changeStateButtonNext(endWeek);

  updateTitle();
  initTable();
  getCurrentColumn();
  addEventsWeek();

  const indexMonth = startWeek.getMonth() + 1;
  const quantityDays = daysInMonth(indexMonth, year);
  let point = 0;

  // обновление заголовков дней недели 
  titlesColumns.forEach((title, index) => { 
    if (quantityDays < startWeek.getDate() + index) {
      point = point + 1;
      title.textContent = `${week[index]} ${indexMonth + 1}/${point}`;
    } else {
      title.textContent = `${week[index]} ${indexMonth}/${startWeek.getDate() + index}`
    }
  })
  point = 0;

  toggleStateButton();
}

// установить заголовки дней недели
titlesColumns.forEach((title, index) => {
  title.textContent = `${week[index]} ${indexMonth + 1}/${startWeek.getDate() + index}` 
})

function initTable() {
  const tds = document.getElementsByTagName('td');
  
  // удалить все существующие td ячейки
  if (tds.length > 0) { 
    for (let j = tds.length - 1; j >= 0; --j) {
      tds[j].remove();
    }
  }

  // вставить новые ячейки в таблицу
  for (let i = 1; i < trs.length; i++) { 
    const nodeTd = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
    trs[i].insertAdjacentHTML( 'beforeend', nodeTd );
  }
}

// конвертация строки в время
function timeStringToMinutes(timeStr) {
  const [hourStr, minuteStr, period] = timeStr.match(/\d+|am|pm/g);
  let hours = parseInt(hourStr, 10);

  if (period === 'pm' && hours !== 12) {
    hours += 12;
  }

  const minutes = parseInt(minuteStr, 10) || 0;
  return hours * 60 + minutes;
}

// разница во времени
function calculateTimeDifferenceInMinutes(timeStr1, timeStr2) {
  const minutes1 = timeStringToMinutes(timeStr1);
  const minutes2 = timeStringToMinutes(timeStr2);

  const difference = minutes2 - minutes1;

  return difference / 30;
}

function addEventsWeek() {
  arr.forEach(item => {
    const eventDate = new Date(item.date); 
    // дата мероприятия
    let indexDay = eventDate.getDay()

    
    if ((startWeek <= eventDate) && (endWeek >= eventDate)) {  
      // дата текущей недели
      const startRow = document.getElementById(item.timeStart);

      if (startRow.getElementsByTagName('td').length !== 7) {
        //уменьшить индекс, если ячеек меньше чем изначально
        indexDay = indexDay - 1;
      }

      // ячейка начала мероприятия
      const startEvent = startRow.getElementsByTagName('td')[indexDay]; 
      let count = 0;

      if (item.timeStart === 'all-day') {  
        // мероприятия на весь день
        count = 49;
        startEvent.textContent = `${item.timeStart}  ${item.title}`;
      } else { 
        // мероприятия на остальные временные слоты
        count = calculateTimeDifferenceInMinutes(item.timeStart, item.timeEnd);
        startEvent.textContent = `${item.timeStart} - ${item.timeEnd}   ${item.title}`;
      }
      
      // объединение временных слотов
      startEvent.setAttribute('rowspan', count); 
      startEvent.classList.add('card-event');
      
      startEvent.style.backgroundColor = item.color;

      if ((eventDate <= date)) {
        // добавление прозрачности прошедшим мероприятиям
        startEvent.style.opacity = .5; 
      }

      let idx = startRow.rowIndex;

      for (let i = 1; i < count; i++) {
        // удаление лишних ячейки
        const nextRow = startRow.parentNode.rows[ idx++ ];
        nextRow.getElementsByTagName('td')[indexDay].remove(); 
      }
    }
  })
}

buttonPrev.addEventListener('click', () => clickOnButtonPrev());
buttonNext.addEventListener('click', () => clickOnButtonNext());

toggleStateButton();
updateTitle();
initTable();
getCurrentColumn();
addEventsWeek();
toggleStateButton();