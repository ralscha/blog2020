package ch.rasc.websocket;

import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

import ch.rasc.protobuf.Calculator.Calculation;
import ch.rasc.protobuf.Calculator.Result;

public class CalculatorHandler extends BinaryWebSocketHandler {

  @Override
  protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message)
      throws Exception {

    Calculation calculation = Calculation.parseFrom(message.getPayload());

    Double result = null;
    switch (calculation.getOperation()) {
    case Addition:
      result = calculation.getValue1() + calculation.getValue2();
      break;
    case Subtraction:
      result = calculation.getValue1() - calculation.getValue2();
      break;
    case Multiplication:
      result = calculation.getValue1() * calculation.getValue2();
      break;
    case Division:
      result = calculation.getValue1() / calculation.getValue2();
      break;
    case UNRECOGNIZED:
      break;
    }

    if (result != null) {
      byte[] ba = Result.newBuilder().setResult(result).build().toByteArray();
      session.sendMessage(new BinaryMessage(ba));
    }

  }

}
