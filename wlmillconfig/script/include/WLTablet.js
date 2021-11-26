
/*
WLTablet - базовый скрипт работы с "таблеткой"
Установка:
 1.Копируем этот файл (WLTablet.js) в папку /wlmillconfig/script/include
 2.Подкллчаем,  добавляя в MScript.
   function init()
   {
   SCRIPT.includeFile("/include/WLTablet.js")
   ....	   
   }
 3. По умолчанию скрипт WLTablet.js устанавливает вызовы своих функций на кнопку buttonUserFunc2 
    в функции WLTablet().  

25/11/2021 - первый релиз
*/
//Tablet
var WLTabletF1Probe  =  100 //скорость первого касания в мм/мин для замера инструмента
var WLTabletF2Probe  =  20  //скорость второго касания в мм/мин для замера инструмента
var WLTabletBackDist =  2   //расстояние отхода для второго касания для замера инструмента
var WLTabletHeight   =  20  //высота "таблетки" для замера высоты заготовки
var WLTabletSDStop   =  0//включение плавной остановки


function WLTabletInit()
{
var button=buttonUserFunc2

button.setVisible(1);
button.setIcon("WLTabletZ0.png")
button.setToolTip("WLTabletZ0Dialog()")
button.setScript("WLTabletZ0Dialog()");

WLTabletInitValue();
}


function WLTabletInitValue()
{		
WLTabletF1Probe =FILE.loadValue(WLTabletFileINI,"F1Probe" ,WLTabletF1Probe);
WLTabletF2Probe =FILE.loadValue(WLTabletFileINI,"F2Probe" ,WLTabletF2Probe);
WLTabletBackDist=FILE.loadValue(WLTabletFileINI,"BackDist",WLTabletBackDist); 
WLTabletHeight  =FILE.loadValue(WLTabletFileINI,"Height"  ,WLTabletHeight); 
WLTabletSDStop  =FILE.loadValue(WLTabletFileINI,"SDStop"  ,WLTabletSDStop); 

MACHINE.setF1GProbe(WLTabletF1Probe)	
MACHINE.setF2GProbe(WLTabletF1Probe)	
MACHINE.setBackDistGProbe(WLTabletBackDist)
MACHINE.setSDStopGProbe(WLTabletSDStop)

FILE.saveValue(WLTabletFileINI,"F1Probe" ,WLTabletF1Probe);
FILE.saveValue(WLTabletFileINI,"F2Probe" ,WLTabletF2Probe);
FILE.saveValue(WLTabletFileINI,"BackDist",WLTabletBackDist); 
FILE.saveValue(WLTabletFileINI,"Height" , WLTabletHeight);  
FILE.saveValue(WLTabletFileINI,"SDStop"  ,WLTabletSDStop); 
}

function WLTabletZ0(Z,Dist) //поиск высоты заготовки
{
WLTabletInitValue()

MACHINE.clearGProbe();
MACHINE.enableDoubleGProbe(1);

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")

MACHINE.addGProbeZ(X,Y,Z,Dist);

MACHINE.goGProbe();
while(MACHINE.isActiv());

Z=MACHINE.getGProbe(0,"Z")

SCRIPT.console("WLTabletZ0 Z="+Z.toFixed(3))

MACHINE.setCurPositionSC("Z",MACHINE.getCurPosition("Z")-Z+WLTabletHeight);

return Z;
}

function WLTabletZ0Dialog() //поиск высоты заготовки, диалог
{
var Dist=20
var Z

Z=MACHINE.getCurPosition("Z")

Dist=FILE.loadValue(WLTabletFileINI,"Dialog/Dist",Dist);

DIALOG.enterNum("Введите дистанцию поиска:",Dist)
while(DIALOG.isShow());

if(DIALOG.isOk()&&DIALOG.getNum()) 	
  Dist=DIALOG.getNum();
else
  return

FILE.saveValue(WLTabletFileINI,"Dialog/Dist",Dist);

WLTabletZ0(Z-Dist,Dist)
}

