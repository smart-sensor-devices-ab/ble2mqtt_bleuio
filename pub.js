const clientId = 'hibouair_' + Math.random().toString(16).substr(2, 8)
import * as my_dongle from 'bleuio'
import 'regenerator-runtime/runtime'
const sensorID = '0578E0'
import * as mqtt from "mqtt" 
document.getElementById('connect').addEventListener('click', function(){
  my_dongle.at_connect()
})
document.getElementById('deviceinfo').addEventListener('click', function(){
  my_dongle.ati().then((data)=>console.log(data))
})

const getTheBLEData = ( async()=>{
  return my_dongle.at_dual().then(()=>{
    return my_dongle.at_findscandata(sensorID,6).then((x)=>{
      let advData = x[x.length - 1].split(" ").pop()
      let positionOfID= advData.indexOf(sensorID);
      let tempHex = advData.substring(positionOfID+14, positionOfID+18)
      let temp = parseInt('0x'+tempHex.match(/../g).reverse().join(''))/10;

      let pressHex = advData.substring(positionOfID+10, positionOfID+14)
      let press = parseInt('0x'+pressHex.match(/../g).reverse().join(''))/10;

      let humHex = advData.substring(positionOfID+18, positionOfID+22)
      let hum = parseInt('0x'+humHex.match(/../g).reverse().join(''))/10;

      let lightHex = advData.substring(positionOfID+6, positionOfID+10)
      let light = parseInt('0x'+lightHex.match(/../g).reverse().join(''));

      let co2Hex = advData.substring(positionOfID+38, positionOfID+42)
      let co2 = parseInt('0x'+co2Hex);
      

      return {
        'CO2' :co2,
        'Temp' :temp,
        'Pressure':press,
        'Humidity':hum,        
        'Light':light,        
      }
    })
  })
})



//pass data
document.getElementById('sendData').addEventListener('click', function(){
    const host = 'wss://mqtt.flespi.io:443'

    const options = {
      keepalive: 60,
      clientId: clientId,
      protocolId: 'MQTT',
      username:'eymVF39YbcQEqcuICINSkKlyqu3xs8kvwug2ngOoguRwx93ZHEFSeQgtb7Qr5YMs',
      password:'eymVF39YbcQEqcuICINSkKlyqu3xs8kvwug2ngOoguRwx93ZHEFSeQgtb7Qr5YMs',
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: 'HibouAirMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
      },
    }
    const client  = mqtt.connect(host, options)
    client.on('connect',()=>{
        console.log('connected mqtt client',clientId)

    })

    client.on('error', (err) => {
      console.log('Connection error: ', err)
      client.end()
    })

    client.on('reconnect', () => {
      console.log('Reconnecting...')
    })

    var topic = 'HibouAirTopic'

    // Publish
    setInterval(() => {

        getTheBLEData().then((x)=>{
          client.publish(topic, JSON.stringify(x), { qos: 0, retain: false })
        console.log("Message sent!", JSON.stringify(x));
        document.getElementById('output').innerHTML += JSON.stringify(x)+"<br>";
        })
      }, 5000);

    })