/*
WLJoystick - ������ ������ � ��������� / ���������

���������:
 1.��� ������ � ��������� ����� ���������� ������� ������� ���������� ��� ��������� ������ �� ��������.
 
 2.���� ����� ������� �������. ������� ����� ���� ���� ������������.
 
 3.��������� ������� ���������.
 
 function changedButtonJoystick(id,button,press) //������� �� ������ ��������
 {
 if(press)
  SCRIPT.console("Joystick "+id+" button "+button+" pressed")
 else                 
  SCRIPT.console("Joystick "+id+" button "+button+" released")
 }
 	
 function changedPOVJoystick(id,number,angle)  //������� �� ������ ����� (��������)
 {	
 SCRIPT.console("Joystick "+id+" POV "+number+" angle "+angle)
 }
 	
 function changedAxisJoystick(id,axis,value) //���������������� ���
 {
 SCRIPT.console("Jostick"+id+" axis "+axis+" value "+value)	
 }
 
 4. ����� ����� �������� � ���� ����. �������� ���� ���� (WLJoystick.js) � ����� /wlmillconfig/script/include
    ����������,  �������� � LScript.
      function init()
      {
      SCRIPT.includeFile("/include/WLJoystick.js")
      ....	   
      }
	  
 5. ����� ����� ��������� � ������� ������ init() � ������� ON(). � LScript.
	  function ON() 
      {
      init()
      }
 
 
*/

function changedButtonJoystick(id,button,press)
{/*
 if(press)
  SCRIPT.console("Joystick "+id+" button "+button+" pressed")
 else                 
  SCRIPT.console("Joystick "+id+" button "+button+" released")
	*/
	SCRIPT.console("Jostick"+id+" button "+button+" press "+press)	
	
if(id==0)
{	
if(press)
switch(button)
{
case 3:   MACHINE.runGCode("G53 G0 Y480 Z0");
          break;	
		  
case 4:   MACHINE.runGCode("G53 G0 Y450 Z-50");
          break;
		  
case 11:  MACHINE.startMov() 
          break;

case 6:   SCRIPT.console("press 6") 
               if(!MACHINE.isSpindleStop())
                 MACHINE.runMCode(5);
                else
                 MACHINE.runMCode(3);               

               break;

case 14:   MACHINE.plusPercentManual()  
           break;

case 14:   MACHINE.plusPercentManual()  
           break;
case 13:   MACHINE.minusPercentManual()
           break;

}
}
}

function changedPOVJoystick(id,number,angle)
{
if(id==0)
{	
switch(angle)
{
case 0:   MACHINE.setPercentS(MACHINE.getPercentS()+2.5)
                  break;

case 180: MACHINE.setPercentS(MACHINE.getPercentS()-2.5)
                  break;

case 90:  MACHINE.setPercentF(MACHINE.getPercentF()+2.5)
                  break;

case 270: MACHINE.setPercentF(MACHINE.getPercentF()-2.5) 
                  break;

}

}
}

function changedAxisJoystick(id,axis,value)
{
var exp=3;//������� �� 0 �� �������������. ���� 1 �� ��������. ���� > 1 �� � ������ ������ ����� ����� (� ��������).

if(id==0)
{  
if(value!=0)
 {
 if(value>0) {
  value=Math.pow(value,exp)    
  }   
  else {
  value=-Math.pow(-value,exp)          
  }
  
 value=value * MACHINE.getPercentManual()/100
 }
 
SCRIPT.console("Jostick"+id+" axis "+axis+" value "+value)	

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