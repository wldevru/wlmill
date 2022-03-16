/*
WLJoystick - ������� ������ ������ � ��������� / ���������

���������:
 1.�������� ���� ���� (WLJoystick.js) � ����� /wlmillconfig/script/include
 2.����������,  �������� � LScript.
   function init()
   {
   SCRIPT.includeFile("/include/WLJoystick.js")
   ....	   
   }
 3. ��������� ������� ���������.
 
    function changedButtonJoystick(id,button,press)
	{
	WLJoystickChangedButton1(id,button,press)	
	}
	
	function changedPOVJoystick(id,number,angle)
	{
	WLJoystickChangedPOV1(id,number,angle)	
	}
	
	function changedAxisJoystick(id,axis,value)
	{
	WLJoystickChangedAxis(id,axis,value)			
	}
	
 4. ��� ��������� �������� � ����� WLJoystick.ini. ���� ��� ���, �� �� ����� ������ ��� ������������� �������. 

02/03/2021 - ������ ����� (����)

WLJoystickChangedButton(id,button,press) - ���������� ��������� ��������� ������
WLJoystickChangedPOV(id,number,angle)    - ���������� ��������� �����������
WLJoystickCchangedAxis(id,axis,value)    - ���������� ����������� ����
*/

var WLJoystickId = 0                      //����� �������� ��� ����������
var WLJoystickStepPercentCorFplus  =  2.5 //��� ���������� ���������� F � ���������
var WLJoystickStepPercentCorFminus = -2.5 //��� ���������� ���������� F � ���������
var WLJoystickStepPercentCorSplus  =  2.5 //��� ���������� ���������� S � ���������
var WLJoystickStepPercentCorSminus = -2.5 //��� ���������� ���������� S � ���������


function WLJoystickInit()
{
WLJoystickId = FILE.loadValue(WLJoystickFileINI,"Id" ,WLJoystickId);	

WLJoystickStepPercentCorFplus  = FILE.loadValue(WLJoystickFileINI,"StepPercentCorFplus"  ,WLJoystickStepPercentCorFplus );	
WLJoystickStepPercentCorFminus = FILE.loadValue(WLJoystickFileINI,"StepPercentCorFminus" ,WLJoystickStepPercentCorFminus);	
WLJoystickStepPercentCorSplus  = FILE.loadValue(WLJoystickFileINI,"StepPercentCorSplus"  ,WLJoystickStepPercentCorSplus );	
WLJoystickStepPercentCorSminus = FILE.loadValue(WLJoystickFileINI,"StepPercentCorSminus" ,WLJoystickStepPercentCorSminus);	

FILE.saveValue(WLJoystickFileINI,"Id"  ,WLJoystickId); 	

FILE.saveValue(WLJoystickFileINI,"StepPercentCorFplus"  ,WLJoystickStepPercentCorFplus );	
FILE.saveValue(WLJoystickFileINI,"StepPercentCorFminus" ,WLJoystickStepPercentCorFminus);	
FILE.saveValue(WLJoystickFileINI,"StepPercentCorSplus"  ,WLJoystickStepPercentCorSplus );	
FILE.saveValue(WLJoystickFileINI,"StepPercentCorSminus" ,WLJoystickStepPercentCorSminus);	
}

function WLJoystickChangedButton(id,button,press)
{
if(WLJoystickId==id)
{	
if(press)
switch(button)
{
case 11:  MACHINE.startMov() 
          break;

case 6:   SCRIPT.console("press 6") 
               if(GCODE.isMCode(3))
                 MACHINE.runMCode(5);
                else
                  MACHINE.runMCode(3);               

               break;

case 14:   MACHINE.plusPercentManual()
           break;

case 13:   MACHINE.minusPercentManual()
           break;

}
}
}

function WLJoystickChangedPOV(id,number,angle)
{
if(WLJoystickId==id)
{	
switch(angle)
{
case 0:   MACHINE.setPercentS(MACHINE.getPercentS()+WLJoystickStepPercentCorSplus)
                break;

case 180: MACHINE.setPercentS(MACHINE.getPercentS()+WLJoystickStepPercentCorSminus)
                 break;

case 90:  MACHINE.setPercentF(MACHINE.getPercentF()+WLJoystickStepPercentCorFplus)
                 break;

case 270: MACHINE.setPercentF(MACHINE.getPercentF()+WLJoystickStepPercentCorFminus) 
                 break;

}

}
}


function WLJoystickChangedAxis(id,axis,value)
{
if(WLJoystickId==id)
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
				
case 4:    MACHINE.goDriveManual("A",value) 
           break;
				
}
}
}