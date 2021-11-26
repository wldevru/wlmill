
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

25/11/2021 - ������ �����

WLToolH(index,Z,Dist) - ����� ������ ����������� ���� �������� �������� (index=0)

WLToolHDialog()             - ����� ������ ����������� ���� �������� ��������, ������
WLToolManualReplaceDialog() - ������ ������ �����������
*/


//Tool
var WLToolF1Probe  =  250 //�������� ������� ������� � ��/��� ��� ������ �����������
var WLToolF2Probe  =  50  //�������� ������� ������� � ��/��� ��� ������ �����������
var WLToolBackDist =  5   //���������� ������ ��� ������� ������� ��� ������ �����������
var WLToolSDStop   =  0//��������� ������� ���������


function WLToolInit()
{
var button=buttonUserFunc3

button.setVisible(1);
button.setIcon("WLToolH.png")
button.setToolTip("WLToolHDialog()")
button.setScript("WLToolHDialog()");

WLToolInitValue();
}


function WLToolInitValue()
{		
WLToolF1Probe =FILE.loadValue(WLToolFileINI,"F1Probe" ,WLToolF1Probe);
WLToolF2Probe =FILE.loadValue(WLToolFileINI,"F2Probe" ,WLToolF2Probe);
WLToolBackDist=FILE.loadValue(WLToolFileINI,"BackDist",WLToolBackDist); 
WLToolSDStop  =FILE.loadValue(WLToolFileINI,"SDStop"  ,WLToolSDStop); 

MACHINE.setF1GProbe(WLToolF1Probe)	
MACHINE.setF2GProbe(WLToolF2Probe)	
MACHINE.setBackDistGProbe(WLToolBackDist)
MACHINE.setSDStopGProbe(WLToolSDStop)

FILE.saveValue(WLToolFileINI,"F1Probe" ,WLToolF1Probe);
FILE.saveValue(WLToolFileINI,"F2Probe" ,WLToolF2Probe);
FILE.saveValue(WLToolFileINI,"BackDist",WLToolBackDist); 
FILE.saveValue(WLToolFileINI,"SDStop",WLToolSDStop); 
}


function WLToolH(index,Z,Dist) //����� ������ ����������� ���� �������� �������� (index=0)
{
WLToolInitValue()

MACHINE.clearGProbe();
MACHINE.enableDoubleGProbe(1);

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")

MACHINE.addGProbeZ(X,Y,Z,Dist);

MACHINE.goGProbe();
while(MACHINE.isActiv());

Z=MACHINE.getGProbe(0,"Z")

SCRIPT.console("WLProbeToolH Z="+Z.toFixed(3))

if(index==0)
	MACHINE.setOffsetHTool(Z);
else
	GCODE.setHTool(index,Z-MACHINE.getOffsetHTool());

return Z;
}

function WLToolHDialog() //����� ������ ����������� ���� �������� ��������, ������
{
var index
var Dist=20
var Z

Z=MACHINE.getCurPosition("Z")

Dist=FILE.loadValue(WLToolFileINI,"HDialog/Dist",Dist);

index=GCODE.getValue("H")

if(index==0) index=1

DIALOG.enterNum("������� ����� �����������:",index)
while(DIALOG.isShow());
if(DIALOG.isOk()) 
  index=DIALOG.getNum();
else
  return

if(index==0)
 {
 DIALOG.question("����� ��������� ����� ��������, ����������?")
 while(DIALOG.isShow());
 
 if(!DIALOG.isOk()) 
    return
 }

DIALOG.enterNum("������� ��������� ������:",Dist)
while(DIALOG.isShow());

if(DIALOG.isOk()&&DIALOG.getNum()) 	
  Dist=DIALOG.getNum();
else
  return

FILE.saveValue(WLToolFileINI,"HDialog/Dist",Dist);

WLToolH(index,Z-Dist,Dist)
}

function WLToolAutoHDialog() 
{
var index=1
var Dist=20
var Z
var enable=0
var X=0;
var Y=0;
var Lmax=100

enable=FILE.loadValue(WLToolFileINI,"HAutoDialog/enable",enable);
     X=FILE.loadValue(WLToolFileINI,"HAutoDialog/X",X);	
     Y=FILE.loadValue(WLToolFileINI,"HAutoDialog/Y",Y);	
  Lmax=FILE.loadValue(WLToolFileINI,"HAutoDialog/Lmax",Lmax);	

if(!enable) {
DIALOG.question("������ ����� �� �������! ����� ������������ � ������� ���������� enable � ����� WLTool.ini"+enable)  

FILE.saveValue(WLToolFileINI,"HAutoDialog/enable",enable);
FILE.saveValue(WLToolFileINI,"HAutoDialog/X",X);	
FILE.saveValue(WLToolFileINI,"HAutoDialog/Y",Y);	
FILE.saveValue(WLToolFileINI,"HAutoDialog/Lmax",Lmax);	

return 0
}
else
{
Zback=MACHINE.getCurPosition("Z"); 

SCRIPT.console("WLToolAutoHDialog X="+X+" Y="+Y)

DIALOG.enterNum("������� ����� �����������:",GCODE.getValue("T"))
while(DIALOG.isShow());
if(DIALOG.isOk()) 
  index=DIALOG.getNum();
else
  return 0

DIALOG.enterNum("������� ������������ �����",Lmax)
while(DIALOG.isShow());
if(DIALOG.isOk()) 
  Lmax=DIALOG.getNum();
else
  return 0

GCODE.push();

MACHINE.runGCode("G53G90G0 X"+X+"Y"+Y)
while(MACHINE.isActiv());

WLToolH(index,MACHINE.getOffsetHTool(),Lmax)

GCODE.pop();
}

FILE.saveValue(WLToolFileINI,"HAutoDialog/enable",enable);
FILE.saveValue(WLToolFileINI,"HAutoDialog/X",X);	
FILE.saveValue(WLToolFileINI,"HAutoDialog/Y",Y);	
FILE.saveValue(WLToolFileINI,"HAutoDialog/Lmax",Lmax);	
}

function WLToolManualReplaceDialog() 
{
var index=1
var enable=0
var X=0;
var Y=0;
var Z=0;
var Lmax=100

enable=FILE.loadValue(WLToolFileINI,"ManualReplaceDialog/enable",enable);
     X=FILE.loadValue(WLToolFileINI,"ManualReplaceDialog/X",X);	
     Y=FILE.loadValue(WLToolFileINI,"ManualReplaceDialog/Y",Y);	
     Z=FILE.loadValue(WLToolFileINI,"ManualReplaceDialog/Z",Z);	

if(!enable) {
DIALOG.question("������ ����� �� �������! ����� ������������ � ������� ���������� enable � ����� WLTool.ini"+enable)  

FILE.saveValue(WLToolFileINI,"ManualReplaceDialog/enable",enable);
FILE.saveValue(WLToolFileINI,"ManualReplaceDialog/X",X);	
FILE.saveValue(WLToolFileINI,"ManualReplaceDialog/Y",Y);	
FILE.saveValue(WLToolFileINI,"ManualReplaceDialog/Z",Z);	

return 0
}
else
{
Zback=MACHINE.getCurPosition("Z"); 

GCODE.push();

MACHINE.runGCode("G53G90G0 Z0")
MACHINE.runGCode("G53G90G0 X"+X+"Y"+Y)
MACHINE.runGCode("G53G90G0 Z"+Z)

GCODE.pop();

while(MACHINE.isActiv());

DIALOG.question("�������� ���������� �� �"+GCODE.getValue("T"))  
if(DIALOG.isCancel()) 
  return 0
}
	
}




