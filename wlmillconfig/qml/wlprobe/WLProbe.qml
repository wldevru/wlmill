import QtQuick 2.5
import QtQuick.Window 2.2
import QtQuick.Controls 2.0
import QtQuick.Layouts 1.0

Item {
    id: root
    enabled:  !MACHINE.busy

    ButtonGroup {
       buttons: leftbuttons.children
       exclusive: true
    }

    function updateZvalid()
    {
    var Zvalid=MSCRIPT.getValue("WLProbeXYbaseZvalid",0)
    bcirc3xy.enabled=Zvalid;
    bcirc4xy.enabled=Zvalid;
    bsizexy.enabled =Zvalid;
    bpointxy.enabled=Zvalid;
    }


    onEnabledChanged: {
    updateZvalid()
    }

    Component{
    id: pointZ
    PointZ{}
    }

    Component{
    id: circ3XY
    Circ3XY{}
    }

    Component{
    id: circ4XY
    Circ4XY{}
    }

    Component{
    id: sizeXY
    SizeXY{}
    }

    Component{
    id: pointXY
    PointXY{}
    }

    ColumnLayout{
    id: leftbuttons
    z:1

      Rectangle{
      anchors.fill: parent
      color: "gray";
      }

      Button{
      text: "toLastStart"
      onClicked: {
      MSCRIPT.runScript("WLProbeToStartPointXYZ()");
      }
      }

      Button{
      text: "PointZ"
      onClicked: {
      stack.clear();
      stack.push(pointZ)
      }
      }

      Button{
      id: bcirc3xy
      text: "Circ3XY"
      enabled: false
      onClicked: {
      stack.clear();
      stack.push(circ3XY)
      }
      }

      Button{
      id: bcirc4xy
      text: "Circ4XY"
      enabled: false
      onClicked: {
      stack.clear();
      stack.push(circ4XY)
      }
      }
      Button{
      id: bsizexy
      text: "SizeXY"
      enabled: false
      onClicked: {
      stack.clear();
      stack.push(sizeXY)
      }
      }
      Button{
      id: bpointxy
      text: "PointXY"
      enabled: false
      onClicked: {
      stack.clear();
      stack.push(pointXY)
      }
      }
    }

    StackView{
        id: stack
        anchors.margins: 5
        anchors.left: leftbuttons.right
        anchors.right:  parent.right;
        anchors.top:    parent.top
        anchors.bottom: parent.bottom


        initialItem: pointZ
    }

}
