//ѕримеры
function findPlane(X,Y,Z,Depth)//поиск плоскости
{
MACHINE.clearGProbe();
MACHINE.enableDoubleGProbe(1);

MACHINE.addGProbeZ(X,Y,Z,Depth);

MACHINE.goGProbe();
while(MACHINE.isActiv());

return MACHINE.getGProbeSC(0,"Z");
}

function findPlaneDialog()//поиск плоскости
{
var X
var Y
var Z

X=MACHINE.getCurPositionSC("X")
Y=MACHINE.getCurPositionSC("Y")
Z=MACHINE.getCurPositionSC("Z")

Z=findPlane(X,Y,Z-20,20)

MACHINE.setCurPositionSC("Z",MACHINE.getCurPositionSC("Z")-Z);
}

function findPoint(X,Y,A,Depth) //простой поиск контакта "под щупом"
{
MACHINE.clearGProbe();

MACHINE.enableDoubleGProbe(1);
MACHINE.addGProbeXY(X,Y,Depth,A,10);
MACHINE.goGProbe();

while(MACHINE.isActiv());

return [MACHINE.getGProbeSC(0,"X"),MACHINE.getGProbeSC(0,"Y")]
}

function findPointDialog() //простой поиск контакта "под щупом"
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

var data=findPoint(X,Y,A,Depth);

MACHINE.runGCode("G0 X"+data[0]+" Y"+data[1].toString())
}



function findLine(X,Y,A,R,Depth) //поиск середины кармана/выступа, щуп по середине
{
var dX
var dY
var R

var Ar=A*Math.PI/180.0

if(R!=0){
	
dX=R*Math.cos(Ar)
dY=R*Math.sin(Ar)

MACHINE.clearGProbe();

MACHINE.enableDoubleGProbe(1);

MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A,10); 
MACHINE.addGProbeXY(X-dX ,Y -dY,Depth,A-180,10);

MACHINE.goGProbe();

while(MACHINE.isActiv());

Y=(MACHINE.getGProbeSC(0,"Y")+MACHINE.getGProbeSC(1,"Y"))/2
X=(MACHINE.getGProbeSC(0,"X")+MACHINE.getGProbeSC(1,"X"))/2
}

return [X,Y]
}

function findLineDialog() //поиск середины кармана/выступа, щуп по середине
{
var X
var Y
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

var data = findLine(X,Y,A,R,Depth)

MACHINE.runGCode("G0 X"+data[0].toString()+" Y"+data[1].toString())

while(MACHINE.isActiv());
}

function saveData() //чтение/сохранение параметра из/в файл
{
var X=FILE.loadValueNum(FILE.curDir()+"/data/data.ini","my/X",X)

X=X+1

FILE.saveValue(FILE.curDir()+"/data/data.ini","my/X",X)
}

function findCirc4P(X,Y,A,R,Depth)
{
var dX
var dY
var R

if(R!=0){
var Ar=A*Math.PI/180.0

dX=R*Math.cos(Ar)
dY=R*Math.sin(Ar)

MACHINE.clearGProbe();

MACHINE.enableDoubleGProbe(0);

MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A,10); 
MACHINE.addGProbeXY(X-dX ,Y -dY,Depth,A-180,10);

MACHINE.goGProbe();
while(MACHINE.isActiv());

X=(MACHINE.getGProbeSC(0,"X")+MACHINE.getGProbeSC(1,"X"))/2
Y=(MACHINE.getGProbeSC(0,"Y")+MACHINE.getGProbeSC(1,"Y"))/2

MACHINE.clearGProbe();

MACHINE.enableDoubleGProbe(1);

MACHINE.addGProbeXY(X-dY,Y+dX,Depth,A+90,10);
MACHINE.addGProbeXY(X+dY, Y-dX,Depth,A-90,10);

MACHINE.goGProbe();

while(MACHINE.isActiv());

X=(MACHINE.getGProbeSC(0,"X")+MACHINE.getGProbeSC(1,"X"))/2
Y=(MACHINE.getGProbeSC(0,"Y")+MACHINE.getGProbeSC(1,"Y"))/2

MACHINE.clearGProbe();

MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A,10); 
MACHINE.addGProbeXY(X-dX ,Y -dY,Depth,A-180,10);

MACHINE.goGProbe();
while(MACHINE.isActiv());

X=(MACHINE.getGProbeSC(0,"X")+MACHINE.getGProbeSC(1,"X"))/2
Y=(MACHINE.getGProbeSC(0,"Y")+MACHINE.getGProbeSC(1,"Y"))/2
}

return [X,Y]
}

function findCirc4PDialog()
{
var X
var Y
var R
var A
var Depth=-2

X=MACHINE.getCurPositionSC("X")
Y=MACHINE.getCurPositionSC("Y")

DIALOG.enterNum("¬ведите внутренний+ (наружный-)  диаметр =")
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()&&DIALOG.getNum()!=0) 
  R=DIALOG.getNum()/2;
else
  return

DIALOG.enterNum("¬ведите угол поворота (гр) =")
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()) 
  A=DIALOG.getNum();
else
  return

var data=findCirc4P(X,Y,A,R,Depth)

MACHINE.runGCode("G0 X"+data[0].toString()+" Y"+data[1].toString())

while(MACHINE.isActiv());
}


function findCirc3P(X,Y,A1,A2,A3,R,Depth) 
{
var dX
var dY

var dA=0

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

MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A1+dA,10); 

dX=R*Math.cos(Ar2)
dY=R*Math.sin(Ar2)

MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A2+dA,10); 

dX=R*Math.cos(Ar3)
dY=R*Math.sin(Ar3)

MACHINE.addGProbeXY(X+dX,Y+dY,Depth,A3+dA,10); 

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
    // если точки лежат на одной линии, 
    // или их координаты совпадают,
    // то окружность вписать не получитс€
  return ; 
  }
  // координаты центра
X = (D * E - B * F) / G;
Y = (A * F - C * E) / G;

// var R = Math.sqrt(Math.pow(Z[0].x - Cx, 2) + Math.pow(Z[0].y - Cy, 2));
return [X,Y]
}

function findCirc3PDialog() 
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

DIALOG.enterNum("¬ведите внутренний+ (наружный-)  диаметр =")
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()&&DIALOG.getNum()!=0) 
  R=DIALOG.getNum()/2;
else
  return

DIALOG.enterNum("¬ведите угол поворота N1 (гр) =")
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()) 
  A1=DIALOG.getNum();
else
  return

DIALOG.enterNum("¬ведите угол поворота N2 (гр) =")
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()) 
  A2=DIALOG.getNum();
else
  return

DIALOG.enterNum("¬ведите угол поворота N3 (гр) =")
while(WAIT(DIALOG.isShow()));

if(DIALOG.isOk()) 
  A3=DIALOG.getNum();
else
  return

var data=findCirc3P(X,Y,A1,A2,A3,R,Depth)

X=data[0]
Y=data[1]

MACHINE.runGCode("G0 X"+X.toString()+" Y"+Y.toString())

while(MACHINE.isActiv());
}

function findQuad(X,Y,Q,R,Depth) //
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
		
default: return [X,Y]	
}

MACHINE.goGProbe();
while(MACHINE.isActiv());

X=MACHINE.getGProbeSC(0,"X")
Y=MACHINE.getGProbeSC(1,"Y")

return [X,Y]
}

function findQuadDialog() //
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

var data=findQuad(X,Y,Q,R,Depth)

X=data[0]
Y=data[1]

MACHINE.runGCode("G0 X"+X.toString()+" Y"+Y.toString())

while(MACHINE.isActiv());
}

function findRot(X,Y,A,R,Depth) //поиск поворота, щуп по середине прямой
{
var dX
var dY

var Ar=A*Math.PI/180.0

dX=R*Math.cos(Ar)
dY=R*Math.sin(Ar)

MACHINE.clearGProbe();

MACHINE.enableDoubleGProbe(1);

MACHINE.addGProbeXY(X-dY,Y+dX,Depth,A,10); 
MACHINE.addGProbeXY(X+dY ,Y -dX,Depth,A,10);

MACHINE.goGProbe();

while(MACHINE.isActiv());

dY=MACHINE.getGProbeSC(1,"Y")-MACHINE.getGProbeSC(0,"Y")
dX=MACHINE.getGProbeSC(1,"X")-MACHINE.getGProbeSC(0,"X")

A=Math.atan2(dY,dX)/Math.PI*180

return A
}

function findRotDialog() //поиск поворота, щуп по середине прямой
{
var X
var Y
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

A=findRot(X,Y,A,R,Depth)

DIALOG.message("A="+A.toString())
}





