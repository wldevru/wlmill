/*
WLSelector - ������ ������ � ���������� (��������� ����������, � �������������� ����������)

���������:
1.������ ������� ����������� ��������� � ������� WLScript
 
function updateSelectorF() //��������� �������� ���������� F
{
var   select=12  //���������� ��������� ���������
var      ain=4   //����� ����������� �����
var     data=[0,0.5,1,2,5,10,15,25,50,75,100,125,150] //�������� ������� ����� �������������.

value=Math.round(MACHINE.getAIn(ain)* select)

MACHINE.setPercentF(data[value])
}

2. ��������� ����� ������� �1 � ������� ON()

function ON() 
{
SCRIPT.setInterval("updateSelectorF()",200) //������ 200��
//....
}

3. ����������� ������ ������ �2 � ������� OFF()

function OFF() 
{
SCRIPT.clearInterval();
//....
}

*/