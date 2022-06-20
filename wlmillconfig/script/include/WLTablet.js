/*
WLTablet - ������� ������ ������ � "���������"
���������:
 1.�������� ���� ���� (WLTablet.js) � ����� /wlmillconfig/script/include
 2.����������,  �������� � MScript.
   function init()
   {
   SCRIPT.includeFile("/include/WLTablet.js")
   ....	   
   }
 2.1 ���������� ��������� ������ ������� � ����� wlmillconfig/icons  
   
 3. �� ��������� ������ WLTablet.js ������������� ������ ����� ������� �� ������ WLTABLETBUTTON		
    � ������� WLTabletInitButton().  
 4. ��� ��������� �������� � ����� WLTablet.ini. ���� ��� ���, �� �� ����� ������ ��� ������������� �������. 

25/11/2021 - ������ �����
14/01/2022 - ��������� ������������� ���������� ���������

WLTabletZ0Dialog() - ����� ������ �������. 

*/
//Tablet
var WLTabletF1Probe	 =  100 //�������� ������� ������� � ��/��� ��� ������ �����������
var WLTabletF2Probe  =  20  //�������� ������� ������� � ��/��� ��� ������ �����������
var WLTabletBackDist =  2   //���������� ������ ��� ������� ������� ��� ������ �����������
var WLTabletHeight   =  20  //������ "��������" ��� ������ ������ ���������
var WLTabletSDStop   =  0   //���������(1)/����������(0) ������� ���������


function WLTabletInit()
{
WLTabletInitButton(TOOLBAR1)
WLTabletInitValue();
}

function WLTabletInitButton(BAR)
{
BAR.addButton("WLTABLETBUTTON")	

WLTABLETBUTTON.setShow(1);
//WLTABLETBUTTON.setIconFrom(WLTabletPath+"WLTabletZ0.png")
WLTABLETBUTTON.setIcon("WLTabletZ0.png")//�� ����� wlmillconfig/icons
WLTABLETBUTTON.setToolTip("����� ��������� ���������")
WLTABLETBUTTON.setScript("WLTabletZ0Dialog()");
}


function WLTabletInitValue()
{		
WLTabletF1Probe =FILE.loadValue(WLTabletFileINI,"F1Probe" ,WLTabletF1Probe);
WLTabletF2Probe =FILE.loadValue(WLTabletFileINI,"F2Probe" ,WLTabletF2Probe);
WLTabletBackDist=FILE.loadValue(WLTabletFileINI,"BackDist",WLTabletBackDist); 
WLTabletHeight  =FILE.loadValue(WLTabletFileINI,"Height"  ,WLTabletHeight); 
WLTabletSDStop  =FILE.loadValue(WLTabletFileINI,"SDStop"  ,WLTabletSDStop); 

MACHINE.setF1GProbe(WLTabletF1Probe)	
MACHINE.setF2GProbe(WLTabletF2Probe)	
MACHINE.setBackDistGProbe(WLTabletBackDist)
MACHINE.setSDStopGProbe(WLTabletSDStop)

FILE.saveValue(WLTabletFileINI,"F1Probe" ,WLTabletF1Probe);
FILE.saveValue(WLTabletFileINI,"F2Probe" ,WLTabletF2Probe);
FILE.saveValue(WLTabletFileINI,"BackDist",WLTabletBackDist); 
FILE.saveValue(WLTabletFileINI,"Height" , WLTabletHeight);  
FILE.saveValue(WLTabletFileINI,"SDStop"  ,WLTabletSDStop); 
}

function WLTabletCheckInProbe()
{
while(MACHINE.getInProbe()){	
	if(!DIALOG.question("������ inProbe �� �������. ��������.")) return 0;
    }	

return 1	
}


function WLTabletZ0(Z,Dist) //����� ������ ���������
{
WLTabletInitValue()

if(WLTabletCheckInProbe()==0) return 0	
	
MACHINE.clearGProbe();
MACHINE.enableDoubleGProbe(1);

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")


MACHINE.runGCode("G53G90G0Z"+(Z+Dist))	
while(MACHINE.isActiv()) SCRIPT.process()
  
DIALOG.question("������������ ������-��������.");
if(DIALOG.isCancel()) return 0;  

MACHINE.addGProbeZ(X,Y,Z,Dist);

MACHINE.goGProbe();
while(MACHINE.isActiv()) SCRIPT.process()

DIALOG.question("����������� ������-��������.");

Z=MACHINE.getGProbe(0,"Z")

var Z0=MACHINE.getGProbeSC(0,"Z")-WLTabletHeight;

SCRIPT.console("WLTabletZ0 Z(G53)="+Z.toFixed(3))

Z0=DIALOG.enterNum("Z0= "+Z0.toFixed(3)+" ������� ��������� Z(������� ��)= ",0);
  
if(DIALOG.isOk())
	   MACHINE.setCurPositionSC("Z",MACHINE.getCurPosition("Z")-Z+WLTabletHeight+Z0);

return Z;
}

function WLTabletZ0Dialog() //����� ������ ���������, ������
{
var Dist=20
var Z

if(WLTabletCheckInProbe()==0) return 0	
	
Z=MACHINE.getCurPosition("Z")

Dist=FILE.loadValue(WLTabletFileINI,"Z0Dialog/Dist",Dist);

Dist=DIALOG.enterNum("������� ��������� ������:",Dist)
if(DIALOG.isCancel()) return 0;  

FILE.saveValue(WLTabletFileINI,"Z0Dialog/Dist",Dist);

return WLTabletZ0(Z-Dist,Dist)
}

