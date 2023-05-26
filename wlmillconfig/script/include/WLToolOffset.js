/*
WLToolOffset - базовый скрипт работы с смещениями инструментом

Установка:
 1.Копируем этот файл (WLToolOffset.js) в папку /wlmillconfig/script/include
 2.Подключаем,  добавляя в MScript.
   function init()
   {
   SCRIPT.includeFile("/include/WLToolOffset.js")
   ....	   
   }
 
01/09/2022 - первый релиз
*/

function WLToolOffsetInit()
{
TOOLBARTOOLS.addButton("WLToolOffsetBUTTON")	

WLToolOffsetBUTTON.setText("ToolOffset")
		 
WLToolOffsetBUTTON.clearMenu() 
WLToolOffsetBUTTON.addButtonMenu("X","WLToolOffsetSet('X')","Корректировка смещения по X")
WLToolOffsetBUTTON.addButtonMenu("Y","WLToolOffsetSet('Y')","Корректировка смещения по Y")
WLToolOffsetBUTTON.addButtonMenu("Z","WLToolOffsetSet('Z')","Корректировка смещения по Z")

SCRIPT.console("WLToolOffsetInit()")
}

function WLToolOffsetSet(name)
{
var value=MACHINE.getCurPositionSC(name);

SCRIPT.console(name);

if(name=="X" && GCODE.isXDiam())
   value=value+value

value=DIALOG.enterNum("Введите положение "+name,value,3)

if(DIALOG.isOk())
  MACHINE.setCurPositionSCT(name,value)

}
