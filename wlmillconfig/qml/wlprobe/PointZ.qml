
import QtQuick 2.5
import QtQuick.Window 2.2
import QtQuick.Controls 2.0
import QtQuick.Layouts 1.0

Item {
    id: root
    visible: true

    Component.onCompleted:{

    var file=MSCRIPT.getValue("WLProbeFileINI")

    sbDist.value=FILE.loadValue(file,"PointZDialog/Dist",15);
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

    Text {
        anchors.centerIn: root
        id: name
        text: qsTr("set probe inidicator on touch plane and set start..")
    }

    SpinBox{
    id:sbDist
    value: 15
    from:  1
    to:    100
    z:1
    editable: true
    anchors.left:   root.left
    anchors.bottom: root.bottom
    }

    Button{
    text: "start"
    z:1
    anchors.bottom: root.bottom
    anchors.right: root.right
    onClicked: {
    var X=MACHINE.getCurPosition("X")
    var Y=MACHINE.getCurPosition("Y")
    var Z=MACHINE.getCurPosition("Z")

    var file=MSCRIPT.getValue("WLProbeFileINI")

    FILE.saveValue(file,"PointZDialog/Dist",sbDist.value);

    //MSCRIPT.runScript("WLProbePointZ()("+X+","+Y+","+A+","+(Z-Dist)+","+Dist+")");
    MSCRIPT.runScript("WLProbeFastDialog=1;WLProbePointZDialog()");
    }
    }

}
