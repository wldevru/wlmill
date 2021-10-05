function findPoint() //простой поиск контакта "под щупом"
{
var X
var Y
var A
var Depth=-2

X=MACHINE.getCurPositionSC("X")
Y=MACHINE.getCurPositionSC("Y")

DIALOG.enterNum("Введите угол поиска =")
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()) 
  A=DIALOG.getNum();
else
  return

MACHINE.clearGProbe();

MACHINE.addGProbeXY(X,Y,Depth,A,10);

MACHINE.goGProbe();

while(MACHINE.isActiv());

MACHINE.runGCode("G0 X"+MACHINE.getGProbeSC(0,"X").toString()+" Y"+MACHINE.getGProbeSC(0,"Y").toString())

}

function saveData() //чтение/сохранение параметра из/в файл
{
var X=FILE.loadValueNum(FILE.curDir()+"/data/data.ini","my/X",X)

X=X+1

FILE.saveValue(FILE.curDir()+"/data/data.ini","my/X",X)
}

function findCirc() //поиск центра отверстия/выступа , щуп по середине
{
var X
var Y
var dX
var dY
var R
var A
var Depth=-2

X=MACHINE.getCurPositionSC("X")
Y=MACHINE.getCurPositionSC("Y")

DIALOG.enterNum("Введите внутренний+ (наружный-)  диаметр =")
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()&&DIALOG.getNum()!=0) 
  R=DIALOG.getNum()/2;
else
  return

DIALOG.enterNum("Введите угол поворота (гр) =")
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()) 
  A=DIALOG.getNum();
else
  return

var Ar=A*Math.PI/180.0

dX=R*Math.cos(Ar)
dY=R*Math.sin(Ar)

MACHINE.clearGProbe();

MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A,10); 
MACHINE.addGProbeXY(X-dX ,Y -dY,Depth,A-180,10);
MACHINE.addGProbeXY(X-dY,Y+dX,Depth,A+90,10);
MACHINE.addGProbeXY(X+dY, Y-dX,Depth,A-90,10);

MACHINE.goGProbe();

while(MACHINE.isActiv());

Y=(MACHINE.getGProbeSC(0,"Y")+MACHINE.getGProbeSC(1,"Y")+MACHINE.getGProbeSC(2,"Y")+MACHINE.getGProbeSC(3,"Y"))/4

X=(MACHINE.getGProbeSC(0,"X")+MACHINE.getGProbeSC(1,"X")+MACHINE.getGProbeSC(2,"X")+MACHINE.getGProbeSC(3,"X"))/4

MACHINE.runGCode("G0 X"+X.toString()+" Y"+Y.toString())

while(MACHINE.isActiv());
}

function findLine() //поиск середины кармана/выступа, щуп по середине
{
var X
var Y
var dX
var dY
var R
var A
var Depth=-2

X=MACHINE.getCurPositionSC("X")
Y=MACHINE.getCurPositionSC("Y")

DIALOG.enterNum("Введите внутренний+ (наружний-)  размер =")
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()&&DIALOG.getNum()!=0) 
  R=DIALOG.getNum()/2;
else
  return

DIALOG.enterNum("Введите угол поворота (гр) =")
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()) 
  A=DIALOG.getNum();
else
  return

var Ar=A*Math.PI/180.0

dX=R*Math.cos(Ar)
dY=R*Math.sin(Ar)

MACHINE.clearGProbe();

MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A,10); 
MACHINE.addGProbeXY(X-dX ,Y -dY,Depth,A-180,10);

MACHINE.goGProbe();

while(MACHINE.isActiv());

Y=(MACHINE.getGProbeSC(0,"Y")+MACHINE.getGProbeSC(1,"Y"))/2
X=(MACHINE.getGProbeSC(0,"X")+MACHINE.getGProbeSC(1,"X"))/2

MACHINE.runGCode("G0 X"+X.toString()+" Y"+Y.toString())

while(MACHINE.isActiv());
}

function findOrth() //
{
var X
var Y
var R
var Q
var Depth=-2

X=MACHINE.getCurPositionSC("X")
Y=MACHINE.getCurPositionSC("Y")

DIALOG.enterNum("Введите отход от угла внутрений+ (наружний-) =")
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()&&DIALOG.getNum()!=0) 
  R=DIALOG.getNum();
else
  return

DIALOG.enterNum("Введите квадрант 1-4")
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()&&DIALOG.getNum()>0&&DIALOG.getNum()<5) 
 Q=DIALOG.getNum();
else
  return

MACHINE.clearGProbe();

var A=0

if(R<0) 
{
A=180
R=-R
}

switch(Q)
{
case 1: MACHINE.addGProbeXY(X+0,Y+R,Depth,180+A,10); 
             MACHINE.addGProbeXY(X+R,Y+0,Depth,-90+A,10);
             break

case 2: MACHINE.addGProbeXY(X+0,Y+R,Depth,  0+A,10); 
             MACHINE.addGProbeXY(X-R,Y+0,Depth,-90+A,10);
             break

case 3: MACHINE.addGProbeXY(X+0,Y-R,Depth,  0+A,10); 
             MACHINE.addGProbeXY(X-R,Y+0,Depth, 90+A,10);
             break

case 4: MACHINE.addGProbeXY(X+0,Y-R,Depth, -180+A,10); 
             MACHINE.addGProbeXY(X+R,Y+0,Depth, 90+A,10);
             break
}


MACHINE.goGProbe();
while(MACHINE.isActiv());


X=MACHINE.getGProbeSC(0,"X")
Y=MACHINE.getGProbeSC(1,"Y")

MACHINE.runGCode("G0 X"+X.toString()+" Y"+Y.toString())

while(MACHINE.isActiv());
}

function findRot() //поиск поворота, щуп по середине прямой
{
var X
var Y
var dX
var dY
var R
var A
var Depth=-2

X=MACHINE.getCurPositionSC("X")
Y=MACHINE.getCurPositionSC("Y")

DIALOG.enterNum("Введите ширину поиска =")
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()&&DIALOG.getNum()>10) 
  R=DIALOG.getNum()/2;
else
  return

DIALOG.enterNum("Введите направление поиска (гр) =")
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()) 
  A=DIALOG.getNum();
else
  return

var Ar=A*Math.PI/180.0

dX=R*Math.cos(Ar)
dY=R*Math.sin(Ar)

MACHINE.clearGProbe();

MACHINE.addGProbeXY(X-dY,Y+dX,Depth,A,10); 
MACHINE.addGProbeXY(X+dY ,Y -dX,Depth,A,10);

MACHINE.goGProbe();

while(MACHINE.isActiv());

dY=MACHINE.getGProbeSC(1,"Y")-MACHINE.getGProbeSC(0,"Y")
dX=MACHINE.getGProbeSC(1,"X")-MACHINE.getGProbeSC(0,"X")

A=Math.atan2(dY,dX)/Math.PI*180

DIALOG.message("A="+A.toString())

MACHINE.runGCode("G0 X"+X.toString()+" Y"+Y.toString())

while(MACHINE.isActiv());
}


