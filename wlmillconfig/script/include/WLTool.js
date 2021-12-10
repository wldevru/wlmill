/*
WLTool - ������� ������ ������ � ������������

���������:
 1.�������� ���� ���� (WLTool.js) � ����� /wlmillconfig/script/include
 2.����������,  �������� � MScript.
   function init()
   {
   SCRIPT.includeFile("/include/WLTool.js")
   ....	   
   }
 3. �� ��������� ������ WLTool.js ������������� ������ ����� ������� �� ������ buttonUserFunc3 
    � ������� WLToolInit().
 4. ��� ��������� �������� � ����� WLTool.ini. ���� ��� ���, �� �� ����� ������ ��� ������������� �������. 
 5. ���� ���������� ����� �������� �������, �� � ������ M6() ���������� ��������
    function M6()
	{
	...	
	if(WLToolAutoHandReplaceDialog(1)==0)
                         MACHINE.reset()	
	}
	

25/11/2021 - ������ �����

WLToolH(index,Dist)               - ����� ������ ����������� ���� �������� �������� (index=0,Dist - ��������� ������) 
WLToolHDialog()                   - ����� ������ ����������� ���� �������� ��������
WLToolManualReplaceDialog(autoH)  - ������ ���������� � ������������ � ����� ������. ����������� � G53 Z0, ����������� �� XY.
                                    ���� autoH = 1 �� ����� ���������� ����� ����� ����� ����� �����������. ���������� 1 � ������ ������.


UseTabletH - ������������ ������-��������. - ��� �������� ����� ����������.
*/


//Tool
var WLToolF1Probe   =  250 //�������� ������� ������� � ��/��� ��� ������ �����������
var WLToolF2Probe   =  50  //�������� ������� ������� � ��/��� ��� ������ �����������
var WLToolBackDist  =  5   //���������� ������ ��� ������� ������� ��� ������ �����������
var WLToolSDStop    =  0   //���������(1)/����������(0) ������� ���������
var WLToolLastIndexT=  -1  //����� ���������� �����������
var WLToolUseTabletH=   1  //������������ (1) ��� ��� (0) ������-��������. ����� ��� ������������� � ������ (���������).
var WLToolFindDist  = 10  //���������� ������ �� ������������ �����
var WLToolFindDist_A= -5   //���������� ������ �����


function WLToolInit()
{
WLToolInitButton(TOOLBAR1)
WLToolInitValue();
}

function WLToolInitButton(BAR)
{
BAR.addButton("WLTOOLBUTTON")	

WLTOOLBUTTON.setText("TOOL")

WLTOOLBUTTON.clearMenu() 
WLTOOLBUTTON.addButtonMenu("H","WLToolHDialog()")
WLTOOLBUTTON.addButtonMenu("Auto H","WLToolAutoHDialog()")
WLTOOLBUTTON.addButtonMenu("Replace Tool","WLToolAutoHandReplaceDialog(0)")
}


function WLToolInitValue()
{		
WLToolF1Probe =FILE.loadValue(WLToolFileINI,"F1Probe" ,WLToolF1Probe);
WLToolF2Probe =FILE.loadValue(WLToolFileINI,"F2Probe" ,WLToolF2Probe);
WLToolBackDist=FILE.loadValue(WLToolFileINI,"BackDist",WLToolBackDist); 
WLToolSDStop  =FILE.loadValue(WLToolFileINI,"SDStop"  ,WLToolSDStop); 
WLToolUseTabletH=FILE.loadValue(WLToolFileINI,"UseTabletH"  ,WLToolUseTabletH); 
WLToolFindDist=FILE.loadValue(WLToolFileINI,"FindDist"  ,WLToolFindDist); ;
WLToolFindDist_A=FILE.loadValue(WLToolFileINI,"FindDist_A"  ,WLToolFindDist_A); ;

MACHINE.setF1GProbe(WLToolF1Probe)	
MACHINE.setF2GProbe(WLToolF2Probe)	
MACHINE.setBackDistGProbe(WLToolBackDist)
MACHINE.setSDStopGProbe(WLToolSDStop)

FILE.saveValue(WLToolFileINI,"F1Probe" ,WLToolF1Probe);
FILE.saveValue(WLToolFileINI,"F2Probe" ,WLToolF2Probe);
FILE.saveValue(WLToolFileINI,"BackDist",WLToolBackDist); 
FILE.saveValue(WLToolFileINI,"SDStop",WLToolSDStop); 
FILE.saveValue(WLToolFileINI,"UseTabletH"  ,WLToolUseTabletH); 
FILE.saveValue(WLToolFileINI,"FindDist"  ,WLToolFindDist); ;
FILE.saveValue(WLToolFileINI,"FindDist_A"  ,WLToolFindDist_A); ;

}


function WLToolH(index,Ltool) //����� ������ ����������� ���� �������� �������� (index=0) Ltool ������������� �����
{
WLToolInitValue()

if(WLProbeCheckInProbe()==0) return 0	
	
var X=MACHINE.getCurPosition("X")
var Y=MACHINE.getCurPosition("Y")
var Z=0

if(index==0)
	Z=MACHINE.getCurPosition("Z")-WLToolFindDist
else
    Z=FILE.loadValue(WLToolFileINI,"AutoHDialog/Z",Z)+Ltool;	 

if(WLToolUseTabletH){
  MACHINE.runGCode("G53G90G0Z"+(Z+WLToolFindDist))	
  while(MACHINE.isActiv()) SCRIPT.process()
  
  DIALOG.question("������������ ������-��������.");
  if(DIALOG.isCancel()) return 0;  
  }
	
MACHINE.clearGProbe();
MACHINE.enableDoubleGProbe(1);

MACHINE.addGProbeZ(X,Y,Z,WLToolFindDist,WLToolFindDist_A);

SCRIPT.console("WLProbeToolH Z="+Z.toFixed(3)+"L="+Ltool) 

MACHINE.goGProbe();
while(MACHINE.isActiv()) SCRIPT.process()

Z=MACHINE.getGProbe(0,"Z")

SCRIPT.console("WLProbeToolH Z="+Z.toFixed(3))

if(index==0)
	FILE.saveValue(WLToolFileINI,"AutoHDialog/Z",Z);	 
else
	GCODE.setHTool(index,Z-MACHINE.getOffsetHTool());

return 1;
}

function WLToolHDialog() //����� ������ ����������� ���� �������� ��������, ������
{
var index
var Ltool=20
var Z

if(WLProbeCheckInProbe()==0) return 0	

Z=MACHINE.getCurPosition("Z")

Ltool=FILE.loadValue(WLToolFileINI,"HDialog/Ltool",Ltool);

index=GCODE.getValue("H")

if(index==0) index=1

index=DIALOG.enterNum("������� ����� �����������:",index)
if(DIALOG.isCancel()) return 0;  

if(index==0)
 {
 DIALOG.question("����� ��������� ����� ��������, ����������?")
 if(DIALOG.isCancel()) return 0;  
/*
 DIALOG.question("��������� ������� X,Y ��� �������������� ���������?")
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
 Ltool=DIALOG.enterNum("������� �������������� ����� �����������",Ltool)
 if(DIALOG.isCancel()) return 0;  
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

if(WLProbeCheckInProbe()==0) return 0	
	
if(Ltool<=0) 
    {
	MACHINE.reset();
	SCRIPT.console("WLToolAutoH Ltool="+Ltool)
	return 0
	}
	
if(!enable) {
DIALOG.question("������ ����� �� �������! ����� ������������ � ������� ���������� enable � ����� WLTool.ini"+enable)  
return 0
}
else
{
SCRIPT.console("WLToolAutoH X="+X+" Y="+Y)

GCODE.push();
MACHINE.runGCode("G53G90G0 Z0")
MACHINE.runGCode("G53G90G0 X"+X+"Y"+Y)
while(MACHINE.isActiv()) SCRIPT.process()

if(WLToolH(index,Ltool)==0){
  GCODE.pop();	
  return 0
  }	 
GCODE.pop();
}

MACHINE.runGCode("G43H"+index)

return 1	
}

function WLToolAutoHDialog() 
{
var index=1
var Dist=20
var Z
var enable=0
var X=0;
var Y=0;
var Ltool=100

enable=FILE.loadValue(WLToolFileINI,"AutoHDialog/enable",enable);
     X=FILE.loadValue(WLToolFileINI,"AutoHDialog/X",X);	
     Y=FILE.loadValue(WLToolFileINI,"AutoHDialog/Y",Y);	
 Ltool=FILE.loadValue(WLToolFileINI,"AutoHDialog/Ltool",Ltool);	
  
FILE.saveValue(WLToolFileINI,"AutoHDialog/enable",enable);
FILE.saveValue(WLToolFileINI,"AutoHDialog/X",X);	
FILE.saveValue(WLToolFileINI,"AutoHDialog/Y",Y);	
FILE.saveValue(WLToolFileINI,"AutoHDialog/Ltool",Ltool);

if(!enable) {
DIALOG.question("������ ����� �� �������! ����� ������������ � ������� ���������� enable � ����� WLTool.ini")  
return 0
}
else
{
var Zback=MACHINE.getCurPosition("Z"); 

SCRIPT.console("WLToolAutoHDialog X="+X+" Y="+Y)

index=GCODE.getValue("H")

if(index==0) index=1

index=DIALOG.enterNum("������� ����� �����������:",index)
if(DIALOG.isCancel()) return 0;  

if(index==0)
 {
 DIALOG.question("����� ��������� ����� ��������, ����������?")
 if(DIALOG.isCancel()) return 0;  
 }
 else
 {
 Ltool=DIALOG.enterNum("������� �������������� ����� �����������",Ltool)
 if(DIALOG.isCancel()) return 0;  
 
 FILE.saveValue(WLToolFileINI,"AutoHDialog/Ltool",Ltool);
 }
 
return WLToolAutoH(index,Ltool) 
}

	
}

function WLToolAutoHandReplaceDialog(autoH) 
{
var index=1
var enable=0
var X=0;
var Y=0;
var Z=0;
var Ltool=100;	 

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

if(WLToolLastIndexT==GCODE.getValue("T"))  {
    SCRIPT.console("WLToolManualReplaceDialog tool set later");
	
	DIALOG.question("���������� ��� ����������. ����������?")  
	while(DIALOG.isShow());
    
	if(DIALOG.isCancel()) 
	             return 1
	}
	
if(!enable) {
DIALOG.question("������ ����� �� �������! ����� ������������ � ������� ���������� enable � ����� WLTool.ini")  
return 0
}
else
{
WLToolLastIndexT=0
	
var Xback=MACHINE.getCurPosition("X"); 
var Yback=MACHINE.getCurPosition("Y"); 	
var Zback=MACHINE.getCurPosition("Z"); 
  
SCRIPT.console("ManualReplaceDialog Zback"+Zback.toFixed(2));

MACHINE.runGCode("G53G90G0 Z0") 
MACHINE.runGCode("G53G90G0 X"+X+"Y"+Y)
MACHINE.runGCode("G53G90G0 Z"+Z) 
 
while(MACHINE.isActiv()) SCRIPT.process()

 if(autoH==0)
  {
  index=GCODE.getValue("T")

  if(index==0) index=1  
  
  index=DIALOG.enterNum("������� ����� ����������� �",index)  
  if(DIALOG.isCancel()) return 0
  
  if(DIALOG.getNum()>0)  
      {
      MACHINE.runGCode("T"+DIALOG.getNum())
	  }
	  
  DIALOG.question("���������� ����� ����� �����������? �"+GCODE.getValue("T"))  
  while(DIALOG.isShow());
 
  if(DIALOG.isOk()) 
    {
    MACHINE.runGCode("G53G90G0 Z0") 
   
    Ltool=DIALOG.enterNum("������� �������������� ����� �����������",Ltool)
    if(DIALOG.isCancel()) return 0;  

   if(WLToolAutoH(GCODE.getValue("T"),Ltool)!=1)
                                    return 0
    
    SCRIPT.console("AutoHandReplaceDialog Zback"+Zback.toFixed(2));
	}      	  
  }
  else
  {
  DIALOG.question("�������� ���������� �� �"+GCODE.getValue("T"))  
  if(DIALOG.isCancel()) return 0;  
  }

 if(autoH==1){
	 
 MACHINE.runGCode("G53G90G0 Z0") 
   
 Ltool=DIALOG.enterNum("������� �������������� ����� �����������",Ltool)
 if(DIALOG.isCancel()) return 0;  
  
 if(WLToolAutoH(GCODE.getValue("T"),Ltool)!=1)
                                    return 0
  
 MACHINE.runGCode("G53G90G0 Z0") 
 MACHINE.runGCode("G53G90G0 X"+Xback+"Y"+Yback)
 MACHINE.runGCode("G53G90G0 Z"+Zback)  
 
 SCRIPT.console("AutoHandReplaceDialog Zback"+Zback.toFixed(2));
 }
 
 
 WLToolLastIndexT=GCODE.getValue("T") 
}

return 1	
}




