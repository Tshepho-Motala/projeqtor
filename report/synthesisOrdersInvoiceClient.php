<?php 
/*** COPYRIGHT NOTICE *********************************************************
 *
 * Copyright 2009-2017 ProjeQtOr - Pascal BERNARD - support@projeqtor.org
 * Contributors : -
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

// Header
include_once '../tool/projeqtor.php';
include_once('../tool/formatter.php');

$paramProject=trim(RequestHandler::getId('idProject',false));
$paramClient=trim(RequestHandler::getId('idClient',false));
$paramShowIdle = RequestHandler::getBoolean('showClosedItems');
$paramshowReference = RequestHandler::getBoolean('showReference');
// Header
$headerParameters="";
if ($paramProject!="") {
  $headerParameters.= i18n("colIdProject") . ' : ' . htmlEncode(SqlList::getNameFromId('Project', $paramProject)) . '<br/>';
}
if ($paramClient!="") {
  $headerParameters.= i18n("colIdClient") . ' : ' . htmlEncode(SqlList::getNameFromId('Client', $paramClient)) . '<br/>';
}

include "header.php";

//Request
$where=getAccesRestrictionClause('Project',false,false,true,true);
if ($paramProject!='') {
  $where.=  " and idProject in " . getVisibleProjectsList(true, $paramProject) ;
}
if( $paramClient !=''){
  $where.=  " and idClient = " . $paramClient ;
}
if(!$paramShowIdle){
  $where.=  " and idle = 0 " ;
}
$order=" idProject asc ";
$com = new Command();
$lstCmd = $com->getSqlElementsFromCriteria(null,false, $where, $order);
$tabCmd = array();
$tabIdCmd = array();
$tabBill = array();
$tabLink = array();

$link = new Link();
$whereLink = " ref1Type = 'Command' and ref2Type = 'Bill' or  ref1Type = 'Bill' and ref2Type = 'Command' ";
$lstLink = $link->getSqlElementsFromCriteria(null,false, $whereLink);

foreach ( $lstCmd as $cmd){
  $tabCmd[$cmd->idProject][$cmd->id] = $cmd ;
  $tabIdCmd[$cmd->id]=$cmd->id;
}

foreach ($lstLink as $lk){
  if($lk->ref2Type == 'Command' ){
    if(isset($tabIdCmd[$lk->ref2Id])){
      $tabBill[$lk->ref2Id][$lk->id]=$lk->ref1Id;
    }
  }
  if($lk->ref1Type == 'Command'){
    if(isset($tabIdCmd[$lk->ref1Id])){
      $tabBill[$lk->ref1Id][$lk->id]=$lk->ref2Id;
    }
  }
}
echo '<table  width="95%" align="center">';

$col1="20";
$col2="15";
if($paramshowReference){
  $col1="14.5";
  $col2="11.5";
}

$tabProject = array();
$tabProjectWbs = array();
foreach ($tabCmd as $idProject=>$cm){
  $tabProject[$idProject]=$idProject;
}
foreach ($tabProject as $idProj){
  $wbsSortable = SqlElement::getSingleSqlElementFromCriteria('ProjectPlanningElement', array('idProject'=>$idProj,'refType'=>'Project','refId'=>$idProj));
  $tabProjectWbs[$idProj]=$wbsSortable->wbsSortable;
}
asort($tabProjectWbs);
$tabCmdOrder = $tabCmd;
foreach ($tabCmdOrder as $idProject=>$cm){
  $tabCmdOrder[$tabProjectWbs[$idProject]][$idProject]=$cm;
  unset($tabCmdOrder[$idProject]);
}
ksort($tabCmdOrder);
//title    
echo'<tr>';
echo' <td class="reportTableHeader"  style="width:'.$col1.'%">'.ucfirst(i18n('colIdProject')).'</td>';
if($paramshowReference){
  echo' <td class="reportTableHeader"  style="width:'.$col2.'%">'.ucfirst(i18n('colReference')).'</td>';
}
echo' <td class="reportTableHeader"  style="width:'.$col2.'%">'.ucfirst(i18n('Command')).'</td>';
echo' <td class="reportTableHeader"  style="width:'.$col2.'%">'.ucfirst(i18n('commandAmount')).'</td>';
if($paramshowReference){
  echo' <td class="reportTableHeader"  style="width:'.$col2.'%">'.ucfirst(i18n('colReference')).'</td>';
}
echo' <td class="reportTableHeader"  style="width:'.$col2.'%">'.ucfirst(i18n('Invoice')).'</td>';
echo' <td class="reportTableHeader"  style="width:'.$col2.'%">'.ucfirst(i18n('colBillAmount')).'</td>';
echo' <td class="reportTableHeader"  style="width:'.$col2.'%">'.ucfirst(i18n('restOfCommand')).'</td>';
echo'</tr>';
foreach ($tabCmdOrder as $wbs=>$objId){
  foreach ($objId as $obj){
    foreach ($obj as $val){
      $nbRowSpan = 1;
      $commandRest = $val->untaxedAmount;
      if(isset($tabBill[$val->id])){
        $nbRowSpan = 0;
        foreach ($tabBill[$val->id] as $idTab=>$billId){
          $newBill = new Bill($billId);
          if($newBill->cancelled){
            unset($tabBill[$val->id][$idTab]);
            if(!$tabBill[$val->id])unset($tabBill[$val->id]);
            continue;
          }
          $nbRowSpan++;
          $commandRest -= $newBill->untaxedAmount;
        }
      }
      echo'<tr>';
      if($nbRowSpan==0)$nbRowSpan=1;
      echo' <td  rowspan="'.$nbRowSpan.'" class="reportTableData"  style="padding:4px;text-align:left;width:'.$col1.'%;">'.SqlList::getNameFromId('Project', $val->idProject).'</td>';
      if($paramshowReference){
        echo' <td  rowspan="'.$nbRowSpan.'" class="reportTableData"  style="padding:4px;text-align:left;width:'.$col2.'%;">'.$val->reference.'</td>';
      }
      echo' <td  rowspan="'.$nbRowSpan.'" class="reportTableData"  style="padding:4px;text-align:left;width:'.$col2.'%">'.$val->name.'</td>';
      echo' <td  rowspan="'.$nbRowSpan.'" class="reportTableData"  style="padding:4px;width:'.$col2.'%;text-align:right;">'.htmlDisplayCurrency($val->untaxedAmount).'</td>';
      if(isset($tabBill[$val->id])){
        $i=0;
        foreach ($tabBill[$val->id] as $billId){
          $newBill = new Bill($billId);
          if($i>0)echo' <tr> ';
          $i++;
          if($paramshowReference){
            echo' <td  class="reportTableData"  style="padding:4px;text-align:left;width:'.$col2.'%;">'.$newBill->reference.'</td>';
          }
          echo' <td   class="reportTableData"  style="padding:4px;text-align:left;width:'.$col2.'%;">'.$newBill->name.'</td>';
          echo' <td   class="reportTableData"  style="padding:4px;width:'.$col2.'%;text-align:right;">'.htmlDisplayCurrency($newBill->untaxedAmount).'</td>';
          $backGround = "";
          if($commandRest < 0)$backGround = " background:#FFDDDD;" ;
          if($i==1){
            echo' <td  rowspan="'.$nbRowSpan.'" class="reportTableData"  style="padding:4px;width:'.$col2.'%;text-align:right;'.$backGround.'">'.htmlDisplayCurrency($commandRest).'</td>';
          }
          echo'</tr>';
        }
      }else{
        if($paramshowReference){
          echo' <td  class="reportTableData"  style="width:16%"></td>';
        }
        echo' <td  rowspan="'.$nbRowSpan.'" class="reportTableData"  style="padding:4px;width:'.$col2.'%"></td>';
        echo' <td  rowspan="'.$nbRowSpan.'" class="reportTableData"  style="padding:4px;width:'.$col2.'%"></td>';
        $backGround = "";
        if($commandRest < 0)$backGround = " background:#FFDDDD;" ;
        echo' <td  rowspan="'.$nbRowSpan.'" class="reportTableData"  style="padding:4px;width:'.$col2.'%;text-align:right;'.$backGround.'">'.htmlDisplayCurrency($commandRest).'</td>';
        echo'</tr>';
      }
    }
  }
}


echo '</table>';

?>
