<?php
// Get activities
$ch = curl_init('https://gewis.nl/api/activity/list');

curl_setopt($ch, CURLOPT_HTTPHEADER, array("X-Auth-Token: ". file_get_contents(__DIR__ ."/api-token.txt")));
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$ch_result = curl_exec($ch);
curl_close($ch);

$activities = json_decode($ch_result);

// Strip the array of activities from some privacy-sensitive information
for ($i = 0; $i < count($activities); $i++) {
    unset($activities[$i]->attendees);
    unset($activities[$i]->requireGEFLITST);
    unset($activities[$i]->fields);
}
echo json_encode($activities);
?>
