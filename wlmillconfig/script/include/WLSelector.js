/*
WLSelector - пример работы с селектором (делителем напряжения, с фиксированными положенями)

Установка:
1.Создаём функцию обработчика положения в скрипте WLScript
 
function updateSelectorF() //установка значения корректора F
{
var   select=12  //количество положений селектора
var      ain=4   //номер аналогового входа
var     data=[0,0.5,1,2,5,10,15,25,50,75,100,125,150] //значения которые будем устанавливать.

value=Math.round(MACHINE.getAIn(ain)* select)

MACHINE.setPercentF(data[value])
}

2. Добавляем вызов функции п1 в функцию ON()

function ON() 
{
SCRIPT.setInterval("updateSelectorF()",200) //каждые 200мс
//....
}

3. Добававляем отмену вызова п2 в функцию OFF()

function OFF() 
{
SCRIPT.clearInterval();
//....
}

*/