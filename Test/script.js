import {check, sleep} from "k6";
import http from "k6/http";

export let options = {
  stages: [
    {durations: '15s', target: 100},
    {duration: '30s', target: 100},
    {duration: '15s', target: 0}
  ],
}

export default function script() {

  http.get(`http://localhost:8080/reviews?product_id=${61575}&count=50&sort=newest`);
  sleep(1);

};