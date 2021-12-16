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
	if(WLToolAutoHandReplace(1)==0)
                   MACHINE.reset()	
	}
	

25/11/2021 - ������ �����

WLToolH(index,Dist)               - ��������� ����� ����������� ���� �������� �������� (index=0,Dist - ��������� ������) 
WLToolHDialog()                   - ��������� ����� ����������� ���� �������� ��������
WLToolAutoHDialog(autoH)          - ��������� ����� ���������� � ������������ � ����� ���������. ����������� � G53 Z0, ����������� �� XY. 
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
WLTOOLBUTTON.addButtonMenu("toolH","WLToolHDialog()")
WLTOOLBUTTON.addButtonMenu("AutoToolH","WLToolAutoHDialog()")
WLTOOLBUTTON.addButtonMenu("Replace Tool","WLToolAutoHandReplaceDialog()")
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

function WLToolCheckInProbe()
{
while(MACHINE.getInProbe()){	
	if(!DIALOG.question("������ inProbe �� �������. ��������.")) return 0;
    }	

return 1	
}


function WLToolH(index,Ltool) //����� ������ ����������� ���� �������� �������� (index=0) Ltool ������������� �����
{
WLToolInitValue()

if(WLToolCheckInProbe()==0) return 0	
	
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
    {
	GCODE.setHTool(index,Z-MACHINE.getOffsetHTool());
    MACHINE.runGCode("G43H"+index)
	}

return 1;
}

function WLToolHDialog() //����� ������ ����������� ���� �������� ��������, ������
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
 if(GCODE.getHTool(index)!=0) Ltool=GCODE.getHTool(index)
		 
 Ltool=DIALOG.enterNum("������� �������������� ����� �����������",Ltool,2)
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

if(WLToolCheckInProbe()==0) return 0	
	
if(Ltool<=0) 
    {
	MACHINE.reset();
	SCRIPT.console("WLToolAutoH Ltool="+Ltool)
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
DIALOG.question("������ ����� �� �������! ����� ������������ � ������� ���������� enable � ����� WLTool.ini [AutoHandReplaceDialog]")  
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
 if(GCODE.getHTool(index)!=0) Ltool=GCODE.getHTool(index)
	 
 Ltool=DIALOG.enterNum("������� �������������� ����� �����������",Ltool,2)
 if(DIALOG.isCancel()) return 0;  
 
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

if(WLToolLastIndexT==index)  {
    SCRIPT.console("WLToolManualReplace tool set later");
	return 1
	}
	
if(!enable) {
DIALOG.question("������ ����� �� �������! ����� ������������ � ������� ���������� enable � ����� WLTool.ini [AutoHandReplaceDialog]")  
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

 DIALOG.question("�������� ���������� �� �"+index);  
 if(DIALOG.isCancel()) return 0;   

 if(autoH==1){
	 
 MACHINE.runGCode("G53G90G0 Z0") 
   
 if(GCODE.getHTool(index)!=0) Ltool=GCODE.getHTool(index)
	   
 Ltool=DIALOG.enterNum("������� �������������� ����� �����������",Ltool,2)
 if(DIALOG.isCancel()) return 0;  
  
 if(WLToolAutoH(index,Ltool)!=1) return 0
  
 MACHINE.runGCode("G53G90G0 Z0") 
 MACHINE.runGCode("G53G90G0 X"+Xback+"Y"+Yback)
 MACHINE.runGCode("G53G90G0 Z"+Zback)  
 
 SCRIPT.console("AutoHandReplaceDialog Zback"+Zback.toFixed(2));
 } 
 
 WLToolLastIndexT=index
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
DIALOG.question("������ ����� �� �������! ����� ������������ � ������� ���������� enable � ����� WLTool.ini [AutoHandReplaceDialog]")  
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

 if(index==0) index=1  
 
 index=DIALOG.enterNum("������� ����� ����������� �",index)  
 if(DIALOG.isCancel()) return 0
 
 if(DIALOG.getNum()>0) {
     MACHINE.runGCode("T"+DIALOG.getNum())
     }
  
 DIALOG.question("���������� ����� ����� �����������? �"+index)  
 while(DIALOG.isShow());

 if(DIALOG.isOk()){
   MACHINE.runGCode("G53G90G0 Z0") 
  
   if(GCODE.getHTool(index)!=0) Ltool=GCODE.getHTool(index)
	   
   Ltool=DIALOG.enterNum("������� �������������� ����� �����������",Ltool,2)
   if(DIALOG.isCancel()) return 0;  

   if(WLToolAutoH(GCODE.getValue("T"),Ltool)!=1)  return 0
   
   SCRIPT.console("AutoHandReplaceDialog Zback"+Zback.toFixed(2));  
   }      	  
 
 WLToolLastIndexT=index
}

return 1	
}




