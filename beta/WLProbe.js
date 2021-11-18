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

����������
headDiam - ������� ������ ����
backDist - ��������� ������ ����� ������� �������
findDistZ  - ���������� ������ �� Z   (���������� ������ �� ��������)
findDistXY - ���������� ������ �� X,Y (���������� ������ �� ��������)

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
var WLProbeHeadDiam  =  2
var WLProbeBackDist  =  3
var WLProbeFindDistZ = -2
var WLProbeFindDistXY= 10

function WLProbeInit()
{
var button=buttonUserFunc1

button.setVisible(1);
button.setText("Probe")

button.setScript("");

button.clearMenu() 
button.addButtonMenu("Point  Z","WLProbePointZDialog()")
button.addButtonMenu("Point XY","WLProbePointXYDialog()")
button.addButtonMenu("Size  XY","WLProbeSizeXYDialog()")
button.addButtonMenu("Circ3 XY","WLProbeCirc3XYDialog()")
button.addButtonMenu("Circ4 XY","WLProbeCirc4XYDialog()")
button.addButtonMenu("Rot   XY","WLProbeRotXYDialog()")
button.addButtonMenu("Quad  XY","WLProbeQuadXYDialog()")

WLProbeInitValue();
}

function WLProbeInitValue()
{		
WLProbeHeadDiam=VALUES.get("WLProbe/headDiam",WLProbeHeadDiam)	
WLProbeBackDist=VALUES.get("WLProbe/backDist",WLProbeBackDist)	
WLProbeFindDistZ =VALUES.get("WLProbe/findDistZ",WLProbeFindDistZ)
WLProbeFindDistXY=VALUES.get("WLProbe/findDistXY",WLProbeFindDistXY)

MACHINE.setHeadDiamGProbe(WLProbeHeadDiam)
MACHINE.setFGProbe(MACHINE.getFProbe())	
MACHINE.setBackDistGProbe(WLProbeBackDist)

VALUES.set("WLProbe/headDiam",WLProbeHeadDiam)
VALUES.set("WLProbe/backDist",WLProbeBackDist)	
VALUES.set("WLProbe/findDistZ",WLProbeFindDistZ)		
VALUES.set("WLProbe/findDistXY",WLProbeFindDistXY)
}

function WLProbePointZ(X,Y,Z,Depth)//����� ���������
{
MACHINE.clearGProbe();
MACHINE.enableDoubleGProbe(1);

MACHINE.addGProbeZ(X,Y,Z,Depth);

MACHINE.goGProbe();
while(MACHINE.isActiv());

Z=MACHINE.getGProbeSC(0,"Z")

SCRIPT.console("WLProbePointZ Z="+Z.toFixed(3))

return Z;
}

function WLProbePointZDialog()//����� ���������
{
var X
var Y
var Z
var R

X=MACHINE.getCurPositionSC("X")
Y=MACHINE.getCurPositionSC("Y")
Z=MACHINE.getCurPositionSC("Z")

DIALOG.enterNum("������� ��������� ������:",20)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  R=DIALOG.getNum();
else
  return

Z=WLProbePointZ(X,Y,Z-R,R)

MACHINE.setCurPositionSC("Z",MACHINE.getCurPositionSC("Z")-Z);
}

function WLProbePointXY(X,Y,A,Depth) //������� ����� �������� "��� �����" � ��������� XY
{
MACHINE.clearGProbe();

MACHINE.enableDoubleGProbe(1);
MACHINE.addGProbeXY(X,Y,Depth,A,WLProbeFindDistXY);
MACHINE.goGProbe();

while(MACHINE.isActiv());

X=MACHINE.getGProbeSC(0,"X")
Y=MACHINE.getGProbeSC(0,"Y")

SCRIPT.console("WLProbePointXY X="+X.toFixed(3)+" Y="+Y.toFixed(3))

return [X,Y]
}

function WLProbePointXYDialog() //������� ����� �������� "��� �����"
{
var X
var Y
var A

X=MACHINE.getCurPositionSC("X")
Y=MACHINE.getCurPositionSC("Y")

DIALOG.enterNum("������� ���� ������ =")
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  A=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� ��������� ������ (G54 Z?)",-WLProbeHeadDiam/2)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  Depth=DIALOG.getNum();
else
  return

var data=WLProbePointXY(X,Y,A,Depth);

MACHINE.runGCode("G0 X"+data[0]+" Y"+data[1].toFixed(3))
}

function WLProbeSizeXY(X,Y,A,R,Depth) //����� �������� �������/�������, ��� �� ��������
{
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
 
 X=(MACHINE.getGProbeSC(0,"X")+MACHINE.getGProbeSC(1,"X"))/2
 Y=(MACHINE.getGProbeSC(0,"Y")+MACHINE.getGProbeSC(1,"Y"))/2
 
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
var A
var Depth=-2

X=MACHINE.getCurPositionSC("X")
Y=MACHINE.getCurPositionSC("Y")

DIALOG.enterNum("������� ����������+ (��������-)  ������ =")
while(DIALOG.isShow());

if(DIALOG.isOk()&&DIALOG.getNum()!=0) 
  R=DIALOG.getNum()/2;
else
  return

DIALOG.enterNum("������� ���� �������� (��) =")
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  A=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� ��������� ������ (G54 Z?)",-WLProbeHeadDiam/2)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  Depth=DIALOG.getNum();
else
  return

var data = WLProbeSizeXY(X,Y,A,R,Depth)


MACHINE.runGCode("G0 X"+data[0].toFixed(3)+" Y"+data[1].toFixed(3))

while(MACHINE.isActiv());
}

function WLProbeCirc4XY(X,Y,A,R,Depth)
{
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
 
 X=(MACHINE.getGProbeSC(0,"X")+MACHINE.getGProbeSC(1,"X"))/2
 Y=(MACHINE.getGProbeSC(0,"Y")+MACHINE.getGProbeSC(1,"Y"))/2
 
 MACHINE.clearGProbe();
 
 MACHINE.enableDoubleGProbe(1);
 
 MACHINE.addGProbeXY(X-dY,Y+dX,Depth,A+90,Dist);
 MACHINE.addGProbeXY(X+dY, Y-dX,Depth,A-90,Dist);
 
 MACHINE.goGProbe();
 
 while(MACHINE.isActiv());
 
 X=(MACHINE.getGProbeSC(0,"X")+MACHINE.getGProbeSC(1,"X"))/2
 Y=(MACHINE.getGProbeSC(0,"Y")+MACHINE.getGProbeSC(1,"Y"))/2
 
 var dx=MACHINE.getGProbeSC(0,"X")-MACHINE.getGProbeSC(1,"X")
 var dy=MACHINE.getGProbeSC(0,"Y")-MACHINE.getGProbeSC(1,"Y")
 
 var Diam1=Math.sqrt(dx*dx+dy*dy);
 
 MACHINE.clearGProbe();
 
 MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A,Dist); 
 MACHINE.addGProbeXY(X-dX ,Y -dY,Depth,A-180,Dist);
 
 MACHINE.goGProbe();
 while(MACHINE.isActiv());
 
 X=(MACHINE.getGProbeSC(0,"X")+MACHINE.getGProbeSC(1,"X"))/2
 Y=(MACHINE.getGProbeSC(0,"Y")+MACHINE.getGProbeSC(1,"Y"))/2
 
 var dx=MACHINE.getGProbeSC(0,"X")-MACHINE.getGProbeSC(1,"X")
 var dy=MACHINE.getGProbeSC(0,"Y")-MACHINE.getGProbeSC(1,"Y")
 
 var Diam2=Math.sqrt(dx*dx+dy*dy);
 
 SCRIPT.console("WLProbeCirc4XY X="+X.toFixed(3)+" Y="+Y.toFixed(3)+" D1="+Diam1.toFixed(3)+" D2="+Diam2.toFixed(3)+" D1-D2="+(Diam1-Diam2).toFixed(3))
 }

return [X,Y]
}

function WLProbeCirc4XYDialog()
{
var X
var Y
var R
var A
var Depth=-2

X=MACHINE.getCurPositionSC("X")
Y=MACHINE.getCurPositionSC("Y")

DIALOG.enterNum("������� ����������+ (��������-)  ������� =")
while(DIALOG.isShow());

if(DIALOG.isOk()&&DIALOG.getNum()!=0) 
  R=DIALOG.getNum()/2;
else
  return

DIALOG.enterNum("������� ���� �������� (��) =")
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  A=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� ��������� ������ (G54 Z?)",-WLProbeHeadDiam/2)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  Depth=DIALOG.getNum();
else
  return

var data=WLProbeCirc4XY(X,Y,A,R,Depth)

MACHINE.runGCode("G0 X"+data[0].toFixed(3)+" Y"+data[1].toFixed(3))

while(MACHINE.isActiv());
}


function WLProbeCirc3XY(X,Y,A1,A2,A3,R,Depth) 
{
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
 
 var A = MACHINE.getGProbeSC(1,"X") - MACHINE.getGProbeSC(0,"X");
 
 var B = MACHINE.getGProbeSC(1,"Y") - MACHINE.getGProbeSC(0,"Y");
 
 var C = MACHINE.getGProbeSC(2,"X") - MACHINE.getGProbeSC(0,"X");
 
 var D = MACHINE.getGProbeSC(2,"Y") - MACHINE.getGProbeSC(0,"Y")
 
 var E = A * (MACHINE.getGProbeSC(0,"X") + MACHINE.getGProbeSC(1,"X")) + B * (MACHINE.getGProbeSC(0,"Y") + MACHINE.getGProbeSC(1,"Y"));
 
 var F = C * (MACHINE.getGProbeSC(0,"X") + MACHINE.getGProbeSC(2,"X")) + D * (MACHINE.getGProbeSC(0,"Y") + MACHINE.getGProbeSC(2,"Y"));
 
 var G = 2 * (A * (MACHINE.getGProbeSC(2,"Y") -MACHINE.getGProbeSC(1,"Y")) - B * (MACHINE.getGProbeSC(2,"X") -MACHINE.getGProbeSC(1,"X")));
 
  if (G == 0) {
     // ���� ����� ����� �� ����� �����, 
     // ��� �� ���������� ���������,
     // �� ���������� ������� �� ���������
   return ; 
   }
   // ���������� ������
 X = (D * E - B * F) / G;
 Y = (A * F - C * E) / G;
 
 var R = Math.sqrt(Math.pow(MACHINE.getGProbeSC(0,"X") - X, 2) + Math.pow(MACHINE.getGProbeSC(0,"Y") - Y, 2));
 var D = R+R;
 
 SCRIPT.console("WLProbeCirc3XY X="+X.toFixed(3)+" Y="+Y.toFixed(3)+" D="+D.toFixed(3)+" R="+R.toFixed(3));
 }

return [X,Y]
}

function WLProbeCirc3XYDialog() 
{
var X
var Y
var R
var A1
var A2
var A3
var Depth=-2

X=MACHINE.getCurPositionSC("X")
Y=MACHINE.getCurPositionSC("Y")

DIALOG.enterNum("������� ����������+ (��������-)  ������� =")
while(DIALOG.isShow());

if(DIALOG.isOk()&&DIALOG.getNum()!=0) 
  R=DIALOG.getNum()/2;
else
  return

DIALOG.enterNum("������� ���� �������� N1 (��) =")
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  A1=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� ���� �������� N2 (��) =")
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  A2=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� ���� �������� N3 (��) =")
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  A3=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� ��������� ������ (G54 Z?)",-WLProbeHeadDiam/2)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  Depth=DIALOG.getNum();
else
  return

var data=WLProbeCirc3XY(X,Y,A1,A2,A3,R,Depth)

X=data[0]
Y=data[1]

MACHINE.runGCode("G0 X"+X.toFixed(3)+" Y"+Y.toFixed(3))

while(MACHINE.isActiv());
}

function WLProbeQuadXY(X,Y,Q,R,Depth) //
{
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

X=MACHINE.getGProbeSC(0,"X")
Y=MACHINE.getGProbeSC(1,"Y")

SCRIPT.console("WLProbeQuadXY X="+X.toFixed(3)+" Y="+Y.toFixed(3))

return [X,Y]
}

function WLProbeQuadXYDialog() //
{
var X
var Y
var R
var Q
var Depth=-2

X=MACHINE.getCurPositionSC("X")
Y=MACHINE.getCurPositionSC("Y")

DIALOG.enterNum("������� ����� �� ���� ���������+ (��������-) =")
while(DIALOG.isShow());

if(DIALOG.isOk()&&DIALOG.getNum()!=0) 
  R=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� �������� 1-4")
while(DIALOG.isShow());

if(DIALOG.isOk()&&DIALOG.getNum()>0&&DIALOG.getNum()<5) 
 Q=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� ��������� ������ (G54 Z?)",-WLProbeHeadDiam/2)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  Depth=DIALOG.getNum();
else
  return

var data=WLProbeQuadXY(X,Y,Q,R,Depth)

X=data[0]
Y=data[1]

MACHINE.runGCode("G0 X"+X.toFixed(3)+" Y"+Y.toFixed(3))

while(MACHINE.isActiv());
}

function WLProbeRotXY(X,Y,A,R,Depth) //����� ��������, ��� �� �������� ������
{
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

dY=MACHINE.getGProbeSC(1,"Y")-MACHINE.getGProbeSC(0,"Y")
dX=MACHINE.getGProbeSC(1,"X")-MACHINE.getGProbeSC(0,"X")

A=Math.atan2(dY,dX)/Math.PI*180

SCRIPT.console("WLProbePotXY A="+A.toFixed(5))

return A
}

function WLProbeRotXYDialog() //����� ��������, ��� �� �������� ������
{
var X
var Y
var R
var A
var Depth=-2

X=MACHINE.getCurPositionSC("X")
Y=MACHINE.getCurPositionSC("Y")

DIALOG.enterNum("������� ������ ������ =")
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()&&DIALOG.getNum()>10) 
  R=DIALOG.getNum()/2;
else
  return

DIALOG.enterNum("������� ����������� ������ (��) =")
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  A=DIALOG.getNum();
else
  return

DIALOG.enterNum("������� ��������� ������ (G54 Z?)",-WLProbeHeadDiam/2)
while(DIALOG.isShow());

if(DIALOG.isOk()) 
  Depth=DIALOG.getNum();
else
  return

A=WLProbeRotXY(X,Y,A,R,Depth)
}
