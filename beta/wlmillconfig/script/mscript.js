var iM=5
var posSetTool={X:5,Y:20,Z:20}
var posChTool={X:-5,Y:50,Z:50}


//��������
function DELAY(ms)
{
TIMER.restart(10);
while(TIMER.getCount(10)<ms); 
}

function WAIT(a)
{
DELAY(100)
return a
}

function M6()
{
}

function M7()
{
//MACHINE.setOutput(2,1); //�������� ���������� 1
}

function M8()
{
//MACHINE.setOutput(3,1); //�������� ���������� 2
}

function M9()
{
//MACHINE.setOutput(2,0); //��������� ���������� 1
//MACHINE.setOutput(3,0); //��������� ���������� 2
}


//������� ��������� �������� �� ������� �������
//� ������ ������ ���������� ������ ����������� ��������
function M3()
{
//DIALOG.message("M3 �������� �������!",0); //������ ���������
//MACHINE.enableSOut(1);  //������ ��������� ����������� ��� ���(PWM) ������
//MACHINE.setOutput(1,1); //������ ��������� ���������� �������
return 1;
}

function M4()
{
return 1;
}

//������� ���������� ��������
function M5()
{
//DIALOG.message("M5 �������� ��������!",0); //	
//MACHINE.enableSOut(0);  //������ ��������� ����������� ��� ���(PWM) ������
//MACHINE.setOutput(1,0); //������ ��������� ���������� �������
return 1;
}


function M30()
{
DIALOG.message("M30 ����� ���������!",0);
}

//����������� ��� ��������� ������ 
//������� �� ������ � WLMill)
function ON()
{
}

//����������� ��� ���������� ������
//(������� ������ � WLMill)
function OFF()
{
}

function RESET()
{
M5()
}

function startCurGProgram()
{
if( !MACHINE.isRunGProgram()){ //���� ��������� �� ��������
 MACHINE.runGProgram(0);
 }
}

function initStartButton()
{
TOOLBAR2.addButton("MYSTARTBUTTON")
MYSTARTBUTTON.setShow(1);
MYSTARTBUTTON.setIcon("play.png")
MYSTARTBUTTON.setText("startGProgram")
MYSTARTBUTTON.setToolTip("Start current GProgram")
MYSTARTBUTTON.setScript("startCurGProgram()")
//MYSTARTBUTTON.setShortcut("F2") //������� �������
}

function toG28()
{
 if(!MACHINE.isActiv()
&&!MACHINE.isRunGProgram())
 { 
 MACHINE.runGCode("G91 G28 Z0") 
 MACHINE.runGCode("G91 G28 X0 Y0")
 MACHINE.runGCode("G90")
 }
}

function initG28Button()
{
TOOLBAR2.addButton("G28BUTTON")

G28BUTTON.setShow(1);
G28BUTTON.setText("G28")
G28BUTTON.setToolTip("G28 Z0\n\rG28 X0 Y0\n\rG28 A0 B0 C0")
G28BUTTON.setScript("toG28()")
//G28BUTTON.setShortcut("F2") //������� �������
}

//����������� ��� ������������� ��������
function init() 
{
//���������� ������ �������� ������� ���������	
//initStartButton() 

//���������� ������ �������� � G28
//initG28Button();  // ��� ������������� ����������������
	
SCRIPT.includeFile("/include/WLProbe.js")
SCRIPT.includeFile("/include/WLTablet.js")
SCRIPT.includeFile("/include/WLTool.js")
}
