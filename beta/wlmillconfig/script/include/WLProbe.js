
/*WLProbe - базовый скрипт поиска заготовки и её элементов.

Установка:
 1.Копируем этот файл (WLProbe.js) в папку /wlmillconfig/script/include
 2.Подключаем,  добавляя в MScript.
   function init()
   {
   SCRIPT.includeFile("/include/WLProbe.js")
   ....	   
   }
 3. По умолчанию скрипт WLProbe.js устанавливает вызовы своих функций на кнопку WLPROBEBUTTON
    в функции WLProbeInit()	.  
	
 4. Все настройки хранятся в файле WLProbe.ini. Если его нет, то он будет создан при инициализации скрипта. 
 
14/06/2022 - исправлены ошибки 
20/04/2022 - добавлена функция сканирования карты высот HMAP
11/03/2022 - добавлена функция сканирования плоскости.
10/02/2022 - исправлен WLProbePointZDialog(). Добавлен запрос значения высоты для установки. 
17/11/2021 - первый релиз

Для замера длины щупа как инструмента. Нужно 
1 Определить поверхность где будет замерятся щуп. Она должна быть неподвижной (угол рабочего стола) 
  Необходимо выяснить координаты точки п1 (точка замера). 
2.1  С помощью цилиндра в шпинделе:
2.1 Уставнавливаем цилиндр в шпиндель и замеряем его длинну с помощью WLToolAutoHDialog() и вносим в таблицу.(Например мы получили длину H1=40) 
2.2 Подводим к точке замера и медленно опускаем шпидель до контакта c поверхностью (можно использовать прокладку известной толщины для предотвращения повреждения поверхности). 
    Запоминаем машинные координаты точки контакта по Z (снизу справа).
2.3 Вычисляем координату поверхности замера Z = Ztable(п2.2)-Htool(п2.1)-Hpad(толщина прокладки)"
2.4 Также записываем координаты X и Y
3 Записываем значения в файл "WLProbe.ini" в блок "AutoHDialog" если его нет. То он будет сформирован после первого вызова замера (но замерне будет произведен)

[AutoHDialog]
Lprobe=65      -примерная длина щупа (как инструмента)
X=38           -координаты
Y=177
Z=-96.34
enable=1       -включение (1)или выключение(0) данного диалога (активация)



функции:
WLProbeInit()-инициализация всего файла, вызываетсЯ автоматически при загрузке файла

WLProbePointZDialog()  - диалог поиска точки касаниЯ по Z по 1 точке
WLProbePointXYDialog() - диалог поиска точки касаниЯ по XY по 1 точке
WLProbeSizeXYDialog()  - диалог поиска середины паза/выступа в плоскости XY по 2 точкам
WLProbeCirc3XYDialog() - диалог поиск ценра окружности изнутри/снаружи в плоскости XY по 3 точкам
WLProbeCirc4XYDialog() - диалог поиск ценра круга изнутри/снаружи в плоскости XY по 4 точкам
WLProbeRotXYDialog()   - диалог поиск наклона прЯмой плоскости XY по 2 точкам
WLProbeQuadXYDialog()  - диалог поиск угла заготовки в плоскости XY по 2 точкам 
       
	   
Для определения ориентации угла используютсЯ квадранты (1,2,3,4):	   

	        Y+
           | |
      2    | |   1
           | |
 X- -------   ------- X+
    -------   -------
           | |
      3    | |   4
           | |
            Y-
			
			
Направления поиска:
Вдоль X+ -        0 градусов
Вдоль X- -      180 градусов
Вдоль Y+ -       90 градусов
Вдоль X- -      -90 градусов

допускается использовать угол +/- 360.		


WLProbePointZDialog() - поиск плоскости поиска. Далее эта плоскость	используется как базовая, далее задаётся смещение от неё (глубина поиска).
Щуп должен находится над поверхностью.

WLProbePointXYDialog() - поиск точки контакта в плоскости XY. Задаётся направление поиска и глубина поиска относительно плоскости поиска (WLProbePointZDialog()). 
Щуп должен находится над предполагаемой точкой контакта.

WLProbeSizeXYDialog() - Поиск ширины кармана/выступа. Задаётся направление ориентации поиска, предполагаемая ширина и глубина поиска относительно плоскости поиска (WLProbePointZDialog()) 
Щуп должен находится по середине кармана/выступа.

WLProbeCirc3XYDialog() - Поиск центра круглого отверстия/выступа по трёим точкам. Задаются направления поиска, предполаегмый диамет и глубина поиска относительно плоскости поиска (WLProbePointZDialog()).
Щуп должен находится по середине круглого отверстия/выступа.

WLProbeCirc4XYDialog() - Поиск центра круглого отверстия/выступа по четырём точкам. Задаётся угол поиска(смещения), предполаегмый диамет и глубина поиска относительно плоскости поиска (WLProbePointZDialog()). 
Щуп должен находится по середине круглого отверстия/выступа.

WLProbeRotXYDialog() - Поиск угла поворота по двум точка. Задаётся направление контакта WLProbeRotXYDialog(), ширина поиска и глубина поиска относительно плоскости поиска (WLProbePointZDialog()). 
Щуп должен находится над линие контакта двух точек.

WLProbeQuadXYDialog() - Поиск прямого внутреннего/наружнего угла по двум точка. Задаётся дистанция отступа от угла, квадрант ориентации угла и глубина поиска относительно плоскости поиска (WLProbePointZDialog()). 
Щуп должен находится над углом

WLProbeHDialog() - Поиск длины щупа. Указывается предполагаемая длина щупа (как для инструмента)
Щуп должен находится над поверхностью измерения длины щупа

WLProbeAutoHDialog() - Автоматический замер длины щупа.  Указывается предполагаемая длина щупа (как для инструмента)
Щуп поднимается на высоту G53 Z0 и перемещается к точке замера длины щупа, опускается. После замеряет щуп и поднимается на высоту G53 Z0.

WLProbeOffsetXYDialog() - Замер смещения шарика щупа относительно оси. Указывается диаметр колибровочного отверстия (квадрата - сторона). 
Щуп должен находится внутри колибровочного отверстия.

WLProbeAutoOffsetXYDialog() - Замер смещения шарика щупа в автоматическом режиме. Диаметр колибровочного отверстия (квадрата - сторона) берется из файла ini(WLProbe.ini/AutoOffsetXYDialog/Diam). 
Щуп поднимается на высоту G53 Z0 и перемещается к точке замера смещения, опускается. После замеряет щуп и поднимается на высоту G53 Z0.

WLProbePlaneDialog() - Сканирование плоскости с записью данных в файл
*/

//не изменять этот файл WLProbe.js!!!
//все параметры в WLProbe.ini который находится в папке с WLProbe.js. Если файла WLProbe.ini нет, то он будет создан автоматически.
//параметры по умолчанию

var WLProbeF1Probe  =   250 //скорость первого касания в мм/мин
var WLProbeF2Probe  =    50 //скорость второго касания в мм/мин
var WLProbeHeadDiam  =    2 //диаметр шарика щупа
var WLProbeBackDist  =    5 //расстояние отхода для второго касания
var WLProbeFindDistXY  = 10 //расстояние поиска XY до точки контакта(предполагаемой). или за какое расстояние до предполагаемой точки контакта щуп опустится.
var WLProbeFindDistXY_A = 5 //расстояние поиска XY после предполагаемой точки контакта (after).
var WLProbeFindDistZ =   10 //расстояние поиска Z
var WLProbeFindDistZ_A = 10 //расстояние поиска Z после предполагаемой точки контакта (after).
var WLProbeSDStop    =    1 //включение(1)/выключение(0) плавной остановки

var WLProbeXYbaseZ       = 0//базовая высота
var WLProbeXYbaseZvalid  = 1

var WLProbeDX    =   0 //смещение(несоосность) по X
var WLProbeDY    =   0 //смещение(несоосность) по Y

var WLProbeLmin = 40   //минимальная длина щупа (инструмента)
var WLProbeLmax = 80   //максимальна длина щупа (инструмента) 
                       //Если  WLProbeLmin==0 и WLProbeLmax==0 то перед измерением будет каждый раз запрашиваться примерная длинна инструмента. А значение по умолчанию будет браться из таблицы инструментов.


function WLProbeInit()
{
WLProbeInitButton(TOOLBAR1)	
WLProbeInitValue();
}

function WLProbeInitButton(BAR)
{
BAR.addButton("WLPROBEBUTTON")		

WLPROBEBUTTON.setShow(1);
//WLPROBEBUTTON.setIconFrom(WLProbePath+"WLProbe.png")
WLPROBEBUTTON.setIcon("WLProbe.png")
WLPROBEBUTTON.setToolTip("Probe")

WLPROBEBUTTON.setScript("");

WLPROBEBUTTON.clearMenu() 
WLPROBEBUTTON.addButtonMenu("HMap   Z","WLProbeHMapDialog()","Сканирование карты высот")
WLPROBEBUTTON.addButtonMenu("Plane  Z","WLProbePlaneDialog()","Сканирование поверхности")
WLPROBEBUTTON.addButtonMenu("Point  Z","WLProbePointZDialog()","Замер базовой высоты сканирования")
WLPROBEBUTTON.addButtonMenu("Point XY","WLProbePointXYDialog()","Поиск точки касания в плоскости XY")
WLPROBEBUTTON.addButtonMenu("Size  XY","WLProbeSizeXYDialog()","Замер расстояния в плоскости XY")
WLPROBEBUTTON.addButtonMenu("Circ3 XY","WLProbeCirc3XYDialog()","Поиск центра круга по 3 точкам")
WLPROBEBUTTON.addButtonMenu("Circ4 XY","WLProbeCirc4XYDialog()","Поиск центра круга по 4 точкам")
WLPROBEBUTTON.addButtonMenu("Rot   XY","WLProbeRotXYDialog()","Поиск угла поворота по 2 точкам в плоскости XY")
WLPROBEBUTTON.addButtonMenu("Quad  XY","WLProbeQuadXYDialog()","Поиск угла детали по 2 точкам в плоскости XY")
WLPROBEBUTTON.addButtonMenu("probeH","WLProbeHDialog()","Замер длины щупа")
WLPROBEBUTTON.addButtonMenu("AutoProbeH","WLProbeAutoHDialog()","Автоматический замер длины щупа")
WLPROBEBUTTON.addButtonMenu("OfsetXY","WLProbeOffsetXYDialog()","Замер биения щупа")
WLPROBEBUTTON.addButtonMenu("AutoOfstXY","WLProbeAutoOffsetXYDialog()","Автоматический замер биения щупа")
WLPROBEBUTTON.addButtonMenu("Replace Probe","WLProbeAutoHandReplaceDialog()","Установка щупа в шпиндель")

WLPROBEBUTTON.setEnabledSub(3,0)
WLPROBEBUTTON.setEnabledSub(4,0)
WLPROBEBUTTON.setEnabledSub(5,0)
WLPROBEBUTTON.setEnabledSub(6,0)
WLPROBEBUTTON.setEnabledSub(7,0)
WLPROBEBUTTON.setEnabledSub(8,0)
}

function WLProbeInitValue()
{		
WLProbeF1Probe =FILE.loadValue(WLProbeFileINI,"F1Probe" ,WLProbeF1Probe);
WLProbeF2Probe =FILE.loadValue(WLProbeFileINI,"F2Probe" ,WLProbeF2Probe);
WLProbeHeadDiam=FILE.loadValue(WLProbeFileINI,"HeadDiam",WLProbeHeadDiam);
WLProbeBackDist=FILE.loadValue(WLProbeFileINI,"BackDist",WLProbeBackDist); 
WLProbeSDStop  =FILE.loadValue(WLProbeFileINI,"SDStop",WLProbeSDStop); 

  WLProbeFindDistXY=FILE.loadValue(WLProbeFileINI,"FindDistXY",WLProbeFindDistXY);
WLProbeFindDistXY_A=FILE.loadValue(WLProbeFileINI,"FindDistXY_A",WLProbeFindDistXY_A);
   WLProbeFindDistZ=FILE.loadValue(WLProbeFileINI,"FindDistZ", WLProbeFindDistZ); 
 WLProbeFindDistZ_A=FILE.loadValue(WLProbeFileINI,"FindDistZ_A", WLProbeFindDistZ_A); 
 
WLProbeLmin=FILE.loadValue(WLProbeFileINI,"Lmin",WLProbeLmin); 
WLProbeLmax=FILE.loadValue(WLProbeFileINI,"Lmax",WLProbeLmax); 

MACHINE.setHeadDiamGProbe(WLProbeHeadDiam)
MACHINE.setF1GProbe(WLProbeF1Probe)	
MACHINE.setF2GProbe(WLProbeF2Probe)	
MACHINE.setBackDistGProbe(WLProbeBackDist)
MACHINE.setSDStopGProbe(WLProbeSDStop)

FILE.saveValue(WLProbeFileINI,"F1Probe" ,WLProbeF1Probe);
FILE.saveValue(WLProbeFileINI,"F2Probe" ,WLProbeF2Probe);
FILE.saveValue(WLProbeFileINI,"HeadDiam",WLProbeHeadDiam);
FILE.saveValue(WLProbeFileINI,"BackDist",WLProbeBackDist); 
FILE.saveValue(WLProbeFileINI,"SDStop",WLProbeSDStop); 

FILE.saveValue(WLProbeFileINI,"FindDistXY",WLProbeFindDistXY);
FILE.saveValue(WLProbeFileINI,"FindDistXY_A",WLProbeFindDistXY_A);
FILE.saveValue(WLProbeFileINI,"FindDistZ", WLProbeFindDistZ); 
FILE.saveValue(WLProbeFileINI,"FindDistZ_A", WLProbeFindDistZ_A); 

FILE.saveValue(WLProbeFileINI,"Lmin",WLProbeLmin); 
FILE.saveValue(WLProbeFileINI,"Lmax",WLProbeLmax); 
}


function WLProbeIsUseLminmax()
{
if(WLProbeLmin!=0
 ||WLProbeLmax!=0)	
   return 1	
  else
   return 0
}

function WLProbeCheckInProbe()
{
while(MACHINE.getInProbe()){	
    if(!DIALOG.question("Датчик inProbe не включен. Включите.")) return 0;
    }	

return 1	
}

function WLProbeNReady()
{
if(WLProbeXYbaseZvalid){
	DIALOG.message("Сначала нужно определить плоскость замера Probe Z");
	return 1;
    }	
	
if(WLProbeCheckInProbe()==0) 
	return 1	

return 0;	
}

function WLProbeResetOffsetXY()//Сброс смещения щупа
{
WLProbeDX=0
WLProbeDY=0	
}

function WLProbeOffsetXY(Diam)//Поиск смещения щупа
{
WLProbeInitValue()

var X=MACHINE.getCurPosition("X")
var Y=MACHINE.getCurPosition("Y")
var Z=MACHINE.getCurPosition("Z")

if(WLProbeCheckInProbe()==0) return 0	

WLProbeInitValue()

if(Diam<=0)
	return 0;

var Dist =5
var DistA=5
var R=Diam/2

if((R>0)&&(R<Dist)){
 Dist=R
 }
 
MACHINE.clearGProbe(); 
MACHINE.enableDoubleGProbe(1);
MACHINE.addGProbeXY(X-R,Y  ,Z,-180,Dist,DistA);
MACHINE.addGProbeXY(X  ,Y-R,Z, -90,Dist,DistA);
MACHINE.goGProbe();

while(MACHINE.isActiv()) SCRIPT.process()

var X0=MACHINE.getGProbe(0,"X")
var Y0=MACHINE.getGProbe(1,"Y")

if(!DIALOG.question("Поверните щуп на 180 градусов. Данное положение должно использоваться для сканирования."))   return 0;

MACHINE.clearGProbe(); 
MACHINE.enableDoubleGProbe(1);
MACHINE.addGProbeXY(X-R,Y  ,Z,-180,Dist,DistA);
MACHINE.addGProbeXY(X  ,Y-R,Z, -90,Dist,DistA);
MACHINE.goGProbe();

while(MACHINE.isActiv()) SCRIPT.process()

var X1=MACHINE.getGProbe(0,"X")
var Y1=MACHINE.getGProbe(1,"Y")

WLProbeDX=(X0-X1)/2
WLProbeDY=(Y0-Y1)/2

FILE.saveValue(WLProbeFileINI,"DX",WLProbeDX); 
FILE.saveValue(WLProbeFileINI,"DY",WLProbeDY); 

SCRIPT.console("WLProbeOffsetXY  DX="+WLProbeDX.toFixed(3)+" DY="+WLProbeDY.toFixed(3));

return 1;	
}

function WLProbeOffsetXYDialog()//Поиск смещения щупа
{
var Diam=20

Diam=FILE.loadValue(WLProbeFileINI,"OffsetXYDialog/Diam",Diam);	 		
	
Diam=DIALOG.enterNum("Щуп должен находится внутри кольца. Введите внутренний диаметр кольца:",Diam)
if(DIALOG.isCancel()) return 0	

FILE.saveValue(WLProbeFileINI,"OffsetXYDialog/Diam",Diam);	

return WLProbeOffsetXY(Diam)	
}

function WLProbeAutoOffsetXY()//Поиск смещения щупа
{
WLProbeInitValue()

var X=0
var Y=0
var Z=0
var Diam=20
var enable=0

enable=FILE.loadValue(WLProbeFileINI,"AutoOffsetXYDialog/enable",enable);
     X=FILE.loadValue(WLProbeFileINI,"AutoOffsetXYDialog/X",X);	
     Y=FILE.loadValue(WLProbeFileINI,"AutoOffsetXYDialog/Y",Y);	
     Z=FILE.loadValue(WLProbeFileINI,"AutoOffsetXYDialog/Z",Z);	 	 
  Diam=FILE.loadValue(WLProbeFileINI,"AutoOffsetXYDialog/Diam",Diam);	 	 

  
FILE.saveValue(WLProbeFileINI,"AutoOffsetXYDialog/enable",enable);
FILE.saveValue(WLProbeFileINI,"AutoOffsetXYDialog/X",X);	
FILE.saveValue(WLProbeFileINI,"AutoOffsetXYDialog/Y",Y);	
FILE.saveValue(WLProbeFileINI,"AutoOffsetXYDialog/Z",Z);	 	
FILE.saveValue(WLProbeFileINI,"AutoOffsetXYDialog/Diam",Diam);	 	 

if(WLProbeCheckInProbe()==0) return 0			

if(!enable) {
DIALOG.question("Данный режим не активен! Нужно активировать с помощью переменной enable в файле WLProbe.ini")  
return 0
}
else
{	
MACHINE.runGCode("G53G90G0 Z0") 
MACHINE.runGCode("G53G90G0 X"+X+"Y"+Y)
MACHINE.runGCode("G53G90G0 Z"+Z) 

while(MACHINE.isActiv()) SCRIPT.process()

if(WLProbeOffsetXY(Diam)==0) return 0;

MACHINE.runGCode("G53G90G0 Z0") 

while(MACHINE.isActiv()) SCRIPT.process()
}
return 1;	
}

function WLProbeAutoOffsetXYDialog()//Поиск смещения щупа
{	
return WLProbeAutoOffsetXY()
}

function WLProbeH(index,Lprobe)//Поиск длины щупа
{
WLProbeInitValue()
	 
var X=MACHINE.getCurPosition("X")
var Y=MACHINE.getCurPosition("Y")
var Z=MACHINE.getCurPosition("Z")
var Hsize=0
var Dist=WLProbeFindDistZ
var DistA=WLProbeFindDistZ_A
var Z=0

if(WLProbeCheckInProbe()==0) return 0

Dist =FILE.loadValue(WLProbeFileINI,"AutoHDialog/FindDist",Dist);  
DistA=FILE.loadValue(WLProbeFileINI,"AutoHDialog/FindDist_A",DistA);  

Z=FILE.loadValue(WLProbeFileINI,"AutoHDialog/Z",Z);  

FILE.saveValue(WLProbeFileINI,"AutoHDialog/FindDist",Dist);  
FILE.saveValue(WLProbeFileINI,"AutoHDialog/FindDist_A",DistA);  

FILE.saveValue(WLProbeFileINI,"AutoHDialog/Z",Z);  

MACHINE.clearGProbe();
MACHINE.enableDoubleGProbe(1);

if(WLProbeIsUseLminmax()==0)
  MACHINE.addGProbeZ(X,Y,Z+Lprobe,Dist,DistA);
else
  MACHINE.addGProbeZ(X,Y,Z+WLProbeLmin,WLProbeLmax-WLProbeLmin);

MACHINE.goGProbe();
while(MACHINE.isActiv()) SCRIPT.process()

Hsize=MACHINE.getGProbe(0,"Z")-Z 

if(index!=0)
 {
 GCODE.setHTool(index,Hsize);
 MACHINE.runGCode("G43H"+index)
 }

SCRIPT.console("WLProbeH H"+index+"="+Hsize.toFixed(3));

return 1;
}

function WLProbeHDialog()//Поиск длины щупа
{
WLProbeInitValue()
	 
var Lprobe=20
var X=MACHINE.getCurPosition("X")
var Y=MACHINE.getCurPosition("Y")

Lprobe=FILE.loadValue(WLProbeFileINI,"HDialog/Lprobe",Lprobe);	
	 
FILE.saveValue(WLProbeFileINI,"HDialog/Lprobe",Lprobe);	

if(WLProbeCheckInProbe()==0) return 0	

index=GCODE.getValue("T")

if(index==0) index=1

index=DIALOG.enterNum("Введите номер инструмента(щупа):",index)
if(DIALOG.isCancel()) return 0;  

if(index==0)
 {
 DIALOG.message("Номер не может быть 0")
 return 0;  
 }

if(GCODE.getHTool(index)!=0) Lprobe=GCODE.getHTool(index)
	
if(WLProbeIsUseLminmax()==0) 	 
  {
  Lprobe=DIALOG.enterNum("Введите предпалагаемую длину щупа(инструмента)",Lprobe,2)
  if(DIALOG.isCancel())  return 0
  }
 

FILE.saveValue(WLProbeFileINI,"HDialog/Lprobe",Lprobe);	

WLProbeH(index,Lprobe)

return 1;
}

function WLProbeAutoH(index,Lprobe)//Поиск длины щупа
{
var X=0
var Y=0
var enable=0


enable=FILE.loadValue(WLProbeFileINI,"AutoHDialog/enable",enable);	 	 
     X=FILE.loadValue(WLProbeFileINI,"AutoHDialog/X",X);
     Y=FILE.loadValue(WLProbeFileINI,"AutoHDialog/Y",Y);
     

FILE.saveValue(WLProbeFileINI,"AutoHDialog/enable",enable);
FILE.saveValue(WLProbeFileINI,"AutoHDialog/X",X);
FILE.saveValue(WLProbeFileINI,"AutoHDialog/Y",Y);

if(WLProbeCheckInProbe()==0) return 0	

if(Lprobe<=0) 
    {
	MACHINE.reset();
	SCRIPT.console("WLProbeAutoH Lprobe="+Lprobe)
	return 0
	}
	
if(!enable) {
return 0
}
else
{
SCRIPT.console("WLProbeAutoH X="+X+" Y="+Y)

MACHINE.runGCode("G53G90G0 Z0")
MACHINE.runGCode("G53G90G0 X"+X+"Y"+Y)
while(MACHINE.isActiv()) SCRIPT.process()

if(WLProbeH(index,Lprobe)==0){
  return 0
  }	 
}

return 1	
}

function WLProbeAutoHDialog()//Поиск длины щупа, диалог
{
WLProbeInitValue()
	 
var Lprobe=50
var enable=0
var Hsize=0
var X=0
var Y=0
var Z=0
var enable=0

enable=FILE.loadValue(WLProbeFileINI,"AutoHDialog/enable",enable);	 	 
     X=FILE.loadValue(WLProbeFileINI,"AutoHDialog/X",X);
     Y=FILE.loadValue(WLProbeFileINI,"AutoHDialog/Y",Y);
     Z=FILE.loadValue(WLProbeFileINI,"AutoHDialog/Z",Z);  
Lprobe=FILE.loadValue(WLProbeFileINI,"AutoHDialog/Lprobe",Lprobe);	 

FILE.saveValue(WLProbeFileINI,"AutoHDialog/enable",enable);
FILE.saveValue(WLProbeFileINI,"AutoHDialog/X",X);
FILE.saveValue(WLProbeFileINI,"AutoHDialog/Y",Y);
FILE.saveValue(WLProbeFileINI,"AutoHDialog/Z",Z); 	 
FILE.saveValue(WLProbeFileINI,"AutoHDialog/Lprobe",Lprobe);	

if(WLProbeCheckInProbe()==0) return 0	

if(!enable) {
DIALOG.question("Данный режим не активен! Нужно активировать с помощью переменной enable в файле WLProbe.ini")  
return 0
}
else
 {	
 index=GCODE.getValue("T")
 
 if(index==0) index=1
 
 index=DIALOG.enterNum("Введите номер инструмента(щупа):",index)
 if(DIALOG.isCancel()) return 0;  
 
 if(index==0)
  {
  DIALOG.message("Номер не может быть 0")
  return 0;  
  }
  
 if(GCODE.getHTool(index)!=0) Lprobe=GCODE.getHTool(index)

 if(WLProbeIsUseLminmax()==0) 	 
  {
  Lprobe=DIALOG.enterNum("Введите предпалагаемую длину щупа(инструмента)",Lprobe,2)
  if(DIALOG.isCancel())  return 0
  }
 
 FILE.saveValue(WLProbeFileINI,"AutoHDialog/Lprobe",Lprobe);	
 
 return WLProbeAutoH(index,Lprobe);
 }
}

function WLProbePointZ(X,Y,Z,Depth)//поиск плоскости
{
WLProbeInitValue()
	 
MACHINE.clearGProbe();
MACHINE.enableDoubleGProbe(1);

MACHINE.addGProbeZ(X,Y,Z,Depth);

MACHINE.goGProbe();
while(MACHINE.isActiv()) SCRIPT.process()

Z=MACHINE.getGProbe(0,"Z")

SCRIPT.console("WLProbePointZ Z="+Z.toFixed(3))

return Z;
}

function WLProbePointZDialog()//поиск плоскости
{
var X
var Y
var Z
var Dist=20

if(WLProbeCheckInProbe()==0) return 0	

Dist=FILE.loadValue(WLProbeFileINI,"PointZDialog/Dist",Dist);

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")
Z=MACHINE.getCurPosition("Z")

Dist=DIALOG.enterNum("Введите дистанцию поиска плоскости:",Dist)
if(DIALOG.isCancel()||Dist<=0)  return 0

FILE.saveValue(WLProbeFileINI,"PointZDialog/Dist",Dist);

Z=WLProbePointZ(X,Y,Z-Dist,Dist)

var Z0=DIALOG.enterNum("Z= "+Z.toFixed(3)+" Принять найденное Z(текущей СК)= ",0);
  
if(DIALOG.isOk())
	   MACHINE.setCurPositionSC("Z",MACHINE.getCurPosition("Z")-Z+Z0);

  
WLProbeXYbaseZ=Z

WLProbeXYbaseZvalid=0

WLPROBEBUTTON.setEnabledSub(3,1)
WLPROBEBUTTON.setEnabledSub(4,1)
WLPROBEBUTTON.setEnabledSub(5,1)
WLPROBEBUTTON.setEnabledSub(6,1)
WLPROBEBUTTON.setEnabledSub(7,1)
WLPROBEBUTTON.setEnabledSub(8,1)

return 1
}

function WLProbePointXY(X,Y,A,Depth) //простой поиск контакта "под щупом" в плоскости XY
{
WLProbeInitValue()
	
MACHINE.clearGProbe();

MACHINE.enableDoubleGProbe(1);
MACHINE.addGProbeXY(X,Y,Depth,A,WLProbeFindDistXY,WLProbeFindDistXY_A);
MACHINE.goGProbe();

while(MACHINE.isActiv()) SCRIPT.process()

X=MACHINE.getGProbe(0,"X")+WLProbeDX
Y=MACHINE.getGProbe(0,"Y")+WLProbeDY

SCRIPT.console("WLProbePointXY X="+X.toFixed(3)+" Y="+Y.toFixed(3))

return [X,Y]
}

function WLProbePointXYDialog() //простой поиск контакта "под щупом"
{
var X
var Y
var A=0
var Depth=-WLProbeHeadDiam/2

if(WLProbeNReady())	return 0;

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")

A=FILE.loadValue(WLProbeFileINI,"PointXYDialog/A",A);
Depth=FILE.loadValue(WLProbeFileINI,"LastDialog/Depth",Depth);

A=DIALOG.enterNum("Введите угол поиска =",A)
if(DIALOG.isCancel()) return 0

Depth=DIALOG.enterNum("Введите смещение плоскости поиска (ProbeZ)",Depth)
if(DIALOG.isCancel()) return 0

FILE.saveValue(WLProbeFileINI,"PointXYDialog/A",A);
FILE.saveValue(WLProbeFileINI,"LastDialog/Depth",Depth);

var data=WLProbePointXY(X,Y,A,WLProbeXYbaseZ+Depth);

//MACHINE.runGCode("G53G0 X"+data[0]+" Y"+data[1].toFixed(3))
MACHINE.runGCode("G53G0 X"+X+" Y"+Y)
while(MACHINE.isActiv()) SCRIPT.process()

return 1;
}

function WLProbeSizeXY(X,Y,A,R,Depth) //поиск середины кармана/выступа, щуп по середине
{
WLProbeInitValue()
	
var dX
var dY
var R
var Dist=WLProbeFindDistXY
var DistA=WLProbeFindDistXY_A

var Ar=A*Math.PI/180.0

if(R!=0){

 if((R>0)&&(R<Dist)) {
 Dist=R
 }
 
 dX=R*Math.cos(Ar)
 dY=R*Math.sin(Ar)
 	 
 MACHINE.clearGProbe();
 
 MACHINE.enableDoubleGProbe(1);
 
 MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A,Dist,DistA); 
 MACHINE.addGProbeXY(X-dX,Y-dY,Depth,A-180,Dist,DistA);
 
 MACHINE.goGProbe();
 
 while(MACHINE.isActiv()) SCRIPT.process()
 
 X=(MACHINE.getGProbe(0,"X")+MACHINE.getGProbe(1,"X"))/2+WLProbeDX
 Y=(MACHINE.getGProbe(0,"Y")+MACHINE.getGProbe(1,"Y"))/2+WLProbeDY
 
 dX=(MACHINE.getGProbeSC(0,"X")-MACHINE.getGProbeSC(1,"X"))
 dY=(MACHINE.getGProbeSC(0,"Y")-MACHINE.getGProbeSC(1,"Y"))
 
 var L=Math.sqrt(Math.pow(dX,2)+Math.pow(dY,2))
 
 SCRIPT.console("WLProbeSizeXY X="+X.toFixed(3)+" Y="+Y.toFixed(3)+" Size="+L.toFixed(3));
}

return [X,Y]
}

function WLProbeSizeXYDialog() //поиск середины кармана/выступа, щуп по середине
{
var X
var Y
var A=0
var Depth=-WLProbeHeadDiam/2
var R=0

if(WLProbeNReady())	return 0;

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")
	
A=FILE.loadValue(WLProbeFileINI,"SizeXYDialog/A",A);
R=FILE.loadValue(WLProbeFileINI,"SizeXYDialog/R",R);
Depth=FILE.loadValue(WLProbeFileINI,"lastDialog/Depth",Depth);


R=DIALOG.enterNum("Введите внутренний+ (наружний-)  размер =",R*2)/2
if(DIALOG.isCancel()||R==0) return 0

A=DIALOG.enterNum("‚ведите угол поворота (гр) =",A)
if(DIALOG.isCancel()) return 0

Depth=DIALOG.enterNum("Введите смещение плоскости поиска (ProbeZ)",Depth)
if(DIALOG.isCancel())  return 0

FILE.saveValue(WLProbeFileINI,"SizeXYDialog/A",A);
FILE.saveValue(WLProbeFileINI,"SizeXYDialog/R",R);
FILE.saveValue(WLProbeFileINI,"lastDialog/Depth",Depth);

var data = WLProbeSizeXY(X,Y,A,R,WLProbeXYbaseZ+Depth)

MACHINE.runGCode("G53G0 X"+data[0].toFixed(3)+" Y"+data[1].toFixed(3))

while(MACHINE.isActiv()) SCRIPT.process()

return 1
}

function WLProbeCirc4XY(X,Y,A,R,Depth)
{
WLProbeInitValue()
	
var dX
var dY
var R
var Dist =WLProbeFindDistXY
var DistA=WLProbeFindDistXY_A

if(R!=0){
 var Ar=A*Math.PI/180.0
 
 if((R>0)&&(R<Dist)){
 Dist=R
 }
 
 dX=R*Math.cos(Ar)
 dY=R*Math.sin(Ar)
 
 MACHINE.clearGProbe();
 
 MACHINE.enableDoubleGProbe(0);
 
 MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A,Dist,DistA); 
 MACHINE.addGProbeXY(X-dX ,Y -dY,Depth,A-180,Dist,DistA);
 
 MACHINE.goGProbe();
 while(MACHINE.isActiv()) SCRIPT.process()
 
 X=(MACHINE.getGProbe(0,"X")+MACHINE.getGProbe(1,"X"))/2
 Y=(MACHINE.getGProbe(0,"Y")+MACHINE.getGProbe(1,"Y"))/2
 
 MACHINE.clearGProbe();
 
 MACHINE.enableDoubleGProbe(1);
 
 MACHINE.addGProbeXY(X-dY,Y+dX,Depth,A+90,Dist,DistA);
 MACHINE.addGProbeXY(X+dY, Y-dX,Depth,A-90,Dist,DistA);
 
 MACHINE.goGProbe();
 
 while(MACHINE.isActiv()) SCRIPT.process()
 
 X=(MACHINE.getGProbe(0,"X")+MACHINE.getGProbe(1,"X"))/2
 Y=(MACHINE.getGProbe(0,"Y")+MACHINE.getGProbe(1,"Y"))/2
 
 var dx=MACHINE.getGProbe(0,"X")-MACHINE.getGProbe(1,"X")
 var dy=MACHINE.getGProbe(0,"Y")-MACHINE.getGProbe(1,"Y")
 
 var Diam1=Math.sqrt(dx*dx+dy*dy);
 
 MACHINE.clearGProbe();
 
 MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A,Dist,DistA); 
 MACHINE.addGProbeXY(X-dX ,Y -dY,Depth,A-180,Dist,DistA);
 
 MACHINE.goGProbe();
 while(MACHINE.isActiv()) SCRIPT.process()
 
 X=(MACHINE.getGProbe(0,"X")+MACHINE.getGProbe(1,"X"))/2+WLProbeDX
 Y=(MACHINE.getGProbe(0,"Y")+MACHINE.getGProbe(1,"Y"))/2+WLProbeDY
 
 var dx=MACHINE.getGProbe(0,"X")-MACHINE.getGProbe(1,"X")
 var dy=MACHINE.getGProbe(0,"Y")-MACHINE.getGProbe(1,"Y")
 
 var Diam2=Math.sqrt(dx*dx+dy*dy);
 
 SCRIPT.console("WLProbeCirc4XY X="+X.toFixed(3)+" Y="+Y.toFixed(3)+" D1="+Diam1.toFixed(3)+" D2="+Diam2.toFixed(3)+" D1-D2="+(Diam1-Diam2).toFixed(3))
 }

return [X,Y]
}

function WLProbeCirc4XYDialog()
{
var X
var Y
var R=0
var A=0
var Depth=-WLProbeHeadDiam/2

if(WLProbeNReady())	return 0;

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")
	
A=FILE.loadValue(WLProbeFileINI,"Circ4XYDialog/A",A);
R=FILE.loadValue(WLProbeFileINI,"Circ4XYDialog/R",R);
Depth=FILE.loadValue(WLProbeFileINI,"lastDialog/Depth",Depth);

R=DIALOG.enterNum("Введите внутренний+ (наружный-)  диаметр =",R*2)/2
if(DIALOG.isCancel()||R==0) return 0

A=DIALOG.enterNum("Введите угол поворота (гр) =",A)
if(DIALOG.isCancel()) return 0

Depth=DIALOG.enterNum("Введите смещение плоскости поиска (ProbeZ)",Depth)
if(DIALOG.isCancel()) return 0

FILE.saveValue(WLProbeFileINI,"Circ4XYDialog/A",A);
FILE.saveValue(WLProbeFileINI,"Circ4XYDialog/R",R);
FILE.saveValue(WLProbeFileINI,"lastDialog/Depth",Depth);

var data=WLProbeCirc4XY(X,Y,A,R,WLProbeXYbaseZ+Depth)

MACHINE.runGCode("G53 G0 X"+data[0].toFixed(3)+" Y"+data[1].toFixed(3))

while(MACHINE.isActiv()) SCRIPT.process()

return 1
}


function WLProbeCirc3XY(X,Y,A1,A2,A3,R,Depth) 
{
WLProbeInitValue()
	
var dX
var dY
var dA=0
var Dist=WLProbeFindDistXY
var DistA=WLProbeFindDistXY_A
 
if(R!=0){
 
 if((R>0)&&(R<Dist)) {
 Dist=R
 }
 
 if(R<0) {
 R=-R
 dA=180
 }
 
 var Ar1=A1*Math.PI/180.0
 var Ar2=A2*Math.PI/180.0
 var Ar3=A3*Math.PI/180.0
 
 MACHINE.clearGProbe();
 
 MACHINE.enableDoubleGProbe(1);
 
 dX=R*Math.cos(Ar1)
 dY=R*Math.sin(Ar1)
 
 MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A1+dA,Dist,DistA); 
 
 dX=R*Math.cos(Ar2)
 dY=R*Math.sin(Ar2)
 
 MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A2+dA,Dist,DistA); 
 
 dX=R*Math.cos(Ar3)
 dY=R*Math.sin(Ar3)
 
 MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A3+dA,Dist,DistA); 
 
 MACHINE.goGProbe();
 
 while(MACHINE.isActiv()) SCRIPT.process()
 
 var A = MACHINE.getGProbe(1,"X") - MACHINE.getGProbe(0,"X");													   
 var B = MACHINE.getGProbe(1,"Y") - MACHINE.getGProbe(0,"Y"); 
 var C = MACHINE.getGProbe(2,"X") - MACHINE.getGProbe(0,"X");													   
 var D = MACHINE.getGProbe(2,"Y") - MACHINE.getGProbe(0,"Y") 
 var E = A * (MACHINE.getGProbe(0,"X") + MACHINE.getGProbe(1,"X")) + B * (MACHINE.getGProbe(0,"Y") + MACHINE.getGProbe(1,"Y")); 
 var F = C * (MACHINE.getGProbe(0,"X") + MACHINE.getGProbe(2,"X")) + D * (MACHINE.getGProbe(0,"Y") + MACHINE.getGProbe(2,"Y"));
 var G = 2 * (A * (MACHINE.getGProbe(2,"Y") -MACHINE.getGProbe(1,"Y")) - B * (MACHINE.getGProbe(2,"X") -MACHINE.getGProbe(1,"X")));
 
  if (G == 0) {
     // если точки лежат на одной линии, 
     // или их координаты совпадают,
     // то окружность вписать не получится
   return ; 
   }
   // координаты центра
 X = (D*E-B*F)/G;
 Y = (A*F-C*E)/G;
 
 var R = Math.sqrt(Math.pow(MACHINE.getGProbe(0,"X") - X, 2) + Math.pow(MACHINE.getGProbe(0,"Y") - Y, 2));
 var D = R+R;
 
 X=X+WLProbeDX
 Y=Y+WLProbeDY
 
 SCRIPT.console("WLProbeCirc3XY X="+X.toFixed(3)+" Y="+Y.toFixed(3)+" D="+D.toFixed(3)+" R="+R.toFixed(3));
 }

return [X,Y]
}

function WLProbeCirc3XYDialog() 
{
var X
var Y
var R=0
var A1=0
var A2=120
var A3=-120
var Depth=-2

if(WLProbeNReady())	return 0;

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")
	
A1=FILE.loadValue(WLProbeFileINI,"Circ3XYDialog/A1",A1);
A2=FILE.loadValue(WLProbeFileINI,"Circ3XYDialog/A2",A2);
A3=FILE.loadValue(WLProbeFileINI,"Circ3XYDialog/A3",A3);
R=FILE.loadValue(WLProbeFileINI,"Circ3XYDialog/R",R);
Depth=FILE.loadValue(WLProbeFileINI,"lastDialog/Depth",Depth);

R=DIALOG.enterNum("Введите внутренний+ (наружный-)  диаметр =",R*2)/2
if(DIALOG.isCancel()||R==0) return 0

A1=DIALOG.enterNum("Введите угол поворота N1 (гр) =",A1)
if(DIALOG.isCancel()) return 0

A2=DIALOG.enterNum("Введите угол поворота N2 (гр) =",A2)
if(DIALOG.isCancel()) return 0

A3=DIALOG.enterNum("Введите угол поворота N3 (гр) =",A3)
if(DIALOG.isCancel()) return 0

Depth=DIALOG.enterNum("Введите смещение плоскости поиска (ProbeZ)",Depth)
if(DIALOG.isCancel()) return 0

FILE.saveValue(WLProbeFileINI,"Circ3XYDialog/A1",A1);
FILE.saveValue(WLProbeFileINI,"Circ3XYDialog/A2",A2);
FILE.saveValue(WLProbeFileINI,"Circ3XYDialog/A3",A3);
FILE.saveValue(WLProbeFileINI,"Circ3XYDialog/R",R);
FILE.saveValue(WLProbeFileINI,"lastDialog/Depth",Depth);

var data=WLProbeCirc3XY(X,Y,A1,A2,A3,R,WLProbeXYbaseZ+Depth)

X=data[0]
Y=data[1]

MACHINE.runGCode("G53 G0 X"+X.toFixed(3)+" Y"+Y.toFixed(3))

while(MACHINE.isActiv()) SCRIPT.process()

return 1
}

function WLProbeQuadXY(X,Y,Q,R,Depth) //
{
WLProbeInitValue();
	
MACHINE.clearGProbe();

MACHINE.enableDoubleGProbe(1);

var A=0

if(R<0) 
{
A=180
R=-R
}

switch(Q)
{
case 1: MACHINE.addGProbeXY(X+0,Y+R,Depth,180+A,WLProbeFindDistXY,WLProbeFindDistXY_A); 
        MACHINE.addGProbeXY(X+R,Y+0,Depth,-90+A,WLProbeFindDistXY,WLProbeFindDistXY_A);
        break

case 2: MACHINE.addGProbeXY(X+0,Y+R,Depth,  0+A,WLProbeFindDistXY,WLProbeFindDistXY_A); 
        MACHINE.addGProbeXY(X-R,Y+0,Depth,-90+A,WLProbeFindDistXY,WLProbeFindDistXY_A);
        break

case 3: MACHINE.addGProbeXY(X+0,Y-R,Depth,  0+A,WLProbeFindDistXY,WLProbeFindDistXY_A); 
        MACHINE.addGProbeXY(X-R,Y+0,Depth, 90+A,WLProbeFindDistXY,WLProbeFindDistXY_A);
        break

case 4: MACHINE.addGProbeXY(X+0,Y-R,Depth,180+A,WLProbeFindDistXY,WLProbeFindDistXY_A); 
        MACHINE.addGProbeXY(X+R,Y+0,Depth, 90+A,WLProbeFindDistXY,WLProbeFindDistXY_A);
        break
		
default: return [X,Y]	
}

MACHINE.goGProbe();
while(MACHINE.isActiv()) SCRIPT.process()

X=MACHINE.getGProbe(0,"X")+WLProbeDX
Y=MACHINE.getGProbe(1,"Y")+WLProbeDY

SCRIPT.console("WLProbeQuadXY X="+X.toFixed(3)+" Y="+Y.toFixed(3))

return [X,Y]
}

function WLProbeQuadXYDialog() //
{
var X
var Y
var R=0
var Q=1
var Depth=-WLProbeHeadDiam/2

if(WLProbeNReady())	return 0;

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")
	
R=FILE.loadValue(WLProbeFileINI,"QuadXYDialog/R",R);
Q=FILE.loadValue(WLProbeFileINI,"QuadXYDialog/Q",Q);
Depth=FILE.loadValue(WLProbeFileINI,"lastDialog/Depth",Depth);

R=DIALOG.enterNum("Введите отход от угла внутрений+ (наружний-) =",R)
if(DIALOG.isCancel()||R==0) return 0

Q=DIALOG.enterNum("Введите квадрант 1-4",Q)
if(DIALOG.isCancel()||Q<1||Q>5) return 0

Depth=DIALOG.enterNum("Введите смещение плоскости поиска (ProbeZ)",Depth)
if(DIALOG.isCancel()) return 0

FILE.saveValue(WLProbeFileINI,"QuadXYDialog/R",R);
FILE.saveValue(WLProbeFileINI,"QuadXYDialog/Q",Q);
FILE.saveValue(WLProbeFileINI,"lastDialog/Depth",Depth);

var data=WLProbeQuadXY(X,Y,Q,R,WLProbeXYbaseZ+Depth)

X=data[0]
Y=data[1]

MACHINE.runGCode("G53G0 X"+X.toFixed(3)+" Y"+Y.toFixed(3))

while(MACHINE.isActiv()) SCRIPT.process()

return 1
}

function WLProbeRotXY(X,Y,A,R,Depth) //поиск поворота, щуп по середине прЯмой
{
WLProbeInitValue()
	
var dX
var dY

var Ar=A*Math.PI/180.0

dX=R*Math.cos(Ar)
dY=R*Math.sin(Ar)

MACHINE.clearGProbe();

MACHINE.enableDoubleGProbe(1);

MACHINE.addGProbeXY(X-dY,Y+dX,Depth,A,WLProbeFindDistXY,WLProbeFindDistXY_A); 
MACHINE.addGProbeXY(X+dY ,Y -dX,Depth,A,WLProbeFindDistXY,WLProbeFindDistXY_A);

MACHINE.goGProbe();

while(MACHINE.isActiv()) SCRIPT.process()

dY=MACHINE.getGProbe(1,"Y")-MACHINE.getGProbe(0,"Y")
dX=MACHINE.getGProbe(1,"X")-MACHINE.getGProbe(0,"X")

A=Math.atan2(dY,dX)/Math.PI*180

SCRIPT.console("WLProbePotXY A="+A.toFixed(5))

return A
}

function WLProbeRotXYDialog() //поиск поворота, щуп по середине прЯмой
{
var X
var Y
var R=0
var A=0
var Depth=-WLProbeHeadDiam/2

if(WLProbeNReady())	return 0;

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")
	
R=FILE.loadValue(WLProbeFileINI,"RotXYDialog/R",R);
A=FILE.loadValue(WLProbeFileINI,"RotXYDialog/A",A);
Depth=FILE.loadValue(WLProbeFileINI,"lastDialog/Depth",Depth);

R=DIALOG.enterNum("‚ведите ширину поиска =",R*2)/2
if(DIALOG.isCancel()) return 0

A=DIALOG.enterNum("Введите направление поиска (гр) =",A)
if(DIALOG.isCancel()) return 0

Depth=DIALOG.enterNum("Введите смещение плоскости поиска (ProbeZ)",Depth)
if(DIALOG.isCancel()) return 0

FILE.saveValue(WLProbeFileINI,"RotXYDialog/R",R);
FILE.saveValue(WLProbeFileINI,"RotXYDialog/A",A);
FILE.saveValue(WLProbeFileINI,"lastDialog/Depth",Depth);

A=WLProbeRotXY(X,Y,A,R,WLProbeXYbaseZ+Depth)

MACHINE.runGCode("G53G0 X"+X.toFixed(3)+" Y"+Y.toFixed(3))

while(MACHINE.isActiv()) SCRIPT.process()

return 1
}

function WLProbeAutoHandReplace(autoH) 
{
var index=1
var enable=0
var X=0;
var Y=0;
var Z=0;
var Lprobe=100;	 

enable=FILE.loadValue(WLProbeFileINI,"AutoHandReplaceDialog/enable",enable);
     X=FILE.loadValue(WLProbeFileINI,"AutoHandReplaceDialog/X",X);	
     Y=FILE.loadValue(WLProbeFileINI,"AutoHandReplaceDialog/Y",Y);	
     Z=FILE.loadValue(WLProbeFileINI,"AutoHandReplaceDialog/Z",Z);	 

 Lprobe=FILE.loadValue(WLProbeFileINI,"AutoHDialog/Lprobe",Lprobe);		 

FILE.saveValue(WLProbeFileINI,"AutoHandReplaceDialog/enable",enable);
FILE.saveValue(WLProbeFileINI,"AutoHandReplaceDialog/X",X);	
FILE.saveValue(WLProbeFileINI,"AutoHandReplaceDialog/Y",Y);	
FILE.saveValue(WLProbeFileINI,"AutoHandReplaceDialog/Z",Z);

FILE.saveValue(WLProbeFileINI,"AutoHDialog/Lprobe",Lprobe);	

index=GCODE.getValue("T")

if(WLToolLastIndexT==index)  {
    SCRIPT.console("WLProbeManualReplace toolprobe set later");
	if(DIALOG.isCancel()) 
	             return 1
	}
	
if(!enable) {
DIALOG.question("Данный режим не активен! Нужно активировать с помощью переменной enable в файле WLProbe.ini [AutoHandReplaceDialog]")  
return 0
}
else
{
WLToolLastIndexT=0
	
MACHINE.runGCode("G53G90G0 Z0") 
MACHINE.runGCode("G53G90G0 X"+X+"Y"+Y)
MACHINE.runGCode("G53G90G0 Z"+Z) 
 
while(MACHINE.isActiv()) SCRIPT.process()

DIALOG.question("Замените инструмент на №"+index)  
if(DIALOG.isCancel()) return 0;  

 if(autoH==1){
  MACHINE.runGCode("G53G90G0 Z0") 
  
  if(GCODE.getHTool(index)!=0) Lprobe=GCODE.getHTool(index)
    
  if(WLProbeIsUseLminmax()==0) 	 
    {
    Lprobe=DIALOG.enterNum("Введите предпалагаемую длину щупа(инструмента)",Lprobe,2)
    if(DIALOG.isCancel())  return 0
    }
     
  if(WLProbeAutoH(index,Lprobe)!=1)  return 0
   
  MACHINE.runGCode("G53G90G0 Z0")   
  } 
 
WLToolLastIndexT=index
}

return 1	
}


function WLProbeAutoHandReplaceDialog() 
{
var index=1
var enable=0
var X=0;
var Y=0;
var Z=0;
var Lprobe=100;	 

enable=FILE.loadValue(WLProbeFileINI,"AutoHandReplaceDialog/enable",enable);
     X=FILE.loadValue(WLProbeFileINI,"AutoHandReplaceDialog/X",X);	
     Y=FILE.loadValue(WLProbeFileINI,"AutoHandReplaceDialog/Y",Y);	
     Z=FILE.loadValue(WLProbeFileINI,"AutoHandReplaceDialog/Z",Z);	 

Lprobe=FILE.loadValue(WLProbeFileINI,"AutoHDialog/Lprobe",Lprobe);		 

FILE.saveValue(WLProbeFileINI,"AutoHandReplaceDialog/enable",enable);
FILE.saveValue(WLProbeFileINI,"AutoHandReplaceDialog/X",X);	
FILE.saveValue(WLProbeFileINI,"AutoHandReplaceDialog/Y",Y);	
FILE.saveValue(WLProbeFileINI,"AutoHandReplaceDialog/Z",Z);

FILE.saveValue(WLProbeFileINI,"AutoHDialog/Lprobe",Lprobe);	

index=GCODE.getValue("T")
	
if(!enable) {
DIALOG.question("Данный режим не активен! Нужно активировать с помощью переменной enable в файле WLProbe.ini [AutoHandReplaceDialog]")  
return 0
}
else
{
WLToolLastIndexT=0

MACHINE.runGCode("G53G90G0 Z0") 
MACHINE.runGCode("G53G90G0 X"+X+"Y"+Y)
MACHINE.runGCode("G53G90G0 Z"+Z) 
 
while(MACHINE.isActiv()) SCRIPT.process()

if(index==0) index=1  

index=DIALOG.enterNum("Введите номер щупа(инструмента) №",index)  
if(DIALOG.isCancel()) return 0

if(DIALOG.getNum()>0)  {
  MACHINE.runGCode("T"+DIALOG.getNum())
  }
  
DIALOG.question("Произвести замер длины щупа(инструмента)? №"+index)  

if(DIALOG.isOk())  {
  MACHINE.runGCode("G53G90G0 Z0") 
 
  if(GCODE.getHTool(index)!=0) Lprobe=GCODE.getHTool(index)
	 
  if(WLProbeIsUseLminmax()==0) 	 
    {
    Lprobe=DIALOG.enterNum("Введите предпалагаемую длину щупа(инструмента)",Lprobe,2)
    if(DIALOG.isCancel())  return 0
    }
  
  if(WLProbeAutoH(index,Lprobe)!=1)
                                  return 0  
  }      	  
 
WLToolLastIndexT=index
}

return 1	
}

function WLProbeHMap(X0,Y0,X1,Y1,XYstep,Depth)
{	
var dir=1
var F1Probe=-1

if(X0==X1||Y0==Y1)
 {
 SCRIPT.console("WLProbeHMap error point")
 return 0
 }  
  
WLProbeInitValue()  

Fprobe=FILE.loadValue(WLProbeFileINI,"ProbePlane/F1Probe",F1Probe);	
       FILE.saveValue(WLProbeFileINI,"ProbePlane/F1Probe",F1Probe);			
	   
if(F1Probe>0) 
	MACHINE.setF1GProbe(F1Probe)		   
	
if(X1<X0){
 buf=X0
 X0=X1
 X1=buf
 }

if(Y1<Y0){
 buf=Y0
 Y0=Y1
 Y1=buf
 }

Xmax=Math.ceil((X1-X0)/XYstep);
Ymax=Math.ceil((Y1-Y0)/XYstep);

Xstep=(X1-X0)/Xmax;
Ystep=(Y1-Y0)/Ymax;

MACHINE.enableDoubleGProbe(0);

var Z=MACHINE.getCurPosition("Z")-Depth

HMAP.create(Xmax+1,Ymax+1);

for(var i=0, j=0 ;i<=Xmax;i++)
{
SCRIPT.console("i="+i)

 if(dir>0) 
    j=0
else
    j=Ymax

for(;j<=Ymax&&j>=0;j+=dir)
 {
 MACHINE.runGCode("G0 X"+(X0+Xstep*i).toString()+" Y"+(Y0+Ystep*j).toString())
 while(MACHINE.isActiv()) SCRIPT.process() 

 X=MACHINE.getCurPosition("X")
 Y=MACHINE.getCurPosition("Y") 
 
 if(i==0&&j==0){
   HMAP.setP0(X,Y)
   }

 if(WLProbeCheckInProbe()==0) return 0	

 MACHINE.clearGProbe();  
 MACHINE.addGProbeZ(X,Y,Z,Depth);
 
 MACHINE.goGProbe();
 while(MACHINE.isActiv()) SCRIPT.process()
 
 Zp=MACHINE.getGProbe(0,"Z")
 
 SCRIPT.console("Z="+Zp.toFixed(3))
 
 if(i==0&&j==0){
  HMAP.setZOffset(Zp)
  }
 
 HMAP.setValue(i,j,Zp)  
 }
dir=-dir;
}  

HMAP.setP1(X,Y)

SCRIPT.console("WLProbePlane complete")

return 1;		
}


function WLProbePlane(X0,Y0,X1,Y1,XYstep,Depth,nameFile)
{	
var dir=1
var Split=","
var Dec=3
var F1Probe=-1

if(X0==X1||Y0==Y1)
 {
 SCRIPT.console("WLProbePlane error point")
 return 0
 }  
  
WLProbeInitValue()  

Fprobe=FILE.loadValue(WLProbeFileINI,"ProbePlane/F1Probe",F1Probe);	
       FILE.saveValue(WLProbeFileINI,"ProbePlane/F1Probe",F1Probe);			
	   
if(F1Probe>0) 
	MACHINE.setF1GProbe(F1Probe)		   


Split=FILE.loadValue(WLProbeFileINI,"ProbePlane/Split",Split);	
      FILE.saveValue(WLProbeFileINI,"ProbePlane/Split",Split);			

Dec=FILE.loadValue(WLProbeFileINI,"ProbePlane/Decimals",Dec);	
    FILE.saveValue(WLProbeFileINI,"ProbePlane/Decimals",Dec);			


if(X1<X0){
 buf=X0
 X0=X1
 X1=buf
 }

if(Y1<Y0){
 buf=Y0
 Y0=Y1
 Y1=buf
 }

Xmax=Math.ceil((X1-X0)/XYstep);
Ymax=Math.ceil((Y1-Y0)/XYstep);

Xstep=(X1-X0)/Xmax;
Ystep=(Y1-Y0)/Ymax;

FILE.createFile(nameFile) 

MACHINE.enableDoubleGProbe(0);

var Z=MACHINE.getCurPosition("Z")-Depth

for(var i=0, j=0 ;i<=Xmax;i++)
{
SCRIPT.console("i="+i)

 if(dir>0) 
    j=0
else
    j=Ymax

HMAP.setEnable(false)
 
for(;j<=Ymax&&j>=0;j+=dir)
 {
 MACHINE.runGCode("G0 X"+(X0+Xstep*i).toString()+" Y"+(Y0+Ystep*j).toString())
 while(MACHINE.isActiv()) SCRIPT.process() 

 X=MACHINE.getCurPosition("X")
 Y=MACHINE.getCurPosition("Y") 
 
 if(WLProbeCheckInProbe()==0) return 0	

 MACHINE.clearGProbe();  
 MACHINE.addGProbeZ(X,Y,Z,Depth);
 
 MACHINE.goGProbe();
 while(MACHINE.isActiv()) SCRIPT.process()
 
 Zsc=MACHINE.getGProbeSC(0,"Z")
 
 SCRIPT.console("Z="+Zsc.toFixed(Dec))
 
 FILE.write(nameFile,(X0+Xstep*i).toFixed(Dec)+Split+(Y0+Ystep*j).toFixed(Dec)+Split+Zsc.toFixed(Dec)+'\r\n') 
 }
dir=-dir;
}  

SCRIPT.console("WLProbePlane complete")

return 1;		
}

function WLProbePlaneDialog()
{
var X0=0
var Y0=0

var X1=50
var Y1=50

var Step=5
var Depth=15

var nameFile=""

X0=FILE.loadValue(WLProbeFileINI,"ProbePlaneDialog/X0",X0);		
Y0=FILE.loadValue(WLProbeFileINI,"ProbePlaneDialog/Y0",Y0);		
X1=FILE.loadValue(WLProbeFileINI,"ProbePlaneDialog/X1",X1);		
Y1=FILE.loadValue(WLProbeFileINI,"ProbePlaneDialog/Y1",Y1);		
Depth=FILE.loadValue(WLProbeFileINI,"ProbePlaneDialog/Depth",Depth);		
Step=FILE.loadValue(WLProbeFileINI,"ProbePlaneDialog/Step",Step);			
nameFile=FILE.loadValue(WLProbeFileINI,"ProbePlaneDialog/nameFile",nameFile);		


nameFile=DIALOG.enterSaveFile("Файл сохранения результатов",nameFile)
if(DIALOG.isCancel())  return 0

X0=DIALOG.enterNum("Введите X0",X0,2)
if(DIALOG.isCancel())  return 0

X1=DIALOG.enterNum("Введите X1",X1,2)
if(DIALOG.isCancel())  return 0

if(X0==X1)
  {
  DIALOG.question("X0 не может быть равен X1")  
  return 0
  }

Y0=DIALOG.enterNum("Введите Y0",Y0,2)
if(DIALOG.isCancel())  return 0

Y1=DIALOG.enterNum("Введите Y1",Y1,2)
if(DIALOG.isCancel())  return 0

if(Y0==Y1)
  {
  DIALOG.question("Y0 не может быть равен Y1")  
  return 0
  }
  
Step=DIALOG.enterNum("Введите шаг сканирования",Step,2)
if(DIALOG.isCancel())  return 0

if(Step<=0)
  {
  DIALOG.question("шаг не может быть меньше либо равен 0")  
  return 0
  }  
  
Depth=DIALOG.enterNum("Введите расстояние поиска",Depth,2)
if(DIALOG.isCancel())  return 0

if(Depth<=0)
  {
  DIALOG.question("расстояние поиска не может быть меньше либо равен 0")  
  return 0
  }  


FILE.saveValue(WLProbeFileINI,"ProbePlaneDialog/X0",X0);		
FILE.saveValue(WLProbeFileINI,"ProbePlaneDialog/Y0",Y0);		
FILE.saveValue(WLProbeFileINI,"ProbePlaneDialog/X1",X1);		
FILE.saveValue(WLProbeFileINI,"ProbePlaneDialog/Y1",Y1);		
FILE.saveValue(WLProbeFileINI,"ProbePlaneDialog/Step",Step);	
FILE.saveValue(WLProbeFileINI,"ProbePlaneDialog/Depth",Depth);				
FILE.saveValue(WLProbeFileINI,"ProbePlaneDialog/nameFile",nameFile);		

WLProbePlane(X0,Y0,X1,Y1,Step,Depth,nameFile)	
}

function WLProbeHMapDialog()
{
var X0=0
var Y0=0

var X1=50
var Y1=50

var Step=5
var Depth=15

var nameFile=""

X0=FILE.loadValue(WLProbeFileINI,"ProbePlaneDialog/X0",X0);		
Y0=FILE.loadValue(WLProbeFileINI,"ProbePlaneDialog/Y0",Y0);		
X1=FILE.loadValue(WLProbeFileINI,"ProbePlaneDialog/X1",X1);		
Y1=FILE.loadValue(WLProbeFileINI,"ProbePlaneDialog/Y1",Y1);		
Depth=FILE.loadValue(WLProbeFileINI,"ProbePlaneDialog/Depth",Depth);		
Step=FILE.loadValue(WLProbeFileINI,"ProbePlaneDialog/Step",Step);				

X0=DIALOG.enterNum("Введите X0",X0,2)
if(DIALOG.isCancel())  return 0

X1=DIALOG.enterNum("Введите X1",X1,2)
if(DIALOG.isCancel())  return 0

if(X0==X1)
  {
  DIALOG.question("X0 не может быть равен X1")  
  return 0
  }

Y0=DIALOG.enterNum("Введите Y0",Y0,2)
if(DIALOG.isCancel())  return 0

Y1=DIALOG.enterNum("Введите Y1",Y1,2)
if(DIALOG.isCancel())  return 0

if(Y0==Y1)
  {
  DIALOG.question("Y0 не может быть равен Y1")  
  return 0
  }
  
Step=DIALOG.enterNum("Введите шаг сканирования",Step,2)
if(DIALOG.isCancel())  return 0

if(Step<=0)
  {
  DIALOG.question("шаг не может быть меньше либо равен 0")  
  return 0
  }  
  
Depth=DIALOG.enterNum("Введите расстояние поиска",Depth,2)
if(DIALOG.isCancel())  return 0

if(Depth<=0)
  {
  DIALOG.question("расстояние поиска не может быть меньше либо равен 0")  
  return 0
  }  


FILE.saveValue(WLProbeFileINI,"ProbePlaneDialog/X0",X0);		
FILE.saveValue(WLProbeFileINI,"ProbePlaneDialog/Y0",Y0);		
FILE.saveValue(WLProbeFileINI,"ProbePlaneDialog/X1",X1);		
FILE.saveValue(WLProbeFileINI,"ProbePlaneDialog/Y1",Y1);		
FILE.saveValue(WLProbeFileINI,"ProbePlaneDialog/Step",Step);	
FILE.saveValue(WLProbeFileINI,"ProbePlaneDialog/Depth",Depth);				
FILE.saveValue(WLProbeFileINI,"ProbePlaneDialog/nameFile",nameFile);		

WLProbeHMap(X0,Y0,X1,Y1,Step,Depth)	
}