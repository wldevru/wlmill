var iM=5
var posSetTool={X:5,Y:20,Z:20}
var posChTool={X:-5,Y:50,Z:50}


//задержка
function DELAY(ms)
{
TIMER.restart(10);
while(TIMER.getCount(10)<ms); 
}

function WAIT(a)
{
DELAY(100)
return a
}

function M6()
{
}

function M7()
{
//MACHINE.setOutput(2,1); //включаем охлаждение 1
}

function M8()
{
//MACHINE.setOutput(3,1); //включаем охлаждение 2
}

function M9()
{
//MACHINE.setOutput(2,0); //выключаем охлаждение 1
//MACHINE.setOutput(3,0); //выключаем охлаждение 2
}


//функция включения шпинделя по часовой стрелке
//у нужной сторки необходимо убрать комментарий шпинделя
function M3()
{
//DIALOG.message("M3 шпиндель включен!",0); //пример сообщения
//MACHINE.enableSOut(1);  //пример включения аналогового или ШИМ(PWM) выхода
//MACHINE.setOutput(1,1); //пример включения дискретным выходом
return 1;
}

function M4()
{
return 1;
}

//функция выключения шпинделя
function M5()
{
//DIALOG.message("M5 шпиндель выключен!",0); //	
//MACHINE.enableSOut(0);  //пример включения аналогового или ШИМ(PWM) выхода
//MACHINE.setOutput(1,0); //пример включения дискретным выходом
return 1;
}


function M30()
{
DIALOG.message("M30 конец программы!",0);
}

//исполняется при включении станка 
//нажатия на кнопку в WLMill)
function ON()
{
}

//исполняется при выключении станка
//(отжатия кнопки в WLMill)
function OFF()
{
}

function RESET()
{
M5()
}

function startCurGProgram()
{
if( !MACHINE.isRunGProgram()){ //если программа не запущена
 MACHINE.runGProgram(0);
 }
}

function initStartButton()
{
TOOLBAR2.addButton("MYSTARTBUTTON")
MYSTARTBUTTON.setShow(1);
MYSTARTBUTTON.setIcon("play.png")
MYSTARTBUTTON.setText("startGProgram")
MYSTARTBUTTON.setToolTip("Start current GProgram")
MYSTARTBUTTON.setScript("startCurGProgram()")
//MYSTARTBUTTON.setShortcut("F2") //горячая клавиша
}

function toG28()
{
 if(!MACHINE.isActiv()
&&!MACHINE.isRunGProgram())
 { 
 MACHINE.runGCode("G91 G28 Z0") 
 MACHINE.runGCode("G91 G28 X0 Y0")
 MACHINE.runGCode("G90")
 }
}

function initG28Button()
{
TOOLBAR2.addButton("G28BUTTON")

G28BUTTON.setShow(1);
G28BUTTON.setText("G28")
G28BUTTON.setToolTip("G28 Z0\n\rG28 X0 Y0\n\rG28 A0 B0 C0")
G28BUTTON.setScript("toG28()")
//G28BUTTON.setShortcut("F2") //горячая клавиша
}

//исполняется при инициализации скриптов
function init() 
{
//Добавление кнопки быстрого запуска программы	
//initStartButton() 

//Добавление кнопки перехода в G28
//initG28Button();  // при необходимости закомментировать
	
SCRIPT.includeFile("/include/WLProbe.js")
SCRIPT.includeFile("/include/WLTablet.js")
SCRIPT.includeFile("/include/WLTool.js")
}
