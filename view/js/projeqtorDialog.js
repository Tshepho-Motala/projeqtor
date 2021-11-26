/*******************************************************************************
 * COPYRIGHT NOTICE *
 * 
 * Copyright 2009-2021 ProjeQtOr - Pascal BERNARD - support@projeqtor.org Contributors : -
 * 
 * This file is part of ProjeQtOr.
 * 
 * ProjeQtOr is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * ProjeQtOr is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License along with
 * ProjeQtOr. If not, see <http://www.gnu.org/licenses/>.
 * 
 * You can get complete code of ProjeQtOr, other resource, help and information
 * about contributors at http://www.projeqtor.org
 * 
 * DO NOT REMOVE THIS NOTICE **
 ******************************************************************************/

// ============================================================================
// All specific ProjeQtOr functions and variables for Dialog Purpose
// This file is included in the main.php page, to be reachable in every context
// ============================================================================

// =============================================================================
// = Variables (global)
// =============================================================================
var filterType="";
var closeFilterListTimeout;
var openFilterListTimeout;
var closeFavoriteReportsTimeout;
var openFavoriteReportsTimeout=null;
var closeFavoriteTimeout;
var openFavoriteTimeout=null;
var popupOpenDelay=200;
var closeMenuListTimeout=null;
var openMenuListTimeout=null;
var menuListAutoshow=false;
var hideUnderMenuTimeout;
var hideUnderMenuId;
var previewhideUnderMenuId;
var stockEmailHistory = new Array();
var lastKeys= new Array();
var cplastKey;
var tabLastKeys= new Array();
var addVal= [0,0,0,0];
var paramLength;
var cpMaj=0;
var cpNum=0;
var cpChar=0;
var cpParamLength=0;

// =============================================================================
// = Wait spinner
// =============================================================================

var waitingForReply=false;

function showWait() {
  if (dojo.byId("wait")) {
    showField("wait");
    waitingForReply=true;
  } else {
    showField("waitLogin");
  }
}

function hideWait() {
  waitingForReply=false;
  hideField("wait");
  hideField("waitLogin");
  if (window.top.dijit.byId("dialogInfo")) {
    window.top.dijit.byId("dialogInfo").hide();
  }
}

// =============================================================================
// = Generic field visibility properties
// =============================================================================

function showField(field) {
  var dest=dojo.byId(field);
  if (dijit.byId(field)) {
    dest=dijit.byId(field).domNode;
  }
  if (dest) {
    dojo.style(dest, {
      visibility : 'visible'
    });
    dojo.style(dest, {
      display : 'inline'
    });
  }
}

/**
 * ============================================================================
 * Setup the style properties of a field to set it invisible (hide it)
 * 
 * @param field
 *          the name of the field to be set
 * @return void
 */
function hideField(field) {
  var dest=dojo.byId(field);
  if (dijit.byId(field)) {
    dest=dijit.byId(field).domNode;
  }
  if (dest) {
    dojo.style(dest, {
      visibility : 'hidden'
    });
    dojo.style(dest, {
      display : 'none'
    });
  }
}

function protectDblClick(widget){
  if (!widget.id) return;
  disableWidget(widget.id);
  setTimeout("enableWidget('"+widget.id+"');",300);
}

// =============================================================================
// = Message boxes
// =============================================================================

/**
 * ============================================================================
 * Display a Dialog Error Message Box
 * 
 * @param msg
 *          the message to display in the box
 * @return void
 */
function showError(msg) {
  window.top.hideWait();
  if (window.top.dojo.byId("dialogErrorMessage")) {
    window.top.dojo.byId("dialogErrorMessage").innerHTML=msg;
    window.top.dijit.byId("dialogError").show();
  } else if (dojo.byId('loginResultDiv')) {
    dojo.byId('loginResultDiv').innerHTML=
      '<input type="hidden" id="isLoginPage" name="isLoginPage" value="true" />'
      +'<div class="messageERROR" style="width:100%">'+msg+'</div>';
  } else {
    alert(msg);
  }
}

/**
 * ============================================================================
 * Display a Dialog Information Message Box
 * 
 * @param msg
 *          the message to display in the box
 * @return void
 */
function showInfo(msg,callback) {
  var callbackFunc=function() {};
  if (callback) { 
    callbackFunc=callback;
  }
  window.top.dojo.byId("dialogInfoMessage").innerHTML=msg;
  window.top.dijit.byId("dialogInfo").acceptCallback=callbackFunc;
  window.top.dijit.byId("dialogInfo").show();
}

/**
 * ============================================================================
 * Display a Dialog Alert Message Box
 * 
 * @param msg
 *          the message to display in the box
 * @return void
 */
function showAlert(msg,callback) {
  window.top.hideWait();
  var callbackFunc=function() {};
  if (callback) { 
    callbackFunc=callback;
  }
  window.top.dojo.byId("dialogAlertMessage").innerHTML=msg;
  window.top.dijit.byId("dialogAlert").acceptCallback=callbackFunc;
  window.top.dijit.byId("dialogAlert").show();
}

/**
 * ============================================================================
 * Display a Dialog Question Message Box, with Yes/No buttons
 * 
 * @param msg
 *          the message to display in the box
 * @param actionYes
 *          the function to be executed if click on Yes button
 * @param actionNo
 *          the function to be executed if click on No button
 * @return void
 */
function showQuestion(msg, actionYes, actionNo) {
  dojo.byId("dialogQuestionMessage").innerHTML=msg;
  dijit.byId("dialogQuestion").acceptCallbackYes=actionYes;
  dijit.byId("dialogQuestion").acceptCallbackNo=actionNo;
  dijit.byId("dialogQuestion").show();
}

/**
 * ============================================================================
 * Display a Dialog Confirmation Message Box, with OK/Cancel buttons NB : no
 * action on Cancel click
 * 
 * @param msg
 *          the message to display in the box
 * @param actionOK
 *          the function to be executed if click on OK button
 * @return void
 */
function showConfirm(msg, actionOK) {
  dojo.byId("dialogConfirmMessage").innerHTML=msg;
  dijit.byId("dialogConfirm").acceptCallback=actionOK;
  dijit.byId("dialogConfirm").show();
}

/**
 * ============================================================================
 * Display a About Box
 * 
 * @param msg
 *          the message of the about box (must be passed here because built in
 *          php)
 * @return void
 */
function showAbout(msg) {
  showInfo(msg);
}

function showMsg(id,value){
  if(dojo.byId("divMsgFull"+id).style.display=="none"){
    dojo.byId("divSubTitle"+id).style.display="none";
    if(value==0.25 || value==1.25 || value==2.25){
      if(dojo.byId("divMsgTitle"+(id+1))){
        dojo.byId("divMsgTitle"+(id+1)).style.display="none";
      }
      if(dojo.byId("divMsgTitle"+(id+2))){
        dojo.byId("divMsgTitle"+(id+2)).style.display="none";
      }
      if(dojo.byId("divMsgTitle"+(id+3))){
        dojo.byId("divMsgTitle"+(id+3)).style.display="none";
      }
    }
    if(value==0.5 || value==1.5 || value==2.5){
      if(dojo.byId("divMsgTitle"+(id+1))){
        dojo.byId("divMsgTitle"+(id+1)).style.display="none";
      }
      if(dojo.byId("divMsgTitle"+(id+2))){
        dojo.byId("divMsgTitle"+(id+2)).style.display="none";
      }
      if(dojo.byId("divMsgTitle"+(id-1))){
        dojo.byId("divMsgTitle"+(id-1)).style.display="none";
      }
    }
    if(value==0.75 || value==1.75 || value==2.75){
      if(dojo.byId("divMsgTitle"+(id+1))){
        dojo.byId("divMsgTitle"+(id+1)).style.display="none";
      }
      if(dojo.byId("divMsgTitle"+(id-1))){
        dojo.byId("divMsgTitle"+(id-1)).style.display="none";
      }
      if(dojo.byId("divMsgTitle"+(id-2))){
        dojo.byId("divMsgTitle"+(id-2)).style.display="none";
      }
    }
    if(value==1 || value==2 || value==3){
      if(dojo.byId("divMsgTitle"+(id-1))){
        dojo.byId("divMsgTitle"+(id-1)).style.display="none";
      }
      if(dojo.byId("divMsgTitle"+(id-2))){
        dojo.byId("divMsgTitle"+(id-2)).style.display="none";
      }
      if(dojo.byId("divMsgTitle"+(id-3))){
        dojo.byId("divMsgTitle"+(id-3)).style.display="none";
      }
    }
    
    dojo.byId("divMsgTitle"+id).style.height=50+'px';
    dojo.byId("divMsgTitle"+id).style.margin = 0+'px';
    dojo.byId("divMsgTitle"+id).style.width=340+'px';
    dojo.byId("divMsgTitle"+id).style.borderRadius = 5+'px '+5+'px '+0+'px '+0+'px';
    dojo.addClass(dojo.byId("divMsgTitle"+id),"colorMediumDiv");
    dojo.byId("divMsgFull"+id).style.display="block";
    dojo.byId("divMsgFull"+id).style.height=270+'px';
    dojo.byId("divMsgFull"+id).style.width=340+'px';
    dojo.byId("divMsgTitle"+id).style.fontSize=13+'px';
    
  }else{
    dojo.byId("divMsgFull"+id).style.display="none";
    dojo.byId("divMsgTitle"+id).style.height=155+'px';
    dojo.byId("divMsgTitle"+id).style.width=165+'px';
    dojo.byId("divMsgTitle"+id).style.borderRadius = 5+'px '+5+'px '+5+'px '+5+'px';
    dojo.byId("divMsgTitle"+id).style.flexDirection="column";
    dojo.byId("divMsgTitle"+id).style.justifyContent="center";
    dojo.byId("divMsgTitle"+id).style.fontSize=13+'px';
    dojo.byId("divMsgtextTitle"+id).style.padding = 15+'px';
    dojo.byId("arrowNewsDown"+id).style.display="block";
    if(id==1 || id==3 || id==5 || id==7 || id==9 || id==11){
      dojo.byId("divMsgTitle"+id).style.marginRight = 10+'px';
    }
    dojo.byId("divMsgTitle"+id).style.marginBottom = 10+'px';
    
    dojo.removeClass(dojo.byId("divMsgTitle"+id),"colorMediumDiv");
    if(value==0.25 || value==1.25 || value==2.25){
      if(dojo.byId("divMsgTitle"+(id+1))){
        dojo.byId("divMsgTitle"+(id+1)).style.display="flex";
      }
      if(dojo.byId("divMsgTitle"+(id+2))){
        dojo.byId("divMsgTitle"+(id+2)).style.display="flex";
      }
      if(dojo.byId("divMsgTitle"+(id+3))){
        dojo.byId("divMsgTitle"+(id+3)).style.display="flex";
      }
    }
    if(value==0.5 || value==1.5 || value==2.5){
      if(dojo.byId("divMsgTitle"+(id+1))){
        dojo.byId("divMsgTitle"+(id+1)).style.display="flex";
      }
      if(dojo.byId("divMsgTitle"+(id+2))){
        dojo.byId("divMsgTitle"+(id+2)).style.display="flex";
      }
      if(dojo.byId("divMsgTitle"+(id-1))){
        dojo.byId("divMsgTitle"+(id-1)).style.display="flex";
      }
    }
    if(value==0.75 || value==1.75 || value==2.75){
      if(dojo.byId("divMsgTitle"+(id+1))){
        dojo.byId("divMsgTitle"+(id+1)).style.display="flex";
      }
      if(dojo.byId("divMsgTitle"+(id-1))){
        dojo.byId("divMsgTitle"+(id-1)).style.display="flex";
      }
      if(dojo.byId("divMsgTitle"+(id-2))){
        dojo.byId("divMsgTitle"+(id-2)).style.display="flex";
      }
    }
    if(value==1 || value==2 || value==3){
      if(dojo.byId("divMsgTitle"+(id-1))){
        dojo.byId("divMsgTitle"+(id-1)).style.display="flex";
      }
      if(dojo.byId("divMsgTitle"+(id-2))){
        dojo.byId("divMsgTitle"+(id-2)).style.display="flex";
      }
      if(dojo.byId("divMsgTitle"+(id-3))){
        dojo.byId("divMsgTitle"+(id-3)).style.display="flex";
      }
    }
  }
}
function showIntrotext(id){
  if(dojo.byId("divMsgFull"+id).style.display=="none"){
    dojo.byId("divMsgTitle"+id).style.height=39+'px';
    dojo.byId("divMsgTitle"+id).style.width=165+'px';
    dojo.byId("divMsgTitle"+id).style.margin = 0+'px';
    dojo.byId("divMsgTitle"+id).style.borderRadius = 5+'px '+5+'px '+0+'px '+0+'px';
    dojo.addClass(dojo.byId("divMsgTitle"+id),"colorMediumDiv");
    dojo.byId("divSubTitle"+id).style.display="block";
    dojo.byId("divSubTitle"+id).style.height=116+'px';
    dojo.byId("divSubTitle"+id).style.fontSize=10+'px';
    dojo.byId("divMsgTitle"+id).style.fontSize=10+'px';
    dojo.byId("divMsgTitle"+id).style.textOverflow='ellipsis';
    dojo.byId("arrowNewsDown"+id).style.display="none";
    dojo.byId("divMsgtextTitle"+id).style.padding = 0+'px';
  }
}

function hideIntrotext(id){
  if(dojo.byId("divMsgFull"+id).style.display=="none"){
    dojo.byId("divSubTitle"+id).style.display="none";
    dojo.byId("divMsgTitle"+id).style.height=155+'px';
    dojo.byId("divMsgTitle"+id).style.width=165+'px';
    if(id==1 || id==3 || id==5 || id==7 || id==9 || id==11){
      dojo.byId("divMsgTitle"+id).style.marginRight = 10+'px';
    }
    dojo.byId("divMsgTitle"+id).style.marginBottom = 10+'px';
    dojo.byId("divMsgTitle"+id).style.borderRadius = 5+'px '+5+'px '+5+'px '+5+'px';
    dojo.byId("divMsgTitle"+id).style.flexDirection="column";
    dojo.byId("divMsgTitle"+id).style.justifyContent="center";
    dojo.byId("divMsgTitle"+id).style.display="flex";
    dojo.byId("divMsgTitle"+id).style.fontSize=13+'px';
    dojo.removeClass(dojo.byId("divMsgTitle"+id),"colorMediumDiv");
    dojo.byId("arrowNewsDown"+id).style.display="block";
    dojo.byId("divMsgtextTitle"+id).style.padding = 15+'px';
  }
}

function hideMsg(id,value){
  dojo.byId("divMsgFull"+id).style.display="none";
  dojo.byId("divMsgTitle"+id).style.height=155+'px';
  dojo.byId("divMsgTitle"+id).style.width=165+'px';
  if(id==1 || id==3 || id==5 || id==7 || id==9 || id==11){
    dojo.byId("divMsgTitle"+id).style.marginRight = 10+'px';
  }
  dojo.byId("arrowNewsDown"+id).style.display="block";
  dojo.removeClass(dojo.byId("divMsgTitle"+id),"colorMediumDiv");
  if(value==0.25 || value==1.25 || value==2.25){
    if(dojo.byId("divMsgTitle"+(id+1))){
      dojo.byId("divMsgTitle"+(id+1)).style.display="flex";
    }
    if(dojo.byId("divMsgTitle"+(id+2))){
      dojo.byId("divMsgTitle"+(id+2)).style.display="flex";
    }
    if(dojo.byId("divMsgTitle"+(id+3))){
      dojo.byId("divMsgTitle"+(id+3)).style.display="flex";
    }
  }
  if(value==0.5 || value==1.5 || value==2.5){
    if(dojo.byId("divMsgTitle"+(id+1))){
      dojo.byId("divMsgTitle"+(id+1)).style.display="flex";
    }
    if(dojo.byId("divMsgTitle"+(id+2))){
      dojo.byId("divMsgTitle"+(id+2)).style.display="flex";
    }
    if(dojo.byId("divMsgTitle"+(id-1))){
      dojo.byId("divMsgTitle"+(id-1)).style.display="flex";
    }
  }
  if(value==0.75 || value==1.75 || value==2.75){
    if(dojo.byId("divMsgTitle"+(id+1))){
      dojo.byId("divMsgTitle"+(id+1)).style.display="flex";
    }
    if(dojo.byId("divMsgTitle"+(id-2))){
      dojo.byId("divMsgTitle"+(id-2)).style.display="flex";
    }
    if(dojo.byId("divMsgTitle"+(id-1))){
      dojo.byId("divMsgTitle"+(id-1)).style.display="flex";
    }
  }
  if(value==1 || value==2 || value==3){
    if(dojo.byId("divMsgTitle"+(id-1))){
      dojo.byId("divMsgTitle"+(id-1)).style.display="block";
    }
    if(dojo.byId("divMsgTitle"+(id-2))){
      dojo.byId("divMsgTitle"+(id-2)).style.display="block";
    }
    if(dojo.byId("divMsgTitle"+(id-3))){
      dojo.byId("divMsgTitle"+(id-3)).style.display="block";
    }
  }
}

// =============================================================================
// = Print
// =============================================================================

function showPrint(page, context, comboName, outMode, orientation) {
  showWait();
  quitConfirmed=true;
  noDisconnect=true;
  if (!orientation)
    orientation='L';
  if (!outMode)
    outMode='html';
  var printInNewWin=printInNewWindow;
  if (outMode == "pdf") {
    printInNewWin=pdfInNewWindow;
  }
  if (outMode == "csv") {
    printInNewWin=true;
  }
  if (outMode == "mpp") {
    printInNewWin=true;
  }
  if (context=='favorite' || context=='admin' || context=='organization' || context=='asset') {
    printInNewWin=false;
  }
  if (outMode == "csv" || outMode == "word" || outMode == "excel" || outMode == "download" || context=="download" || context=="downloadList") {
    printInNewWin=true; // Will not show print frame
  }
  if (!printInNewWin) {
    dijit.byId("dialogPrint").show();
  }
  
  cl='';
  if ( (context == 'list' || context == 'downloadList') && dojo.byId('objectClassList')) {
    cl=dojo.byId('objectClassList').value;
  } else if (dojo.byId('objectClass')) {
    cl=dojo.byId('objectClass').value;
  }
  
  id='';
  if (dojo.byId('objectId')) {
    id=dojo.byId('objectId').value;
  }
  var params="&orientation=" + orientation;
  dojo.byId("sentToPrinterDiv").style.display='block';
  if (outMode) {
    params+="&outMode=" + outMode;
    if (outMode == 'pdf') {
      dojo.byId("sentToPrinterDiv").style.display='none';
    }
  }

  if (cl=='Organization' && dijit.byId('OrganizationBudgetElementCurrent__byMet_periodYear')) {
    params+='&OrganizationBudgetPeriod='+dijit.byId('OrganizationBudgetElementCurrent__byMet_periodYear').get("value");
  }
  if (context == 'list' || context == 'downloadList' || context == 'download') {
    if (dijit.byId("listShowIdle")) {
      if (dijit.byId("listShowIdle").get('checked')) {
        params+="&idle=true";
      }
    }
    if (dijit.byId("listIdFilter")) {
      if (dijit.byId("listIdFilter").get('value')) {
        params+="&listIdFilter="
            + encodeURIComponent(dijit.byId("listIdFilter").get('value'));
      }
    }
    if (dijit.byId("listNameFilter")) {
      if (dijit.byId("listNameFilter").get('value')) {
        params+="&listNameFilter="
            + encodeURIComponent(dijit.byId("listNameFilter").get('value'));
      }
    }
    if (dijit.byId("listTypeFilter")) {
      if (trim(dijit.byId("listTypeFilter").get('value'))) {
        params+="&objectType="
            + encodeURIComponent(dijit.byId("listTypeFilter").get('value'));
      }
    }
    if (dijit.byId("listBudgetParentFilter")) {
      if (trim(dijit.byId("listBudgetParentFilter").get('value'))) {
        params+="&budgetParent="
            + encodeURIComponent(dijit.byId("listBudgetParentFilter").get('value'));
      }
    }
    if (dijit.byId("listClientFilter")) {
      if (trim(dijit.byId("listClientFilter").get('value'))) {
        params+="&objectClient="
            + encodeURIComponent(dijit.byId("listClientFilter").get('value'));
      }
    }
    if (dijit.byId("listElementableFilter")) {
      if (trim(dijit.byId("listElementableFilter").get('value'))) {
        params+="&objectElementable="
            + encodeURIComponent(dijit.byId("listElementableFilter").get('value'));
      }
    }
  } else if (context == 'planning') {
    if (dijit.byId("startDatePlanView").get('value')) {
      params+="&startDate="
          + encodeURIComponent(formatDate(dijit.byId("startDatePlanView").get(
              "value")));
      params+="&endDate="
          + encodeURIComponent(formatDate(dijit.byId("endDatePlanView").get(
              "value")));
      params+="&format=" + g.getFormat();
      if(dijit.byId('listShowIdle')!=null){
        if (dijit.byId('listShowIdle').get('checked')) {
          params+="&idle=true";
        }
      }
      if(dijit.byId('showWBS')!=null){
        if (dijit.byId('showWBS').checked) {
          params+="&showWBS=true";
        }
      }
      if (dijit.byId('listShowResource')) {
        if (dijit.byId('listShowResource').checked) {
          params+="&showResource=true";
        }
      }
      if (dojo.byId('showProjectModel')) {
        if (dojo.byId('showProjectModel').checked) {
          url += (param) ? "&" : "?";
          url += "showProjectModel=true";
          param = true;
        }
      }
      if (dijit.byId('listShowLeftWork')) {
        if (dijit.byId('listShowLeftWork').checked) {
          params+="&showWork=true";
        }
      }
      if (dijit.byId('listShowProject')) {
        if (dijit.byId('listShowProject').checked) {
          params+="&showProject=true";
        }
      }
    }
  } else if (context == 'report' || context=='favorite') {
    if (context == 'report' ) { 
      var frm=dojo.byId('reportForm'); 
    } else {
      var frm=dojo.byId('favoriteForm'); 
    }
    frm.action="../view/print.php";
    if (outMode) {
      frm.page.value=page;
      dojo.byId('outMode').value=outMode;
    } else {
      dojo.byId('outMode').value='';
    }
    if (printInNewWin) {
      frm.target='#';
    } else {
      frm.target='printFrame';
    }
    frm.submit();
    hideWait();
    quitConfirmed=false;
    noDisconnect=false;
    return;
  } else if (context == 'imputation' || context == 'hierarchicalBudget') {
    var frm=dojo.byId('listForm');
    frm.action="../view/print.php?orientation=" + orientation;
    if (printInNewWin) {
      frm.target='#';
    } else {
      frm.target='printFrame';
    }
    if (outMode) {
      dojo.byId('outMode').value=outMode;
    } else {
      dojo.byId('outMode').value='';
    }
    frm.submit();
    hideWait();
    quitConfirmed=false;
    noDisconnect=false;
    return;
  }
  var grid=dijit.byId('objectGrid');
  if (grid) {
    var sortWay=(grid.getSortAsc()) ? 'asc' : 'desc';
    var sortIndex=grid.getSortIndex();
    if (sortIndex >= 0) {
      params+="&sortIndex=" + sortIndex;
      params+="&sortWay=" + sortWay;
    }
  }
  if (outMode=="download" && context=='template') {
    dojo.byId("printFrame").src="print.php?print=true&page=" + page;
    hideWait();
  } else if (outMode == "csv" || outMode == "word" || outMode == "excel" || outMode == "download" || context=="download" || context == 'downloadList') {
    dojo.byId("printFrame").src="print.php?print=true&page=" + page
        + "&context="+context
        + "&objectClass=" + cl + "&objectId=" + id + params;
    hideWait();
  } else if (printInNewWin) {
    var newWin=window.open("print.php?print=true&page=" + page
        + "&context="+context
        + "&objectClass=" + cl + "&objectId=" + id + params);
    hideWait();
  } else {
    dojo.byId("printFrame").src="print.php?print=true&page=" + page
        + "&context="+context
        + "&objectClass=" + cl + "&objectId=" + id + params;
    if (outMode == 'pdf') {
      //hideWait();
    } 
  }
  quitConfirmed=false;
  noDisconnect=false;
}

function sendFrameToPrinter() {
  dojo.byId("sendToPrinter").blur();
  window.frames['printFrame'].focus();
  window.frames['printFrame'].print();
  dijit.byId('dialogPrint').hide();
  return true;
}

// =============================================================================
// = Detail (from combo)
// =============================================================================

function showDetailDependency() {
  var depType=dijit.byId('dependencyRefTypeDep').get("value");
  if (depType) {
    var dependable=dependableArray[depType];
    var canCreate=0;
    if (canCreateArray[dependable] == "YES") {
      canCreate=1;
    }
    showDetail('dependencyRefIdDep', canCreate, dependable, true);

  } else {
    showInfo(i18n('messageMandatory', new Array(i18n('linkType'))));
  }
}

function showDetailLink() {
  var linkType=dijit.byId('linkRef2Type').get("value");
  if (linkType) {
    var linkable=linkableArray[linkType];
    var canCreate=0;
    if (canCreateArray[linkable] == "YES") {
      canCreate=1;
    }
    showDetail('linkRef2Id', canCreate, linkable, true);

  } else {
    showInfo(i18n('messageMandatory', new Array(i18n('linkType'))));
  }
}

function showDetailOrigin() {
  var originType=dijit.byId('originOriginType').get("value");
  if (originType) {
    var originable=originableArray[originType];
    var canCreate=0;
    if (canCreateArray[originable] == "YES") {
      canCreate=1;
    }
    showDetail('originOriginId', canCreate, originable);

  } else {
    showInfo(i18n('messageMandatory', new Array(i18n('originType'))));
  }
}

function showDetail(comboName, canCreate, objectClass, multiSelect, objectId, forceSearch) {
  var contentWidget=dijit.byId("comboDetailResult");
  dojo.byId("canCreateDetail").value=canCreate;
  if (contentWidget) {
    contentWidget.set('content', '');
  }
  if (!objectClass) {
    objectClass=comboName.substring(2);
  }
  dojo.byId('comboName').value=comboName;
  dojo.byId('comboClass').value=objectClass;
  dojo.byId('comboMultipleSelect').value=(multiSelect) ? 'true' : 'false';
  dijit.byId('comboDetailResult').set('content',null);
  var val=null;
  if (dijit.byId(comboName)) {
    val=dijit.byId(comboName).get('value');
  } else if(dojo.byId(comboName)) {
    val=dojo.byId(comboName).value;
  }
  if (forceSearch) val=null; // will force search
  if (objectId) {
    if (objectId=='new') {
      cl=objectClass;
      id=null;
      window.frames['comboDetailFrame'].document.body.innerHTML='<i>'
          + i18n("messagePreview") + '</i>';
      dijit.byId("dialogDetail").show();
      //frames['comboDetailFrame'].location.href="print.php?print=true&page=preparePreview.php";
      newDetailItem(objectClass);
    } else {
      cl=objectClass;
      id=objectId;
      window.frames['comboDetailFrame'].document.body.innerHTML='<i>'
          + i18n("messagePreview") + '</i>';
      dijit.byId("dialogDetail").show();
      gotoDetailItem(objectClass,objectId);
    }
    
  } else if (!val || val == "" || val == " " || val == "*") {
    cl=objectClass;
    window.frames['comboDetailFrame'].document.body.innerHTML='<i>'
        + i18n("messagePreview") + '</i>';
    dijit.byId("dialogDetail").show();
    displaySearch(cl);
  } else {
    cl=objectClass;
    id=val;
    window.frames['comboDetailFrame'].document.body.innerHTML='<i>'
        + i18n("messagePreview") + '</i>';
    dijit.byId("dialogDetail").show();
    displayDetail(cl, id);
  }
  dojo.connect(dijit.byId("dialogDetail"),"onhide", 
    function(){
      // nothing to do;
    });
}

function displayDetail(objClass, objId) {
  showWait();
  showField('comboSearchButton');
  hideField('comboSelectButton');
  hideField('comboNewButton');
  hideField('comboSaveButton');
  showField('comboCloseButton');
  dijit.byId('comboDetailResult').set('content',null);
  frames['comboDetailFrame'].location.href="print.php?print=true&page=objectDetail.php&objectClass="
      + objClass + "&objectId=" + objId + "&detail=true";
}

function directDisplayDetail(objClass, objId) {
  showWait();
  hideField('comboSearchButton');
  hideField('comboSelectButton');
  hideField('comboNewButton');
  hideField('comboSaveButton');
  showField('comboCloseButton');
  dijit.byId('comboDetailResult').set('content',null);
  window.frames['comboDetailFrame'].document.body.innerHTML='<i>'
    + i18n("messagePreview") + '</i>';
  dijit.byId("dialogDetail").show();
  frames['comboDetailFrame'].location.href="print.php?print=true&page=objectDetail.php&objectClass="
    + objClass + "&objectId=" + objId + "&detail=true";
}

function selectDetailItem(selectedValue, lastSavedName) {
  var idFldVal="";
  if (selectedValue) {
    idFldVal=selectedValue;
  } else {
    var idFld=frames['comboDetailFrame'].dojo.byId('comboDetailId');
    var comboGrid=frames['comboDetailFrame'].dijit.byId('objectGrid');
    if (comboGrid) {
      idFldVal="";
      var items=comboGrid.selection.getSelected();
      dojo.forEach(items, function(selectedItem) {
        if (selectedItem !== null) {
          idFldVal+=(idFldVal != "") ? '_' : '';
          idFldVal+=parseInt(selectedItem.id, 10) + '';
        }
      });
    } else {
      if (!idFld) {
        showError('error : comboDetailId not defined');
        return;
      }
      idFldVal=idFld.value;
    }
    if (!idFldVal) {
      showAlert(i18n('noItemSelected'));
      return;
    }
  }
  var comboName=dojo.byId('comboName').value;
  var combo=dijit.byId(comboName);
  var comboClass=dojo.byId('comboClass').value;
  crit=null;
  critVal=null;
  if (comboClass == 'Activity' || comboClass == 'Resource'
      || comboClass == 'Ticket') {
    if (comboName.substr(0,15)=='filterValueList') {
      // Do not set current project (would be project of selected item), will apply restriction to selected project
    } else {
      prj=dijit.byId('idProject');
      if (prj) {
        crit='idProject';
        critVal=prj.get("value");
      }
    }  
  }
  if (comboName != 'idStatus'  && comboName != 'versionsPlanningDetail' && comboName != 'projectSelectorFiletering') { 
    if (combo) {
      refreshList('id' + comboClass, crit, critVal, idFldVal, comboName);
    } else {
      if (comboName == 'dependencyRefIdDep') {
        refreshDependencyList(idFldVal);
        setTimeout("dojo.byId('dependencyRefIdDep').focus()", 1000);
        enableWidget('dialogDependencySubmit');
      } else if (comboName == 'linkRef2Id') {
        refreshLinkList(idFldVal);
        setTimeout("dojo.byId('linkRef2Id').focus()", 1000);
        enableWidget('dialogLinkSubmit');
      } else if (comboName == 'pokerItemRef2Id') {
          refreshPokerItemList(idFldVal);
          setTimeout("dojo.byId('pokerItemRef2Id').focus()", 1000);
          enableWidget('dialogPokerItemSubmit');
      } else if (comboName == 'productStructureListId') {
        refreshProductStructureList(idFldVal,lastSavedName);
        setTimeout("dojo.byId('productStructureListId').focus()",500);
        enableWidget('dialogProductStructureSubmit');
      //ADD aGaye - Ticket 179
      } else if (comboName == 'versionCompatibilityListId'){
    	  refreshVersionCompatibilityList(idFldVal,lastSavedName);
    	  setTimeout("dojo.byId('versionCompatibilityListId').focus()",500);
          enableWidget('dialogVersionCompatibilitySubmit');
      //END aGaye - Ticket 179
      } else if (comboName == 'productVersionStructureListId') {
    	  refreshProductVersionStructureList(idFldVal,lastSavedName);
        setTimeout("dojo.byId('productVersionStructureListId').focus()",500);
        enableWidget('dialogProductVersionStructureSubmit');
      } else if (comboName == 'otherVersionIdVersion') {
        refreshOtherVersionList(idFldVal);
        setTimeout("dojo.byId('otherVersionIdVersion').focus()", 1000);
        enableWidget('dialogOtherVersionSubmit');
      } else if (comboName == 'otherClientIdClient') {
        refreshOtherClientList(idFldVal);
        setTimeout("dojo.byId('otherClientIdClient').focus()", 1000);
        enableWidget('dialogOtherClientSubmit');
      } else if (comboName == 'approverId') {
        refreshApproverList(idFldVal);
        setTimeout("dojo.byId('approverId').focus()", 1000);
        enableWidget('dialogApproverSubmit');
      } else if (comboName == 'originOriginId') {
        refreshOriginList(idFldVal);
        setTimeout("dojo.byId('originOriginId').focus()", 1000);
        enableWidget('dialogOriginSubmit');
      } else if (comboName == 'testCaseRunTestCaseList') {
        refreshTestCaseRunList(idFldVal);
        setTimeout("dojo.byId('testCaseRunTestCaseList').focus()", 1000);
        enableWidget('dialogTestCaseRunSubmit');
      } else if (comboName == 'linkedObjectId') {
        refreshLinkObjectList(idFldVal);
        setTimeout("dojo.byId('linkedObjectId').focus()", 1000);
        enableWidget('dialogObjectSubmit');
      } else if (comboName == 'linkProviderTerm') {
        refreshLinkProviderTerm(idFldVal);
      }    
    }
  }
  
  if (comboName == 'versionsPlanningDetail') {
	  displayVersionsPlanning(idFldVal,'ProductVersion');
	  hideDetail();
	  return;
  }else if(comboName == 'versionsComponentPlanningDetail'){
    displayVersionsPlanning(idFldVal,'ComponentVersion');
    hideDetail();
    return;                                                    
  }  
  if(comboClass=='Contact' && (dojo.byId('objectClass').value=='Client' || dojo.byId('objectClass').value=='Provider') ){
    saveContact(idFldVal,comboClass,comboName);
    hideDetail();
    return;
  }
  if (combo) {
  	if(comboName == 'projectSelectorFiletering'){
  		var pos = idFldVal.indexOf('_');
  		if(pos != -1){
  			dijit.byId('multiProjectSelector').set("value", idFldVal);
  		}else{
  			combo.set("value", idFldVal);
  		}
  	}else if(comboName.substr(0,15) == 'filterValueList'){
  		idFldVal=idFldVal.split('_');
  		combo.set("value", idFldVal);
  		//}
    }else{
  	  combo.set("value", idFldVal);
  	}
  }
  hideDetail();
  if (dojo.byId('directAccessToList') && dojo.byId('directAccessToList').value=='true' && dojo.byId('directAccessToListButton')) {
    var idButton = dojo.byId('directAccessToListButton').value;
    setTimeout("dijit.byId('" + idButton + "').onClick();", 20);
  }
}

function displaySearch(objClass) {
  if (!objClass) {
    objClass=dojo.byId('comboClass').value;
  }
  showWait();
  hideField('comboSearchButton');
  showField('comboSelectButton');
  if (dojo.byId("canCreateDetail").value=="1" && objClass!='Project' && objClass!='Status' ) {
    showField('comboNewButton');
  } else {
    hideField('comboNewButton');
  }
  hideField('comboSaveButton');
  showField('comboCloseButton');
  var multipleSelect=(dojo.byId('comboMultipleSelect').value == 'true') ? '&multipleSelect=true'
      : '';
  var currentProject=(top.dijit.byId('idProject'))?'&currentSelectedProject='+top.dijit.byId('idProject').get("value"):'';
  if (top.dojo.byId('objectClass') && top.dojo.byId('objectClass')=='Project' && top.dojo.byId('id')) currentProject='&currentSelectedProject='+top.dojo.byId('id').value;
  window.top.frames['comboDetailFrame'].location.href="comboSearch.php?objectClass="
      + objClass + "&mode=search" + multipleSelect+currentProject;
  setTimeout('dijit.byId("dialogDetail").show()', 10);
}

function newDetailItem(objectClass) {
  gotoDetailItem(objectClass);
}
function gotoDetailItem(objectClass,objectId) {
  // comboName=dojo.byId('comboName').value;
  dijit.byId("dialogDetail").show();
  hideField('comboSearchButton');
  var objClass=objectClass;
  if (!objectClass) {
    objClass=dojo.byId('comboClass').value;
    showField('comboSearchButton');
  }
  showWait();
  hideField('comboSelectButton');
  hideField('comboNewButton');
  if (dojo.byId("canCreateDetail").value == "1") {
    showField('comboSaveButton');
  } else {
    hideField('comboSaveButton');
  }
  showField('comboCloseButton');
  destinationWidth=frames['comboDetailFrame'].document.body.offsetWidth
  page="comboSearch.php";
  page+="?objectClass=" + objClass;
  if (objectId) {
    page+="&objectId="+objectId;
    page+="&mode=new";    
  } else {
    page+="&objectId=0";
    page+="&mode=new";
    if(dijit.byId('idClient')){
    	if(trim(dijit.byId('idClient').get('value')) != ''){
    		page+="&idClient="+dijit.byId('idClient').get('value');
    	}
    }
  }
  page+="&destinationWidth=" + destinationWidth;
  window.top.frames['comboDetailFrame'].location.href=page;
  setTimeout('dijit.byId("dialogDetail").show()', 10);   
}

function saveDetailItem() {
  var comboName=dojo.byId('comboName').value;
  var formVar=frames['comboDetailFrame'].dijit.byId("objectForm");
  if (!formVar) {
    showError(i18n("errorSubmitForm", new Array(page, destination, formName)));
    return;
  }
  for(name in frames['comboDetailFrame'].CKEDITOR.instances) {
    frames['comboDetailFrame'].CKEDITOR.instances[name].updateElement();
  }
  // validate form Data
  if (1) { //if (formVar.validate()) {
    showWait();
    frames['comboDetailFrame'].dojo
        .xhrPost({
          url : "../tool/saveObject.php?comboDetail=true",
          form : "objectForm",
          handleAs : "text",
          load : function(data, args) {
            var contentWidget=dijit.byId("comboDetailResult");
            if (!contentWidget) {
              return;
            }
            contentWidget.set('content', data);
            checkDestination("comboDetailResult");
            var lastOperationStatus=window.top.dojo
                .byId('lastOperationStatusComboDetail');
            var lastOperation=window.top.dojo.byId('lastOperationComboDetail');
            var lastSaveId=window.top.dojo.byId('lastSaveIdComboDetail');
            if (lastOperationStatus.value == "OK") {
              var currentItemName="";
              if (frames['comboDetailFrame'].dijit.byId("name")) {
                currentItemName=frames['comboDetailFrame'].dijit.byId("name").get("value");
              }
              selectDetailItem(lastSaveId.value,currentItemName);
            }
            hideWait();
          },
          error : function() {
            hideWait();
          }
        });

  } else {
    showAlert(i18n("alertInvalidForm"));
  }
}

function hideDetail() {
  hideField('comboSearchButton');
  hideField('comboSelectButton');
  hideField('comboNewButton');
  hideField('comboSaveButton');
  hideField('comboCloseButton');
  frames['comboDetailFrame'].location.href="preparePreview.php";
  dijit.byId("dialogDetail").hide();
  if (dijit.byId(dojo.byId('comboName').value)) {
    dijit.byId(dojo.byId('comboName').value).focus();
  }
}

//=============================================================================
//= Copy Object
//=============================================================================

/**
 * Display a copy object Box
 * 
 */
function copyObjectBox(copyType) {
  var callBack=function() {

  };
  if (copyType=="copyDocument") {
    callBack=function() {
    };
    var params="&objectClass="+dojo.byId('objectClass').value;
    params+="&objectId="+dojo.byId("objectId").value;   
    params+="&copyType="+copyType;  
    loadDialog('dialogCopyDocument', callBack, true, params, false);
  }else{
  if (copyType=="copyVersion") {
    callBack=function() {
    };
  } else if(copyType=="copyObjectTo"){
    callBack=function() {
      dojo.byId('copyClass').value=dojo.byId('objectClass').value;
      dojo.byId('copyId').value=dojo.byId("objectId").value;
      copyObjectToShowStructure();
    };
  }else if(copyType=="copyProject"){
    callBack=function() {
      dojo.byId('copyProjectId').value=dojo.byId("objectId").value;
      dijit.byId('copyProjectToName').set('value', dijit.byId('name').get('value'));
      dijit.byId('copyProjectToType').reset();
      if (dijit.byId('idProjectType') && dojo.byId('codeType')
          && dojo.byId('codeType').value != 'TMP') {
        var runModif="dijit.byId('copyProjectToType').set('value',dijit.byId('idProjectType').get('value'))";
        setTimeout(runModif, 1);
      }
    };
  }
  var params="&objectClass="+dojo.byId('objectClass').value;
  params+="&objectId="+dojo.byId("objectId").value;   
  params+="&copyType="+copyType;   
  loadDialog('dialogCopy', callBack, true, params, false);
  }
}

function copySubTaskObjectBox(refType,refId) {
 
  callBack=function() {
    dojo.byId('copyClass').value=refType;
    dojo.byId('copyId').value=refId;
  };
  
  var params="&objectClass="+refType;
  params+="&objectId="+refId;   
  params+="&copyType=copyObjectTo";   
  loadDialog('dialogCopy', callBack, true, params, false);
  
}

// =============================================================================
// = Notes
// =============================================================================

// DOJO HACK
// Hack to be able to interact with ck_editor popups in Notes
// NEEDS TO CHANGE dijit/Dialog.js, in focus.watch
// Replace
//   if(node == topDialog.domNode || domClass.contains(node, "dijitPopup")){ return; }
// With
//   if(node == topDialog.domNode || domClass.contains(node, "dijitPopup") || domClass.contains(node, "cke_dialog_body")){ return; }
// And then rebuild dojo
// 7.3.0 Not usefull anymore with dojo 1.14 and 2 lines below
function pauseBodyFocus() { dojo.query(".cke_dialog_body").addClass("dijitPopup");}      
function resumeBodyFocus() { dojo.query(".cke_dialog_body").removeClass("dijitPopup");}   
//Function handling change in note size
function changeNoteSize(objName) {
    const collapse = "iconButtonCollapseHide16 iconButtonCollapseHide iconSize16";
    const fullScreen = "iconButtonCollapseOpen16 iconButtonCollapseOpen iconSize16";

    let noteDiv = document.getElementById(objName + "_Note");
    let mainDiv = document.getElementById("mainDiv");
    let newDiv;
    let count = 1;

    if (document.getElementById("idIconButtonCollapseOpen").className == fullScreen) {

        mainDiv.style.visibility = "hidden";
        document.getElementById("idIconButtonCollapseOpen").className = collapse;

        newDiv = document.createElement("div");
        newDiv.setAttribute("name", objName + "_Note");
        
        
        let temp = noteDiv.cloneNode(true);
        newDiv.appendChild(temp);

        noteDiv.id = objName + "_Note_Hidden";
        document.body.insertBefore(newDiv, document.body.firstChild);
        
        document.getElementById(objName + "_Note").style.width = "98%";
        while (count <= newDiv.querySelectorAll("[id=idIconRemove]").length * 3 + 1) {
            newDiv.getElementsByClassName("roundedButtonSmall")[count].parentNode.style.visibility = "collapse";
            count += 1;
        }
        document.getElementById(objName + "_Note_pane").style.height = "94vh";
        document.getElementById(objName + "_Note_pane").style.overflow = "auto";

    } else {
        document.getElementsByName(objName + "_Note")[0].remove();
        document.getElementById(objName + "_Note_Hidden").id = objName + "_Note";

        document.getElementById("idIconButtonCollapseOpen").className = fullScreen;
        mainDiv.style.visibility = "visible";
    }
}

function addNote(reply, idParentNote) {
  if (dijit.byId("noteToolTip")) {
    dijit.byId("noteToolTip").destroy();
    dijit.byId("noteNote").set("class", "");
  }
  pauseBodyFocus();
  var callBack=function() {
    var editorType=dojo.byId("noteEditorType").value;
    if (editorType=="CK" || editorType=="CKInline") { // CKeditor type
      ckEditorReplaceEditor("noteNote",999);
    } else if (editorType=="text") {
      dijit.byId("noteNote").focus();
      dojo.byId("noteNote").style.height=(screen.height*0.6)+'px';
      dojo.byId("noteNote").style.width=(screen.width*0.6)+'px';
    } else if (dijit.byId("noteNoteEditor")) { // Dojo type editor
      dijit.byId("noteNoteEditor").set("class", "input");
      dijit.byId("noteNoteEditor").focus();
      dijit.byId("noteNoteEditor").set("height", (screen.height*0.6)+'px'); // Works on first time
      dojo.byId("noteNoteEditor_iframe").style.height=(screen.height*0.6)+'px'; // Works after first time
    }
  };
  var params="&objectClass="+dojo.byId('objectClass').value;
  params+="&objectId="+dojo.byId("objectId").value;
  params+="&noteId="; // Null
  params+="&reply="+reply;
  if(reply){
	  params+="&idParentNote="+idParentNote;
  }
  loadDialog('dialogNote', callBack, true, params, true);
}

function noteSelectPredefinedText(idPrefefinedText) {
  dojo.xhrGet({
    url : '../tool/getPredefinedText.php?id=' + idPrefefinedText,
    handleAs : "text",
    load : function(data) {
      var editorType=dojo.byId("noteEditorType").value;
      if (editorType=="CK" || editorType=="CKInline") { // CKeditor type
        CKEDITOR.instances['noteNote'].setData(data);
      } else if (editorType=="text") { 
        dijit.byId('noteNote').set('value', data);
        dijit.byId('noteNote').focus();
      } else if (dijit.byId('noteNoteEditor')) {
        dijit.byId('noteNote').set('value', data);
        dijit.byId('noteNoteEditor').set('value', data);
        dijit.byId("noteNoteEditor").focus();
      } 
    }
  });
}

function editNote(noteId, privacy) {
  if (dijit.byId("noteToolTip")) {
    dijit.byId("noteToolTip").destroy();
    dijit.byId("noteNote").set("class", "");
  }
  pauseBodyFocus();
  var callBack=function() {
    //dijit.byId('notePrivacyPublic').set('checked', 'true');
    var editorType=dojo.byId("noteEditorType").value;
    if (editorType=="CK" || editorType=="CKInline") { // CKeditor type
      ckEditorReplaceEditor("noteNote",999);
    } else if (editorType=="text") { 
      dijit.byId("noteNote").focus();
      dojo.byId("noteNote").style.height=(screen.height*0.6)+'px';
      dojo.byId("noteNote").style.width=(screen.width*0.6)+'px';
    } else if (dijit.byId("noteNoteEditor")) { // Dojo type editor
      dijit.byId("noteNoteEditor").set("class", "input");
      dijit.byId("noteNoteEditor").focus();
      dijit.byId("noteNoteEditor").set("height", (screen.height*0.6)+'px'); // Works on first time
      dojo.byId("noteNoteEditor_iframe").style.height=(screen.height*0.6)+'px'; // Works after first time
    } 
  };
  var params="&objectClass="+dojo.byId('objectClass').value;
  params+="&objectId="+dojo.byId("objectId").value;
  params+="&noteId="+noteId;
  loadDialog('dialogNote', callBack, true, params, true);
}

function saveNote() {
  var editorType=dojo.byId("noteEditorType").value;
  if (editorType=="CK" || editorType=="CKInline") {
    noteEditor=CKEDITOR.instances['noteNote'];
    noteEditor.updateElement();
    var tmpCkEditor=noteEditor.document.getBody().getText();
    var tmpCkEditorData=noteEditor.getData();
    if (tmpCkEditor.trim()=="" && tmpCkEditorData.indexOf('<img')<=0) {
      var msg=i18n('messageMandatory', new Array(i18n('Note')));
      noteEditor.focus();
      showAlert(msg);
      return;
    }
  } else if (dijit.byId("noteNoteEditor")) {
    if (dijit.byId("noteNote").getValue() == '') {
      dijit.byId("noteNoteEditor").set("class", "input required");
      var msg=i18n('messageMandatory', new Array(i18n('Note')));
      dijit.byId("noteNoteEditor").focus();
      dojo.byId("noteNoteEditor").focus();
      showAlert(msg);
      return;
    }
  } 
  loadContent("../tool/saveNote.php", "resultDivMain", "noteForm", true, 'note');
  loadContentStream();
  dijit.byId('dialogNote').hide();
}

function removeNote(noteId) {
  var param="?noteId="+noteId;
  var dest="resultDivMain";
  if (dojo.byId('objectClass') && dojo.byId("objectId")) {
    param+="&noteRefType="+dojo.byId('objectClass').value;
    param+="&noteRefId="+dojo.byId("objectId").value;
  } else if (dojo.byId('noteRefType') && dojo.byId('noteRefId')) {
    param+="&noteRefType="+dojo.byId('noteRefType').value;
    param+="&noteRefId="+dojo.byId('noteRefId').value;
    //dest="resultKanbanStreamDiv";
  }
  actionOK=function() {
    loadContent("../tool/removeNote.php"+param, dest, "noteForm", true, 'note');
  };
  msg=i18n('confirmDelete', new Array(i18n('Note'), noteId));
  showConfirm(msg, actionOK);
}

// =============================================================================
// = Attachments
// =============================================================================

function addAttachment(attachmentType,refType,refId) {
  var content="";
  if (dijit.byId('dialogAttachment')) content=dijit.byId('dialogAttachment').get('content');
  if (content == "") {
    callBack=function() {
      dojo.connect(dijit.byId("attachmentFile"), "onComplete", function(dataArray) {
        saveAttachmentAck(dataArray);
      });
      dojo.connect(dijit.byId("attachmentFile"), "onProgress", function(data) {
        saveAttachmentProgress(data);
      });
      dojo.connect(dijit.byId("attachmentFile"), "onError", function(evt) {
        hideWait();
        showError(i18n("uploadUncomplete"));
      });
      addAttachment(attachmentType,refType,refId);
      if (isHtml5() && dijit.byId('attachmentFileDirect')) {
        dijit.byId('attachmentFileDirect').reset();
        dijit.byId('attachmentFileDirect').addDropTarget(dojo.byId('attachmentFileDropArea'));
      }
    };
    loadDialog('dialogAttachment', callBack);
    return;
  }
  dojo.byId("attachmentId").value="";
  dojo.byId("attachmentRefType").value=(refType)?refType:((dojo.byId('objectClass'))?dojo.byId('objectClass').value:'User');
  dojo.byId("attachmentRefId").value=(refId)?refId:((dojo.byId('objectId'))?dojo.byId("objectId").value:dojo.byId("userMenuIdUser").value);
  dojo.byId("attachmentType").value=attachmentType;
  if(dojo.byId("attachmentFileName")){
    dojo.byId("attachmentFileName").innerHTML="";
  }
  dojo.style(dojo.byId('downloadProgress'), {
    display : 'none'
  });
  if (attachmentType == 'file') {
    if (dijit.byId("attachmentFile")) {
      dijit.byId("attachmentFile").reset();
      if (!isHtml5()) {
        enableWidget('dialogAttachmentSubmit');
      } else {
        disableWidget('dialogAttachmentSubmit');
      }
    }
    dojo.style(dojo.byId('dialogAttachmentFileDiv'), {
      display : 'block'
    });
    dojo.style(dojo.byId('dialogAttachmentLinkDiv'), {
      display : 'none'
    });
  } else {
    if(dijit.byId("attachmentLink")){
      dijit.byId("attachmentLink").set('value', null);
    }
    dojo.style(dojo.byId('dialogAttachmentFileDiv'), {
      display : 'none'
    });
    dojo.style(dojo.byId('dialogAttachmentLinkDiv'), {
      display : 'block'
    });
    enableWidget('dialogAttachmentSubmit');
  }
  if(dijit.byId("attachmentDescription").get('checked')==true && refType!='SubTask'){
    dijit.byId("attachmentDescription").set('disabled', false);
    dijit.byId('attachmentPrivacyPrivate').set('disabled',false);
  }
  dijit.byId("attachmentDescription").set('value', null);
  dijit.byId("dialogAttachment").set('title', i18n("dialogAttachment"));
  dijit.byId('attachmentPrivacyPublic').set('checked', 'true');
  if(refType=='SubTask'){
    dijit.byId("attachmentDescription").set('disabled', true);
    dijit.byId('attachmentPrivacyPrivate').set('disabled',true);
  }

  dijit.byId("dialogAttachment").show();
}

function changeAttachment(list) {
  if (list.length > 0) {
    htmlList="";
    for (var i=0; i < list.length; i++) {
      htmlList+=list[i]['name'] + '<br/>';
    }
    dojo.byId('attachmentFileName').innerHTML=htmlList;
    enableWidget('dialogAttachmentSubmit');
    dojo.byId('attachmentFile').height="200px";
  } else {
    dojo.byId('attachmentFileName').innerHTML="";
    disableWidget('dialogAttachmentSubmit');
    dojo.byId('attachmentFile').height="20px";
  }
}

var cancelDupplicate=false;
function saveAttachment(direct,idName) {
  // disableWidget('dialogAttachmentSubmit');
  if(cancelDupplicate)return;
  cancelDupplicate=true;
  if (!isHtml5()) {
    if (dojo.isIE && dojo.isIE<=8) {
      dojo.byId('attachmentForm').submit();
    }
    showWait();
    dijit.byId('dialogAttachment').hide();
    return true;
  }
  if (dojo.byId("attachmentType")
      && dojo.byId("attachmentType").value == 'file'
      && dojo.byId('attachmentFileName')
      && dojo.byId('attachmentFileName').innerHTML == "") {
    return false;
  }
  
  if (direct) {
    if (dijit.byId(idName)) {
      if (dijit.byId(idName).getFileList().length > 20) {
        showAlert(i18n('uploadLimitNumberFiles'));
        return false;
      }
    }
  } else {
    if (dijit.byId("attachmentFile")) {
      if (dijit.byId("attachmentFile").getFileList().length > 20) {
        showAlert(i18n('uploadLimitNumberFiles'));
        return false;
      }
    }
  }
  dojo.style(dojo.byId('downloadProgress'), {
    display : 'block'
  });
  showWait();
  dijit.byId('dialogAttachment').hide();
  return true;
}

function saveAttachmentAck(dataArray) {
  if (dataArray==undefined) {
    dojo.style(dojo.byId('downloadProgress'), {display : 'none'});
    dojo.byId('resultAck').value=i18n("uploadUncomplete");  
    hideWait();
    return;
  }
  if (!isHtml5()) {
    resultFrame=document.getElementById("resultPost");
    resultText=resultPost.document.body.innerHTML;
    dojo.byId('resultAck').value=resultText;
    loadContent("../tool/ack.php", "resultDivMain", "attachmentAckForm", true,
        'attachment');
    return;
  }
  dijit.byId('dialogAttachment').hide();
  if (dojo.isArray(dataArray)) {
    result=dataArray[0];
  } else {
    result=dataArray;
  }
  dojo.style(dojo.byId('downloadProgress'), {display : 'none'});
  dojo.byId('resultAck').value=result.message;
  loadContent("../tool/ack.php", "resultDivMain", "attachmentAckForm", true,
      'attachment');
  loadContent("../view/menuUserTop.php", "drawMenuUser");
}

function saveAttachmentProgress(data) {
  done=data.bytesLoaded;
  total=data.bytesTotal;
  if (total) {
    progress=done / total;
  }
  dijit.byId('downloadProgress').set('value', progress);
}

function removeAttachment(attachmentId) {
  var content="";
  if (dijit.byId('dialogAttachment')) content=dijit.byId('dialogAttachment').get('content');
  if (content == "") {
    callBack=function() {
      dojo.connect(dijit.byId("attachmentFile"), "onComplete", function(
          dataArray) {
        saveAttachmentAck(dataArray);
      });
      dojo.connect(dijit.byId("attachmentFile"), "onProgress", function(data) {
        saveAttachmentProgress(data);
      });
      dijit.byId('dialogAttachment').hide();
      removeAttachment(attachmentId);
    };
    loadDialog('dialogAttachment', callBack);
    return;
  }
  dojo.byId("attachmentId").value=attachmentId;
  dojo.byId("attachmentRefType").value=dojo.byId('objectClass').value;
  dojo.byId("attachmentRefId").value=dojo.byId("objectId").value;
  actionOK=function(reftype,refId,idResource) {
      loadContent("../tool/removeAttachment.php", "resultDivMain", "attachmentForm",
          true, 'attachment');
      loadContent("../view/menuUserTop.php", "drawMenuUser");
      //loadContent("../view/menuBar.php", "iconMenuUserPhoto");
      if(dojo.byId('refreshSTDivValues')){
        var idSubTask=dojo.byId('refreshSTDivValues').value;
        setTimeout('refreshSubTaskAttachment('+idSubTask+')',200);
      }
  };
  
  msg=i18n('confirmDelete', new Array(i18n('Attachment'), attachmentId));
  showConfirm(msg, actionOK);
}

function editAttachment(id){
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  var callBack = function () {
    dojo.xhrGet({
      url : '../tool/getSingleData.php?dataType=editAttachment&id='+id,
      handleAs : "text",
      load : function(data) {
        dijit.byId('attachmentDescriptionEdit').set('value', data);
      }
      });
    dijit.byId("dialogAttachmentEdit").show();
  };
  var params="&id="+id;
  params+="&mode=edit";
  loadDialog('dialogAttachmentEdit',callBack,false,params);
}

function saveAttachmentEdit() {
  var privacy = 0;
  if(dijit.byId('attachmentPrivacyPublicEdit').get('checked')) privacy = 1;
  if(dijit.byId('attachmentPrivacyTeamEdit').get('checked')) privacy = 2;
  if(dijit.byId('attachmentPrivacyPrivateEdit').get('checked'))privacy = 3;
  var url='../tool/saveAttachmentEdit.php';
  url+='?privacy=' + privacy;
  loadContent(url, "resultDivMain", "attachmentFormEdit", true, "attachment");
  dijit.byId('dialogAttachmentEdit').hide();
}

// =============================================================================
// = Links
// =============================================================================

var noRefreshLink=false;
function addLink(classLink, defaultLink) {
  if (dojo.byId('objectClass') && dojo.byId('objectClass').value=='Requirement' && classLink=='TestCase' &&checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  if (!classLink) {
    var params="&objectClass="+dojo.byId('objectClass').value+"&objectId="+dojo.byId("objectId").value;
  }
  loadDialog('dialogLink',function(){
    noRefreshLink=true;
    var objectClass=dojo.byId('objectClass').value;
    var objectId=dojo.byId("objectId").value;
    var message=i18n("dialogLink");
    dojo.byId("linkId").value="";
    dojo.byId("linkRef1Type").value=objectClass;
    dojo.byId("linkRef1Id").value=objectId;
    dojo.style(dojo.byId('linkDocumentVersionDiv'), {
      display : 'none'
    });
    dijit.byId("linkDocumentVersion").reset();
    if (classLink) {
      dojo.byId("linkFixedClass").value=classLink;
      message=i18n("dialogLinkRestricted", new Array(i18n(objectClass), objectId,
          i18n(classLink)));
      dijit.byId("linkRef2Type").setDisplayedValue(i18n(classLink));
      lockWidget("linkRef2Type");
      noRefreshLink=false;
      refreshLinkList();
    } else {
      dojo.byId("linkFixedClass").value="";
      if (defaultLink) {
        dijit.byId("linkRef2Type").set('value', defaultLink);
      } else {
        dijit.byId("linkRef2Type").reset();
      }
      message=i18n("dialogLinkExtended", new Array(i18n(objectClass), objectId));
      unlockWidget("linkRef2Type");
      noRefreshLink=false;
      refreshLinkList();
    }
    dijit.byId("dialogLink").set('title', message);
    dijit.byId("linkComment").set('value', '');
    dijit.byId("dialogLink").show();
    disableWidget('dialogLinkSubmit');
  }, true, params, true);
}

function selectLinkItem() {
  var nbSelected=0;
  list=dojo.byId('linkRef2Id');
  if (dojo.byId("linkRef2Type").value == "Document") {
    if (list.options) {
      selected=new Array();
      for (var i=0; i < list.options.length; i++) {
        if (list.options[i].selected) {
          selected.push(list.options[i].value);
          nbSelected++;
        }
      }
      if (selected.length == 1) {
        dijit.byId("linkDocumentVersion").reset();
        refreshList('idDocumentVersion', 'idDocument', selected[0], null,'linkDocumentVersion', false);
        dojo.style(dojo.byId('linkDocumentVersionDiv'), {
          display : 'block'
        });
      } else {
        dojo.style(dojo.byId('linkDocumentVersionDiv'), {
          display : 'none'
        });
        dijit.byId("linkDocumentVersion").reset();
      }
    }
  } else {
    if (list.options) {
      for (var i=0; i < list.options.length; i++) {
        if (list.options[i].selected) {
          nbSelected++;
        }
      }
    }
    dojo.style(dojo.byId('linkDocumentVersionDiv'), {
      display : 'none'
    });
    dijit.byId("linkDocumentVersion").reset();
  }
  if (nbSelected > 0) {
    enableWidget('dialogLinkSubmit');
  } else {
    disableWidget('dialogLinkSubmit');
  }
}

function refreshLinkList(selected) {
  if (noRefreshLink)
    return;
  disableWidget('dialogLinkSubmit');
  var url='../tool/dynamicListLink.php';
  if (selected) {
    url+='?selected=' + selected;
  }
  if (!selected) {
    selectLinkItem();
  }
  loadContent(url, 'dialogLinkList', 'linkForm', false);
}

function saveLink() {
  if (dojo.byId("linkRef2Id").value == "")
    return;
  var fixedClass = (dojo.byId('linkFixedClass'))?dojo.byId('linkFixedClass').value:'';
  loadContent("../tool/saveLink.php", "resultDivMain", "linkForm", true, 'link'+fixedClass);
  dijit.byId('dialogLink').hide();
}

function removeLink(linkId, refType, refId, refTypeName, fixedClass) {
  if (dojo.byId('objectClass') && dojo.byId('objectClass').value=='Requirement' && fixedClass=='TestCase' && checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  actionOK=function() {
    if(fixedClass && fixedClass==refType){
      loadContent("../tool/removeLink.php?linkId="+linkId+"&linkRef1Type="+dojo.byId('objectClass').value
          +"&linkRef1Id="+dojo.byId("objectId").value+"&linkRef2Type="+refType
          +"&linkRef2Id="+refId, "resultDivMain", null, true, 'link'+fixedClass);
    } else {
      loadContent("../tool/removeLink.php?linkId="+linkId+"&linkRef1Type="+dojo.byId('objectClass').value
          +"&linkRef1Id="+dojo.byId("objectId").value+"&linkRef2Type="+refType
          +"&linkRef2Id="+refId, "resultDivMain", null, true, 'link');
    }
  };
  if (!refTypeName) {
    refTypeName=i18n(refType);
  }
  msg=i18n('confirmDeleteLink', new Array(refTypeName, refId));
  showConfirm(msg, actionOK);
}

function editLink(linkId,id,classLink){
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  var callBack = function () {
    dojo.xhrGet({
      url : '../tool/getSingleData.php?dataType=editLink&idLink='+linkId,
      handleAs : "text",
      load : function(data) {
        dijit.byId('linkComment').set('value', data);
        if(classLink){
          dojo.byId("linkFixedClass").value=classLink;
        }
      }
      });
    dijit.byId("dialogLink").show();
  };
  var params="&id="+id;
  params+="&linkId="+linkId;
  params+="&mode=edit";
  loadDialog('dialogLink',callBack,false,params);
}

function removeFollowup(followupId,all){
  var param="?messageFollowup="+followupId;
  param+="&deleteAll="+all;
  
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  actionOK=function() {
    loadContent("../tool/removeMessageFollowup.php"+param, "resultDivMain", "objectForm", true, 'MessageLegalFollowup');
  };

  msg=i18n('confirmRemoveMessageFollowup');
  showConfirm(msg, actionOK);
}

// =============================================================================
// = Origin
// =============================================================================

function addOrigin() {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  var objectClass=dojo.byId('objectClass').value;
  var objectId=dojo.byId("objectId").value;
  dijit.byId("originOriginType").reset();
  refreshOriginList();
  dojo.byId("originId").value="";
  dojo.byId("originRefType").value=objectClass;
  dojo.byId("originRefId").value=objectId;
  dijit.byId("dialogOrigin").show();
  disableWidget('dialogOriginSubmit');
}

function refreshOriginList(selected) {
  disableWidget('dialogOriginSubmit');
  var url='../tool/dynamicListOrigin.php';
  if (selected) {
    url+='?selected=' + selected;
  }
  loadContent(url, 'dialogOriginList', 'originForm', false);
}

function saveOrigin() {
  if (dojo.byId("originOriginId").value == "")
    return;
  loadContent("../tool/saveOrigin.php", "resultDivMain", "originForm", true,
      'origin');
  dijit.byId('dialogOrigin').hide();
}

function removeOrigin(id, origType, origId) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  dojo.byId("originId").value=id;
  dojo.byId("originRefType").value=dojo.byId('objectClass').value;
  dojo.byId("originRefId").value=dojo.byId("objectId").value;
  dijit.byId("originOriginType").set('value', origType);
  dojo.byId("originOriginId").value=origId;
  actionOK=function() {
    loadContent("../tool/removeOrigin.php", "resultDivMain", "originForm", true,
        'origin');
  };
  msg=i18n('confirmDeleteOrigin', new Array(i18n(origType), origId));
  showConfirm(msg, actionOK);
}


// =============================================================================
// = ChecklistDefinitionLine
// =============================================================================

function addChecklistDefinitionLine(checkId) {
  var params="&checkId=" + checkId;
  loadDialog('dialogChecklistDefinitionLine', null, true, params);
}

function editChecklistDefinitionLine(checkId, lineId) {
  var params="&checkId=" + checkId + "&lineId=" + lineId;
  loadDialog('dialogChecklistDefinitionLine', null, true, params);
}

function saveChecklistDefinitionLine() {
  if (!dijit.byId("dialogChecklistDefinitionLineName").get('value')) {
    showAlert(i18n('messageMandatory', new Array(i18n('colName'))));
    return false;
  }
  loadContent("../tool/saveChecklistDefinitionLine.php", "resultDivMain",
      "dialogChecklistDefinitionLineForm", true, 'checklistDefinitionLine');
  dijit.byId('dialogChecklistDefinitionLine').hide();

}

function removeChecklistDefinitionLine(lineId) {
  var params="?lineId=" + lineId;
  actionOK=function() {
    loadContent("../tool/removeChecklistDefinitionLine.php" + params,
        "resultDivMain", null, true, 'checklistDefinitionLine');
  };
  msg=i18n('confirmDelete', new Array(i18n('ChecklistDefinitionLine'), lineId));
  showConfirm(msg, actionOK);
}

// =============================================================================
// = Checklist
// =============================================================================

function showChecklist(objectClass) {
  if (!objectClass) {
    return;
  }
  if (dijit.byId('id')) {
    var objectId=dijit.byId('id').get('value');
  } else {
    return;
  }
  var params="&objectClass=" + objectClass + "&objectId=" + objectId;
  loadDialog('dialogChecklist', null, true, params, true);
}

function saveChecklist() {
  loadContent('../tool/saveChecklist.php', 'resultDivMain', 'dialogChecklistForm',
      true, 'checklist');
  dijit.byId('dialogChecklist').hide();
  return false;
}

function checkClick(line, item) {
  checkName="check_" + line + "_" + item;
  if (dijit.byId(checkName).get('checked')) {
    for (var i=1; i <= 5; i++) {
      if (i != item && dijit.byId("check_" + line + "_" + i)) {
        dijit.byId("check_" + line + "_" + i).set('checked', false);
      }
    }
  }
}

// =============================================================================
// = History
// =============================================================================

function showHistory(objectClass) {
  if (!objectClass) {
    return;
  }
  if (dijit.byId('id')) {
    var objectId=dijit.byId('id').get('value');
  } else {
    return;
  }
  var params="&objectClass=" + objectClass + "&objectId=" + objectId;
  loadDialog('dialogHistory', null, true, params);
}

// =============================================================================
// = Import
// =============================================================================

/**
 * Display an import Data Box (Not used, for an eventual improvement)
 * 
 */
function importData() {
  var controls=controlImportData();
  if (controls) {
    showWait();
  }
  return controls;
}

function showHelpImportData() {
  var controls=controlImportData();
  if (controls) {
    showWait();
    var url='../tool/importHelp.php?elementType='
        + dijit.byId('elementType').get('value');
    url+='&fileType=' + dijit.byId('fileType').get('value');
    frames['resultImportData'].location.href=url;
  }
}

function controlImportData() {
  var elementType=dijit.byId('elementType').get('value');
  if (!elementType) {
    showAlert(i18n('messageMandatory', new Array(i18n('colImportElementType'))));
    return false;
  }
  var fileType=dijit.byId('fileType').get('value');
  if (!fileType) {
    showAlert(i18n('messageMandatory', new Array(i18n('colImportFileType'))));
    return false;
  }
  return true;
}
function importFinished() {
  if (dijit.byId('elementType') && dijit.byId('elementType').get('displayedValue')==i18n('Project') ) {
    refreshProjectSelectorList();
  }
}
 
// =============================================================================
// = Filter
// =============================================================================

var filterStartInput=false;
var filterFromDetail=false;
function showFilterDialog() {
  function callBack(){
    filterStartInput=false;
    window.top.filterFromDetail=false;
    if (window.top.dijit.byId('dialogDetail').open) {
      window.top.filterFromDetail=true;
      dojo.byId('filterDefaultButtonDiv').style.display='none';
    } else {
      dojo.byId('filterDefaultButtonDiv').style.display='block';
    }
    dojo.style(dijit.byId('idFilterOperator').domNode, {
      visibility : 'hidden'
    });
    dojo.style(dijit.byId('filterValue').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('filterValueList').domNode, {
      display : 'none'
    });
    if (isNewGui) dojo.byId("filterDynamicParameterPane").style.left="200px";
    if (isNewGui) dojo.byId("filterValueListHideTop").style.display="none";
    dojo.style(dijit.byId('showDetailInFilter').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('filterValueCheckbox').domNode, {
      display : 'none'
    });
    if (dijit.byId('filterValueCheckboxSwitch')) { 
      dojo.style(dijit.byId('filterValueCheckboxSwitch').domNode, {
        display : 'none'
      });
    }
    dojo.style(dijit.byId('filterValueDate').domNode, {
      display : 'none'
    });

    dojo.byId('filterDynamicParameterPane').style.display='none';
    if (isNewGui) dojo.byId("filterValueListHideTop").style.display="none";
    dijit.byId('idFilterAttribute').reset();
    if (dojo.byId('objectClassList') && dojo.byId('objectClassList').value) dojo.byId('filterObjectClass').value=dojo.byId('objectClassList').value;
    else if (dojo.byId('objectClassManual') && dojo.byId('objectClassManual').value) dojo.byId('filterObjectClass').value=dojo.byId('objectClassManual').value;
    else if (dojo.byId('objectClass') && dojo.byId('objectClass').value) dojo.byId('filterObjectClass').value=dojo.byId('objectClass').value;
    else dojo.byId('filterObjectClass').value=null;
    filterType="";
    var compUrl=(window.top.dijit.byId("dialogDetail").open) ? '&comboDetail=true' : '';
    dojo.xhrPost({
      url : "../tool/backupFilter.php?filterObjectClass="
          + dojo.byId('filterObjectClass').value + compUrl,
      handleAs : "text",
      load : function(data, args) {
      }
    });
    compUrl=(window.top.dijit.byId("dialogDetail").open) ? '?comboDetail=true' : '';
    loadContent("../tool/displayFilterClause.php" + compUrl,
    		"listFilterClauses", "dialogFilterForm", false, null, null, null, displayOrOperator);
    loadContent("../tool/displayFilterList.php" + compUrl,
        "listStoredFilters", "dialogFilterForm", false);
    loadContent("../tool/displayFilterSharedList.php" + compUrl,
        "listSharedFilters", "dialogFilterForm", false);
    var objectClass='';
    if (dojo.byId('objectClassList') && dojo.byId('objectClassList').value) objectClass=dojo.byId('objectClassList').value;
    else if (dojo.byId("objectClassManual") && dojo.byId("objectClassManual").value && (dojo.byId("objectClassManual").value=='Planning' || dojo.byId("objectClassManual").value=='VersionsPlanning'|| dojo.byId("objectClassManual").value=='ResourcePlanning')) objectClass='Activity';
    else if (dojo.byId('objectClass') && dojo.byId('objectClass').value) objectClass=dojo.byId('objectClass').value;
    if (objectClass.substr(0,7)=='Report_') objectClass=objectClass.substr(7);
    refreshListSpecific('object', 'idFilterAttribute', 'objectClass', objectClass);
    dijit.byId("dialogFilter").show();
  }
  loadDialog('dialogFilter', callBack, true, "", true);
}

function displayOrOperator() {
	if (dojo.byId('nbFilterCriteria').value != "0") {
		dojo.byId('filterLogicalOperator').style.display='block';
    }
}

function filterSelectAtribute(value) {
  if (value) {
    filterStartInput=true;
    if (dijit.byId('filterDynamicParameterSwitch')) dijit.byId('filterDynamicParameterSwitch').set('value', 'off');
    dijit.byId('idFilterAttribute').store.store.fetchItemByIdentity({
      identity : value,
      onItem : function(item) {
        var dataType=dijit.byId('idFilterAttribute').store.store.getValue(
            item, "dataType", "inconnu");
        if(value=="refTypeIncome" || value=="refTypeExpense"){
          dataType="list";
        }
        var datastoreOperator=new dojo.data.ItemFileReadStore({
          url : '../tool/jsonList.php?listType=operator&dataType=' + dataType
        });
        var storeOperator=new dojo.store.DataStore({
          store : datastoreOperator
        });
        storeOperator.query({
          id : "*"
        });
        dijit.byId('idFilterOperator').set('store', storeOperator);
        datastoreOperator.fetch({
          query : {
            id : "*"
          },
          count : 1,
          onItem : function(item) {
            dijit.byId('idFilterOperator').set("value", item.id);
          },
          onError : function(err) {
            console.info(err.message);
          }
        });
        dojo.style(dijit.byId('idFilterOperator').domNode, {
          visibility : 'visible'
        });
        //ADD qCazelles - Dynamic filter - Ticket #78
        dojo.byId('filterDynamicParameterPane').style.display='block';
        if (isNewGui) dojo.byId("filterValueListHideTop").style.display="none";
        //END ADD qCazelles - Dynamic filter - Ticket #78
        dojo.byId('filterDataType').value=dataType;
        if (dataType == "bool") {
          filterType="bool";
          dojo.style(dijit.byId('filterValue').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('filterValueList').domNode, {
            display : 'none'
          });
          if (isNewGui) dojo.byId("filterDynamicParameterPane").style.left="200px";
          if (isNewGui) dojo.byId("filterValueListHideTop").style.display="none";
          if (dijit.byId('filterValueCheckboxSwitch')) { 
            dojo.style(dijit.byId('filterValueCheckboxSwitch').domNode, {
              display : 'block'
            });
            dijit.byId('filterValueCheckbox').set('value', 'off');
          } else {
            dojo.style(dijit.byId('filterValueCheckbox').domNode, {
              display : 'block'
            });
            dijit.byId('filterValueCheckbox').set('checked', '');
          }
          dojo.style(dijit.byId('filterValueDate').domNode, {
            display : 'none'
          });
        } else if (dataType == "list") {
          filterType="list";
          var extraUrl="";
          if (value == 'idTargetVersion' || value == 'idTargetProductVersion' || value == 'idOriginalProductVersion') {
            value='idProductVersion';
            extraUrl='&critField=idle&critValue=all';
          } else if (value == 'idTargetComponentVersion' || value == 'idOriginalComponentVersion') {
            value='idComponentVersion';
            extraUrl='&critField=idle&critValue=all';
          }
          var urlListFilter='../tool/jsonList.php?required=true&listType=list&dataType='+value;
          
          //CHANGE qCazelles - Ticket 165 //Empty lists on filter in comboDetail
          //Old
          //if (currentSelectedProject && currentSelectedProject!='' && currentSelectedProject!='*') {
          //New
          if (typeof currentSelectedProject!='undefined' && currentSelectedProject!='' && currentSelectedProject!='*') {
          //END CHANGE qCazelles - Ticket 165
        	if (value=='idActivity') {
              urlListFilter+='&critField=idProjectSub&critValue='+currentSelectedProject;
            } if (value=='idComponent') {
              // noting
            } else {
              urlListFilter+='&critField=idProject&critValue='+currentSelectedProject;
            }
            if (extraUrl=='&critField=idle&critValue=all') {
              extraUrl=='&critField1=idle&critValue1=all';
            }
          }
          if (extraUrl!="") {
            urlListFilter+=extraUrl;
          }  
          var tmpStore=new dojo.data.ItemFileReadStore({
            url : urlListFilter
          });
          var mySelect=dojo.byId("filterValueList");
          mySelect.options.length=0;
          var nbVal=0;
        //ADD aGaye - Ticket 196
          if(dijit.byId('idFilterAttribute').getValue()=="idBusinessFeature"){
	          var listId = "";
	          tmpStore.fetch({
	              query : {
	                id : "*"
	              },
	              onItem : function(item) {
	            	  listId += (listId != "") ? '_' : '';
	                  listId += parseInt(tmpStore.getValue(item, "id", ""), 10) + '';
	                  nbVal++;
	              },
	              onError : function(err) {
	                console.info(err.message);
	              },
	              onComplete : function() { 
	            	  dojo.xhrGet({
	    	        	url : '../tool/getProductNameFromBusinessFeature.php?listId=' + listId,
	    			    handleAs : "text",
	    			    load: function(data){
	    			    	var listName = JSON.parse(data);
	    			    	tmpStore.fetch({
	    			              query : {
	    			                id : "*"
	    			              },
	    			              onItem : function(item) {
	    			                mySelect.options[mySelect.length]=new Option(tmpStore.getValue(item, "name", "") + " (" + listName[tmpStore.getValue(item, "id", "")] + ")", tmpStore.getValue(item, "id", ""));
	    			              },
	    			              onError : function(err) {
	    			                console.info(err.message);
	    			              }
	    			            });
	    			    }
	    	          });
	               }
	            });
          }else{
        	  tmpStore.fetch({
                  query : {
                    id : "*"
                  },
                  onItem : function(item) {
                    mySelect.options[mySelect.length]=new Option(tmpStore.getValue(
                        item, "name", ""), tmpStore.getValue(item, "id", ""));
                    nbVal++;
                  },
                  onError : function(err) {
                    console.info(err.message);
                  }
                });
          }
          //END aGaye - Ticket 196
          mySelect.size=(nbVal > 10) ? 10 : nbVal;
          dojo.style(dijit.byId('filterValue').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('filterValueList').domNode, {
            display : 'block'
          });
          if (isNewGui) dojo.byId("filterDynamicParameterPane").style.left="8px";
          if (isNewGui) dojo.byId("filterValueListHideTop").style.display="block";
          dojo.style(dijit.byId('showDetailInFilter').domNode, {
            display : 'block'
          });
          dijit.byId('showDetailInFilter').set('value', item.id);
          dijit.byId('filterValueList').reset();
          dojo.style(dijit.byId('filterValueCheckbox').domNode, {
            display : 'none'
          });
          if (dijit.byId('filterValueCheckboxSwitch')) { 
            dojo.style(dijit.byId('filterValueCheckboxSwitch').domNode, {
              display : 'none'
            });
          }
          dojo.style(dijit.byId('filterValueDate').domNode, {
            display : 'none'
          });
        } else if (dataType == "date") {
          filterType="date";
          dojo.style(dijit.byId('filterValue').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('filterValueList').domNode, {
            display : 'none'
          });
          if (isNewGui) dojo.byId("filterDynamicParameterPane").style.left="200px";
          if (isNewGui) dojo.byId("filterValueListHideTop").style.display="none";
          dojo.style(dijit.byId('showDetailInFilter').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('filterValueCheckbox').domNode, {
            display : 'none'
          });
          if (dijit.byId('filterValueCheckboxSwitch')) { 
            dojo.style(dijit.byId('filterValueCheckboxSwitch').domNode, {
              display : 'none'
            });
          }
          dojo.style(dijit.byId('filterValueDate').domNode, {
            display : 'block'
          });
          dijit.byId('filterValueDate').reset();
        } else {
          filterType="text";
          dojo.style(dijit.byId('filterValue').domNode, {
            display : 'block'
          });
          dijit.byId('filterValue').reset();
          dojo.style(dijit.byId('filterValueList').domNode, {
            display : 'none'
          });
          if (isNewGui) dojo.byId("filterDynamicParameterPane").style.left="200px";
          if (isNewGui) dojo.byId("filterValueListHideTop").style.display="none";
          dojo.style(dijit.byId('showDetailInFilter').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('filterValueCheckbox').domNode, {
            display : 'none'
          });
          if (dijit.byId('filterValueCheckboxSwitch')) { 
            dojo.style(dijit.byId('filterValueCheckboxSwitch').domNode, {
              display : 'none'
            });
          }
          dojo.style(dijit.byId('filterValueDate').domNode, {
            display : 'none'
          });
        }
      },
      onError : function(err) {
        dojo.style(dijit.byId('idFilterOperator').domNode, {
          visibility : 'hidden'
        });
        dojo.style(dijit.byId('filterValue').domNode, {
          display : 'none'
        });
        dojo.style(dijit.byId('filterValueList').domNode, {
          display : 'none'
        });
        if (isNewGui) dojo.byId("filterDynamicParameterPane").style.left="200px";
        if (isNewGui) dojo.byId("filterValueListHideTop").style.display="none";
        dojo.style(dijit.byId('showDetailInFilter').domNode, {
          display : 'none'
        });
        dojo.style(dijit.byId('filterValueCheckbox').domNode, {
          display : 'none'
        });
        if (dijit.byId('filterValueCheckboxSwitch')) { 
          dojo.style(dijit.byId('filterValueCheckboxSwitch').domNode, {
            display : 'none'
          });
        }
        dojo.style(dijit.byId('filterValueDate').domNode, {
          display : 'none'
        });
        // hideWait();
      }
    });
    dijit.byId('filterValue').reset();
    dijit.byId('filterValueList').reset();
    dijit.byId('filterValueCheckbox').reset();
    if (dijit.byId('filterValueCheckboxSwitch')) { dijit.byId('filterValueCheckboxSwitch').reset();}
    dijit.byId('filterValueDate').reset();
    
  } else {
    dojo.style(dijit.byId('idFilterOperator').domNode, {
      visibility : 'hidden'
    });
    dojo.style(dijit.byId('filterValue').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('filterValueList').domNode, {
      display : 'none'
    });
    if (isNewGui) dojo.byId("filterDynamicParameterPane").style.left="200px";
    if (isNewGui) dojo.byId("filterValueListHideTop").style.display="none";
    dojo.style(dijit.byId('showDetailInFilter').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('filterValueCheckbox').domNode, {
      display : 'none'
    });
    if (dijit.byId('filterValueCheckboxSwitch')) { 
      dojo.style(dijit.byId('filterValueCheckboxSwitch').domNode, {
        display : 'none'
      });
    }
    dojo.style(dijit.byId('filterValueDate').domNode, {
      display : 'none'
    });
  }
}

function onColumnHeaderClickedSort(ev) {
  const th = ev.currentTarget;
  const table = th.closest( 'table' );
  const thIndex = Array.from( th.parentElement.children ).indexOf( th );
  const ascending = !( 'sort' in th.dataset ) || th.dataset.sort != 'asc';
  tableRowsSortByColumn( table, thIndex, ascending );

  const allTh = table.querySelectorAll( ':scope > thead > tr > th' );
//  for( var th2 of allTh ) {
//    delete th2.dataset['sort'];
//  }
  allTh.forEach( function(th2) {delete th2.dataset['sort']});

  th.dataset['sort'] = ascending ? 'asc' : 'desc';
}

function tableRowsSortByColumn(table, columnIndex, ascending) {
  var th = Array.from( table.querySelectorAll( 'thead' ) );
  if(!th.length){
	table.createTHead();
	th = Array.from( table.querySelectorAll( 'thead' ) );
	const tb = Array.from( table.querySelectorAll( 'tbody' ) );
	const tr = Array.from( table.querySelectorAll( 'tr' ) );
	th[0].insertAdjacentElement('afterbegin',tr[0]);
	tr.splice(0,1);
  }
  const col = Array.from( table.querySelectorAll( ':scope > thead > tr' ) );
  const columnName = col[0].cells[columnIndex].textContent; // not use but keep this variable, it can be interested to have this columb name if we wnt to improve sort function
  var arrowFlip = (!ascending)?'background-position: -21px 0px;':'';
  col[0].cells[columnIndex].innerHTML = columnName+'<span class="dijitInline dijitArrowNode" style="position: relative;float: right;top: 5px;right: 5px;'+arrowFlip+'"></span>';
  const rows = Array.from( table.querySelectorAll( ':scope > tbody > tr' ) );
//  rows.sort( ( x, y ) => {
  rows.sort( function(x, y) {
        const xValue = x.cells[columnIndex].textContent;
        const yValue = y.cells[columnIndex].textContent;
        if (xValue.match("#[0-9]+") && yValue.match("#[0-9]+")) // if it's an id (#XXXX format)
        {
          const xNum = parseFloat(xValue.replace(/\D+/g, ''));
          const yNum = parseFloat(yValue.replace(/\D+/g, ''));
          return ascending ? (xNum - yNum) : (yNum - xNum);
        }

        return ascending ? (('' + xValue).localeCompare(yValue)) : (('' + yValue).localeCompare(xValue));
      }
  );
//  for( var row of rows )  {
//    table.tBodies[0].appendChild( row );
//  }
  rows.forEach( function(row) {table.tBodies[0].appendChild( row );});
}

function filterSelectOperator(operator) {
  filterStartInput=true;
  if (operator == "SORT") {
    filterType="SORT";
    dojo.style(dijit.byId('filterValue').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('filterValueList').domNode, {
      display : 'none'
    });
    if (isNewGui) dojo.byId("filterDynamicParameterPane").style.left="200px";
    if (isNewGui) dojo.byId("filterValueListHideTop").style.display="none";
    dojo.style(dijit.byId('showDetailInFilter').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('filterValueCheckbox').domNode, {
      display : 'none'
    });
    if (dijit.byId('filterValueCheckboxSwitch')) { 
      dojo.style(dijit.byId('filterValueCheckboxSwitch').domNode, {
        display : 'none'
      });
    }
    dojo.style(dijit.byId('filterValueDate').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('filterSortValueList').domNode, {
      display : 'block'
    });
    dijit.byId('filterDynamicParameter').set('checked', '');
    if (dijit.byId('filterDynamicParameterSwitch')) dijit.byId('filterDynamicParameterSwitch').set('value', 'off');
    dojo.byId('filterDynamicParameterPane').style.display='none';
    if (isNewGui) dojo.byId("filterValueListHideTop").style.display="none";
  } else if (operator == "<=now+" || operator == ">=now+") {
    filterType="text";
    dojo.style(dijit.byId('filterValue').domNode, {
      display : 'block'
    });
    dojo.style(dijit.byId('filterValueList').domNode, {
      display : 'none'
    });
    if (isNewGui) dojo.byId("filterDynamicParameterPane").style.left="200px";
    if (isNewGui) dojo.byId("filterValueListHideTop").style.display="none";
    dojo.style(dijit.byId('showDetailInFilter').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('filterValueCheckbox').domNode, {
      display : 'none'
    });
    if (dijit.byId('filterValueCheckboxSwitch')) { 
      dojo.style(dijit.byId('filterValueCheckboxSwitch').domNode, {
        display : 'none'
      });
    }
    dojo.style(dijit.byId('filterValueDate').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('filterSortValueList').domNode, {
      display : 'none'
    });
  } else if (operator == "isEmpty" || operator == "isNotEmpty"
      || operator == "hasSome") {
    filterType="null";
    dojo.style(dijit.byId('filterValue').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('filterValueList').domNode, {
      display : 'none'
    });
    if (isNewGui) dojo.byId("filterDynamicParameterPane").style.left="200px";
    if (isNewGui) dojo.byId("filterValueListHideTop").style.display="none";
    dojo.style(dijit.byId('showDetailInFilter').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('filterValueCheckbox').domNode, {
      display : 'none'
    });
    if (dijit.byId('filterValueCheckboxSwitch')) { 
      dojo.style(dijit.byId('filterValueCheckboxSwitch').domNode, {
        display : 'none'
      });
    }
    dojo.style(dijit.byId('filterValueDate').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('filterSortValueList').domNode, {
      display : 'none'
    });
    dijit.byId('filterDynamicParameter').set('checked', '');
    if (dijit.byId('filterDynamicParameterSwitch')) dijit.byId('filterDynamicParameterSwitch').set('value', 'off');
    dojo.byId('filterDynamicParameterPane').style.display='none';
    if (isNewGui) dojo.byId("filterValueListHideTop").style.display="none";
  } else {
    dojo.style(dijit.byId('filterValue').domNode, {
      display : 'none'
    });
    dataType=dojo.byId('filterDataType').value;
    dojo.style(dijit.byId('filterSortValueList').domNode, {
      display : 'none'
    });
    if (dataType == "bool") {
      filterType="bool";
      if (dijit.byId('filterValueCheckboxSwitch')) { 
        dojo.style(dijit.byId('filterValueCheckboxSwitch').domNode, {
          display : 'block'
        });
      } else {
        dojo.style(dijit.byId('filterValueCheckbox').domNode, {
          display : 'block'
        });
      }
    } else if (dataType == "list") {
      filterType="list";
      dojo.style(dijit.byId('filterValueList').domNode, {
        display : 'block'
      });
      if (isNewGui) dojo.byId("filterDynamicParameterPane").style.left="8px";
      if (isNewGui) dojo.byId("filterValueListHideTop").style.display="block";
      dojo.style(dijit.byId('showDetailInFilter').domNode, {
        display : 'block'
      });
      dijit.byId('filterDynamicParameter').set('checked', '');
      if (dijit.byId('filterDynamicParameterSwitch')) dijit.byId('filterDynamicParameterSwitch').set('value', 'off');
      dojo.byId('filterDynamicParameterPane').style.display='block';
    } else if (dataType == "date") {
      filterType="date";
      dojo.style(dijit.byId('filterValueDate').domNode, {
        display : 'block'
      });
      dijit.byId('filterDynamicParameter').set('checked', '');
      if (dijit.byId('filterDynamicParameterSwitch')) dijit.byId('filterDynamicParameterSwitch').set('value', 'off');
      dojo.byId('filterDynamicParameterPane').style.display='block';
      if (isNewGui) dojo.byId("filterValueListHideTop").style.display="none";
    } else {
      filterType="text";
      dojo.style(dijit.byId('filterValue').domNode, {
        display : 'block'
      });
      dijit.byId('filterDynamicParameter').set('checked', '');
      if (dijit.byId('filterDynamicParameterSwitch')) dijit.byId('filterDynamicParameterSwitch').set('value', 'off');
      dojo.byId('filterDynamicParameterPane').style.display='block';
      if (isNewGui) dojo.byId("filterValueListHideTop").style.display="none";
    }
  }
}

function addfilterClause(silent) {
  filterStartInput=false;
  if (dijit.byId('filterNameDisplay')) {
    dojo.byId('filterName').value=dijit.byId('filterNameDisplay').get('value');
  }
  if (filterType == "") {
    if (!silent)
      showAlert(i18n('attributeNotSelected'));
    return;
  }
  if (trim(dijit.byId('idFilterOperator').get('value')) == '') {
    if (!silent)
      showAlert(i18n('operatorNotSelected'));
    return;
  }
  if (!dijit.byId('filterDynamicParameter').get('checked')) {
	  if (filterType == "list"
	      && trim(dijit.byId('filterValueList').get('value')) == '') {
	    if (!silent)
	      showAlert(i18n('valueNotSelected'));
	    return;
	  }
	  if (filterType == "date" && !dijit.byId('filterValueDate').get('value')) {
	    if (!silent)
	      showAlert(i18n('valueNotSelected'));
	    return;
	  }
	  if (filterType == "text" && !dijit.byId('filterValue').get('value')) {
	    if (!silent)
	      showAlert(i18n('valueNotSelected'));
	    return;
	  }
	  if (dijit.byId('idFilterAttribute').get('value')=='idle' 
	    && dijit.byId('idFilterOperator').get('value')=='='
	    && dijit.byId('filterValueCheckbox').get('checked')) {
	    dijit.byId('listShowIdle').set('checked',true);
	  }
  }
  var compUrl=(window.top.dijit.byId("dialogDetail").open) ? '?comboDetail=true' : '';
  loadContent("../tool/addFilterClause.php" + compUrl, "listFilterClauses",
      "dialogFilterForm", false,null,null,null,function(){clearDivDelayed('saveFilterResult');});
  if (dojo.byId('filterLogicalOperator') && dojo.byId('filterLogicalOperator').style.display=='none') {
	  dojo.byId('filterLogicalOperator').style.display='block';
  }
}

function removefilterClause(id) {
  if (dijit.byId('filterNameDisplay')) {
    dojo.byId('filterName').value=dijit.byId('filterNameDisplay').get(
        'value');
  }
  dojo.byId("filterClauseId").value=id;
  var compUrl=(window.top.dijit.byId("dialogDetail").open) ? '?comboDetail=true' : '';
  loadContent("../tool/removeFilterClause.php" + compUrl,
      "listFilterClauses", "dialogFilterForm", false);
  if (id=='all' || dojo.byId('nbFilterCriteria').value == "1") { //Value is not set to 0 already but is going to
	dojo.byId('filterLogicalOperator').style.display='none';
  }
  else if (dojo.byId('nbFilterCriteria').value == "2") { //Value is going to be set at 1
	  loadContent("../tool/displayFilterClause.php" + compUrl,
		"listFilterClauses", "dialogFilterForm", false,null,null,null,function(){clearDivDelayed('saveFilterResult');});
  }
}

function selectFilter() {
  if (filterStartInput) {
    addfilterClause(true);
    setTimeout("selectFilterContinue();", 1000);
  } else {
    selectFilterContinue();
  }
}

function selectFilterContinue() {
  if (window.top.dijit.byId('dialogDetail').open) {
    var doc=window.top.frames['comboDetailFrame'];
  } else {
    var doc=window.top;
  }
  if (dijit.byId('filterNameDisplay')) {
    dojo.byId('filterName').value=dijit.byId('filterNameDisplay').get('value');
  }
  var compUrl=(window.top.dijit.byId("dialogDetail").open) ? '&comboDetail=true' : '';
  dojo.xhrPost({
    url : "../tool/backupFilter.php?valid=true" + compUrl,
    form : 'dialogFilterForm',
    handleAs : "text",
    load : function(data, args) {}
  });
  if (dojo.byId('objectClassList') && dojo.byId('objectClassList').value){
    objectClass=dojo.byId('objectClassList').value;
  }else if (! window.top.dijit.byId('dialogDetail').open && dojo.byId("objectClassManual") && dojo.byId("objectClassManual").value){ 
    objectClass=dojo.byId("objectClassManual").value;
  }else if (dojo.byId('objectClass') && dojo.byId('objectClass').value){
    objectClass=dojo.byId('objectClass').value;
  } 
  if (dojo.byId("objectClassManual") && dojo.byId("objectClassManual").value=='Kanban') {
    compUrl+='&context=directFilterList';
    compUrl+='&contentLoad=../view/kanbanView.php';
    compUrl+='&container=divKanbanContainer';
  }
  doc.loadContent(
     "../tool/displayFilterList.php?displayQuickFilter=true&context=directFilterList&filterObjectClass="
         + objectClass + compUrl, "directFilterList", null,
    false, 'returnFromFilter', false);
  /*
   * florent 
   *  Ticket #4010  
   * When adding filter (not stored), icon has not the "on" flag
   */
   if(dojo.byId("nbFilterCriteria").value > 0 && !dijit.byId('filterDynamicParameter').get("checked") && dojo.byId('nbDynamicFilterCriteria').value==0) {
     setTimeout("dijit.byId('listFilterFilter').set('iconClass', 'dijitButtonIcon iconActiveFilter')",500);
   }else{
     setTimeout("dijit.byId('listFilterFilter').set('iconClass', 'dijitButtonIcon iconFilter')",500);
   }
  if(! window.top.dijit.byId('dialogDetail').open && dojo.byId('objectClassManual') && (dojo.byId('objectClassManual').value=='Kanban' || dojo.byId('objectClassManual').value=='LiveMeeting')){
    loadContent("../view/kanbanView.php?idKanban="+dojo.byId('idKanban').value, "divKanbanContainer");
  }else if (!dijit.byId('filterDynamicParameter').get("checked")) {
    if (dojo.byId("objectClassManual") && dojo.byId("objectClassManual").value=='Planning' && ! window.top.dijit.byId('dialogDetail').open) {
        refreshJsonPlanning();
    }else if(dojo.byId("objectClassManual") &&  (dojo.byId("objectClassManual").value=='VersionsPlanning' || dojo.byId("objectClassManual").value=='ResourcePlanning') && ! window.top.dijit.byId('dialogDetail').open){
      if(dojo.byId("objectClassManual").value=='VersionsPlanning'){
        refreshJsonPlanning('version');
      }else{
        refreshJsonPlanning('resource');
      }
    }else if (dojo.byId("objectClassManual") && dojo.byId("objectClassManual").value=='Report') {
      dojo.byId('outMode').value='';runReport();
    } else {
      doc.refreshJsonList(objectClass);
    }
  }
  dijit.byId("dialogFilter").hide();
  filterStartInput=false;
}

function cancelFilter() {
  filterStartInput=true;
  var compUrl=(window.top.dijit.byId("dialogDetail").open) ? '&comboDetail=true' : '';
  dojo.xhrPost({
    url : "../tool/backupFilter.php?cancel=true" + compUrl,
    form : 'dialogFilterForm',
    handleAs : "text",
    load : function(data, args) {
    }
  });
  dijit.byId('dialogFilter').hide();
}

function clearFilter() {
  if (dijit.byId('filterNameDisplay')) {
    dijit.byId('filterNameDisplay').reset();
  }
  dojo.byId('filterName').value="";
  removefilterClause('all');
  // setTimeout("selectFilter();dijit.byId('listFilterFilter').set('iconClass','dijitButtonIcon iconFilter');",100);
  dijit.byId('listFilterFilter').set('iconClass', 'dijitButtonIcon iconFilter');
  dijit.byId('filterNameDisplay').set('value', null);
  dojo.byId('filterName').value=null;
}

function defaultFilter() {
  if (dijit.byId('filterNameDisplay')) {
    dojo.byId('filterName').value=dijit.byId('filterNameDisplay').get(
        'value');
  }
  var compUrl=(window.top.dijit.byId("dialogDetail").open) ? '?comboDetail=true' : '';
  loadContent("../tool/defaultFilter.php" + compUrl, "listStoredFilters",
      "dialogFilterForm", false,null,null,null,function(){clearDivDelayed('saveFilterResult');});
}

function saveFilter() {
  if (dijit.byId('filterNameDisplay')) {
    if (dijit.byId('filterNameDisplay').get('value') == "") {
      showAlert(i18n("messageMandatory", new Array(i18n("filterName"))));
      return;
    }
    dojo.byId('filterName').value=dijit.byId('filterNameDisplay').get(
        'value');
  }
  var compUrl=(window.top.dijit.byId("dialogDetail").open) ? '?comboDetail=true' : '';
  loadContent("../tool/saveFilter.php" + compUrl, "listStoredFilters",
      "dialogFilterForm", false,null,null,null,function(){clearDivDelayed('saveFilterResult');});
}

clearDivDelayedTimeout=[];
function clearDivDelayed(divName,delay) {
  if (clearDivDelayedTimeout[divName]) clearTimeout(clearDivDelayedTimeout[divName]);
  if (!divName) return;
  if (!delay) delay=2000;
  clearDivDelayedTimeout[divName]=setTimeout("if (dojo.byId('"+divName+"')) dojo.byId('"+divName+"').innerHTML='';",delay);
}
/**
 * Select a stored filter in the list and fetch criteria
 * 
 */
var globalSelectFilterContenLoad=null;
var globalSelectFilterContainer=null;
function selectStoredFilter(idFilter, context, contentLoad, container) {  
  var compUrl=(window.top.dijit.byId("dialogDetail").open) ? '&comboDetail=true' : '';
  globalSelectFilterContenLoad=null;
  globalSelectFilterContainer=null;
  if (context == 'directFilterList') {
    if (dojo.byId('noFilterSelected')) {
      if (idFilter == '0') {
        dojo.byId('noFilterSelected').value='true';
      } else {
        dojo.byId('noFilterSelected').value='false';
      }
    } else if (window.top.dojo.byId('noFilterSelected')) {
    	if (idFilter == '0') {
    	  window.top.dojo.byId('noFilterSelected').value='true';
      } else {
        window.top.dojo.byId('noFilterSelected').value='false';
      }
    }
    if (dojo.byId('objectClassList') && dojo.byId('objectClassList').value) objectClass=dojo.byId('objectClassList').value;
    else if (dojo.byId("objectClassManual") && dojo.byId("objectClassManual").value) objectClass=dojo.byId("objectClassManual").value;
    else if (dojo.byId('objectClass') && dojo.byId('objectClass').value) objectClass=dojo.byId('objectClass').value;
    var validationType=null;
    if (dojo.byId('dynamicFilterId'+idFilter)) {  		
  		var param="&idFilter="+idFilter+"&filterObjectClass="+objectClass;
  		loadDialog('dialogDynamicFilter', null, true, param, true);
  		globalSelectFilterContenLoad=contentLoad;
  		globalSelectFilterContainer=container;
  		validationType='selectFilter'; // will avoid immediate refresh
  	}
    if(typeof contentLoad != 'undefined' && typeof container != 'undefined'){
      loadContent("../tool/selectStoredFilter.php?idFilter=" + idFilter
          + "&context=" + context + "&contentLoad="+contentLoad+"&container="+container+"&filterObjectClass="
          + objectClass + compUrl, "directFilterList", null,false,validationType);
      if (!dojo.byId('dynamicFilterId'+idFilter)) loadContent(contentLoad, container);
    }else{
      loadContent("../tool/selectStoredFilter.php?idFilter=" + idFilter
          + "&context=" + context + "&filterObjectClass="
          + objectClass + compUrl, "directFilterList", null,false,validationType);
      if (dojo.byId("objectClassList") && dojo.byId("objectClassList").value.substr(0,7)=='Report_') {
        dojo.byId('outMode').value='';
        runReport();
      }
    }
    if(isNewGui){
      dijit.byId('listFilterFilter').closeDropDown();
    }
  } else {
	  if (dojo.byId('filterLogicalOperator') && dojo.byId('filterLogicalOperator').style.display=='none') {
		  	dojo.byId('filterLogicalOperator').style.display='block';
	  }
    loadContent(
        "../tool/selectStoredFilter.php?idFilter=" + idFilter + compUrl,
        "listFilterClauses", "dialogFilterForm", false);
  }

}

function removeStoredFilter(idFilter, nameFilter) {
  var compUrl=(window.top.dijit.byId("dialogDetail").open) ? '&comboDetail=true' : '';
  var action=function() {
    var callBack=function(){clearDivDelayed('saveFilterResult');};
    loadContent("../tool/removeFilter.php?idFilter=" + idFilter + compUrl,
        "listStoredFilters", "dialogFilterForm", false,null,null,null,callBack);
  };
  window.top.showConfirm(i18n("confirmRemoveFilter", new Array(nameFilter)), action);
}

function shareStoredFilter(idFilter, nameFilter) {
  var compUrl=(window.top.dijit.byId("dialogDetail").open) ? '&comboDetail=true' : '';
  loadContent("../tool/shareFilter.php?idFilter=" + idFilter + compUrl,
        "listStoredFilters", "dialogFilterForm", false);
}

function selectDynamicFilter() {	
	for (var i = 0; i < dojo.byId('nbDynamicFilterClauses').value; i++) {
		if (dijit.byId('filterValueList' + i)) {
			if (dijit.byId('filterValueList' + i).get("value")=="") {
				showAlert(i18n('valueNotSelected'));
				return;
			}
		}
		else if (dijit.byId('filterValue' + i)) {
			if (dijit.byId('filterValue' + i).get("value")=="") {
				showAlert(i18n('valueNotSelected'));
				return;
			}
		}
		else if (dijit.byId('filterValueDate' + i)) {
			if (dijit.byId('filterValueDate' + i).get("value")=="") {
				showAlert(i18n('valueNotSelected'));
				return;
			}
		}
	}
	
	var compUrl=(window.top.dijit.byId("dialogDetail").open) ? '?comboDetail=true' : '';
	var callBack=function() {selectDynamicFilterContinue();}
	loadContent("../tool/addDynamicFilterClause.php" + compUrl, "listDynamicFilterClauses",
		      "dialogDynamicFilterForm", false,null,null,null,callBack);
}

function selectDynamicFilterContinue() {
	  if (window.top.dijit.byId('dialogDetail').open) {
	    var doc=window.top.frames['comboDetailFrame'];
	  } else {  
	    var doc=top;
	  }
	  if (dijit.byId('filterNameDisplay')) {
		  dojo.byId('filterName').value=dijit.byId('filterNameDisplay').get('value');
	  }
	  doc.dijit.byId("listFilterFilter").set("iconClass", "dijitButtonIcon iconActiveFilter");
	  if (dojo.byId('objectClassList') && dojo.byId('objectClassList').value) objectClass=dojo.byId('objectClassList').value;
	  else if (dojo.byId("objectClassManual") && dojo.byId("objectClassManual").value) objectClass=dojo.byId("objectClassManual").value;
    else if (dojo.byId('objectClass') && dojo.byId('objectClass').value) objectClass=dojo.byId('objectClass').value;
	  var compUrl='';
	  if (dojo.byId("objectClassManual") && dojo.byId("objectClassManual").value=='Kanban') {
	    compUrl+='&context=directFilterList';
	    compUrl+='&contentLoad=../view/kanbanView.php';
	    compUrl+='&container=divKanbanContainer';
	  }
    doc.loadContent(
        "../tool/displayFilterList.php?context=directFilterList&displayQuickFilter=true&displayQuickFilter=true&filterObjectClass="
            + objectClass+compUrl, "directFilterList", null,
        false, 'returnFromFilter', false);
    
	  if (dojo.byId("objectClassManual") && dojo.byId("objectClassManual").value=='Planning' && ! window.top.dijit.byId('dialogDetail').open) {
      refreshJsonPlanning();
	  } else if (dojo.byId("objectClassManual") && dojo.byId("objectClassManual").value=='Report') {
	    dojo.byId('outMode').value='';runReport();
	  } else if (doc.dojo.byId('objectClassList')) {
      doc.refreshJsonList(doc.dojo.byId('objectClassList').value);
	  } else {
	    doc.refreshJsonList(doc.dojo.byId('objectClass').value);
    }
	  dijit.byId("dialogDynamicFilter").hide();
}

function reportSelectCategory(idCateg) {
  if (isNaN(idCateg)) return;
  loadContent("../view/reportsParameters.php?idReport=", "reportParametersDiv",
      null, false);
  var tmpStore=new dojo.data.ItemFileReadStore(
      {
        url : '../tool/jsonList.php?required=true&listType=list&dataType=idReport&critField=idReportCategory&critValue='
            + idCateg
      });
  var mySelectWidget=dijit.byId("reportsList");
  mySelectWidget.reset();
  var mySelect=dojo.byId("reportsList");
  mySelect.options.length=0;
  var nbVal=0;
  tmpStore.fetch({
    query : {
      id : "*"
    },
    onItem : function(item) {
      mySelect.options[mySelect.length]=new Option(tmpStore.getValue(item,
          "name", ""), tmpStore.getValue(item, "id", ""));
      nbVal++;
    },
    onError : function(err) {
      console.info(err.message);
    }
  });
}

function reportSelectReport(idReport) {
  if (isNaN(idReport)) return;
  dojo.query(".section").removeClass("reportSelected");
  dojo.addClass(dojo.byId('report'+idReport),"reportSelected");
  var height=dojo.byId('mainReportContainer').offsetHeight;
  dijit.byId('listReportDiv').resize({h:height});
  dijit.byId('mainReportContainer').resize();
  loadContent("../view/reportsParameters.php?idReport=" + idReport,
  "reportParametersDiv", null, false);
  //mehdi Ticket #3092
  detailReportDiv.innerHTML = ""; 
  }

// =============================================================================
// = Linked Object by id to main object
// =============================================================================

function addLinkObjectToObject(mainObjectClassName, idOfInstanceOfMainClass, linkObjectClassName) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  if (typeof dojo.byId('linkedObjectId') !== 'undefined') {
    var node = document.getElementById("linkedObjectId");
    while (node.firstChild) node.removeChild(node.firstChild);
  }
  refreshLinkObjectList(0,mainObjectClassName, linkObjectClassName);
  dijit.byId("dialogObject").show();

  dojo.byId("mainObjectClass").value = mainObjectClassName;
  dojo.byId("idInstanceOfMainClass").value = idOfInstanceOfMainClass;
  dojo.byId("linkObjectClassName").value = linkObjectClassName;

  disableWidget('dialogObjectSubmit');
}

function saveLinkObject() {  
  var param="";  
  var nbSelected=0;
  if (dojo.byId("linkedObjectId").value == "") {
      return;
  }
  list=dojo.byId("linkedObjectId");
  if (list.options) {
    selected=new Array();
    for (var i=0; i < list.options.length; i++) {
      if (list.options[i].selected) {
        selected.push(list.options[i].value);
        nbSelected++;
      }
    }
  }  
  param="?linkedObjectId="+selected;
  param+="&mainObjectClass="+dojo.byId('mainObjectClass').value;
  param+="&idInstanceOfMainClass="+dojo.byId('idInstanceOfMainClass').value;
  param+="&linkObjectClassName="+dojo.byId('linkObjectClassName').value;
  loadContent("../tool/saveObjectLinkedByIdToMainObject.php"+param, "resultDivMain", "objectFormDialog", true, 'linkObject');
  dijit.byId('dialogObject').hide();
}

function removeLinkObjectFromObject(mainObjectClassName, linkObjectClassName, idLinkObject, nameLinkObject) {
  var param="?mainObjectClassName="+mainObjectClassName;
  param+="&linkObjectClassName="+linkObjectClassName;
  param+="&idLinkObject="+idLinkObject;

if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }

  actionOK=function() {
    loadContent("../tool/removeObjectLinkedByIdToMainObject.php"+param, "resultDivMain", "objectForm", true, 'linkObject');
  };

  msg=i18n('confirmRemoveLinkObjFromObj') + '<br/>' + nameLinkObject;
  showConfirm(msg, actionOK);
}

function refreshLinkObjectList(selected, mainObjectClassName, linkObjectClassName) {
  var param='';  
  selected = typeof selected !== 'undefined' ? selected : 0;
  mainObjectClassName = typeof mainObjectClassName !== 'undefined' ? mainObjectClassName : '';
  linkObjectClassName = typeof linkObjectClassName !== 'undefined' ? linkObjectClassName : '';
  disableWidget('dialogObjectSubmit');
  var url='../tool/dynamicListObjectLinkedByIdToMainObject.php';
  param='?selected=' + selected;    
  if (mainObjectClassName!='') {
    param+='&mainObjectClass=' + mainObjectClassName;      
  }
  if (linkObjectClassName!='') {
    param+='&linkObjectClassName=' + linkObjectClassName;      
  }
  url+=param;
  loadContent(url, 'dialogObjectList', 'objectForm', false);
  selectLinkObjectItem();
}

function selectLinkObjectItem() {
  var nbSelected=0;
  list=dojo.byId('linkedObjectId');
  if (list.options) {
    for (var i=0; i < list.options.length; i++) {
      if (list.options[i].selected) {
        nbSelected++;
      }
    }
  }
  if (nbSelected > 0) {
    enableWidget('dialogObjectSubmit');
  } else {
    disableWidget('dialogObjectSubmit');
  }
}
function saveChangedStatusObject() {
    list=dojo.byId("changeStatusId");
    if (list.options) {
      selected=0;
      for (var i=0; i < list.options.length; i++) {
        if (list.options[i].selected) {
          selected=list.options[i].value;
          i = list.options.length+10;
        }
      }
      var objectClass = dojo.byId("objectClassChangeStatus").value;
      var objectId = dojo.byId("idInstanceOfClassChangeStatus").value;   
      url = "";
      param="?newStatusId="+selected;
      param+="&objectClass="+objectClass;
      param+="&idInstanceOfClass="+objectId;
      loadContent("../tool/changeObjectStatus.php"+param, "resultDivMain", "objectForm", true, objectClass);
      dijit.byId('dialogChangeStatus').hide();
    }  
}

function selectChangeStatusItem() {
  var nbSelected=0;
  list=dojo.byId('changeStatusId');
  if (list.options) {
    for (var i=0; i < list.options.length; i++) {
      if (list.options[i].selected) {
        nbSelected=1;
        break;
      }
    }
  }
  if (nbSelected > 0) {
    enableWidget('dialogChangeStatusSubmit');
  } else {
    disableWidget('dialogChangeStatusSubmit');
  }
}

function changeObjectStatus(objClass, objId, objTypeId, objStatusId) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  
  // empty select of previous options
  if (typeof dojo.byId('changeStatusId') !== 'undefined') {
    var node = document.getElementById("changeStatusId");
    while (node.firstChild) node.removeChild(node.firstChild);
  }
  
  var param='';
    
  disableWidget('dialogChangeStatusSubmit');
  var url='../tool/dynamicListChangeStatus.php';

  param = '?objectId=' + objId;
  param += '&objectClass=' + objClass;
  param += '&idType=' + objTypeId;
  param += '&idStatus=' + objStatusId;

  url+=param;
  loadContent(url, 'dialogChangeStatusList', 'changeStatusForm', false);
  selectChangeStatusItem();

  dijit.byId("dialogChangeStatus").show();

  dojo.byId("objectClassChangeStatus").value = objClass;
  dojo.byId("idInstanceOfClassChangeStatus").value = objId;
  dojo.byId("idStatusOfInstanceOfClassChangeStatus").value = objStatusId;
  dojo.byId("idTypeOfInstanceOfClassChangeStatus").value = objTypeId;
}

function changeStatusNotification(objId, objStatusId) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  
  if (objStatusId == 1) { newStatusId = 2; } else { newStatusId = 1;}
  param="?newStatusId="+newStatusId;
  param+="&idInstanceOfClass="+objId;

  loadContent("../tool/changeStatusNotification.php"+param, "resultDivMain", "objectForm", true, "Notification");
  refreshNotificationTree(false);
}
 
// =============================================================================
// = Misceallanous
// =============================================================================

var manualWindow=null;
var helpTimer=false;
function showHelp(link) {
  if (helpTimer) return; // avoid double open
  helpTimer=true;
  if (manualWindow) manualWindow.close();
  var objectClass=(dojo.byId('objectClassList'))?dojo.byId('objectClassList'):dojo.byId('objectClass');
  var objectClassManual=dojo.byId('objectClassManual');
  var section='';
  var selectedTab=(dijit.byId('parameterTabContainer'))?dijit.byId('parameterTabContainer').selectedChildWidget.get("id"):null;
  if (objectClassManual) {
    section=objectClassManual.value;
  } else if (objectClass) {
    section=objectClass.value;
  }
  if(link == 'ShortCut'){
    section = link;
  }
  dojo.xhrGet({
    url : "../tool/getManualUrl.php?section=" + section+"&tab="+selectedTab,
    handleAs : "text",
    load : function(data, args) {
      var url=data;
      var name="Manual";
      var attributes='toolbar=yes, titlebar=no, menubar=no, status=no, scrollbars=yes, directories=no, location=no, resizable=yes,'
          + 'height=650, width=1024, top=0, left=0';
      manualWindow=window.open(url, name, attributes);
      manualWindow.focus();
    },
    error : function() {
      consoleTraceLog("Error retrieving Manual URL for section '"+section+"'");
    }
  });
  setTimeout("helpTimer=false;",1000);
  return false;
}
/**
 * Refresh a list (after update)
 */
function refreshList(field, param, paramVal, selected, destination, required, param1, paramVal1,objectClass) {
  var urlList='../tool/jsonList.php?listType=list&dataType=' + field;
  if (param) {
    urlList+='&critField=' + param;
    urlList+='&critValue=' + paramVal;
    if(Array.isArray(paramVal)) {
      urlList += '&critArray=1';
    }
  }
  if (param1) {
    urlList+='&critField1=' + param1;
    urlList+='&critValue1=' + paramVal1;
  }
  if (selected && field!='planning') {
    urlList+='&selected=' + selected;
  }
  if (required || Array.isArray(paramVal)) {
    urlList+='&required=true';
  }
  if (objectClass) urlList+='&objectClass='+objectClass;
  if (destination=='idProjectPlan') {
      urlList+='&withoutLeaveProject=1';
  }
  if (directAccessIndex) {
    urlList += "&directAccessIndex=" + directAccessIndex;
  }
  var datastore=new dojo.data.ItemFileReadStore({
    url : urlList
  });
  
  var store=new dojo.store.DataStore({
    store : datastore
  });
  if (destination) {
    var mySelect=dijit.byId(destination);
  } else {
    var mySelect=dijit.byId(field);
  }
  //mySelect.set('store', store);
  mySelect.set({labelAttr: 'name', store: store, sortByLabel: false});
  store.query({
    id : "*"
  }).then(function(items) {
    if (destination) {
      var mySelect=dijit.byId(destination);
    } else {
      var mySelect=dijit.byId(field);
    }
    if (required && ! selected && ! trim(mySelect.get('value')) ) { // required but no value set : select first
      mySelect.set("value", items[0].id);
    }
    if (selected) { // Check that selected is in the list
      var found=false;
      items.forEach(function(item) {
        if(Array.isArray(selected)==false){
          if(Number.isInteger(selected)==true)selected=selected.toString();
          selectionList=selected.split('_');
        }else{
          selectionList=selected;
        }
        if (selectionList.includes(item.id)) found=true;
      });
      if (! found) mySelect.set("value", items[0].id);
    }
    
    if (field=='planning') {
      mySelect.set("value",selected); 
    }
    if(destination){
      if(destination.substr(0,15)=='filterValueList' || destination=='multipleUpdateValueList') {
        var list=dojo.byId(destination);
        if(Array.isArray(selected)==false){
          if(Number.isInteger(selected)==true)selected=selected.toString();
          selectionList=selected.split('_');
        }else{
          selectionList=selected;
        }
        //while (list.options.length) {list.remove(0);} // Clean combo
        items.forEach(function(item) {
          if (!item.name || item.id==' ' || item.name==selected) {
          } else {
            if (selectionList.indexOf(item.id)>=0 && 1) {
              var found=false;
              for (var i=0;i<list.options.length;i++) { if (list.options[i].value==item.id) found=true; }
              if (!found) {
                var option = document.createElement("option");
                option.text = item.name;
                option.value = item.id;
                option.selected=true;
                list.add(option);
              }
            }
          }
        });
      }
    }
  });
}

function refreshListSpecific(listType, destination, param, paramVal, selected, required) {
  var urlList='../tool/jsonList.php?listType=' + listType;
  if (param) {
    urlList+='&' + param + '=' + paramVal;
  }
  if (selected) {
    urlList+='&selected=' + selected;
  }
  if (required) {
    urlList+='&required=true';
  }
  if (directAccessIndex) {
    urlList += "&directAccessIndex=" + directAccessIndex;
  }
  var datastore=new dojo.data.ItemFileReadStore({
    url : urlList
  });
  var store=new dojo.store.DataStore({
    store : datastore
  });
  store.query({
    id : "*"
  });
  var mySelect=dijit.byId(destination);
  mySelect.set('store', store);
}

function setClientValueFromProject(field, projectId) {
  dojo.xhrGet({
    url : "../tool/getClientValueFromProject.php?idProject=" + projectId,
    handleAs : "text",
    load : function(data, args) {
      client=dijit.byId(field);
      if (client && data) {
        client.set("value", data);
      }
    },
    error : function() {
    }
  });
}

var menuHidden=false;
var menuActualStatus='visible';
var menuDivSize=0;
var menuShowMode='CLICK';
var hideShowMenuInProgress=false;
var hideShowTries=0;
/**
 * Hide or show the Menu (left part of the screen
 */
function hideShowMenu(noRefresh,noStore) {
  if(isNewGui)return;
  var disableSlide=true;
  if (!dijit.byId("leftDiv")) {
    return;
  }
  if (!dijit.byId("leftDiv") || !dijit.byId("centerDiv") || !dijit.byId("leftDiv_splitter")) {
    hideShowTries++;
    if (hideShowTries<10) setTimeout("hideShowMenu();",100);
    return;
  }
  hideShowTries=0;
  hideShowMenuInProgress=true;
  duration=1;
  if (menuActualStatus == 'visible' || !menuHidden) {
    saveDataToSession("hideMenu","YES",true);
    if (!noStore) menuDivSize=dojo.byId("leftDiv").offsetWidth;
    fullWidth=dojo.byId("mainDiv").offsetWidth;
    if (menuDivSize < 2) {
      menuDivSize=dojo.byId("mainDiv").offsetWidth * .2;
    }
    if (disableSlide || !isHtml5()) {
      duration=0;
      dojo.byId('menuBarShow').style.display='block';
      dojo.byId('leftDiv_splitter').style.display='none';
      dijit.byId("leftDiv").resize({
        w : dojo.byId("menuBarShow").offsetWidth
      });
    } else {
      dojox.fx.combine([ dojox.fx.animateProperty({
        node : "leftDiv",
        properties : {
          width : 34
        },
        duration : duration
      }), dojox.fx.animateProperty({
        node : "centerDiv",
        properties : {
          left : 45,
          width : fullWidth
        },
        duration : duration
      }), dojox.fx.animateProperty({
        node : "leftDiv_splitter",
        properties : {
          left : 31
        },
        duration : duration
      }) ]).play();
      setTimeout("dojo.byId('menuBarShow').style.display='block'", duration);
      setTimeout("dojo.byId('leftDiv_splitter').style.display='none';",duration);
    }
    menuHidden=true;
    menuActualStatus='hidden'; 
    dojo.byId('hideMenuBarShowButton2').style.display='none';
  } else {
    saveDataToSession("hideMenu","NO",true);  
    if (menuDivSize < 20) {
      menuDivSize=dojo.byId("mainDiv").offsetWidth * .2;
    }
    if (disableSlide || !isHtml5()) {
      duration=0;
      dijit.byId("leftDiv").resize({
        w : menuDivSize
      });
      dojo.byId('menuBarShow').style.display='none';
      dojo.byId('leftDiv_splitter').style.left='20px';
      dojo.byId('leftDiv_splitter').style.display='block';
    } else {
      dojox.fx.combine([ dojox.fx.animateProperty({
        node : "leftDiv",
        properties : {
          width : menuDivSize
        },
        duration : duration
      }), dojox.fx.animateProperty({
        node : "centerDiv",
        properties : {
          left : menuDivSize + 5
        },
        duration : duration
      }), dojox.fx.animateProperty({
        node : "leftDiv_splitter",
        properties : {
          left : menuDivSize
        },
        duration : duration
      }) ]).play();
      dojo.byId('menuBarShow').style.display='none';
      dojo.byId('leftDiv_splitter').style.left='20px';
      dojo.byId('leftDiv_splitter').style.display='block';
    }
    menuHidden=false;
    menuActualStatus='visible';
    dojo.byId('hideMenuBarShowButton2').style.display='block';
  }
  setTimeout('dijit.byId("globalContainer").resize();', duration + 10);
  var detailHidden=false;
  if (dojo.byId('detailBarShow') && dojo.byId('detailBarShow').style.display=='block') detailHidden=true;
  if (!noRefresh && !formChangeInProgress && dojo.byId('id') && dojo.byId('id').value && !detailHidden) {
    setTimeout('loadContent("objectDetail.php", "detailDiv", "listForm");',
        duration + 50);
  }
  setTimeout("hideShowMenuInProgress=false;",duration+50);
  dojo.byId("hideMenuBarShowButton2").style.left=dojo.byId("leftDiv").offsetWidth+3+"px";
}

function hideMenuBarShowMode() {
  hideShowMenu(false);
  dijit.byId("iconMenuUserScreen").closeDropDown();
}

function hideMenuBarShowModeTop(){ 
  if(dojo.byId('statusBarDiv').style.height == '0px'){
    saveDataToSession("hideMenuTop","NO",true);
    dojo.byId('statusBarDiv').style.height="48px";
    dojo.byId('statusBarDiv').style.padding="1px";
    dojo.byId('leftDiv').style.top='82px';
    dojo.byId('centerDiv').style.top='82px';
    dojo.byId('menuBarShow').style.top='82px';
    var height=parseInt(dojo.byId('mainDiv').offsetHeight)-82;
    dijit.byId('centerDiv').resize({h:height});
    dijit.byId('leftDiv').resize({h:height});
    if(dojo.byId('menuBarShow').style.display=='none' || dojo.byId('menuBarShow').style.display == ''){
      dojo.byId('leftDiv_splitter').style.top='82px';
      var height = dojo.byId("leftDiv").offsetHeight+50;
      dojo.byId('leftDiv_splitter').style.height=height+'px';
    }
  }else{
    saveDataToSession("hideMenuTop","YES",true);
    //dojo.byId('statusBarDiv').style.display='none';
    dojo.byId('statusBarDiv').style.height="0px";
    dojo.byId('statusBarDiv').style.padding="0px";
    dojo.byId('leftDiv').style.top='30px';
    dojo.byId('centerDiv').style.top='30px';
    dojo.byId('menuBarShow').style.top='30px';
    var height=parseInt(dojo.byId('mainDiv').offsetHeight)-30;
    dijit.byId('centerDiv').resize({h:height});
    dijit.byId('leftDiv').resize({h:height});
    if(dojo.byId('menuBarShow').style.display=='none' || dojo.byId('menuBarShow').style.display == '' ){
      dojo.byId('leftDiv_splitter').style.top='32px';
      var height = dojo.byId("leftDiv").offsetHeight;
      dojo.byId('leftDiv_splitter').style.height=height+'px';
    }
    if(switchedMode==true){
      switchModeOn();
    }
  }
  dijit.byId("iconMenuUserScreen").closeDropDown();
}

function menuClick() {
  if (menuHidden) {
    menuHidden=false;
    hideShowMenu(true);
    menuHidden=true;
  }
}

var switchedMode=false;
var loadingContentDiv=false;
var listDivSize=0;
var switchedVisible='';
var switchListMode='CLICK';

function switchModeOn(objectIdScreen){
  switchedMode=true;
  if (!dojo.byId("listDiv")) {
    if (listDivSize == 0) {
      listDivSize=dojo.byId("centerDiv").offsetHeight * .4;
    }
    return;
  } else {
    listDivSize=dojo.byId("listDiv").offsetHeight;
  }
  if (dojo.byId('listDiv_splitter')) {
    dojo.byId('listDiv_splitter').style.display='none';
  }
  if (dijit.byId('id')) {
    hideList();
  } else {
    loadingContentDiv=false;
    showList();
  }
}

function switchModeOff(){
  switchedMode=false;
  if (!dojo.byId("listDiv")) {
    return;
  }
  if (dojo.byId('listBarShow')) {
    dojo.byId('listBarShow').style.display='none';
  }
  if (dojo.byId('detailBarShow')) {
    dojo.byId('detailBarShow').style.display='none';
  }
  if (dojo.byId('listDiv_splitter')) {
    dojo.byId('listDiv_splitter').style.display='block';
  }
  if (listDivSize == 0) {
    listDivSize=dojo.byId("centerDiv").offsetHeight * .4;
  }
  dijit.byId("listDiv").resize({
    h : listDivSize
  });
  dijit.byId("mainDivContainer").resize();
}

function switchModeLayout(paramToSend,notGlobal){
  var switchModePassedToFalse=false;
  if(dojo.byId('objectClass')){
    var currentObject=dojo.byId('objectClass').value;
    var currentScreen=(dojo.byId('objectClassManual'))?dojo.byId('objectClassManual').value:'Object';
  }else{
    return;
  }
  if(checkFormChangeInProgress()){
    return;
  }
  var objectIdScreen=dojo.byId('objectId').value;
  var currentItem=historyTable[historyPosition];
  if (currentItem && currentItem!='undefined' && currentItem.length>2) currentScreen=currentItem[2];
  if(currentScreen=='Reports'){
    return false;
  }
  if (paramToSend=='top' || paramToSend=='left'){
      var screen=(dojo.byId('objectClassManual'))?currentScreen  : currentObject;
      var paramDiv=(!notGlobal)?'paramScreen':'paramScreen_'+screen;
      if(switchedMode==true){
        paramDiv='paramScreen';
        notGlobal=false;
        switchModeOff();
      }
      switchModeLoad(currentScreen,currentObject,paramDiv,paramToSend,objectIdScreen,notGlobal);
  }else if(paramToSend=='bottom' || paramToSend=='trailing'){
    var screen=(dojo.byId('objectClassManual'))?currentScreen  : currentObject;
    var paramDiv=(!notGlobal)?'paramRightDiv':'paramRightDiv_'+screen;
    switchModeLoad(currentScreen,currentObject,paramDiv,paramToSend,objectIdScreen,notGlobal);
  }else if(paramToSend=='col' || paramToSend=='tab'){
    var paramDiv='paramLayoutObjectDetail';
    switchModeLoad(currentScreen,currentObject,paramDiv,paramToSend,objectIdScreen,notGlobal);
  }else if (paramToSend=='switch'){
    notGlobal=false;
    var paramDiv='paramScreen';
    if(objectIdScreen!=null){
      loadingContentDiv=true;
    }
    switchModeLoad(currentScreen,currentObject,paramDiv,paramToSend,objectIdScreen,notGlobal);
    switchModeOn(objectIdScreen);
  }
  dijit.byId('iconMenuUserScreen').closeDropDown();
}

function switchModeLoad(currentScreen,currentObject,paramDiv,paramToSend,objectIdScreen,notGlobal){
  //var urlParams="?objectClass="+ currentObject+"&"+paramDiv+"="+paramToSend+"&objectId="+objectIdScreen;
  var notGlob=(notGlobal)?"&notGlobal=true":"&notGlobal=false";
  var urlParams="?"+paramDiv+"="+paramToSend;
  if (currentObject) urlParams+="&objectClass="+ currentObject;
  if (objectIdScreen) urlParams+="&objectId="+objectIdScreen;
  var urlPage="objectMain.php";
  if(currentScreen=='Planning'){
    urlPage="planningMain.php";
  }else if(currentScreen=='GlobalPlanning'){
    urlPage="globalPlanningMain.php";
  }else if(currentScreen=='PortfolioPlanning' ){
    urlPage="portfolioPlanningMain.php";
  }else if(currentScreen=='ResourcePlanning') {
    urlPage="resourcePlanningMain.php";
  }else if(currentScreen=='VersionsPlanning') {
    var productVersionsListId=dojo.byId('productVersionsListId').value;
    urlPage="versionsPlanningMain.php";
    urlParams+="&productVersionsListId="+productVersionsListId;
  }else if(currentScreen=='ContractGantt') {
    urlPage="contractGanttMain.php";
  }else if(currentScreen=='HierarchicalBudget') {
    urlPage="hierarchicalBudgetMain.php";
  }
  if(urlPage!="objectMain.php"){
    currentObject=currentScreen;
  }
  var callBack=null;
  if(objectIdScreen !=''){
    callBack=function(){loadContent("objectDetail.php", "detailDiv", 'listForm');};
  }
  if (dojo.byId('objectClass') && (dojo.byId('objectClass').value || urlPage!="objectMain.php")) {loadContent(urlPage+urlParams+notGlob, "centerDiv",null,null,null,null,null,callBack);}
  if(!notGlobal)loadDiv("menuUserScreenOrganization.php?currentScreen="+currentScreen+"&"+paramDiv+"="+paramToSend,"mainDivMenu");
}

var switchModeSkipAnimation=true;
function showList(mode, skipAnimation) {
  duration=300;
  if (switchModeSkipAnimation) {
    skipAnimation=true;
    duration=0;
  }
  if (mode == 'mouse' && switchListMode == 'CLICK')
    return;
  if (!switchedMode) {
    return;
  }
  if (!dijit.byId("listDiv") || !dijit.byId("mainDivContainer")) {
    return;
  }
  if (dojo.byId('listDiv_splitter')) {
    setTimeout("dojo.byId('listDiv_splitter').style.display='none';",duration+50);
  }
  if (dojo.byId('listBarShow')) {
    setTimeout("dojo.byId('listBarShow').style.display='none';",duration+50);
  }
  correction=0;
  if (dojo.byId("listDiv").offsetHeight > 100)
    correction=5;
  fullSize=dojo.byId("listDiv").offsetHeight
      + dojo.byId("contentDetailDiv").offsetHeight -20+correction;
  if (skipAnimation || !isHtml5()) {
    dijit.byId("listDiv").resize({
      h : fullSize
    });
    duration=0;
  } else {
    dojox.fx.animateProperty({
      node : "listDiv",
      properties : {
        height : fullSize
      },
      duration : duration
    }).play();
  }
  if (dojo.byId('detailBarShow')) {
    setTimeout("dojo.byId('detailBarShow').style.display='block';",
        duration + 50);
  }
  resizeContainer("mainDivContainer", duration);
  switchedVisible='list';
}

function hideList(mode, skipAnimation) {
  duration=300; 
  if (mode == 'mouse' && switchListMode == 'CLICK'){
    return;
  }
  if (!switchedMode) {
    return;
  }
  if (!dijit.byId("listDiv") || !dijit.byId("mainDivContainer")) {
    return;
  }
  if (skipAnimation && dijit.byId("detailDiv")) {
    dijit.byId("detailDiv").set('content', '');
  }
  if (switchModeSkipAnimation) {
    skipAnimation=true;
    duration=0;
  }
  if (dojo.byId('listDiv_splitter')) {
    dojo.byId('listDiv_splitter').style.display='none';
  }
  if (dojo.byId('listBarShow')) {
    setTimeout("dojo.byId('listBarShow').style.display='block';",duration+50);
  }
  if (dojo.byId('detailBarShow')) {
    setTimeout("dojo.byId('detailBarShow').style.display='none';",duration+50);
  }
  if (!isHtml5() || skipAnimation) {
    dijit.byId("listDiv").resize({
      h : 20
    });
    duration=0;
  } else {
    dojox.fx.combine([ dojox.fx.animateProperty({
      node : "listDiv",
      properties : {
        height : 20
      },
      duration : duration
    }) ]).play();
  }
  resizeContainer("mainDivContainer", duration);
  switchedVisible='detail';
}

function resizeContainer(container, duration) {
  sequ=10;
  if (!dijit.byId(container)) return;
  if (duration) {
    for (var i=0; i < sequ; i++) {
      setTimeout('dijit.byId("' + container + '").resize();', i * duration / sequ);
    }
  }
  setTimeout('dijit.byId("' + container + '").resize();', duration + 10);
}

function listClick() {
  stockHistory(dojo.byId('objectClass').value, dojo.byId('objectId').value);
  if (!switchedMode ) {
    return;
  }
  setTimeout("hideList(null,true);", 1);
}

function consoleLogHistory(msg) {
  consoleTraceLog('====='+msg+'==== ('+historyTable.length+')');
  if (historyTable.length==0) {
    consoleTraceLog(msg+' => Empty');
  }
  for (var i=0;i<historyTable.length;i++) {
    current=historyTable[i];
    consoleTraceLog(msg+' => '+current[0]+ ' | '+current[1]+' | '+current[2]);
  }
}

function stockHistory(curClass, curId, currentScreen) {
  if (!currentScreen) {
    currentScreen="object";
    if (dojo.byId("objectClassManual")){
      currentScreen=dojo.byId("objectClassManual").value;
    }
  }
  if (dojo.byId('objectClassList') && dojo.byId('objectClassList').value=='GlobalView' && curId) {
    curId=curClass+'|'+parseInt(curId);
    curClass=dojo.byId('objectClassList').value;
  }
  if (historyPosition>=0) {
    current=historyTable[historyPosition];
    if (current[0]==curClass && current[1]==curId && current[2]==currentScreen) return; // do not re-stock current item
    if (current[0]==curClass && current[1]==null && current[2]==currentScreen) historyPosition-=1; // previous is same class but with no selection, will overwrite
  }
  historyPosition+=1;
  historyTable[historyPosition]=new Array(curClass, curId,currentScreen);
  // Purge next history (not valid any more)
  for (var i=historyPosition+1;i<historyTable.length;i++) {
    historyTable.splice(i,1); 
  }
  if (historyPosition > 0) {
    enableWidget('menuBarUndoButton');
  }
  if (historyPosition == historyTable.length - 1) {
    disableWidget('menuBarRedoButton');
  }
}

function undoItemButton(curClass,curId) {
  if (checkFormChangeInProgress()) {
    return ;
  }
  var len=historyTable.length;
  if (len == 0) {
    return;
  }
  if (historyPosition == 0) {
    return;
  }
  historyPosition-=1;
  var currentItem=historyTable[historyPosition];
  var currentScreen=currentItem[2];
  var target="";
  if (currentScreen=="object" && currentItem[1]!=null){
    gotoElement(currentItem[0], currentItem[1], true, false, currentScreen);
  }else if (currentScreen=="object") {
    loadContent("objectMain.php?objectClass=" + currentItem[0],"centerDiv");
    //gautier #3413
  } else if (currentScreen=="Planning" && currentItem[1]!=null){ 
    gotoElement(currentItem[0], currentItem[1], false, false, "planning");
  }else if(currentScreen=='GanttSupplierContract' || currentScreen=='GanttClientContract'){
    if(currentScreen=='GanttClientContract'){
      loadMenuBarItem('GanttClientContract','menuGanttClientContract','bar');
    }else{
      loadMenuBarItem('GanttSupplierContract','menuGanttSupplierContract','bar');
    }
  }else if (currentScreen=='ContractGantt') {
    dojo.byId('objectClass').value=currentItem[0];
    loadContent('contractGanttMain.php?objectClass='+currentItem[0]+'&objectId='+currentItem[1], 'centerDiv');
    dojo.byId('objectClass').value = currentItem[0];
    dojo.byId('objectId').value = currentItem[1];
    loadContent('objectDetail.php', 'detailDiv', 'listForm');
    loadContentStream();
  }else if(currentScreen=='ConsultationValidation'){
    loadMenuBarItem('ConsultationValidation','menuConsultationValidation','bar');
  }else if(currentScreen=='ViewAllSubTask'){
    loadMenuBarItem('ViewAllSubTask','menuViewAllSubTask','bar');
  }else {
    target=getTargetFromCurrentScreen(currentScreen);
    loadContent(target,"centerDiv"); 
  }
  enableWidget('menuBarRedoButton');
  if (historyPosition == 0) {
    disableWidget('menuBarUndoButton');
  }
  selectIconMenuBar(currentItem[0]);
  if(isNewGui){
    refreshSelectedMenuLeft('menu'+currentItem[0]);
    refreshSelectedItem(currentItem[0], defaultMenu);
  }
}

function getTargetFromCurrentScreen(currentScreen){
  if (currentScreen=="Administration" || currentScreen=="Admin"){ 
    target="admin.php";
  } else if (currentScreen=="Import" || currentScreen=="ImportData"){ 
    target="importData.php";
  } else if (currentScreen=="DashboardTicket") {
    target="dashboardTicketMain.php";
  } else if (currentScreen=="DashboardRequirement") { //ADD qCazelles - Requirements dashboard - Ticket 90
	target="dashboardRequirementMain.php";
  } else if (currentScreen=="ActivityStream") {
    target="activityStreamMain.php";
  } else if (currentScreen=="Plugin"){ 
    target="pluginManagement.php";
  }else if (currentScreen=="Today"){ 
    target="today.php";
  } else if (currentScreen=="Kanban"){ 
    target="kanbanViewMain.php";
  } else if (currentScreen=="UserParameter") {
    target="parameter.php?type=userParameter";
  } else if (currentScreen=="ProjectParameter") {
    target="parameter.php?type=projectParameter";
  } else if (currentScreen=="GlobalParameter") {
    target="parameter.php?type=globalParameter";
  } else if (currentScreen=="Habilitation") {
    target="parameter.php?type=habilitation";
  } else if (currentScreen=="HabilitationReport") {
    target="parameter.php?type=habilitationReport";
  } else if (currentScreen=="HabilitationOther") {
    target="parameter.php?type=habilitationOther";
  } else if (currentScreen=="AccessRight") {
    target="parameter.php?type=accessRight";
  } else if (currentScreen=="AccessRightNoProject") {
    target="parameter.php?type=accessRightNoProject";
  } else if (pluginMenuPage['menu'+currentScreen]) {
    target=pluginMenuPage['menu'+currentScreen];
  } else {
    target=currentScreen.charAt(0).toLowerCase()+currentScreen.substr(1)+"Main.php";
  }
  return target;
}

function getTargetFromCurrentScreenChangeLang(currentScreen){
  if (currentScreen=="Administration" || currentScreen=="Admin"){ 
    target="admin.php";
  } else if (currentScreen=="Import" || currentScreen=="ImportData"){ 
    target="importData.php";
  } else if (currentScreen=="DashboardTicket") {
    target="dashboardTicketMain.php";
  } else if (currentScreen=="DashboardRequirement") { //ADD qCazelles - Requirements dashboard - Ticket 90
    target="dashboardRequirementMain.php";
  } else if (currentScreen=="ActivityStream") {
    target="activityStreamMain.php";
  } else if (currentScreen=="PlannedWorkManual") {
    target="plannedWorkManualMain.php";
  } else if (currentScreen=="Today"){ 
    target="today.php";
  } else {
    target="parameter.php";
  }
  return target;
}

function redoItemButton() {
  if (checkFormChangeInProgress()) {
    return ;
  }
  var len=historyTable.length;
  if (len == 0) {
    return;
  }  
  if (historyPosition == len - 1) {
    return;
  }
  historyPosition+=1;
  
  var currentItem=historyTable[historyPosition];
  var currentScreen=currentItem[2];
  var target="";
  if (currentScreen=="object" && currentItem[1]!=null){
    gotoElement(currentItem[0], currentItem[1], true, false, currentScreen);
  } else if (currentScreen=="object") {
    loadContent("objectMain.php?objectClass=" + currentItem[0],"centerDiv");
  //gautier
  } else if (currentScreen=="Planning" && currentItem[1]!=null){ 
    gotoElement(currentItem[0], currentItem[1], false, false, "planning");
  }else if(currentScreen=='GanttSupplierContract' || currentScreen=='GanttClientContract'){
    if(currentScreen=='GanttClientContract'){
      loadMenuBarItem('GanttClientContract','menuGanttClientContract','bar');
    }else{
      loadMenuBarItem('GanttSupplierContract','menuGanttSupplierContract','bar');
    }
  }else if (currentScreen=='ContractGantt') {
    dojo.byId('objectClass').value=currentItem[0];
    loadContent('contractGanttMain.php?objectClass='+currentItem[0]+'&objectId='+currentItem[1], 'centerDiv');
    dojo.byId('objectClass').value = currentItem[0];
    dojo.byId('objectId').value = currentItem[1];
    loadContent('objectDetail.php', 'detailDiv', 'listForm');
    loadContentStream();
  }else {
    target=getTargetFromCurrentScreen(currentScreen);
    loadContent(target,"centerDiv"); 
  }
  enableWidget('menuBarUndoButton');
  if(isNewGui){
    refreshSelectedMenuLeft('menu'+currentItem[0]);
  }
  if (historyPosition == (len - 1)) {
    disableWidget('menuBarRedoButton');
  }
  selectIconMenuBar(currentItem[0]);
  getTargetFromCurrentScreen(currentScreen);
}

var quickSearchStockId=null;
var quickSearchStockName=null;
var quickSearchIsOpen=false;

function quickSearchOpen() {
  dojo.style("quickSearchDiv", "display", "block");
  if (dijit.byId("listTypeFilter")) {
    dojo.style("listTypeFilter", "display", "none");
  }
  if (dijit.byId("listClientFilter")) {
    dojo.style("listClientFilter", "display", "none");
  }
  if (dijit.byId("listElementableFilter")) {
    dojo.style("listElementableFilter", "display", "none");
  }
  quickSearchStockId=dijit.byId('listIdFilter').get("value");
  if (dijit.byId('listNameFilter')) {
    quickSearchStockName=dijit.byId('listNameFilter').get("value");
    dojo.style("listNameFilter", "display", "none");
    dijit.byId('listNameFilter').reset();
  }
  dijit.byId('listIdFilter').reset();
  dojo.style("listIdFilter", "display", "none");
  dijit.byId("quickSearchValue").reset();
  dijit.byId("quickSearchValue").focus();
  quickSearchIsOpen=true;
}

function quickSearchClose() {
  quickSearchIsOpen=false;
  dojo.style("quickSearchDiv", "display", "none");
  if (dijit.byId("listTypeFilter")) {
    dojo.style("listTypeFilter", "display", "block");
  }
  if (dijit.byId("listClientFilter")) {
    dojo.style("listClientFilter", "display", "block");
  }
  if (dijit.byId("listElementableFilter")) {
    dojo.style("listElementableFilter", "display", "block");
  }
  dojo.style("listIdFilter", "display", "block");
  if (dijit.byId('listNameFilter')) {
    dojo.style("listNameFilter", "display", "block");
    dijit.byId('listNameFilter').set("value", quickSearchStockName);
  }
  dijit.byId("quickSearchValue").reset();
  dijit.byId('listIdFilter').set("value", quickSearchStockId);
  var objClass=(dojo.byId('objectClassList'))?dojo.byId('objectClassList').value:dojo.byId('objectClass').value;
  refreshJsonList(objClass);
}

function quickSearchCloseQuick() {
  dijit.byId("quickSearchValueQuick").reset();
  var objClass=(dojo.byId('objectClassList'))?dojo.byId('objectClassList').value:dojo.byId('objectClass').value;
  refreshJsonList(objClass);
}
function quickSearchExecute() {
  if (!quickSearchIsOpen) {
    return;
  }
  if (!dijit.byId("quickSearchValue").get("value")) {
    showInfo(i18n('messageMandatory', new Array(i18n('quickSearch'))));
    return;
  }
  var objClass=(dojo.byId('objectClassList'))?dojo.byId('objectClassList').value:dojo.byId('objectClass').value;
  refreshJsonList(objClass);
}

function quickSearchExecuteQuick() {
  if (!dijit.byId("quickSearchValueQuick").get("value")) {
    showInfo(i18n('messageMandatory', new Array(i18n('quickSearch'))));
    return;
  }
  var objClass=(dojo.byId('objectClassList'))?dojo.byId('objectClassList').value:dojo.byId('objectClass').value;
  refreshJsonList(objClass);
}

/*
 * ========================================== 
 * Copy functions
 * ==========================================
 */

function copyObject(objectClass) {
  dojo.byId("copyButton").blur();
  action=function() {
    unselectAllRows('objectGrid');
    loadContent("../tool/copyObject.php", "resultDivMain", 'objectForm', true);
  };
  showConfirm(i18n("confirmCopy", new Array(i18n(objectClass),
      dojo.byId('id').value)), action);
}

function copyLinkTo(objectClass) {
  dojo.byId("copyButton").blur();
  action=function() {
    unselectAllRows('objectGrid');
    loadContent("../tool/copyObject.php", "linkRef2Id", 'objectForm', true);
  };
  showConfirm(i18n("confirmCopy", new Array(i18n(objectClass),
      dojo.byId('id').value)), action);
}

function copyObjectToShowStructure() {
  if (dojo.byId('copyClass').value == 'Activity'
      && copyableArray[dijit.byId('copyToClass').get('value')] == 'Activity') {
    dojo.byId('copyWithStructureDiv').style.display='block';
  } else {
    dojo.byId('copyWithStructureDiv').style.display='none';
  }
}

function copyObjectToSubmit(objectClass) {
  var formVar=dijit.byId('copyForm');
  if (!formVar.validate()) {
    showAlert(i18n("alertInvalidForm"));
    return;
  }
  unselectAllRows('objectGrid');
  loadContent("../tool/copyObjectTo.php", "resultDivMain", 'copyForm', true,
      'copyTo');
  dijit.byId('dialogCopy').hide();
}

function copyDocumentToSubmit(objectClass) {
  loadContent("../tool/copyDocumentTo.php", "resultDivMain", 'copyDocumentForm', true );
  dijit.byId('dialogCopyDocument').hide();
}

function copyProjectToSubmit(objectClass) {
  var formVar=dijit.byId('copyProjectForm');
  if (!formVar.validate()) {
    showAlert(i18n("alertInvalidForm"));
    return;
  }
  unselectAllRows('objectGrid');
  loadContent("../tool/copyProjectTo.php", "resultDivMain", 'copyProjectForm',
      true, 'copyProject');
  dijit.byId('dialogCopy').hide();
}

function copyProjectStructureChange() {
  var cpStr=dijit.byId('copyProjectStructure');
  if (cpStr) {
    if (!cpStr.get('checked')) {
      dijit.byId('copyProjectAssignments').set('checked', false);
      dijit.byId('copyProjectAssignments').set('readOnly', 'readOnly');
    } else {
      dijit.byId('copyProjectAssignments').set('readOnly', false);
    }
  }
}

function selectIconMenuBar(menuClass){
	var icon = dojo.byId('iconMenuBar'+menuClass);
	dojo.query('.menuBarItem').removeClass('menuBarItemSelected', icon);
	if (icon && dojo.hasClass(icon,'menuBarItem')){
		dojo.addClass(icon,'menuBarItemSelected');
	}
}

function loadMenuBarObject(menuClass, itemName, from) {
  if (checkFormChangeInProgress()) {
    return false;
  }
  currentPluginPage=null;
  if (from == 'bar' && !isNewGui) {
    selectTreeNodeById(dijit.byId('menuTree'), menuClass);
  }
  hideResultDivs();
  cleanContent("detailDiv");
  formChangeInProgress=false;
  var objectExist='true';
  var currentScreen=menuClass; 
  loadContent("objectMain.php?objectClass=" + currentScreen, "centerDiv"); 
  loadDiv("menuUserScreenOrganization.php?currentScreen="+currentScreen+'&objectExist='+objectExist,"mainDivMenu");
  stockHistory(currentScreen,null,"object");
  selectIconMenuBar(menuClass);
  if(isNewGui){
	  refreshSelectedItem(menuClass, defaultMenu);
	  if(defaultMenu == 'menuBarRecent'){
		  menuNewGuiFilter(defaultMenu, menuClass);
	  }
	  editFavoriteRow(true);
  }
  return true;
}

function hideResultDivs(name) {
  name=name || 'resultDivMain';
  if (dojo.byId(name)) {
      dojo.byId(name).style.display='none';
  }
}

function loadMenuBarItem(item, itemName, from) {
  if (checkFormChangeInProgress()) {
    return false;
  }
  currentPluginPage=null;
  if (from == 'bar' && !isNewGui) {
    selectTreeNodeById(dijit.byId('menuTree'), item);
  }
  cleanContent("detailDiv");
  hideResultDivs();
  formChangeInProgress=false;
  var currentScreen=item;
  var objectExist='false';
  if (item == 'Today') {
    loadContent("today.php", "centerDiv");
  } else if (item == 'Planning') {
    objectExist='true';
    vGanttCurrentLine=-1;
    cleanContent("centerDiv");
    loadContent("planningMain.php", "centerDiv");
  } else if (item == 'PortfolioPlanning') {
    objectExist='true';
    vGanttCurrentLine=-1;
    cleanContent("centerDiv");
    loadContent("portfolioPlanningMain.php", "centerDiv");
  } else if (item == 'ResourcePlanning') {
    objectExist='true';
    vGanttCurrentLine=-1;
    cleanContent("centerDiv");
    loadContent("resourcePlanningMain.php", "centerDiv");
  } else if (item == 'GlobalPlanning') {
    objectExist='true';
    vGanttCurrentLine=-1;
    cleanContent("centerDiv");
    loadContent("globalPlanningMain.php", "centerDiv");
  } else if (item == 'HierarchicalBudget') {
	objectExist='true';
    vGanttCurrentLine=-1;
    cleanContent("centerDiv");
    loadContent("hierarchicalBudgetMain.php", "centerDiv");
  } else if (item == 'GanttClientContract' || item == 'GanttSupplierContract') {
    var object="SupplierContract";
    if(item == 'GanttClientContract'){
      object="ClientContract";
    }
    objectExist='true';
    vGanttCurrentLine=-1;
    cleanContent("centerDiv");
    loadContent("contractGanttMain.php?objectClass="+object, "centerDiv");
  } else if (item == 'Imputation') {
    loadContent("imputationMain.php", "centerDiv");
  } else if (item == 'Diary') {
    loadContent("diaryMain.php", "centerDiv");
  } else if (item == 'ActivityStream') {
    loadContent("activityStreamMain.php", "centerDiv");
  } else if (item == 'ImportData') {
    loadContent("importData.php", "centerDiv");
  } else if (item == 'Reports') {
    loadContent("reportsMain.php", "centerDiv");
  } else if (item == 'Absence') {
	    loadContent("absenceMain.php", "centerDiv");
  } else if (item == 'PlannedWorkManual' || item=='ConsultationPlannedWorkManual') {
    var param='false';
    if (item=='ConsultationPlannedWorkManual')param='true';
    loadContent("plannedWorkManualMain.php?readonly="+param, "centerDiv");
  }else if (item == 'ImputationValidation') {
	    loadContent("imputationValidationMain.php", "centerDiv");  
  }else if(item == 'ConsultationValidation'){
    loadContent("consolidationValidationMain.php", "centerDiv");  
  }else if (item == 'ViewAllSubTask') {
    loadContent("viewAllSubTaskMain.php", "centerDiv"); 
  }else if (item == 'AutoSendReport') {
    loadContent("autoSendReportMain.php", "centerDiv"); 
  } else if (item == 'DataCloning') {
		loadContent("dataCloningMain.php", "centerDiv");
  } else if (item == 'DataCloningParameter') {
		loadContent("dataCloningParameterMain.php", "centerDiv");
  } else if (item == 'VersionsPlanning'  ) {
    objectExist='true';
	showDetail('versionsPlanningDetail', false, 'ProductVersion', true);
  }else if(item=='VersionsComponentPlanning'){
    showDetail('versionsComponentPlanningDetail', false, 'ComponentVersion', true);
  }else if (item == 'UserParameter') {
    loadContent("parameter.php?type=userParameter", "centerDiv");
  } else if (item == 'ProjectParameter') {
    loadContent("parameter.php?type=projectParameter", "centerDiv");
  } else if (item == 'GlobalParameter') {
    loadContent("parameter.php?type=globalParameter", "centerDiv");
  } else if (item == 'Habilitation') {
    loadContent("parameter.php?type=habilitation", "centerDiv");
  } else if (item == 'HabilitationReport') {
    loadContent("parameter.php?type=habilitationReport", "centerDiv");
  } else if (item == 'HabilitationOther') {
    loadContent("parameter.php?type=habilitationOther", "centerDiv");
  } else if (item == 'AccessRight') {
    loadContent("parameter.php?type=accessRight", "centerDiv");
  } else if (item == 'AccessRightNoProject') {
    loadContent("parameter.php?type=accessRightNoProject", "centerDiv");
  } else if (item == 'Admin') {
    loadContent("admin.php", "centerDiv");
  } else if (item == 'Plugin' || item == 'PluginManagement') {
    loadContent("pluginManagement.php", "centerDiv");
  } else if (item == 'Calendar') {
    loadContent("objectMain.php?objectClass=CalendarDefinition", "centerDiv");
  } else if (item == 'Gallery') {
    loadContent("galleryMain.php", "centerDiv");
  } else if (item == 'DashboardTicket') {
    loadContent("dashboardTicketMain.php", "centerDiv");
  } else if (item == 'DashboardRequirement') {  //ADD qCazelles - Requirements dashboard - Ticket 90
	loadContent("dashboardRequirementMain.php", "centerDiv");
  } else if (pluginMenuPage && pluginMenuPage['menu'+item]) {
    loadMenuBarPlugin(item, itemName, from);
  } else if(item == "LeaveCalendar"){
      loadContent("leaveCalendar.php", "centerDiv");
  } else if(item == "LeavesSystemHabilitation"){
      loadContent("leavesSystemHabilitation.php", "centerDiv");
  } else if(item == "DashboardEmployeeManager"){
      loadContent("dashboardEmployeeManager.php", "centerDiv");
  } else if(item == "Module"){
    loadContent("moduleView.php", "centerDiv");
  } else if(item == "Kanban"){
    loadContent("kanbanViewMain.php", "centerDiv");
  }else if(item=="DocumentRight"){
    loadContent("documentsRight.php", "centerDiv");
  }else {  
    showInfo(i18n("messageSelectedNotAvailable", new Array(itemName)));
  }
  loadDiv("menuUserScreenOrganization.php?currentScreen="+currentScreen+'&objectExist='+objectExist,"mainDivMenu");
  stockHistory(item,null,currentScreen);
  selectIconMenuBar(item);
  if(isNewGui){
	  refreshSelectedItem(item, defaultMenu);
	  if(defaultMenu == 'menuBarRecent'){
		  menuNewGuiFilter(defaultMenu, item);
	  }
	  editFavoriteRow(true);
  }
  return true;
}

var currentPluginPage=null;
function loadMenuBarPlugin(item, itemName, from) {
  if (checkFormChangeInProgress()) {
    return false;
  }
  if (! pluginMenuPage || ! pluginMenuPage['menu'+item]) {
    showInfo(i18n("messageSelectedNotAvailable", new Array(item.name)));
    return;
  }
  hideResultDivs();
  currentPluginPage=pluginMenuPage['menu'+item];
  loadContent(pluginMenuPage['menu'+item], "centerDiv");
  if(isNewGui){
	  refreshSelectedItem(item, itemName);
	  if(defaultMenu == 'menuBarRecent'){
		  menuNewGuiFilter(defaultMenu, item);
	  }
	  editFavoriteRow(true);
  }
  return currentPluginPage;
}

var customMenuAddRemoveTimeout=null;
var customMenuAddRemoveTimeoutDelay=3000;
var customMenuAddRemoveClass=null;
function customMenuManagement(menuClass) {
  var button=dojo.byId('iconMenuBar'+menuClass);
  offsetbutton=button.offsetLeft+dojo.byId('menuBarVisibleDiv').offsetLeft+dojo.byId('menubarContainer').offsetLeft;
  if ( dojo.hasClass(button,'menuBarCustom') ) {
    clearTimeout(customMenuAddRemoveTimeout);
    dojo.byId('customMenuAdd').style.display='none';
    customMenuAddRemoveClass=menuClass;
    dojo.byId('customMenuRemove').style.left=offsetbutton+'px';
    dojo.byId('customMenuRemove').style.display='block';
    customMenuAddRemoveTimeout=setTimeout("dojo.byId('customMenuRemove').style.display='none';",customMenuAddRemoveTimeoutDelay);
  } else {
    clearTimeout(customMenuAddRemoveTimeout);
    dojo.byId('customMenuRemove').style.display='none';
    customMenuAddRemoveClass=menuClass;
    dojo.byId('customMenuAdd').style.left=offsetbutton+'px';
    dojo.byId('customMenuAdd').style.display='block';
    customMenuAddRemoveTimeout=setTimeout("dojo.byId('customMenuAdd').style.display='none';",customMenuAddRemoveTimeoutDelay);
  }
}

function customMenuAddItem() {
  var param="?operation=add&class="+customMenuAddRemoveClass;
  dojo.xhrGet({
    url : "../tool/saveCustomMenu.php"+param,
    handleAs : "text",
    load : function(data, args) {
    },
  });
  dojo.addClass('iconMenuBar'+customMenuAddRemoveClass,'menuBarCustom');
  if(!isNewGui){
	  dojo.byId('customMenuAdd').style.display='none';
  }else{
	  hideFavoriteTooltip(0, customMenuAddRemoveClass);
  }
}

function customMenuRemoveItem() {
  var param="?operation=remove&class="+customMenuAddRemoveClass;
  dojo.xhrGet({
    url : "../tool/saveCustomMenu.php"+param,
    handleAs : "text",
    load : function(data, args) {
      if (data=='menuBarCustom') {
        dojo.byId('iconMenuBar'+customMenuAddRemoveClass).style.display="none";
      }
    },
  });
  dojo.removeClass('iconMenuBar'+customMenuAddRemoveClass,'menuBarCustom');
  if(!isNewGui){
	  dojo.byId('customMenuRemove').style.display='none';
  }else{
	  hideFavoriteTooltip(0, customMenuAddRemoveClass);
  }
}

function showIconViewSubMenu(comboName){
	var name = comboName+'IconViewSubMenu';
	var offsetLeft=dojo.byId(comboName+'ButtonDetail').offsetLeft;
	if(dojo.byId(name).style.display == 'none'){
		dojo.byId(name).style.left=offsetLeft+'px';
		dojo.byId(name).style.display='block';
	}else{
		dojo.byId(name).style.display='none';
	}
	var val=null;
	if (dijit.byId(comboName)) {
		val=dijit.byId(comboName).get('value');
	}
	if(!val || val == "" || val == " " || val == "*"){
		dojo.byId(comboName+'SubViewItem').style.display='none';
	}
}

var hideIconViewSubMenuTimeOut;
function hideIconViewSubMenu(col){
	var name = col+'IconViewSubMenu';
	if(hideIconViewSubMenuTimeOut){
		clearTimeout(hideIconViewSubMenuTimeOut);
	}
	hideIconViewSubMenuTimeOut=setTimeout("dojo.byId("+name+").style.display='none';",300);
}

// ====================================================================================
// ALERTS
// ====================================================================================
//

// var alertDisplayed=false;
var checkAlertDisplayQuick=false;
function checkAlert() {
  dojo.xhrGet({
    url : "../tool/checkAlertToDisplay.php",
    handleAs : "text",
    load : function(data, args) {
      checkAlertRetour(data);
    },
    error : function() {
      if (alertCheckTime>0) setTimeout('checkAlert();', alertCheckTime * 1000);
    }
  });
}

function checkAlertRetour(data) {
  if (data) {
    if (data.indexOf('name="lastOperation" value="testConnection"')>0 && data.indexOf('name="lastOperationStatus" value="ERROR"')>0) {
      showDisconnectedMessage(data);
    }
    var reminderDiv=dojo.byId('reminderDiv');
    var dialogReminder=dojo.byId('dialogReminder');
    reminderDiv.innerHTML=data;
    if (dojo.byId("cronStatusRefresh") && dojo.byId("cronStatusRefresh").value != "") {
      refreshCronIconStatus(dojo.byId("cronStatusRefresh").value);
    }
    if (dojo.byId("requestRefreshProject")&& dojo.byId("requestRefreshProject").value == "true") {
      refreshProjectSelectorList();
      if (alertCheckTime>0) setTimeout('checkAlert();', alertCheckTime * 1000);
    } else if (dojo.byId("alertNeedStreamRefresh") && dojo.byId("alertNeedStreamRefresh").value>0) {
      loadContent("objectStream.php?onlyCenter=true", "activityStreamCenter", "listForm");
      if (alertCheckTime>0) setTimeout('checkAlert();', alertCheckTime * 1000);
    } else if (dojo.byId('alertType')) {
      if (dojo.byId('alertCount') && dojo.byId('alertCount').value>1) {
        dijit.byId('markAllAsReadButton').set('label',i18n('markAllAsRead',new Array(dojo.byId('alertCount').value)));
        dojo.byId("markAllAsReadButtonDiv").style.display="inline";
      } else {
        dojo.byId("markAllAsReadButtonDiv").style.display="none";
      }
      dojo.style(dialogReminder, {
        visibility : 'visible',
        display : 'inline',
        bottom : '-200px'
      });
      var toColor='#FFCCCC';
      if (dojo.byId('alertType') && dojo.byId('alertType').value == 'WARNING') {
        toColor='#FFFFCC';
      }
      if (dojo.byId('alertType') && dojo.byId('alertType').value == 'INFO') {
        toColor='#CCCCFF';
      }
      var duration=2000;
      if (checkAlertDisplayQuick) duration=200;
      dojo.animateProperty({
        node : dialogReminder,
        properties : {
          bottom : {
            start : -200,
            end : 0
          },
          right : 0,
          backgroundColor : {
            start : '#FFFFFF',
            end : toColor
          }
        },
        duration : duration
      }).play();
    } else {
      if (alertCheckTime>0) setTimeout('checkAlert();', alertCheckTime * 1000);
    }
  } else {
    if (alertCheckTime>0) setTimeout('checkAlert();', alertCheckTime * 1000);
  }
  checkAlertDisplayQuick=false;
  if (dojo.byId("alertCount")) {
    if (dojo.byId("alertCount").value>1) {
      checkAlertDisplayQuick=true;
    }
  }
}

function showDisconnectedMessage(data) {
  dojo.byId('disconnectionMessageText').innerHTML=data;
  dojo.byId('disconnectionMessage').style.display='block';
}

function setAlertReadMessage() {
  closeAlertBox();
  if (dojo.byId('idAlert') && dojo.byId('idAlert').value) {
    setAlertRead(dojo.byId('idAlert').value);
  }
}

function setAllAlertReadMessage() {
  checkAlertDisplayQuick=false;
  closeAlertBox();
  setAlertRead('*');
}

function setAlertReadMessageInForm() {
  dijit.byId('readFlag').set('checked', 'checked');
  submitForm("../tool/saveObject.php", "resultDivMain", "objectForm", true);
}

function setAlertRemindMessage() {
  closeAlertBox();
  if (dojo.byId('idAlert') && dojo.byId('idAlert').value) {
    setAlertRead(dojo.byId('idAlert').value, dijit.byId('remindAlertTime').get(
        'value'));
  }
}

function setAlertRead(id, remind) {
  var url="../tool/setAlertRead.php?idAlert=" + id;
  if (remind) {
    url+='&remind=' + remind;
  }
  dojo.xhrGet({
    url : url,
    handleAs : "text",
    load : function(data, args) {
      setTimeout('checkAlert();', 100);
    },
    error : function() {
      setTimeout('checkAlert();', 100);
    }
  });
}

function closeAlertBox() {
  var dialogReminder=dojo.byId('dialogReminder');
  var duration=900;
  if (checkAlertDisplayQuick && dialogReminder) duration=90;
  dojo.animateProperty({
    node : dialogReminder,
    properties : {
      bottom : {
        start : 0,
        end : -200
      }
    },
    duration : duration,
    onEnd : function() {
      if (dojo.byId('dialogReminder')) {
        dialogReminder=dojo.byId('dialogReminder');
        dojo.style(dialogReminder, {
          visibility : 'hidden',
          display : 'none',
          bottom : '-200px'
        });
      }
    }
  }).play();
}

function setReadMessageLegalFollowup(idMessageLegal){
  var param="?idMessageLegal="+idMessageLegal;
  dojo.xhrGet({
    url : "../tool/saveMessageLegalFollowup.php"+param,
    handleAs : "text",
    load : function(data, args) {
    },
  });
}

function setNewGui(idMessageLegal, newGuiActivated){
	var param="?idMessageLegal="+idMessageLegal+"&newGuiActivated="+newGuiActivated;
	  dojo.xhrGet({
	    url : "../tool/saveMessageLegalFollowup.php"+param,
	    handleAs : "text",
	    load : function(data, args) {
	    	if(newGuiActivated){
	    	  showWait();
	          noDisconnect=true;
	          quitConfirmed=true;        
	          dojo.byId("directAccessPage").value="today.php";
	          dojo.byId("directAccessForm").submit();
	    	}
	    },
	  });
}

/*
 * ========================================================================
 * Planning columns management
 * ========================================================================
 */
function openPlanningColumnMgt() {
  // alert("openPlanningColumnMgt");
}

function changePlanningColumn(col, status, order) {
  if (status) {
    // order=planningColumnOrder.indexOf('Hidden'+col);
    order=dojo.indexOf(planningColumnOrder, 'Hidden' + col);
    planningColumnOrder[order]=col;
    movePlanningColumn(col, col);
  } else {
    // order=planningColumnOrder.indexOf(col);
    order=dojo.indexOf(planningColumnOrder, col);
    planningColumnOrder[order]='Hidden' + col;
  } 
  //moveListColumn(); // Removed as sets error 
  if (col=='IdStatus' || col=='Type') {
    validatePlanningColumnNeedRefresh=true;
  }
  setPlanningFieldShow(col,status);
  dojo.xhrGet({
    url : '../tool/savePlanningColumn.php?action=status&status='
        + ((status) ? 'visible' : 'hidden') + '&item=' + col,
    handleAs : "text",
    load : function(data, args) {
    },
    error : function() {
    }
  });
}
function changePlanningColumnWidth(col, width) {
  setPlanningFieldWidth(col,width);
  showWait();
  JSGantt.changeFormat(g.getFormat(), g);
  dojo.xhrGet({
    url : '../tool/savePlanningColumn.php?action=width&width='+width+'&item=' + col,
    handleAs : "text",
    load : function(data, args) {
    },
    error : function() {
    }
  });
  hideWait();
}
var validatePlanningColumnNeedRefresh=false;
function validatePlanningColumn() {
  dijit.byId('planningColumnSelector').closeDropDown();
  showWait();
  setGanttVisibility(g);
  if (validatePlanningColumnNeedRefresh) { 
    refreshJsonPlanning();
  } else {
    JSGantt.changeFormat(g.getFormat(), g);
    hideWait();
  }
  validatePlanningColumnNeedRefresh=false;
}

function movePlanningColumn(source, destination) {
  var mode='';
  var list='';
  var nodeList=dndPlanningColumnSelector.getAllNodes();
  planningColumnOrder=new Array();
  for (var i=0; i < nodeList.length; i++) {
    var itemSelected=nodeList[i].id.substr(14);
    check=(dijit.byId('checkColumnSelector' + itemSelected).get('checked')) ? ''
        : 'hidden';
    list+=itemSelected + "|";
    planningColumnOrder[i]=check + itemSelected;
  }
  //alert(planningColumnOrder);
  
  var url='../tool/movePlanningColumn.php?orderedList=' + list;
  dojo.xhrPost({
    url : url,
    handleAs : "text",
    load : function(data, args) {
    }
  });
  // loadContent(url, "resultDivMain");
}

/*
 * ======================================================================== List
 * columns management
 * ========================================================================
 */

function changeListColumn(tableId, fieldId, status, order) {
  var spinner=dijit.byId('checkListColumnSelectorWidthId' + fieldId);
  spinner.set('disabled', !status);
  dojo.xhrGet({
    url : '../tool/saveSelectedColumn.php?action=status&status='
        + ((status) ? 'visible' : 'hidden') + '&item=' + tableId,
    handleAs : "text",
    load : function(data, args) {
    },
    error : function() {
    }
  });
  recalculateColumnSelectorName();
}

function changeListColumnWidth(tableId, fieldId, width) {
  if (width < 1) {
    width=1;
    dijit.byId('checkListColumnSelectorWidthId' + fieldId).set('value', width);
  } else if (width > 50) {
    width=50;
    dijit.byId('checkListColumnSelectorWidthId' + fieldId).set('value', width);
  }
  dojo.xhrGet({
    url : '../tool/saveSelectedColumn.php?action=width&item=' + tableId
        + '&width=' + width,
    handleAs : "text",
    load : function(data, args) {
    },
    error : function() {
    }
  });
  recalculateColumnSelectorName();
}

function validateListColumn() {
  showWait();
  dijit.byId('listColumnSelector').closeDropDown();
  var callBack=function(){resizeListDiv();};
  loadContent("objectList.php?objectClass=" + dojo.byId('objectClassList').value+ "&objectId="+dojo.byId('objectId').value, 
              "listDiv",null,null,null,null,null,callBack);
}

function resetListColumn() {
  var actionOK=function() {
    showWait();
    dijit.byId('listColumnSelector').closeDropDown();
    dojo.xhrGet({
      url : '../tool/saveSelectedColumn.php?action=reset&objectClass='
          + dojo.byId('objectClassList').value,
      handleAs : "text",
      load : function(data, args) {
        var callBack=function(){resizeListDiv();};
        loadContent("objectList.php?objectClass="+dojo.byId('objectClassList').value+"&objectId="+dojo.byId('objectId').value,
                    "listDiv",null,null,null,null,null,callBack);
      },
      error : function() {
      }
    });
  };
  showConfirm(i18n('confirmResetList'), actionOK);
}

function moveListColumn(source, destination) {
  var mode='';
  var list='';
  var nodeList=dndListColumnSelector.getAllNodes();
  listColumnOrder=new Array();
  for (var i=0; i < nodeList.length; i++) {
    var itemSelected=nodeList[i].id.substr(20);
    // check=(dijit.byId('checkListColumnSelector'+itemSelected).get('checked'))?'':'hidden';
    list+=itemSelected + "|";
    // listColumnOrder[i]=check+itemSelected;
  }  
  // dijit.byId('listColumnSelector').closeDropDown();
  var url='../tool/moveListColumn.php?orderedList=' + list;
  dojo.xhrPost({
    url : url,
    handleAs : "text",
    load : function(data, args) {
    }
  });
  // loadContent(url, "resultDivMain");
  // setGanttVisibility(g);
  // JSGantt.changeFormat(g.getFormat(),g);
  // hideWait();
}

function moveFilterListColumn() {
    var mode='';
    var list='';
    var nodeList=dndListFilterSelector.getAllNodes();
    listColumnOrder=new Array();
    for (i=0; i < nodeList.length; i++) {
      var itemSelected=nodeList[i].id.substr(6);
      list+=itemSelected + "|";
    }  
    
    var callback=function() {
        if (window.top.dijit.byId('dialogDetail').open) {
          var doc=window.top.frames['comboDetailFrame'];
        } else {
          var doc=top;
        }
        if (dojo.byId('objectClassList') && dojo.byId('objectClassList').value){
          var objectClass=dojo.byId('objectClassList').value;
        }else if (! window.top.dijit.byId('dialogDetail').open && dojo.byId("objectClassManual") && dojo.byId("objectClassManual").value){ 
          var objectClass=dojo.byId("objectClassManual").value;
        }else if (dojo.byId('objectClass') && dojo.byId('objectClass').value){
          var objectClass=dojo.byId('objectClass').value;
        } 
        var compUrl=(window.top.dijit.byId("dialogDetail").open) ? '?comboDetail=true' : '';
        if (dojo.byId("objectClassManual") && dojo.byId("objectClassManual").value=='Kanban') {
          compUrl+='&context=directFilterList';
          compUrl+='&contentLoad=../view/kanbanView.php';
          compUrl+='&container=divKanbanContainer';
        }
        doc.loadContent(
            "../tool/displayFilterList.php?context=directFilterList&filterObjectClass="
                + objectClass + compUrl, "directFilterList", null,
           false, 'returnFromFilter', false);
      };
    
    var url='../tool/moveFilterColumn.php?orderedList=' + list;
    dojo.xhrPost({
      url : url,
      handleAs : "text",
      load : function(data, args) {
        if (callback)
          setTimeout(callback, 10);
      }
    });
}

function moveFilterListColumn2() {
  var mode='';
  var list='';
  var nodeList=dndListFilterSelector2.getAllNodes();
  listColumnOrder=new Array();
  for (i=0; i < nodeList.length; i++) {
    var itemSelected=nodeList[i].id.substr(6);
    list+=itemSelected + "|";
  }  
  
  var url='../tool/moveFilterColumn.php?orderedList=' + list;
  dojo.xhrPost({
    url : url,
    handleAs : "text",
    load : function(data, args) {
    }
  });
}

function recalculateColumnSelectorName() {
  cpt=0;
  tot=0;
  while (cpt < 999) {
    var itemSelected=dijit.byId('checkListColumnSelectorWidthId' + cpt);
    if (itemSelected) {
      if (!itemSelected.get('disabled')) {
        tot+=itemSelected.get('value');
      }
    } else {
      cpt=999;
    }
    cpt++;
  }
  if (!dojo.byId('columnSelectorNameFieldId')) return;
  name="checkListColumnSelectorWidthId"+dojo.byId('columnSelectorNameFieldId').value;
  nameWidth=100 - tot;
  color="";
  if (nameWidth < 10) {
    nameWidth=10;
    color="#FFAAAA";
  }
  if (dijit.byId(name)) dijit.byId(name).set('value', nameWidth);
  totWidth=tot + nameWidth;
  totWidthDisplay="";
  if (color) {
    totWidthDisplay='<div style="background-color:' + color + '">' + totWidth
        + '&nbsp;%</div>';
  }
  dojo.byId('columnSelectorTotWidthTop').innerHTML=totWidthDisplay;
  dojo.byId('columnSelectorTotWidthBottom').innerHTML=totWidthDisplay;
  dojo.xhrGet({
    url : '../tool/saveSelectedColumn.php?action=width&item='
        + dojo.byId('columnSelectorNameTableId').value + '&width=' + nameWidth,
    handleAs : "text",
    load : function(data, args) {
    },
    error : function() {
    }
  });
}

// =========================================================
// Items selector
// =========================================================
var oldSelectedItems=null;

function diarySelectItems(value) {
	  if (!oldSelectedItems || oldSelectedItems==value) return;
	  if (oldSelectedItems.indexOf("All")>=0 && value.length>1 ) {
	    value[0]=null;
	    oldSelectedItems=value;
	    dijit.byId("diarySelectItems").set("value",value);
	  } else if (value.indexOf("All")>=0 && oldSelectedItems.indexOf("All")===-1) {
	    value=["All"];
	    oldSelectedItems=value;
	    dijit.byId("diarySelectItems").set("value",value);
	  }
	  var finish=function() {
          loadContent("../view/diary.php","detailDiv","diaryForm");
	  };
	  if (value.length==0) value='none';
	  saveDataToSession('diarySelectedItems', value, true, finish);
	  oldSelectedItems=value;
}

function globalViewSelectItems(value) {
  if (!oldSelectedItems || oldSelectedItems==value) return;
  if (oldSelectedItems.indexOf(" ")>=0 && value.length>1 ) {
    value[0]=null;
    oldSelectedItems=value;
    dijit.byId("globalViewSelectItems").set("value",value);
  } else if (value.indexOf(" ")>=0 && oldSelectedItems.indexOf(" ")===-1) {
    value=[" "];
    oldSelectedItems=value;
    dijit.byId("globalViewSelectItems").set("value",value);
  }
  var finish=function() {
    refreshJsonList("GlobalView");
  };
  if (value.length==0) value='none';
  saveDataToSession('globalViewSelectedItems', value, true, finish);
  oldSelectedItems=value;
}
function globalPlanningSelectItems(value) {
  if (!oldSelectedItems || oldSelectedItems==value) return;
  if (oldSelectedItems.indexOf(" ")>=0 && value.length>1 ) {
    value[0]=null;
    oldSelectedItems=value;
    dijit.byId("globalPlanningSelectItems").set("value",value);
  } else if (value.indexOf(" ")>=0 && oldSelectedItems.indexOf(" ")===-1) {
    value=[" "];
    oldSelectedItems=value;
    dijit.byId("globalPlanningSelectItems").set("value",value);
  }
  var finish=function() {
    refreshJsonPlanning();
  };
  if (value.length==0) value='none';
  saveDataToSession('globalPlanningSelectedItems', value, true, finish);
  oldSelectedItems=value;
}

// =========================================================
// Other
// =========================================================


//    var objectClass=dojo.byId('objectClass').value;
//    var objectId=dojo.byId('objectId').value;
//    var param='';
//    if(objectClass!=null && objectId!=null  &&  dojo.byId('mailRefType') &&  dojo.byId('mailRefId').value){
//      dojo.byId('mailRefType').value=dojo.byId('objectClass').value;
//      dojo.byId('mailRefId').value=dojo.byId('objectId').value;
//       param="&objectClass=" +objectClass+"&objectId=" +objectId;
//    }


function showMailOptions() {
  var callback=function() {
    title=i18n('buttonMail', new Array(i18n(dojo.byId('objectClass').value)));
    if (dijit.byId('attendees')) {
      dijit.byId('dialogMailToOther').set('checked', 'checked');
      dijit.byId('dialogOtherMail').set('value',
          extractEmails(dijit.byId('attendees').get('value')));
      dialogMailToOtherChange();
    }
    dijit.byId("dialogMail").set('title', title);
    refreshListSpecific('emailTemplate', 'selectEmailTemplate','objectIdClass',dojo.byId('objectId').value+'_'+dojo.byId('objectClass').value);
    loadDialog("dialogMail", null, true, '&objectClass='+ dojo.byId('objectClass').value+'&objectId='+dojo.byId('objectId').value);
  }
  if (dijit.byId("dialogMail")
      && dojo.byId('dialogMailObjectClass')
      && dojo.byId('dialogMailObjectClass').value == dojo.byId('objectClass').value) {
    refreshListSpecific('emailTemplate', 'selectEmailTemplate','objectIdClass',dojo.byId('objectId').value+'_'+dojo.byId('objectClass').value);
    loadDialog("dialogMail", null, true, '&objectClass='+ dojo.byId('objectClass').value+'&objectId='+dojo.byId('objectId').value);
  } else {
    var param="&objectClass=" + dojo.byId('objectClass').value+"&objectId=" + dojo.byId('objectId').value;
    loadDialog("dialogMail", callback, false, param);
  }
}

//florent ticket 4442
function showAttachedSize(size,name,id,type){
  var totalSize=dojo.byId('totalSizeNoConvert').value;
  var maxSize=Number(dojo.byId('maxSizeNoconvert').value);
  var attachments=dojo.byId('attachments').value;
  var addAttachments='';
  if(isNaN(size)){
    size=0;
  }
  if(dijit.byId('dialogMail'+name).get('checked')==true){
    totalSize=Number(totalSize)+Number(size);
    if(attachments!=''){
      addAttachments=attachments+'/'+id+'_'+type;
    }else{
      addAttachments=id+'_'+type;
    }
    dojo.byId('attachments').value=addAttachments;
  }else{
    var regex='/'+id+'_'+type;
    if(attachments.indexOf('/'+id+'_'+type)!=-1){
      addAttachments=attachments.replace(regex,'');
    }else{
      regex=id+'_'+type;
      addAttachments=attachments.replace(regex,'');
    }
    dojo.byId('attachments').value=addAttachments;
    totalSize=Number(totalSize)-Number(size);
  }
  var noConvert=totalSize;
  if(totalSize!=0){
    totalSize=octetConvertSize(totalSize);
  }
  if( maxSize < noConvert ){
    dojo.byId('infoSize').style.color="red";
    dojo.byId('totalSize').style.color="red";
  }else if ((maxSize >= noConvert) || noConvert==0) {
    dojo.byId('infoSize').style.color="green";
    dojo.byId('totalSize').style.color="green";
  }
  dojo.byId('totalSizeNoConvert').value=noConvert;
  dojo.byId('totalSize').value=totalSize;
}

function octetConvertSize(octet){
  if(octet!=0 && octet!='-'){
    octet = Math.abs(parseInt(octet, 10));
    var def = [[1, ' octets'], [1024, ' ko'], [1024*1024, ' Mo'], [1024*1024*1024, ' Go'], [1024*1024*1024*1024, ' To']];
    for(var i=0; i<def.length; i++){
      if(octet<def[i][0]) return (octet/def[i-1][0]).toFixed(2)+' '+def[i-1][1];
    }
  }else{
    return i18n('errorNotFoundAttachment');
  }

}

function changeFileSizeMail(name){
  var attachments=dojo.byId('attachments').value;
  var addAttachments='';
  var totalSize=dojo.byId('totalSizeNoConvert').value;
  var maxSize=Number(dojo.byId('maxSizeNoconvert').value);
  var val1=dojo.byId('v1_'+name).value;
  var val2=dojo.byId('v2_'+name).value;
  var id=dojo.byId('addVersion'+name).value;
  var type='DocumentVersion';
  var docVersRef=dojo.byId('idDocRef'+name).value;
  var docVers=dojo.byId('idDoc'+name).value;
  if(dijit.byId('dialogMail'+name).get('checked')==true  ){
    
    if(totalSize!=0){
      size=Number(totalSize)-Number(dojo.byId('filesizeNoConvert'+name).value);
    }
    var regex='/'+id+'_'+type;
    if(attachments.indexOf(regex)==-1){
      regex=id+'_'+type;
    }
    suprAttachments=attachments.replace(regex,'');
    if(dijit.byId('versionRef'+name).get('checked')==true){
      if(suprAttachments!=''){
        addAttachments=suprAttachments+'/'+docVersRef+'_'+type;
      }else{
        addAttachments=docVersRef+'_'+type;
      }
      totalSize=size+Number(val1);
      dojo.byId('filesize'+name).value=octetConvertSize(val1);
      dojo.byId('filesizeNoConvert'+name).value=val1;
      dojo.byId('addVersion'+name).value=docVersRef;
      dojo.byId('attachments').value=addAttachments;
    }else{
      if(suprAttachments!=''){
        addAttachments=suprAttachments+'/'+docVers+'_'+type;
      }else{
        addAttachments=docVers+'_'+type;
      }
      dojo.byId('filesize'+name).value=octetConvertSize(val2);
      dojo.byId('filesizeNoConvert'+name).value=val2;
      dojo.byId('addVersion'+name).value=docVers;
      dojo.byId('attachments').value=addAttachments;
    }
    var noConvert=totalSize;
    if(totalSize!=0){
      totalSize=octetConvertSize(totalSize);
    }
    if( maxSize < noConvert ){
      dojo.byId('infoSize').style.color="red";
      dojo.byId('totalSize').style.color="red";
    }else if ((maxSize >= noConvert) || noConvert==0) {
      dojo.byId('infoSize').style.color="green";
      dojo.byId('totalSize').style.color="green";
    }
    dojo.byId('totalSizeNoConvert').value=noConvert;
    dojo.byId('totalSize').value=totalSize;
  }else{
    if(dijit.byId('versionRef'+name).get('checked')==true){
      dojo.byId('filesize'+name).value=octetConvertSize(val1);
      dojo.byId('filesizeNoConvert'+name).value=val1;
      dojo.byId('addVersion'+name).value=docVersRef;
    }else{
      dojo.byId('filesize'+name).value=octetConvertSize(val2);
      dojo.byId('filesizeNoConvert'+name).value=val2;
      dojo.byId('addVersion'+name).value=docVers;
    }
  }
}

function dialogMailToOtherChange() {
  var show=dijit.byId('dialogMailToOther').get('checked');
  if (show) {
    showField('dialogOtherMail');
    showField('otherMailDetailButton');
  } else {
    hideField('dialogOtherMail');
    hideField('otherMailDetailButton');
  }
}

function mailerTextEditor(code){
  var callBack= function() {
  var codeParam = dojo.byId("codeParam");
  codeParam.value = code;
	var editorType=dojo.byId("mailEditorType").value;
	if (editorType=="CK" || editorType=="CKInline") { // CKeditor type
      ckEditorReplaceEditor("mailEditor",999);
	} else if (editorType=="text") {
      dijit.byId("mailEditor").focus();
      dojo.byId("mailEditor").style.height=(screen.height*0.6)+'px';
      dojo.byId("mailEditor").style.width=(screen.width*0.6)+'px';
    } else if (dijit.byId("mailMessageEditor")) { // Dojo type editor
      dijit.byId("mailMessageEditor").set("class", "input");
      dijit.byId("mailMessageEditor").focus();
      dijit.byId("mailMessageEditor").set("height", (screen.height*0.6)+'px'); // Works on first time
      dojo.byId("mailMessageEditor_iframe").style.height=(screen.height*0.6)+'px'; // Works after first time
    }
	  dojo.byId("mailEditor").innerHTML=dojo.byId(code).value;
  };
  loadDialog('dialogMailEditor', callBack, true, null, true, true);
}

function saveMailMessage() {
  var codeParam = dojo.byId("codeParam").value;
  var editorType=dojo.byId("mailEditorType").value;
  if (editorType=="CK" || editorType=="CKInline") {
    noteEditor=CKEDITOR.instances['mailEditor'];
    noteEditor.updateElement();
    var tmpCkEditor=noteEditor.document.getBody().getText();
    var tmpCkEditorData=noteEditor.getData();
    if (tmpCkEditor.trim()=="" && tmpCkEditorData.indexOf('<img')<=0) {
      var msg=i18n('messageMandatory', new Array(i18n('Message')));
      noteEditor.focus();
      showAlert(msg);
      return;
    }
  } else if (dijit.byId("messageMailEditor")) {
    if (dijit.byId("mailEditor").getValue() == '') {
      dijit.byId("messageMailEditor").set("class", "input required");
      var msg=i18n('messageMandatory', new Array(i18n('Message')));
      dijit.byId("messageMailEditor").focus();
      dojo.byId("messageMailEditor").focus();
      showAlert(msg);
      return;
    }
  } 
  var callBack = function(){
    dojo.byId(codeParam).value = tmpCkEditorData; 
    dojo.byId(codeParam+"_display").innerHTML = tmpCkEditorData;
  };
  loadDiv("../tool/saveParameter.php", "resultDivMain", "parameterForm", callBack);
  dijit.byId('dialogMailEditor').hide();
}

var doNotTriggerEmailChange=false;
function findAutoEmail(){
  if (doNotTriggerEmailChange==true) return;
  var adress=dijit.byId('dialogOtherMail').get('value');
  var regex = /,[ ]*|;[ ]*/gi;
  adress=adress.replace(regex,",");
  dojo.xhrGet({
    url: '../tool/saveFindEmail.php?&isId=false&adress='+adress ,
    load: function(data,args) { 
      var email = data;
      doNotTriggerEmailChange=true;
      dijit.byId('dialogOtherMail').set('value', email);
      doNotTriggerEmailChange=false;
    }
  });
}

function dialogMailIdEmailChange(){
  if (doNotTriggerEmailChange==true) return;
  doNotTriggerEmailChange=true;
  var value = dijit.byId('dialogOtherMail').get('value');
  var id=dijit.byId('dialogMailObjectIdEmail').get('value');
  id = id+','+value;
  dojo.xhrGet({
    url: '../tool/saveFindEmail.php?&isId=true&id='+id,
    load: function(data,args) { 
      var email = data;
      dijit.byId('dialogOtherMail').set('value', email);
      doNotTriggerEmailChange=false;
    }
  });
}
//end

//damian #2936
function stockEmailCurrent(){
	var adress=dijit.byId('dialogOtherMail').get('value');
	var adressSplit = adress.split(',');
	adressSplit.forEach(function(emailSplit) {
		if(stockEmailHistory.indexOf(emailSplit) == -1){
			stockEmailHistory.push(emailSplit);
		}
	});
}

function compareEmailCurrent(){
	if(stockEmailHistory.length > 0){
		var inputEmail=dijit.byId('dialogOtherMail').get('value');
		var split = inputEmail.split(',');
		inputEmail = split[split.length - 1];
		var count = 0;
		var email = "";
		var divCount = 0;
		//var display = '';
		stockEmailHistory.forEach(function(element){
			count++;
			if(split.indexOf(element) <= -1){
				divCount++;
				if(divCount < 0){
					dojo.byId('dialogOtherMailHistorical').style.display = 'none';
				}
				if(element.search(inputEmail) > -1){
					dojo.byId('dialogOtherMailHistorical').style.display = 'block';
					email += '<div class="emailHistorical" id="email'+count+'" style="cursor:pointer;"'
							+'onclick="selectEmailHistorical(\''+element+'\')">'
							+element+'</div>';
					dojo.byId('dialogOtherMailHistorical').innerHTML = email;
				}
			}else{
				divCount--;
			}
			if(divCount > 7){
				dojo.byId('dialogOtherMailHistorical').style.height = '100px';
			}else{
				dojo.byId('dialogOtherMailHistorical').style.height = 'auto';
			}
		});
	}else{
		dojo.byId('dialogOtherMailHistorical').style.display = 'none';
	}
}

function hideEmailHistorical(){
	setTimeout(function(){dojo.byId('dialogOtherMailHistorical').style.display = 'none';},200); 
}

function selectEmailHistorical(email){
	var currentValue = dijit.byId('dialogOtherMail').get("value");
	var tab = currentValue.split(',');
	var tabLength = tab.length;
	var newValue = "";
	if(currentValue != ""){
		if(tabLength>1){
			for(var i = 0; i<tabLength-1; i++){
				if(tab[i].search('@') > -1){
					newValue += tab[i]+',';
				}
			}
		}
		newValue += email+',';
		dijit.byId('dialogOtherMail').set("value", newValue);
	}else{
		dijit.byId('dialogOtherMail').set("value", email+',');
	}
	dojo.byId('dialogOtherMailHistorical').style.display = 'none';
}
//end #2936

function extractEmails(str) {
  var current='';
  var result='';
  var name=false;
  for (var i=0; i < str.length; i++) {
    car=str.charAt(i);
    if (car == '"') {
      if (name == true) {
        name=false;
        current="";
      } else {
        if (current != '') {
          if (result != '') {
            result+=', ';
          }
          result+=trimTag(current);
          current='';
        }
        name=true;
      }
    } else if (name == false) {
      if (car == ',' || car == ';' || car == ' ') {
        if (current != '') {
          if (result != '') {
            result+=', ';
          }
          result+=trimTag(current);
          current='';
        }
      } else {
        current+=car;
      }
    }
  }
  if (current != "") {
    if (result != '') {
      result+=', ';
    }
    result+=trimTag(current);
  }
  return result;
}

function sendMail() {
	var idEmailTemplate = dijit.byId('selectEmailTemplate').get("value");
	if(dojo.byId('maxSizeNoconvert') && dojo.byId('totalSizeNoConvert').value > Number(dojo.byId('maxSizeNoconvert').value)){
	  showAlert(i18n('errorAttachmentSize'));
	  return;
	}else{
	  loadContent("../tool/sendMail.php?className=Mailable&idEmailTemplate="+idEmailTemplate, "resultDivMain",
	      "mailForm", true, 'mail');
	  dijit.byId("dialogMail").hide();
	}
}

// CHANGE BY Marc TABARY - 2017-03-13 - CHANGE TITLE DYNAMIC DIALOG
function loadDialog(dialogDiv, callBack, autoShow, params, clearOnHide, closable, dialogTitle, dialogTitleKeepAsIs) {
  // Before loading, be sure to clear dialogs containing "directAccessToListButton" 
  // This is mandatory as these dialogs may not be cleared on direct access, as they are not showed so .hide() and no effect and clearOnHide is not triggered  
  if (dojo.byId('directAccessToListButton')) {
    var parentName=dojo.byId('directAccessToListButton').parentNode.id;
    var dialogName="dialog"+parentName.substr(0,1).toUpperCase()+parentName.substr(1,parentName.length-5);
    if (dijit.byId(dialogName)){
      dijit.byId(dialogName).set("content",null);
    }
  }
// Old    
//function loadDialog(dialogDiv, callBack, autoShow, params, clearOnHide, closable) {
// END CHANGE BY Marc TABARY - 2017-03-13 - PERIODIC YEAR BUDGET ELEMENT
  if(typeof closable =='undefined')closable=true;
  var hideCallback=function() {
    if (dialogDiv=='dialogNote') resumeBodyFocus();
  };
  if (clearOnHide) {
    hideCallback=function() {
      dijit.byId(dialogDiv).set('content', null);
      if (dialogDiv=='dialogNote') resumeBodyFocus();
    };
  }
  
  // ADD BY Marc TABARY - 2017-03-13 - CHANGE TITLE DYNAMIC DIALOG
  var setTitle=false;
  if(typeof dialogTitle == 'undefined') {
      theDialogTitle = dialogDiv;
  } else if (dialogTitle=='') {
      theDialogTitle = dialogDiv;    
  } else {
      theDialogTitle = dialogTitle;
      setTitle=true;
  }
  if (! dialogTitleKeepAsIs) theDialogTitle=i18n(theDialogTitle);
  // END ADD BY Marc TABARY - 2017-03-13 - CHANGE TITLE DYNAMIC DIALOG
  
  extraClass="projeqtorDialogClass";
  if (dialogDiv=="dialogLogfile") {
    extraClass="logFile";
  }
  if (!dijit.byId(dialogDiv)) {
    dialog=new dijit.Dialog({
      id : dialogDiv,
// CHANGE BY Marc TABARY - 2017-03-13 - CHANGE TITLE DYNAMIC DIALOG
      title : theDialogTitle,
      // Old     
//      title : i18n(dialogDiv),
// END CHANGE BY Marc TABARY - 2017-03-13 - CHANGE TITLE DYNAMIC DIALOG
      width : '500px',
      onHide : hideCallback,
      content : i18n("loading"),
      'class' : extraClass,
      closable : closable
    });
  } else {
    dialog=dijit.byId(dialogDiv);
// ADD BY Marc TABARY - 2017-03-13 - CHANGE TITLE DYNAMIC DIALOG
    if (setTitle) {
        dialog.set('title',theDialogTitle);
  }
// END ADD BY Marc TABARY - 2017-03-13 - CHANGE TITLE DYNAMIC DIALOG
  }
  if (!params) {
    params="";
  }
  showWait();
  dojo.xhrGet({
    url : '../tool/dynamicDialog.php?dialog=' + dialogDiv + '&isIE='
        + ((dojo.isIE) ? dojo.isIE : '') + params,
    handleAs : "text",
    load : function(data) {
      var contentWidget=dijit.byId(dialogDiv);
      contentWidget.set('content', data);
      if (autoShow) {
        setTimeout("dijit.byId('" + dialogDiv + "').show();", 100);
      }
      hideWait();
      if (callBack) {
        setTimeout(callBack, 10);
      }
    },
    error : function() {
      consoleTraceLog("error loading dialog " + dialogDiv);
      hideWait();
    }
  });
}
/*
 * ========================================================================
 * Today management
 * ========================================================================
 */
function saveTodayParameters() {
  loadContent('../tool/saveTodayParameters.php', 'centerDiv',
      'todayParametersForm');
  dijit.byId('dialogTodayParameters').hide();
}

function setTodayParameterDeleted(id) {
  dojo.byId('dialogTodayParametersDelete' + id).value=1;
  dojo.byId('dialogTodayParametersRow' + id).style.display='none';
}

function loadReport(url, dialogDiv) {
  var contentWidget=dijit.byId(dialogDiv);
  contentWidget.set('content',
      '<img src="../view/css/images/treeExpand_loading.gif" />');
  dojo.xhrGet({
    url : url,
    handleAs : "text",
    load : function(data) {
      var contentWidget=dijit.byId(dialogDiv);
      if (!contentWidget) {
        return;
      }
      contentWidget.set('content', data);
    },
    error : function() {
      consoleTraceLog("error loading report " + url + " into " + dialogDiv);
    }
  });
}

function reorderTodayItems() {
  var nodeList=dndTodayParameters.getAllNodes();
  for (i=0; i < nodeList.length; i++) {
    var item=nodeList[i].id.substr(24);
    var order=dojo.byId("dialogTodayParametersOrder" + item);
    if (order) {
      order.value=i + 1;
    }
  }
}
var multiSelection=false;
var switchedModeBeforeMultiSelection=false;
function startMultipleUpdateMode(objectClass) {
  if (checkFormChangeInProgress()) {
    showAlert(i18n('alertOngoingChange'));
    return;
  }
  grid=dijit.byId("objectGrid"); // if the element is not a widget, exit.
  if (!grid) {
    return;
  }
  multiSelection=true;
  formChangeInProgress=true;
  switchedModeBeforeMultiSelection=switchedMode;
  if (switchedModeBeforeMultiSelection) {
    switchModeOn();
  }
  unselectAllRows("objectGrid");
  dijit.byId('objectGrid').selection.setMode('extended');
  loadContent('../view/objectMultipleUpdate.php?objectClass=' + objectClass,
      'detailDiv');
}

function saveMultipleUpdateMode(objectClass) {
  // submitForm("../tool/saveObject.php","resultDivMain", "objectForm", true);
  grid=dijit.byId("objectGrid"); // if the element is not a widget, exit.
  if (!grid) {
    return;
  }
  dojo.byId("selection").value="";
  var items=grid.selection.getSelected();
  if (items.length) {
    dojo.forEach(items, function(selectedItem) {
      if (selectedItem !== null) {
        dojo.byId("selection").value+=parseInt(selectedItem.id) + ";";
      }
    });
  }
  var callBack = function(){
    setTimeout("updateSelectedCountMultiple();",100);
  };
  loadContent('../tool/saveObjectMultiple.php?objectClass=' + objectClass,
      'resultDivMultiple', 'objectFormMultiple',null,null,null,null,callBack);
}

function endMultipleUpdateMode(objectClass) {
  if (dijit.byId('objectGrid')) {
    dijit.byId('objectGrid').selection.setMode('single');
    unselectAllRows("objectGrid");
  }
  multiSelection=false;
  formChangeInProgress=false;
  var sm='';
  if (switchedModeBeforeMultiSelection) {
    if (!switchedMode) {
      switchModeOn();
      sm='&switchedMode=on';
    }
  } else {
    if (switchedMode) {
      switchModeOn();
    }
  }
  if (objectClass) {
    loadContent('../view/objectDetail.php?noselect=true'+sm+'&objectClass='
        + objectClass, 'detailDiv');
  }
}

function deleteMultipleUpdateMode(objectClass) {
  grid=dijit.byId("objectGrid"); // if the element is not a widget, exit.
  if (!grid) {
    return;
  }
  dojo.byId("selection").value=""
  var items=grid.selection.getSelected();
  if (items.length) {
    dojo.forEach(items, function(selectedItem) {
      if (selectedItem !== null) {
        dojo.byId("selection").value+=parseInt(selectedItem.id) + ";";
      }
    });
  }
  actionOK=function() {
    actionOK2=function() {
      if (dijit.byId('deleteMultipleResultDiv').get('content')!='') {
        showConfirm(dijit.byId('deleteMultipleResultDiv').get('content'), function(){loadContent('../tool/deleteObjectMultiple.php?objectClass=' + objectClass,
          'resultDivMultiple', 'objectFormMultiple');});
      } else {
        loadContent('../tool/deleteObjectMultiple.php?objectClass=' + objectClass,
            'resultDivMultiple', 'objectFormMultiple');
      } 
    };
    setTimeout(function(){
      loadContent('../tool/deleteObjectMultipleControl.php?objectClass=' + objectClass,
          'deleteMultipleResultDiv', 'objectFormMultiple',null,null,null,null,actionOK2);
    },200);
  };
  msg=i18n('confirmDeleteMultiple', new Array(i18n('menu' + objectClass),
      items.length));
  showConfirm(msg, actionOK);
}
function updateSelectedCountMultiple() {
  if (dojo.byId('selectedCount')) {
    countSelectedItem('objectGrid','selectedCount');
  }
}
//gautier #533
function multipleUpdateResetPwd(objectClass) {
  grid=dijit.byId("objectGrid"); // if the element is not a widget, exit.
  if (!grid) {
    return;
  }
  dojo.byId("selection").value="";
  var items=grid.selection.getSelected();
  if (items.length) {
    dojo.forEach(items, function(selectedItem) {
      if (selectedItem !== null) {
        dojo.byId("selection").value+=parseInt(selectedItem.id) + ";";
      }
    });
  }
  var callBack = function(){
    
  };
  loadContent('../tool/saveObjectMultiplePwd.php?objectClass=' + objectClass,
      'resultDivMultiple', 'objectFormMultiple',null,null,null,null,callBack);
}

function showImage(objectClass, objectId, imageName) {
  if (objectClass == 'Affectable' || objectClass == 'Resource'
      || objectClass == 'User' || objectClass == 'Contact') {
    imageUrl="../files/thumbs/Affectable_" + objectId + "/thumb80.png";
  }else if(objectClass == 'Note'){
	  imageUrl=objectId;
  }else {
    imageUrl="../tool/download.php?class=" + objectClass + "&id=" + objectId;
  }
  var dialogShowImage=dijit.byId("dialogShowImage");
  if (!dialogShowImage) {
    dialogShowImage=new dojox.image.LightboxDialog({});
    dialogShowImage.startup();
  }
  if (dialogShowImage && dialogShowImage.show) {
    if (dojo.isFF) {
      dojo.xhrGet({
        url : imageUrl,
        handleAs : "text",
        load : function(data) {
          dialogShowImage.show({
            title : imageName,
            href : imageUrl
          });
          dijit.byId('formDiv').resize();
        }
      });
    } else {
      dialogShowImage.show({
        title : imageName,
        href : imageUrl
      });
      if (dijit.byId('formDiv')) dijit.byId('formDiv').resize();
    }
    // dialogShowImage.show({ title:imageName, href:imageUrl });
  } else {
    showError("Error loading image " + imageName);
  }
  // dijit.byId('formDiv').resize();
}
function showBigImage(objectClass, objectId, node, title, hideImage, nocache) {
  var top=node.getBoundingClientRect().top;
  var left=node.getBoundingClientRect().left;
  var height=node.getBoundingClientRect().height;
  var width=node.getBoundingClientRect().width;
  if (!objectClass && !objectId) top+=15;
  if (!height) height=40;
  if (objectClass == 'Affectable' || objectClass == 'Resource'
      || objectClass == 'User' || objectClass == 'Contact') {
    imageUrl="../files/thumbs/Affectable_" + objectId + "/thumb80.png";
    if (nocache) {
      imageUrl+=nocache;
    }
  } else {
    imageUrl="../tool/download.php?class=" + objectClass + "&id=" + objectId;
  }
  var centerThumb80=dojo.byId("centerThumb80");
  if (centerThumb80) {
    var htmlPhoto='';
    var alone='';
    if (objectClass && objectId && !hideImage) {
      htmlPhoto='<img style="border-radius:40px;" src="' + imageUrl + '" />';
    } else {
      alone='Alone';
    }
    if (title) {
      htmlPhoto+='<div id="centerThumb80TitleContainer" class="thumbBigImageTitle' + alone + '">' + title
          + '</div>';
    }
    var topPx=(top - 40 + (height / 2)) + "px";
    var leftPx=(left - 125) + "px";
    if(dojo.byId('objectClassManual') && dojo.byId('objectClassManual').value=='ActivityStream'){
      leftPx=(left + 125) + "px";
    }
    if (parseInt(leftPx)<3) {
      leftPx=(left+width+5)+"px";
    }
    
    centerThumb80.innerHTML=htmlPhoto;
    centerThumb80.style.top=topPx;
    centerThumb80.style.left=leftPx;
    centerThumb80.style.display="block";
    var titleDivRect=(dojo.byId('centerThumb80TitleContainer'))?dojo.byId('centerThumb80TitleContainer').getBoundingClientRect():null;
    var globalDivRect=document.documentElement.getBoundingClientRect();
    if (titleDivRect && titleDivRect.top+titleDivRect.height+50>globalDivRect.height) {
      var newTop=globalDivRect.height-titleDivRect.height-50;
      if (newTop<0) newTop=0;
      centerThumb80.style.top=newTop+'px';
    }
  }
  
}
function hideBigImage(objectClass, objectId) {
  var centerThumb80=dojo.byId("centerThumb80");
  if (centerThumb80) {
    centerThumb80.innerHTML="";
    centerThumb80.style.display="none";
  }
}

showHtmlContent=null;
function showLink(link) {
  if (dojo.isIE) {
    if (showHtmlContent==null) {
      showHtmlContent=dijit.byId("dialogShowHtml").get('content');
    } else {
      dijit.byId("dialogShowHtml").set('content',showHtmlContent);
    }
  }
  // window.frames['showHtmlFrame'].location.href='../view/preparePreview.php';
  dijit.byId("dialogShowHtml").title=link;
  window.frames['showHtmlFrame'].location.href=link;
  dijit.byId("dialogShowHtml").show();
  window.frames['showHtmlFrame'].focus();
}
function showHtml(id, file, className) {
  if (dojo.isIE) {
    if (showHtmlContent==null) {
      showHtmlContent=dijit.byId("dialogShowHtml").get('content');
    } else {
      dijit.byId("dialogShowHtml").set('content',showHtmlContent);
    }
  }
  dijit.byId("dialogShowHtml").title=file;
  window.frames['showHtmlFrame'].location.href='../tool/download.php?class='+className+'&id='
      + id + '&showHtml=true';
  dijit.byId("dialogShowHtml").clearOnHide=false;
  dijit.byId("dialogShowHtml").show();
  window.frames['showHtmlFrame'].focus();
} 

// *******************************************************
// Dojo code to position into a tree
// *******************************************************
function recursiveHunt(lookfor, model, buildme, item) {
  var id=model.getIdentity(item);
  buildme.push(id);
  if (id == lookfor) {
    return buildme;
  }
  for ( var idx in item.children) {
    var buildmebranch=buildme.slice(0);
    var r=recursiveHunt(lookfor, model, buildmebranch, item.children[idx]);
    if (r) {
      return r;
    }
  }
  return undefined;
}

function selectTreeNodeById(tree, lookfor) {
  var buildme=[];
  var result=recursiveHunt(lookfor, tree.model, buildme, tree.model.root);
  if (result && result.length > 0) {
    tree.set('path', result);
  }
}


// ==================================================================
// Project Selector Functions
// ==================================================================
function changeProjectSelectorType(displayMode) {
	//#2887
	
	
	var callBack = function(){
	  loadContent("../view/menuProjectSelector.php", 'projectSelectorDiv');
	};
	
	saveDataToSession('projectSelectorDisplayMode', displayMode, true, callBack);
  if (dijit.byId('dialogProjectSelectorParameters')) {
    dijit.byId('dialogProjectSelectorParameters').hide();
  }
}

function refreshProjectSelectorList() {
  dojo.xhrPost({
    url : "../tool/refreshVisibleProjectsList.php",
    load : function() {
      loadContent('../view/menuProjectSelector.php', 'projectSelectorDiv');
      if (dijit.byId('idProjectPlan')) {
        refreshList('planning', null, null, dijit.byId('idProjectPlan').get('value'), 'idProjectPlan', false);
      }
    }
  });
  if (dijit.byId('dialogProjectSelectorParameters')) {
    dijit.byId('dialogProjectSelectorParameters').hide();
  }
}

// ********************************************************************************************
// Diary
// ********************************************************************************************
function diaryPrevious() {
  diaryPreviousNext(-1);
}
function diaryNext() {
  diaryPreviousNext(1);
}

var noRefreshDiaryPeriod=false;
function diarySelectDate(directDate) {
  if (!directDate)
    return;
  if (noRefreshDiaryPeriod) {
    return;
  }
  noRefreshDiaryPeriod=true;
  var period=dojo.byId("diaryPeriod").value;
  var year=directDate.getFullYear();
  var month=directDate.getMonth() + 1;
  if (period == "month") {
    dojo.byId("diaryYear").value=year;
    dojo.byId("diaryMonth").value=(month >= 10) ? month : "0" + month;
    diaryDisplayMonth(month, year);
  } else if (period == "week") {
    var week=getWeek(directDate.getDate(), month, year) + '';
    if (week == 1 && month > 10) {
      year+=1;
      month=1;
    }
    if (week > 50 && month == 1) {
      year-=1;
      month=12;
    }
    dojo.byId("diaryWeek").value=week;
    dojo.byId("diaryYear").value=year;
    dojo.byId("diaryMonth").value=month;
    diaryDisplayWeek(week, year);
  } else if (period == "day") {
    day=formatDate(directDate);
    dojo.byId("diaryDay").value=day;
    dojo.byId("diaryYear").value=year;
    diaryDisplayDay(day);
  }
  setTimeout("noRefreshDiaryPeriod=false;", 10);
  setTimeout('loadContent("../view/diary.php", "detailDiv", "diaryForm");',200);
  return true;
}

function diaryPreviousNext(way) {
  if (waitingForReply)  {
    showInfo(i18n("alertOngoingQuery"));
    return;
  }
  period=dojo.byId("diaryPeriod").value;
  year=dojo.byId("diaryYear").value;
  month=dojo.byId("diaryMonth").value;
  week=dojo.byId("diaryWeek").value;
  day=dojo.byId("diaryDay").value;
  if (period == "month") {
    month=parseInt(month) + parseInt(way);
    if (month <= 0) {
      month=12;
      year=parseInt(year) - 1;
    } else if (month >= 13) {
      month=1;
      year=parseInt(year) + 1;
    }
    dojo.byId("diaryYear").value=year;
    dojo.byId("diaryMonth").value=(month >= 10) ? month : "0" + month;
    diaryDisplayMonth(month, year);
  } else if (period == "week") {
    week=parseInt(week) + parseInt(way);
    if (parseInt(week) == 0) {
      week=getWeek(31, 12, year - 1);
      if (week == 1) {
        var day=getFirstDayOfWeek(1, year);
        week=getWeek(day.getDate() - 1, day.getMonth() + 1, day.getFullYear());
      }
      year=parseInt(year) - 1;
    } else if (parseInt(week, 10) > 53) {
      week=1;
      year=parseInt(year) + 1;
    } else if (parseInt(week, 10) > 52) {
      lastWeek=getWeek(31, 12, year);
      if (lastWeek == 1) {
        var day=getFirstDayOfWeek(1, year + 1);
        lastWeek=getWeek(day.getDate() - 1, day.getMonth() + 1, day
            .getFullYear());
      }
      if (parseInt(week, 10) > parseInt(lastWeek, 10)) {
        week=01;
        year=parseInt(year) + 1;
      }
    }
    dojo.byId("diaryWeek").value=week;
    dojo.byId("diaryYear").value=year;
    diaryDisplayWeek(week, year);
  } else if (period == "day") {
    day=formatDate(addDaysToDate(getDate(day), way));
    year=day.substring(0, 4);
    dojo.byId("diaryDay").value=day;
    dojo.byId("diaryYear").value=year;
    diaryDisplayDay(day);
  }
  //loadContent("../view/diary.php", "detailDiv", "diaryForm");
}

function diaryWeek(week, year) {
  dojo.byId("diaryPeriod").value="week";
  dojo.byId("diaryYear").value=year;
  dojo.byId("diaryWeek").value=week;
  diaryDisplayWeek(week, year);
  loadContent("../view/diary.php", "detailDiv", "diaryForm");
}

function diaryMonth(month, year) {
  dojo.byId("diaryPeriod").value="month";
  dojo.byId("diaryYear").value=year;
  dojo.byId("diaryMonth").value=month;
  diaryDisplayMonth(month, year);
  loadContent("../view/diary.php", "detailDiv", "diaryForm");
}
function diaryDay(day) {
  dojo.byId("diaryPeriod").value="day";
  dojo.byId("diaryYear").value=day.substring(day, 0, 4);
  dojo.byId("diaryMonth").value=day.substring(day, 5, 2);
  dojo.byId("diaryDay").value=day;
  diaryDisplayDay(day);
  loadContent("../view/diary.php", "detailDiv", "diaryForm");
}

function diaryDisplayMonth(month, year) {
  var vMonthArr=new Array(i18n("January"), i18n("February"), i18n("March"),
      i18n("April"), i18n("May"), i18n("June"), i18n("July"), i18n("August"),
      i18n("September"), i18n("October"), i18n("November"), i18n("December"));
  caption=vMonthArr[month - 1] + " " + year;
  dojo.byId("diaryCaption").innerHTML=caption;
  var firstday=new Date(year, month - 1, 1);
  dijit.byId('dateSelector').set('value', firstday);
}

function diaryDisplayWeek(week, year) {
  var firstday=getFirstDayOfWeek(week, year);
  var lastday=new Date(firstday);
  lastday.setDate(firstday.getDate() + 6);
  if (week<10) week='0'+parseInt(week);
  caption=year + ' #' + week + "<span style='font-size:70%'> (" + dateFormatter(formatDate(firstday))
      + " - " + dateFormatter(formatDate(lastday)) + ") </span>";
  dojo.byId("diaryCaption").innerHTML=caption;
  dijit.byId('dateSelector').set('value', firstday);
}

function diaryDisplayDay(day) {
  var vDayArr=new Array(i18n("Sunday"), i18n("Monday"), i18n("Tuesday"),
      i18n("Wednesday"), i18n("Thursday"), i18n("Friday"), i18n("Saturday"));
  var d=getDate(day);
  caption=vDayArr[d.getDay()] + " " + dateFormatter(day);
  dojo.byId("diaryCaption").innerHTML=caption;
  dijit.byId('dateSelector').set('value', day);
}

function changeCreationInfo() {
  toShow=false;
  if (dijit.byId('idUser')) {
    dijit.byId('dialogCreationInfoCreator').set('value',
        dijit.byId('idUser').get('value'));
    dojo.byId('dialogCreationInfoCreatorLine').style.display='inline';
    toShow=true;
  } else if (dojo.byId('idUser')) {
    dijit.byId('dialogCreationInfoCreator').set('value',
        dojo.byId('idUser').value);
    dojo.byId('dialogCreationInfoCreatorLine').style.display='inline';
    toShow=true;
  } else {
    dojo.byId('dialogCreationInfoCreatorLine').style.display='none';
  }

  if (dijit.byId('creationDate')) {
    dijit.byId('dialogCreationInfoDate').set('value',
        dijit.byId('creationDate').get('value'));
    dojo.byId('dialogCreationInfoDateLine').style.display='inline';
    dojo.byId('dialogCreationInfoTimeLine').style.display='none';
    toShow=true;
  } else if (dojo.byId('creationDate')) {
    dijit.byId('dialogCreationInfoDate').set('value',
        dojo.byId('creationDate').value);
    dojo.byId('dialogCreationInfoDateLine').style.display='inline';
    dojo.byId('dialogCreationInfoTimeLine').style.display='none';
    toShow=true;
  } else if (dijit.byId('creationDateTime')) {
    val=dijit.byId('creationDateTime').get('value');
    valDate=val.substr(0, 10);
    valTime='T' + val.substr(11, 8);
    dijit.byId('dialogCreationInfoDate').set('value', valDate);
    dijit.byId('dialogCreationInfoTime').set('value', valTime);
    dojo.byId('dialogCreationInfoDateLine').style.display='inline';
    dojo.byId('dialogCreationInfoTimeLine').style.display='inline';
    toShow=true;
  } else if (dojo.byId('creationDateTime')) {
    val=dojo.byId('creationDateTime').value;
    valDate=val.substr(0, 10);
    valTime=val.substr(11, 8);
    dijit.byId('dialogCreationInfoDate').set('value', valDate);
    dijit.byId('dialogCreationInfoTime').set('value', valTime);
    dojo.byId('dialogCreationInfoDateLine').style.display='inline';
    dojo.byId('dialogCreationInfoTimeLine').style.display='inline';
    toShow=true;
  } else {
    dojo.byId('dialogCreationInfoDateLine').style.display='none';
    dojo.byId('dialogCreationInfoTimeLine').style.display='none';
  }
  if (toShow) {
    dijit.byId('dialogCreationInfo').show();
  }

  if (toShow) {
    dijit.byId('dialogCreationInfo').show();
  }
}

function saveCreationInfo() {
  if (dijit.byId('idUser')) {
    dijit.byId('idUser').set('value',
        dijit.byId('dialogCreationInfoCreator').get('value'));
  } else if (dojo.byId('idUser')) {
    dojo.byId('idUser').value=dijit.byId('dialogCreationInfoCreator').get(
        'value');
  }

  if (dijit.byId('creationDate')) {
    dijit.byId('creationDate').set('value',
        formatDate(dijit.byId('dialogCreationInfoDate').get('value')));
  } else if (dojo.byId('creationDate')) {
    dojo.byId('creationDate').value=formatDate(dijit.byId(
        'dialogCreationInfoDate').get('value'));
  } else {
    if (dijit.byId('creationDateTime')) {
      valDate=formatDate(dijit.byId('dialogCreationInfoDate').get('value'));
      valTime=formatTime(dijit.byId('dialogCreationInfoTime').get('value'));
      val=valDate + ' ' + valTime;
      dijit.byId('creationDateTime').set('value', val);
    } else if (dojo.byId('creationDateTime')) {
      valDate=format(Datedijit.byId('dialogCreationInfoDate').get('value'));
      valTime=format(Datedijit.byId('dialogCreationInfoTime').get('value'));
      val=valDate + ' ' + valTime;
      dojo.byId('dialogCreationInfoDate').value=val;
    }
  }
  formChanged();
  //dojo.byId('buttonDivCreationInfo').innerHTML="";
  //forceRefreshCreationInfo=true;
  saveObject();
  dijit.byId('dialogCreationInfo').hide();
}

function logLevel(value){
  var url='../tool/storeLogLevel.php?value=' + value;
  dojo.xhrPost({
    url : url,
    handleAs : "text",
    load : function(data, args) {
    }
  });
}

function showLogfile(name) {
  var atEnd=null;
  if (name=='last') {
    atEnd=function(name){
      var scroll=function() {
        dojo.query(".logFile .dijitDialogPaneContent").forEach(function(node, index, arr){
          node.scrollTop=parseInt(dojo.byId('logTableContainer').offsetHeight);
        });
      };
      setTimeout(scroll,500);
    };
  }
  
  loadDialog('dialogLogfile', atEnd, true, '&logname='+name, true);
}

function installPlugin(fileName,confirmed) {
  if (! confirmed) {
    actionOK=function() {
      installPlugin(fileName, true);
    };
    msg=i18n('confirmInstallPlugin', new Array(fileName));
    showConfirm(msg,actionOK);
  } else {
    showWait();
    dojo.xhrGet({
      url : "../plugin/loadPlugin.php?pluginFile="
          + encodeURIComponent(fileName),
      load : function(data) {
        if (data=="OK") {
          loadContent("pluginManagement.php", "centerDiv");
        } else if (data=="RELOAD") {
          showWait();
          noDisconnect=true;
          quitConfirmed=true;        
          dojo.byId("directAccessPage").value="pluginManagement.php";
          dojo.byId("menuActualStatus").value=menuActualStatus;
          dojo.byId("p1name").value="type";
          dojo.byId("p1value").value=forceRefreshMenu;
          forceRefreshMenu="";
          dojo.byId("directAccessForm").submit();     
        } else if (data.substr(0,8)=="CALLBACK") {
          var url=data.substring(9,data.indexOf('#'));
          window.open(url);
          var msg=data.substring(data.indexOf('#')+1,data.indexOf('##'));
          hideWait();
          callback=function() {loadContent("pluginManagement.php", "centerDiv");};
          showInfo(msg,callback);
          //setTimeout(callback,5000);
        } else {
          hideWait();
          showError(data+'<br/>');
        }
      },
      error : function(data) {
        hideWait();
        showError(data);
      }
    });
  }
}
function deletePlugin(fileName,confirmed) {
  if (! confirmed) {
    actionOK=function() {
      deletePlugin(fileName, true);
    };
    msg=i18n('confirmDeletePluginFile', new Array(fileName));
    showConfirm(msg,actionOK);
  } else {
    showWait();
    dojo.xhrGet({
      url : "../plugin/deletePlugin.php?pluginFile="
          + encodeURIComponent(fileName),
      load : function(data) {
        if (data=="OK") {
          loadContent("pluginManagement.php", "centerDiv");
        } else {
          hideWait();
          showError(data+'<br/>');
        }
      },
      error : function(data) {
        hideWait();
        showError(data);
      }
    });
  }
}

function uninstallPlugin(uniqueCode, name, confirmed) {
	  if (! confirmed) {
	    actionOK=function() {
	    	uninstallPlugin(uniqueCode, name, true);
	    };
	    msg=i18n('confirmUninstallPlugin', new Array(name));
	    showConfirm(msg,actionOK);
	  } else {
	    showWait();
	    dojo.xhrGet({
	      url : "../plugin/uninstallPlugin.php?uniqueCode="+ uniqueCode +"&pluginName="+name,
	      load : function(data) {
	          showWait();
	          noDisconnect=true;
	          quitConfirmed=true;        
	          dojo.byId("directAccessPage").value="pluginManagement.php";
	          dojo.byId("menuActualStatus").value=menuActualStatus;
	          dojo.byId("p1name").value="type";
	          dojo.byId("p1value").value=forceRefreshMenu;
	          forceRefreshMenu="";
	          dojo.byId("directAccessForm").submit();
	      },
	      error : function(data) {
	        hideWait();
	        showError(data);
	      }
	    });
	  }
	}

var historyShowHideWorkStatus=0;
function historyShowHideWork() {
  if (! dojo.byId('objectClass')) {return;}
  historyShowHideWorkStatus=((historyShowHideWorkStatus)?0:1);
  if (dijit.byId('dialogHistory')) {
    dijit.byId('dialogHistory').hide();
  } 
  var callBack = function(){
	showHistory(dojo.byId('objectClass').value);
  };
  saveDataToSession("showWorkHistory", historyShowHideWorkStatus, null, callBack);
}

// ====================================================
// * UPLOAD PLUGIN * //
// ====================================================

function uploadPlugin() {
  if (!isHtml5()) {
    return true;
  }
  if (dojo.byId('pluginFileName').innerHTML == "") {
    return false;
  }
  dojo.style(dojo.byId('downloadProgress'), {
    display : 'block'
  });
  showWait();
  return true;
}

function changePluginFile(list) {
  if (list.length > 0) {
    dojo.byId("pluginFileName").innerHTML=list[0]['name'];
    return true;
  }
}

function savePluginAck(dataArray) {
  if (!isHtml5()) {
    resultFrame=document.getElementById("resultPost");
    resultText=resultPost.document.body.innerHTML;
    dijit.byId('resultDivMain').set('content',resultText);
    savePluginFinalize();
    return;
  }
  if (dojo.isArray(dataArray)) {
    result=dataArray[0];
  } else {
    result=dataArray;
  }
  dojo.style(dojo.byId('downloadProgress'), {
    display : 'none'
  });
  if (dojo.isArray(dataArray)) {
    result=dataArray[0];
  } else {
    result=dataArray;
  }
  dojo.style(dojo.byId('downloadProgress'), {
    display : 'none'
  });
  contentNode = dojo.byId('resultDivMain');
  contentNode.innerHTML=result.message;
  contentNode.style.display="block"; 
  contentNode.style.opacity=1; 
  setTimeout("dojo.byId('resultDivMain').style.display='none';",2000);
  savePluginFinalize();
}
function savePluginFinalize() {
  contentNode = dojo.byId('resultDivMain');
  if (contentNode.innerHTML.indexOf('resultOK')>0) {
    setTimeout('loadContent("pluginManagement.php", "centerDiv");',1000);
  } else {
    hideWait();
  }
}

// ===================================================
// favorite reports management
// ===================================================

function refreshFavoriteReportList() {
  if (!dijit.byId('favoriteReports')) return;
  dijit.byId('favoriteReports').refresh();
  //var listContent=trim(dijit.byId('favoriteReports').get('content'));
}
function saveReportAsFavorite() {
  var fileName=dojo.byId('reportFile').value;
  var callback=function(){
    refreshFavoriteReportList();
    dijit.byId('listFavoriteReports').openDropDown();
    var delay=2000;
    var listContent=trim(dijit.byId('favoriteReports').get('content'));
    if (listContent=="") {delay=1;}
    hideReportFavoriteTooltip(delay);
  };
  loadContent("../tool/saveReportAsFavorite.php" , "resultDivMain", "reportForm", true, 'report',false,false, callback);
}

function showReportFavoriteTooltip() {
  var listContent=trim(dijit.byId('favoriteReports').get('content'));
  if (listContent=="") {
    return;
  }
  clearTimeout(closeFavoriteReportsTimeout);
  clearTimeout(openFavoriteReportsTimeout);
  openFavoriteReportsTimeout=setTimeout("dijit.byId('listFavoriteReports').openDropDown();",popupOpenDelay);
}

function hideReportFavoriteTooltip(delay) {
  if (!dijit.byId("listFavoriteReports")) return;
  clearTimeout(closeFavoriteReportsTimeout);
  clearTimeout(openFavoriteReportsTimeout);
  closeFavoriteReportsTimeout=setTimeout('dijit.byId("listFavoriteReports").closeDropDown();',delay);
}

function removeFavoriteReport(id) {
  var callBack=function() { refreshFavoriteReportList();};
  dojo.xhrGet({
    url: '../tool/removeFavoriteReport.php?idFavorite='+id,
    handleAs : "text",
    load: callBack
  });
}

function reorderFavoriteReportItems() {
  var nodeList=dndFavoriteReports.getAllNodes();
  var param="";
  for (var i=0; i < nodeList.length; i++) {
    var domNode=nodeList[i];
    var item=nodeList[i].id.substr(11);
    var order=dojo.byId("favoriteReportOrder" + item);
    if (dojo.hasClass(domNode,'dojoDndItemAnchor')) {
      order.value=null;
      dojo.removeClass(domNode,'dojoDndItemAnchor');
      dojo.query('dojoDndItemAnchor').removeClass('dojoDndItemAnchor');
      //continue;
    }
    if (order) {
      order.value=i + 1;
      param+=((param)?'&':'?')+"favoriteReportOrder"+item+"="+(i+1);
    }
  }
  dojo.xhrPost({
    url: '../tool/saveReportFavoriteOrder.php'+param,
    handleAs: "text",
    load: function(data,args) {
      refreshFavoriteReportList(); 
    }
  });
}

function checkEmptyReportFavoriteTooltip() {
  var listContent=trim(dijit.byId('favoriteReports').get('content'));
  if (listContent=="") {
    dijit.byId("listFavoriteReports").closeDropDown();
  }
}

function showTickets(refType, refId) {
  loadDialog('dialogShowTickets', null, true, '&refType='+refType+'&refId='+refId, true);
}

function showStatusPeriod(refType, refId) {
  loadDialog('dialogStatusPeriod', null, true, '&refType='+refType+'&refId='+refId, true);
}

function showMenuList() {
  clearTimeout(closeMenuListTimeout);
  menuListAutoshow=true;
  clearTimeout(openMenuListTimeout);
  openMenuListTimeout=setTimeout("dijit.byId('menuSelector').loadAndOpenDropDown();",popupOpenDelay);
  
}
function hideMenuList(delay, item) {
  if (! menuListAutoshow) return;
  clearTimeout(closeMenuListTimeout);
  clearTimeout(openMenuListTimeout);
  closeMenuListTimeout=setTimeout("dijit.byId('menuSelector').closeDropDown();",delay);
}

function saveRestrictTypes() {
  callback=function() {
    var fnClBk=function(data) {
      dojo.byId('resctrictedTypeClassList').innerHTML=data;
    };
    dojo.xhrGet({
      url : '../tool/getSingleData.php?dataType=restrictedTypeClass'
        +'&idProject='+dojo.byId('idProjectParam').value
        +'&idProjectType='+dojo.byId('idProjectTypeParam').value
        +'&idProfile='+dojo.byId('idProfile').value,
      handleAs : "text",
      load : fnClBk
    });
  }
  loadContent("../tool/saveRestrictTypes.php" , "resultDivMain", "restrictTypesForm", true, 'report',false,false, callback);
  dijit.byId('dialogRestrictTypes').hide();
}

function getMaxWidth(document){
  return Math.max( document.scrollWidth, document.offsetWidth, 
      document.clientWidth);
}

function getMaxHeight(document){
  return Math.max( document.scrollHeight, document.offsetHeight, 
      document.clientHeight);
}

function changeParamDashboardTicket(paramToSend){
  loadContent('dashboardTicketMain.php?'+paramToSend, 'centerDiv', 'dashboardTicketMainForm');
}

function changeDashboardTicketMainTabPos(){
  var listChild=dojo.byId('dndDashboardLeftParameters').childNodes[1].childNodes;
  addLeft="";
  iddleList=',"iddleList":[';
  if(listChild.length>1){
    addLeft="[";
    for(var i=1;i<listChild.length;i++){
      getId="";
      if(listChild[i].id.includes('dialogDashboardLeftParametersRow')){
        getId=listChild[i].id.split('dialogDashboardLeftParametersRow')[1];
      }
      if(listChild[i].id.includes('dialogDashboardRightParametersRow')){
        getId=listChild[i].id.split('dialogDashboardRightParametersRow')[1];
      }
      //iddleList+='"'+dijit.byId('dialogTodayParametersIdle'+listChild[i].id.split('dialogDashboardLeftParametersRow')[1]).get('checked')+'"';
      if(getId!=""){
        addLeft+='"'+getId+'"';
        iddleList+='{"name":"'+getId+'","idle":'+dijit.byId('tableauBordTabIdle'+getId).get('checked')+'}';
        if(i+1!=listChild.length){
          addLeft+=',';
          iddleList+=',';
        } 
      }
    }
    addLeft+="]";
    if(dojo.byId('dndDashboardRightParameters').childNodes[0].childNodes.length>1){
      iddleList+=',';
    }
  }
  
  var listChild=dojo.byId('dndDashboardRightParameters').childNodes[0].childNodes;
  addRight="";
  if(listChild.length>1){
    addRight="[";
    for(var i=1;i<listChild.length;i++){
      getId="";
        if(listChild[i].id.includes('dialogDashboardLeftParametersRow')){
          getId=listChild[i].id.split('dialogDashboardLeftParametersRow')[1];
        }
        if(listChild[i].id.includes('dialogDashboardRightParametersRow')){
          getId=listChild[i].id.split('dialogDashboardRightParametersRow')[1];
        }
        //iddleList+='"'+dijit.byId('dialogTodayParametersIdle'+listChild[i].id.split('dialogDashboardLeftParametersRow')[1]).get('checked')+'"';
        if(getId!=""){
          addRight+='"'+getId+'"';
          iddleList+='{"name":"'+getId+'","idle":'+dijit.byId('tableauBordTabIdle'+getId).get('checked')+'}';
          if(i+1!=listChild.length){
            addRight+=',';
            iddleList+=',';
          }
        }
      }
    addRight+="]";
  }
  toSend='{"addLeft":';
  if(addLeft==""){
    addLeft="[]";
  }
  toSend+=addLeft;
  
  toSend+=',"addRight":';
  if(addRight==""){
    addRight="[]";
  }
  iddleList+="]";
  toSend+=addRight+iddleList+"}";
  if (dojo.byId('objectClassManual') && dojo.byId('objectClassManual').value=='DashboardRequirement') {
	  loadContent('dashboardRequirementMain.php?updatePosTab='+toSend, 'centerDiv', 'dashboardRequirementMainForm');
  } else {
	  loadContent('dashboardTicketMain.php?updatePosTab='+toSend, 'centerDiv', 'dashboardTicketMainForm');
  }
}

function changeParamDashboardRequirement(paramToSend){
  loadContent('dashboardRequirementMain.php?'+paramToSend, 'centerDiv', 'dashboardRequirementMainForm');
}

function getLocalLocation(){
  var availableScaytLocales=["en_US", "en_GB", "pt_BR", "da_DK", "nl_NL", "en_CA", "fi_FI", "fr_FR", "fr_CA", "de_DE", "el_GR", "it_IT", "nb_NO", "pt_PT", "es_ES", "sv_SE"];
  var correspondingLocales= ["en",    "",      "pt-br", "",      "nl",    "",      "",      "fr",    "fr-ca", "de",    "el",    "it",    "",      "pt",    "es",    ""];
  var locale=dojo.locale;
  if (currentLocale) {
    var pos=correspondingLocales.indexOf(currentLocale);
    if (pos>=0) {
      locale=availableScaytLocales[pos];
    }
  }
  return locale;
}
function getLocalScaytAutoStartup() {
  if (typeof scaytAutoStartup == "undefined" || scaytAutoStartup===null || scaytAutoStartup==='' || scaytAutoStartup=='YES' || scaytAutoStartup===true) {
    return true;
  } else {
    return scaytAutoStartup;
  }
}

// =============================================================================
// = JobDefinition
// =============================================================================

/**
 * Display a add line Box
 *
 */
function addJobDefinition(checkId) {
  var params="&checkId=" + checkId;
  loadDialog('dialogJobDefinition', null, true, params);
}

/**
 * Display a edit line Box
 *
 */
function editJobDefinition(checkId, lineId) {
  var params="&checkId=" + checkId + "&lineId=" + lineId;
  loadDialog('dialogJobDefinition', null, true, params);
}

/**
 * save a line (after addDetail or editDetail)
 *
 */
function saveJobDefinition() {
  if (!dijit.byId("dialogJobDefinitionName").get('value')) {
    showAlert(i18n('messageMandatory', new Array(i18n('colName'))));
    return false;
  }
  loadContent("../tool/saveJobDefinition.php", "resultDivMain",
      "dialogJobDefinitionForm", true, 'jobDefinition');
  dijit.byId('dialogJobDefinition').hide();

}

/**
 * Display a delete line Box
 *
 */
function removeJobDefinition(lineId) {
  var params="?lineId=" + lineId;
  // loadDialog('dialogJobDefinition',null, true, params)
  // dojo.byId("jobDefinitionId").value=lineId;
  actionOK=function() {
    loadContent("../tool/removeJobDefinition.php" + params,
        "resultDivMain", null, true, 'jobDefinition');
  };
  msg=i18n('confirmDelete', new Array(i18n('JobDefinition'), lineId));
  showConfirm(msg, actionOK);
}

// =============================================================================
// = Joblist
// =============================================================================

function showJoblist(objectClass) {
  if (!objectClass) {
    return;
  }
  if (dijit.byId('id')) {
    var objectId=dijit.byId('id').get('value');
  } else {
    return;
  }
  var params="&objectClass=" + objectClass + "&objectId=" + objectId;
  loadDialog('dialogJoblist', null, true, params, true);
}

function saveJoblist() {
  // var params="&objectClass="+objectClass+"&objectId="+objectId;
  // loadDialog('dialogJoblist',null, true, params);
  loadContent('../tool/saveJoblist.php', 'resultDivMain', 'dialogJoblistForm',
      true, 'joblist');
  dijit.byId('dialogJoblist').hide();
  return false;
}

function jobClick(line) {
  jobName="check_" + line;
  if (dijit.byId(jobName).get('checked') && dijit.byId("check_" + line)) {
    dijit.byId("check_" + line).set('checked', false);
  }
}

function changeJobInfo(jobId) {
  toShow=false;
  if(dijit.byId('dialogJobInfoJobId')) {
    dijit.byId('dialogJobInfoJobId').set('value', jobId);
  } else if (dijit.byId('dialogJobInfoJobId')) {
    dojo.byId('dialogJobInfoJobId').value = jobId;
  }

  if (dijit.byId('job_'+jobId+'_idUser')) {
    dijit.byId('dialogJobInfoCreator').set('value',
        dijit.byId('job_'+jobId+'_idUser').get('value'));
    dojo.byId('dialogJobInfoCreatorLine').style.display='inline';
    toShow=true;
  } else if (dojo.byId('job_'+jobId+'_idUser')) {
    dijit.byId('dialogJobInfoCreator').set('value',
        dojo.byId('job_'+jobId+'_idUser').value);
    dojo.byId('dialogJobInfoCreatorLine').style.display='inline';
    toShow=true;
  } else {
    dojo.byId('dialogJobInfoCreatorLine').style.display='none';
  }

  if (dijit.byId('job_'+jobId+'_creationDate')) {
    if(dijit.byId('job_'+jobId+'_creationDate').get('value') != '') {
      dijit.byId('dialogJobInfoDate').set('value', dijit.byId('job_'+jobId+'_creationDate').get('value'));
    }
    dojo.byId('dialogJobInfoDateLine').style.display='inline';
    toShow=true;
  } else if (dojo.byId('job_'+jobId+'_creationDate')) {
    if(dojo.byId('job_'+jobId+'_creationDate').value != '') {
      dojo.byId('dialogJobInfoDate').set('value', dojo.byId('job_'+jobId+'_creationDate').value);
    }
    dojo.byId('dialogJobInfoDateLine').style.display='inline';
    toShow=true;
  } else {
    dojo.byId('dialogJobInfoDateLine').style.display='none';
  }

  if (toShow) {
    dijit.byId('dialogJobInfo').show();
  }
}

function saveJobInfo() {
  if(dijit.byId('dialogJobInfoJobId')) {
    jobId = dijit.byId('dialogJobInfoJobId').get('value');
  } else if (dijit.byId('dialogJobInfoJobId')) {
    jobId = dijit.byId('dialogJobInfoJobId').get('value');
  }
  if(jobId) {
    if (dijit.byId('job_'+jobId+'_idUser')) {
      dijit.byId('job_'+jobId+'_idUser').set('value',
        dijit.byId('dialogJobInfoCreator').get('value'));
    } else if (dojo.byId('job_'+jobId+'_idUser')) {
      dojo.byId('job_'+jobId+'_idUser').value = dijit.byId('dialogJobInfoCreator').get(
          'value');
    }

    if(dijit.byId('dialogJobInfoDate').get('value') != '') {
        if (dijit.byId('job_'+jobId+'_creationDate')) {
            dijit.byId('job_'+jobId+'_creationDate').set('value',
              formatDate(dijit.byId('dialogJobInfoDate').get('value')));
        } else if (dojo.byId('job_'+jobId+'_creationDate')) {
            dojo.byId('job_'+jobId+'_creationDate').value = formatDate(dijit.byId(
              'dialogJobInfoDate').get('value'));
        }
    }
    formChanged();
    // To implement if we want to hide before reload after save
    /*dojo.byId('buttonDivCreationInfo').innerHTML="";*/
    forceRefreshJobInfo=true;
    saveObject();
    dijit.byId('dialogJobInfo').hide();
  }
}

function toggleFullScreen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
   (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    enterFullScreen();
  } else { 
    exitFullScreen();
  }
  dijit.byId("iconMenuUserScreen").closeDropDown();
}
function enterFullScreen() {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen();  
  } else if (document.documentElement.mozRequestFullScreen) {  
    document.documentElement.mozRequestFullScreen();  
  } else if (document.documentElement.webkitRequestFullScreen) {  
    document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
  }
}
function exitFullScreen() {
  if (document.cancelFullScreen ) {
    document.cancelFullScreen(); 
  } else if (document.mozCancelFullScreen) {  
    document.mozCancelFullScreen(); 
  } else if (document.webkitCancelFullScreen) {  
    document.webkitCancelFullScreen(); 
  }
}
/**
* Subscription
*
*/
function subscribeToItem(objectClass, objectId, userId) {
    if (! objectId && dojo.byId('id')) objectId=dojo.byId('id').value;
    var url="../tool/saveSubscription.php?mode=on";
    url+="&objectClass="+objectClass;
    url+="&objectId="+objectId;
    url+="&userId="+userId;
  dojo.xhrGet({
    url : url,
    handleAs : "text",
    load : function(data) {
      var result="KO";
      var itemLabel="";
      var response=JSON.parse(data);
      if (response.hasOwnProperty('result')) result=response.result;
      if (response.hasOwnProperty('itemLabel')) itemLabel=response.itemLabel;
      if (result=='OK') {
        addMessage(i18n('subscriptionSuccess',new Array(itemLabel)));
        dijit.byId('subscribeButton').set('iconClass','dijitButtonIcon dijitButtonIconSubscribeValid');
        enableWidget('subscribeButtonUnsubscribe');
        disableWidget('subscribeButtonSubscribe');
      } else {
        showError(i18n('subscriptionFailed'));
      }
    },
    error : function() {
      showError(i18n('subscriptionFailed'));
    }
  });
}

function unsubscribeFromItem(objectClass, objectId, userId) {
  if (! objectId && dojo.byId('id')) objectId=dojo.byId('id').value;
  var url="../tool/saveSubscription.php?mode=off";
  url+="&objectClass="+objectClass;
  url+="&objectId="+objectId;
  url+="&userId="+userId;
  dojo.xhrGet({
    url : url,
    handleAs : "text",
    load : function(data) {
      var result="KO";
      var itemLabel="";
      var message="";
      var response=JSON.parse(data);
      if (response.hasOwnProperty('result')) result=response.result;
      if (response.hasOwnProperty('itemLabel')) itemLabel=response.itemLabel;
      if (response.hasOwnProperty('message')) message=response.message;
      if (result=='OK') {
        addMessage(i18n('unsubscriptionSuccess',new Array(itemLabel)));
        dijit.byId('subscribeButton').set('iconClass','dijitButtonIcon dijitButtonIconSubscribe');
        enableWidget('subscribeButtonSubscribe');
        disableWidget('subscribeButtonUnsubscribe');
      } else {
        showError(i18n('subscriptionFailed')+'<br/>'+message);
      }
    },
    error : function() {
      showError(i18n('subscriptionFailed'));
    }
  });
}

function subscribeForOthers(objectClass, objectId) {
  if (! objectId && dojo.byId('id')) objectId=dojo.byId('id').value;
  loadDialog('dialogSubscriptionForOthers',null,true,'&objectClass='+objectClass+'&objectId='+objectId,true);
}
function showSubscribersList(objectClass, objectId) {
  if (! objectId && dojo.byId('id')) objectId=dojo.byId('id').value;
  loadDialog('dialogSubscribersList',null,true,'&objectClass='+objectClass+'&objectId='+objectId,true);
}

function showSubscriptionList(userId) {
  loadDialog('dialogSubscriptionList',null,true,'&userId='+userId,true);
}

function changeSubscriptionFromDialog(mode,dialog,objectClass,objectId,userId,key,currentUserId) {
  if (! objectId && dojo.byId('id')) objectId=dojo.byId('id').value;
  var url="../tool/saveSubscription.php?mode="+mode;
  url+="&objectClass="+objectClass;
  url+="&objectId="+objectId;
  url+="&userId="+userId;
  dojo.xhrGet({
    url : url,
    handleAs : "text",
    load : function(data) {
      var result="KO";
      var itemLabel="";
      var message="";
      var userName="";
      var userId="";
      var currentUserId="";
      var objectClass="";
      var objectId="";
      var response=JSON.parse(data);
      if (response.hasOwnProperty('result')) result=response.result;
      if (response.hasOwnProperty('itemLabel')) itemLabel=response.itemLabel;
      if (response.hasOwnProperty('userName')) userName=response.userName;
      if (response.hasOwnProperty('userId')) userId=response.userId;
      if (response.hasOwnProperty('currentUserId')) currentUserId=response.currentUserId;
      if (response.hasOwnProperty('objectClass')) objectClass=response.objectClass;
      if (response.hasOwnProperty('objectId')) objectId=response.objectId;
      if (response.hasOwnProperty('message'))  message=response.message;
      if (result=='OK') {
        if (dialog=='list') {
          addMessage(i18n('unsubscriptionSuccess',new Array(itemLabel)));
        } else if (dialog=='other') {
          if (mode=='on') {
            addMessage(i18n('subscriptionSuccess',new Array(userName)));
          } else {
            addMessage(i18n('unsubscriptionSuccess',new Array(userName)));
          }
        }
        if (key) {
          if (mode=='on') {
            dojo.byId('subscribtionButton'+key).style.display="none";
            dojo.byId('unsubscribtionButton'+key).style.display="inline-block";
          } else {
            dojo.byId('unsubscribtionButton'+key).style.display="none";
            dojo.byId('subscribtionButton'+key).style.display="inline-block";
          }
        }
        if (userId && currentUserId && userId==currentUserId && objectClass && objectId) {
          if (dojo.byId('objectClass') && objectClass==dojo.byId('objectClass').value && dojo.byId('objectId') && parseInt(objectId)==parseInt(dojo.byId('objectId').value)) {
            if (mode=='on') {
              if (dijit.byId('subscribeButton')) dijit.byId('subscribeButton').set('iconClass','dijitButtonIcon dijitButtonIconSubscribeValid');
              enableWidget('subscribeButtonUnsubscribe');
              disableWidget('subscribeButtonSubscribe');
            } else {
              if (dijit.byId('subscribeButton')) dijit.byId('subscribeButton').set('iconClass','dijitButtonIcon dijitButtonIconSubscribe');
              enableWidget('subscribeButtonSubscribe');
              disableWidget('subscribeButtonUnsubscribe');
            }
          }
        }
      } else {
        showError(i18n('subscriptionFailed')+'<br/>'+message);
      }
    },
    error : function() {
      showError(i18n('subscriptionFailed'));
    }
  });
}

function filterDnDList(search,list) {
  var searchVal=dojo.byId(search).value;
  searchVal=searchVal.replace(/\*/gi,'.*');
  var pattern = new RegExp(searchVal, 'i');
  dojo.map(dojo.byId(list).children, function(child){
    if (searchVal!='' && ! pattern.test(child.getAttribute('value')) ) {
      child.style.display="none";
    } else {
      child.style.display="block";
    }
  });
}

var arrayPaneSize=[];
function storePaneSize(paneName,sizeValue) {
  if (arrayPaneSize[paneName] && arrayPaneSize[paneName]==sizeValue) {
    return;
  }
  arrayPaneSize[paneName]=sizeValue;
  saveDataToSession(paneName, sizeValue, true);
}

function displayMenu(id){
  if(hideUnderMenuId){
    if (hideUnderMenuId == id ){
      clearTimeout(hideUnderMenuTimeout);
      hideUnderMenuId=null;
    }else{
      hideUnderMenu(hideUnderMenuId);
    }
  }
  dojo.byId('UnderMenu'+id).style.zIndex="999999";
  dojo.byId('UnderMenu'+id).style.display="block";
  setTimeout("repositionMenuDiv("+id+","+id+");",10);
}

function displayUnderMenu(id,idParent){
  if (hideUnderMenuId==null && previewhideUnderMenuId!=null){
    hideUnderMenu(previewhideUnderMenuId,0);
  }
  else 
    if(hideUnderMenuId){
      if (hideUnderMenuId == id ){
        dojo.byId('UnderMenu'+id).style.display="none";
        clearTimeout(hideUnderMenuTimeout);
      }else{
        hideUnderMenu(hideUnderMenuId);
      }
    }
    dojo.byId('UnderMenu'+id).style.display="block";
    setTimeout("repositionMenuDiv("+id+","+idParent+");",10);
  //Florent 
    previewhideUnderMenuId=id;
}

function repositionMenuDiv(id,idParent) {
  var parentDiv=dojo.byId('Menu'+idParent);
  var currentDiv=dojo.byId('UnderMenu'+id);
  var top = parentDiv.offsetTop;
  var totalHeight = dojo.byId('centerDiv').offsetHeight;
  currentDiv.style.maxHeight=(totalHeight-50)+'px';
  var height = currentDiv.offsetHeight;
  if(id==152 && top + height > totalHeight - 45){
    newTop = totalHeight - (top + height) - 10 ; 
    currentDiv.style.top = newTop+'px';
  }
  if (top + height > totalHeight - 30){
    newTop = totalHeight - (top + height) - 10 ; 
    currentDiv.style.top = newTop+'px';
  };
}

function hideMenu(id,delay){
  if(! delay){ 
    delay=300;
  }
  if(hideUnderMenuTimeout){
    clearTimeout(hideUnderMenuTimeout);
  }  
  hideUnderMenuId = id;
  hideUnderMenuTimeout=setTimeout("hideUnderMenu("+id+")",delay);
}

function hideUnderMenu(id){
  dojo.query(".hideUndermenu"+id+".dijitAccordionTitle2.reportTableColumnHeader2.largeReportHeader2").forEach(function(node, index, nodelist) {
    node.style.display="none";
   });
  dojo.byId('UnderMenu'+id).style.display="none";
  hideUnderMenuId = null;
}

function hidePreviewUnderMenu(id){
  if(previewhideUnderMenuId!=id && previewhideUnderMenuId!=null){
    hideUnderMenu(previewhideUnderMenuId);
  }
}
//end
function displayListOfApprover(id){
  var params="&objectId=" + id;
  loadDialog('dialogListApprover', null, true,params,null,true);
}

function readNotification (id){
  var url='../view/menuNotificationRead.php?id=' + id;
  dojo.xhrPost({
    url : url,
    handleAs : "text",
    load : function(data, args) {
      var objClass = 'objectClass';
      try {
         objClass = dojo.byId('objectClass').value;
      } catch(e) {
        objClass = 'Other';
      }
      if (objClass == 'Notification'){
        loadContent("objectMain.php?objectClass="+objClass,"centerDiv");
      }
      refreshNotificationTree(false);
      loadContent("../view/menuNotificationRead.php", "drawNotificationUnread");
    }
  });
}



// MTY - GENERIC DAY OFF
function addGenericBankOffDays(idCalendarDefinition) {
    if (checkFormChangeInProgress()) {
      showAlert(i18n('alertOngoingChange'));
      return;
    }

    var params="&idGenericBankOffDays=0";
    params += "&idCalendarDefinition="+idCalendarDefinition;
    params += "&addMode=true&editMode=false";
    
    loadDialog('dialogGenericBankOffDays',null,true,params,true);        
}

function editGenericBankOffDays(idGenericBankOffDays,
                                idCalendarDefinition,
                                name,
                                month,
                                day,
                                easterDay
                                ) {
    if (checkFormChangeInProgress()) {
      showAlert(i18n('alertOngoingChange'));
      return;
    }
    var params = "&idGenericBankOffDays="+idGenericBankOffDays;
    params+="&idCalendarDefinition="+idCalendarDefinition;
    params+="&name="+name;
    params+="&month="+month;
    params+="&day="+day;
    params+="&easterDay="+easterDay;
    params +="&addMode=false&editMode=true";
    loadDialog('dialogGenericBankOffDays',null,true,params,true);    
}

function saveGenericBankOffDays() {
  var formVar=dijit.byId('genericBankOffDaysForm');
  if (formVar.validate()) {
    loadContent("../tool/saveGenericBankOffDays.php", "resultDivMain", "genericBankOffDaysForm", true, 'calendarBankOffDays');
    dijit.byId('dialogGenericBankOffDays').hide();
  } else {
    showAlert(i18n("alertInvalidForm"));
  }
}

function removeGenericBankOffDays(id, name) {
    if (checkFormChangeInProgress()) {
        showAlert(i18n('alertOngoingChange'));
        return;
    }
    actionOK=function() {
        loadContent("../tool/removeGenericBankOffDay.php?idBankOffDay="+id, "resultDivMain", null, true, 'calendarBankOffDays');
    };
    msg=i18n('confirmDeleteGenericBankOffDay', new Array(name));
    showConfirm(msg, actionOK);
}
// MTY - GENERIC DAY OFF

function showDialogAutoSendReport(){
	setTimeout(loadDialog('dialogAutoSendReport',null,true,null,true), 200);
}

function saveAutoSendReport(){
	var formVar=dijit.byId('autoSendReportForm');
	  if (dijit.byId('destinationInput').get('value') == '' && dijit.byId('otherDestinationInput').get('value') == '') {
	      showAlert(i18n("errorNoReceivers"));
	      return;
	  }
	  if (formVar.validate()) {
		  loadContent("../tool/saveAutoSendReport.php", "resultDivMain", "autoSendReportForm", true, "report");
		  dijit.byId('dialogAutoSendReport').hide();
	  } else {
	    showAlert(i18n("alertInvalidForm"));
	  }
}

function refreshRadioButtonDiv(){
	loadContent("../tool/refreshButtonAutoSendReport.php", "radioButtonDiv", "autoSendReportForm");
}
		  
function saveModuleStatus(id,status) {
  if (id==12 && (status==false || status=='false')) {
      actionOK = function () {
        adminDisconnectAll(false);
        saveModuleStatusContinue(id,status);
      };
      actionKO = function () {
          dijit.byId("module_12").set("checked",true);
      };
      msg=i18n("thisActionWillDeleteAllsLeavesSystemElements")+"<br/><br/>"+i18n("AreYouSure")+" ?";
      showQuestion(msg, actionOK, actionKO);
  } else {
    saveModuleStatusContinue(id,status);
  }
}   

function saveModuleStatusContinue(id,status) {
  var url='../tool/saveModuleStatus.php?idModule='+id+'&status='+status;
  dojo.xhrGet({
    url : url,
    handleAs : "text",
    load : function(){
    }
  });
  dojo.query(".moduleClass.parentModule"+id).forEach(function(domNode){
    var name=domNode.getAttribute('widgetid');
    var widget=dijit.byId(name);
    if (widget) {
      var idSub=name.replace('module_','');
      var parentActive=dojo.byId('parentActive_'+idSub).value;
      if((parentActive==1 && status==true) || status==false){
        widget.set('checked',(status==true)?true:false);
        var url='../tool/saveModuleStatus.php?idModule='+idSub+'&status='+status;
        dojo.xhrGet({
          url : url,
          handleAs : "text",
          load : function(){
          }
        });
      }
    }
  });
  saveModuleStatusCheckParent(id);  
}

function saveModuleStatusCheckParent(id) {
  var wdgt=dijit.byId('module_'+id);
  var parent=wdgt.get('parent');
  var notActiveAlone=(dojo.byId('notActiveAlone_'+parent))?dojo.byId('notActiveAlone_'+parent).value:false;
  if (dojo.byId('module_'+parent)) {
    var oneOn=false;
    var allOff=true;
    dojo.query(".moduleClass.parentModule"+parent).forEach(function(domNode){
      var name=domNode.getAttribute('widgetid');
      var widget=dijit.byId(name);
      if (widget) {
        if (widget.get('checked')==true) {
          allOff=false;
          oneOn=true;
        }
      }
    });
    var status=(oneOn==true)?true:false;
    var widget=dijit.byId('module_'+parent);
    if (widget.get('checked')!=status && ((notActiveAlone=='1' && status==false) || status==true)) {
      widget.set('checked',status);
      var url='../tool/saveModuleStatus.php?idModule='+parent+'&status='+status;
      dojo.xhrGet({
        url : url,
        handleAs : "text",
        load : function(){         
        }
      });
    }
  }
}

function controlChar (){
  var requiredLength=dojo.byId('paramPwdLth').value;
  var gen= new RegExp(["^(?=.*[a-zA-Z0-9!@#$&()-`.+,/\"])"]);
  var min =new RegExp([ "^(?=.*[a-z])"]);
  var maj =new RegExp([ "^(?=.*[A-Z])"]);
  var num=new RegExp(["^(?=.*[0-9])"]);
  var char=new RegExp("(?=.*[!@#\$%\^&\*\\/\~])");
  var progress=dojo.byId('progress');
  var value=0;
  var curpwd=dojo.byId('dojox_form__NewPWBox_0').value;
  addVal=[0,0,0,0];
  if (curpwd.length>=requiredLength) {
    addVal[0]=1;
    value+=1; 
  }
  if( min.test(curpwd) && maj.test(curpwd) ){
    addVal[1]=1;
    value+=1;    
  }
  if(num.test(curpwd)){
    addVal[2]=1;
    if (min.test(curpwd) || maj.test(curpwd) ) value+=1;
  } 
  if(char.test(curpwd)){
    addVal[3]=1;
    if (min.test(curpwd) || maj.test(curpwd) ) value+=1;
  }
  progress.value=value;
  var strength=dojo.byId('parmPwdSth').value;
  var enough=false;
  var msg=i18n('pwdRequiredStrength');
  if(strength==1){
    if (addVal[0]==1) enough=true;
  }else if(strength==2){
    if (addVal[0]==1 && addVal[1]==1) enough=true;
  }else if(strength==3){
    if (addVal[0]==1 && addVal[1]==1 && addVal[2]==1) enough=true; 
  }else if(strength==4){
    if (addVal[0]==1 && addVal[1]==1 && addVal[2]==1 && addVal[3]==1) enough=true;
  }
  if (addVal[0]==0 && strength>=1) msg+='<br/>&nbsp;-&nbsp;'+i18n("pwdErrorLength",[requiredLength]);
  if (addVal[1]==0 && strength>=2) msg+='<br/>&nbsp;-&nbsp;'+i18n("pwdErrorCase");
  if (addVal[2]==0 && strength>=3) msg+='<br/>&nbsp;-&nbsp;'+i18n("pwdErrorDijit");
  if (addVal[3]==0 && strength>=4) msg+='<br/>&nbsp;-&nbsp;'+i18n("pwdErrorChar");
  var strengthMsg=document.getElementById('strength');
  dojo.byId('passwordValidate').value=(enough)?'true':'false';
  dojo.byId('criteria').value=msg;
  require(["dijit/Tooltip", "dojo/domReady!"], function(Tooltip) {
    var node = dojo.byId('dojox_form__NewPWBox_0');
    if (enough) {
      Tooltip.hide(node);
      strengthMsg.innerHTML=i18n('pwdValidStrength');
      strengthMsg.style="color:green;";
    } else {      
      Tooltip.show(msg, node);
      strengthMsg.innerHTML=i18n('pwdInvalidStrength');
      strengthMsg.style="color:red;";
    }
  });
}

function refreshDataCloningCountDiv(userSelected){
	loadContent("../tool/refreshDataCloningCountDiv.php?userSelected="+userSelected, "labelDataCloningCountDiv", "addDataCloningForm");
}

function selectAllCheckBox(val){
  dojo.query(val).forEach(function(node, index, nodelist) {
      if(dijit.byId('dialogMailAll').get('checked')!=true){
        dijit.byId(node.getAttribute('widgetid')).set('checked', false);
      }else{
        dijit.byId(node.getAttribute('widgetid')).set('checked', true);
      }
    });
}

function saveContact(idFldVal,comboClass){
  var addVal=dojo.byId('objectId').value;
  var obj=dojo.byId('objectClass').value;
  var parm="operation=add&objectClass="+comboClass+"&listId="+idFldVal+"&class="+obj+"&addVal="+addVal;
  loadContent("../tool/saveContact.php?"+parm, "resultDivMain",null,true,"contact"+dojo.byId('objectClass'));
}

function removeContact(idFldVal){
  var obj=dojo.byId('objectClass').value;
  var parm="operation=remove&objectClass=Contact&objectId="+idFldVal+"&class="+obj;
  actionOK=function() {
    loadContent("../tool/removeContact.php?"+parm, "resultDivMain",null,true,"contact"+dojo.byId('objectClass'));
  };
  msg=i18n('confirmDissociate', new Array(i18n('Contact'),idFldVal));
  showConfirm(msg, actionOK);
}
//End

function showDisplayModule(id,total){
  if(dojo.byId("displayModule"+id).style.display=="block"){
      dojo.byId("moduleTitle_"+id).style.width=260+'px';
      dojo.byId("displayModule"+id).style.display="none";
  }else{
    for (var i=1; i <= total; i++) {
      if(dojo.byId("moduleTitle_"+i)){
        if(dojo.byId("moduleTitle_"+i).style.width==290+'px'){
          dojo.byId("moduleTitle_"+i).style.width=260+'px';
        }
      }
      if(dojo.byId("displayModule"+i)){
        if(dojo.byId("displayModule"+i).style.display=="block"){
          dojo.byId("displayModule"+i).style.display="none";
          dojo.byId("displayModule"+i).style.visibility = 'hidden';
          dojo.byId("displayModule"+i).style.opacity = 0;
        }
      }
    }
    if(dojo.byId("displayModule"+id)){
      dojo.byId("displayModule"+id).style.display="block";
      dojo.byId("displayModule"+id).style.visibility="visible";
      dojo.byId("displayModule"+id).style.opacity=1;
    }
    dojo.byId("moduleTitle_"+id).style.width=290+'px';
  }
}

function filterMenuModule(id,nbTotal){
  var reset = 0;
  for (var i=1; i <= 7; i++) {
    if(dojo.hasClass(dojo.byId("menuFilterModuleTop"+i),'menuBarItemSelectedModule')){
      if(id==i){
        reset = 1;
      }
      dojo.removeClass(dojo.byId("menuFilterModuleTop"+i),"menuBarItemSelectedModule");
      dojo.removeClass(dojo.byId("menuFilterModuleTopIcon"+i),"menuFilterModuleTopIcon");
    }
  }
  if(reset==0){
    dojo.addClass(dojo.byId("menuFilterModuleTop"+id),"menuBarItemSelectedModule");
    dojo.addClass(dojo.byId("menuFilterModuleTopIcon"+id),"menuFilterModuleTopIcon");
  }else{
    id=1;
    dojo.addClass(dojo.byId("menuFilterModuleTop"+id),"menuBarItemSelectedModule");
    dojo.addClass(dojo.byId("menuFilterModuleTopIcon"+id),"menuFilterModuleTopIcon");
  }
  
  if(id==2){
    var tab = [1,9,16,22];
  }else if(id==3){
    var tab = [2,16];
  }else if(id==4){
    var tab = [4,8,9,10];
  }else if(id==5){
    var tab = [5,6,7,19,20];
  }else if(id==6){
    var tab = [17,13,15];
  }
  for (var i=1; i <= nbTotal; i++) {
    if(id==1){
      if(dojo.byId("moduleMenuDiv_"+i)){
        dojo.byId("moduleMenuDiv_"+i).style.display="block";
      }
    }else{
      if(dojo.byId("moduleMenuDiv_"+i)){
        if(tab.indexOf(i) !== -1){
          dojo.byId("moduleMenuDiv_"+i).style.display="block";
        }else{
          dojo.byId("moduleMenuDiv_"+i).style.display="none";
          if(dojo.byId("displayModule"+i).style.display=="block"){
            dojo.byId("displayModule"+i).style.display="none";
            dojo.byId("moduleTitle_"+i).style.width=260+'px';
          }
        }
      }
    }
  }
}

function filterMenuModuleDisable(nbTotal){
  for (var i=1; i <= 6; i++) {
    if(dojo.hasClass(dojo.byId("menuFilterModuleTop"+i),'menuBarItemSelectedModule')){
      dojo.removeClass(dojo.byId("menuFilterModuleTop"+i),"menuBarItemSelectedModule");
      dojo.removeClass(dojo.byId("menuFilterModuleTopIcon"+i),"menuFilterModuleTopIcon");
    }
  }
  var reset = 0;
  if(dojo.hasClass(dojo.byId("menuFilterModuleTop7"),'menuBarItemSelectedModule')){
    reset = 1;
  }
  if(reset==0){
    dojo.addClass(dojo.byId("menuFilterModuleTop7"),"menuBarItemSelectedModule");
    dojo.addClass(dojo.byId("menuFilterModuleTopIcon7"),"menuFilterModuleTopIcon");
    for (var i=1; i <= nbTotal; i++) {
      if(dojo.byId("moduleTitle_"+i)){
        if(dojo.hasClass(dojo.byId("moduleMenuDiv_"+i),'activeModuleMenu')){
          dojo.byId("moduleMenuDiv_"+i).style.display="none";
          if(dojo.byId("displayModule"+i).style.display=="block"){
            dojo.byId("displayModule"+i).style.display="none";
            dojo.byId("moduleTitle_"+i).style.width=260+'px';
          }
        }else{
          dojo.byId("moduleMenuDiv_"+i).style.display="block";
        }
      }
    }
  }else{
    filterMenuModule(1,nbTotal);
  }
}

function changeSpeedAnimation (val){
  dojo.byId('animationSpeed').value=val;
  dijit.byId('lowAnimation').selected='false';
  dijit.byId('medAnimation').selected='false';
  dijit.byId('fastAnimation').selected='false';
  
  switch(val){
  case 'Low':
      dijit.byId('lowAnimation').selected='true';
    break;
  case 'Med':
      dijit.byId('medAnimation').selected='true';
    break;
  case 'Fast':
      dijit.byId('fastAnimation').selected='true';
    break;
  }
  saveUserParameter('animationSpeedMode',val);
}

function multipleUpadteSelectAtribute(value) {
  if (value) {
    filterStartInput=true;
    dijit.byId('idMultipleUpdateAttribute').store.fetchItemByIdentity({
      identity : value,
      onItem : function(item) {
        var dataType=dijit.byId('idMultipleUpdateAttribute').store.getValue(
            item, "dataType", "inconnu");
        if(value=="refTypeIncome" || value=="refTypeExpense"){
          dataType="list";
        }
        var datastoreOperator=new dojo.data.ItemFileReadStore({
          url : '../tool/jsonList.php?listType=operator&actualView=MultipleUpadate&dataType=' + dataType
        });
        var storeOperator=new dojo.store.DataStore({
          store : datastoreOperator
        });
        storeOperator.query({
          id : "*"
        });
        dojo.byId('multipleUpdateOperateur').visibility = 'visible';
        if(dataType!='textarea'){
          dojo.byId('isLongText').value="";
          if(dojo.byId('multipleUpdateOperateur').firstChild.innerHTML==undefined || dojo.byId('multipleUpdateOperateur').firstChild.innerHTML!=i18n('replaceMultipleUpadte') ){
            var spanVal=document.createElement('span');
            spanVal.setAttribute('style','position:relative;');
            spanVal.innerHTML=i18n('replaceMultipleUpadte');
            if(dojo.byId('multipleUpdateOperateur').firstChild.innerHTML!=undefined )dojo.byId('multipleUpdateOperateur').removeChild(dojo.byId('multipleUpdateOperateur').firstChild);
            dojo.byId('multipleUpdateOperateur').insertAdjacentElement('afterbegin',spanVal);
          }
        }
        dojo.byId('dataTypeSelected').value=dataType;
        if (dataType == "bool") {
          filterType="bool";
          dojo.style(dijit.byId('multipleUpdateColorButton').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('newMultipleUpdateValue').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('newMultipleUpdateValueNum').domNode,{
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateValueList').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('showDetailInMultipleUpdate').domNode, {
            display : 'none'
          });
          if (dijit.byId('multipleUpdateValueCheckboxSwitch')) { 
            dojo.style(dijit.byId('multipleUpdateValueCheckboxSwitch').domNode, {
              display : 'block'
            });
            dijit.byId('multipleUpdateValueCheckbox').set('value', 'off');
          } else {
            dojo.style(dijit.byId('multipleUpdateValueCheckbox').domNode, {
              display : 'block'
            });
            dijit.byId('multipleUpdateValueCheckbox').set('checked', '');
          }
          dojo.style(dijit.byId('multipleUpdateValueDate').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateTextArea').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateValueTime').domNode, {
            display : 'none'
          });
        }else if(dataType == "color"){
          filterType="color";
          dojo.style(dijit.byId('multipleUpdateColorButton').domNode, {
            display : 'block'
          });
          dojo.style(dijit.byId('newMultipleUpdateValue').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('newMultipleUpdateValueNum').domNode,{
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateValueList').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('showDetailInMultipleUpdate').domNode, {
            display : 'none'
          });
          if (dijit.byId('multipleUpdateValueCheckboxSwitch')) { 
            dojo.style(dijit.byId('multipleUpdateValueCheckboxSwitch').domNode, {
              display : 'none'
            });
            dijit.byId('multipleUpdateValueCheckbox').set('value', 'off');
          } else {
            dojo.style(dijit.byId('multipleUpdateValueCheckbox').domNode, {
              display : 'none'
            });
            dijit.byId('multipleUpdateValueCheckbox').set('checked', '');
          }
          dojo.style(dijit.byId('multipleUpdateValueDate').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateTextArea').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateValueTime').domNode, {
            display : 'none'
          });
        } else if (dataType == "decimal" || dataType=="numeric") {
          filterType=dataType;
          dojo.style(dijit.byId('multipleUpdateColorButton').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('newMultipleUpdateValue').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('newMultipleUpdateValueNum').domNode,{
            display : 'block'
          });
          dojo.style(dijit.byId('multipleUpdateValueList').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('showDetailInMultipleUpdate').domNode, {
            display : 'none'
          });
          if (dijit.byId('multipleUpdateValueCheckboxSwitch')) { 
            dojo.style(dijit.byId('multipleUpdateValueCheckboxSwitch').domNode, {
              display : 'none'
            });
            dijit.byId('multipleUpdateValueCheckbox').set('value', 'off');
          } else {
            dojo.style(dijit.byId('multipleUpdateValueCheckbox').domNode, {
              display : 'none'
            });
            dijit.byId('multipleUpdateValueCheckbox').set('checked', '');
          }
          dojo.style(dijit.byId('multipleUpdateValueDate').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateTextArea').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateValueTime').domNode, {
            display : 'none'
          });
        } else if (dataType == "list") {
          filterType="list";
          var extraUrl="";
          if (value == 'idTargetVersion' || value == 'idTargetProductVersion' || value == 'idOriginalProductVersion') {
            value='idProductVersion';
            extraUrl='&critField=idle&critValue=all';
          } else if (value == 'idTargetComponentVersion' || value == 'idOriginalComponentVersion') {
            value='idComponentVersion';
            extraUrl='&critField=idle&critValue=all';
          }
          var urlListFilter='../tool/jsonList.php?listType=list&dataType='+value+'&actualView=MultipleUpadate';

          if (typeof currentSelectedProject!='undefined' && currentSelectedProject!='' && currentSelectedProject!='*') {
          if (value=='idActivity') {
              urlListFilter+='&critField=idProjectSub&critValue='+currentSelectedProject;
            } if (value=='idComponent') {
              // noting
            } else {
              urlListFilter+='&critField=idProject&critValue='+currentSelectedProject;
            }
            if (extraUrl=='&critField=idle&critValue=all') {
              extraUrl=='&critField1=idle&critValue1=all';
            }
          }
          if (extraUrl!="") {
            urlListFilter+=extraUrl;
          }  
          var tmpStore=new dojo.data.ItemFileReadStore({
            url : urlListFilter
          });
          var mySelect=dojo.byId("multipleUpdateValueList");
          mySelect.options.length=0;
          var nbVal=0;
          if(dijit.byId('idMultipleUpdateAttribute').getValue()=="idBusinessFeature"){
            var listId = "";
            tmpStore.fetch({
                query : {
                  id : "*"
                },
                onItem : function(item) {
                  listId += (listId != "") ? '_' : '';
                    listId += parseInt(tmpStore.getValue(item, "id", ""), 10) + '';
                    nbVal++;
                },
                onError : function(err) {
                  console.info(err.message);
                },
                onComplete : function() { 
                  dojo.xhrGet({
                  url : '../tool/getProductNameFromBusinessFeature.php?listId=' + listId,
                handleAs : "text",
                load: function(data){
                  var listName = JSON.parse(data);
                  tmpStore.fetch({
                          query : {
                            id : "*"
                          },
                          onItem : function(item) {
                            mySelect.options[mySelect.length]=new Option(tmpStore.getValue(item, "name", "") + " (" + listName[tmpStore.getValue(item, "id", "")] + ")", tmpStore.getValue(item, "id", ""));
                          },
                          onError : function(err) {
                            console.info(err.message);
                          }
                        });
                }
                  });
                 }
              });
          }else{
            tmpStore.fetch({
                  query : {
                    id : "*"
                  },
                  onItem : function(item) {
                    mySelect.options[mySelect.length]=new Option(tmpStore.getValue(
                        item, "name", ""), tmpStore.getValue(item, "id", ""));
                    nbVal++;
                  },
                  onError : function(err) {
                    console.info(err.message);
                  }
                });
          }
          dojo.removeAttr('multipleUpdateValueList','multiple');
          dojo.style(dijit.byId('multipleUpdateColorButton').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('newMultipleUpdateValue').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('newMultipleUpdateValueNum').domNode,{
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateValueList').domNode, {
            display : 'block'
          });
          dojo.style(dijit.byId('showDetailInMultipleUpdate').domNode, {
            display : 'block'
          });
          dijit.byId('showDetailInMultipleUpdate').set('value', item.id);
          dijit.byId('multipleUpdateValueList').reset();
          dojo.style(dijit.byId('multipleUpdateValueCheckbox').domNode, {
            display : 'none'
          });
          if (dijit.byId('multipleUpdateValueCheckboxSwitch')) { 
            dojo.style(dijit.byId('multipleUpdateValueCheckboxSwitch').domNode, {
              display : 'none'
            });
          }
          dojo.style(dijit.byId('multipleUpdateValueDate').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateTextArea').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateValueTime').domNode, {
            display : 'none'
          });
        } else if (dataType == "date" || dataType=="datetime") {
          filterType="date";
          dojo.style(dijit.byId('multipleUpdateColorButton').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('newMultipleUpdateValue').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('newMultipleUpdateValueNum').domNode,{
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateValueList').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('showDetailInMultipleUpdate').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateValueCheckbox').domNode, {
            display : 'none'
          });
          if (dijit.byId('multipleUpdateValueCheckboxSwitch')) { 
            dojo.style(dijit.byId('multipleUpdateValueCheckboxSwitch').domNode, {
              display : 'none'
            });
          }
          dojo.style(dijit.byId('multipleUpdateTextArea').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateValueDate').domNode, {
            display : 'block'
          });
          if(dataType=="datetime"){
            dojo.style(dijit.byId('multipleUpdateValueTime').domNode, {
              display : 'block'
            });
          }
          dijit.byId('multipleUpdateValueDate').reset();
        } else if (dataType=="textarea" || dataType=="note"){
          dojo.byId('isLongText').value="true";
          dojo.style(dijit.byId('multipleUpdateTextArea').domNode, {
            display : 'block'
          });
          if(dojo.byId('multipleUpdateOperateur').firstChild.innerHTML==undefined || dojo.byId('multipleUpdateOperateur').firstChild.innerHTML!=i18n('addMultipleUpdate')){
            var spanVal=document.createElement('span');
            spanVal.setAttribute('style','position:relative;top:10px;');
            spanVal.innerHTML=i18n('addMultipleUpdate');
            if(dojo.byId('multipleUpdateOperateur').firstChild.innerHTML!=undefined )dojo.byId('multipleUpdateOperateur').removeChild(dojo.byId('multipleUpdateOperateur').firstChild);
            dojo.byId('multipleUpdateOperateur').insertAdjacentElement('afterbegin',spanVal);
          }
          dojo.byId('multipleUpdateOperateur').visibility = 'hidden';
          dojo.style(dijit.byId('multipleUpdateColorButton').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('newMultipleUpdateValue').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('newMultipleUpdateValueNum').domNode,{
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateValueList').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('showDetailInMultipleUpdate').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateValueCheckbox').domNode, {
            display : 'none'
          });
          if (dijit.byId('multipleUpdateValueCheckboxSwitch')) { 
            dojo.style(dijit.byId('multipleUpdateValueCheckboxSwitch').domNode, {
              display : 'none'
            });
          }
          dojo.style(dijit.byId('multipleUpdateValueDate').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateValueTime').domNode, {
            display : 'none'
          });
        }else {
          filterType="text";
          dojo.style(dijit.byId('multipleUpdateColorButton').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('newMultipleUpdateValue').domNode, {
            display : 'block'
          });
          dojo.style(dijit.byId('newMultipleUpdateValueNum').domNode,{
            display : 'none'
          });
          dijit.byId('newMultipleUpdateValue').reset();
          dijit.byId('newMultipleUpdateValueNum').reset();
          dojo.style(dijit.byId('multipleUpdateValueList').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('showDetailInMultipleUpdate').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateValueCheckbox').domNode, {
            display : 'none'
          });
          if (dijit.byId('multipleUpdateValueCheckboxSwitch')) { 
            dojo.style(dijit.byId('multipleUpdateValueCheckboxSwitch').domNode, {
              display : 'none'
            });
          }
          dojo.style(dijit.byId('multipleUpdateValueDate').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateTextArea').domNode, {
            display : 'none'
          });
          dojo.style(dijit.byId('multipleUpdateValueTime').domNode, {
            display : 'none'
          });
        }
      },
      onError : function(err) {
        dojo.style(dijit.byId('multipleUpdateColorButton').domNode, {
          display : 'none'
        });
        dojo.byId('multipleUpdateOperateur').visibility = 'hidden';
        dojo.style(dijit.byId('newMultipleUpdateValue').domNode, {
          display : 'none'
        });
        dojo.style(dijit.byId('newMultipleUpdateValueNum').domNode,{
          display : 'none'
        });
        dojo.style(dijit.byId('newMultipleUpdateValueueList').domNode, {
          display : 'none'
        });
        dojo.style(dijit.byId('showDetailInMultipleUpdate').domNode, {
          display : 'none'
        });
        dojo.style(dijit.byId('multipleUpdateValueCheckbox').domNode, {
          display : 'none'
        });
        if (dijit.byId('multipleUpdateValueCheckboxSwitch')) { 
          dojo.style(dijit.byId('multipleUpdateValueCheckboxSwitch').domNode, {
            display : 'none'
          });
        }
        dojo.style(dijit.byId('multipleUpdateValueDate').domNode, {
          display : 'none'
        });
        dojo.style(dijit.byId('multipleUpdateTextArea').domNode, {
          display : 'none'
        });
        // hideWait();
      }
    });
    dijit.byId('newMultipleUpdateValueNum').reset();
    dijit.byId('newMultipleUpdateValue').reset();
    dijit.byId('multipleUpdateValueList').reset();
    dijit.byId('multipleUpdateValueCheckbox').reset();
    if (dijit.byId('multipleUpdateValueCheckboxSwitch')) { dijit.byId('multipleUpdateValueCheckboxSwitch').reset();}
    dijit.byId('multipleUpdateValueDate').reset();
    dijit.byId('multipleUpdateTextArea').reset();
    
  } else {
    dojo.byId('multipleUpdateOperateur').visibility = 'hidden';
    dojo.style(dijit.byId('multipleUpdateColorButton').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('newMultipleUpdateValue').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('newMultipleUpdateValueNum').domNode,{
      display : 'none'
    });
    dojo.style(dijit.byId('multipleUpdateValueList').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('showDetailInMultipleUpdate').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('multipleUpdateValueCheckbox').domNode, {
      display : 'none'
    });
    if (dijit.byId('multipleUpdateValueCheckboxSwitch')) { 
      dojo.style(dijit.byId('multipleUpdateValueCheckboxSwitch').domNode, {
        display : 'none'
      });
    }
    dojo.style(dijit.byId('multipleUpdateValueDate').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('multipleUpdateValueTime').domNode, {
      display : 'none'
    });
    dojo.style(dijit.byId('multipleUpdateTextArea').domNode, {
      display : 'none'
    });
  }
}

function setLstDocumentRight(lst,val){
  var valueLst=dojo.byId(lst).value;
  if (valueLst.indexOf(val)!=-1)return;
  if(valueLst==''){
    dojo.byId(lst).value=val;
  }else{
    dojo.byId(lst).value=valueLst+','+val;
  }
}

var activFuncHideShowDropDiv=false;
function hideShowDropDiv(mode,subTaskRawId){
  event.preventDefault();
  var el=dojo.byId(subTaskRawId);
  divAttach=el.querySelector('.divAttachSubTask');
  if(dijit.byId('attachmentFileDirect'))dijit.byId('attachmentFileDirect').reset();
  if(mode=='show'){
      el.style.background="var(--color-button-background-selected)";
      el.style.opacity='50%';
      el.style.border=" 2px dashed grey";

      activFuncHideShowDropDiv=true;
  }else if(mode =='hide'){
    el.style.background="unset";
    el.style.opacity='unset';
    el.style.border="";
      activFuncHideShowDropDiv=false;
  }else {
    activFuncHideShowDropDiv=false;
    el.style.background="unset";
    el.style.opacity='unset';
    el.style.border="";
  }

}

function setDragAndDropAttachmentSubTask(destination,tableClass,rawClass,attachmentDivClass){
  var dest=dojo.byId(destination);
  var allTable=dest.querySelectorAll('.'+tableClass);
  
  allTable.forEach(function(table){
    var allRaw=table.querySelectorAll('.'+rawClass);
    allRaw.forEach(function(el){
      var divAttach=el.querySelector('.'+attachmentDivClass);
      if(divAttach.childNodes[1] && divAttach.childNodes[1].firstChild && divAttach.childNodes[1].firstChild.id){
        var idDiv=divAttach.childNodes[1].firstChild.id;
        dijit.byId(idDiv).reset();
        dijit.byId(idDiv).addDropTarget(el,false);
      }
      
    });
  });
}

function refreshSubTaskAttachment(idSubTask){
  loadDiv('../view/refreshSubTaskAttachmentDiv.php?idSubTask='+idSubTask ,'divAttachement_'+idSubTask);
}


function selectResources(type,target,project) {
  loadDialog('dialogSelectResources',null,true,'&type='+type+'&list='+dojo.byId(target).value+'&target='+target+'&project='+project,true);
}

function selectResourcesValidated(targeted,target2) {
  selectResourcesSelected.sync();
  var nodeList=selectResourcesSelected.getAllNodes();
  var arrayValues=new Array();
  for (var i=0; i < nodeList.length; i++) {
    arrayValues[i]=nodeList[i].getAttribute('userid');
  }
  var result = "";
  for (var i=0; i < nodeList.length; i++) {
    if(result==""){
      result += arrayValues[i];
    }else{
      result += ";"+arrayValues[i];
    }
  }
  var dest = target2+'Display';
  dojo.byId(targeted).value=result;
  dijit.byId(dest).set('value',result);
  setTimeout('selectResourcesTransformIdToName( \''+dest+'\')', 100);
  setTimeout("dijit.byId('dialogSelectResources').hide()", 200);
}

function selectResourcesTransformIdToName(target){
    dojo.xhrGet({
      url : '../tool/getSingleData.php?dataType=selectResourceTransformIdToName&idResource='+dijit.byId('paramTryToHackUserListDisplay').get('value'),
      handleAs : "text",
      load : function(data) {
         dijit.byId(target).setDisplayedValue(data);
      }
    });
}