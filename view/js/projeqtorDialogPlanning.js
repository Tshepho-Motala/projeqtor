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
//= Planning PDF
//=============================================================================

function planningPDFBox(copyType) {
  loadDialog('dialogPlanningPdf', null, true, "", false);
}

// =============================================================================
// = Assignments
// =============================================================================

function addAssignment(unit, rawUnit, hoursPerDay, isTeam, isOrganization,
    isResourceTeam) {

  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  var objClass=dojo.byId('objectClass').value;
  var callBack=function() {
    dijit.byId("dialogAssignment").show();
  };
  var params="&refType=" + objClass;
  params+="&refId=" + dojo.byId("objectId").value;
  params+="&idProject=" + dijit.byId('idProject').get('value');
  params+="&unit=" + unit;
  if (dojo.byId('objectClass').value == 'Meeting'
      || dojo.byId('objectClass').value == 'PeriodicMeeting') {
    params+="&meetingEndTime=" + dijit.byId('meetingEndTime');
    params+="&meetingEndTimeValue=" + dijit.byId('meetingEndTime').get('value');
    params+="&meetingStartTime=" + dijit.byId('meetingStartTime');
    params+="&meetingStartTimeValue="
        + dijit.byId('meetingStartTime').get('value');
    params+="&rawUnit=" + rawUnit;
    params+="&hoursPerDay=" + hoursPerDay;
  }
  if (objClass == 'PokerSession') {
    params+="&pokerSessionEndTime=" + dijit.byId('pokerSessionEndTime');
    params+="&pokerSessionEndTimeValue="
        + dijit.byId('pokerSessionEndTime').get('value');
    params+="&pokerSessionStartTime=" + dijit.byId('pokerSessionStartTime');
    params+="&pokerSessionStartTimeValue="
        + dijit.byId('pokerSessionStartTime').get('value');
    params+="&rawUnit=" + rawUnit;
    params+="&hoursPerDay=" + hoursPerDay;
  }
  if (dojo.byId('objectClass').value != 'PeriodicMeeting'
      && objClass != 'PokerSession') {
    params+="&validatedWorkPe="
        + dijit.byId(objClass + "PlanningElement_validatedWork").get('value');
    params+="&assignedWorkPe="
        + dijit.byId(objClass + "PlanningElement_assignedWork").get('value');
  }
  params+="&isTeam=" + isTeam + "&isOrganization=" + isOrganization
      + "&isResourceTeam=" + isResourceTeam;
  ;
  params+="&mode=add";
  loadDialog('dialogAssignment', callBack, false, params);
}

var editAssignmentLoading=false;
function editAssignment(assignmentId, idResource, idRole, cost, rate,
    assignedWork, realWork, leftWork, unit, optional) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  var callBack=function() {
    editAssignmentLoading=false;
    assignmentUpdatePlannedWork('assignment');
    dijit.byId("dialogAssignment").show();
  };
  var params="&idAssignment=" + assignmentId;
  params+="&refType=" + dojo.byId('objectClass').value;
  params+="&idProject=" + dijit.byId('idProject').get('value');
  params+="&refId=" + dojo.byId("objectId").value;
  params+="&idResource=" + idResource;
  params+="&idRole=" + idRole;
  params+="&mode=edit";
  params+="&unit=" + unit;
  params+="&realWork=" + realWork;
  editAssignmentLoading=true;
  loadDialog('dialogAssignment', callBack, false, params);
}

function divideAssignment(assignedIdOrigin, unit) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  var callBack=function() {
    dijit.byId("dialogAssignment").show();
  };
  var params="&refType=" + dojo.byId('objectClass').value;
  params+="&refId=" + dojo.byId("objectId").value;
  params+="&idProject=" + dijit.byId('idProject').get('value');
  params+="&assignedIdOrigin=" + assignedIdOrigin;
  params+="&unit=" + unit;
  params+="&mode=divide";
  loadDialog('dialogAssignment', callBack, false, params);
}

function assignmentUpdateLeftWork(prefix) {
  var initAssigned=dojo.byId(prefix + "AssignedWorkInit");
  var initLeft=dojo.byId(prefix + "LeftWorkInit");
  var assigned=dojo.byId(prefix + "AssignedWork");
  var newAssigned=dojo.number.parse(assigned.value);

  if (dojo.byId('objectClass').value == 'Activity' && prefix == 'assignment') {
    var isOnRealTime=dijit.byId('workOnRealTime').get('value');
    if (isOnRealTime == 'on') {
      var realdWork=dojo.byId(prefix + "RealWork").value;
      if (newAssigned < realdWork) {
        dijit.byId(prefix + "AssignedWork").set("value", initAssigned.value);
        dijit.byId(prefix + "LeftWork").set("value", initLeft.value);
        showAlert(i18n('assingedWorkCantBeLowerInWorkOnRealTime'));
        return;
      }
    }
  }

  if (newAssigned == null || isNaN(newAssigned)) {
    newAssigned=0;
    assigned.value=dojo.number.format(newAssigned);
  }
  var left=dojo.byId(prefix + "LeftWork");
  var real=dojo.byId(prefix + "RealWork");
  diff=dojo.number.parse(assigned.value) - initAssigned.value;
  newLeft=parseFloat(initLeft.value) + diff;
  if (newLeft < 0 || isNaN(newLeft)) {
    newLeft=0;
  }
  if (assigned.value != initAssigned.value) {
    diffe=dojo.number.parse(assigned.value) - real.value;
    if (initAssigned.value == 0 || isNaN(initAssigned.value)) {
      newLeft=0 + diffe;
    }
  }
  left.value=dojo.number.format(newLeft);
  assignmentUpdatePlannedWork(prefix);
}

function assignmentUpdatePlannedWork(prefix) {
  var left=dojo.byId(prefix + "LeftWork");
  var newLeft=dojo.number.parse(left.value);
  if (newLeft == null || isNaN(newLeft)) {
    newLeft=0;
    left.value=dojo.number.format(newLeft);
  }
  var real=dojo.byId(prefix + "RealWork");
  var planned=dojo.byId(prefix + "PlannedWork");
  newPlanned=dojo.number.parse(real.value) + dojo.number.parse(left.value);
  planned.value=dojo.number.format(newPlanned);

}

function saveAssignment(definitive) {
  var formVar=dijit.byId('assignmentForm');
  var planningMode=dojo.byId('planningMode').value;
  var mode=dojo.byId('mode').value;
  var isTeam=dojo.byId('isTeam').value;
  var isOrga=dojo.byId('isOrganization').value;

  if (dojo.byId('objectClass').value == 'Activity') {
    var isOnRealTime=dijit.byId('workOnRealTime').get('value');
    if (isOnRealTime == 'on') {
      var realdWork=dojo.byId('assignmentRealWork').value, assign=dojo
          .byId('assignmentAssignedWork').value;
      if (assign < realdWork) {
        dijit.byId("assignmentAssignedWork").set("value",
            dojo.byId('assignedWorkOrigin').value);
        showAlert(i18n('assingedWorkCantBeLowerInWorkOnRealTime'));
        return;
      }
    }
  }

  if (formVar.validate()) {
    dijit.byId("assignmentPlannedWork").focus();
    dijit.byId("assignmentLeftWork").focus();
    url="../tool/saveAssignment.php";
    if (definitive)
      url+="?definitive=" + definitive;
    if (planningMode == 'MAN' && mode != 'edit' && !isTeam && !isOrga) {
      var callback=function() {
        var lastOperationStatus=dojo.byId('lastOperationStatus').value;
        if (lastOperationStatus != 'INVALID') {
          var params="&idAssignment=" + dojo.byId('idAssignment').value;
          params+="&refType=" + dojo.byId('objectClass').value;
          params+="&idProject=" + dijit.byId('idProject').get('value');
          params+="&refId=" + dojo.byId("objectId").value;
          params+="&idResource="
              + dijit.byId('assignmentIdResource').get('value');
          params+="&idRole=" + dijit.byId('assignmentIdRole').get('value');
          params+="&unit=" + dojo.byId('assignmentAssignedUnit').value;
          params+="&realWork=" + dijit.byId('assignmentRealWork').get('value');
          params+=dijit.byId('assignmentDailyCost').get('value');
          params+="&mode=edit";
          loadDialog('dialogAssignment', null, false, params);
        } else {
          dijit.byId('dialogAssignment').hide();
        }
      };
      loadContent(url, "resultDivMain", "assignmentForm", true, 'assignment',
          null, null, callback);
    } else {
      loadContent(url, "resultDivMain", "assignmentForm", true, 'assignment');
      dijit.byId('dialogAssignment').hide();
    }
  } else {
    showAlert(i18n("alertInvalidForm"));
  }
}

function removeAssignment(assignmentId, realWork, resource) {
  var planningMode=dojo.byId('planningMode').value;
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  if (parseFloat(realWork)) {
    msg=i18n('msgUnableToDeleteRealWork');
    showAlert(msg);
    return;
  }
  actionOK=function() {
    loadContent("../tool/removeAssignment.php?assignmentId=" + assignmentId
        + "&assignmentRefType=" + dojo.byId('objectClass').value
        + "&assignmentRefId=" + dojo.byId("objectId").value + "&planningMode="
        + planningMode, "resultDivMain", null, true, "assignment");
  };
  msg=i18n('confirmDeleteAssignment', new Array(resource));
  if (planningMode == 'MAN') {
    msg+='<br/><br/>' + i18n("confirmControlDeletePlannedWork");
  }
  showConfirm(msg, actionOK);
}

function assignmentChangeResourceTeamForCapacity() {
  if (editAssignmentLoading)
    return;
  var idResource=dijit.byId("assignmentIdResource").get("value");
  var isResourceTeamDialog=document.getElementById("isResourceTeam").value;
  if (idResource.trim()) {
    enableWidget('dialogAssignmentSubmit');
  } else {
    disableWidget('dialogAssignmentSubmit');
  }
  if (!idResource.trim()) {
    return;
  }
  dojo.xhrGet({
    url : '../tool/getIfResourceTeamOrResource.php?idResource=' + idResource,
    handleAs : "text",
    load : function(data) {
      if (data == 'isResourceTeam' && !isResourceTeamDialog) { // in case if we
        // are in
        // resourceTeam
        // assignment
        // dialog
        dojo.byId('assignmentRateRow').style.display="none";
        dojo.byId('assignmentCapacityResourceTeam').style.display="table-row";
        dojo.byId('assignmentUniqueSelection').style.display="table-row";
      } else {
        dojo.byId('assignmentRateRow').style.display="table-row";
        dojo.byId('assignmentCapacityResourceTeam').style.display="none";
        dojo.byId('assignmentUniqueSelection').style.display="none";
        dijit.byId('assignmentUnique').set('checked', false);
      }
      var planningMode=dojo.byId('planningMode').value;
      if (planningMode == 'MAN') {
        dojo.byId('assignmentRateRow').style.display="none";
      }
    }
  });
}

function assignmentChangeUniqueResource(newValue) {
  if (newValue == false) {
    dojo.byId('assignmentRateRow').style.display="none";
    dojo.byId('assignmentCapacityResourceTeam').style.display="table-row";
  } else {
    dojo.byId('assignmentRateRow').style.display="table-row";
    dojo.byId('assignmentCapacityResourceTeam').style.display="none";
  }
}

assignmentUserSelectUniqueResourceCurrent=null;
function assignmentUserSelectUniqueResource(newValue, idRes) {
  if (assignmentUserSelectUniqueResourceCurrent != null)
    return;
  assignmentUserSelectUniqueResourceCurrent=idRes;
  dojo.query(".dialogAssignmentManualSelectCheck").forEach(
      function(node, index, nodelist) {
        var id=node.getAttribute('widgetid');
        if (dijit.byId(id) && parseInt(id.substr(34)) != parseInt(idRes)) {
          dijit.byId(id).set('checked', false);
        }
      });
  dojo.byId("dialogAssignmentManualSelect").value=(newValue) ? idRes : null;
  setTimeout("assignmentUserSelectUniqueResourceCurrent=null;", 100);
}

function assignmentChangeResource() {
  if (editAssignmentLoading)
    return;
  var idResource=dijit.byId("assignmentIdResource").get("value");
  var isTeam=dojo.byId("isTeam").value;
  var isOrganization=dojo.byId("isOrganization").value;
  var isResourceTeam=dojo.byId("isResourceTeam").value;
  if (!idResource) {
    return;
  }
  if (dijit.byId('assignmentDailyCost')) {
    dijit.byId('assignmentDailyCost').reset();
  }
  dojo.xhrGet({
    url : '../tool/getSingleData.php?dataType=resourceRole&idResource='
        + idResource + '&isTeam=' + isTeam + '&isOrganization='
        + isOrganization + '&isResourceTeam=' + isResourceTeam,
    handleAs : "text",
    load : function(data) {
      // if (data) dijit.byId('assignmentCapacity').set('value',
      // parseInt(data)); // Error fixed by PBER : we retreive an idRole (and
      // must)
      if (data)
        dijit.byId('assignmentIdRole').set('value', parseInt(data));
    }
  });
}

function assignmentChangeResourceSelectFonction() {
  if (editAssignmentLoading)
    return;
  var idResource=dijit.byId("assignmentIdResource").get("value");
  if (!idResource) {
    return;
  }
  if (dijit.byId('assignmentDailyCost')) {
    dijit.byId('assignmentDailyCost').reset();
  }
  dojo.xhrGet({
    url : '../tool/getSingleData.php?dataType=resourceRole&idResource='
        + idResource,
    handleAs : "text",
    load : function(data) {
      refreshListSpecific('listRoleResource', 'assignmentIdRole', 'idResource',
          idResource);
      if (data) {
        dijit.byId('assignmentIdRole').set('value', parseInt(data));
      } else {
        dijit.byId('assignmentIdRole').set('value', null);
      }
    }
  });
}

function refreshReccurentAssignmentDiv() {
  showWait();
  callBack=function() {
    hideWait();
  };
  loadContent('../tool/refreshReccurentAssignmentDiv.php',
      'recurringAssignmentDiv', 'assignmentForm', null, null, null, null,
      callBack);
}

function assignmentChangeRole() {
  if (editAssignmentLoading)
    return;
  var idResource=dijit.byId("assignmentIdResource").get("value");
  var idRole=dijit.byId("assignmentIdRole").get("value");
  if (!idRole.trim())
    disableWidget('dialogAssignmentSubmit');
  else if (dijit.byId('dialogAssignmentSubmit').get('disabled') == true)
    enableWidget('dialogAssignmentSubmit');
  if (!idResource || !idRole)
    return;
  dojo.xhrGet({
    url : '../tool/getSingleData.php?dataType=resourceCost&idResource='
        + idResource + '&idRole=' + idRole,
    handleAs : "text",
    load : function(data) {
      dijit.byId('assignmentDailyCost').set('value', dojo.number.format(data));
    }
  });
}

function assUpdateLeftWork(id) {
  var initAss=dojo.byId('initAss_' + id).value;
  var assign=dijit.byId("assAssignedWork_" + id).get('value');
  var newAss=assign;
  if (newAss == null || isNaN(newAss)) {
    newAss=0;
    dijit.byId("assAssignedWork_" + id).set('value', 0);
  }
  isOnRealTime=false;
  if (dojo.byId('objectClass').value == 'Activity') {
    isOnRealTime=dijit.byId('workOnRealTime').get('value');
    if (isOnRealTime == 'on') {
      var realdWork=dojo.byId("RealWork_" + id).value;
      if (assign < realdWork) {
        dijit.byId("assAssignedWork_" + id).set("value",
            dojo.byId('initAss_' + id).value);
        dojo.byId('initLeft_' + id).value=dojo.byId('initAss_' + id).value;
        showAlert(i18n('assingedWorkCantBeLowerInWorkOnRealTime'));
        return;
      }
    }
  }
  var leftWork=dijit.byId('assLeftWork_' + id).get("value");
  var diff=(newAss) - (initAss);
  var newLeft=leftWork + diff;
  if (newLeft < 0 || isNaN(newLeft)) {
    newLeft=0;
  }
  var objClass=dojo.byId('objectClass').value;
  var assPeAss=dijit.byId(objClass + 'PlanningElement_assignedWork');
  var valPeAss=dijit.byId(objClass + 'PlanningElement_validatedWork');
  if (assPeAss) {
    assPeAss.set("value", assPeAss.get("value") + diff);
  }
  if (dojo.byId('objectClass').value == 'Activity' && isOnRealTime == 'on'
      && valPeAss) {
    valPeAss.set("value", assPeAss.get("value"));
  }
  dijit.byId('assLeftWork_' + id).set("value", newLeft); // Will trigger the
  // saveLeftWork()
  // function
  dojo.byId('initAss_' + id).value=newAss;
  diff=0;
  dojo.byId(objClass + 'PlanningElement_assignedCost').style.textDecoration="line-through";
  if (dojo.byId('objectClass').value == 'Activity' && isOnRealTime == 'on') {
    dojo.byId(objClass + 'PlanningElement_validatedCost').style.textDecoration="line-through";
    ;
  }
}

function assUpdateLeftWorkDirect(id) {
  var objClass=dojo.byId('objectClass').value;
  var initLeft=dojo.byId('initLeft_' + id).value;
  var assign=dijit.byId("assAssignedWork_" + id).get('value');
  var left=dijit.byId("assLeftWork_" + id).get('value');
  if (left == null || isNaN(left)) {
    left=0;
  }
  if (objClass == 'Activity') {
    var isOnRealTime=dijit.byId('workOnRealTime').get('value');
    if (isOnRealTime == 'on') {
      var realdWork=dojo.byId("RealWork_" + id).value;
      var assign=parseFloat(dijit.byId("assAssignedWork_" + id).get('value'));
      var revised=parseFloat(realdWork) + parseFloat(left);
      if (assign != revised) {
        dijit.byId("assAssignedWork_" + id).set("value", revised);
        dojo.byId('initAss_' + id).value=revised;
      }
    }
  }
  var diff=(left) - (initLeft);
  var assPeLeft=dijit.byId(objClass + 'PlanningElement_leftWork');
  if (assPeLeft) {
    assPeLeft.set("value", assPeLeft.get("value") + diff);
  }
  var assPePlanned=dijit.byId(objClass + 'PlanningElement_plannedWork');
  if (assPePlanned) {
    assPePlanned.set("value", assPePlanned.get("value") + diff);
  }
  //
  dojo.byId('initLeft_' + id).value=left;
  diff=0;
  dojo.byId(objClass + 'PlanningElement_leftCost').style.textDecoration="line-through";
}

function saveAssignedWork(id, zone) {
  var value=dijit.byId("ass" + zone + "_" + id).get("value");
  var objClass=dojo.byId('objectClass').value;
  var url='../tool/saveLeftWork.php?idAssign=' + id + '&zone=' + zone
      + '&valueTextZone=' + value;
  dojo
      .xhrPut({
        url : url,
        form : 'objectForm',
        handleAs : "text",
        load : function(data) {
          addMessage(i18n("col" + zone) + " " + i18n("resultSave"));
          document.getElementById('idImage' + zone + id).style.display="none";
          setTimeout("dojo.byId('idImage" + zone + id
              + "').style.display='block';", 1000);
        }
      });
}

function saveLeftWork(id, zone) {
  var value=dijit.byId("ass" + zone + "_" + id).get("value");
  if (isNaN(value) || value == null) {
    value=0;
    dijit.byId("ass" + zone + "_" + id).set("value", 0);
  }
  isOnRealTime=false;
  if (dojo.byId('objectClass').value == 'Activity') {
    isOnRealTime=dijit.byId('workOnRealTime').get('value');
  }
  
  var initLeft=dojo.byId('initLeft_' + id).value;
  var objClass=dojo.byId('objectClass').value;
  var assPeLeft=dijit.byId(objClass + 'PlanningElement_leftWork');
  var assPePlan=dijit.byId(objClass + 'PlanningElement_plannedWork');
  var assPeAss=dijit.byId(objClass + 'PlanningElement_assignedWork');
  var valPeAss=dijit.byId(objClass + 'PlanningElement_validatedWork');
  
  var diff=value - initLeft;

  if (assPeLeft) {
    assPeLeft.set("value", assPeLeft.get("value") + diff);
  }
  if (assPePlan) {
    assPePlan.set("value", assPePlan.get("value") + diff);
  }
  if (dojo.byId('objectClass').value == 'Activity' && isOnRealTime == 'on'
    && assPeAss) {
    assPeAss.set("value", assPePlan.get("value") + diff);
  }
  
  if (dojo.byId('objectClass').value == 'Activity' && isOnRealTime == 'on'
    && valPeAss) {
    valPeAss.set("value", assPePlan.get("value") + diff);
  }
  //
  var url='../tool/saveLeftWork.php?idAssign=' + id + '&zone=' + zone
      + '&valueTextZone=' + value;
  dojo
      .xhrPut({
        url : url,
        form : 'objectForm',
        handleAs : "text",
        load : function(data) {
          addMessage(i18n("col" + zone) + " " + i18n("resultSave"));
          document.getElementById('idImage' + zone + id).style.display="block";
          setTimeout("dojo.byId('idImage" + zone + id
              + "').style.display='none';", 1000);
          var objClass=dojo.byId('objectClass').value;
          if (data) {
            dijit.byId(objClass + 'PlanningElement_realEndDate').set('value',
                data);
          } else {
            dijit.byId(objClass + 'PlanningElement_realEndDate').set('value',
                null);
          }
        }
      });
  dojo.byId('initLeft_' + id).value=value;
  dojo.byId(objClass + 'PlanningElement_leftCost').style.textDecoration="line-through";
  dojo.byId(objClass + 'PlanningElement_plannedCost').style.textDecoration="line-through";
}

// =============================================================================
// = Dependency
// =============================================================================

function addDependency(depType) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  noRefreshDependencyList=false;
  var objectClass=dojo.byId('objectClass').value;
  var objectId=dojo.byId("objectId").value;
  var message=i18n("dialogDependency");
  if (depType) {
    dojo.byId("dependencyType").value=depType;
    message=i18n("dialogDependencyRestricted", new Array(i18n(objectClass),
        objectId, i18n(depType)));
  } else {
    dojo.byId("dependencyType").value=null;
    message=i18n("dialogDependencyExtended", new Array(i18n(objectClass),
        objectId.value));
  }
  if (objectClass == 'Requirement') {
    refreshList('idDependable', 'scope', 'R', '4', 'dependencyRefTypeDep', true);
    dijit.byId("dependencyRefTypeDep").set('value', '4');
    dijit.byId("dependencyDelay").set('value', '0');
    dojo.byId("dependencyDelayDiv").style.display="none";
    dojo.byId("dependencyTypeDiv").style.display="none";
  } else if (objectClass == 'TestCase') {
    refreshList('idDependable', 'scope', 'TC', '5', 'dependencyRefTypeDep',
        true);
    dijit.byId("dependencyRefTypeDep").set('value', '5');
    dijit.byId("dependencyDelay").set('value', '0');
    dojo.byId("dependencyDelayDiv").style.display="none";
    dojo.byId("dependencyTypeDiv").style.display="none";
  } else {
    if (objectClass == 'Project') {
      dijit.byId("dependencyRefTypeDep").set('value', '3');
      refreshList('idDependable', 'scope', 'PE', '3', 'dependencyRefTypeDep',
          true);
    } else {
      dijit.byId("dependencyRefTypeDep").set('value', '1');
      refreshList('idDependable', 'scope', 'PE', '1', 'dependencyRefTypeDep',
          true);
    }
    if (objectClass == 'Term') {
      dojo.byId("dependencyDelayDiv").style.display="none";
      dojo.byId("dependencyTypeDiv").style.display="none";
      dijit.byId("typeOfDependency").set("value", "E-S");
    } else {
      dojo.byId("dependencyDelayDiv").style.display="block";
      dojo.byId("dependencyTypeDiv").style.display="block";
    }
  }
  dojo.byId("dependencyRefType").value=objectClass;
  dojo.byId("dependencyRefId").value=objectId;
  refreshList('idActivity', 'idProject', '0', null, 'dependencyRefIdDepEdit',
      false);
  dijit.byId('dependencyRefIdDepEdit').reset();
  dojo.byId("dependencyId").value="";
  dijit.byId("dialogDependency").set('title', message);
  dijit.byId("dialogDependency").show();
  dojo.byId('dependencyAddDiv').style.display='block';
  dojo.byId('dependencyEditDiv').style.display='none';
  dijit.byId("dependencyRefTypeDep").set('readOnly', false);
  dijit.byId("dependencyComment").set('value', null);
  disableWidget('dialogDependencySubmit');
  refreshDependencyList();
}

function editDependency(depType, id, refType, refTypeName, refId, delay,
    typeOfDependency) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  noRefreshDependencyList=true;
  var objectClass=dojo.byId('objectClass').value;
  var objectId=dojo.byId("objectId").value;
  var message=i18n("dialogDependencyEdit");
  if (objectClass == 'Requirement') {
    refreshList('idDependable', 'scope', 'R', refType, 'dependencyRefTypeDep',
        true);
    dijit.byId("dependencyRefTypeDep").set('value', refType);
    dijit.byId("dependencyDelay").set('value', '0');
    dojo.byId("dependencyDelayDiv").style.display="none";
    dojo.byId("dependencyTypeDiv").style.display="none";
  } else if (objectClass == 'TestCase') {
    refreshList('idDependable', 'scope', 'TC', refType, 'dependencyRefTypeDep',
        true);
    dijit.byId("dependencyRefTypeDep").set('value', refType);
    dijit.byId("dependencyDelay").set('value', '0');
    dojo.byId("dependencyDelayDiv").style.display="none";
    dojo.byId("dependencyTypeDiv").style.display="none";
  } else {
    refreshList('idDependable', 'scope', 'PE', refType, 'dependencyRefTypeDep',
        true);
    dijit.byId("dependencyRefTypeDep").set('value', refType);
    dijit.byId("dependencyDelay").set('value', delay);
    dojo.byId("dependencyDelayDiv").style.display="block";
    dojo.byId("dependencyTypeDiv").style.display="block";
  }
  refreshList('id' + refTypeName, 'idProject', '0', refId,
      'dependencyRefIdDepEdit', true);
  dijit.byId('dependencyRefIdDepEdit').set('value', refId);
  dojo.byId("dependencyId").value=id;
  dojo.byId("dependencyRefType").value=objectClass;
  dojo.byId("dependencyRefId").value=objectId;
  dojo.byId("dependencyType").value=depType;
  dijit.byId("typeOfDependency").set('value', typeOfDependency);
  dijit.byId("dialogDependency").set('title', message);
  dijit.byId("dialogDependency").show();
  dojo.byId('dependencyAddDiv').style.display='none';
  dojo.byId('dependencyEditDiv').style.display='block';
  dijit.byId("dependencyRefTypeDep").set('readOnly', true);
  dijit.byId("dependencyRefIdDepEdit").set('readOnly', true);
  disableWidget('dialogDependencySubmit');
  disableWidget('dependencyComment');
  dijit.byId('dependencyComment').set('value', "");
  dojo.xhrGet({
    url : '../tool/getSingleData.php?dataType=dependencyComment&idDependency='
        + id,
    handleAs : "text",
    load : function(data) {
      dijit.byId('dependencyComment').set('value', data);
      enableWidget('dialogDependencySubmit');
      enableWidget('dependencyComment');
    }
  });
}

var noRefreshDependencyList=false;
function refreshDependencyList(selected) {
  if (noRefreshDependencyList)
    return;
  disableWidget('dialogDependencySubmit');
  var url='../tool/dynamicListDependency.php';
  if (selected) {
    url+='?selected=' + selected;
  }
  loadContent(url, 'dialogDependencyList', 'dependencyForm', false);
}

function saveDependency() {
  var formVar=dijit.byId('dependencyForm');
  if (!formVar.validate()) {
    showAlert(i18n("alertInvalidForm"));
    return;
  }
  if (dojo.byId("dependencyRefIdDep").value == ""
      && !dojo.byId('dependencyId').value)
    return;
  loadContent("../tool/saveDependency.php", "resultDivMain", "dependencyForm",
      true, 'dependency');
  dijit.byId('dialogDependency').hide();
}

function saveDependencyFromDndLink(ref1Type, ref1Id, ref2Type, ref2Id) {
  if (ref1Type == ref2Type && ref1Id == ref2Id)
    return;
  param="ref1Type=" + ref1Type;
  param+="&ref1Id=" + ref1Id;
  param+="&ref2Type=" + ref2Type;
  param+="&ref2Id=" + ref2Id;
  loadContent("../tool/saveDependencyDnd.php?" + param, "resultDivMain", null,
      true, 'dependency');
}

function removeDependency(dependencyId, refType, refId) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  dojo.byId("dependencyId").value=dependencyId;
  actionOK=function() {
    loadContent("../tool/removeDependency.php", "resultDivMain",
        "dependencyForm", true, 'dependency');
  };
  msg=i18n('confirmDeleteLink', new Array(i18n(refType), refId));
  showConfirm(msg, actionOK);
}

// =============================================================================
// = Plan
// =============================================================================

var oldSelectedProjectsToPlan=null;
function showPlanParam(selectedProject) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  dijit.byId("dialogPlan").show();
  oldSelectedProjectsToPlan=dijit.byId("idProjectPlan").get("value");
}

function changedIdProjectPlan(value) {
  var selectField=dijit.byId("idProjectPlan").get("value");
  if (selectField.length <= 0) {
    dijit.byId('dialogPlanSubmit').set('disabled', true);
  } else {
    dijit.byId('dialogPlanSubmit').set('disabled', false);
  }
  if (!oldSelectedProjectsToPlan || oldSelectedProjectsToPlan == value)
    return;
  if (oldSelectedProjectsToPlan.indexOf(" ") >= 0 && value.length > 1) {
    if (value.indexOf(" ") >= 0) {
      value.splice(0, 1);
    }
    oldSelectedProjectsToPlan=value;
    dijit.byId("idProjectPlan").set("value", value);
  } else if (value.indexOf(" ") >= 0
      && oldSelectedProjectsToPlan.indexOf(" ") === -1) {
    value=[ " " ];
    oldSelectedProjectsToPlan=value;
    dijit.byId("idProjectPlan").set("value", value);
  }
  oldSelectedProjectsToPlan=value;
}

function showSelectedProject(value) {
  var selectedProj=oldSelectedProjectsToPlan;
  var callback=function() {
    dijit.byId("idProjectPlan").set("value", selectedProj);
    var selectField=dijit.byId("idProjectPlan").get("value");
    if (selectField.length <= 0) {
      dijit.byId('dialogPlanSubmit').set('disabled', true);
    } else {
      dijit.byId('dialogPlanSubmit').set('disabled', false);
    }
  };
  loadContent("../view/refreshSelectedProjectListDiv.php?isChecked=" + value
      + "&selectedProjectPlan=" + selectedProj, "selectProjectList",
      "dialogPlanForm", false, null, null, null, callback);
}

function plan() {
  var bt=dijit.byId('planButton');
  if (bt) {
    bt.set('iconClass', "dijitIcon iconPlan");
  }
  if (!dijit.byId('idProjectPlan').get('value')) {
    dijit.byId('idProjectPlan').set('value', ' ');
  }
  if (!dijit.byId('startDatePlan').get('value')) {
    showAlert(i18n('messageInvalidDate'));
    return;
  }
  loadContent("../tool/plan.php", "resultDivMain", "dialogPlanForm", true, null);
  dijit.byId("dialogPlan").hide();
}

function cancelPlan() {
  if (!dijit.byId('idProjectPlan').get('value')) {
    dijit.byId('idProjectPlan').set('value', ' ');
  }
  dijit.byId('dialogPlan').hide();
}

function showPlanSaveDates() {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  callBack=function() {
    var proj=dijit.byId('idProjectPlan');
    if (proj && proj.get('value') && proj.get('value') != '*') {
      dijit.byId('idProjectPlanSaveDates').set('value', proj.get('value'));
    }
  };
  loadDialog('dialogPlanSaveDates', callBack, true, null, true);
}

function planSaveDates() {
  var formVar=dijit.byId('dialogPlanSaveDatesForm');
  if (!formVar.validate()) {
    showAlert(i18n("alertInvalidForm"));
    return;
  }
  if (!dijit.byId('idProjectPlanSaveDates').get('value')) {
    dijit.byId('idProjectPlanSaveDates').set('value', ' ');
  }
  loadContent("../tool/planSaveDates.php", "resultDivMain",
      "dialogPlanSaveDatesForm", true, null);
  dijit.byId("dialogPlanSaveDates").hide();
}

// =============================================================================
// = Baseline
// =============================================================================

function showPlanningBaseline() {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  callBack=function() {
    var proj=dijit.byId('idProjectPlan');
    if (proj) {
      dijit.byId('idProjectPlanBaseline').set('value', proj.get('value'));
    }
  };
  loadDialog('dialogPlanBaseline', callBack, true);
}

function savePlanningBaseline() {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  var callback=function() {
    dijit.byId('selectBaselineTop').reset();
    dijit.byId('selectBaselineBottom').reset();
    refreshList('idBaselineSelect', null, null, null, 'selectBaselineTop');
    refreshList('idBaselineSelect', null, null, null, 'selectBaselineBottom');
  };
  if (dojo.byId('isGlobalPlanning')) {
    if (dojo.byId('globalPlanning')
        && dojo.byId('globalPlanning').value == 'true') {
      dojo.byId('isGlobalPlanning').value='true';
    }
  }
  var formVar=dijit.byId('dialogPlanBaselineForm');
  if (formVar.validate()) {
    loadContent("../tool/savePlanningBaseline.php", "resultDivMain",
        "dialogPlanBaselineForm", true, null, null, null, callback);
    dijit.byId("dialogPlanBaseline").hide();
  } else {
    showAlert(i18n("alertInvalidForm"));
  }
}

function editBaseline(baselineId) {
  var params="&editMode=true&baselineId=" + baselineId;
  loadDialog('dialogPlanBaseline', null, true, params, true);
}

function removeBaseline(baselineId) {
  var param="?baselineId=" + baselineId;
  actionOK=function() {
    loadContent("../tool/removePlanningBaseline.php" + param,
        "dialogPlanBaseline", null);
  };
  msg=i18n('confirmDelete', new Array(i18n('Baseline'), baselineId));
  showConfirm(msg, actionOK);
}

// =============================================================================
// = Affectation
// =============================================================================

function addAffectation(objectClass, type, idResource, idProject) {
  var callBack=function() {
    affectationLoad=true;
    dijit.byId("dialogAffectation").show();
    setTimeout("affectationLoad=false", 500);
  };
  var params="&idProject=" + idProject;
  params+="&objectClass=" + objectClass;
  params+="&idResource=" + idResource;
  params+="&type=" + type;
  params+="&mode=add";
  loadDialog('dialogAffectation', callBack, false, params);
}

function addResourceCapacity(objectClass, type, idResource) {
  var callBack=function() {
    affectationLoad=true;
    dijit.byId("dialogResourceCapacity").show();
    setTimeout("affectationLoad=false", 500);
  };
  var params="&idResource=" + idResource;
  params+="&type=" + type;
  params+="&mode=add";
  loadDialog('dialogResourceCapacity', callBack, false, params);
}

function saveResourceCapacity(capacity) {
  var formVar=dijit.byId('resourceCapacityForm');
  if (dijit.byId('resourceCapacityStartDate')
      && dijit.byId('resourceCapacityEndDate')) {
    var start=dijit.byId('resourceCapacityStartDate').value;
    var end=dijit.byId('resourceCapacityEndDate').value;
    if (start && end && dayDiffDates(start, end) < 0) {
      showAlert(i18n("errorStartEndDates", new Array(i18n("colStartDate"),
          i18n("colEndDate"))));
      return;
    }
  }
  if (dijit.byId('resourceCapacity')) {
    var newCapacity=dijit.byId('resourceCapacity').value;
    if (capacity === newCapacity) {
      showAlert(i18n("changeCapacity"));
      return;
    }
  }

  if (formVar.validate()) {
    loadContent("../tool/saveResourceCapacity.php", "resultDivMain",
        "resourceCapacityForm", true, 'affectation');
    dijit.byId('dialogResourceCapacity').hide();
  } else {
    showAlert(i18n("alertInvalidForm"));
  }
}

function removeResourceCapacity(id, idResource) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  actionOK=function() {
    loadContent("../tool/removeResourceCapacity.php?idResourceCapacity=" + id
        + "&idResource=" + idResource, "resultDivMain", null, true,
        'affectation');
  };
  msg=i18n('confirmDeleteResourceCapacity', new Array(id, i18n('Resource'),
      idResource));
  showConfirm(msg, actionOK);
}

function editResourceCapacity(id, idResource, capacity, idle, startDate,
    endDate) {
  affectationLoad=true;
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  var callBack=function() {
    dojo
        .xhrGet({
          url : '../tool/getSingleData.php?dataType=resourceCapacityDescription&idResourceCapacity='
              + id,
          handleAs : "text",
          load : function(data) {
            dijit.byId('resourceCapacityDescription').set('value', data);
            enableWidget("resourceCapacityDescription");
          }
        });
    if (capacity) {
      dijit.byId("resourceCapacity").set('value', parseFloat(capacity));
    }
    if (startDate) {
      dijit.byId("resourceCapacityStartDate").set('value', startDate);
    } else {
      dijit.byId("resourceCapacityStartDate").reset();
    }
    if (endDate) {
      dijit.byId("resourceCapacityEndDate").set('value', endDate);
    } else {
      dijit.byId("resourceCapacityEndDate").reset();
    }
    if (idle == 1) {
      dijit.byId("resourceCapacityIdle").set('value', idle);
    } else {
      dijit.byId("resourceCapacityIdle").reset();
    }
    dijit.byId("dialogResourceCapacity").show();
    setTimeout("affectationLoad=false", 500);
  };
  var params="&id=" + id;
  params+="&idResource=" + idResource;
  params+="&mode=edit";
  loadDialog('dialogResourceCapacity', callBack, false, params);
}

// end workUnit

// gautier resourceSurbooking
function addResourceSurbooking(objectClass, type, idResource) {
  var callBack=function() {
    affectationLoad=true;
    dijit.byId("dialogResourceSurbooking").show();
    setTimeout("affectationLoad=false", 500);
  };
  var params="&idResource=" + idResource;
  params+="&type=" + type;
  params+="&mode=add";
  loadDialog('dialogResourceSurbooking', callBack, false, params);
}

function saveResourceSurbooking(capacity) {
  var formVar=dijit.byId('resourceSurbookingForm');
  if (dijit.byId('resourceSurbookingStartDate')
      && dijit.byId('resourceSurbookingEndDate')) {
    var start=dijit.byId('resourceSurbookingStartDate').value;
    var end=dijit.byId('resourceSurbookingEndDate').value;
    if (start && end && dayDiffDates(start, end) < 0) {
      showAlert(i18n("errorStartEndDates", new Array(i18n("colStartDate"),
          i18n("colEndDate"))));
      return;
    }
  }
  if (dijit.byId('resourceSurbooking')) {
    var newCapacity=dijit.byId('resourceSurbooking').value;
    if (newCapacity === 0) {
      showAlert(i18n("changeSurbooking"));
      return;
    }
  }
  if (formVar.validate()) {
    loadContent("../tool/saveResourceSurbooking.php", "resultDivMain",
        "resourceSurbookingForm", true, 'affectation');
    dijit.byId('dialogResourceSurbooking').hide();
  } else {
    showAlert(i18n("alertInvalidForm"));
  }
}

function removeResourceSurbooking(id, idResource) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  actionOK=function() {
    loadContent("../tool/removeResourceSurbooking.php?idResourceSurbooking="
        + id + "&idResource=" + idResource, "resultDivMain", null, true,
        'affectation');
  };
  msg=i18n('confirmDeleteResourceSurbooking', new Array(id, i18n('Resource'),
      idResource));
  showConfirm(msg, actionOK);
}

function editResourceSurbooking(id, idResource, capacity, idle, startDate,
    endDate) {
  affectationLoad=true;
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  var callBack=function() {
    dojo
        .xhrGet({
          url : '../tool/getSingleData.php?dataType=resourceSurbookingDescription&idResourceSurbooking='
              + id,
          handleAs : "text",
          load : function(data) {
            dijit.byId('resourceSurbookingDescription').set('value', data);
            enableWidget("resourceSurbookingDescription");
          }
        });
    if (capacity) {
      dijit.byId("resourceSurbooking").set('value', parseFloat(capacity));
    }
    if (startDate) {
      dijit.byId("resourceSurbookingStartDate").set('value', startDate);
    } else {
      dijit.byId("resourceSurbookingStartDate").reset();
    }
    if (endDate) {
      dijit.byId("resourceSurbookingEndDate").set('value', endDate);
    } else {
      dijit.byId("resourceSurbookingEndDate").reset();
    }
    if (idle == 1) {
      dijit.byId("resourceSurbookingIdle").set('value', idle);
    } else {
      dijit.byId("resourceSurbookingIdle").reset();
    }
    dijit.byId("dialogResourceSurbooking").show();
    setTimeout("affectationLoad=false", 500);
  };
  var params="&id=" + id;
  params+="&idResource=" + idResource;
  params+="&mode=edit";
  loadDialog('dialogResourceSurbooking', callBack, false, params);
}

// gautier #resourceTeam
function addAffectationResourceTeam(objectClass, type, idResource) {
  var callBack=function() {
    affectationLoad=true;
    dijit.byId("dialogAffectationResourceTeam").show();
    setTimeout("affectationLoad=false", 500);
  };
  var params="&idResource=" + idResource;
  params+="&type=" + type;
  params+="&mode=add";
  loadDialog('dialogAffectationResourceTeam', callBack, false, params);
}

function removeAffectation(id, own, affectedClass, affectedId) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  actionOK=function() {
    loadContent("../tool/removeAffectation.php?affectationId=" + id
        + "&affectationIdTeam=''", "resultDivMain", null, true, 'affectation');
  };
  if (own) {
    msg='<span style="color:red;font-weight:bold;">'
        + i18n('confirmDeleteOwnAffectation', new Array(id)) + '</span>';
  } else {
    msg=i18n('confirmDeleteAffectation', new Array(id, i18n(affectedClass),
        affectedId));
  }
  showConfirm(msg, actionOK);
}

function removeAffectationResourceTeam(id, idResource) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  actionOK=function() {
    loadContent("../tool/removeAffectationResourceTeam.php?affectaionId=" + id,
        "resultDivMain", null, true, 'affectation');
  };
  msg=i18n('confirmDeleteAffectation', new Array(id, i18n('Resource'),
      idResource));
  showConfirm(msg, actionOK);
}

affectationLoad=false;
function editAffectationResourceTeam(id, objectClass, type, idResource, rate,
    idle, startDate, endDate) {
  affectationLoad=true;
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  var callBack=function() {
    dojo
        .xhrGet({
          url : '../tool/getSingleData.php?dataType=affectationDescriptionResourceTeam&idAffectation='
              + id,
          handleAs : "text",
          load : function(data) {
            dijit.byId('affectationDescriptionResourceTeam').set('value', data);
            enableWidget("affectationDescriptionResourceTeam");
          }
        });
    if (idResource) {
      dijit.byId("affectationResourceTeam").set('value', idResource);
    }
    if (rate) {
      dijit.byId("affectationRateResourceTeam").set('value', rate);
    }
    if (startDate) {
      dijit.byId("affectationStartDateResourceTeam").set('value', startDate);
    } else {
      dijit.byId("affectationStartDateResourceTeam").reset();
    }
    if (endDate) {
      dijit.byId("affectationEndDateResourceTeam").set('value', endDate);
    } else {
      dijit.byId("affectationEndDateResourceTeam").reset();
    }
    if (idle == 1) {
      dijit.byId("affectationIdleResourceTeam").set('value', idle);
    } else {
      dijit.byId("affectationIdleResourceTeam").reset();
    }
    dijit.byId("dialogAffectationResourceTeam").show();
    setTimeout("affectationLoad=false", 500);
  };
  var params="&id=" + id;
  params+="&refType=" + dojo.byId('objectClass').value;
  params+="&idResource=" + idResource;
  params+="&mode=edit";
  params+="&type=" + type;
  params+="&objectClass=" + objectClass;
  loadDialog('dialogAffectationResourceTeam', callBack, false, params);
}

function editAffectation(id, objectClass, type, idResource, idProject, rate,
    idle, startDate, endDate, idProfile) {
  affectationLoad=true;
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  var callBack=function() {
    dojo
        .xhrGet({
          url : '../tool/getSingleData.php?dataType=affectationDescription&idAffectation='
              + id,
          handleAs : "text",
          load : function(data) {
            dijit.byId('affectationDescription').set('value', data);
            enableWidget("affectationDescription");
          }
        });
    if (startDate) {
      dijit.byId("affectationStartDate").set('value', startDate);
    } else {
      dijit.byId("affectationStartDate").reset();
    }
    if (endDate) {
      dijit.byId("affectationEndDate").set('value', endDate);
    } else {
      dijit.byId("affectationEndDate").reset();
    }
    if (idle == 1) {
      dijit.byId("affectationIdle").set('value', idle);
    } else {
      dijit.byId("affectationIdle").reset();
    }
    dijit.byId("dialogAffectation").show();
    setTimeout("affectationLoad=false", 500);
  };
  var params="&id=" + id;
  params+="&refType=" + dojo.byId('objectClass').value;
  params+="&idProject=" + idProject;
  params+="&idResource=" + idResource;
  params+="&mode=edit";
  params+="&type=" + type;
  params+="&objectClass=" + objectClass;
  loadDialog('dialogAffectation', callBack, false, params);
}

function saveAffectation() {
  var formVar=dijit.byId('affectationForm');
  if (dijit.byId('affectationStartDate') && dijit.byId('affectationEndDate')) {
    var start=dijit.byId('affectationStartDate').value;
    var end=dijit.byId('affectationEndDate').value;
    if (start && end && dayDiffDates(start, end) < 0) {
      showAlert(i18n("errorStartEndDates", new Array(i18n("colStartDate"),
          i18n("colEndDate"))));
      return;
    }
  }
  if (formVar.validate()) {
    loadContent("../tool/saveAffectation.php", "resultDivMain",
        "affectationForm", true, 'affectation');
    dijit.byId('dialogAffectation').hide();
  } else {
    showAlert(i18n("alertInvalidForm"));
  }
}

function saveAffectationResourceTeam() {
  var formVar=dijit.byId('affectationResourceTeamForm');
  if (dijit.byId('affectationStartDate') && dijit.byId('affectationEndDate')) {
    var start=dijit.byId('affectationStartDate').value;
    var end=dijit.byId('affectationEndDate').value;
    if (start && end && dayDiffDates(start, end) < 0) {
      showAlert(i18n("errorStartEndDates", new Array(i18n("colStartDate"),
          i18n("colEndDate"))));
      return;
    }
  }
  if (trim(dijit.byId('affectationResourceTeam')) == '') {
    showAlert(i18n("messageMandatory", new Array(i18n("colIdResource"))));
    return;
  }
  if (formVar.validate()) {
    loadContent("../tool/saveAffectationResourceTeam.php", "resultDivMain",
        "affectationResourceTeamForm", true, 'affectation');
    dijit.byId('dialogAffectationResourceTeam').hide();
  } else {
    showAlert(i18n("alertInvalidForm"));
  }
}

function affectTeamMembers(idTeam) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  var callBack=function() {
    dijit.byId("dialogAffectation").show();
  };
  var params="&affectationIdTeam=" + idTeam;
  loadDialog('dialogAffectation', callBack, false, params);
}

function affectOrganizationMembers(idOrganization) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  var callBack=function() {
    dijit.byId("dialogAffectation").show();
  };
  var params="&affectationIdOrganization=" + idOrganization;
  loadDialog('dialogAffectation', callBack, false, params);
}

function affectationChangeResource() {
  var idResource=dijit.byId("affectationResource").get("value");
  if (!idResource)
    return;
  if (affectationLoad)
    return;
  dojo.xhrGet({
    url : '../tool/getSingleData.php?dataType=resourceProfile&idResource='
        + idResource,
    handleAs : "text",
    load : function(data) {
      dijit.byId('affectationProfile').set('value', data);
    }
  });
}

function replaceAffectation(id, objectClass, type, idResource, idProject, rate,
    idle, startDate, endDate, idProfile) {
  var callback=function() {
    refreshList('idProfile', 'idProject', idProject, null,
        'replaceAffectationProfile', false);
  };
  var param="&idAffectation=" + id;
  loadDialog("dialogReplaceAffectation", callback, true, param);
}

function replaceAffectationSave() {
  var formVar=dijit.byId('replaceAffectationForm');
  if (dijit.byId('replaceAffectationStartDate')
      && dijit.byId('replaceAffectationEndDate')) {
    var start=dijit.byId('replaceAffectationStartDate').value;
    var end=dijit.byId('replaceAffectationEndDate').value;
    if (start && end && dayDiffDates(start, end) <= 0) {
      showAlert(i18n("errorStartEndDates", new Array(i18n("colStartDate"),
          i18n("colEndDate"))));
      return;
    }
  }
  if (dijit.byId('replaceAffectationResource').get("value") == dojo
      .byId("replaceAffectationExistingResource").value) {
    showAlert(i18n("errorReplaceResourceNotChanged"));
    return;
  }
  if (formVar.validate()) {
    loadContent("../tool/saveAffectationReplacement.php", "resultDivMain",
        "replaceAffectationForm", true, 'affectation');
    dijit.byId('dialogReplaceAffectation').hide();
  } else {
    showAlert(i18n("alertInvalidForm"));
  }
}

function replaceAffectationChangeResource() {
  var idResource=dijit.byId("replaceAffectationResource").get("value");
  if (!idResource)
    return;
  dojo.xhrGet({
    url : '../tool/getSingleData.php?dataType=resourceProfile&idResource='
        + idResource,
    handleAs : "text",
    load : function(data) {
      dijit.byId('replaceAffectationProfile').set('value', data);
    }
  });
  dojo.xhrGet({
    url : '../tool/getSingleData.php?dataType=resourceCapacity&idResource='
        + idResource,
    handleAs : "text",
    load : function(data) {
      dijit.byId('replaceAffectationCapacity').set('value', parseFloat(data));
    }
  });
}

function addResourceIncompatible(idResource) {
  var callBack=function() {
    dijit.byId("dialogResourceIncompatible").show();
  };
  var params="&idResource=" + idResource;
  loadDialog('dialogResourceIncompatible', callBack, false, params);
}

function saveResourceIncompatible() {
  var formVar=dijit.byId('resourceIncompatibleForm');
  if (formVar.validate()) {
    loadContent("../tool/saveResourceIncompatible.php", "resultDivMain",
        "resourceIncompatibleForm", true, 'affectation');
    dijit.byId('dialogResourceIncompatible').hide();
  } else {
    showAlert(i18n("alertInvalidForm"));
  }
}

function removeResourceIncompatible(id) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  actionOK=function() {
    loadContent("../tool/saveResourceIncompatible.php?idIncompatible=" + id,
        "resultDivMain", null, true, 'affectation');
  };
  msg=i18n('confirmDeleteResourceIncompatible', new Array(id, i18n('Resource')));
  showConfirm(msg, actionOK);
}

function addResourceSupport(idResource) {
  var callBack=function() {
    dijit.byId("dialogResourceSupport").show();
  };
  var params="&idResource=" + idResource;
  loadDialog('dialogResourceSupport', callBack, false, params);
}

function saveResourceSupport(mode) {
  var formVar=dijit.byId('resourceSupportForm');
  if (formVar.validate()) {
    loadContent("../tool/saveResourceSupport.php?mode=" + mode,
        "resultDivMain", "resourceSupportForm", true, 'affectation');
    dijit.byId('dialogResourceSupport').hide();
  } else {
    showAlert(i18n("alertInvalidForm"));
  }
}

function editResourceSupport(id) {
  var callBack=function() {
    dijit.byId("dialogResourceSupport").show();
  };
  var params="&idSupport=" + id;
  loadDialog('dialogResourceSupport', callBack, false, params);
}

function removeResourceSupport(id) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  actionOK=function() {
    loadContent("../tool/saveResourceSupport.php?idSupport=" + id,
        "resultDivMain", null, true, 'affectation');
  };
  msg=i18n('confirmDeleteResourceSupport', new Array(id, i18n('Resource')));
  showConfirm(msg, actionOK);
}

function assignTeamForMeeting() {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  actionOK=function() {
    loadContent("../tool/assignTeamForMeeting.php?assignmentId=&assignmentRefType="+dojo.byId('objectClass').value+"&assignmentRefId="+dojo.byId("objectId").value,"resultDivMain", null,
        true, 'assignment');
  };
  msg=i18n('confirmAssignWholeTeam');
  showConfirm(msg, actionOK);
  
}


function planningToCanvasToPDF(){

  var iframe = document.createElement('iframe');
  
  //this onload is for firefox but also work on others browsers
  iframe.onload = function() {
  var orientation="landscape";  // "portrait" ou "landscape"
  if(!document.getElementById("printLandscape").checked)orientation="portrait";
  var ratio=parseInt(document.getElementById("printZoom").value)/100;
  var repeatIconTask=document.getElementById("printRepeat").checked; // If true this will repeat on each page the icon
  loadContent("../tool/submitPlanningPdf.php", "resultDivMain", 'planningPdfForm', false,null,null,null,function(){showWait();});
  var sizeElements=[];
  var marge=30;
  var widthIconTask=0; // the width that icon+task represent
  //var heightColumn=parseInt(document.getElementById('leftsideTop').offsetHeight)*ratio;
  //damian #exportPDF
  var deviceRatio = window.devicePixelRatio;
  if(!deviceRatio){
    deviceRatio = 1;
  }
  var heightColumn=parseInt(document.getElementById('leftsideTop').offsetHeight)*deviceRatio;
  //var heightRow=21*ratio;
  var heightRow=21*deviceRatio;
  //var widthRow=(parseInt(dojo.query('.ganttRightTitle')[0].offsetWidth)-1)*ratio;
  var widthRow=(parseInt(dojo.query('.ganttRightTitle')[0].offsetWidth)-1);
  var nbRowTotal=0;
  var nbColTotal=0;
  // init max width/height by orientation
  var pageFormat='A4';
  if(document.getElementById("printFormatA3").checked)pageFormat="A3";
  var imageZoomIn=1.3/ratio;
  var imageZoomOut=1/imageZoomIn;
  ratio=1;
  var maxWidth=(596-(2*marge))*imageZoomIn;
  var maxHeight=(842-(2*marge))*imageZoomIn;
  if (pageFormat=='A3') {
    var maxTemp=maxWidth;
    maxWidth=maxHeight;
    maxHeight=2*maxTemp;
  }
  if(orientation=="landscape"){
    var maxTemp=maxWidth;
    maxWidth=maxHeight;
    maxHeight=maxTemp;
  }
  
  //We create an iframe will which contain the planning to transform it in image
  var frameContent=document.getElementById("iframeTmpPlanning");
  
  var cssLink2 = document.createElement("link");
  cssLink2.href = "css/projeqtor.css"; 
  cssLink2 .rel = "stylesheet"; 
  cssLink2 .type = "text/css"; 
  frameContent.contentWindow.document.head.appendChild(cssLink2);
  
  var cssLink = document.createElement("link");
  cssLink.href = "css/jsgantt.css"; 
  cssLink .rel = "stylesheet"; 
  cssLink .type = "text/css";
  frameContent.contentWindow.document.head.appendChild(cssLink);
  
  /*var css = document.createElement("style");
  css .type = "text/css";
  frameContent.contentWindow.document.head.appendChild(css);
  styles = '.rightTableLine{ height:22px; }';
  
  if (css.styleSheet) css.styleSheet.cssText = styles;
  else css.appendChild(document.createTextNode(styles));*/
  var heightV=(heightColumn+getMaxHeight(document.getElementById('leftside'))+(getMaxHeight(document.getElementById('leftside'))/21))+'px';
  
  frameContent.style.position='absolute';
  frameContent.style.width=(4+parseInt(document.getElementById('leftGanttChartDIV').style.width)+getMaxWidth(document.getElementById('rightTableContainer')))+'px';
  frameContent.style.height=heightV;
  frameContent.style.border='0';
  //frameContent.style.top='0';
  //frameContent.style.left='0';
  frameContent.contentWindow.document.body.innerHTML='<div style="float:left;width:'+document.getElementById('leftGanttChartDIV').style.width+';overflow:hidden;height:'+heightV+';">'+document.getElementById('leftGanttChartDIV').innerHTML+'</div><div style="float:left;width:'+getMaxWidth(document.getElementById('rightTableContainer'))+'px;height:'+heightV+';">'+document.getElementById('GanttChartDIV').innerHTML+"</div>";

  frameContent.contentWindow.document.getElementById('ganttScale').style.display='none';
  frameContent.contentWindow.document.getElementById('topGanttChartDIV').style.width=getMaxWidth(document.getElementById('rightTableContainer'))+'px';
  frameContent.contentWindow.document.getElementById('topGanttChartDIV').style.overflow='visible';
  frameContent.contentWindow.document.getElementById('mainRightPlanningDivContainer').style.overflow='visible';
  frameContent.contentWindow.document.getElementById('rightGanttChartDIV').style.overflow='visible';
  frameContent.contentWindow.document.getElementById('mainRightPlanningDivContainer').style.height=(getMaxHeight(document.getElementById('leftside')))+'px';
  frameContent.contentWindow.document.getElementById('rightGanttChartDIV').style.height=(getMaxHeight(document.getElementById('leftside')))+'px';
  frameContent.contentWindow.document.getElementById('rightGanttChartDIV').style.height=(getMaxHeight(document.getElementById('leftside')))+'px';
  frameContent.contentWindow.document.getElementById('dndSourceTable').style.height=(getMaxHeight(document.getElementById('leftside')))+'px';
  frameContent.contentWindow.document.getElementById('vScpecificDay_1').style.height=(getMaxHeight(document.getElementById('leftside')))+'px';
  frameContent.contentWindow.document.getElementById('leftside').style.top="0";
  frameContent.contentWindow.document.getElementById('leftsideTop').style.width=document.getElementById('leftGanttChartDIV').style.width;
  frameContent.contentWindow.document.getElementById('leftside').style.width=document.getElementById('leftGanttChartDIV').style.width;
  frameContent.contentWindow.document.getElementById('rightGanttChartDIV').style.overflowX="visible";
  frameContent.contentWindow.document.getElementById('rightGanttChartDIV').style.overflowY="visible";
  //Calculate each width column in left top side
  for(var i=0; i<dojo.query("[id^='topSourceTable'] tr")[1].childNodes.length;i++){
    sizeElements.push((dojo.query("[id^='topSourceTable'] tr")[1].childNodes[i].offsetWidth)*ratio);
  }
  for(var i=0; i<dojo.query("[class^='rightTableLine']").length;i++){
    dojo.query("[class^='rightTableLine']")[i].style.width=(parseInt(dojo.query("[class^='rightTableLine']")[i].style.width)-1)+"px";
  }
  for(var i=0; i<dojo.query("[class^='ganttDetail weekBackground']").length;i++){
    dojo.query("[class^='ganttDetail weekBackground']")[i].style.width=(parseInt(dojo.query("[class^='ganttDetail weekBackground']")[i].style.width)-1)+"px";
  }
  
  widthIconTask=(sizeElements[0]+sizeElements[1])*deviceRatio;
  if (widthIconTask>parseInt(document.getElementById('leftGanttChartDIV').style.width)*deviceRatio) widthIconTask=parseInt(document.getElementById('leftGanttChartDIV').style.width)*deviceRatio;
  
  sizeColumn=parseInt(dojo.query(".ganttRightTitle")[0].style.width)*ratio;
  
  frameContent.contentWindow.document.getElementById('rightGanttChartDIV').style.width=getMaxWidth(frameContent.contentWindow.document.getElementById('rightGanttChartDIV'))+'px';
  frameContent.contentWindow.document.getElementById('topGanttChartDIV').style.width=getMaxWidth(frameContent.contentWindow.document.getElementById('rightGanttChartDIV'))+'px';
  frameContent.contentWindow.document.getElementById('mainRightPlanningDivContainer').style.width=getMaxWidth(frameContent.contentWindow.document.getElementById('rightGanttChartDIV'))+'px';
  //add border into final print
  frameContent.contentWindow.document.getElementById('leftsideTop').innerHTML ='<div id="separatorLeftGanttChartDIV2" style="position:absolute;height:100%;z-index:10000;width:4px;background-color:#C0C0C0;"></div>'+frameContent.contentWindow.document.getElementById('leftsideTop').innerHTML;
  frameContent.contentWindow.document.getElementById('leftside').innerHTML ='<div id="separatorLeftGanttChartDIV" style="position:absolute;height:100%;z-index:10000;width:4px;background-color:#C0C0C0;"></div>'+frameContent.contentWindow.document.getElementById('leftside').innerHTML;
  frameContent.contentWindow.document.getElementById('leftside').style.width=(parseInt(frameContent.contentWindow.document.getElementById('leftside').style.width)+parseInt(frameContent.contentWindow.document.getElementById('separatorLeftGanttChartDIV').style.width))+'px';
  frameContent.contentWindow.document.getElementById('leftsideTop').style.width=frameContent.contentWindow.document.getElementById('leftside').style.width;
  frameContent.contentWindow.document.getElementById('separatorLeftGanttChartDIV').style.left=(parseInt(frameContent.contentWindow.document.getElementById('leftside').style.width)-4)+'px';
  frameContent.contentWindow.document.getElementById('separatorLeftGanttChartDIV2').style.left=(parseInt(frameContent.contentWindow.document.getElementById('leftsideTop').style.width)-4)+'px';
  frameContent.contentWindow.document.getElementById('rightGanttChartDIV').style.width=frameContent.contentWindow.document.getElementById('rightTableContainer').style.width;
  frameContent.contentWindow.document.getElementById('rightGanttChartDIV').style.height=frameContent.contentWindow.document.getElementById('rightTableContainer').style.height;

  var tabImage=[]; //Contain pictures 
  var mapImage={}; //Contain pictures like key->value, cle=namePicture, value=base64(picture)
  
  //Start the 4 prints function
  //Print image activities and projects
  html2canvas(frameContent.contentWindow.document.getElementById('leftside')).then(function(leftElement) {
    //Print image column left side
    html2canvas(frameContent.contentWindow.document.getElementById('leftsideTop')).then(function(leftColumn) { 
      //Print right Line
      html2canvas(frameContent.contentWindow.document.getElementById('rightGanttChartDIV')).then(function(rightElement) {
        //Print right column
        html2canvas(frameContent.contentWindow.document.getElementById('rightside')).then(function(rightColumn) {
          if(ratio!=1){
            leftElement=cropCanvas(leftElement,0,0,leftElement.width,leftElement.height,ratio);
            leftColumn=cropCanvas(leftColumn,0,0,leftColumn.width,leftColumn.height,ratio);
            rightElement=cropCanvas(rightElement,0,0,rightElement.width,rightElement.height,ratio);
            rightColumn=cropCanvas(rightColumn,0,0,rightColumn.width,rightColumn.height,ratio);
          }
          //Init number of total rows
          nbRowTotal=Math.round(leftElement.height/heightRow); 
          //frameContent.parentNode.removeChild(frameContent);
          //Start pictures's calcul
          firstEnterHeight=true;
          var EHeightValue=0; //Height pointer cursor
          var EHeight=leftElement.height; //total height
          while((Math.ceil(EHeight/maxHeight)>=1 || firstEnterHeight) && EHeight>heightRow){
            var calculHeight=maxHeight;
            var ELeftWidth=leftElement.width; //total width
            var ERightWidth=rightElement.width; //total width
            var addHeighColumn=0;
            if(firstEnterHeight || (!firstEnterHeight && repeatIconTask)){
              addHeighColumn=heightColumn;
            }
            var heightElement=0;
            while(calculHeight-addHeighColumn>=heightRow && nbRowTotal!=0){
              calculHeight-=heightRow;
              heightElement+=heightRow;
              nbRowTotal--;
            }
            var iterateurColumnLeft=0;
            firstEnterWidth=true;
            var widthElement=0;
            var imageRepeat=null;
            if(repeatIconTask){
              imageRepeat=combineCanvasIntoOne(
                              cropCanvas(leftColumn,0,0,widthIconTask,heightColumn),
                              cropCanvas(leftElement,0,EHeightValue,widthIconTask,heightElement),
                              true);
            }
            var canvasList=[];
            while(ELeftWidth/maxWidth>=1 || (!firstEnterWidth && ELeftWidth>0)){
              firstEnterWidth2=true;
              oldWidthElement=widthElement;
              while(iterateurColumnLeft<sizeElements.length && ELeftWidth>=sizeElements[iterateurColumnLeft]){
                ELeftWidth-=sizeElements[iterateurColumnLeft];
                widthElement+=sizeElements[iterateurColumnLeft]*deviceRatio;
                if(repeatIconTask && !firstEnterWidth && firstEnterWidth2)ELeftWidth+=widthIconTask;
                iterateurColumnLeft++;
                firstEnterWidth2=false;
              }
              if(oldWidthElement==widthElement){
                widthElement+=ELeftWidth;
                ELeftWidth=0;
              }
              if(!firstEnterWidth){
                if(repeatIconTask){
                  canvasList.push(combineCanvasIntoOne(imageRepeat,
                                  combineCanvasIntoOne(
                                      cropCanvas(leftColumn,oldWidthElement,0,widthElement-oldWidthElement,heightColumn),
                                      cropCanvas(leftElement,oldWidthElement,EHeightValue,widthElement-oldWidthElement,heightElement),
                                      true),
                                      false));
                }else{
                  if(firstEnterHeight){
                    canvasList.push(combineCanvasIntoOne(
                                        cropCanvas(leftColumn,oldWidthElement,0,widthElement-oldWidthElement,heightColumn),
                                        cropCanvas(leftElement,oldWidthElement,EHeightValue,widthElement-oldWidthElement,heightElement),
                                        true));
                  }else{
                    canvasList.push(cropCanvas(leftElement,oldWidthElement,EHeightValue,widthElement-oldWidthElement,heightElement));
                  } 
                }
              }else{
                if(firstEnterHeight || repeatIconTask){
                  canvasList.push(combineCanvasIntoOne(
                                        cropCanvas(leftColumn,oldWidthElement,0,widthElement-oldWidthElement,heightColumn),
                                        cropCanvas(leftElement,oldWidthElement,EHeightValue,widthElement-oldWidthElement,heightElement),
                                        true));
                }else{
                  canvasList.push(cropCanvas(leftElement,oldWidthElement,EHeightValue,widthElement-oldWidthElement,heightElement));                  
                }
              }
              firstEnterWidth=false;
            }
            if(canvasList.length==0){
              if(firstEnterHeight || repeatIconTask){
                canvasList.push(combineCanvasIntoOne(
                                        cropCanvas(leftColumn,0,0,leftColumn.width,heightColumn),
                                        cropCanvas(leftElement,0,EHeightValue,leftElement.width,heightElement),
                                        true));
              }else{
                canvasList.push(cropCanvas(leftElement,0,EHeightValue,leftElement.width,heightElement));
              }
            }
            firstEnterWidth=true;
            if(repeatIconTask && leftColumn.width>widthIconTask){
              imageRepeat=combineCanvasIntoOne(combineCanvasIntoOne(
                                                    cropCanvas(leftColumn,0,0,widthIconTask,heightColumn),
                                                    cropCanvas(leftElement,0,EHeightValue,widthIconTask,heightElement),
                                                    true),
                                               combineCanvasIntoOne(
                                                    cropCanvas(leftColumn,leftColumn.width-4,0,4,heightColumn),
                                                    cropCanvas(leftElement,leftElement.width-4,EHeightValue,4,heightElement),
                                                    true),
                                               false);
            }
            widthElement=0;
            firstEnterWidth=true;
            var canvasList2=[];
            //Init number of total cols
            nbColTotal=Math.round(rightElement.width/widthRow); 
            var countIteration=0;
            while((Math.ceil(ERightWidth/maxWidth)>=1 || (!firstEnterWidth && ERightWidth>0)) && nbColTotal>0){
              countIteration++;
              firstEnterWidth2=true;
              oldWidthElement=widthElement;
              limit=0;
              if(firstEnterWidth)limit=canvasList[canvasList.length-1].width;
              if(!firstEnterWidth && repeatIconTask)limit=widthIconTask;
              var currentWidthElm=0;
              while(ERightWidth>widthRow && currentWidthElm+widthRow<maxWidth-limit && nbColTotal>0){
                ERightWidth-=widthRow;
                widthElement+=widthRow;
                currentWidthElm+=widthRow;
                firstEnterWidth2=false;
                nbColTotal--;
              }
              if(!firstEnterWidth){
                if(currentWidthElm!=0 && widthElement!=oldWidthElement)
                  if(repeatIconTask){
                    canvasList2.push(combineCanvasIntoOne(imageRepeat,
                                       combineCanvasIntoOne(
                                           cropCanvas(rightColumn,oldWidthElement+1,0,currentWidthElm,heightColumn),
                                           cropCanvas(rightElement,oldWidthElement,EHeightValue,currentWidthElm,heightElement),
                                           true),
                                       false));
                }else{
                  if(firstEnterHeight){
                    canvasList2.push(combineCanvasIntoOne(
                                          cropCanvas(rightColumn,oldWidthElement+1,0,currentWidthElm,heightColumn),
                                          cropCanvas(rightElement,oldWidthElement,EHeightValue,currentWidthElm,heightElement),
                                          true));
                  }else{
                    canvasList2.push(cropCanvas(rightElement,oldWidthElement,EHeightValue,currentWidthElm,heightElement));
                  }
                }
              }else{
                if(widthElement==0){
                  canvasList2.push(canvasList[canvasList.length-1]);
                }else if(firstEnterHeight || repeatIconTask){
                  canvasList2.push(combineCanvasIntoOne(canvasList[canvasList.length-1],
                                        combineCanvasIntoOne(
                                            cropCanvas(rightColumn,oldWidthElement+1,0,currentWidthElm,heightColumn),
                                            cropCanvas(rightElement,oldWidthElement,EHeightValue,currentWidthElm,heightElement),
                                            true),
                                        false));
                }else{
                  canvasList2.push(combineCanvasIntoOne(canvasList[canvasList.length-1],
                                        cropCanvas(rightElement,oldWidthElement,EHeightValue,currentWidthElm,heightElement),
                                        false));
                }
              }
              if(nbColTotal==0 || countIteration>100){
                ERightWidth=0;
              }
              firstEnterWidth=false;
            }
            var baseIterateur=tabImage.length;
            for(var i=0;i<canvasList.length-1;i++){
              
              //Add image to mapImage in base64 format
              mapImage["image"+(i+baseIterateur)]=canvasList[i].toDataURL();
              
              //Add to tabImage an array wich contain parameters to put an image into a pdf page with a pagebreak if necessary
              ArrayToPut={image: "image"+(i+baseIterateur),width: canvasList[i].width*imageZoomOut,height:canvasList[i].height*imageZoomOut};
              if(!(canvasList2.length==0 && i==canvasList.length-1)){
                ArrayToPut['pageBreak']='after';
              }
              tabImage.push(ArrayToPut);
            }
            for(var i=0;i<canvasList2.length;i++){
              if(canvasList2[i].width-widthIconTask>4){
                //Add image to mapImage in base64 format
                mapImage["image"+(i+canvasList.length+baseIterateur)]=canvasList2[i].toDataURL();
                
                //Add to tabImage an array wich contain parameters to put an image into a pdf page with a pagebreak if necessary
                ArrayToPut={image: "image"+(i+canvasList.length+baseIterateur),width: canvasList2[i].width*imageZoomOut,height:canvasList2[i].height*imageZoomOut};
                if(i!=canvasList2.length-1){
                  ArrayToPut['pageBreak']='after';
                }
                tabImage.push(ArrayToPut);
              }
            }
            EHeight-=maxHeight-calculHeight;
            EHeightValue+=maxHeight-calculHeight;
            firstEnterHeight=false;
          }
          var dd = {
             pageMargins: [ marge, marge, marge, marge ],
             pageOrientation: orientation,
             content: tabImage,
             images: mapImage,
             footer: function(currentPage, pageCount) {  return { fontSize : 8, text: currentPage.toString() + ' / ' + pageCount , alignment: 'center' };},
             pageSize: pageFormat
          };
          if( !dojo.isIE ) {
            var userAgent = navigator.userAgent.toLowerCase(); 
            var IEReg = /(msie\s|trident.*rv:)([\w.]+)/; 
            var match = IEReg.exec(userAgent); 
            if( match )
              dojo.isIE = match[2] - 0;
            else
              dojo.isIE = undefined;
          }
          var pdfFileName='ProjeQtOr_Planning';
          var now = new Date();
          pdfFileName+='_'+formatDate(now).replace(/-/g,'')+'_'+formatTime(now).replace(/:/g,'');
          pdfFileName+='.pdf';
          if((dojo.isIE && dojo.isIE>0) || window.navigator.userAgent.indexOf("Edge") > -1) {
            pdfMake.createPdf(dd).download(pdfFileName);
          }else{
            pdfMake.createPdf(dd).download(pdfFileName);
          }
          // open the PDF in a new window
          //pdfMake.createPdf(dd).open();
          // print the PDF (temporarily Chrome-only)
         // pdfMake.createPdf(dd).print();
          // download the PDF (temporarily Chrome-only)
          dijit.byId('dialogPlanningPdf').hide();
          iframe.parentNode.removeChild(iframe);
          setTimeout('hideWait();',100);
        });
      });
    });
  });
  };
  iframe.id="iframeTmpPlanning";
  document.body.appendChild(iframe);
}
function cropCanvas(canvasToCrop,x,y,w,h,r){
  if(typeof r=='undefined')r=1;
    var tempCanvas = document.createElement("canvas"),
    tCtx = tempCanvas.getContext("2d");
    tempCanvas.width = w*r;
    tempCanvas.height = h*r;
    if(w!=0 && h!=0)tCtx.drawImage(canvasToCrop,x,y,w,h,0,0,w*r,h*r);
    return tempCanvas;
}

//addBottom=true : we add the canvas2 at the bottom of canvas1, addBottom=false : we add the canvas2 at the right of canvas1
function combineCanvasIntoOne(canvas1,canvas2,addBottom){
  var tempCanvas = document.createElement("canvas");
  var tCtx = tempCanvas.getContext("2d");
  var ajoutWidth=0;
  var ajoutHeight=0;
  var x=0;
  var y=0;
  if(addBottom){
    ajoutHeight=canvas2.height;
    y=canvas1.height;
  }else{
    ajoutWidth=canvas2.width;
    x=canvas1.width;
  }
  tempCanvas.width = canvas1.width+ajoutWidth;
  tempCanvas.height = canvas1.height+ajoutHeight;
  if(canvas1.width!=0 && canvas1.height!=0)tCtx.drawImage(canvas1,0,0,canvas1.width,canvas1.height);
  if(canvas1.width!=0 && canvas1.height!=0)if(canvas2.width!=0 && canvas2.height!=0)tCtx.drawImage(canvas2,0,0,canvas2.width,canvas2.height,x,y,canvas2.width,canvas2.height);
  return tempCanvas;
}


function commentImputationSubmit(year,week,idAssignment,refType,refId){
  var text=dijit.byId('commentImputation').get('value');
  if(text.trim()==''){
    showAlert(i18n('messageMandatory',[i18n('colComment')]));
    return;
  }
  showWait();
  dojo.xhrPost({
    url : "../tool/dynamicDialogCommentImputation.php?year="+year+"&week="+week+"&idAssignment="+idAssignment+"&refTypeComment="+refType+"&refIdComment="+refId,
    handleAs : "text",
    form : 'commentImputationForm',
    load : function(data, args) {
      formChangeInProgress=false;
      document.getElementById("showBig"+idAssignment).style.display='block'; 
      dojo.byId("showBig"+idAssignment).childNodes[0].onmouseover=function(){
        showBigImage(null,null,this,data);
      };
      dijit.byId('dialogCommentImputation').hide();
      hideWait();
    },
    error : function() {
      hideWait();
    }
  });
}

function commentImputationTitlePopup(type){
  title='';
  if(type=='add'){
    title= i18n('commentImputationAdd');
  }else if(type=='view'){
    title= i18n('commentImputationView');
  }
  dijit.byId('dialogCommentImputation').set('title',title);
}
