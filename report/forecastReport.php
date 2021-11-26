<?php 
/*** COPYRIGHT NOTICE *********************************************************
 *
 * Copyright 2009-2017 ProjeQtOr - Pascal BERNARD - support@projeqtor.org
 * Contributors : -
 * 
 * Most of properties are extracted from Dojo Framework.
 *
 * This file is part of ProjeQtOr.
 * 
 * ProjeQtOr is free software: you can redistribute it and/or modify it under 
 * the terms of the GNU Affero General Public License as published by the Free 
 * Software Foundation, either version 3 of the License, or (at your option) 
 * any later version.
 * 
 * ProjeQtOr is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS 
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for 
 * more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with
 * ProjeQtOr. If not, see <http://www.gnu.org/licenses/>.
 *
 * You can get complete code of ProjeQtOr, other resource, help and information
 * about contributors at http://www.projeqtor.org 
 *     
 *** DO NOT REMOVE THIS NOTICE ************************************************/

include_once '../tool/projeqtor.php';

$paramProject = trim(RequestHandler::getId('idProject'));
$paramTeam = trim(RequestHandler::getId('idTeam'));
$idOrganization = trim(RequestHandler::getId('idOrganization'));
$paramYear = RequestHandler::getYear('yearSpinner');
$paramMonth = RequestHandler::getMonth('monthSpinner');
$paramWeek = RequestHandler::getValue('weekSpinner');

$user=getSessionUser();

$periodType=RequestHandler::getValue('periodType'); // not filtering as data as data is only compared against fixed strings
$periodValue='';
if (array_key_exists('periodValue',$_REQUEST))
{
	$periodValue=$_REQUEST['periodValue'];
	$periodValue=Security::checkValidPeriod($periodValue);
}

// Header
$headerParameters="";
if ($paramProject!="") {
  $headerParameters.= i18n("colIdProject") . ' : ' . htmlEncode(SqlList::getNameFromId('Project', $paramProject)) . '<br/>';
}
if ($idOrganization!="") {
  $headerParameters.= i18n("colIdOrganization") . ' : ' . htmlEncode(SqlList::getNameFromId('Organization',$idOrganization)) . '<br/>';
}
if ($paramTeam!="") {
  $headerParameters.= i18n("colIdTeam") . ' : ' . htmlEncode(SqlList::getNameFromId('Team', $paramTeam)) . '<br/>';
}
if ($periodType=='year' or $periodType=='month' or $periodType=='week') {
  $headerParameters.= i18n("year") . ' : ' . $paramYear . '<br/>';
}
//ADD qCazelles - Report fiscal year - Ticket #128
if ($periodType=='year' and $paramMonth!="01") {
  if (!$paramMonth ) {
    echo '<div style="background: #FFDDDD;font-size:150%;color:#808080;text-align:center;padding:20px">';
    echo i18n('messageNoData',array(i18n('month'))); // TODO i18n message
    echo '</div>';
    if (!empty($cronnedScript)) goto end; else exit;
  } else {
    $headerParameters.= i18n("startMonth") . ' : ' . i18n(date('F', mktime(0,0,0,$paramMonth,10))) . '<br/>';
  }
}
//END ADD qCazelles - Report fiscal year - Ticket #128
if ($periodType=='month') {
  $headerParameters.= i18n("month") . ' : ' . $paramMonth . '<br/>';
}
if ( $periodType=='week') {
  
  $headerParameters.= i18n("week") . ' : ' . $paramWeek . '<br/>';
}
if (isset($outMode) and $outMode=='excel') {
  $headerParameters.=str_replace('- ','<br/>',Work::displayWorkUnit()).'<br/>';
}

include "header.php";
$where="1=1";
$where.=($periodType=='week')?" and week='" . $periodValue . "'":'';
$where.=($periodType=='month')?" and month='" . $periodValue . "'":'';
if ($periodType=='year') {
  if (!$periodValue ) {
    echo '<div style="background: #FFDDDD;font-size:150%;color:#808080;text-align:center;padding:20px">';
    echo i18n('messageNoData',array(i18n('year'))); // TODO i18n message
    echo '</div>';
    if (!empty($cronnedScript)) goto end; else exit;
  }
  if ($paramMonth<10) $paramMonth='0'.intval($paramMonth);
  $where.=" and ((year='" . $periodValue . "' and month>='" . $periodValue.$paramMonth . "')".
          " or (year='" . ($periodValue + 1) . "' and month<'" . ($periodValue + 1) . $paramMonth . "'))";
}
if ($paramProject!='') {
  $where.=  " and idProject in " . getVisibleProjectsList(false, $paramProject); 
}
$order="idProject asc";
$work=new Work();
$lstWork=$work->getSqlElementsFromCriteria(null,false, $where, $order);
$workSum = array();
$activity = array();
$date = array();
foreach ($lstWork as $wrk){
  if(isset($workSum[$wrk->idResource][$wrk->idProject])){
    $workSum[$wrk->idResource][$wrk->idProject] += $wrk->work;
  }else{
    $workSum[$wrk->idResource][$wrk->idProject] = $wrk->work;
  }
  if(isset($activity[$wrk->idResource][$wrk->idProject])){
    $name = SqlList::getNameFromId($wrk->refType, $wrk->refId);
    if(strpos($activity[$wrk->idResource][$wrk->idProject],$name) === false){
      $activity[$wrk->idResource][$wrk->idProject] .= $name.' \n';
    }
  }else{
  	$name = SqlList::getNameFromId($wrk->refType, $wrk->refId);
  	$activity[$wrk->idResource][$wrk->idProject] = $name.' \n';
  }
  $date[$wrk->$periodType][$wrk->idResource] = $workSum[$wrk->idResource];
}
echo '<table style="width:95%;" align="center" '.excelName().'>';
echo '<tr>';
echo '<td style="width:10%" class="reportTableHeader"  '.excelFormatCell('header',20).'>' . i18n($periodType) . '</td>';
echo '<td style="width:5%" class="reportTableHeader"  '.excelFormatCell('header',20).'>' . i18n('resourceId') . '</td>';
echo '<td style="width:15%" class="reportTableHeader"  '.excelFormatCell('header',40).'>' . i18n('resourceName') . '</td>';
echo '<td style="width:5%" class="reportTableHeader"  '.excelFormatCell('header',20).'>' . i18n('projectId') . '</td>';
echo '<td style="width:25%" class="reportTableHeader"  '.excelFormatCell('header',40).'>' . i18n('projectName') . '</td>';
echo '<td style="width:10%" class="reportTableHeader"  '.excelFormatCell('header',20).'>' . i18n('work') . '</td>';
echo '<td style="width:30%" class="reportTableHeader"  '.excelFormatCell('header',60).'>' . i18n('Activity') . '</td>';
echo '</tr>';
foreach ($date as $month=>$workList){
  foreach ($workList as $idResource=>$projectList){
    foreach ($projectList as $idProject=>$work){
        $resourceId = SqlList::getFieldFromId('Resource', $idResource, 'resourceId');
        $resourceId = (!$resourceId)?$idResource:$resourceId;
        $resourceName = SqlList::getFieldFromId('Resource', $idResource, 'resourceName');
        $resourceName = (!$resourceName)?SqlList::getFieldFromId('Resource', $idResource, 'name'):$resourceName;
        $projectId = SqlList::getFieldFromId('Project', $idProject, 'projectId');
        $projectId = (!$projectId)?$idProject:$projectId;
        $projectName = SqlList::getFieldFromId('Project', $idProject, 'projectName');
        $projectName = (!$projectName)?SqlList::getFieldFromId('Project', $idProject, 'name'):$projectName;
        $activityList = $activity[$idResource][$idProject];
        echo '<tr>';
    	echo '<td style="width:10%" class="reportTableData"  '.excelFormatCell('data',null,null,null,null,'left',null,null,(($month)?$month:null)).'>' . $month . '</td>';
    	echo '<td style="width:5%" class="reportTableData"  '.excelFormatCell('data',null,null,null,null,'left',null,null,(($resourceId)?$resourceId:null)).'>' . $resourceId . '</td>';
    	echo '<td style="width:15%" class="reportTableData"  '.excelFormatCell('data',null,null,null,null,'left',null,null,(($resourceName)?$resourceName:null)).'>' . $resourceName . '</td>';
    	echo '<td style="width:5%" class="reportTableData"  '.excelFormatCell('data',null,null,null,null,'left',null,null,(($projectId)?$projectId:null)).'>' . $projectId . '</td>';
    	echo '<td style="width:25%" class="reportTableData"  '.excelFormatCell('data',null,null,null,null,'left',null,null,(($projectName)?$projectName:null)).'>' . $projectName . '</td>';
    	echo '<td style="width:10%" class="reportTableData"  '.excelFormatCell('data',null,null,null,null,'left',null,null,(($work)?$work:null)).'>' . $work . '</td>';
    	echo '<td style="width:30%" class="reportTableData"  '.excelFormatCell('data',null,null,null,null,'left',null,null,(($activityList)?htmlEncode($activityList):null)).'>' . htmlEncode($activityList) . '</td>';
    	echo '</tr>';
    }
  }
}
echo '</table>';
end: