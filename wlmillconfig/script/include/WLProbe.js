
/*WLProbe - ������� ������ ������ ��������� � � ���������.
���������:
 1.�������� ���� ���� (WLProbe.js) � ����� /wlmillconfig/script/include
 2.����������,  �������� � MScript.
   function init()
   {
   SCRIPT.includeFile("/include/WLProbe.js")
   ....	   
   }
 3. �� ��������� ������ WLProbe.js ������������� ������ ����� ������� �� ������ buttonUserFunc1  
    � ������� WLProbeInit()	.  
	
 4. ��� ��������� �������� � ����� WLProbe.ini. ���� ��� ���, �� �� ����� ������ ��� ������������� �������. 

17/11/2021 - ������ �����

��� ������ ����� ���� ��� �����������. ����� 
1 ���������� ����������� ��� ����� ��������� ���. ��� ������ ���� ����������� (���� �������� �����) 
  ���������� �������� ���������� ����� �1 (����� ������). 
2.1  � ������� �������� � ��������:
2.1 �������������� ������� � �������� � �������� ��� ������ � ������� WLToolAutoHDialog() � ������ � �������.(�������� �� �������� ����� H1=40) 
2.2 �������� � ����� ������ � �������� �������� ������� �� �������� c ������������ (����� ������������ ��������� ��������� ������� ��� �������������� ����������� �����������). 
    ���������� �������� ���������� ����� �������� �� Z (����� ������).
2.3 ��������� ���������� ����������� ������ Z = Ztable(�2.2)-Htool(�2.1)-Hpad(������� ���������)"
2.4 ����� ���������� ���������� X � Y
3 ���������� �������� � ���� "WLProbe.ini" � ���� "HDialog" ���� ��� ���. �� �� ����� ����������� ����� ������� ������ ������ (�� ������� ����� ����������)

[HDialog]
Lmax=65   -������������ ����� ���� (��� �����������)
X=38      -����������
Y=177
Z=-96.34
enable=1  -��������� (1)��� ����������(0) ������� ������� (���������)



�������:
WLProbeInit()-������������� ����� �����, ���������� ������������� ��� �������� �����

WLProbePointZDialog()  - ������ ������ ����� ������� �� Z �� 1 �����
WLProbePointXYDialog() - ������ ������ ����� ������� �� XY �� 1 �����
WLProbeSizeXYDialog()  - ������ ������ �������� ����/������� � ��������� XY �� 2 ������
WLProbeCirc3XYDialog() - ������ ����� ����� ���������� �������/������� � ��������� XY �� 3 ������
WLProbeCirc4XYDialog() - ������ ����� ����� ����� �������/������� � ��������� XY �� 4 ������
WLProbeRotXYDialog()   - ������ ����� ������� ������ ��������� XY �� 2 ������
WLProbeQuadXYDialog()  - ������ ����� ���� ��������� � ��������� XY �� 2 ������ 
       
	   
��� ����������� ���������� ���� ������������ ��������� (1,2,3,4):	   

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
			
			
����������� ������:
����� X+ -        0 ��������
����� X- -      180 ��������
����� Y+ -       90 ��������
����� X- -      -90 ��������

����������� ������������ ���� +/- 360.		


WLProbePointZDialog() - ����� ��������� ������. ����� ��� ���������	������������ ��� �������, ����� ������� �������� �� �� (������� ������).
��� ������ ��������� ��� ������������.

WLProbePointXYDialog() - ����� ����� �������� � ��������� XY. ������� ����������� ������ � ������� ������ ������������ ��������� ������ (WLProbePointZDialog()). 
��� ������ ��������� ��� �������������� ������ ��������.

WLProbeSizeXYDialog() - ����� ������ �������/�������. ������� ����������� ���������� ������, �������������� ������ � ������� ������ ������������ ��������� ������ (WLProbePointZDialog()) 
��� ������ ��������� �� �������� �������/�������.

WLProbeCirc3XYDialog() - ����� ������ �������� ���������/������� �� ���� ������. �������� ����������� ������, ������������� ������ � ������� ������ ������������ ��������� ������ (WLProbePointZDialog()).
��� ������ ��������� �� �������� �������� ���������/�������.

WLProbeCirc4XYDialog() - ����� ������ �������� ���������/������� �� ������ ������. ������� ���� ������(��������), ������������� ������ � ������� ������ ������������ ��������� ������ (WLProbePointZDialog()). 
��� ������ ��������� �� �������� �������� ���������/�������.

WLProbeRotXYDialog() - ����� ���� �������� �� ���� �����. ������� ����������� �������� WLProbeRotXYDialog(), ������ ������ � ������� ������ ������������ ��������� ������ (WLProbePointZDialog()). 
��� ������ ��������� ��� ����� �������� ���� �����.

WLProbeQuadXYDialog() - ����� ������� �����������/��������� ���� �� ���� �����. ������� ��������� ������� �� ����, �������� ���������� ���� � ������� ������ ������������ ��������� ������ (WLProbePointZDialog()). 
��� ������ ��������� ��� �����

WLProbeHDialog() - ����� ����� ����. ����������� �������������� ����� ���� (��� ��� �����������)
��� ������ ��������� ��� ������������ ��������� ����� ����

WLProbeAutoHDialog() - �������������� ����� ����� ����.  ����������� �������������� ����� ���� (��� ��� �����������)
��� ����������� �� ������ G53 Z0 � ������������ � ����� ������ ����� ����, ����������. ����� �������� ��� � ����������� �� ������ G53 Z0.

WLProbeOffsetXYDialog() - ����� �������� ������ ���� ������������ ���. ����������� ������� �������������� ��������� (�������� - �������). 
��� ������ ��������� ������ �������������� ���������.

WLProbeAutoOffsetXYDialog() - ����� �������� ������ ���� � �������������� ������. ������� �������������� ��������� (�������� - �������) ������� �� ����� ini(WLProbe.ini/AutoOffsetXYDialog/Diam). 
��� ����������� �� ������ G53 Z0 � ������������ � ����� ������ ��������, ����������. ����� �������� ��� � ����������� �� ������ G53 Z0.
*/

//�� �������� ���� ���� WLProbe.js!!!
//��� ��������� � WLProbe.ini ������� ��������� � ����� � WLProbe.js. ���� ����� WLProbe.ini ���, �� �� ����� ������ �������������.
//��������� �� ���������

var WLProbeF1Probe  =   250 //�������� ������� ������� � ��/���
var WLProbeF2Probe  =    50 //�������� ������� ������� � ��/���
var WLProbeHsize    =     0 //������ ���� �� ������ ����� ������� (���� ������) �� ������ ������� ����� ���� 
var WLProbeHeadDiam  =    2 //������� ������ ����
var WLProbeBackDist  =    5 //���������� ������ ��� ������� �������
var WLProbeFindDistXY  = 10 //���������� ������ XY �� ����� ��������(��������������). ��� �� ����� ���������� �� �������������� ����� �������� ��� ���������.
var WLProbeFindDistXY_A =  5 //���������� ������ XY ����� �������������� ����� �������� (after).
var WLProbeFindDistZ =   10 //���������� ������ Z
var WLProbeFindDistZ_A = 10 //���������� ������ Z ����� �������������� ����� �������� (after).
var WLProbeSDStop    =    1 //���������(1)/����������(0) ������� ���������

var WLProbeXYbaseZ       = 0//������� ������
var WLProbeXYbaseZvalid  = 1

var WLProbeDX    =   0 //��������(�����������) �� X
var WLProbeDY    =   0 //��������(�����������) �� Y

var WLProbeDXDYvalid = 0

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
WLPROBEBUTTON.addButtonMenu("Point  Z","WLProbePointZDialog()")
WLPROBEBUTTON.addButtonMenu("Point XY","WLProbePointXYDialog()")
WLPROBEBUTTON.addButtonMenu("Size  XY","WLProbeSizeXYDialog()")
WLPROBEBUTTON.addButtonMenu("Circ3 XY","WLProbeCirc3XYDialog()")
WLPROBEBUTTON.addButtonMenu("Circ4 XY","WLProbeCirc4XYDialog()")
WLPROBEBUTTON.addButtonMenu("Rot   XY","WLProbeRotXYDialog()")
WLPROBEBUTTON.addButtonMenu("Quad  XY","WLProbeQuadXYDialog()")
WLPROBEBUTTON.addButtonMenu("Hsize","WLProbeHDialog()")
WLPROBEBUTTON.addButtonMenu("AutoHsize","WLProbeAutoHDialog()")
WLPROBEBUTTON.addButtonMenu("OfsetXY","WLProbeOffsetXYDialog()")
WLPROBEBUTTON.addButtonMenu("AutoOfstXY","WLProbeAutoOffsetXYDialog()")


WLPROBEBUTTON.setEnabledSub(1,0)
WLPROBEBUTTON.setEnabledSub(2,0)
WLPROBEBUTTON.setEnabledSub(3,0)
WLPROBEBUTTON.setEnabledSub(4,0)
WLPROBEBUTTON.setEnabledSub(5,0)
WLPROBEBUTTON.setEnabledSub(6,0)
}

function WLProbeInitValue()
{		
WLProbeF1Probe =FILE.loadValue(WLProbeFileINI,"F1Probe" ,WLProbeF1Probe);
WLProbeF2Probe =FILE.loadValue(WLProbeFileINI,"F2Probe" ,WLProbeF2Probe);
WLProbeHeadDiam=FILE.loadValue(WLProbeFileINI,"HeadDiam",WLProbeHeadDiam);
WLProbeBackDist=FILE.loadValue(WLProbeFileINI,"BackDist",WLProbeBackDist); 
WLProbeSDStop  =FILE.loadValue(WLProbeFileINI,"SDStop",WLProbeSDStop); 
WLProbeHsize   =FILE.loadValue(WLProbeFileINI,"Hsize",WLProbeHsize); 

  WLProbeFindDistXY=FILE.loadValue(WLProbeFileINI,"FindDistXY",WLProbeFindDistXY);
WLProbeFindDistXY_A=FILE.loadValue(WLProbeFileINI,"FindDistXY_A",WLProbeFindDistXY_A);
   WLProbeFindDistZ=FILE.loadValue(WLProbeFileINI,"FindDistZ", WLProbeFindDistZ); 
 WLProbeFindDistZ_A=FILE.loadValue(WLProbeFileINI,"FindDistZ_A", WLProbeFindDistZ_A); 

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
FILE.saveValue(WLProbeFileINI,"Hsize",WLProbeHsize); 

FILE.saveValue(WLProbeFileINI,"FindDistXY",WLProbeFindDistXY);
FILE.saveValue(WLProbeFileINI,"FindDistXY_A",WLProbeFindDistXY_A);
FILE.saveValue(WLProbeFileINI,"FindDistZ", WLProbeFindDistZ); 
FILE.saveValue(WLProbeFileINI,"FindDistZ_A", WLProbeFindDistZ_A); 
}

function WLProbeCheckInProbe()
{
while(MACHINE.getInProbe()){	
	if(!DIALOG.question("������ inProbe �� �������. ��������.")) return 0;
    }	

return 1	
}

function WLProbeNReady()
{
if(WLProbeXYbaseZvalid){
	DIALOG.message("������� ����� ���������� ��������� ������ Probe Z");
	return 1;
    }	
	
if(WLProbeCheckInProbe()==0) 
	return 1	

return 0;	
}

function WLProbeOffsetXY(Diam)//����� �������� ����
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

if(!DIALOG.question("��������� ��� �� 180 ��������. ������ ��������� ������ �������������� ��� ������������."))   return 0;

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

function WLProbeOffsetXYDialog()//����� �������� ����
{
var Diam=20

Diam=FILE.loadValue(WLProbeFileINI,"OffsetXYDialog/Diam",Diam);	 		
	
Diam=DIALOG.enterNum("��� ������ ��������� ������ ������. ������� ���������� ������� ������:",Diam)
if(DIALOG.isCancel()) return 0	

FILE.saveValue(WLProbeFileINI,"OffsetXYDialog/Diam",Diam);	

return WLProbeOffsetXY(Diam)	
}

function WLProbeAutoOffsetXY()//����� �������� ����
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
DIALOG.question("������ ����� �� �������! ����� ������������ � ������� ���������� enable � ����� WLProbe.ini")  
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

function WLProbeAutoOffsetXYDialog()//����� �������� ����
{	
return WLProbeAutoOffsetXY()
}

function WLProbeH(Lmax)//����� ����� ����
{
WLProbeInitValue()
	 
var X=MACHINE.getCurPosition("X")
var Y=MACHINE.getCurPosition("Y")
var Z=MACHINE.getCurPosition("Z")
var Hsize=0
var Dist=WLProbeFindDistZ
var DistA=WLProbeFindDistZ_A
var Z=0

Dist =FILE.loadValue(WLProbeFileINI,"AutoHDialog/FindDist",Dist);  
DistA=FILE.loadValue(WLProbeFileINI,"AutoHDialog/FindDist_A",DistA);  

Z=FILE.loadValue(WLProbeFileINI,"AutoHDialog/Z",Z);  

FILE.saveValue(WLProbeFileINI,"AutoHDialog/FindDist",Dist);  
FILE.saveValue(WLProbeFileINI,"AutoHDialog/FindDist_A",DistA);  

FILE.saveValue(WLProbeFileINI,"AutoHDialog/Z",Z);  

SCRIPT.console("WLProbeH Hsize= "+Hsize.toFixed(3));

if(WLProbeCheckInProbe()==0) return 0


MACHINE.clearGProbe();
MACHINE.enableDoubleGProbe(1);

MACHINE.addGProbeZ(X,Y,Z+Lmax,Dist,DistA);

MACHINE.goGProbe();
while(MACHINE.isActiv()) SCRIPT.process()

Hsize=MACHINE.getGProbe(0,"Z")-Z 

FILE.saveValue(WLProbeFileINI,"Hsize",Hsize); 

SCRIPT.console("WLProbeH Hsize= "+Hsize.toFixed(3));

return 1;
}

function WLProbeHDialog()//����� ����� ����
{
WLProbeInitValue()
	 
var Lmax=20
var X=MACHINE.getCurPosition("X")
var Y=MACHINE.getCurPosition("Y")
var Z=0

Lmax=FILE.loadValue(WLProbeFileINI,"HDialog/Lmax",Lmax);	
   Z=FILE.saveValue(WLProbeFileINI,"HDialog/Z",Z);   
 	 
FILE.saveValue(WLProbeFileINI,"HDialog/Lmax",Lmax);	
FILE.saveValue(WLProbeFileINI,"HDialog/Z",Z);   

if(WLProbeCheckInProbe()==0) return 0	

Lmax=DIALOG.enterNum("������� ���������� ���� ���� (�� ���� ������������)",Lmax)
if(DIALOG.isCancel()) return 0

FILE.saveValue(WLProbeFileINI,"HDialog/Lmax",Lmax);	

WLProbeH(Lmax)

return 1;
}


function WLProbeAutoHDialog()//����� ����� ����, ������
{
WLProbeInitValue()
	 
var Lmax=20
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
  Lmax=FILE.loadValue(WLProbeFileINI,"AutoHDialog/Lmax",Lmax);	 

FILE.saveValue(WLProbeFileINI,"AutoHDialog/enable",enable);
FILE.saveValue(WLProbeFileINI,"AutoHDialog/X",X);
FILE.saveValue(WLProbeFileINI,"AutoHDialog/Y",Y);
FILE.saveValue(WLProbeFileINI,"AutoHDialog/Z",Z); 	 
FILE.saveValue(WLProbeFileINI,"AutoHDialog/Lmax",Lmax);	

if(WLProbeCheckInProbe()==0) return 0	

if(!enable) {
DIALOG.question("������ ����� �� �������! ����� ������������ � ������� ���������� enable � ����� WLProbe.ini")  
return 0
}
else
{	
Lmax=DIALOG.enterNum("������� ������������ ����� ���� (�� ���� ������������)",Lmax)
if(DIALOG.isCancel())  return 0

MACHINE.runGCode("G53G90G0 Z0") 
MACHINE.runGCode("G53G90G0 X"+X+"Y"+Y) 
while(MACHINE.isActiv()) SCRIPT.process()

FILE.saveValue(WLProbeFileINI,"AutoHDialog/Lmax",Lmax);	

if(WLProbeH(Lmax)==0) 
	return 0;

MACHINE.runGCode("G53G90G0 Z0")
 
while(MACHINE.isActiv()) SCRIPT.process()


 Hsize=FILE.loadValue(WLProbeFileINI,"Hsize",Hsize); 

SCRIPT.console("WLProbeHDialog Hsize= "+Hsize.toFixed(3));
}

return 1;
}

function WLProbePointZ(X,Y,Z,Depth)//����� ���������
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

function WLProbePointZDialog()//����� ���������
{
var X
var Y
var Z
var Dist=20
var Hzise=0

if(WLProbeCheckInProbe()==0) return 0	

Hsize=FILE.loadValue(WLProbeFileINI,"Hsize",WLProbeHsize); 
Dist=FILE.loadValue(WLProbeFileINI,"PointZDialog/Dist",Dist);

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")
Z=MACHINE.getCurPosition("Z")

Dist=DIALOG.enterNum("������� ��������� ������ ���������:",Dist)
if(DIALOG.isCancel()||Dist<=0)  return 0

FILE.saveValue(WLProbeFileINI,"PointZDialog/Dist",Dist);

Z=WLProbePointZ(X,Y,Z-Dist,Dist)

DIALOG.question("������� ��������� Z �� 0 � ������� ��?")
 
if(DIALOG.isOk()) 
     {
	 GCODE.push()	 
	 MACHINE.runGCode("G49")
	 MACHINE.setCurPositionSC("Z",(MACHINE.getCurPosition("Z")-Z)+Hsize);
	 GCODE.pop()	 
	 }
    
WLProbeXYbaseZ=Z

WLProbeXYbaseZvalid=0

WLPROBEBUTTON.setEnabledSub(1,1)
WLPROBEBUTTON.setEnabledSub(2,1)
WLPROBEBUTTON.setEnabledSub(3,1)
WLPROBEBUTTON.setEnabledSub(4,1)
WLPROBEBUTTON.setEnabledSub(5,1)
WLPROBEBUTTON.setEnabledSub(6,1)

return 1
}

function WLProbePointXY(X,Y,A,Depth) //������� ����� �������� "��� �����" � ��������� XY
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

function WLProbePointXYDialog() //������� ����� �������� "��� �����"
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

DIALOG.enterNum("������� ���� ������ =",A)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  A=DIALOG.getNum();
else
  return 0

Depth=DIALOG.enterNum("������� �������� ��������� ������ (ProbeZ)",Depth)
if(DIALOG.isCancel()) return 0

FILE.saveValue(WLProbeFileINI,"PointXYDialog/A",A);
FILE.saveValue(WLProbeFileINI,"LastDialog/Depth",Depth);

var data=WLProbePointXY(X,Y,A,WLProbeXYbaseZ+Depth);

MACHINE.runGCode("G53G0 X"+data[0]+" Y"+data[1].toFixed(3))
while(MACHINE.isActiv()) SCRIPT.process()

return 1;
}

function WLProbeSizeXY(X,Y,A,R,Depth) //����� �������� �������/�������, ��� �� ��������
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

function WLProbeSizeXYDialog() //����� �������� �������/�������, ��� �� ��������
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


R=DIALOG.enterNum("������� ����������+ (��������-)  ������ =",R*2)/2
if(DIALOG.isCancel()||R==0) return 0

DIALOG.enterNum("������� ���� �������� (��) =",A)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  A=DIALOG.getNum();
else
  return 0

Depth=DIALOG.enterNum("������� �������� ��������� ������ (ProbeZ)",Depth)
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

R=DIALOG.enterNum("������� ����������+ (��������-)  ������� =",R*2)/2
if(DIALOG.isCancel()||R==0) return 0

A=DIALOG.enterNum("������� ���� �������� (��) =",A)
if(DIALOG.isCancel()) return 0

Depth=DIALOG.enterNum("������� �������� ��������� ������ (ProbeZ)",Depth)
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
     // ���� ����� ����� �� ����� �����, 
     // ��� �� ���������� ���������,
     // �� ���������� ������� �� ���������
   return ; 
   }
   // ���������� ������
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

if(WLProbeNReady())	return;

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")
	
A1=FILE.loadValue(WLProbeFileINI,"Circ3XYDialog/A1",A1);
A2=FILE.loadValue(WLProbeFileINI,"Circ3XYDialog/A2",A2);
A3=FILE.loadValue(WLProbeFileINI,"Circ3XYDialog/A3",A3);
R=FILE.loadValue(WLProbeFileINI,"Circ3XYDialog/R",R);
Depth=FILE.loadValue(WLProbeFileINI,"lastDialog/Depth",Depth);

R=DIALOG.enterNum("������� ����������+ (��������-)  ������� =",R*2)/2
if(DIALOG.isCancel()||R==0) return 0

A1=DIALOG.enterNum("������� ���� �������� N1 (��) =",A1)
if(DIALOG.isCancel()) return 0

A2=DIALOG.enterNum("������� ���� �������� N2 (��) =",A2)
if(DIALOG.isCancel()) return 0

A3=DIALOG.enterNum("������� ���� �������� N3 (��) =",A3)
if(DIALOG.isCancel()) return 0

Depth=DIALOG.enterNum("������� �������� ��������� ������ (ProbeZ)",Depth)
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

R=DIALOG.enterNum("������� ����� �� ���� ���������+ (��������-) =",R)
if(DIALOG.isCancel()||R==0) return 0

Q=DIALOG.enterNum("������� �������� 1-4",Q)
if(DIALOG.isCancel()||Q<1||Q>5) return 0

Depth=DIALOG.enterNum("������� �������� ��������� ������ (ProbeZ)",Depth)
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

function WLProbeRotXY(X,Y,A,R,Depth) //����� ��������, ��� �� �������� ������
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

function WLProbeRotXYDialog() //����� ��������, ��� �� �������� ������
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

R=DIALOG.enterNum("������� ������ ������ =",R*2)/2
if(DIALOG.isCancel()) return 0

A=DIALOG.enterNum("������� ����������� ������ (��) =",A)
if(DIALOG.isCancel()) return 0

Depth=DIALOG.enterNum("������� �������� ��������� ������ (ProbeZ)",Depth)
if(DIALOG.isCancel()) return 0

FILE.saveValue(WLProbeFileINI,"RotXYDialog/R",R);
FILE.saveValue(WLProbeFileINI,"RotXYDialog/A",A);
FILE.saveValue(WLProbeFileINI,"lastDialog/Depth",Depth);

A=WLProbeRotXY(X,Y,A,R,WLProbeXYbaseZ+Depth)

MACHINE.runGCode("G53G0 X"+X.toFixed(3)+" Y"+Y.toFixed(3))

while(MACHINE.isActiv()) SCRIPT.process()

return 1
}
