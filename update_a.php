<?php
  $ar = fopen("vec.txt", "w") or
  die("Problemas en la creacion var ar");
  fputs($ar, $_POST['val']);
  fclose($ar);

  $at = fopen("vec.txt", "r") or
  die("No se pudo abrir el archivo var at");
  $linea = '' ;
  while (!feof($at)) {
    $linea = fgets($at);
  }
  fclose($at);
  echo $linea ;
 ?>
