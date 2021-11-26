///*******************************************************************************
// * COPYRIGHT NOTICE *
// * 
// * Copyright 2009-2017 ProjeQtOr - Pascal BERNARD - support@projeqtor.org Contributors : -
// * 
// * This file is part of ProjeQtOr.
// * 
// * ProjeQtOr is free software: you can redistribute it and/or modify it under
// * the terms of the GNU Affero General Public License as published by the Free Software
// * Foundation, either version 3 of the License, or (at your option) any later
// * version.
// * 
// * ProjeQtOr is distributed in the hope that it will be useful, but WITHOUT ANY
// * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
// * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
// * 
// * You should have received a copy of the GNU Affero General Public License along with
// * ProjeQtOr. If not, see <http://www.gnu.org/licenses/>.
// * 
// * You can get complete code of ProjeQtOr, other resource, help and information
// * about contributors at http://www.projeqtor.org
// * 
// * DO NOT REMOVE THIS NOTICE **
// ******************************************************************************/
//
//// ============================================================================
//// All specific ProjeQtOr functions and variables for Dialog Purpose
//// This file is included in the main.php page, to be reachable in every context
//// ============================================================================


//=============================================================================
//= Requirements and test cases
//=============================================================================

function addTestCaseRun() {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
   //disableWidget('dialogTestCaseRunSubmit');  
  var params="&testSessionId="+dijit.byId('id').get('value');
  loadDialog('dialogTestCaseRun', null, true, params);
}

function refreshTestCaseRunList(selected) {
  disableWidget('dialogTestCaseRunSubmit');
  var url='../tool/dynamicListTestCase.php';
  url+='?idProject='+dijit.byId('idProject').get('value');
  if (dijit.byId('idProduct')) url+='&idProduct='+dijit.byId('idProduct').get('value');
  else if (dijit.byId('idProductOrComponent')) url+='&idProduct='+dijit.byId('idProductOrComponent').get('value');
  else if (dijit.byId('idComponent')) url+='&idComponent='+dijit.byId('idComponent').get('value');
  if (selected) {
    url+='&selected=' + selected;
  }
  loadContent(url, 'testCaseRunListDiv', 'testCaseRunForm', false);
}

function editTestCaseRun(testCaseRunId, idRunStatus, callback) {
  if (checkFormChangeInProgress()) {
   showAlert(i18n('alertOngoingChange'));
    return;
  }
  var testSessionId = dijit.byId('id').get('value');
  var params="&testCaseRunId=" + testCaseRunId + "&testSessionId=" + testSessionId;
  if (idRunStatus) params+="&runStatusId="+idRunStatus;
  loadDialog('dialogTestCaseRun', callback, ((callback)?false:true), params);
}

function passedTestCaseRun(idTestCaseRun) {
  var callback=function() { 
    if (saveTestCaseRun()) dijit.byId('dialogTestCaseRun').hide();
  };
  editTestCaseRun(idTestCaseRun, '2', callback);
}

function failedTestCaseRun(idTestCaseRun) {
  editTestCaseRun(idTestCaseRun, '3', null);
}

function blockedTestCaseRun(idTestCaseRun) {
  var callback=function() { 
    if (saveTestCaseRun()) dijit.byId('dialogTestCaseRun').hide();
  };
  editTestCaseRun(idTestCaseRun, '4', callback);
}

function testCaseRunChangeStatus() {
  var status=dijit.byId('testCaseRunStatus').get('value');
  if (status == '3') {
   dojo.byId('testCaseRunTicketDiv').style.display="block";
  } else {
   if (!trim(dijit.byId('testCaseRunTicket').get('value'))) {
     dojo.byId('testCaseRunTicketDiv').style.display="none";
   } else {
     dojo.byId('testCaseRunTicketDiv').style.display="block";
   }
  }
}

function removeTestCaseRun(id, idTestCase) {
  formInitialize();
  if (! dojo.byId("testCaseRunId")) {
    var callBack=function() {
      if (dijit.byId('dialogAlert')) {
        dijit.byId('dialogAlert').hide();
      }
      removeTestCaseRun(id, idTestCase);  
    }
    loadDialog('dialogTestCaseRun', callBack, false);
  }
  if (checkFormChangeInProgress()) {
   showAlert(i18n('alertOngoingChange'));
   return;
  }
  dojo.byId("testCaseRunId").value=id;
  actionOK=function() {
   loadContent("../tool/removeTestCaseRun.php", "resultDivMain",
       "testCaseRunForm", true, 'testCaseRun');
  };
  msg=i18n('confirmDeleteTestCaseRun', new Array(idTestCase));
  showConfirm(msg, actionOK);
}

function saveTestCaseRun() {
  var formVar=dijit.byId('testCaseRunForm');
  var mode=dojo.byId("testCaseRunMode").value;
  if ( (mode == 'add'  && dojo.byId("testCaseRunTestCaseList").value == "") 
    || (mode == 'edit' && dojo.byId("testCaseRunTestCase").value == "" ) )
   return ;
  if (mode == 'edit') {
   var status=dijit.byId('testCaseRunStatus').get('value');
   if (status == '3') {
     if (trim(dijit.byId('testCaseRunTicket').get('value')) == '') {
       dijit.byId("dialogTestCaseRun").show();
       showAlert(i18n('messageMandatory', new Array(i18n('colTicket'))));
       return;
     }
   }
  }
  if (formVar.validate()) {
   loadContent("../tool/saveTestCaseRun.php", "resultDivMain", "testCaseRunForm", true, 'testCaseRun');
   dijit.byId('dialogTestCaseRun').hide();
   return true;
  } else {
   dijit.byId("dialogTestCaseRun").show();
   showAlert(i18n("alertInvalidForm"));
   return false;
  }
}

function saveTcrData(id,textZone) {
  var value=dijit.byId("tcr"+textZone+"_"+id).get("value");
  var url = '../tool/saveTcrData.php?idTcr='+id +'&zone='+textZone +'&valueZone='+value;
  dojo.xhrPut({
    url : url,
    form : 'objectForm',
    handleAs : "text",
    load : function(data) {
      addMessage(i18n("col"+textZone)+" "+i18n("resultSave"));
      document.getElementById('idImage'+textZone+id).style.display="block";
      setTimeout("dojo.byId('idImage"+textZone+id+"').style.display='none';", 1000);
      }
  });
}


function lockRequirement() {
  if (checkFormChangeInProgress()) {
    return false;
  }
  dijit.byId('locked').set('checked', true);
  dijit.byId('idLocker').set('value', dojo.byId('idCurrentUser').value);
  var curDate=new Date();
  dijit.byId('lockedDate').set('value', curDate);
  dijit.byId('lockedDateBis').set('value', curDate);
  formChanged();
  submitForm("../tool/saveObject.php", "resultDivMain", "objectForm", true);
  return true;
}

function unlockRequirement() {
  if (checkFormChangeInProgress()) {
    return false;
  }
  dijit.byId('locked').set('checked', false);
  dijit.byId('idLocker').set('value', null);
  dijit.byId('lockedDate').set('value', null);
  dijit.byId('lockedDateBis').set('value', null);
  formChanged();
  submitForm("../tool/saveObject.php", "resultDivMain", "objectForm", true);
  return true;
}
