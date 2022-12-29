// all messages received 4 bytes long
// first byte, message type (1 for heartbeat, 2 for arm, 3 for disarm, 4 for fire)
// 2nd byte, channel (1-16)
// 3rd byte, parity?
// 4th byte, 0 (EOF marker)

// responses are 1 byte
// lsb - 1 ack, 0 for error/resend
// 2nd bit - 0 for disarmed, 1 for armed
// 3rd bit - 1 for parity error
// 7th bit - 1 - magic number

uint8_t data[4] = {0, 0, 0, 0};
uint8_t dataPointer = 0;

const uint8_t NUM_CHANNELS = 16;     // this includes the arm/disarm pin
const uint8_t FIRING_DELAY_MS = 100; // the time, in ms, to hold a pin high when firing
const uint8_t ARM_PIN = 13;
const uint8_t CHANNEL_MAP[NUM_CHANNELS] = {ARM_PIN, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18}; // first is ARM/DISARM, then the channels in order

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(9600, SERIAL_8N1);

  for (int i = 0; i < NUM_CHANNELS; i++)
  {
    pinMode(CHANNEL_MAP[0], OUTPUT);
  }
}

void loop()
{
  // put your main code here, to run repeatedly:
  while (Serial.available() > 0)
  {
    // read the incoming byte:
    uint8_t new_byte = Serial.read();
    data[dataPointer] = new_byte;
    dataPointer += 1;
    if (dataPointer > 3 || new_byte == 0)
    { // process a message
      if (dataPointer > 2) processMessage(); // the shortest valid message is 3 bytes (when the parity is 0)
      dataPointer = 0;
    }
  }
}

void processMessage()
{
  if (!checkParity(data))
  {
    sendParityError();
    return;
  }

  if (data[0] == 1)
  { // heartbeat
    sendAck();
    return;
  }
  else if (data[0] == 2)
  { // arm
    digitalWrite(ARM_PIN, HIGH);
    sendAck();
    return;
  }
  else if (data[0] == 3)
  { // disarm
    digitalWrite(ARM_PIN, LOW);
    sendAck();
    return;
  }
  else if (data[0] == 4 && data[2] > 0 && data[2] < NUM_CHANNELS)
  { // fire
    digitalWrite(data[2], HIGH);
    sendAck();
    delay(FIRING_DELAY_MS);
    digitalWrite(data[2], LOW);
    return;
  }

  sendError(); // unrecognized command, error
  return;
}

void sendAck()
{
  sendMsg(true, true);
}

void sendParityError()
{
  sendMsg(true, false);
}

void sendError()
{
  sendMsg(false, true);
}

void sendMsg(bool isValid, bool isParityValid)
{
  uint8_t msg = 64;
  if (isValid)
  {
    msg += 1;
  }
  if (digitalRead(ARM_PIN))
  {
    msg += 2;
  }
  if (!isParityValid)
  {
    msg += 4;
  }
  Serial.write(msg);
}

bool checkParity(uint8_t data[4])
{
  return (data[0] ^ data[1] ^ data[2] ^ data[3]) == 0;
}