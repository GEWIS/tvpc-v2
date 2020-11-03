<?php
/*
Ik vind PHP echt, echt niet leuk. Echter worden de infima rechtstreeks van de server gepakt
en Javascript kan dat niet...
*/
echo json_encode(str_replace(array("\n", "\r"), ' ', file_get_contents("/etc/meldingen/infima")));
?>
