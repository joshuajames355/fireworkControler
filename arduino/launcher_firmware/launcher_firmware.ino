//all messages received 4 bytes long
//first byte, message type (1 for heartbeat, 2 for arm, 3 for disarm, 4 for fire)
//2nd byte, channel (1-16)
//3rd byte, parity?
//4th byte, 0 (EOF marker)

//responses are 1 byte
//lsb - 1 ack, 0 for error/resend
//2nd bit - 0 for disarmed, 1 for armed
//7th bit - 1 - magic number

uint8_t data[4] = {0,0,0,0};
uint8_t dataPointer = 0;

const uint8_t NUM_CHANNELS = 16; //this includes the arm/disarm pin
const uint8_t FIRING_DELAY_MS = 100; //the time, in ms, to hold a pin high when firing
const uint8_t ARM_PIN = 3;
const uint8_t CHANNEL_MAP[NUM_CHANNELS] = {ARM_PIN,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18}; //first is ARM/DISARM, then the channels in order

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600, SERIAL_7O1);

  for(int i = 0; i < NUM_CHANNELS; i ++){
      pinMode(CHANNEL_MAP[0], OUTPUT);
  }
}

void loop() {
  // put your main code here, to run repeatedly:
  if (Serial.available() > 0) {
    // read the incoming byte:
    data[dataPointer] = Serial.read();
    dataPointer += 1;
    if(dataPointer > 3 || data[dataPointer] == 0){ //process a message
      dataPointer = 0;
      processMessage();
    }
  }
}

void processMessage(){
  if(!checkParity(data)){
    sendError();
    return;
  }

  if(data[0] == 1){ //heartbeat
    sendAck();
    return;
  }
  else if(data[0] == 2){ //arm
    sendAck();
    digitalWrite(ARM_PIN, HIGH);
    return;
  }
  else if(data[0] == 3){ //disarm
    sendAck();
    digitalWrite(ARM_PIN, LOW);
    return;
  }
  else if(data[0] == 4 && data[2] > 0 && data[2] < NUM_CHANNELS){ //fire
    sendAck();
    digitalWrite(data[2], HIGH);
    delay(FIRING_DELAY_MS);
    digitalWrite(data[2], LOW);
    return;
  }

  sendError(); //unrecognized command, error
  return;
}

void sendAck()
{
  sendMsg(true);
}

void sendError()
{
  sendMsg(false);
}

void sendMsg(bool isValid){
  uint8_t msg = 64;
  if(isValid){
    msg += 1;
  }
  if(digitalRead(ARM_PIN)){
    msg += 2;
  }
  Serial.write(msg);
}

//true if has odd parity, false otherwise
bool checkParity(uint8_t x){
  x ^= x >> 4;
  x ^= x >> 2;
  x ^= x >> 1;
  return x & 1;
}