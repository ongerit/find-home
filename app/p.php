<?php
require("cred.php");

// User information
$address = urlencode($_POST[address]);
$city = urlencode($_POST[city]);
$state = urlencode($_POST[state]);
$zip = urlencode($_POST[zip]);
$apiKey = API_KEY;

$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=".$apiKey."&address=".$address."&citystatezip=".$city."%20".$state."%20".$zip."&rentzestimate=true",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "",
  CURLOPT_HTTPHEADER => array(
    "cache-control: no-cache",
    "postman-token: 795dc1ab-3a95-4c15-ada7-44239def90d9"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curla);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}
