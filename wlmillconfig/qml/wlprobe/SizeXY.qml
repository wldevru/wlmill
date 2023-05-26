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
    property int inside: 0
    readonly property real offsetR: +(inside ? -10:10)
    property real path: 0

    onInsideChanged: {
    anim.stop()
    anim.from= inside ? -10:10;
    anim.start()
    }

    Component.onCompleted:{
    var file=MSCRIPT.getValue("WLProbeFileINI")

    var D =2*FILE.loadValue(file,"SizeXYDialog/R",50);
    sbDiam.value = Math.abs(D)

    cbinside.checked = D>0
    sbA1.value   =FILE.loadValue(file,"SizeXYDialog/A",0);
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
    to:     50
    z:1
    editable: true
    anchors.left:   root.left
    anchors.bottom: root.bottom
    }

    Button{
    id: def0
    text: "default 0"
    z:1
    anchors.top:root.top
    anchors.right: root.right
    onClicked: {
    root.a1=0
    }
    }

    Button{
    id: def45
    text: "+45"
    z:1
    anchors.top:   def0.bottom
    anchors.right: root.right
    onClicked: {
    root.a1-=45
    }
    }

    Button{
    text: "-45"
    z:1
    anchors.top:   def45.bottom
    anchors.right: root.right
    onClicked: {
    root.a1+=45
    }
    }

    Button{
    enabled: root.enStart
    text: "start"
    z:1
    anchors.bottom: root.bottom
    anchors.right: root.right
    onClicked: {
        onClicked: {
        var X=MACHINE.getCurPosition("X")
        var Y=MACHINE.getCurPosition("Y")
        var A1=root.a1;
        var R=(inside ? sbDiam.value : -sbDiam.value)/2.0;
        var Depth=MSCRIPT.getValue("WLProbeXYbaseZ")+sbDepth.value

        var file=MSCRIPT.getValue("WLProbeFileINI")

        FILE.saveValue(file,"SizeXYDialog/R",R);
        FILE.saveValue(file,"SizeXYDialog/A",A1);
        FILE.saveValue(file,"lastDialog/Depth",sbDepth.value);

        //MSCRIPT.runScript("WLProbeSizeXY("+X+","+Y+","+A1+","+R+","+Depth+")");
        MSCRIPT.runScript("WLProbeFastDialog=1;WLProbeSizeXYDialog()");
        }
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
        width:  2*(root.radius)
        height: 2*(root.radius)
        rotation: -root.a1
        radius:  width/10

        color: inside ? 'white':'grey'
    }

	
    // TODO: Переместить привязки позиций из компонента в загрузчик.
    //        Проверить каждое использовние «parent» в корневом элементе компонента.
    //       Переименовать каждое внешнее использование id «mark1» в «loader_mark1.item».

    //       Переименовать все внешние использования id «markArea1» в «loader_mark1.item.markArea1».
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
        onLoaded: item.offsetAngle=0
    }

    Loader {
        id: loader_probePoint2
        sourceComponent: component_probePoint;
        onLoaded: item.offsetAngle=180
    }

    Connections {
    target: loader_probePoint1.item
    onSignalChangedAngle: root.a1=angle
    }

    Connections {
    target: loader_probePoint2.item
    onSignalChangedAngle: root.a1=angle
    }

    onA1Changed: {        
    while(root.a1>360)
          root.a1-=360

    while(root.a1<-360)
          root.a1+=360

    loader_probePoint1.item.angle=root.a1
    loader_probePoint2.item.angle=root.a1
    sbA1.value=root.a1
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

     CheckBox{
     id: cbinside
     text: "inside"
     onCheckedChanged:
      {
      root.inside=checkState;
      }
     }



    }
}
