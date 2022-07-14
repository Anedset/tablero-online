<?php
  $ar = fopen("vec.txt", "r") or
  die("No se pudo abrir el archivo");
  $linea = '' ;
  while (!feof($ar)) {
    $linea = fgets($ar);
  }
  fclose($ar);
  echo $linea ;
 ?>
