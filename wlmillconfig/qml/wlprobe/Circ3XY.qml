import QtQuick 2.5
import QtQuick.Window 2.2
import QtQuick.Controls 2.0
import QtQuick.Layouts 1.0

Item {
    id: root
    visible: true

    property bool enStart: true
    property int radius: width < height ? width/3 : height/3;
    property double a1:  0
    property double a2:  120
    property double a3: -120
    property int inside: 0
    readonly property real offsetR: +(inside ? -10:10)
    property real path: 0
    property bool locka: false

    onInsideChanged: {
    anim.stop()
    anim.from= inside ? -10:10;
    anim.start()
    }

    Component.onCompleted:{
    var file=MSCRIPT.getValue("WLProbeFileINI")

    var   D=2*FILE.loadValue(file,"Circ3XYDialog/R",50);

    sbDiam.value =Math.abs(D);
    cbinside.checked= D>0

    sbA1.value   =FILE.loadValue(file,"Circ3XYDialog/A1",root.a1);
    sbA2.value   =FILE.loadValue(file,"Circ3XYDialog/A2",root.a2);
    sbA3.value   =FILE.loadValue(file,"Circ3XYDialog/A3",root.a3);

    sbDepth.value=FILE.loadValue(file,"lastDialog/Depth",-5);
    }

    PropertyAnimation {
        id:anim
        target: root
        property: "path"
        duration: 1000
        loops: Animation.Infinite
        from: 10
        to:   0
        easing.type: Easing.Linear
        running: true
    }


    SpinBox{
    id:sbDiam
    value: 50
    from:  10
    to:    1000
    z:1
    editable: true
    anchors.centerIn: root
    }

    SpinBox{
    id:sbDepth
    value: -5
    from:  -100
    to:     5
    z:1
    editable: true
    anchors.left:   root.left
    anchors.bottom: root.bottom
    }

    Button{
    id: defbutton0
    text: "default 0"
    z:1
    anchors.top:root.top
    anchors.right: root.right
    onClicked: {
    root.a1=0
    root.a2=120
    root.a3=-120
    }
    }

    Button{
    id: defbutton1
    text: "default 1"
    z:1
    anchors.top: defbutton0.bottom
    anchors.right: root.right
    onClicked: {
    root.a1=0
    root.a2=60
    root.a3=-60
    }
    }

    Button{
    id: defbuttonAdd45
    text: "+45"
    z:1
    anchors.top: defbutton1.bottom
    anchors.right: root.right
    onClicked: {
    root.a1+=45
    root.a2+=45
    root.a3+=45
    }
    }

    Button{
    id: defbuttonDec45
    text: "-45"
    z:1
    anchors.top: defbuttonAdd45.bottom
    anchors.right: root.right
    onClicked: {
    root.a1-=45
    root.a2-=45
    root.a3-=45
    }
    }

    Button{
    enabled: root.enStart
    text: "start"
    z:1
    anchors.bottom: root.bottom
    anchors.right: root.right
    onClicked: {
    var X=MACHINE.getCurPosition("X")
    var Y=MACHINE.getCurPosition("Y")
    var A1=root.a1;
	var A2=root.a2;
	var A3=root.a3;
    var R=(inside ? sbDiam.value : -sbDiam.value)/2.0;
    var Depth=MSCRIPT.getValue("WLProbeXYbaseZ")+sbDepth.value

    var file=MSCRIPT.getValue("WLProbeFileINI")

    FILE.saveValue(file,"Circ3XYDialog/R",R);
    FILE.saveValue(file,"Circ3XYDialog/A1",A1);
    FILE.saveValue(file,"Circ3XYDialog/A2",A2);
    FILE.saveValue(file,"Circ3XYDialog/A3",A3);
    FILE.saveValue(file,"lastDialog/Depth",sbDepth.value);

    //MSCRIPT.runScript("WLProbeCirc3XY("+X+","+Y+","+A1+","+A2+","+A3+","+R+","+Depth+")");
    MSCRIPT.runScript("WLProbeFastDialog=1;WLProbeCirc3XYDialog()");
    }
    }

    Rectangle {
        id: rect2
        anchors.fill: parent
        visible: inside
        color: 'grey'
    }

    Rectangle {
        id: circle
        anchors.centerIn: root

        border.color: sbDiam.focus ? 'blue' :'black'
        width:  2*(radius)
        height: 2*(radius)
        radius: root.radius

        color: inside ? 'white':'grey'
    }

    // TODO: Переместить привязки позиций из компонента в загрузчик.
    //        Проверить каждое использовние «parent» в корневом элементе компонента.
    //       Переименовать каждое внешнее использование id «probePoint» в «loader_probePoint.item».

    //       Переименовать все внешние использования id «mark1» в «loader_probePoint.item.mark1».
    //       Переименовать все внешние использования id «dragObj1» в «loader_probePoint.item.dragObj1».
    //       Переименовать все внешние использования id «markArea1» в «loader_probePoint.item.markArea1».
    Component {
        id: component_probePoint
        Item{
            property alias mark1:     inner_mark1
            property alias dragObj1:  inner_dragObj1
            property alias markArea1: inner_markArea1
            property real  angle: 0
            property real  offsetAngle: 0

            signal signalChangedAngle(real angle)

            id: probePoint

            Rectangle {
                id: inner_mark1

                width: 20
                height: width
                radius: width/2

                x: circle.x+root.radius+(root.radius+offsetR+path) * Math.cos(-(angle+offsetAngle)*Math.PI/180)-10;
                y: circle.y+root.radius+(root.radius+offsetR+path) * Math.sin(-(angle+offsetAngle)*Math.PI/180)-10;

                border.color: sbA1.focus ? 'blue' :'black'
                color:  'red'

                MouseArea {
                    id: inner_markArea1
                    anchors.fill: parent
                    drag.target: dragObj1
                    onPressed: {
                        dragObj1.x = mark1.x
                        dragObj1.y = mark1.y
                    }
                }
            }

            Item {
                id: inner_dragObj1

                readonly property real ang: -Math.atan2(y-(circle.y+root.radius)+10,x-(circle.x+root.radius)+10)*180/Math.PI

                x: mark1.x
                y: mark1.y

                onAngChanged:if(markArea1.pressed)  angle=ang-offsetAngle
            }

            onAngleChanged: signalChangedAngle(angle);
        }
    }

    Loader {
        id: loader_probePoint1
        sourceComponent: component_probePoint;
        onLoaded: item.angle=a1
    }

    Loader {
        id: loader_probePoint2
        sourceComponent: component_probePoint
        onLoaded: item.angle=a2
    }

    Loader {
        id: loader_probePoint3
        sourceComponent: component_probePoint
        onLoaded: item.angle=a3
    }


    Connections {
    target: loader_probePoint1.item
    onSignalChangedAngle: {
        if(locka){
                var delta =  angle-root.a1

                root.a2+=delta
                root.a3+=delta
                }

        root.a1=angle
        }
    }

    Connections {
    target: loader_probePoint2.item
    onSignalChangedAngle: {
        if(locka){
            var delta =  angle-root.a2

            root.a1+=delta
            root.a3+=delta
            }

        root.a2=angle
        }
    }

    Connections {
    target: loader_probePoint3.item
    onSignalChangedAngle: {
        if(locka){
            var delta =  angle-root.a3

            root.a1+=delta
            root.a2+=delta
            }

        root.a3=angle
        }
    }


    onA1Changed: {
    while(root.a1>360)
          root.a1-=360

    while(root.a1<-360)
          root.a1+=360

    loader_probePoint1.item.angle=root.a1
    sbA1.value=root.a1
    }

    onA2Changed: {
    while(root.a2>360)
          root.a2-=360

    while(root.a2<-360)
          root.a2+=360;

    loader_probePoint2.item.angle=root.a2
    sbA2.value=root.a2
    }

    onA3Changed: {
    while(root.a3>360)
          root.a3-=360

    while(root.a3<-360)
          root.a3+=360

    loader_probePoint3.item.angle=root.a3
    sbA3.value=root.a3
    }

    ColumnLayout{
     SpinBox{
     id: sbA1
     value: Math.floor(a1)
     from:-360
     to:   360
     editable: true

     onValueChanged: root.a1=value     
     }

     SpinBox{
     id: sbA2
     value: Math.floor(a2)
     from:-360
     to:   360
     editable: true

     onValueChanged: root.a2=value
     }

     SpinBox{
     id: sbA3
     value: Math.floor(a3)
     from:-360
     to:   360
     editable: true

     onValueChanged: root.a3=value
     }

     CheckBox{
     id:cbinside
     text: "inside"
     onCheckedChanged:
      {
      root.inside=checkState;
      }
     }

     CheckBox{
     text: "lock"
     enabled: false
     onCheckedChanged:
      {
      root.locka=checkState;
      }
     }



    }
}
