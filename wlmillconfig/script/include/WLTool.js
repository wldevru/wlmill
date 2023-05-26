/*
WLTool - базовый скрипт работы с инструментом

Установка:
 1.Копируем этот файл (WLTool.js) в папку /wlmillconfig/script/include
 2.Подключаем,  добавляя в MScript.
   function init()
   {
   SCRIPT.includeFile("/include/WLTool.js")
   ....	   
   }
 3. По умолчанию скрипт WLTool.js устанавливает вызовы своих функций на кнопку WLTOOLBUTTON
    в функции WLToolInitButton(BAR).
 4. Все настройки хранятся в файле WLTool.ini. Если его нет, то он будет создан при инициализации скрипта. 
 5. Если инструмент будет меняться вручную, то в скрипт M6() необходимо добавить
    function M6()
	{
	...	
	if(WLToolAutoHandReplace(1)==0)
                   MACHINE.reset()	
	}
	
25/11/2021 - первый релиз
13/01/2022 - исправлены ошибки
14/04/2022 - при автозамене инструмента изменено. 1 Если инстр. тот же то игнорируем замену.  2 один диалог вместо двух (установите инст.+ введите длину).
23/05/2022 - добавлен параметр    AutoSetG43H - автоустановка G43 после измерения длины инструмента
             добавлено сохранение последненго инструмента LastIndexT в файл WLTool.ini
20/06/2022 - исправлена ошибка. не учитывалась введёная длина при автозамере длины инструмента
             добавлено восстановление номера инструмента из скрипта 	
             добавлен флаг WLToolAlwaysHReplace - всегда переустанавливать инструмент (исполнение M6)			 


WLToolH(index,Dist)               - Измерение длины инструмента либо базового смещения (index=0,Dist - дистанция поиска) 
WLToolHDialog()                   - Измерение длины инструмента либо базового смещения
WLToolAutoHDialog(autoH)          - Измерение длины нструмента с перемещением в точку измерения. Перемещение в G53 Z0, перемещение по XY. 
WLToolHandReplaceDialog(autoH)  - Замена нструмента с перемещением в точку замены. Перемещение в G53 Z0, перемещение по XY.
                                    Если autoH = 1 то будет произведен замер длины после смены инструмента. Возвращает 1 в случае успеха.


UseTabletH - Использовать датчик-таблетку. - доп проверка перед измерением.
*/


//Tool
var WLToolF1Probe   =  250 //скорость первого касания в мм/мин для замера инструмента
var WLToolF2Probe   =  50  //скорость второго касания в мм/мин для замера инструмента
var WLToolBackDist  =  5   //расстояние отхода для второго касания для замера инструмента
var WLToolSDStop    =  0   //включение(1)/выключение(0) плавной остановки
var WLToolLastIndexT=  -1  //номер последнего инструмента
var WLToolUseTabletH=   1  //используется (1) или нет (0) датчик-таблетка. Нужно для подтверждения её работы (установки).
var WLToolFindDist  = 10  //расстояние поиска до предполаемой точки
var WLToolFindDist_A= -5   //расстояние поиска после

var WLToolAutoSetG43H = 1    //устанавливать G43H после измерений
var WLToolAlwaysHReplace= 1  //всегда переустанавливать инструмент

var WLToolLmin = 5     //минимальная длина инструмента
var WLToolLmax = 80    //максимальна длина инструмента 
                       //Если  WLToolLmin==0 и WLToolLmax==0 то перед измерением будет каждый раз запрашиваться примерная длинна инструмента. А значение по умолчанию будет браться из таблицы инструментов.
		   

function WLToolInit()
{
WLToolInitButton(TOOLBARTOOLS)
WLToolInitValue();

GCODE.setT(WLToolLastIndexT)
}

function WLToolInitButton(BAR)
{
BAR.addButton("WLTOOLBUTTON")	

WLTOOLBUTTON.setText("TOOL")
WLTOOLBUTTON.setIcon("WLTool.png")
WLTOOLBUTTON.setToolTip("Probe")

WLTOOLBUTTON.clearMenu() 
WLTOOLBUTTON.addButtonMenu("toolH","WLToolHDialog()","Замер длины инструмента")
WLTOOLBUTTON.addButtonMenu("AutoToolH","WLToolAutoHDialog()","Автоматический замер длины инструмента")
WLTOOLBUTTON.addButtonMenu("Replace Tool","WLToolAutoHandReplaceDialog()","Ручная замена инструмента")
}


function WLToolInitValue()
{		
WLToolF1Probe =FILE.loadValue(WLToolFileINI,"F1Probe" ,WLToolF1Probe);
WLToolF2Probe =FILE.loadValue(WLToolFileINI,"F2Probe" ,WLToolF2Probe);
WLToolBackDist=FILE.loadValue(WLToolFileINI,"BackDist",WLToolBackDist); 
WLToolSDStop  =FILE.loadValue(WLToolFileINI,"SDStop"  ,WLToolSDStop); 
WLToolUseTabletH=FILE.loadValue(WLToolFileINI,"UseTabletH"  ,WLToolUseTabletH); 
WLToolFindDist=FILE.loadValue(WLToolFileINI,"FindDist"  ,WLToolFindDist); 
WLToolFindDist_A=FILE.loadValue(WLToolFileINI,"FindDist_A"  ,WLToolFindDist_A); 
WLToolAutoSetG43H=FILE.loadValue(WLToolFileINI,"AutoSetG43H"  ,WLToolAutoSetG43H); 
WLToolLastIndexT=FILE.loadValue(WLToolFileINI,"LastIndexT"  ,WLToolLastIndexT); 
WLToolAlwaysHReplace=FILE.loadValue(WLToolFileINI,"AlwaysHReplace"  ,WLToolAlwaysHReplace); 


WLToolLmin=FILE.loadValue(WLToolFileINI,"Lmin",WLToolLmin); 
WLToolLmax=FILE.loadValue(WLToolFileINI,"Lmax",WLToolLmax); 

MACHINE.setF1GProbe(WLToolF1Probe)	
MACHINE.setF2GProbe(WLToolF2Probe)	
MACHINE.setBackDistGProbe(WLToolBackDist)
MACHINE.setSDStopGProbe(WLToolSDStop)

FILE.saveValue(WLToolFileINI,"F1Probe" ,WLToolF1Probe);
FILE.saveValue(WLToolFileINI,"F2Probe" ,WLToolF2Probe);
FILE.saveValue(WLToolFileINI,"BackDist",WLToolBackDist); 
FILE.saveValue(WLToolFileINI,"SDStop",WLToolSDStop); 
FILE.saveValue(WLToolFileINI,"UseTabletH"  ,WLToolUseTabletH); 
FILE.saveValue(WLToolFileINI,"FindDist"  ,WLToolFindDist); 
FILE.saveValue(WLToolFileINI,"FindDist_A"  ,WLToolFindDist_A); 
FILE.saveValue(WLToolFileINI,"AutoSetG43H"  ,WLToolAutoSetG43H); 
FILE.saveValue(WLToolFileINI,"LastIndexT"  ,WLToolLastIndexT); 
FILE.saveValue(WLToolFileINI,"AlwaysHReplace"  ,WLToolAlwaysHReplace); 

FILE.saveValue(WLToolFileINI,"Lmin",WLToolLmin); 
FILE.saveValue(WLToolFileINI,"Lmax",WLToolLmax); 

}

function WLToolIsUseLminmax()
{
WLToolLmin=FILE.loadValue(WLToolFileINI,"Lmin",WLToolLmin); 
WLToolLmax=FILE.loadValue(WLToolFileINI,"Lmax",WLToolLmax); 
	
if(WLToolLmin!=0
 ||WLToolLmax!=0)	
   return 1	
  else
   return 0
}

function WLToolCheckInProbe()
{
while(MACHINE.getInProbe()){	
	if(!DIALOG.question("Датчик inProbe не включен. Включите.")) return 0;
    }	

return 1	
}


function WLToolH(index,Ltool) //поиск высоты инструмента либо базового смещения (index=0) Ltool предпалагаема длина
{
WLToolInitValue()

if(WLToolCheckInProbe()==0) return 0	
	
var X=MACHINE.getCurPosition("X")
var Y=MACHINE.getCurPosition("Y")
var Z=0

if(index==0){
	Z=MACHINE.getCurPosition("Z")-WLToolFindDist
    }
    else{		

    if(WLToolIsUseLminmax()==0) 
		Z=FILE.loadValue(WLToolFileINI,"AutoHDialog/Z",Z)+Ltool
	   else
		Z=FILE.loadValue(WLToolFileINI,"AutoHDialog/Z",Z)+WLToolLmax   
	}

if(WLToolUseTabletH){
  MACHINE.runGCode("G53G90G0Z"+(Z+WLToolFindDist))	
  while(MACHINE.isActiv()) SCRIPT.process()
  
  DIALOG.question("Подсоедините датчик-таблетку.");
  if(DIALOG.isCancel()) return 0;  
  }
	
MACHINE.clearGProbe();
MACHINE.enableDoubleGProbe(1);

if(WLToolIsUseLminmax()==0
 ||index==0)
  MACHINE.addGProbeZ(X,Y,Z,WLToolFindDist,WLToolFindDist_A);
else
  MACHINE.addGProbeZ(X,Y,Z-WLToolLmax+WLToolLmin,WLToolLmax-WLToolLmin+WLToolFindDist);

SCRIPT.console("WLProbeToolH Z="+Z.toFixed(3)+"L="+Ltool) 

GCODE.push();

MACHINE.goGProbe();
while(MACHINE.isActiv()) SCRIPT.process()

GCODE.pop();

Z=MACHINE.getGProbe(0,"Z")

SCRIPT.console("WLProbeToolH Z="+Z.toFixed(3))

if(index==0)
	FILE.saveValue(WLToolFileINI,"AutoHDialog/Z",Z);	 
else
    {
	GCODE.setHTool(index,Z-FILE.loadValue(WLToolFileINI,"AutoHDialog/Z",Z));
	
	if(WLToolAutoSetG43H!=0)
       MACHINE.runGCode("G43H"+index)
	}
	
if(WLToolUseTabletH){
  DIALOG.question("Отсоедините датчик-таблетку.");
  if(DIALOG.isCancel()) return 0;  
  }	

return 1;
}

function WLToolHDialog() //поиск высоты инструмента либо базового смещения, диалог
{
var index=0
var Ltool=50
var Z=0

if(WLToolCheckInProbe()==0) return 0	

Z=MACHINE.getCurPosition("Z")

Ltool=FILE.loadValue(WLToolFileINI,"HDialog/Ltool",Ltool);
FILE.saveValue(WLToolFileINI,"HDialog/Ltool",Ltool);

index=GCODE.getValue("T")

if(index==0) index=1

index=DIALOG.enterNum("Введите номер инструмента:",index)
if(DIALOG.isCancel()) return 0;  

if(index==0)
 {
 DIALOG.question("Будет произведён замер смещения, продолжить?")
 if(DIALOG.isCancel()) return 0;  
/*
 DIALOG.question("Сохранить текущие X,Y для автоматической установки?")
 while(DIALOG.isShow());
 
 if(DIALOG.isOk()) 
   {
   FILE.saveValue(WLToolFileINI,"AutoHDialog/X",MACHINE.getCurPosition("X"));	
   FILE.saveValue(WLToolFileINI,"AutoHDialog/Y",MACHINE.getCurPosition("Y"));   
   }
*/
 }
 else
 {
 if(GCODE.getHTool(index)!=0) Ltool=GCODE.getHTool(index)
		 
 if(WLToolIsUseLminmax()==0) 
    {
    Ltool=DIALOG.enterNum("Введите предпалагаемую длину инструмента",Ltool,2)
    if(DIALOG.isCancel()) return 0;  
    }	 	 
 }

FILE.saveValue(WLToolFileINI,"HDialog/Ltool",Ltool);

return WLToolH(index,Ltool)
}

function WLToolAutoH(index,Ltool) 
{
var Dist=20
var enable=0
var X=0;
var Y=0;

enable=FILE.loadValue(WLToolFileINI,"AutoHDialog/enable",enable);
     X=FILE.loadValue(WLToolFileINI,"AutoHDialog/X",X);	
     Y=FILE.loadValue(WLToolFileINI,"AutoHDialog/Y",Y);	
	 
FILE.saveValue(WLToolFileINI,"AutoHDialog/enable",enable);
FILE.saveValue(WLToolFileINI,"AutoHDialog/X",X);	
FILE.saveValue(WLToolFileINI,"AutoHDialog/Y",Y);	 

if(WLToolCheckInProbe()==0) return 0	
	
if(Ltool<=0
&&!WLToolIsUseLminmax()) 
    {	
	SCRIPT.console("WLToolAutoH wrong Ltool="+Ltool)
	MACHINE.reset();
	return 0
	}
	
if(!enable) {
return 0
}
else
{
SCRIPT.console("WLToolAutoH X="+X+" Y="+Y)

MACHINE.runGCode("G53G90G0 Z0")
MACHINE.runGCode("G53G90G0 X"+X+"Y"+Y)
while(MACHINE.isActiv()) SCRIPT.process()

if(WLToolH(index,Ltool)==0){
  return 0
  }	 
}

return 1	
}

function WLToolAutoHDialog() 
{
var index=1
var Dist=20
var enable=0
var X=0;
var Y=0;
var Z=0
var Ltool=100

enable=FILE.loadValue(WLToolFileINI,"AutoHDialog/enable",enable);
     X=FILE.loadValue(WLToolFileINI,"AutoHDialog/X",X);	
     Y=FILE.loadValue(WLToolFileINI,"AutoHDialog/Y",Y);	
	 Z=FILE.loadValue(WLToolFileINI,"AutoHDialog/Z",Z);	
 Ltool=FILE.loadValue(WLToolFileINI,"AutoHDialog/Ltool",Ltool);	
  
FILE.saveValue(WLToolFileINI,"AutoHDialog/enable",enable);
FILE.saveValue(WLToolFileINI,"AutoHDialog/X",X);	
FILE.saveValue(WLToolFileINI,"AutoHDialog/Y",Y);	
FILE.saveValue(WLToolFileINI,"AutoHDialog/Z",Z);	
FILE.saveValue(WLToolFileINI,"AutoHDialog/Ltool",Ltool);

if(!enable) {
DIALOG.question("Данный режим не активен! Нужно активировать с помощью переменной enable в файле WLTool.ini [AutoHandReplaceDialog]")  
return 0
}
else
{
SCRIPT.console("WLToolAutoHDialog X="+X+" Y="+Y)

index=GCODE.getValue("H")

if(index==0) index=1

index=DIALOG.enterNum("Введите номер инструмента:",index)
if(DIALOG.isCancel()) return 0;  

if(index==0)
 {
 DIALOG.question("Будет произведён замер смещения, продолжить?")
 if(DIALOG.isCancel()) return 0;  
 }
 else
 {	 
 if(GCODE.getHTool(index)!=0) Ltool=GCODE.getHTool(index)
	 
 if(WLToolIsUseLminmax()==0) 
     {
     Ltool=DIALOG.enterNum("Введите предпалагаемую длину инструмента",Ltool,2)
     if(DIALOG.isCancel()) return 0;  
	 }
 
 FILE.saveValue(WLToolFileINI,"AutoHDialog/Ltool",Ltool);
 }
 
return WLToolAutoH(index,Ltool) 
}
	
}

function WLToolAutoHandReplace(autoH) 
{
var index
var enable=0
var X=0;
var Y=0;
var Z=0;
var Ltool=100;	 

WLToolInitValue()

enable=FILE.loadValue(WLToolFileINI,"AutoHandReplaceDialog/enable",enable);
     X=FILE.loadValue(WLToolFileINI,"AutoHandReplaceDialog/X",X);	
     Y=FILE.loadValue(WLToolFileINI,"AutoHandReplaceDialog/Y",Y);	
     Z=FILE.loadValue(WLToolFileINI,"AutoHandReplaceDialog/Z",Z);	 

 Ltool=FILE.loadValue(WLToolFileINI,"AutoHDialog/Ltool",Ltool);		 

FILE.saveValue(WLToolFileINI,"AutoHandReplaceDialog/enable",enable);
FILE.saveValue(WLToolFileINI,"AutoHandReplaceDialog/X",X);	
FILE.saveValue(WLToolFileINI,"AutoHandReplaceDialog/Y",Y);	
FILE.saveValue(WLToolFileINI,"AutoHandReplaceDialog/Z",Z);

FILE.saveValue(WLToolFileINI,"AutoHDialog/Ltool",Ltool);	

index=GCODE.getValue("T")

if(WLToolLastIndexT==index
 &&WLToolLastIndexT>0
 &&index>0
 &&WLToolAlwaysHReplace==0)  {
    SCRIPT.console("WLToolManualReplaceDialog tool set later");
	
	if(WLToolAutoSetG43H!=0)
       MACHINE.runGCode("G43H"+index)
	return 1
	}
		
if(!enable) {
DIALOG.question("Данный режим не активен! Нужно активировать с помощью переменной enable в файле WLTool.ini [AutoHandReplaceDialog]")  
return 0
}
else
{
WLToolLastIndexT=-1
FILE.saveValue(WLToolFileINI,"LastIndexT"  ,WLToolLastIndexT); 
	
MACHINE.runGCode("G53G90G0 Z0") 
MACHINE.runGCode("G53G90G0 X"+X+"Y"+Y)
MACHINE.runGCode("G53G90G0 Z"+Z) 
 
while(MACHINE.isActiv()) SCRIPT.process()

 if(WLToolIsUseLminmax()==0) {	  
	 if(GCODE.getHTool(index)!=0) Ltool=GCODE.getHTool(index)
		 
     Ltool=DIALOG.enterNum("Замените инструмент на №"+index+". И Введите предпалагаемую длину инструмента",Ltool,2)     
	 } 
	 else{
     DIALOG.question("Замените инструмент на №"+index);  
	 }
	 
 if(DIALOG.isCancel()) return 0;   

 if(autoH==1){
	 
 MACHINE.runGCode("G53G90G0 Z0") 
   	   
 if(WLToolAutoH(index,Ltool)!=1) return 0
  
 MACHINE.runGCode("G53G90G0 Z0") 
 } 
 
 WLToolLastIndexT=index 
 FILE.saveValue(WLToolFileINI,"LastIndexT"  ,WLToolLastIndexT); 
}

return 1	
}


function WLToolAutoHandReplaceDialog() 
{
var index=0
var enable=0
var X=0;
var Y=0;
var Z=0;
var Ltool=100.0;	 

enable=FILE.loadValue(WLToolFileINI,"AutoHandReplaceDialog/enable",enable);
     X=FILE.loadValue(WLToolFileINI,"AutoHandReplaceDialog/X",X);	
     Y=FILE.loadValue(WLToolFileINI,"AutoHandReplaceDialog/Y",Y);	
     Z=FILE.loadValue(WLToolFileINI,"AutoHandReplaceDialog/Z",Z);	 

 Ltool=FILE.loadValue(WLToolFileINI,"AutoHDialog/Ltool",Ltool);		 

FILE.saveValue(WLToolFileINI,"AutoHandReplaceDialog/enable",enable);
FILE.saveValue(WLToolFileINI,"AutoHandReplaceDialog/X",X);	
FILE.saveValue(WLToolFileINI,"AutoHandReplaceDialog/Y",Y);	
FILE.saveValue(WLToolFileINI,"AutoHandReplaceDialog/Z",Z);

FILE.saveValue(WLToolFileINI,"AutoHDialog/Ltool",Ltool);	
	
index=GCODE.getValue("T")
	
if(!enable) {
DIALOG.question("Данный режим не активен! Нужно активировать с помощью переменной enable в файле WLTool.ini [AutoHandReplaceDialog]")  
return 0
}
else
{
WLToolLastIndexT=-1
FILE.saveValue(WLToolFileINI,"LastIndexT"  ,WLToolLastIndexT); 

index=TOOLBARTOOLS.selectTool()

if(index<=0) index=1  
 
index=DIALOG.enterNum("Введите номер инструмента №",index)  
if(DIALOG.isCancel()) return 0

MACHINE.runGCode("G53G90G0 Z0") 
MACHINE.runGCode("G53G90G0 X"+X+"Y"+Y)
MACHINE.runGCode("G53G90G0 Z"+Z) 
 
while(MACHINE.isActiv()) SCRIPT.process()

DIALOG.question("Замените инструмент на №"+index);  
if(DIALOG.isCancel()) return 0;   

 if(index>0) {
     MACHINE.runGCode("T"+index)
     }
  
 DIALOG.question("Произвести замер длины инструмента? №"+index)  

 if(DIALOG.isOk()){
   MACHINE.runGCode("G53G90G0 Z0") 
  
   if(GCODE.getHTool(index)!=0) Ltool=GCODE.getHTool(index)
	   
   if(WLToolIsUseLminmax()==0) 
     {
     Ltool=DIALOG.enterNum("Введите предпалагаемую длину инструмента",Ltool,2)
     if(DIALOG.isCancel()) return 0;  
	 }

   if(WLToolAutoH(GCODE.getValue("T"),Ltool)!=1)  return 0   
   }      	  
 
 WLToolLastIndexT=index 
 FILE.saveValue(WLToolFileINI,"LastIndexT"  ,WLToolLastIndexT); 
}

return 1	
}




