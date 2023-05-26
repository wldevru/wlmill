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
SCRIPT.includeFile("/include/WLToolOffset.js")

WLMILL.addTabQML("wlprobe/WLProbe.qml")
}
