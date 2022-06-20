/*
WLTablet - базовый скрипт работы с "таблеткой"
Установка:
 1.Копируем этот файл (WLTablet.js) в папку /wlmillconfig/script/include
 2.Подключаем,  добавляя в MScript.
   function init()
   {
   SCRIPT.includeFile("/include/WLTablet.js")
   ....	   
   }
 2.1 Необходимо поместить иконки скрипта в папку wlmillconfig/icons  
   
 3. По умолчанию скрипт WLTablet.js устанавливает вызовы своих функций на кнопку WLTABLETBUTTON		
    в функции WLTabletInitButton().  
 4. Все настройки хранятся в файле WLTablet.ini. Если его нет, то он будет создан при инициализации скрипта. 

25/11/2021 - первый релиз
14/01/2022 - добавлено подтверждение отключения крокодила

WLTabletZ0Dialog() - Поиск высоты изделия. 

*/
//Tablet
var WLTabletF1Probe	 =  100 //скорость первого касания в мм/мин для замера инструмента
var WLTabletF2Probe  =  20  //скорость второго касания в мм/мин для замера инструмента
var WLTabletBackDist =  2   //расстояние отхода для второго касания для замера инструмента
var WLTabletHeight   =  20  //высота "таблетки" для замера высоты заготовки
var WLTabletSDStop   =  0   //включение(1)/выключение(0) плавной остановки


function WLTabletInit()
{
WLTabletInitButton(TOOLBAR1)
WLTabletInitValue();
}

function WLTabletInitButton(BAR)
{
BAR.addButton("WLTABLETBUTTON")	

WLTABLETBUTTON.setShow(1);
//WLTABLETBUTTON.setIconFrom(WLTabletPath+"WLTabletZ0.png")
WLTABLETBUTTON.setIcon("WLTabletZ0.png")//из папки wlmillconfig/icons
WLTABLETBUTTON.setToolTip("Замер положения заготовки")
WLTABLETBUTTON.setScript("WLTabletZ0Dialog()");
}


function WLTabletInitValue()
{		
WLTabletF1Probe =FILE.loadValue(WLTabletFileINI,"F1Probe" ,WLTabletF1Probe);
WLTabletF2Probe =FILE.loadValue(WLTabletFileINI,"F2Probe" ,WLTabletF2Probe);
WLTabletBackDist=FILE.loadValue(WLTabletFileINI,"BackDist",WLTabletBackDist); 
WLTabletHeight  =FILE.loadValue(WLTabletFileINI,"Height"  ,WLTabletHeight); 
WLTabletSDStop  =FILE.loadValue(WLTabletFileINI,"SDStop"  ,WLTabletSDStop); 

MACHINE.setF1GProbe(WLTabletF1Probe)	
MACHINE.setF2GProbe(WLTabletF2Probe)	
MACHINE.setBackDistGProbe(WLTabletBackDist)
MACHINE.setSDStopGProbe(WLTabletSDStop)

FILE.saveValue(WLTabletFileINI,"F1Probe" ,WLTabletF1Probe);
FILE.saveValue(WLTabletFileINI,"F2Probe" ,WLTabletF2Probe);
FILE.saveValue(WLTabletFileINI,"BackDist",WLTabletBackDist); 
FILE.saveValue(WLTabletFileINI,"Height" , WLTabletHeight);  
FILE.saveValue(WLTabletFileINI,"SDStop"  ,WLTabletSDStop); 
}

function WLTabletCheckInProbe()
{
while(MACHINE.getInProbe()){	
	if(!DIALOG.question("Датчик inProbe не включен. Включите.")) return 0;
    }	

return 1	
}


function WLTabletZ0(Z,Dist) //поиск высоты заготовки
{
WLTabletInitValue()

if(WLTabletCheckInProbe()==0) return 0	
	
MACHINE.clearGProbe();
MACHINE.enableDoubleGProbe(1);

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")


MACHINE.runGCode("G53G90G0Z"+(Z+Dist))	
while(MACHINE.isActiv()) SCRIPT.process()
  
DIALOG.question("Подсоедините датчик-таблетку.");
if(DIALOG.isCancel()) return 0;  

MACHINE.addGProbeZ(X,Y,Z,Dist);

MACHINE.goGProbe();
while(MACHINE.isActiv()) SCRIPT.process()

DIALOG.question("Отсоедините датчик-таблетку.");

Z=MACHINE.getGProbe(0,"Z")

var Z0=MACHINE.getGProbeSC(0,"Z")-WLTabletHeight;

SCRIPT.console("WLTabletZ0 Z(G53)="+Z.toFixed(3))

Z0=DIALOG.enterNum("Z0= "+Z0.toFixed(3)+" Принять найденное Z(текущей СК)= ",0);
  
if(DIALOG.isOk())
	   MACHINE.setCurPositionSC("Z",MACHINE.getCurPosition("Z")-Z+WLTabletHeight+Z0);

return Z;
}

function WLTabletZ0Dialog() //поиск высоты заготовки, диалог
{
var Dist=20
var Z

if(WLTabletCheckInProbe()==0) return 0	
	
Z=MACHINE.getCurPosition("Z")

Dist=FILE.loadValue(WLTabletFileINI,"Z0Dialog/Dist",Dist);

Dist=DIALOG.enterNum("Введите дистанцию поиска:",Dist)
if(DIALOG.isCancel()) return 0;  

FILE.saveValue(WLTabletFileINI,"Z0Dialog/Dist",Dist);

return WLTabletZ0(Z-Dist,Dist)
}

