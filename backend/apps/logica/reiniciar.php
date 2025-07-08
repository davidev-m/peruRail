<?php
    header('Content-Type:application/json');
    session_start();
    session_unset();   
    echo json_encode(['success' => true]);
?>