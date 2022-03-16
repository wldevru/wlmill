function ON() 
{
init()
}

function init() 
{
SCRIPT.includeFile("/include/WLJoystick.js")
}


function changedButtonJoystick(id,button,press)
{
if(press)
 SCRIPT.console(id+" кнопка "+button+" нажата")
else
 SCRIPT.console(id+" кнопка "+button+" отпущена")

WLJoystickChangedButton(id,button,press)	
}
	
function changedPOVJoystick(id,number,angle)
{
SCRIPT.console(id+" Направление "+number+" угол "+angle)
WLJoystickChangedPOV(id,number,angle)	
}

function changedAxisJoystick(id,axis,value)
{
SCRIPT.console(id+" Ось "+axis+" значение "+value)
WLJoystickChangedAxis(id,axis,value)			
}

/*

function changedButtonJoystick(id,button,press)
{
 if(press)
switch(button)
{
case 11:  MACHINE.startMov() 
                break;

case 6: SCRIPT.console("press 6") 
              if(GCODE.isMCode(3))
                 MACHINE.runMCode(5);
                else
                  MACHINE.runMCode(3);               

               break;

case 14: //MACHINE.setPercentManual(MACHINE.getPercentManual()*2.0)
              MACHINE.plusPercentManual()
               break;

case 13: //MACHINE.setPercentManual(MACHINE.getPercentManual()*0.5)
             MACHINE.minusPercentManual()
               break;

}

}

function changedPOVJoystick(id,number,angle)
{
switch(angle)
{
case 0:    MACHINE.setPercentS(MACHINE.getPercentS()+2.5)
                break;

case 180: MACHINE.setPercentS(MACHINE.getPercentS()-2.5)
                 break;

case 90:   MACHINE.setPercentF(MACHINE.getPercentF()+2.5)
                 break;

case 270: MACHINE.setPercentF(MACHINE.getPercentF()-2.5) 
                 break;

}

SCRIPT.console(angle);
	
}

function changedAxisJoystick(id,axis,value)
{
value=value * MACHINE.getPercentManual()/100

switch(axis)
{
case 0:    MACHINE.goDriveManual("X",value) 
                break;

case 1:    MACHINE.goDriveManual("Y",-value) 
                break;

case 3:    MACHINE.goDriveManual("Z",-value) 
                break;
}


}
*/