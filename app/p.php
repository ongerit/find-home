<?php
require("cred.php");

// User information
$address = $_POST[address];
$city = $_POST[city];
$state = $_POST[state];
$zip = $_POST[zip];
$apiKey = API_KEY;

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=".$apiKey."&address=".$address."&citystatezip=".$city.$state.$zip."&rentzestimate=true",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "[{\"email\":\"ongerit+jm@gmailmk.com\",\"last_name\":null,\"first_name\":null}]",
  CURLOPT_HTTPHEADER => array(
    "cache-control: no-cache",
    "postman-token: 6a14019e-a31b-a5d8-07fe-5a7326f0eac2"
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
