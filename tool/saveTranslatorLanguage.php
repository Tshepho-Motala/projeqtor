<?php
/*
 * @author : mOlives
 */
require_once "../tool/projeqtor.php";


$objectClass=RequestHandler::getClass('translatorLanguageObjectClass',true);
$objectId=RequestHandler::getId('translatorLanguageObjectId',true);
$listId=RequestHandler::getValue('translatorLanguageListId',true);
$TranslatorLanguageClass=RequestHandler::getClass('translatorLanguageScopeClass',true);
$idLevelSKill = RequestHandler::getValue('translatorLanguageSkillLevelId',true);
$selectedId =  RequestHandler::getValue('translatorLanguageSelectedId',true);
Sql::beginTransaction();
$result="";

foreach ($listId as $id) {

    $ttl = new LocalizationTranslatorLanguage($selectedId); // if selected then update, else $selectedId is null then create new object
    $ttl->idTranslator = $objectId;
    $ttl->idLanguage = $id;
    $ttl->idLanguageSkillLevel = $idLevelSKill;
    $ttl->idUser = getSessionUser()->id;
    $ttl->creationDate = date('Y-m-d');
    $ttl->idle = 0;
    $res = $ttl->save();
    if (!$result) {
        $result=$res;
    } else if (stripos($res,'id="lastOperationStatus" value="OK"')>0 ) {
        if (stripos($result,'id="lastOperationStatus" value="OK"')>0 ) {
            $deb=stripos($res,'#');
            $fin=stripos($res,' ',$deb);
            $resId=substr($res,$deb, $fin-$deb);
            $deb=stripos($result,'#');
            $fin=stripos($result,' ',$deb);
            $result=substr($result, 0, $fin).','.$resId.substr($result,$fin);
        } else {
            $result=$res;
        }
    }

}

displayLastOperationStatus($result);



