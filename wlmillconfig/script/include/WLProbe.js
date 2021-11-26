
/*
WLProbe - ������� ������ ������ ��������� � � ���������.
���������:
 1.�������� ���� ���� (WLProbe.js) � ����� /wlmillconfig/script/include
 2.����������,  �������� � MScript.
   function init()
   {
   SCRIPT.includeFile("/include/WLProbe.js")
   ....	   
   }
 3. �� ��������� ������ WLProbe.js ������������� ������ ����� ������� �� ������ buttonUserFunc1  
    � ������� WLProbeInit().  

17/11/2021 - ������ �����


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
*/

//�� �������� ���� ���� WLProbe.js!!!
//��� ��������� � WLProbe.ini ������� ��������� � ����� � WLProbe.js. ���� ����� WLProbe.ini ���, �� �� ����� ������ �������������.
//��������� �� ���������

var WLProbeF1Probe  =  250 //�������� ������� ������� � ��/���
var WLProbeF2Probe  =  50  //�������� ������� ������� � ��/���
var WLProbeHeadDiam  =  2   //������� ������ ����
var WLProbeBackDist  =  5   //���������� ������ ��� ������� �������
var WLProbeFindDistXY= 10   //���������� ������ XY, "������" � ���� 1,5. �� ���� ���� ������ 10��
                            //, �� ��� ���������� �� 10 �� �� ����� ������� (��������������) � ���� 15 �� � ������ ��������.
var WLProbeFindDistZ = 10   //���������� ������ Z
var WLProbeSDStop    = 1//��������� ������� ���������

var WLProbeXYbaseZ       = 0//������� ������
var WLProbeXYbaseZempty  = 1

var WLProbeButton=buttonUserFunc1

function WLProbeInit()
{
WLProbeButton.setVisible(1);
WLProbeButton.setIcon("WLProbe.png")
WLProbeButton.setToolTip("Probe")

WLProbeButton.setScript("");

WLProbeButton.clearMenu() 
WLProbeButton.addButtonMenu("Point  Z","WLProbePointZDialog()")
WLProbeButton.addButtonMenu("Point XY","WLProbePointXYDialog()")
WLProbeButton.addButtonMenu("Size  XY","WLProbeSizeXYDialog()")
WLProbeButton.addButtonMenu("Circ3 XY","WLProbeCirc3XYDialog()")
WLProbeButton.addButtonMenu("Circ4 XY","WLProbeCirc4XYDialog()")
WLProbeButton.addButtonMenu("Rot   XY","WLProbeRotXYDialog()")
WLProbeButton.addButtonMenu("Quad  XY","WLProbeQuadXYDialog()")

WLProbeButton.setEnabledSub(1,0)
WLProbeButton.setEnabledSub(2,0)
WLProbeButton.setEnabledSub(3,0)
WLProbeButton.setEnabledSub(4,0)
WLProbeButton.setEnabledSub(5,0)
WLProbeButton.setEnabledSub(6,0)

WLProbeInitValue();
}

function WLProbeInitValue()
{		
WLProbeF1Probe =FILE.loadValue(WLProbeFileINI,"F1Probe" ,WLProbeF1Probe);
WLProbeF2Probe =FILE.loadValue(WLProbeFileINI,"F2Probe" ,WLProbeF2Probe);
WLProbeHeadDiam=FILE.loadValue(WLProbeFileINI,"HeadDiam",WLProbeHeadDiam);
WLProbeBackDist=FILE.loadValue(WLProbeFileINI,"BackDist",WLProbeBackDist); 
WLProbeSDStop  =FILE.loadValue(WLProbeFileINI,"SDStop",WLProbeSDStop); 

WLProbeFindDistXY=FILE.loadValue(WLProbeFileINI,"FindDistXY",WLProbeFindDistXY);
 WLProbeFindDistZ=FILE.loadValue(WLProbeFileINI,"FindDistZ", WLProbeFindDistZ); 

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

FILE.saveValue(WLProbeFileINI,"FindDistXY",WLProbeFindDistXY);
FILE.saveValue(WLProbeFileINI,"FindDistZ", WLProbeFindDistZ); 
}

function WLProbeNReady()
{
if(WLProbeXYbaseZempty){
	DIALOG.message("������� ����� ���������� ��������� ������ Probe Z");
	return 1;
    }	
	
if(MACHINE.getInProbe()){
	DIALOG.message("������ inProbe �� �������");
	return 1;
    }	
	
return 0;	
}

function WLProbePointZ(X,Y,Z,Depth)//����� ���������
{
WLProbeInitValue()
	 
MACHINE.clearGProbe();
MACHINE.enableDoubleGProbe(1);

MACHINE.addGProbeZ(X,Y,Z,Depth);

MACHINE.goGProbe();
while(MACHINE.isActiv());

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

if(MACHINE.getInProbe()){
	DIALOG.message("������ inProbe �� �������");
	return;
    }	

Dist=FILE.loadValue(WLProbeFileINI,"PointZDialog/Dist",Dist);

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")
Z=MACHINE.getCurPosition("Z")

DIALOG.enterNum("������� ��������� ������ ���������:",Dist)
while(DIALOG.isShow());

if(DIALOG.isOk()&&DIALOG.getNum()>0) 	
  Dist=DIALOG.getNum();
else
  return

FILE.saveValue(WLProbeFileINI,"PointZDialog/Dist",Dist);

Z=WLProbePointZ(X,Y,Z-Dist,Dist)

DIALOG.question("������� ��������� Z �� 0 � ������� ��?")
 while(DIALOG.isShow()); 

if(DIALOG.isOk()) 
	 MACHINE.setCurPositionSC("Z",(MACHINE.getCurPosition("Z")-Z));
    
WLProbeXYbaseZ=Z

WLProbeXYbaseZempty=0

WLProbeButton.setEnabledSub(1,1)
WLProbeButton.setEnabledSub(2,1)
WLProbeButton.setEnabledSub(3,1)
WLProbeButton.setEnabledSub(4,1)
WLProbeButton.setEnabledSub(5,1)
WLProbeButton.setEnabledSub(6,1)
}

function WLProbePointXY(X,Y,A,Depth) //������� ����� �������� "��� �����" � ��������� XY
{
WLProbeInitValue()
	
MACHINE.clearGProbe();

MACHINE.enableDoubleGProbe(1);
MACHINE.addGProbeXY(X,Y,Depth,A,WLProbeFindDistXY);
MACHINE.goGProbe();

while(MACHINE.isActiv());

X=MACHINE.getGProbe(0,"X")
Y=MACHINE.getGProbe(0,"Y")

SCRIPT.console("WLProbePointXY X="+X.toFixed(3)+" Y="+Y.toFixed(3))

return [X,Y]
}

function WLProbePointXYDialog() //������� ����� �������� "��� �����"
{
var X
var Y
var A=0
var Depth=-WLProbeHeadDiam/2

if(WLProbeNReady())	return;

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")

A=FILE.loadValue(WLProbeFileINI,"PointXYDialog/A",A);
Depth=FILE.loadValue(WLProbeFileINI,"LastDialog/Depth",Depth);

DIALOG.enterNum("������� ���� ������ =",A)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  A=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� �������� ��������� ������ (ProbeZ)",Depth)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  Depth=DIALOG.getNum();
else
  return

FILE.saveValue(WLProbeFileINI,"PointXYDialog/A",A);
FILE.saveValue(WLProbeFileINI,"LastDialog/Depth",Depth);

var data=WLProbePointXY(X,Y,A,WLProbeXYbaseZ+Depth);

MACHINE.runGCode("G53G0 X"+data[0]+" Y"+data[1].toFixed(3))
}

function WLProbeSizeXY(X,Y,A,R,Depth) //����� �������� �������/�������, ��� �� ��������
{
WLProbeInitValue()
	
var dX
var dY
var R
var Dist=WLProbeFindDistXY

var Ar=A*Math.PI/180.0

if(R!=0){

 if((R>0)&&(R<Dist)) {
 Dist=R
 }
 
 dX=R*Math.cos(Ar)
 dY=R*Math.sin(Ar)
 	 
 MACHINE.clearGProbe();
 
 MACHINE.enableDoubleGProbe(1);
 
 MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A,Dist); 
 MACHINE.addGProbeXY(X-dX,Y-dY,Depth,A-180,Dist);
 
 MACHINE.goGProbe();
 
 while(MACHINE.isActiv());
 
 X=(MACHINE.getGProbe(0,"X")+MACHINE.getGProbe(1,"X"))/2
 Y=(MACHINE.getGProbe(0,"Y")+MACHINE.getGProbe(1,"Y"))/2
 
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

if(WLProbeNReady())	return;

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")
	
A=FILE.loadValue(WLProbeFileINI,"SizeXYDialog/A",A);
R=FILE.loadValue(WLProbeFileINI,"SizeXYDialog/R",R);
Depth=FILE.loadValue(WLProbeFileINI,"lastDialog/Depth",Depth);


DIALOG.enterNum("������� ����������+ (��������-)  ������ =",R*2)
while(DIALOG.isShow());
if(DIALOG.isOk()&&DIALOG.getNum()!=0) 
  R=DIALOG.getNum()/2;
else
  return

DIALOG.enterNum("������� ���� �������� (��) =",A)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  A=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� �������� ��������� ������ (ProbeZ)",Depth)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  Depth=DIALOG.getNum();
else
  return

FILE.saveValue(WLProbeFileINI,"SizeXYDialog/A",A);
FILE.saveValue(WLProbeFileINI,"SizeXYDialog/R",R);
FILE.saveValue(WLProbeFileINI,"lastDialog/Depth",Depth);

var data = WLProbeSizeXY(X,Y,A,R,WLProbeXYbaseZ+Depth)

MACHINE.runGCode("G53G0 X"+data[0].toFixed(3)+" Y"+data[1].toFixed(3))

while(MACHINE.isActiv());
}

function WLProbeCirc4XY(X,Y,A,R,Depth)
{
WLProbeInitValue()
	
var dX
var dY
var R
var Dist=WLProbeFindDistXY

if(R!=0){
 var Ar=A*Math.PI/180.0
 
 if((R>0)&&(R<Dist)){
 Dist=R
 }
 
 dX=R*Math.cos(Ar)
 dY=R*Math.sin(Ar)
 
 MACHINE.clearGProbe();
 
 MACHINE.enableDoubleGProbe(0);
 
 MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A,Dist); 
 MACHINE.addGProbeXY(X-dX ,Y -dY,Depth,A-180,Dist);
 
 MACHINE.goGProbe();
 while(MACHINE.isActiv());
 
 X=(MACHINE.getGProbe(0,"X")+MACHINE.getGProbe(1,"X"))/2
 Y=(MACHINE.getGProbe(0,"Y")+MACHINE.getGProbe(1,"Y"))/2
 
 MACHINE.clearGProbe();
 
 MACHINE.enableDoubleGProbe(1);
 
 MACHINE.addGProbeXY(X-dY,Y+dX,Depth,A+90,Dist);
 MACHINE.addGProbeXY(X+dY, Y-dX,Depth,A-90,Dist);
 
 MACHINE.goGProbe();
 
 while(MACHINE.isActiv());
 
 X=(MACHINE.getGProbe(0,"X")+MACHINE.getGProbe(1,"X"))/2
 Y=(MACHINE.getGProbe(0,"Y")+MACHINE.getGProbe(1,"Y"))/2
 
 var dx=MACHINE.getGProbe(0,"X")-MACHINE.getGProbe(1,"X")
 var dy=MACHINE.getGProbe(0,"Y")-MACHINE.getGProbe(1,"Y")
 
 var Diam1=Math.sqrt(dx*dx+dy*dy);
 
 MACHINE.clearGProbe();
 
 MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A,Dist); 
 MACHINE.addGProbeXY(X-dX ,Y -dY,Depth,A-180,Dist);
 
 MACHINE.goGProbe();
 while(MACHINE.isActiv());
 
 X=(MACHINE.getGProbe(0,"X")+MACHINE.getGProbe(1,"X"))/2
 Y=(MACHINE.getGProbe(0,"Y")+MACHINE.getGProbe(1,"Y"))/2
 
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

if(WLProbeNReady())	return;

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")
	
A=FILE.loadValue(WLProbeFileINI,"Circ4XYDialog/A",A);
R=FILE.loadValue(WLProbeFileINI,"Circ4XYDialog/R",R);
Depth=FILE.loadValue(WLProbeFileINI,"lastDialog/Depth",Depth);

DIALOG.enterNum("������� ����������+ (��������-)  ������� =",R*2)
while(DIALOG.isShow());

if(DIALOG.isOk()&&DIALOG.getNum()!=0) 
  R=DIALOG.getNum()/2;
else
  return

DIALOG.enterNum("������� ���� �������� (��) =",A)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  A=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� �������� ��������� ������ (ProbeZ)",Depth)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  Depth=DIALOG.getNum();
else
  return

FILE.saveValue(WLProbeFileINI,"Circ4XYDialog/A",A);
FILE.saveValue(WLProbeFileINI,"Circ4XYDialog/R",R);
FILE.saveValue(WLProbeFileINI,"lastDialog/Depth",Depth);

var data=WLProbeCirc4XY(X,Y,A,R,WLProbeXYbaseZ+Depth)

MACHINE.runGCode("G53 G0 X"+data[0].toFixed(3)+" Y"+data[1].toFixed(3))

while(MACHINE.isActiv());
}


function WLProbeCirc3XY(X,Y,A1,A2,A3,R,Depth) 
{
WLProbeInitValue()
	
var dX
var dY
var dA=0
var Dist=WLProbeFindDistXY
 
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
 
 MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A1+dA,Dist); 
 
 dX=R*Math.cos(Ar2)
 dY=R*Math.sin(Ar2)
 
 MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A2+dA,Dist); 
 
 dX=R*Math.cos(Ar3)
 dY=R*Math.sin(Ar3)
 
 MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A3+dA,Dist); 
 
 MACHINE.goGProbe();
 
 while(MACHINE.isActiv());
 
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
 X = (D * E - B * F) / G;
 Y = (A * F - C * E) / G;
 
 var R = Math.sqrt(Math.pow(MACHINE.getGProbe(0,"X") - X, 2) + Math.pow(MACHINE.getGProbe(0,"Y") - Y, 2));
 var D = R+R;
 
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

DIALOG.enterNum("������� ����������+ (��������-)  ������� =",R*2)
while(DIALOG.isShow());

if(DIALOG.isOk()&&DIALOG.getNum()!=0) 
  R=DIALOG.getNum()/2;
else
  return

DIALOG.enterNum("������� ���� �������� N1 (��) =",A1)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  A1=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� ���� �������� N2 (��) =",A2)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  A2=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� ���� �������� N3 (��) =",A3)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  A3=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� �������� ��������� ������ (ProbeZ)",Depth)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  Depth=DIALOG.getNum();
else
  return

FILE.saveValue(WLProbeFileINI,"Circ3XYDialog/A1",A1);
FILE.saveValue(WLProbeFileINI,"Circ3XYDialog/A2",A2);
FILE.saveValue(WLProbeFileINI,"Circ3XYDialog/A3",A3);
FILE.saveValue(WLProbeFileINI,"Circ3XYDialog/R",R);
FILE.saveValue(WLProbeFileINI,"lastDialog/Depth",Depth);

var data=WLProbeCirc3XY(X,Y,A1,A2,A3,R,WLProbeXYbaseZ+Depth)

X=data[0]
Y=data[1]

MACHINE.runGCode("G53 G0 X"+X.toFixed(3)+" Y"+Y.toFixed(3))

while(MACHINE.isActiv());
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
case 1: MACHINE.addGProbeXY(X+0,Y+R,Depth,180+A,WLProbeFindDistXY); 
        MACHINE.addGProbeXY(X+R,Y+0,Depth,-90+A,WLProbeFindDistXY);
        break

case 2: MACHINE.addGProbeXY(X+0,Y+R,Depth,  0+A,WLProbeFindDistXY); 
        MACHINE.addGProbeXY(X-R,Y+0,Depth,-90+A,WLProbeFindDistXY);
        break

case 3: MACHINE.addGProbeXY(X+0,Y-R,Depth,  0+A,WLProbeFindDistXY); 
        MACHINE.addGProbeXY(X-R,Y+0,Depth, 90+A,WLProbeFindDistXY);
        break

case 4: MACHINE.addGProbeXY(X+0,Y-R,Depth,180+A,WLProbeFindDistXY); 
        MACHINE.addGProbeXY(X+R,Y+0,Depth, 90+A,WLProbeFindDistXY);
        break
		
default: return [X,Y]	
}

MACHINE.goGProbe();
while(MACHINE.isActiv());

X=MACHINE.getGProbe(0,"X")
Y=MACHINE.getGProbe(1,"Y")

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

if(WLProbeNReady())	return;

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")
	
R=FILE.loadValue(WLProbeFileINI,"QuadXYDialog/R",R);
Q=FILE.loadValue(WLProbeFileINI,"QuadXYDialog/Q",Q);
Depth=FILE.loadValue(WLProbeFileINI,"lastDialog/Depth",Depth);

DIALOG.enterNum("������� ����� �� ���� ���������+ (��������-) =",R)
while(DIALOG.isShow());

if(DIALOG.isOk()&&DIALOG.getNum()!=0) 
  R=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� �������� 1-4",Q)
while(DIALOG.isShow());

if(DIALOG.isOk()&&DIALOG.getNum()>0&&DIALOG.getNum()<5) 
 Q=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� �������� ��������� ������ (ProbeZ)",Depth)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  Depth=DIALOG.getNum();
else
  return

FILE.saveValue(WLProbeFileINI,"QuadXYDialog/R",R);
FILE.saveValue(WLProbeFileINI,"QuadXYDialog/Q",Q);
FILE.saveValue(WLProbeFileINI,"lastDialog/Depth",Depth);

var data=WLProbeQuadXY(X,Y,Q,R,WLProbeXYbaseZ+Depth)

X=data[0]
Y=data[1]

MACHINE.runGCode("G53G0 X"+X.toFixed(3)+" Y"+Y.toFixed(3))

while(MACHINE.isActiv());
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

MACHINE.addGProbeXY(X-dY,Y+dX,Depth,A,WLProbeFindDistXY); 
MACHINE.addGProbeXY(X+dY ,Y -dX,Depth,A,WLProbeFindDistXY);

MACHINE.goGProbe();

while(MACHINE.isActiv());

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

if(WLProbeNReady())	return;

X=MACHINE.getCurPosition("X")
Y=MACHINE.getCurPosition("Y")
	
R=FILE.loadValue(WLProbeFileINI,"RotXYDialog/R",R);
A=FILE.loadValue(WLProbeFileINI,"RotXYDialog/A",A);
Depth=FILE.loadValue(WLProbeFileINI,"lastDialog/Depth",Depth);

DIALOG.enterNum("������� ������ ������ =",R*2)
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()&&DIALOG.getNum()>10) 
  R=DIALOG.getNum()/2;
else
  return

DIALOG.enterNum("������� ����������� ������ (��) =",A)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  A=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� �������� ��������� ������ (ProbeZ)",Depth)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  Depth=DIALOG.getNum();
else
  return

FILE.saveValue(WLProbeFileINI,"RotXYDialog/R",R);
FILE.saveValue(WLProbeFileINI,"RotXYDialog/A",A);
FILE.saveValue(WLProbeFileINI,"lastDialog/Depth",Depth);

A=WLProbeRotXY(X,Y,A,R,WLProbeXYbaseZ+Depth)

MACHINE.runGCode("G53G0 X"+X.toFixed(3)+" Y"+Y.toFixed(3))

while(MACHINE.isActiv());
}
