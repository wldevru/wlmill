/*
WLXHC - пример работы с пультом XHC

Установка:
1.Для работы с пультом XHC нужно определить функции которые вызываются при изменение данных от него.
 
2.Ниже будут примеры функций. Которые могут быть использованы вами. 

3. Копируем этот файл (WLXHCk.js) в папку /wlmillconfig/script/include
    Подключаем,  добавляя в LScript.
      function init()
      {
      SCRIPT.includeFile("/include/WLXHC.js")
      ....	   
      }
	  
*/

function WLXHCInit()
{
SCRIPT.console("WLXHCInit()")

SCRIPT.setTimeout("updateDisplayWLXHC()",50)

var i=5
for(i=0;i<10;i++) 
   MSCRIPT.addIncludeWeakFunction("macro"+(i+1)+"WLXHC")
}

function updateDisplayWLXHC()
{
if(XHC.getSelectorA()==20  //A || B ||C
 ||XHC.getSelectorA()==21 
 ||XHC.getSelectorA()==22)
   XHC.setDisplayData(MACHINE.getCurPositionSC("A")
                                    ,MACHINE.getCurPositionSC("B")
                                    ,MACHINE.getCurPositionSC("C")
                                    ,GCODE.getValue("F"))
else
   XHC.setDisplayData(MACHINE.getCurPositionSC("X")
                                    ,MACHINE.getCurPositionSC("Y")
                                    ,MACHINE.getCurPositionSC("Z")
                                    ,GCODE.getValue("F"))
                                                                        

SCRIPT.setTimeout("updateDisplayWLXHC()",50)
}

function changedWhellXHC(dist)
{
SCRIPT.console("changedWhellXHC("+dist+")")

var distXYZ=0

switch(XHC.getSelectorX())
{
case 13: //2%
                distXYZ=0.001
                break;

case 14: //5%
                distXYZ=0.010
                break;

case 15://10% 
                distXYZ=0.100
                break;

case 16: //30%
                distXYZ=1.000
                break;

case 26: //60%
                distXYZ=1.000
                break;

case 27: //100%
                distXYZ=1.000
                break;

case 155: //Lead
                distXYZ=1.000
                break;
}

var F=20

if(MACHINE.isPossiblyManual())
switch(XHC.getSelectorA())
{
case 17: //X
               DRIVEX.runMovRel(dist*distXYZ,F,1)
               break;

case 18: //Y
               DRIVEY.runMovRel(dist*distXYZ,F,1)
               break;

case 19: //Z
               DRIVEZ.runMovRel(dist*distXYZ,F,1)
               break;

case 20: //A
                DRIVEA.runMovRel(dist*distXYZ,F,1)
                break;
}

}

function changedButtonsXHC(button1,button2)
{
SCRIPT.console("changedButtonsXHC("+button1+","+button2+")")

switch(button1) 
{
case 1: //RESET
              MACHINE.reset();
              break;

case 2: //Stop
              MACHINE.stopMov()
              break;

case 3: //Start/pause
              if(MACHINE.isPause())                             
                 MACHINE.setPause(0)
              else
                {
                if(MACHINE.isActiv())
                    MACHINE.setPause()
                    else
                    MACHINE.startMov()
                 }
              break;

case 12: //Fn key + button2
                 switch(button2)
                 {
                 case 4: //Feed+
                               MACHINE.setPercentF(MACHINE.getPercentF()+2.5)
                               break;
                 case 5: //Feed -
                              MACHINE.setPercentF(MACHINE.getPercentF()-2.5)
                              break;
                 case 6: //Spindle+
                              MACHINE.setPercentS(MACHINE.getPercentS()+2.5)
                              break;
                case 7: //Spindle-
                              MACHINE.setPercentS(MACHINE.getPercentS()-2.5)
                              break;
                case 8: //M_HOME <--
				              if(MACHINE.getCurPosition("Z")<0)  
                                 MACHINE.runGCode("G53 G90 G0 Z0")
                              MACHINE.runGCode("G53 G90 G0 X0 Y0")
                              break;
                case 9: //Safe-Z
                              MACHINE.runGCode("G91 G28 G0 Z0")
                              break;
                case 10: //W_HOME <--
				              if(MACHINE.getCurPositionSC("Z")<0)  
                                 MACHINE.runGCode("G90 G0 Z0")
                              MACHINE.runGCode("G90 G0 X0 Y0")
                              break;
                case 11: //W_HOME <--
                              if(MACHINE.getStateSpindle()!=0)
                                  MACHINE.runMCode(5);
                             else
                                 MACHINE.runMCode(3);
                              break;
                case 13: //Probe-Z
                              break;
                 }
                break;

case 4: 
case 5:
case 6:
case 7:
case 8:
case 9:
case 10:
case 11:
case 12:MSCRIPT.runFunction("macro"+(button1-3)+"WLXHC()",1);
               break
case 13:MSCRIPT.runFunction("macro9WLXHC()",1);
               break
case 16:MSCRIPT.runFunction("macro10WXHC()",1);
               break
}

}

function changedSelectorXXHC(pselect)
{
SCRIPT.console("changedSelectorXXHC("+pselect+")")
}
