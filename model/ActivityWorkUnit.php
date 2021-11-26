<?php
/*
 *	@author: qCazelles 
 */

require_once('_securityCheck.php');
class ActivityWorkUnit extends SqlElement {
	public $id;   
  public $refType;
  public $refId;
  public $idWorkUnit;
  public $idComplexity;
  public $quantity;
  public $idWorkCommand;
  	
	private static $_databaseCriteria = array();
	/** ========================================================================
	 * Return the specific database criteria
	 * @return the databaseTableName
	 */
	protected function getStaticDatabaseCriteria() {
	  return self::$_databaseCriteria;
	}
	
	/** ==========================================================================
	 * Construct
	 * @return void
	 */
	function __construct($id = NULL, $withoutDependentObjects=false) {
		parent::__construct($id,$withoutDependentObjects);
	}
	
	
	public function control() {
	  $result = "";
	  $old = $this->getOld(false);
	  
	  $defaultControl=parent::control();
    if ($defaultControl!='OK') {
      $result.=$defaultControl;
    }
	  
	  if($this->idWorkCommand and $this->idWorkCommand != " " and $this->idWorkCommand != ''){
	    $workCommand = new WorkCommand($this->idWorkCommand);
	    $newWorkCommandDone = new WorkCommandDone();
	    $lstWorkCommand = $newWorkCommandDone->getSqlElementsFromCriteria(array('idWorkCommand'=>$this->idWorkCommand,'idCommand'=>$workCommand->idCommand));
	    $quantity = $this->quantity;
	    foreach ($lstWorkCommand as $comVal){
	      if($comVal->refType == 'Activity' and $comVal->idActivityWorkUnit == $this->id){
	        continue;
	      }else{
	        $quantity += $comVal->doneQuantity;
	      }
	    }
	    if($quantity > $workCommand->commandQuantity){
	      $result.='<br/>' . i18n('errorQuantityCantBeSuperiorThanCommand');
	    }
	  }
	  
	  if ($result == "") {
	    $result = 'OK';
	  }
	  
	  return $result;
	}
	
	public function save() {
	  $result = parent::save();
	  
	  $act = new Activity($this->refId);
	  $CaReplaceValidCost= Parameter::getGlobalParameter('CaReplaceValidCost');
	  if($CaReplaceValidCost=='YES'){
	    $act->ActivityPlanningElement->validatedCost = 0;
	  }
	  $activityWorkUnit = new ActivityWorkUnit();
	  $lstActWorkUnit = $activityWorkUnit->getSqlElementsFromCriteria(array('refType'=>'Activity','refId'=>$act->ActivityPlanningElement->refId));
	  $act->ActivityPlanningElement->validatedWork = 0;
	  $act->ActivityPlanningElement->revenue = 0;
	  foreach ($lstActWorkUnit as $actWork){
	    $complexityVal = SqlElement::getSingleSqlElementFromCriteria('ComplexityValues', array('idWorkUnit'=>$actWork->idWorkUnit,'idComplexity'=>$actWork->idComplexity));
	    $act->ActivityPlanningElement->validatedWork += $complexityVal->charge*$actWork->quantity;
	    $act->ActivityPlanningElement->revenue += $complexityVal->price*$actWork->quantity;
	     
	    $ass = new Assignment();
	    $lstAss = $ass->getSqlElementsFromCriteria(array('refType'=>'Activity','refId'=>$act->ActivityPlanningElement->refId));
	    $totalValidatedWork = 0;
	    foreach ($lstAss as $asVal){
	      if ($act->ActivityPlanningElement->idle) continue;
	      $totalValidatedWork += $asVal->assignedWork;
	    }
	    //if($totalValidatedWork < $act->ActivityPlanningElement->validatedWork and $totalValidatedWork>0 ){
	    if( $totalValidatedWork>0 ){
	      $factor = $act->ActivityPlanningElement->validatedWork / $totalValidatedWork;
	      $sumAssignedWork=0;
	      $sumLeftWork=0;
	      $sumAssignedCost=0;
	      $sumLeftCost=0;
	      foreach ($lstAss as $asVal){
	        if (! $asVal->idle) {
	          $asVal->_skipDispatch=true;
	          $newLeftWork = ($asVal->assignedWork*$factor) - ($asVal->assignedWork) ;
	          $asVal->assignedWork = round($asVal->assignedWork*$factor,3);
	          $asVal->leftWork = round($asVal->leftWork+$newLeftWork,3);
	          if($asVal->leftWork < 0)$asVal->leftWork=0;
	          $asVal->save();
	        }
	        $sumAssignedWork+=$asVal->assignedWork;
	        $sumLeftWork+=$asVal->leftWork;
	        $sumAssignedCost+=$asVal->assignedCost;
	        $sumLeftCost+=$asVal->leftCost;
	      }
	      $act->ActivityPlanningElement->assignedWork=$sumAssignedWork;
	      $act->ActivityPlanningElement->leftWork=$sumLeftWork;
	      $act->ActivityPlanningElement->plannedWork=$act->ActivityPlanningElement->realWork+$act->ActivityPlanningElement->leftWork;
	      $act->ActivityPlanningElement->assignedCost=$sumAssignedCost;
	      $act->ActivityPlanningElement->leftCost=$sumLeftCost;
	      $act->ActivityPlanningElement->plannedCost=$act->ActivityPlanningElement->realCost+$act->ActivityPlanningElement->leftCost;
	      $act->ActivityPlanningElement->_workHistory=true; // Will force to update data (it's a hack)
	    }
	    if($CaReplaceValidCost=='YES'){
	      $act->ActivityPlanningElement->validatedCost += $complexityVal->price*$actWork->quantity;
	    }
	  }
	  $act->save();
	  
	  return $result;
	}
	

	/** ==========================================================================
	 * Destructor
	 * @return void
	 */
	function __destruct() {
		parent::__destruct();
	}
	/**
	 * ========================================================================
	 * Return the specific databaseColumnName
	 *
	 * @return the databaseTableName
	 */
	
	
}